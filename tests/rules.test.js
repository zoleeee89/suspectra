// Runs the generator over many seeds and checks every case: unique solution, rules, timing.
// node tests/rules.test.js [count]
'use strict';
const R = require('../Resources/Raw/wwwroot/js/rules.js');
const count = +process.argv[2] || 40;
let fail = 0;
for (const level of ['easy', 'medium', 'hard']) {
	const times = [], clues = [];
	for (let i = 1; i <= count; i++) {
		const t0 = Date.now();
		const pz = R.generate(level + ':' + i, level);
		const ms = Date.now() - t0;
		if (!pz) { console.log('NULL', level, i); fail++; continue; }
		times.push(ms); clues.push(pz.clues.length);
		const res = R.solve(pz, pz.clues, 3);
		const n = pz.n;
		const okUnique = res.count === 1 && res.sols[0].every((c, j) => c === pz.solution[j]);
		const rows = new Set(pz.solution.map((c) => (c / n) | 0)), cols = new Set(pz.solution.map((c) => c % n));
		const okRows = rows.size === n && cols.size === n;
		const okBlock = pz.solution.every((c) => pz.kind[c] !== 'block');
		const okClues = pz.clues.every((cl) => R.clueHolds(pz, cl, pz.solution));
		const ded = R.deduce(pz, pz.clues);
		const okFair = ded.solved && ded.domains.every((d, j) => d.has(pz.solution[j]));
		const okKiller = R.killerOf(pz, pz.solution) === pz.killer && pz.killer >= 0;
		const again = R.generate(level + ':' + i, level);
		const okSeed = JSON.stringify(again) === JSON.stringify(pz);
		if (!(okUnique && okRows && okBlock && okClues && okKiller && okSeed && okFair)) {
			fail++;
			console.log('FAIL', level, i, { okUnique, okRows, okBlock, okClues, okKiller, okSeed, okFair });
		}
	}
	times.sort((a, b) => a - b);
	const avg = (a) => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1);
	console.log(level, 'cases', times.length, 'ms avg', avg(times), 'max', times[times.length - 1], 'clues avg', avg(clues), 'min', Math.min(...clues), 'max', Math.max(...clues));
}
console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
