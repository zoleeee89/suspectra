using Microsoft.Extensions.Logging;
#if ANDROID || IOS
using Plugin.AdMob;
using Plugin.AdMob.Configuration;
#endif

namespace Suspectra;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

#if ANDROID || IOS
		// UseAdMob also shows Google's consent form (GDPR) on first start; ads wait for the answer.
		AdConfig.UseTestAdUnitIds = AdUnits.UseTestAds;
		builder.UseAdMob();
#endif
		builder.Services.AddSingleton<AdService>();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
