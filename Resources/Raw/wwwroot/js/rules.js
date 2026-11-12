// Suspectra – puzzle rules, generator and solver. No DOM here, so Node can run the tests.
//
// The rules of a case:
//  1. Every row and every column holds exactly one person (a suspect or the victim).
//  2. Nobody stands on blocking furniture (tables, shelves, plants…); seats and rugs are fine.
//  3. The killer is the only suspect who was in the same room as the victim.
//  4. Every clue is true.
(function (root) {
	'use strict';

	// ---------- random numbers (same seed, same case on every phone) ----------

	function hashString(s) {
		let h = 1779033703 ^ s.length;
		for (let i = 0; i < s.length; i++) {
			h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
			h = (h << 13) | (h >>> 19);
		}
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return (h ^= h >>> 16) >>> 0;
	}

	function rngFrom(seed) {
		let a = hashString(String(seed));
		return function () {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const pick = (r, a) => a[Math.floor(r() * a.length)];

	function shuffle(r, a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(r() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function weightedPick(r, list, weightOf) {
		let total = 0;
		for (const x of list) total += weightOf(x);
		if (total <= 0) return list.length ? pick(r, list) : undefined;
		let v = r() * total;
		for (const x of list) {
			v -= weightOf(x);
			if (v <= 0) return x;
		}
		return list[list.length - 1];
	}

	// ---------- the house ----------

	const ROOM_TYPES = ['salon', 'kitchen', 'library', 'hall', 'dining', 'study', 'garden'];

	// kind: block = nobody may stand there, seat = someone may sit there, floor = may stand on it
	const ITEMS = {
		plant: { w: 1, h: 1, kind: 'block' },
		flower: { w: 1, h: 1, kind: 'block' },
		piano: { w: 1, h: 1, kind: 'block' },
		stove: { w: 1, h: 1, kind: 'block' },
		sink: { w: 1, h: 1, kind: 'block' },
		fridge: { w: 1, h: 1, kind: 'block' },
		ktable: { w: 1, h: 2, kind: 'block' },
		shelf: { w: 1, h: 2, kind: 'block' },
		dtable: { w: 2, h: 1, kind: 'block' },
		desk: { w: 2, h: 1, kind: 'block' },
		arm: { w: 1, h: 1, kind: 'seat' },
		chair: { w: 1, h: 1, kind: 'seat' },
		sofa: { w: 2, h: 1, kind: 'seat' },
		bench: { w: 2, h: 1, kind: 'seat' },
		rug: { w: 1, h: 2, kind: 'floor' }
	};

	// The first item is the room's signature piece and is always tried first.
	const ROOM_ITEMS = {
		salon: ['sofa', 'piano', 'arm', 'plant', 'rug'],
		kitchen: ['stove', 'sink', 'fridge', 'ktable', 'chair'],
		library: ['shelf', 'arm', 'rug', 'plant'],
		hall: ['rug', 'plant', 'bench'],
		dining: ['dtable', 'chair', 'plant'],
		study: ['desk', 'shelf', 'arm', 'plant'],
		garden: ['bench', 'flower', 'plant']
	};

	const SUSPECTS = ['doctor', 'count', 'baroness', 'butler', 'cook', 'gardener', 'maid', 'captain', 'actress'];

	const LEVELS = {
		easy: { n: 5, rooms: 4 },
		medium: { n: 6, rooms: 5 },
		hard: { n: 7, rooms: 6 }
	};

	function neighbours(n, c) {
		const x = c % n, y = (c / n) | 0, out = [];
		if (y > 0) out.push(c - n);
		if (y < n - 1) out.push(c + n);
		if (x > 0) out.push(c - 1);
		if (x < n - 1) out.push(c + 1);
		return out;
	}

	// Grows compact rooms from spread-out seeds; rejects layouts with tiny or huge rooms.
	function makeRooms(r, n, k) {
		const total = n * n;
		const maxSize = Math.ceil((total / k) * 1.7);
		for (let attempt = 0; attempt < 300; attempt++) {
			const room = new Array(total).fill(-1);
			const seeds = [];
			for (const c of shuffle(r, [...Array(total).keys()])) {
				if (seeds.length === k) break;
				const far = seeds.every((s) => Math.abs((s % n) - (c % n)) + Math.abs(((s / n) | 0) - ((c / n) | 0)) >= 2);
				if (far) seeds.push(c);
			}
			if (seeds.length < k) continue;
			const size = new Array(k).fill(1);
			seeds.forEach((c, i) => (room[c] = i));
			let left = total - k;
			while (left > 0) {
				const cand = [];
				for (let c = 0; c < total; c++) {
					if (room[c] >= 0) continue;
					const touch = {};
					for (const m of neighbours(n, c)) if (room[m] >= 0) touch[room[m]] = (touch[room[m]] || 0) + 1;
					for (const key in touch) {
						const ro = +key;
						if (size[ro] >= maxSize) continue;
						cand.push({ c, ro, w: Math.pow(touch[key], 3) / Math.pow(size[ro], 1.4) });
					}
				}
				if (!cand.length) break;
				const ch = weightedPick(r, cand, (x) => x.w);
				room[ch.c] = ch.ro;
				size[ch.ro]++;
				left--;
			}
			if (left > 0) continue;
			if (size.some((s) => s < 3)) continue;
			return room;
		}
		return null;
	}

	function placeItems(r, n, room, types) {
		const total = n * n;
		const owner = new Array(total).fill(-1);
		const items = [];
		types.forEach((type, ri) => {
			const cells = [];
			for (let c = 0; c < total; c++) if (room[c] === ri) cells.push(c);
			const target = Math.min(5, Math.max(1, Math.round(cells.length / 2.6)));
			const list = ROOM_ITEMS[type];
			let placed = 0;
			for (let t = 0; t < target * 8 && placed < target; t++) {
				const id = placed === 0 && t < 4 ? list[0] : pick(r, list);
				const def = ITEMS[id];
				if (def.w * def.h > 1 && items.some((it) => it.room === ri && it.id === id)) continue;
				for (const a of shuffle(r, cells.slice())) {
					const ax = a % n, ay = (a / n) | 0;
					if (ax + def.w > n || ay + def.h > n) continue;
					const covered = [];
					for (let dy = 0; dy < def.h; dy++) for (let dx = 0; dx < def.w; dx++) covered.push((ay + dy) * n + ax + dx);
					if (!covered.every((c) => room[c] === ri && owner[c] < 0)) continue;
					covered.forEach((c) => (owner[c] = items.length));
					items.push({ id, x: ax, y: ay, w: def.w, h: def.h, room: ri });
					placed++;
					break;
				}
			}
		});
		const kind = owner.map((o) => (o < 0 ? 'free' : ITEMS[items[o].id].kind));
		return { items, owner, kind };
	}

	function randomPermutation(r, n, ok) {
		const cols = new Array(n);
		const used = new Array(n).fill(false);
		function rec(y) {
			if (y === n) return true;
			for (const x of shuffle(r, [...Array(n).keys()])) {
				if (used[x] || !ok(y * n + x)) continue;
				used[x] = true;
				cols[y] = x;
				if (rec(y + 1)) return true;
				used[x] = false;
			}
			return false;
		}
		return rec(0) ? cols.map((x, y) => y * n + x) : null;
	}

	// ---------- clues ----------
	// Persons are numbered 0..n-1; the last one (n-1) is the victim.
	// Clue shapes:
	//  {t:'room',p,r} {t:'notRoom',p,r} {t:'on',p,item} {t:'standing',p} {t:'beside',p,item}
	//  {t:'row',p,k} {t:'col',p,k} {t:'same',p,q} {t:'diff',p,q} {t:'above',p,q} {t:'left',p,q} {t:'alone',p}

	const UNARY = new Set(['room', 'notRoom', 'on', 'standing', 'beside', 'row', 'col']);
	const BINARY = new Set(['same', 'diff', 'above', 'left']);

	function besideTypes(pz, c) {
		const set = new Set();
		const own = pz.owner[c];
		for (const m of neighbours(pz.n, c)) {
			const o = pz.owner[m];
			if (o >= 0 && o !== own && ITEMS[pz.items[o].id].kind === 'block') set.add(pz.items[o].id);
		}
		return set;
	}

	function unaryHolds(pz, clue, c) {
		const n = pz.n;
		switch (clue.t) {
			case 'room': return pz.room[c] === clue.r;
			case 'notRoom': return pz.room[c] !== clue.r;
			case 'on': return pz.owner[c] >= 0 && pz.items[pz.owner[c]].id === clue.item;
			case 'standing': return pz.kind[c] !== 'seat';
			case 'beside': return besideTypes(pz, c).has(clue.item);
			case 'row': return ((c / n) | 0) === clue.k;
			case 'col': return c % n === clue.k;
		}
		return true;
	}

	function binaryHolds(pz, clue, a, b) {
		const n = pz.n;
		switch (clue.t) {
			case 'same': return pz.room[a] === pz.room[b];
			case 'diff': return pz.room[a] !== pz.room[b];
			case 'above': return ((a / n) | 0) < ((b / n) | 0);
			case 'left': return a % n < b % n;
		}
		return true;
	}

	function aloneHolds(pz, pos, p) {
		const ro = pz.room[pos[p]];
		return pos.every((c, i) => i === p || pz.room[c] !== ro);
	}

	// Rule 3: exactly one suspect shares the victim's room.
	function killerOf(pz, pos) {
		const v = pos.length - 1;
		const ro = pz.room[pos[v]];
		const inRoom = [];
		for (let i = 0; i < v; i++) if (pz.room[pos[i]] === ro) inRoom.push(i);
		return inRoom.length === 1 ? inRoom[0] : -1;
	}

	function clueHolds(pz, clue, pos) {
		if (UNARY.has(clue.t)) return unaryHolds(pz, clue, pos[clue.p]);
		if (BINARY.has(clue.t)) return binaryHolds(pz, clue, pos[clue.p], pos[clue.q]);
		if (clue.t === 'alone') return aloneHolds(pz, pos, clue.p);
		return true;
	}

	// Checks one clue against a partial board (pos[i] = -1 when not placed): true, false, or null when undecided.
	function clueStatus(pz, clue, pos) {
		if (clue.t === 'alone') {
			if (pos[clue.p] < 0) return null;
			const ro = pz.room[pos[clue.p]];
			if (pos.some((c, i) => i !== clue.p && c >= 0 && pz.room[c] === ro)) return false;
			return pos.every((c) => c >= 0) ? true : null;
		}
		if (pos[clue.p] < 0) return null;
		if (BINARY.has(clue.t)) {
			if (pos[clue.q] < 0) return null;
			return binaryHolds(pz, clue, pos[clue.p], pos[clue.q]);
		}
		return unaryHolds(pz, clue, pos[clue.p]);
	}

	// Counts solutions up to `limit`; returns { count, sols }.
	function solve(pz, clues, limit = 2) {
		const n = pz.n, total = n * n;
		const domains = [];
		for (let p = 0; p < n; p++) {
			const mine = clues.filter((c) => UNARY.has(c.t) && c.p === p);
			const d = [];
			for (let c = 0; c < total; c++) {
				if (pz.kind[c] === 'block') continue;
				if (mine.every((cl) => unaryHolds(pz, cl, c))) d.push(c);
			}
			domains.push(d);
		}
		const binaries = clues.filter((c) => BINARY.has(c.t));
		const alones = clues.filter((c) => c.t === 'alone');
		const order = [...Array(n).keys()].sort((a, b) => domains[a].length - domains[b].length);
		const pos = new Array(n).fill(-1);
		const rowUsed = new Array(n).fill(false), colUsed = new Array(n).fill(false);
		const sols = [];

		function consistent(p) {
			for (const cl of binaries) {
				if (cl.p !== p && cl.q !== p) continue;
				const a = pos[cl.p], b = pos[cl.q];
				if (a < 0 || b < 0) continue;
				if (!binaryHolds(pz, cl, a, b)) return false;
			}
			for (const cl of alones) {
				const a = pos[cl.p];
				if (a < 0) continue;
				const ro = pz.room[a];
				for (let i = 0; i < n; i++) if (i !== cl.p && pos[i] >= 0 && pz.room[pos[i]] === ro) return false;
			}
			return true;
		}

		function rec(i) {
			if (i === n) {
				if (killerOf(pz, pos) < 0) return false;
				sols.push(pos.slice());
				return sols.length >= limit;
			}
			const p = order[i];
			for (const c of domains[p]) {
				const y = (c / n) | 0, x = c % n;
				if (rowUsed[y] || colUsed[x]) continue;
				pos[p] = c;
				rowUsed[y] = colUsed[x] = true;
				if (consistent(p) && rec(i + 1)) return true;
				rowUsed[y] = colUsed[x] = false;
				pos[p] = -1;
			}
			return false;
		}
		rec(0);
		return { count: sols.length, sols };
	}

	// Solves the way a player would: only certain deductions, never a guess.
	// A case is fair when this alone finds every person. Returns { solved, domains, rounds }.
	function deduce(pz, clues) {
		const n = pz.n, total = n * n, v = n - 1;
		const dom = [];
		for (let p = 0; p < n; p++) {
			const mine = clues.filter((c) => UNARY.has(c.t) && c.p === p);
			const d = new Set();
			for (let c = 0; c < total; c++) {
				if (pz.kind[c] === 'block') continue;
				if (mine.every((cl) => unaryHolds(pz, cl, c))) d.add(c);
			}
			dom.push(d);
		}
		const binaries = clues.filter((c) => BINARY.has(c.t));
		const alones = clues.filter((c) => c.t === 'alone');
		const row = (c) => (c / n) | 0, col = (c) => c % n;
		const roomsOf = (p) => new Set([...dom[p]].map((c) => pz.room[c]));
		const fixed = (p) => (dom[p].size === 1 ? dom[p].values().next().value : -1);

		let rounds = 0, changed = true;
		while (changed && rounds < 200) {
			changed = false;
			rounds++;
			const cut = (p, keep) => {
				for (const c of [...dom[p]]) if (!keep(c)) { dom[p].delete(c); changed = true; }
			};
			// A placed person blocks their row and column.
			for (let p = 0; p < n; p++) {
				const f = fixed(p);
				if (f < 0) continue;
				for (let q = 0; q < n; q++) if (q !== p) cut(q, (c) => row(c) !== row(f) && col(c) !== col(f));
			}
			// A row (column) that only one person can reach belongs to that person.
			for (let k = 0; k < n; k++) {
				for (const axis of [row, col]) {
					const who = [];
					for (let p = 0; p < n; p++) if ([...dom[p]].some((c) => axis(c) === k)) who.push(p);
					if (who.length === 1) cut(who[0], (c) => axis(c) === k);
				}
			}
			// k people confined to the same k rows (columns) own those rows: others stay out.
			for (const axis of [row, col]) {
				for (let p = 0; p < n; p++) {
					const lines = new Set([...dom[p]].map(axis));
					if (lines.size > 3) continue;
					const group = [];
					for (let q = 0; q < n; q++) if ([...dom[q]].every((c) => lines.has(axis(c)))) group.push(q);
					if (group.length === lines.size) for (let q = 0; q < n; q++) if (!group.includes(q)) cut(q, (c) => !lines.has(axis(c)));
				}
			}
			// Two-person clues keep only cells with a partner that fits.
			for (const cl of binaries) {
				cut(cl.p, (a) => [...dom[cl.q]].some((b) => row(a) !== row(b) && col(a) !== col(b) && binaryHolds(pz, cl, a, b)));
				cut(cl.q, (b) => [...dom[cl.p]].some((a) => row(a) !== row(b) && col(a) !== col(b) && binaryHolds(pz, cl, a, b)));
			}
			// Someone alone keeps the others out of their room, and stays out of rooms already taken.
			for (const cl of alones) {
				const rs = roomsOf(cl.p);
				if (rs.size === 1) {
					const ro = [...rs][0];
					for (let q = 0; q < n; q++) if (q !== cl.p) cut(q, (c) => pz.room[c] !== ro);
				}
				for (let q = 0; q < n; q++) {
					if (q === cl.p) continue;
					const qr = roomsOf(q);
					if (qr.size === 1) { const ro = [...qr][0]; cut(cl.p, (c) => pz.room[c] !== ro); }
				}
			}
			// The killer rule, once the victim's room is known: exactly one suspect is there.
			const vr = roomsOf(v);
			if (vr.size === 1) {
				const ro = [...vr][0];
				const surely = [], maybe = [];
				for (let s = 0; s < v; s++) {
					const rs = roomsOf(s);
					if (rs.size === 1 && rs.has(ro)) surely.push(s);
					else if (rs.has(ro)) maybe.push(s);
				}
				if (surely.length === 1) for (const s of maybe) cut(s, (c) => pz.room[c] !== ro);
				if (surely.length === 0 && maybe.length === 1) cut(maybe[0], (c) => pz.room[c] === ro);
			}
			// The victim cannot be in a room no suspect can reach, nor in one two suspects surely share.
			cut(v, (c) => {
				const ro = pz.room[c];
				let can = 0, sure = 0;
				for (let s = 0; s < v; s++) {
					const rs = roomsOf(s);
					if (rs.has(ro)) can++;
					if (rs.size === 1 && rs.has(ro)) sure++;
				}
				return can > 0 && sure < 2;
			});
			if (dom.some((d) => d.size === 0)) return { solved: false, broken: true, domains: dom, rounds };
		}
		return { solved: dom.every((d) => d.size === 1), domains: dom, rounds };
	}

	function allTrueClues(pz, pos) {
		const n = pz.n, v = n - 1, out = [];
		for (let p = 0; p < n; p++) {
			const c = pos[p];
			out.push({ t: 'room', p, r: pz.room[c] });
			for (let ro = 0; ro < pz.rooms.length; ro++) if (ro !== pz.room[c]) out.push({ t: 'notRoom', p, r: ro });
			const o = pz.owner[c];
			if (o >= 0 && ITEMS[pz.items[o].id].kind !== 'block') out.push({ t: 'on', p, item: pz.items[o].id });
			if (pz.kind[c] !== 'seat' && pz.items.some((it) => ITEMS[it.id].kind === 'seat')) out.push({ t: 'standing', p });
			for (const id of besideTypes(pz, c)) out.push({ t: 'beside', p, item: id });
			out.push({ t: 'row', p, k: (c / n) | 0 });
			out.push({ t: 'col', p, k: c % n });
			if (p !== v && aloneHolds(pz, pos, p)) out.push({ t: 'alone', p });
			for (let q = 0; q < n; q++) {
				if (q === p) continue;
				if (q > p) out.push({ t: pz.room[c] === pz.room[pos[q]] ? 'same' : 'diff', p, q });
				if (((c / n) | 0) < ((pos[q] / n) | 0)) out.push({ t: 'above', p, q });
				if (c % n < pos[q] % n) out.push({ t: 'left', p, q });
			}
		}
		return out;
	}

	const WEIGHTS = {
		easy: { room: 6, on: 4, beside: 3, same: 2, notRoom: 1, standing: 1, diff: 1, above: 0.3, left: 0.3, alone: 1, row: 0.2, col: 0.2 },
		medium: { room: 2.5, on: 2.5, beside: 3, same: 2, notRoom: 2, standing: 1.5, diff: 2, above: 1, left: 1, alone: 1.5, row: 0.3, col: 0.3 },
		hard: { room: 0.6, on: 1.5, beside: 3, same: 1.5, notRoom: 3, standing: 2, diff: 3, above: 2, left: 2, alone: 2, row: 0.4, col: 0.4 }
	};

	// Easy keeps a few spare clues so the logic flows; medium and hard drop every clue that is not needed.
	const SPARE = { easy: 2, medium: 0, hard: 0 };

	const PLACES = 8, EVENTS = 6;

	function generate(seed, level = 'medium') {
		const cfg = LEVELS[level] || LEVELS.medium;
		const r = rngFrom('suspectra:' + seed);
		const n = cfg.n;
		for (let attempt = 0; attempt < 80; attempt++) {
			const room = makeRooms(r, n, cfg.rooms);
			if (!room) continue;
			const types = shuffle(r, ROOM_TYPES.slice()).slice(0, cfg.rooms);
			const { items, owner, kind } = placeItems(r, n, room, types);
			const blocked = kind.filter((k) => k === 'block').length;
			if (blocked > n * n * 0.34) continue;
			const pz = { n, room, rooms: types, items, owner, kind };

			let pos = null;
			for (let t = 0; t < 30 && !pos; t++) {
				const cells = randomPermutation(r, n, (c) => kind[c] !== 'block');
				if (!cells) break;
				for (let s = 0; s < 20; s++) {
					const tryPos = shuffle(r, cells.slice());
					if (killerOf(pz, tryPos) >= 0) {
						pos = tryPos;
						break;
					}
				}
			}
			if (!pos) continue;

			const weights = WEIGHTS[level] || WEIGHTS.medium;
			const pool = allTrueClues(pz, pos);
			const chosen = [];
			let fair = false;
			for (let guard = 0; guard < 60; guard++) {
				const res = solve(pz, chosen, 2);
				let useful;
				if (res.count > 1) {
					// Still ambiguous: add a clue that rules out the other answer.
					const other = res.sols.find((s) => s.some((c, i) => c !== pos[i]));
					useful = pool.filter((cl) => !chosen.includes(cl) && !clueHolds(pz, cl, other));
				} else {
					// Unique, but a player would have to guess: add a clue about someone still open.
					const d = deduce(pz, chosen);
					if (d.solved) {
						fair = true;
						break;
					}
					const open = new Set();
					d.domains.forEach((s, p) => { if (s.size > 1) open.add(p); });
					useful = pool.filter((cl) => !chosen.includes(cl) && (open.has(cl.p) || open.has(cl.q)));
				}
				if (!useful.length) break;
				chosen.push(weightedPick(r, useful, (cl) => weights[cl.t] || 0.1));
			}
			if (!fair) continue;

			// Drop clues the case does not need, as long as it stays solvable without guessing.
			let spare = SPARE[level] || 0;
			for (const cl of shuffle(r, chosen.slice())) {
				const without = chosen.filter((x) => x !== cl);
				if (deduce(pz, without).solved) {
					if (spare > 0 && r() < 0.5) {
						spare--;
						continue;
					}
					chosen.splice(chosen.indexOf(cl), 1);
				}
			}

			const suspects = shuffle(r, SUSPECTS.slice()).slice(0, n - 1);
			const killer = killerOf(pz, pos);
			return {
				seed: String(seed),
				level,
				n,
				room,
				rooms: types,
				items,
				owner,
				kind,
				suspects,
				solution: pos,
				killer,
				clues: shuffle(r, chosen),
				place: Math.floor(r() * PLACES),
				event: Math.floor(r() * EVENTS),
				hour: 20 + Math.floor(r() * 4),
				minute: Math.floor(r() * 12) * 5
			};
		}
		return null;
	}

	const api = { generate, solve, deduce, clueHolds, clueStatus, killerOf, rngFrom, ITEMS, ROOM_ITEMS, ROOM_TYPES, SUSPECTS, LEVELS };
	if (typeof module !== 'undefined' && module.exports) module.exports = api;
	else root.SusRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
