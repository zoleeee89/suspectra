namespace Suspectra;

public partial class MainPage : ContentPage
{
	bool inGame;
	AdService? ads;

	public MainPage()
	{
		InitializeComponent();
	}

	// The ad service comes from the app's services, which are only reachable once the page has a handler.
	protected override void OnHandlerChanged()
	{
		base.OnHandlerChanged();
		if (ads != null || Handler?.MauiContext == null)
			return;

		ads = Handler.MauiContext.Services.GetService<AdService>();
		if (ads == null)
			return;
		ads.RewardReadyChanged += ready => SendRewardReady(ready);
		ads.InterstitialMissed += () => RunScript("Sus.ads.missed()");
		ads.RewardFinished += earned => RunScript($"Sus.ads.rewardDone({(earned ? "true" : "false")})");
	}

#if IOS
	bool trackingAsked;

	// Apple only shows the tracking question while the app is active and visible, so it waits for the page.
	// Saying no still shows ads, only not personalised ones.
	protected override async void OnAppearing()
	{
		base.OnAppearing();
		if (trackingAsked)
			return;
		trackingAsked = true;
		await Task.Delay(TimeSpan.FromSeconds(1));
		AppTrackingTransparency.ATTrackingManager.RequestTrackingAuthorization(_ => { });
	}
#endif

	// The pages report events the browser can't turn into haptics on every platform.
	private void OnRawMessageReceived(object? sender, HybridWebViewRawMessageReceivedEventArgs e)
	{
		if (e.Message == "screen:game" || e.Message == "screen:hub")
		{
			inGame = e.Message == "screen:game";
			// Every page load starts without knowing whether a rewarded ad is ready.
			SendRewardReady(ads?.RewardReady == true);
			RunScript($"Sus.ads.setPrivacyOptions({(ads?.PrivacyOptionsRequired == true ? "true" : "false")})");
		}
		else if (e.Message == "tap" && HapticFeedback.Default.IsSupported)
			MainThread.BeginInvokeOnMainThread(() => HapticFeedback.Default.Perform(HapticFeedbackType.Click));
		else if (e.Message == "error" && Vibration.Default.IsSupported)
			MainThread.BeginInvokeOnMainThread(() => Vibration.Default.Vibrate(TimeSpan.FromMilliseconds(120)));
		else if (e.Message == "win" && HapticFeedback.Default.IsSupported)
			MainThread.BeginInvokeOnMainThread(() => HapticFeedback.Default.Perform(HapticFeedbackType.LongPress));
		else if (e.Message == "ad:privacy")
			ads?.ShowPrivacyOptions();
		else if (e.Message.StartsWith("link:", StringComparison.Ordinal))
			OpenPage(e.Message);
		else if (e.Message == "ad:break")
			ads?.ShowInterstitial();
		else if (e.Message == "ad:reward")
		{
			if (ads == null)
				RunScript("Sus.ads.rewardDone(false)");
			else
				ads.ShowRewarded();
		}
	}

	static readonly string[] Pages = ["privacy", "support", "delete"];

	// "link:privacy:hu" opens the website's page in the browser; only the known pages and plain language codes pass.
	static void OpenPage(string message)
	{
		var parts = message.Split(':');
		if (parts.Length != 3 || !Pages.Contains(parts[1]) || parts[2].Length != 2 || !parts[2].All(char.IsAsciiLetterLower))
			return;
		MainThread.BeginInvokeOnMainThread(async () =>
		{
			try
			{
				await Launcher.Default.OpenAsync(new Uri($"https://suspectra.cointrail.hu/{parts[1]}.html?lang={parts[2]}"));
			}
			catch (Exception)
			{
				// No browser to open it with; nothing else to do.
			}
		});
	}

	void SendRewardReady(bool ready) => RunScript($"Sus.ads.setRewardReady({(ready ? "true" : "false")})");

	// A page that is still loading or has no Sus object simply ignores the call.
	void RunScript(string script)
	{
		MainThread.BeginInvokeOnMainThread(async () =>
		{
			try
			{
				await GameView.EvaluateJavaScriptAsync($"window.Sus && {script}");
			}
			catch (Exception)
			{
				// The page can be between two loads; the next screen message sends the state again.
			}
		});
	}

	// Android's back button goes back one screen inside the app, and only exits from the home screen.
	protected override bool OnBackButtonPressed()
	{
		if (!inGame)
			return base.OnBackButtonPressed();

		GameView.EvaluateJavaScriptAsync("Sus.goHub()");
		return true;
	}
}
