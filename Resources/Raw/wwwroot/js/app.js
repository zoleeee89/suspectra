// Suspectra – screens and game play.
(() => {
	'use strict';

	const R = window.SusRules, A = window.SusArt, S = window.Sus;
	const t = (k, v) => S.t(k, v);
	const app = document.getElementById('app');

	const ICON = {
		back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
		timer: '<svg viewBox="0 0 24 24" fill="none" stroke="#F1D58A" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
		flame: '<svg viewBox="0 0 24 24" fill="none" stroke="#F1D58A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/></svg>',
		pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
		pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z"/><path d="M14 6.6l3.4 3.4"/></svg>',
		eraser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H9L4 15l9-9 7 7-5 5M7 12l5 5"/></svg>',
		hint: '<svg viewBox="0 0 24 24" fill="none" stroke="#F1D58A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"/></svg>',
		accuse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6zM9 13l2 2 4-4"/></svg>',
		search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/></svg>',
		folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
		gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
		check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6"/></svg>',
		arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
		lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B9C4BE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
		mag: '<svg viewBox="0 0 24 24" fill="rgba(214,174,90,0.28)" stroke="#D9B25E" stroke-width="1.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21" fill="none"/></svg>',
		x: '<svg class="x" viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" stroke="rgba(255,250,235,0.9)" stroke-width="5.4"/><path d="M6 6l12 12M18 6L6 18" stroke="#1A120C" stroke-width="2.8"/></svg>',
		magSmall: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B1612" stroke-width="2.4" stroke-linecap="round"><circle cx="13.5" cy="9.5" r="6"/><path d="M9 14l-6 6"/></svg>'
	};

	const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

	// ---------- progress ----------

	const PKEY = 'sus.progress';
	const prog = () => {
		const p = S.load(PKEY);
		return p && typeof p === 'object' ? { solved: p.solved || {}, saved: p.saved || {} } : { solved: {}, saved: {} };
	};
	const saveProg = (p) => S.store(PKEY, p);

	// ---------- cases ----------

	const FILES = 30;
	const LEVEL_OF = { e: 'easy', m: 'medium', h: 'hard' };
	const PREFIX = { easy: 'e', medium: 'm', hard: 'h' };
	const EPOCH = Date.UTC(2026, 0, 1);

	function caseInfo(id) {
		if (id.startsWith('d-')) {
			const day = id.slice(2);
			return { id, level: 'medium', daily: true, day, no: Math.floor((Date.parse(day) - EPOCH) / 864e5) + 1 };
		}
		const [k, i] = id.split('-');
		return { id, level: LEVEL_OF[k], index: +i, prefix: k, no: { e: 0, m: 100, h: 200 }[k] + +i };
	}

	const cache = new Map();
	function puzzle(id) {
		if (!cache.has(id)) cache.set(id, R.generate(id, caseInfo(id).level));
		return cache.get(id);
	}

	const keyOf = (pz, p) => (p === pz.n - 1 ? 'victim' : pz.suspects[p]);
	const nameOf = (key) => t('name_' + key);
	const objOf = (key) => [t('art_' + key), t('name_' + key)].filter(Boolean).join(' ');
	const subjOf = (key) => { const s = objOf(key); return s.charAt(0).toUpperCase() + s.slice(1); };
	const roomName = (type) => t('room_' + type);

	function caseTitle(pz) {
		const place = t('place_' + pz.place);
		return t('title', { place, event: t('event_' + pz.event), Art: /^[AÁEÉIÍOÓÖŐUÚÜŰ]/i.test(place) ? 'Az' : 'A' });
	}

	const clock = (pz) => `${pz.hour}:${String(pz.minute).padStart(2, '0')}`;

	function clueText(pz, c) {
		const v = { P: subjOf(keyOf(pz, c.p)), q: c.q != null ? objOf(keyOf(pz, c.q)) : '' };
		if (c.r != null) v.in = t('in_' + pz.rooms[c.r]);
		if (c.t === 'on') v.on = t('on_' + c.item);
		if (c.t === 'beside') v.near = t('near_' + c.item);
		if (c.k != null) {
			const k = c.k + 1;
			v.k = k;
			v.nth = (k === 1 || k === 5 ? 'az ' : 'a ') + k + '.';
		}
		return t('c_' + c.t, v);
	}

	function streak() {
		const solved = prog().solved;
		const day = new Date();
		if (!solved['d-' + S.today(day)]) day.setUTCDate(day.getUTCDate() - 1);
		let n = 0;
		while (solved['d-' + S.today(day)]) {
			n++;
			day.setUTCDate(day.getUTCDate() - 1);
		}
		return n;
	}

	// ---------- shared pieces ----------

	function toast(text) {
		app.querySelector('.toast')?.remove();
		const el = document.createElement('div');
		el.className = 'toast';
		el.setAttribute('role', 'status');
		el.textContent = text;
		app.appendChild(el);
		setTimeout(() => el.remove(), 2700);
	}

	function face(key, size) {
		if (key === 'victim') return `<span style="width:${size}px;height:${size}px">${A.chalk(size * 0.8)}</span>`;
		return `<span style="width:${size}px;height:${size}px;background:${A.tokenBg(key)}">${A.portrait(key, size)}</span>`;
	}

	function nav(on) {
		const b = (id, icon, label) => `<button type="button" data-act="nav" data-to="${id}" class="${on === id ? 'on' : ''}">${ICON[icon]}${esc(t(label))}</button>`;
		return `<nav class="nav" aria-label="Menu">${b('home', 'search', 'navInvestigate')}${b('cases', 'folder', 'navCases')}${b('settings', 'gear', 'navSettings')}</nav>`;
	}

	const FLOOR_SOLID = { salon: '#DDAE72', kitchen: '#D0744E', library: '#85553A', hall: '#E4DCCB', dining: '#B03A3C', study: '#B48555', garden: '#6FB159' };

	function miniMap(pz, size = 84) {
		const n = pz.n;
		let cells = '';
		for (let c = 0; c < n * n; c++) {
			const block = pz.kind[c] === 'block';
			cells += `<i style="background:${FLOOR_SOLID[pz.rooms[pz.room[c]]]};${block ? 'box-shadow: inset 0 0 0 40px rgba(27,22,18,0.35)' : ''}"></i>`;
		}
		return `<div class="mini" aria-hidden="true" style="width:${size}px;height:${size}px;grid-template-columns:repeat(${n},1fr)">${cells}</div>`;
	}

	// ---------- screens ----------

	let screen = 'home';
	let casesTab = 'easy';
	let game = null;
	let ticker = null;

	function go(to, arg) {
		stopClock();
		screen = to;
		app.querySelector('.overlay')?.remove();
		if (to === 'home') renderHome();
		else if (to === 'cases') renderCases();
		else if (to === 'settings') renderSettings();
		else if (to === 'board') openCase(arg);
		else if (to === 'verdict') renderVerdict(arg);
	}

	function renderHome() {
		S.setScreen(false, null);
		const id = 'd-' + S.today();
		const info = caseInfo(id);
		const pz = puzzle(id);
		const p = prog();
		const solved = p.solved[id];
		const saved = p.saved[id];
		const placed = saved ? saved.cells.filter((c) => c.p >= 0).length : 0;
		const stamp = solved ? `<div class="stamp green">${esc(t('stampSolved'))}</div>` : saved ? `<div class="stamp">${esc(t('inProgress'))}</div>` : `<div class="stamp">${esc(t('stampNew'))}</div>`;
		const st = streak();
		app.innerHTML = `<section class="screen">
			<div class="scroll">
				<div class="home-top">
					<div class="logo gold-text">SUSPECTRA</div>
					${st > 0 ? `<div class="pill">${ICON.flame}${esc(t('streak', { n: st }))}</div>` : ''}
				</div>
				<div class="tagline">${esc(t('tagline'))}</div>
				<div class="label-mono" style="margin:26px 22px 0">${esc(t('todayCase'))}</div>
				<div class="case-card paper">
					<div class="tape" aria-hidden="true"></div>
					<div class="case-row"><div class="case-no">${esc(t('caseNo', { n: info.no }))}</div>${stamp}</div>
					<div class="big-title">${esc(caseTitle(pz))}</div>
					<div class="sub-mono">${esc(t('caseSub', { time: clock(pz), n: pz.n - 1 }))}</div>
					<div class="case-row" style="margin-top:16px;align-items:center">
						<div class="facts">
							<div><span>${esc(t('lblGrid'))}</span>${pz.n} × ${pz.n}</div>
							<div><span>${esc(t('lblLevel'))}</span>${esc(t('level_' + pz.level))}</div>
							<div><span>${esc(t('lblClues'))}</span>${pz.clues.length}</div>
						</div>
						${miniMap(pz)}
					</div>
					${saved && !solved ? `<div class="progress"><div class="progress-row"><span>${esc(t('placed', { a: placed, b: pz.n }))}</span><span>${Math.round((placed / pz.n) * 100)}%</span></div><div class="bar"><i style="width:${(placed / pz.n) * 100}%"></i></div></div>` : ''}
					${solved
						? `<div class="done-note">${esc(t('dailyDone'))}</div><button type="button" class="btn-red btn-wide card-btn" data-act="nav" data-to="cases">${esc(t('openCases'))}${ICON.arrow}</button>`
						: `<button type="button" class="btn-red btn-wide card-btn" data-act="open" data-id="${id}">${esc(t(saved ? 'continue' : 'start'))}${ICON.arrow}</button>`}
				</div>
				<div class="section-title" style="margin-top:30px"><span class="label gold-text">${esc(t('lblSuspects').toUpperCase())}</span><span class="line"><i></i><b></b></span><span class="side">${esc(t('suspectsCount', { n: pz.n - 1 }))}</span></div>
				<div class="faces">${pz.suspects.map((k) => `<div class="face"><div class="chip-face">${face(k, 48)}</div><div>${esc(nameOf(k))}</div></div>`).join('')}</div>
				<div style="height:24px"></div>
			</div>
			${nav('home')}
		</section>`;
	}

	function renderCases() {
		S.setScreen(true, () => go('home'));
		const p = prog();
		const solvedFiles = Object.keys(p.solved).filter((k) => !k.startsWith('d-')).length;
		// Monday-based current week (UTC)
		const now = new Date();
		const dow = (now.getUTCDay() + 6) % 7;
		const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dow));
		const names = t('days').split(',');
		let weekDone = 0;
		const days = names.map((label, i) => {
			const d = new Date(monday);
			d.setUTCDate(monday.getUTCDate() + i);
			const key = S.today(d);
			const done = !!p.solved['d-' + key];
			if (done) weekDone++;
			const isToday = i === dow, future = i > dow;
			const inner = done ? ICON.check.replace('<svg', '<svg width="18" height="18"') : isToday ? String(d.getUTCDate()) : '';
			return `<button type="button" class="wday" style="border:0;background:none" data-act="open" data-id="d-${key}" ${future ? 'disabled' : ''} aria-label="${key}">
				<span>${esc(label)}</span><span class="wdot ${done ? 'done' : ''} ${isToday ? 'today' : ''}">${inner}</span></button>`;
		}).join('');

		const pre = PREFIX[casesTab];
		let files = '';
		for (let i = 1; i <= FILES; i++) {
			const id = `${pre}-${i}`;
			const info = caseInfo(id);
			const solved = p.solved[id];
			const unlocked = i === 1 || !!p.solved[`${pre}-${i - 1}`] || !!p.saved[id];
			const dots = { easy: '●○○', medium: '●●○', hard: '●●●' }[casesTab];
			let right = '';
			if (solved) right = `<span class="stars-small" aria-label="${solved.stars}/3">${'★'.repeat(solved.stars)}${'☆'.repeat(3 - solved.stars)}</span>`;
			else if (p.saved[id]) right = `<span class="stamp" style="color:#E8604C;border-color:#E8604C">${esc(t('inProgress'))}</span>`;
			else if (!unlocked) right = ICON.lock;
			// Titles need the generated case; only build the ones the player can open.
			const title = unlocked ? esc(caseTitle(puzzle(id))) : esc(t('locked'));
			const n = R.LEVELS[casesTab].n;
			files += `<li><button type="button" class="file" data-act="open" data-id="${id}" ${unlocked ? '' : 'disabled'}>
				<span class="file-tab">${esc(t('caseNo', { n: info.no }))}</span>
				<span style="min-width:0"><span class="file-title" style="display:block">${title}</span>
				<span class="file-meta"><span>${n} × ${n}</span><b>${dots}</b></span></span>${right}</button></li>`;
			if (!unlocked) break;
		}

		app.innerHTML = `<section class="screen">
			<div class="scroll">
				<div class="page-title">${esc(t('casesTitle'))}</div>
				<div class="page-sub">${esc(t('casesSub', { done: solvedFiles, total: FILES * 3 }))}</div>
				<div class="week">
					<div class="week-head"><span class="label-mono">${esc(t('thisWeek'))}</span><span>${esc(t('weekDone', { n: weekDone }))}</span></div>
					<div class="week-days">${days}</div>
				</div>
				<div class="tabs" role="tablist">${['easy', 'medium', 'hard'].map((l) => `<button type="button" role="tab" aria-selected="${l === casesTab}" class="tab ${l === casesTab ? 'on' : ''}" data-act="tab" data-level="${l}">${esc(t('level_' + l))}</button>`).join('')}</div>
				<ul class="files">${files}</ul>
			</div>
			${nav('cases')}
		</section>`;
	}

	function renderSettings() {
		S.setScreen(true, () => go('home'));
		const lang = S.language();
		const toggle = (name) => {
			const on = S.settings.get(name);
			return `<button type="button" class="row" data-act="toggle" data-name="${name}" aria-pressed="${on}"><span>${esc(t(name))}</span><span class="seg"><span class="tab ${on ? 'on' : ''}" style="height:30px;display:inline-flex;align-items:center">${esc(t(on ? 'on' : 'off'))}</span></span></button>`;
		};
		app.innerHTML = `<section class="screen">
			<div class="scroll">
				<div class="page-title">${esc(t('settingsTitle'))}</div>
				<div class="settings">
					<div class="row"><span>${esc(t('language'))}</span><span class="seg">${S.languages.map((l) => `<button type="button" class="${l === lang ? 'on' : ''}" data-act="lang" data-lang="${l}">${esc(window.SusStrings.names[l])}</button>`).join('')}</span></div>
					${toggle('sound')}
					${toggle('haptics')}
					<button type="button" class="row" data-act="rules"><span>${esc(t('howTo'))}</span>${ICON.arrow.replace('<svg', '<svg width="20" height="20"')}</button>
					<button type="button" class="row" data-act="page" data-page="privacy"><span>${esc(t('privacy'))}</span>${ICON.arrow.replace('<svg', '<svg width="20" height="20"')}</button>
					<button type="button" class="row" data-act="page" data-page="support"><span>${esc(t('support'))}</span>${ICON.arrow.replace('<svg', '<svg width="20" height="20"')}</button>
					${S.ads.privacyOptions() ? `<button type="button" class="row" data-act="adprivacy"><span>${esc(t('adPrivacy'))}</span>${ICON.arrow.replace('<svg', '<svg width="20" height="20"')}</button>` : ''}
					<div class="row"><span>${esc(t('version'))}</span><small>${S.APP_VERSION}</small></div>
				</div>
			</div>
			${nav('settings')}
		</section>`;
	}

	function showRules(after) {
		const el = document.createElement('div');
		el.className = 'overlay';
		el.innerHTML = `<div class="sheet paper" role="dialog" aria-modal="true" aria-label="${esc(t('rulesTitle'))}">
			<h3>${esc(t('rulesTitle'))}</h3>
			<ol><li>${esc(t('rule1'))}</li><li>${esc(t('rule2'))}</li><li>${esc(t('rule3'))}</li><li>${esc(t('rule4'))}</li></ol>
			<p>${esc(t('ruleTools'))}</p>
			<button type="button" class="btn-red" data-act="closeOverlay">${esc(t('gotIt'))}</button>
		</div>`;
		el._after = after;
		app.appendChild(el);
		S.settings.set('rulesSeen', true);
	}

	// ---------- the board ----------

	function openCase(id) {
		app.innerHTML = `<section class="screen"><div class="loading">${ICON.search}<span>${esc(t('generating'))}</span></div></section>`;
		// Let the loading screen paint before a hard case is generated.
		setTimeout(() => {
			const pz = puzzle(id);
			const saved = prog().saved[id];
			const n = pz.n;
			game = {
				id, info: caseInfo(id), pz,
				cells: saved?.cells?.length === n * n ? saved.cells : Array.from({ length: n * n }, () => ({ p: -1, x: false, notes: [] })),
				sel: -1, tool: 'pen',
				elapsed: saved?.elapsed ?? 0, hints: saved?.hints ?? 0, mistakes: saved?.mistakes ?? 0,
				resumeAt: Date.now()
			};
			renderBoard();
			if (!S.settings.get('rulesSeen')) showRules();
		}, 30);
	}

	const elapsed = () => game.elapsed + (game.resumeAt ? Date.now() - game.resumeAt : 0);
	const mmss = (ms) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

	function startClock() {
		stopClock();
		game.resumeAt = Date.now();
		ticker = setInterval(() => {
			const el = document.getElementById('timer');
			if (el) el.textContent = mmss(elapsed());
		}, 1000);
	}

	function stopClock() {
		if (ticker) clearInterval(ticker);
		ticker = null;
		if (game && game.resumeAt) {
			game.elapsed = elapsed();
			game.resumeAt = 0;
		}
	}

	function persist() {
		const p = prog();
		p.saved[game.id] = { cells: game.cells, elapsed: elapsed(), hints: game.hints, mistakes: game.mistakes };
		saveProg(p);
	}

	const positions = () => {
		const pos = new Array(game.pz.n).fill(-1);
		game.cells.forEach((c, i) => { if (c.p >= 0) pos[c.p] = i; });
		return pos;
	};

	// The board takes what is left after the header, tray, a few clues and the toolbar.
	function cellSize(n) {
		const byWidth = Math.min(app.clientWidth || 390, 520) - 46;
		const byHeight = (app.clientHeight || 844) - 420;
		return Math.max(30, Math.floor(Math.min(byWidth, byHeight, 360) / n));
	}

	function boardStatic(pz, s) {
		const n = pz.n;
		const room = (y, x) => (y < 0 || y >= n || x < 0 || x >= n ? null : pz.room[y * n + x]);
		let floors = '';
		for (let y = 0; y < n; y++) {
			for (let x = 0; x < n; x++) {
				const c = y * n + x, ro = pz.room[c];
				const wall = (nb) => nb !== null && nb !== ro;
				const tw = wall(room(y - 1, x)), lw = wall(room(y, x - 1)), rw = wall(room(y, x + 1)), bw = wall(room(y + 1, x));
				const sh = [];
				if (tw || y === 0) sh.push('inset 0 7px 7px -5px rgba(0,0,0,0.5)');
				if (lw || x === 0) sh.push('inset 7px 0 7px -5px rgba(0,0,0,0.45)');
				if (rw || x === n - 1) sh.push('inset -4px 0 5px -4px rgba(0,0,0,0.3)');
				const b = '2.5px solid #2A180C';
				floors += `<div class="floor-cell" style="height:${s}px;background:${A.floor(pz.rooms[ro], s)};border-top:${tw ? b : 0};border-left:${lw ? b : 0};border-right:${rw ? b : 0};border-bottom:${bw ? b : 0};box-shadow:${sh.join(',') || 'none'}"></div>`;
			}
		}
		const furn = pz.items.map((it) => `<div class="furn" style="left:${it.x * s}px;top:${it.y * s}px">${A.item(it, pz.rooms[it.room], s)}</div>`).join('');
		return `<div class="layer grid" style="width:${n * s}px;grid-template-columns:repeat(${n},1fr)">${floors}</div>${furn}<div class="layer light" style="width:${n * s}px;height:${n * s}px"></div>`;
	}

	// One label per room, on a low free square, never right beside another label.
	function labelCells(pz) {
		const n = pz.n, out = {};
		pz.rooms.forEach((type, ri) => {
			const cells = [];
			for (let c = 0; c < n * n; c++) if (pz.room[c] === ri) cells.push(c);
			const score = (c) => (pz.kind[c] === 'free' ? 1000 : pz.kind[c] === 'block' ? 0 : 500) + ((c / n) | 0) * 10 - (c % n);
			cells.sort((a, b) => score(b) - score(a));
			const clear = (c) => !(c % n > 0 && out[c - 1]) && !(c % n < n - 1 && out[c + 1]);
			const best = cells.find(clear) ?? cells[0];
			if (best != null) out[best] = roomName(type).toUpperCase();
		});
		return out;
	}

	function marksHTML() {
		const { pz, cells } = game;
		const n = pz.n, s = game.s;
		const labels = game.labels;
		const v = n - 1;
		const rowCount = new Array(n).fill(0), colCount = new Array(n).fill(0);
		cells.forEach((c, i) => { if (c.p >= 0) { rowCount[(i / n) | 0]++; colCount[i % n]++; } });
		const tok = Math.round(s * 0.84);
		let html = '';
		cells.forEach((c, i) => {
			const y = (i / n) | 0, x = i % n;
			const conflict = c.p >= 0 && (rowCount[y] > 1 || colCount[x] > 1);
			let inner = '', label = `${roomName(pz.rooms[pz.room[i]])}, ${y + 1}/${x + 1}`;
			if (c.p === v) { inner = `<span class="chalk-wrap">${A.chalk(Math.round(s * 0.9))}</span>`; label += ', ' + t('victimLabel'); }
			else if (c.p >= 0) {
				const key = pz.suspects[c.p];
				inner = `<span class="token"><span class="token-in" style="width:${tok - 4}px;height:${tok - 4}px;background:${A.tokenBg(key)}">${A.portrait(key, tok - 4)}</span></span>`;
				label += ', ' + nameOf(key);
			} else if (c.x) { inner = ICON.x; label += ', X'; }
			if (c.p < 0 && c.notes.length) {
				inner += `<span class="notes">${c.notes.map((p) => (p === v ? '<i class="note-dot v"></i>' : `<i class="note-dot" style="background:${A.colour(pz.suspects[p])}"></i>`)).join('')}</span>`;
			}
			if (labels[i]) inner += `<span class="room-label ${x === 0 ? 'l' : x === n - 1 ? 'r' : ''}">${esc(labels[i])}</span>`;
			html += `<button type="button" class="cell ${conflict ? 'conflict' : ''}" style="height:${s}px" data-act="cell" data-c="${i}" aria-label="${esc(label)}">${inner}</button>`;
		});
		return html;
	}

	function trayHTML() {
		const { pz } = game;
		const pos = positions();
		const size = Math.min(48, Math.floor(((app.clientWidth || 390) - 40) / pz.n) - 14);
		let out = '';
		for (let p = 0; p < pz.n; p++) {
			const key = keyOf(pz, p);
			out += `<button type="button" class="chip ${key === 'victim' ? 'victim' : ''} ${pos[p] >= 0 ? 'placed' : ''} ${game.sel === p ? 'active' : ''}" data-act="pick" data-p="${p}" aria-pressed="${game.sel === p}">
				<span class="chip-face">${face(key, size)}</span><span class="chip-name">${esc(key === 'victim' ? t('victimLabel') : nameOf(key))}</span></button>`;
		}
		return out;
	}

	function cluesHTML() {
		const { pz } = game;
		const pos = positions();
		return pz.clues.map((c) => {
			const st = R.clueStatus(pz, c, pos);
			const cls = st === true ? 'ok' : st === false ? 'bad' : '';
			const mark = st === true ? `<span style="color:#A8261A;width:22px;height:22px;display:flex">${ICON.check}</span>` : '<span class="ring"></span>';
			return `<li class="clue ${cls}"><span class="mark">${mark}</span><span class="text">${esc(clueText(pz, c))}</span></li>`;
		}).join('');
	}

	function renderBoard() {
		const { pz, info } = game;
		const n = pz.n;
		game.s = cellSize(n);
		game.labels = labelCells(pz);
		S.setScreen(true, () => leaveBoard());
		const s = game.s;
		app.innerHTML = `<section class="screen">
			<div class="topbar">
				<button type="button" class="round-btn" data-act="leave" aria-label="${esc(t('backHome'))}">${ICON.back}</button>
				<div class="case-head"><span class="ribbon">${esc(t('caseNo', { n: info.no }))}</span><div class="case-title gold-text">${esc(caseTitle(pz))}</div></div>
				<div class="pill">${ICON.timer}<span id="timer">${mmss(elapsed())}</span></div>
			</div>
			<div class="board-frame"><div class="board" id="board" style="width:${n * s}px;height:${n * s}px">
				${boardStatic(pz, s)}
				<div class="layer grid" id="marks" style="width:${n * s}px;grid-template-columns:repeat(${n},1fr)">${marksHTML()}</div>
			</div></div>
			<div class="section-title"><span class="label gold-text">${esc(t('lblSuspects').toUpperCase())}</span><span class="line"><i></i><b></b></span><span class="side" id="placed"></span></div>
			<div class="tray" id="tray">${trayHTML()}</div>
			<div class="clue-card paper">
				<div class="clue-head"><span>${ICON.magSmall}${esc(t('clues'))}</span><span id="clueCount"></span></div>
				<div class="clue-rule"></div>
				<ul class="clue-list" id="clues">${cluesHTML()}</ul>
			</div>
			<div class="toolbar">
				<div class="tools" role="group">
					${['pen', 'pencil', 'eraser'].map((tl) => `<button type="button" class="tool ${game.tool === tl ? 'on' : ''}" data-act="tool" data-tool="${tl}" aria-pressed="${game.tool === tl}">${ICON[tl]}${esc(t(tl))}</button>`).join('')}
					<button type="button" class="tool" data-act="hint">${ICON.hint}${esc(t('hint'))}</button>
				</div>
				<button type="button" class="btn-red" data-act="accuse">${ICON.accuse}${esc(t('accuse'))}</button>
			</div>
		</section>`;
		refreshCounts();
		startClock();
	}

	function refreshCounts() {
		const pos = positions();
		const placed = pos.filter((c) => c >= 0).length;
		const okClues = game.pz.clues.filter((c) => R.clueStatus(game.pz, c, pos) === true).length;
		const pl = document.getElementById('placed');
		if (pl) pl.textContent = t('placed', { a: placed, b: game.pz.n });
		const cc = document.getElementById('clueCount');
		if (cc) cc.textContent = `${okClues} / ${game.pz.clues.length}`;
	}

	function refreshBoard() {
		document.getElementById('marks').innerHTML = marksHTML();
		document.getElementById('tray').innerHTML = trayHTML();
		document.getElementById('clues').innerHTML = cluesHTML();
		refreshCounts();
		persist();
	}

	function leaveBoard() {
		stopClock();
		persist();
		game = null;
		go('home');
	}

	function tapCell(c) {
		const cell = game.cells[c];
		const blocked = game.pz.kind[c] === 'block';
		const sel = game.sel;
		if (game.tool === 'eraser') {
			cell.p = -1; cell.x = false; cell.notes = [];
			S.audio.mark();
		} else if (game.tool === 'pencil' && sel >= 0) {
			if (blocked || cell.p >= 0) return refuse(blocked);
			const i = cell.notes.indexOf(sel);
			if (i >= 0) cell.notes.splice(i, 1); else cell.notes.push(sel);
			cell.notes.sort((a, b) => a - b);
			S.audio.mark();
		} else if (sel < 0) {
			if (cell.p >= 0 && game.tool === 'pen') {
				game.sel = cell.p; // pick up the person standing here
			} else if (!blocked && cell.p < 0) {
				cell.x = !cell.x;
				S.audio.mark();
			}
		} else {
			if (blocked) return refuse(true);
			if (cell.p === sel) {
				cell.p = -1;
			} else {
				game.cells.forEach((o) => { if (o.p === sel) o.p = -1; });
				cell.p = sel; cell.x = false; cell.notes = [];
				// A placed person no longer needs pencil notes anywhere.
				game.cells.forEach((o) => { const i = o.notes.indexOf(sel); if (i >= 0) o.notes.splice(i, 1); });
				S.audio.place();
				S.notifyNative('tap');
			}
			game.sel = -1;
		}
		refreshBoard();
	}

	function refuse(blocked) {
		const b = document.getElementById('board');
		b.classList.remove('shake');
		void b.offsetWidth;
		b.classList.add('shake');
		S.audio.error();
		if (blocked) toast(t('blocked'));
	}

	function giveHint() {
		const { pz } = game;
		const pos = positions();
		const order = [...Array(pz.n).keys()];
		const p = order.find((i) => pos[i] !== pz.solution[i]);
		if (p == null) return toast(t('noHint'));
		const target = pz.solution[p];
		game.cells.forEach((o) => { if (o.p === p) o.p = -1; });
		const cell = game.cells[target];
		cell.p = p; cell.x = false; cell.notes = [];
		game.hints++;
		game.sel = -1;
		S.audio.place();
		refreshBoard();
		toast(t('hintGiven', { who: subjOf(keyOf(pz, p)) }));
	}

	function accuse() {
		const { pz } = game;
		const pos = positions();
		if (pos.some((c) => c < 0)) return toast(t('needAll'));
		if (pos.some((c, i) => c !== pz.solution[i])) {
			game.mistakes++;
			persist();
			S.audio.error();
			S.notifyNative('error');
			return toast(t('wrongBoard'));
		}
		const el = document.createElement('div');
		el.className = 'overlay';
		el.innerHTML = `<div class="sheet paper" role="dialog" aria-modal="true" aria-label="${esc(t('whoKiller'))}">
			<h3>${esc(t('whoKiller'))}</h3><p>${esc(t('whoKillerSub'))}</p>
			<div class="suspect-pick">${pz.suspects.map((k, i) => `<button type="button" class="chip" data-act="charge" data-p="${i}"><span class="chip-face">${face(k, 56)}</span><span class="chip-name">${esc(nameOf(k))}</span></button>`).join('')}</div>
			<button type="button" class="btn-ghost" data-act="closeOverlay">${esc(t('cancel'))}</button>
		</div>`;
		app.appendChild(el);
	}

	function charge(p) {
		app.querySelector('.overlay')?.remove();
		const { pz } = game;
		if (p !== pz.killer) {
			game.mistakes++;
			persist();
			S.audio.error();
			S.notifyNative('error');
			return toast(t('wrongKiller'));
		}
		stopClock();
		const time = elapsed();
		const slips = game.hints + game.mistakes;
		const stars = slips === 0 ? 3 : slips <= 2 ? 2 : 1;
		const pr = prog();
		const prev = pr.solved[game.id];
		pr.solved[game.id] = { stars: Math.max(stars, prev?.stars ?? 0), time: Math.min(time, prev?.time ?? Infinity), hints: game.hints, mistakes: game.mistakes };
		delete pr.saved[game.id];
		saveProg(pr);
		S.audio.stamp();
		S.notifyNative('win');
		const result = { id: game.id, info: game.info, pz, stars, time, hints: game.hints, mistakes: game.mistakes };
		game = null;
		go('verdict', result);
	}

	// ---------- verdict ----------

	function renderVerdict(r) {
		S.setScreen(true, () => afterVerdict(r, 'home'));
		const { pz } = r;
		const killer = pz.suspects[pz.killer];
		const roomType = pz.rooms[pz.room[pz.solution[pz.n - 1]]];
		app.innerHTML = `<section class="screen"><div class="scroll verdict">
			<div class="topbar" style="padding:14px 0 0"><span class="label-mono">${esc(t('caseNo', { n: r.info.no }))} · ${esc(t('stampSolved'))}</span><button type="button" class="round-btn" data-act="verdictHome" aria-label="${esc(t('backHome'))}">${ICON.back}</button></div>
			<div class="mag-row" role="img" aria-label="${r.stars}/3">${[0, 1, 2].map((i) => `<span class="${i < r.stars ? '' : 'off'}" style="transform:rotate(${(i - 1) * 10}deg);display:inline-flex">${ICON.mag}</span>`).join('')}</div>
			<div class="verdict-line">${esc(t('stars' + r.stars))}</div>
			<div class="news">
				<div class="news-mast"><span>${esc(t('paper'))}</span><span>${esc(t('special'))}</span></div>
				<h2>${esc(t('headline'))}</h2>
				<div class="news-sub">${esc(caseTitle(pz))}</div>
				<div class="news-who"><div class="ph" style="background:${A.tokenBg(killer)}">${A.portrait(killer, 84)}</div>
					<div><b>${esc(subjOf(killer))}</b><div>${esc(t('verdictRoom', { room: roomName(roomType) }))}<br>${esc(t('verdictTime', { time: clock(pz) }))}</div></div></div>
				<div class="news-text">${esc(t('verdictText', { P: subjOf(killer) }))}</div>
				<div class="big-stamp">${esc(t('closed'))}</div>
			</div>
			<div class="stats">
				<div><span>${esc(t('statTime'))}</span><b>${mmss(r.time)}</b></div>
				<div><span>${esc(t('statHints'))}</span><b>${r.hints}</b></div>
				<div><span>${esc(t('statMistakes'))}</span><b>${r.mistakes}</b></div>
			</div>
			<div class="verdict-buttons">
				<button type="button" class="btn-red" data-act="verdictNext">${esc(t('nextCase'))}${ICON.arrow}</button>
				<button type="button" class="btn-ghost" data-act="verdictHome">${esc(t('backHome'))}</button>
			</div>
		</div></section>`;
		app._verdict = r;
	}

	function afterVerdict(r, where) {
		S.ads.breakPoint();
		if (where === 'next' && !r.info.daily && r.info.index < FILES) return go('board', `${r.info.prefix}-${r.info.index + 1}`);
		if (where === 'next') { casesTab = r.info.daily ? casesTab : r.info.level; return go('cases'); }
		go('home');
	}

	// ---------- events ----------

	app.addEventListener('click', (e) => {
		const el = e.target.closest('[data-act]');
		if (!el || el.disabled) return;
		const act = el.dataset.act;
		switch (act) {
			case 'nav': return go(el.dataset.to);
			case 'open': return go('board', el.dataset.id);
			case 'tab': casesTab = el.dataset.level; return renderCases();
			case 'lang': S.setLanguage(el.dataset.lang); return renderSettings();
			case 'toggle': S.settings.set(el.dataset.name, !S.settings.get(el.dataset.name)); return renderSettings();
			case 'rules': return showRules();
			case 'page': return S.openPage(el.dataset.page);
			case 'adprivacy': return S.ads.showPrivacy();
			case 'closeOverlay': return el.closest('.overlay')?.remove();
			case 'leave': return leaveBoard();
			case 'cell': return tapCell(+el.dataset.c);
			case 'pick': {
				const p = +el.dataset.p;
				game.sel = game.sel === p ? -1 : p;
				if (game.tool === 'eraser') game.tool = 'pen';
				document.querySelectorAll('.tool').forEach((b) => { const on = b.dataset.tool === game.tool; b.classList.toggle('on', on); if (b.dataset.tool) b.setAttribute('aria-pressed', on); });
				document.getElementById('tray').innerHTML = trayHTML();
				return;
			}
			case 'tool':
				game.tool = el.dataset.tool;
				if (game.tool === 'eraser') game.sel = -1;
				document.querySelectorAll('.tool').forEach((b) => { const on = b.dataset.tool === game.tool; b.classList.toggle('on', on); if (b.dataset.tool) b.setAttribute('aria-pressed', on); });
				document.getElementById('tray').innerHTML = trayHTML();
				return;
			case 'hint': return giveHint();
			case 'accuse': return accuse();
			case 'charge': return charge(+el.dataset.p);
			case 'verdictNext': return afterVerdict(app._verdict, 'next');
			case 'verdictHome': return afterVerdict(app._verdict, 'home');
		}
	});

	// Tapping the dark area around a sheet closes it.
	app.addEventListener('click', (e) => {
		if (e.target.classList?.contains('overlay')) e.target.remove();
	});

	document.addEventListener('visibilitychange', () => {
		if (!game) return;
		if (document.hidden) { stopClock(); persist(); }
		else if (screen === 'board') startClock();
	});

	window.addEventListener('sus:privacy', () => { if (screen === 'settings') renderSettings(); });

	go('home');
})();
