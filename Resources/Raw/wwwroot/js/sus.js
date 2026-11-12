// Services shared by every screen: storage, settings, language, sound, native bridge, ads.
// The native side calls Sus.ads.* and Sus.goHub(); keep those names.
window.Sus = (() => {
	'use strict';

	const APP_VERSION = '1.0';
	const SITE = 'https://suspectra.cointrail.hu';
	const PAGES = ['privacy', 'support', 'delete'];

	// Saves survive a restart when storage is available, but the game works without it.
	function load(key) {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch {
			return null;
		}
	}

	function store(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {
			// Storage can be off; the current session still works.
		}
	}

	const settings = (() => {
		const KEY = 'sus.settings';
		const DEFAULTS = { sound: true, haptics: true, language: null, rulesSeen: false };
		return {
			get: (name) => ({ ...DEFAULTS, ...load(KEY) })[name],
			set: (name, value) => store(KEY, { ...load(KEY), [name]: value })
		};
	})();

	const languages = Object.keys(window.SusStrings.names);

	function pickLanguage() {
		const saved = settings.get('language');
		if (languages.includes(saved)) return saved;
		const device = (navigator.languages ?? [navigator.language]).map((tag) => String(tag).slice(0, 2).toLowerCase());
		return device.find((code) => languages.includes(code)) ?? 'en';
	}

	let language = pickLanguage();
	document.documentElement.lang = language;

	function setLanguage(code) {
		if (!languages.includes(code)) return;
		settings.set('language', code);
		language = code;
		document.documentElement.lang = code;
	}

	function t(key, values = {}) {
		const text = window.SusStrings[language][key] ?? window.SusStrings.en[key] ?? key;
		return text.replace(/\{(\w+)\}/g, (_, name) => (values[name] ?? ''));
	}

	const HAPTIC_MESSAGES = ['tap', 'win', 'error'];

	function notifyNative(message) {
		if (HAPTIC_MESSAGES.includes(message) && !settings.get('haptics')) return;
		window.HybridWebView?.SendRawMessage(message);
	}

	function openPage(page) {
		if (!PAGES.includes(page)) return;
		if (window.HybridWebView) window.HybridWebView.SendRawMessage(`link:${page}:${language}`);
		else window.open(`${SITE}/${page}.html?lang=${language}`, '_blank', 'noopener');
	}

	// Short synthesized sounds, so the app ships no audio files.
	const audio = (() => {
		let context = null;

		function ensure() {
			if (!settings.get('sound')) return null;
			if (!context) {
				const Ctx = window.AudioContext || window.webkitAudioContext;
				if (Ctx) context = new Ctx();
			}
			context?.resume?.();
			return context;
		}

		function tone(type, from, to, seconds, volume, delay = 0) {
			const ctx = ensure();
			if (!ctx) return;
			const at = ctx.currentTime + delay;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = type;
			osc.frequency.setValueAtTime(from, at);
			osc.frequency.exponentialRampToValueAtTime(to, at + seconds);
			gain.gain.setValueAtTime(volume, at);
			gain.gain.exponentialRampToValueAtTime(0.001, at + seconds);
			osc.connect(gain).connect(ctx.destination);
			osc.start(at);
			osc.stop(at + seconds);
		}

		return {
			place: () => tone('triangle', 520, 660, 0.09, 0.08),
			mark: () => tone('sine', 300, 260, 0.06, 0.05),
			error: () => tone('square', 180, 120, 0.18, 0.05),
			stamp: () => {
				tone('triangle', 140, 60, 0.25, 0.2);
				tone('sine', 660, 990, 0.25, 0.06, 0.15);
				tone('sine', 880, 1320, 0.35, 0.06, 0.3);
			}
		};
	})();

	// UTC day, so the daily case changes at the same moment for everyone.
	function today(date = new Date()) {
		return date.toISOString().slice(0, 10);
	}

	// The page decides when a full-screen ad is due; the native side only shows what it has loaded.
	const ads = (() => {
		const KEY = 'sus.ads';
		const FREE_BREAKS = 3;
		const EVERY = 3;
		const GAP_MS = 150000;
		let rewardReady = false;
		let pendingReward = null;
		let privacyOptions = false;

		function state() {
			const saved = load(KEY);
			return { breaks: 0, lastAt: 0, owed: false, ...(saved && typeof saved === 'object' ? saved : {}) };
		}

		function breakPoint() {
			const s = state();
			s.breaks++;
			const turn = s.owed || s.breaks % EVERY === 0;
			if (s.breaks > FREE_BREAKS && turn && Date.now() - s.lastAt >= GAP_MS) {
				s.lastAt = Date.now();
				s.owed = false;
				notifyNative('ad:break');
			} else if (s.breaks > FREE_BREAKS && turn) {
				s.owed = true;
			}
			store(KEY, s);
		}

		function missed() {
			const s = state();
			s.owed = true;
			s.lastAt = 0;
			store(KEY, s);
		}

		function reward(done) {
			if (!rewardReady) return done(false);
			pendingReward = done;
			notifyNative('ad:reward');
		}

		function rewardDone(earned) {
			const done = pendingReward;
			pendingReward = null;
			if (earned) store(KEY, { ...state(), lastAt: Date.now() });
			done?.(!!earned);
		}

		return {
			breakPoint,
			missed,
			reward,
			rewardDone,
			setRewardReady: (ready) => { rewardReady = !!ready; },
			rewardReady: () => rewardReady,
			setPrivacyOptions: (needed) => { privacyOptions = !!needed; window.dispatchEvent(new Event('sus:privacy')); },
			privacyOptions: () => privacyOptions,
			showPrivacy: () => notifyNative('ad:privacy')
		};
	})();

	// Android back button: the app decides what "back" means on the current screen.
	let backHandler = null;

	function goHub() {
		if (backHandler) backHandler();
	}

	function setScreen(inner, onBack) {
		backHandler = onBack;
		notifyNative(inner ? 'screen:game' : 'screen:hub');
	}

	return { APP_VERSION, load, store, settings, languages, t, setLanguage, language: () => language, notifyNative, openPage, audio, today, ads, goHub, setScreen };
})();
