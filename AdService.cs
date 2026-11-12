#if ANDROID || IOS
using Plugin.AdMob;
using Plugin.AdMob.Services;
#endif

namespace Suspectra;

// Debug builds show Google's test ads, Release builds the app's own AdMob units.
// Never tap a real ad on your own phone: AdMob can close the account for it.
static class AdUnits
{
#if DEBUG
	public const bool UseTestAds = true;
#else
	public const bool UseTestAds = false;
#endif

#if ANDROID
	// Still Google's test units: add the Android app in AdMob and put its units here.
	public const string Interstitial = "ca-app-pub-3940256099942544/1033173712";
	public const string Rewarded = "ca-app-pub-3940256099942544/5224354917";
#elif IOS
	// Still Google's test units: add the iOS app in AdMob and put its units here.

	public const string Interstitial = "ca-app-pub-3940256099942544/4411468910";
	public const string Rewarded = "ca-app-pub-3940256099942544/1712485313";
#endif
}

// Keeps one full-screen and one rewarded ad loaded, so they appear without a wait.
// The web pages decide when an ad is due; this class only shows what it already has.
sealed class AdService
{
	static readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(30);

	// Google drops a loaded full-screen ad after about an hour; an older one is replaced instead of shown.
	static readonly TimeSpan MaxAdAge = TimeSpan.FromMinutes(50);

	// Tells the page that a due full-screen ad could not be shown, so the next pause can try again.
	public event Action? InterstitialMissed;

	// Tells the page whether the "continue with an ad" button can be shown.
	public event Action<bool>? RewardReadyChanged;

	// Reports the end of a rewarded ad: true only when the reward was earned.
	public event Action<bool>? RewardFinished;

	public bool RewardReady { get; private set; }

#if ANDROID || IOS
	readonly IInterstitialAdService interstitials;
	readonly IRewardedAdService rewardeds;
	readonly IAdConsentService consent;
	IInterstitialAd? interstitial;
	IRewardedAd? rewarded;
	DateTime interstitialLoadedAt;
	DateTime rewardedLoadedAt;
	bool rewardEarned;

	public AdService(IInterstitialAdService interstitials, IRewardedAdService rewardeds, IAdConsentService consent)
	{
		this.interstitials = interstitials;
		this.rewardeds = rewardeds;
		this.consent = consent;
		OnMain(LoadInterstitial);
		OnMain(LoadRewarded);
	}

	// The web page's messages arrive on a WebView background thread, but the Google SDK
	// only accepts calls from the main UI thread (otherwise: "#008 Must be called on the main UI thread").
	public void ShowInterstitial() => OnMain(ShowInterstitialOnMain);

	public void ShowRewarded() => OnMain(ShowRewardedOnMain);

	// Google requires a way to change the ad consent later wherever it asked for it (EU, UK, some US states).
	public bool PrivacyOptionsRequired => consent.IsPrivacyOptionsRequired();

	public void ShowPrivacyOptions() => OnMain(() => consent.ShowPrivacyOptionsForm());

	void ShowInterstitialOnMain()
	{
		if (interstitial?.IsLoaded == true && DateTime.UtcNow - interstitialLoadedAt < MaxAdAge)
		{
			interstitial.Show();
			return;
		}
		if (interstitial?.IsLoaded == true)
			LoadInterstitial(); // expired: fetch a fresh one for the next pause
		InterstitialMissed?.Invoke();
	}

	void ShowRewardedOnMain()
	{
		if (rewarded?.IsLoaded == true && DateTime.UtcNow - rewardedLoadedAt >= MaxAdAge)
		{
			SetRewardReady(false);
			LoadRewarded();
		}
		if (rewarded?.IsLoaded != true)
		{
			RewardFinished?.Invoke(false);
			return;
		}
		rewardEarned = false;
		SetRewardReady(false);
		rewarded.Show();
	}

	void LoadInterstitial()
	{
		var ad = interstitials.CreateAd(AdUnits.Interstitial);
		ad.OnAdDismissed += (_, _) => OnMain(LoadInterstitial);
		ad.OnAdFailedToShow += (_, _) => OnMain(LoadInterstitial);
		ad.OnAdFailedToLoad += (_, _) => RetryLater(LoadInterstitial);
		interstitial = ad;
		interstitialLoadedAt = DateTime.UtcNow; // the load itself takes only seconds
		ad.Load();
	}

	// The reward is granted only from OnUserEarnedReward; closing the ad early earns nothing.
	void LoadRewarded()
	{
		var ad = rewardeds.CreateAd(AdUnits.Rewarded);
		ad.OnAdLoaded += (_, _) => OnMain(() =>
		{
			rewardedLoadedAt = DateTime.UtcNow;
			SetRewardReady(true);
		});
		ad.OnUserEarnedReward += (_, _) => OnMain(() => rewardEarned = true);
		ad.OnAdDismissed += (_, _) => OnMain(() =>
		{
			RewardFinished?.Invoke(rewardEarned);
			LoadRewarded();
		});
		ad.OnAdFailedToShow += (_, _) => OnMain(() =>
		{
			RewardFinished?.Invoke(false);
			LoadRewarded();
		});
		ad.OnAdFailedToLoad += (_, _) => RetryLater(LoadRewarded);
		rewarded = ad;
		ad.Load();
	}

	static void OnMain(Action action) => MainThread.BeginInvokeOnMainThread(action);

	// No network or no ad to fill: try again a little later instead of in a tight loop.
	static void RetryLater(Action load)
	{
		Task.Delay(RetryDelay).ContinueWith(_ => OnMain(load));
	}

	void SetRewardReady(bool ready)
	{
		RewardReady = ready;
		RewardReadyChanged?.Invoke(ready);
	}
#else
	// Windows and Mac Catalyst have no AdMob; the pages simply never see an ad.
	public void ShowInterstitial()
	{
	}

	public void ShowRewarded() => RewardFinished?.Invoke(false);

	public bool PrivacyOptionsRequired => false;

	public void ShowPrivacyOptions()
	{
	}
#endif
}
