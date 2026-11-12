// Vector art: room floors, furniture (drawn on a 50-unit cell) and suspect portraits.
window.SusArt = (() => {
	'use strict';

	const O = '#2B1A10';

	// ---------- floors: CSS backgrounds sized to the cell ----------

	function floor(type, s) {
		const q = s / 4, h = s / 2, t = s / 3;
		switch (type) {
			case 'salon':
				return `linear-gradient(135deg, rgba(255,255,255,0.10), rgba(0,0,0,0.06)), repeating-linear-gradient(0deg, rgba(110,65,25,0.35) 0 1px, transparent 1px ${t}px), repeating-linear-gradient(90deg, #E8BE85 0 ${q}px, #DDAE72 ${q}px ${h}px)`;
			case 'garden':
				return `radial-gradient(circle at 30% 40%, #4E9440 0 ${s * 0.05}px, transparent ${s * 0.06}px) 0 0 / ${q}px ${q}px, radial-gradient(circle at 75% 80%, #A6DE8E 0 ${s * 0.03}px, transparent ${s * 0.04}px) 0 0 / ${t}px ${t}px, linear-gradient(160deg, #8CCB6E, #5FA64B)`;
			case 'kitchen':
				return `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.05)), repeating-conic-gradient(#F6E6CF 0 25%, #D0744E 0 50%) 0 0 / ${h}px ${h}px`;
			case 'library':
				return `repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px ${h}px), repeating-linear-gradient(90deg, #946140 0 ${s / 5}px, #85553A ${s / 5}px ${(s * 2) / 5}px)`;
			case 'hall':
				return `linear-gradient(rgba(70,60,50,0.22) 1px, transparent 1px) 0 0 / ${h}px ${h}px, linear-gradient(90deg, rgba(70,60,50,0.22) 1px, transparent 1px) 0 0 / ${h}px ${h}px, linear-gradient(135deg, #FBF7EF, #DED6C6)`;
			case 'dining':
				return `radial-gradient(circle, #E2B455 0 ${s * 0.032}px, transparent ${s * 0.044}px) 0 0 / ${q}px ${q}px, radial-gradient(circle, rgba(0,0,0,0.18) 0 ${s * 0.07}px, transparent ${s * 0.08}px) ${s / 8}px ${s / 8}px / ${q}px ${q}px, #B03A3C`;
			case 'study':
				return `repeating-linear-gradient(45deg, #C99C68 0 ${s * 0.12}px, #B48555 ${s * 0.12}px ${s * 0.24}px)`;
		}
		return '#CCC';
	}

	// Seat colours follow the room, so the same armchair looks at home everywhere.
	const SEAT = {
		salon: ['#F1DDB8', '#B5835A'],
		library: ['#4E9A7C', '#245A46'],
		study: ['#E0A08A', '#7A2E28'],
		kitchen: ['#E9C46A', '#A0622E'],
		dining: ['#E0A08A', '#7A2E28'],
		hall: ['#C9B48A', '#6B4428'],
		garden: ['#C9B48A', '#6B4428']
	};

	// ---------- furniture ----------

	const leaf = (r) => `<g transform="rotate(${r} 25 25)"><ellipse cx="25" cy="13.5" rx="5" ry="10.5" fill="url(#leafg)"/><path d="M25 5v17" stroke="rgba(220,255,200,0.55)" stroke-width="0.8"/></g>`;
	const flowerHead = (cx, cy, petal, ring) => `<g stroke="${ring}" stroke-width="0.6"><g fill="${petal}"><circle cx="${cx}" cy="${cy - 3}" r="2.1"/><circle cx="${cx + 3}" cy="${cy - 1}" r="2.1"/><circle cx="${cx + 2}" cy="${cy + 2.6}" r="2.1"/><circle cx="${cx - 2}" cy="${cy + 2.6}" r="2.1"/><circle cx="${cx - 3}" cy="${cy - 1}" r="2.1"/></g><circle cx="${cx}" cy="${cy}" r="1.5" fill="#F7D55A"/></g>`;

	const ITEM = {
		plant: () => `<defs><linearGradient id="potg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E08A55"/><stop offset="1" stop-color="#8E4322"/></linearGradient><radialGradient id="leafg" cx="0.5" cy="0.2" r="0.9"><stop offset="0" stop-color="#7FCB6E"/><stop offset="1" stop-color="#2E7A3A"/></radialGradient></defs>
			<circle cx="25" cy="26" r="12" fill="url(#potg)" stroke="#3A2015" stroke-width="1.4"/><circle cx="25" cy="26" r="9" fill="#4A2A18"/>
			<g stroke="#1F4A25" stroke-width="1">${[0, 60, 120, 180, 240, 300].map(leaf).join('')}
			${[30, 150, 270].map((r) => `<g transform="rotate(${r} 25 25)"><ellipse cx="25" cy="16" rx="3.4" ry="7.5" fill="#9AD884"/></g>`).join('')}</g>
			<circle cx="25" cy="25" r="3" fill="#2F6B37"/>`,

		flower: () => `<rect x="4" y="4" width="42" height="42" rx="5" fill="#8A5A34" stroke="#3A2015" stroke-width="1.4"/><rect x="7.5" y="7.5" width="35" height="35" rx="3" fill="#5A3A22"/>
			<g fill="#4E9A54" stroke="#1F4A25" stroke-width="0.6"><ellipse cx="13" cy="20" rx="4" ry="2.2" transform="rotate(-30 13 20)"/><ellipse cx="36" cy="21" rx="4" ry="2.2" transform="rotate(30 36 21)"/><ellipse cx="20" cy="31" rx="4" ry="2.2" transform="rotate(20 20 31)"/><ellipse cx="34" cy="38" rx="4" ry="2.2" transform="rotate(-20 34 38)"/></g>
			${flowerHead(14, 14, '#F28BA8', '#7A2E3A')}${flowerHead(31, 14, '#FFF6E6', '#7A5A10')}${flowerHead(25, 25, '#E8556A', '#7A2E3A')}${flowerHead(14, 34, '#B98AE0', '#4A2E7A')}${flowerHead(35, 33, '#F28BA8', '#7A2E3A')}`,

		arm: (c1, c2) => `<defs><linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.4"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>
			<rect x="6" y="6" width="38" height="38" rx="10" fill="${c2}" stroke="${O}" stroke-width="1.5"/><rect x="6" y="6" width="38" height="14" rx="8" fill="url(#shine)"/>
			<rect x="14" y="16" width="22" height="25" rx="6" fill="${c1}" stroke="${O}" stroke-width="1.2"/><rect x="15.5" y="17" width="19" height="9" rx="4" fill="url(#shine)"/>
			<g fill="rgba(0,0,0,0.3)"><circle cx="20" cy="11" r="1"/><circle cx="25" cy="11" r="1"/><circle cx="30" cy="11" r="1"/></g>`,

		chair: (c1, c2) => `<defs><linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.4"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>
			<rect x="12" y="7" width="26" height="7" rx="2.5" fill="${c2}" stroke="${O}" stroke-width="1.3"/>
			<rect x="12" y="13" width="26" height="27" rx="4" fill="#B87A44" stroke="${O}" stroke-width="1.4"/>
			<rect x="15.5" y="16.5" width="19" height="20" rx="3" fill="${c1}" stroke="${O}" stroke-width="0.9"/><rect x="16.5" y="17.5" width="17" height="7" rx="3" fill="url(#shine)"/>`,

		sofa: (c1, c2) => `<defs><linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.4"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs>
			<rect x="4" y="6" width="92" height="38" rx="10" fill="${c2 === '#B5835A' ? '#A83C2E' : c2}" stroke="${O}" stroke-width="1.5"/><rect x="4" y="6" width="92" height="13" rx="8" fill="url(#shine)"/>
			<g fill="rgba(0,0,0,0.3)">${[20, 32, 44, 56, 68, 80].map((x) => `<circle cx="${x}" cy="11" r="1"/>`).join('')}</g>
			<rect x="12" y="16" width="37" height="25" rx="6" fill="${c1}" stroke="${O}" stroke-width="1.2"/><rect x="51" y="16" width="37" height="25" rx="6" fill="${c1}" stroke="${O}" stroke-width="1.2"/>
			<rect x="13.5" y="17" width="34" height="9" rx="4" fill="url(#shine)"/><rect x="52.5" y="17" width="34" height="9" rx="4" fill="url(#shine)"/>
			<rect x="17" y="18" width="14" height="11" rx="3.5" fill="#F2C14E" stroke="#6A4A10" stroke-width="1" transform="rotate(-12 24 23)"/>
			<rect x="69" y="18" width="14" height="11" rx="3.5" fill="#2F6F9A" stroke="#173B55" stroke-width="1" transform="rotate(10 76 23)"/>`,

		piano: () => `<defs><linearGradient id="pianog" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A423D"/><stop offset="0.5" stop-color="#16120F"/><stop offset="1" stop-color="#2C2420"/></linearGradient></defs>
			<path d="M8 40V12c0-4 3-7 7-7h8c6 0 9 4 11 9l6 14c2 5 2 12-2 12z" fill="url(#pianog)" stroke="#0A0806" stroke-width="1.5"/>
			<path d="M13 11c1-2 2-3 4-3h6c4 0 6 2 8 6" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-linecap="round"/>
			<path d="M12 16l18 18" stroke="#C9A04F" stroke-width="0.8" opacity="0.7"/>
			<rect x="8" y="34.5" width="32" height="7.5" fill="#FBF7EE" stroke="#0A0806" stroke-width="1"/>
			<g fill="#16120F"><rect x="11.5" y="34.5" width="2.4" height="4.2"/><rect x="16" y="34.5" width="2.4" height="4.2"/><rect x="22.5" y="34.5" width="2.4" height="4.2"/><rect x="27" y="34.5" width="2.4" height="4.2"/><rect x="31.5" y="34.5" width="2.4" height="4.2"/></g>
			<rect x="15" y="44" width="18" height="5" rx="2" fill="#7A2E28" stroke="${O}" stroke-width="1"/>`,

		bench: () => `<defs><linearGradient id="benchg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D49A5E"/><stop offset="1" stop-color="#94602F"/></linearGradient></defs>
			<rect x="9" y="14" width="82" height="22" rx="3" fill="url(#benchg)" stroke="#3A2015" stroke-width="1.5"/>
			<path d="M9 19.5h82M9 25h82M9 30.5h82" stroke="#5A3418" stroke-width="1.2"/>
			<path d="M12 16.5h76M12 22h76M12 27.5h76M12 33h76" stroke="rgba(255,230,190,0.35)" stroke-width="0.8"/>
			<rect x="5" y="11" width="8" height="28" rx="3" fill="#3A332D" stroke="#14100C" stroke-width="1.2"/><rect x="87" y="11" width="8" height="28" rx="3" fill="#3A332D" stroke="#14100C" stroke-width="1.2"/>`,

		stove: () => `<defs><linearGradient id="steelg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#BDB8B0"/></linearGradient></defs>
			<rect x="4" y="4" width="42" height="42" rx="4" fill="url(#steelg)" stroke="${O}" stroke-width="1.5"/>
			<g fill="#2A2624" stroke="#14100C" stroke-width="1"><circle cx="15.5" cy="15.5" r="7"/><circle cx="34.5" cy="15.5" r="5.5"/><circle cx="15.5" cy="34.5" r="5.5"/><circle cx="34.5" cy="34.5" r="7"/></g>
			<g fill="none" stroke="#6A6560" stroke-width="1"><circle cx="15.5" cy="15.5" r="4"/><circle cx="34.5" cy="15.5" r="2.6"/><circle cx="15.5" cy="34.5" r="2.6"/></g>
			<circle cx="34.5" cy="34.5" r="4" fill="none" stroke="#F06A3C" stroke-width="1.6"/><circle cx="34.5" cy="34.5" r="1.6" fill="#FFB25A"/>`,

		sink: () => `<defs><linearGradient id="waterg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4F1F5"/><stop offset="1" stop-color="#8FB0BC"/></linearGradient></defs>
			<rect x="3" y="3" width="44" height="44" rx="4" fill="#ECE6DA" stroke="${O}" stroke-width="1.5"/>
			<rect x="10" y="14" width="30" height="26" rx="9" fill="url(#waterg)" stroke="#3A4A50" stroke-width="1.2"/>
			<path d="M14 20c3-3 8-4 12-3" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
			<circle cx="25" cy="31" r="2.2" fill="#55666C"/>
			<path d="M25 6v10" stroke="#9AA2A6" stroke-width="3.5" stroke-linecap="round"/><path d="M25 6v10" stroke="rgba(255,255,255,0.6)" stroke-width="1" stroke-linecap="round"/>
			<circle cx="17" cy="8.5" r="2.4" fill="#E86A6A" stroke="#7A2E28" stroke-width="0.8"/><circle cx="33" cy="8.5" r="2.4" fill="#5C8FB8" stroke="#284A66" stroke-width="0.8"/>`,

		fridge: () => `<defs><linearGradient id="fridgeg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F8FA"/><stop offset="1" stop-color="#C3CFD5"/></linearGradient></defs>
			<rect x="5" y="4" width="40" height="42" rx="5" fill="url(#fridgeg)" stroke="${O}" stroke-width="1.5"/>
			<rect x="5" y="35" width="40" height="11" rx="3" fill="#AEBCC3" stroke="${O}" stroke-width="1"/><rect x="27" y="38.5" width="14" height="3.4" rx="1.7" fill="#5E6C73"/>
			<rect x="10" y="9" width="10" height="8" rx="1" fill="#F7D55A" stroke="#8A6A10" stroke-width="0.6" transform="rotate(-8 15 13)"/>
			<rect x="24" y="12" width="9" height="7" rx="1" fill="#F6A6B8" stroke="#8A3A4E" stroke-width="0.6" transform="rotate(6 28 15)"/><circle cx="14" cy="24" r="2" fill="#E86A6A"/>`,

		ktable: () => `<defs><linearGradient id="woodl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F0C98F"/><stop offset="1" stop-color="#C9904F"/></linearGradient></defs>
			<g fill="#B87A44" stroke="#3A2015" stroke-width="1.2"><rect x="1.5" y="21" width="12" height="15" rx="3.5"/><rect x="1.5" y="63" width="12" height="15" rx="3.5"/><rect x="36.5" y="21" width="12" height="15" rx="3.5"/><rect x="36.5" y="63" width="12" height="15" rx="3.5"/></g>
			<rect x="11" y="8" width="28" height="84" rx="4" fill="url(#woodl)" stroke="#3A2015" stroke-width="1.5"/>
			<path d="M17 11c1 20-1 40 0 78M25 11c-1 25 1 50 0 78M33 11c1 22-1 44 0 78" stroke="rgba(110,60,20,0.25)" stroke-width="1" fill="none"/>
			<circle cx="25" cy="50" r="9" fill="#FFFFFF" stroke="#3A2015" stroke-width="1.2"/><circle cx="25" cy="50" r="6.5" fill="none" stroke="#5C8FB8" stroke-width="0.8"/>
			<circle cx="22.5" cy="48.5" r="3" fill="#E0463A"/><circle cx="27.8" cy="51.5" r="3" fill="#F2C14E"/><circle cx="26.2" cy="46.6" r="2.4" fill="#7CC27A"/><circle cx="23.5" cy="53" r="2.2" fill="#8E3E9A"/>`,

		shelf: () => `<rect x="3" y="2" width="22" height="96" rx="2" fill="#4A2C18" stroke="#1A0E06" stroke-width="1.5"/>
			<g stroke="#1A0E06" stroke-width="0.7">${['#B8463E', '#2F5F7A', '#E2B04A', '#3F8F4A', '#7A4E8A', '#ECE6DA', '#8E2B3E', '#C98F5A', '#2F5F7A', '#E2B04A', '#3F8F4A', '#7A4E8A', '#B8463E'].map((c, i) => `<rect x="6" y="${5 + i * 7}" width="${[16, 14, 16, 15, 16, 13][i % 6]}" height="6" fill="${c}"/>`).join('')}</g>
			<g fill="#E8C878"><rect x="7" y="7.5" width="14" height="0.8"/><rect x="7" y="21.5" width="14" height="0.8"/><rect x="7" y="49.5" width="14" height="0.8"/><rect x="7" y="77.5" width="14" height="0.8"/></g>
			<rect x="30" y="10" width="15" height="17" rx="2" fill="#6B4428" stroke="#1A0E06" stroke-width="1"/>
			<circle cx="37.5" cy="16" r="6.5" fill="#4F86B5" stroke="#1E3A55" stroke-width="1"/>
			<path d="M32.5 14c3 1.5 4-1 6 1.5s3 .5 4-1M33.5 19c2-1 3.5 0 5 1" stroke="#8CC46F" stroke-width="2" fill="none" stroke-linecap="round"/>
			<circle cx="35" cy="13.5" r="1.4" fill="rgba(255,255,255,0.6)"/>`,

		rug: () => `<path d="M12 5v3M16 5v3M20 5v3M24 5v3M28 5v3M32 5v3M36 5v3M12 92v3M16 92v3M20 92v3M24 92v3M28 92v3M32 92v3M36 92v3" stroke="#F2E8D3" stroke-width="1.4"/>
			<rect x="8" y="8" width="34" height="84" rx="2" fill="#A8302A" stroke="#4A1410" stroke-width="1.5"/>
			<rect x="12" y="12" width="26" height="76" rx="1" fill="none" stroke="#E8C878" stroke-width="2"/>
			<rect x="15" y="15" width="20" height="70" rx="1" fill="none" stroke="#1F4A6A" stroke-width="1.2" stroke-dasharray="2 2"/>
			<path d="M25 24l10 26-10 26-10-26z" fill="#1F4A6A" stroke="#E8C878" stroke-width="1.5"/>
			<path d="M25 34l5 16-5 16-5-16z" fill="#A8302A" stroke="#E8C878" stroke-width="1"/><circle cx="25" cy="50" r="3" fill="#F7D55A"/>`,

		dtable: () => `<defs><linearGradient id="mahog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9A5A36"/><stop offset="1" stop-color="#5A2E18"/></linearGradient><radialGradient id="flameg"><stop offset="0" stop-color="#FFE9A0" stop-opacity="0.9"/><stop offset="1" stop-color="#FFB040" stop-opacity="0"/></radialGradient></defs>
			<g fill="#5A2E18" stroke="#1F0E06" stroke-width="1.2"><rect x="19" y="1" width="14" height="10" rx="3"/><rect x="43" y="1" width="14" height="10" rx="3"/><rect x="67" y="1" width="14" height="10" rx="3"/><rect x="19" y="39" width="14" height="10" rx="3"/><rect x="43" y="39" width="14" height="10" rx="3"/><rect x="67" y="39" width="14" height="10" rx="3"/></g>
			<rect x="6" y="9" width="88" height="32" rx="14" fill="url(#mahog)" stroke="#1F0E06" stroke-width="1.5"/>
			<rect x="13" y="19" width="74" height="12" fill="#FBF3E2" opacity="0.92"/><path d="M13 19h74M13 31h74" stroke="#C9A04F" stroke-width="0.8"/>
			<g fill="#FFFFFF" stroke="#3A2015" stroke-width="0.9"><circle cx="24" cy="25" r="5.8"/><circle cx="76" cy="25" r="5.8"/></g>
			<g fill="none" stroke="#5C8FB8" stroke-width="0.7"><circle cx="24" cy="25" r="3.8"/><circle cx="76" cy="25" r="3.8"/></g>
			<circle cx="50" cy="25" r="5" fill="#4E9A54" stroke="#1F4A25" stroke-width="0.8"/><g fill="#E8556A"><circle cx="48" cy="23.5" r="1.4"/><circle cx="52" cy="26.5" r="1.4"/></g><circle cx="51.5" cy="23" r="1.2" fill="#F7D55A"/>
			<circle cx="38" cy="22" r="7" fill="url(#flameg)"/><circle cx="62" cy="22" r="7" fill="url(#flameg)"/>
			<circle cx="38" cy="25" r="2.4" fill="#C9A04F" stroke="#6A4A10" stroke-width="0.6"/><circle cx="62" cy="25" r="2.4" fill="#C9A04F" stroke="#6A4A10" stroke-width="0.6"/>
			<circle cx="38" cy="25" r="1" fill="#FFF3C0"/><circle cx="62" cy="25" r="1" fill="#FFF3C0"/>`,

		desk: () => `<defs><linearGradient id="deskg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A36"/><stop offset="1" stop-color="#5A3820"/></linearGradient><radialGradient id="lampglow"><stop offset="0" stop-color="#FFE9A0" stop-opacity="0.85"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient></defs>
			<rect x="5" y="5" width="72" height="30" rx="3" fill="url(#deskg)" stroke="#1F0E06" stroke-width="1.5"/><rect x="9" y="9" width="64" height="22" rx="1.5" fill="#2F5A46" opacity="0.6"/>
			<g transform="rotate(-8 18 20)"><rect x="11" y="11" width="14" height="18" fill="#FBF7EE" stroke="#3A2015" stroke-width="0.9"/><path d="M14 15h8M14 18h8M14 21h8M14 24h5" stroke="#8A8580" stroke-width="0.9"/></g>
			<rect x="31" y="10" width="24" height="18" rx="3" fill="#2F3B3F" stroke="#0E1416" stroke-width="1.2"/><rect x="34" y="11.5" width="18" height="4" rx="1" fill="#F2EDE3"/>
			<g fill="#D6D0C4">${[35.5, 39.5, 43.5, 47.5, 51].map((x) => `<circle cx="${x}" cy="19.5" r="1.1"/>`).join('')}${[37.5, 41.5, 45.5, 49.5].map((x) => `<circle cx="${x}" cy="23.5" r="1.1"/>`).join('')}</g>
			<circle cx="66" cy="17" r="11" fill="url(#lampglow)"/><circle cx="66" cy="17" r="6" fill="#2E7A55" stroke="#0E2A1C" stroke-width="1.1"/><circle cx="66" cy="17" r="2.6" fill="#FFE07A"/>
			<circle cx="40" cy="43" r="6.5" fill="#2A2624" stroke="#0A0806" stroke-width="1.1"/><path d="M34 40.5a7 7 0 0 1 12 0" fill="none" stroke="#6A6560" stroke-width="2.6"/>
			<rect x="81" y="6" width="15" height="36" rx="2" fill="#7E858A" stroke="#22282B" stroke-width="1.2"/><rect x="83" y="8" width="11" height="32" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
			<circle cx="88.5" cy="24" r="3.6" fill="#4A5054" stroke="#C9A04F" stroke-width="1"/><path d="M88.5 21.5v2.5" stroke="#C9A04F" stroke-width="0.9"/>`
	};

	function item(it, roomType, cell) {
		const [c1, c2] = SEAT[roomType] || SEAT.salon;
		const w = it.w * 50, h = it.h * 50;
		return `<svg width="${it.w * cell}" height="${it.h * cell}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${ITEM[it.id](c1, c2)}</svg>`;
	}

	// ---------- portraits (40 × 40) ----------

	const PEOPLE = {
		doctor: { bg: '#7A2A3A', bg2: '#C9566C', skin: '#EDBF95', hair: '#3B2A20', shirt: '#F4F1EA', style: 'short', glasses: 1, must: 1, innerV: '#5C8FB8', steth: 1 },
		count: { bg: '#203A6A', bg2: '#4F7AC2', skin: '#F3CBA5', hair: '#A8A8A8', shirt: '#22304E', style: 'short', mono: 1, must: 1, innerV: '#FFFFFF', tie: 1 },
		baroness: { bg: '#1E5A48', bg2: '#45A07F', skin: '#E2AA82', hair: '#B04A2E', shirt: '#7A2E62', style: 'long', pearl: 1, lips: 1 },
		butler: { bg: '#8A6420', bg2: '#E0B04A', skin: '#F2CCA8', hair: '#1E1A17', shirt: '#1F1B18', style: 'short', bow: 1, innerV: '#FFFFFF' },
		cook: { bg: '#2E5660', bg2: '#5E98A4', skin: '#C08A60', hair: '#2A1D16', shirt: '#F7F4EE', style: 'none', beard: 1, must: 1, chef: 1, buttons: 1 },
		gardener: { bg: '#4E5A20', bg2: '#94A44A', skin: '#D9A178', hair: '#6B4A2A', shirt: '#5E7A3A', style: 'short', straw: 1, beard: 1 },
		maid: { bg: '#4A2E5E', bg2: '#8E68B0', skin: '#F0C8A8', hair: '#2E1E14', shirt: '#26222A', style: 'bun', band: 1, collar: 1 },
		captain: { bg: '#5A4028', bg2: '#A8845A', skin: '#E8B48C', hair: '#D8D8D8', shirt: '#1E2A44', style: 'none', cap: 1, beard: 1, must: 1, medals: 1 },
		actress: { bg: '#6A1A3A', bg2: '#C04A7A', skin: '#F4D0B4', hair: '#E8C060', style: 'long', earrings: 1, lips: 1, shirt: '#B8321F', pearl: 1 }
	};

	function portrait(id, size = 40) {
		const p = PEOPLE[id];
		if (!p) return '';
		const s = (a) => `stroke="#2B211A" stroke-width="${a}"`;
		const parts = [];
		parts.push(`<path d="M2 42c0-9 7.5-14 18-14s18 5 18 14z" fill="${p.shirt}" ${s(1)}/>`);
		if (p.innerV) parts.push(`<path d="M15.5 28.6L20 36l4.5-7.4z" fill="${p.innerV}" ${s(0.7)}/>`);
		if (p.tie) parts.push('<path d="M19.1 30.5h1.8l.8 5-1.7 2-1.7-2z" fill="#8E2B3E"/>');
		if (p.buttons) parts.push('<g fill="#2B211A"><circle cx="17" cy="33" r="0.9"/><circle cx="23" cy="33" r="0.9"/><circle cx="17" cy="37" r="0.9"/><circle cx="23" cy="37" r="0.9"/></g>');
		if (p.medals) parts.push('<g stroke="#2B211A" stroke-width="0.5"><rect x="12.5" y="32" width="2.4" height="3" fill="#B8321F"/><rect x="15.2" y="32" width="2.4" height="3" fill="#2F6F9A"/><circle cx="13.7" cy="36.4" r="1.3" fill="#D9B25E"/><circle cx="16.4" cy="36.4" r="1.3" fill="#D9B25E"/></g><path d="M5 31.5h6M29 31.5h6" stroke="#D9B25E" stroke-width="1.8"/>');
		if (p.collar) parts.push(`<path d="M14 28.5l6 3 6-3-1 3.2-5 2-5-2z" fill="#FFFFFF" ${s(0.6)}/>`);
		parts.push(`<path d="M17 21h6v8.5c-1 1-5 1-6 0z" fill="${p.skin}"/><path d="M17 24.5c2 1.5 4 1.5 6 0v-3h-6z" fill="rgba(0,0,0,0.16)"/>`);
		if (p.steth) parts.push('<path d="M14.5 29c0 5 2.5 7.5 5.5 7.5s5.5-2.5 5.5-7.5" stroke="#55606A" stroke-width="1.2" fill="none"/><circle cx="20" cy="37" r="1.6" fill="#9AA2A6" stroke="#2B211A" stroke-width="0.5"/>');
		if (p.style === 'long') parts.push(`<path d="M10 17c0-8 4-11 10-11s10 3 10 11v12H10z" fill="${p.hair}" ${s(1)}/>`);
		parts.push(`<circle cx="12.6" cy="18" r="1.8" fill="${p.skin}" ${s(0.7)}/><circle cx="27.4" cy="18" r="1.8" fill="${p.skin}" ${s(0.7)}/>`);
		if (p.earrings) parts.push('<circle cx="12.6" cy="21" r="1.1" fill="#F1D58A" stroke="#8E6420" stroke-width="0.4"/><circle cx="27.4" cy="21" r="1.1" fill="#F1D58A" stroke="#8E6420" stroke-width="0.4"/>');
		parts.push(`<ellipse cx="20" cy="17" rx="7.5" ry="8.5" fill="${p.skin}" ${s(1)}/>`);
		parts.push('<circle cx="15.6" cy="20" r="1.6" fill="rgba(232,110,100,0.35)"/><circle cx="24.4" cy="20" r="1.6" fill="rgba(232,110,100,0.35)"/>');
		if (p.style === 'short' || p.style === 'bun') {
			parts.push(`<path d="M12.3 15c0-5.5 3.5-8.5 7.7-8.5s7.7 3 7.7 8.5c-1.5-2.5-4.5-3.8-7.7-3.8s-6.2 1.3-7.7 3.8z" fill="${p.hair}" ${s(0.9)}/>`);
			parts.push('<path d="M15.5 9.2c2-1 4.6-1.2 6.6-.5" stroke="rgba(255,255,255,0.4)" stroke-width="1.1" fill="none" stroke-linecap="round"/>');
		}
		if (p.style === 'bun') parts.push(`<circle cx="20" cy="5.2" r="3.4" fill="${p.hair}" ${s(0.9)}/>`);
		if (p.style === 'long') {
			parts.push(`<path d="M12.3 15c0-5.5 3.5-8.5 7.7-8.5s7.7 3 7.7 8.5c-3-1-5-3-7.5-5-1.5 3-5 4.5-7.9 5z" fill="${p.hair}"/>`);
			parts.push('<path d="M15 9.5c2-1.3 4.5-1.6 6.5-1" stroke="rgba(255,255,255,0.35)" stroke-width="1.1" fill="none" stroke-linecap="round"/>');
		}
		if (p.beard) parts.push(`<path d="M12.6 18.5c0 5.8 3.4 8.6 7.4 8.6s7.4-2.8 7.4-8.6c-1.5 2.8-3.5 3.6-7.4 3.6s-5.9-.8-7.4-3.6z" fill="${p.hair}"/>`);
		parts.push(`<path d="M15.3 14.6q1.7-1 3.2 0M21.5 14.6q1.7-1 3.2 0" stroke="${p.style === 'none' && !p.beard ? '#3B2A20' : p.hair === '#E8C060' ? '#A87A30' : p.hair}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`);
		parts.push('<circle cx="17" cy="17" r="1.1" fill="#1A120C"/><circle cx="23" cy="17" r="1.1" fill="#1A120C"/><circle cx="17.35" cy="16.6" r="0.38" fill="#FFFFFF"/><circle cx="23.35" cy="16.6" r="0.38" fill="#FFFFFF"/>');
		parts.push('<path d="M20 17.6v2.5l-1 .6" stroke="rgba(80,40,25,0.45)" stroke-width="0.8" fill="none" stroke-linecap="round"/>');
		parts.push(`<path d="M17.6 22.6q2.4 1.8 4.8 0" stroke="${p.lips ? '#C0303A' : '#7A2E28'}" stroke-width="${p.lips ? 1.3 : 0.9}" fill="none" stroke-linecap="round"/>`);
		if (p.glasses) parts.push('<g fill="rgba(255,255,255,0.12)" stroke="#2B211A" stroke-width="0.95"><circle cx="17" cy="17" r="2.6"/><circle cx="23" cy="17" r="2.6"/><path d="M19.6 17h0.8"/></g>');
		if (p.mono) parts.push('<circle cx="23" cy="17" r="2.7" fill="rgba(255,255,255,0.15)" stroke="#D9B25E" stroke-width="1.1"/><path d="M25.5 18.5q2 4-1 9" stroke="#D9B25E" stroke-width="0.6" fill="none"/>');
		if (p.must) parts.push(`<path d="M15.5 21.4c1.5-1.6 3.6-1.1 4.5 0 .9-1.1 3-1.6 4.5 0-1.5 1.3-3 1.1-4.5.3-1.5.8-3 1-4.5-.3z" fill="${p.hair}"/>`);
		if (p.bow) parts.push(`<path d="M16 29l4 2-4 2zM24 29l-4 2 4 2z" fill="#B8321F" ${s(0.7)}/>`);
		if (p.pearl) parts.push('<path d="M14.5 28.5c2 2.2 9 2.2 11 0" stroke="#FFFDF7" stroke-width="2.1" stroke-dasharray="0.1 2.4" stroke-linecap="round" fill="none"/>');
		if (p.chef) parts.push(`<path d="M13 12c-3 0-4-4-1-5 0-3 4-4 6-2 1-2 5-2 6 0 2-2 6-1 6 2 3 1 2 5-1 5z" fill="#FFFFFF" ${s(0.9)}/><rect x="13" y="10" width="14" height="3.4" fill="#F2EEE6" ${s(0.9)}/>`);
		if (p.straw) parts.push(`<ellipse cx="20" cy="10.8" rx="12.5" ry="3.3" fill="#E2C36A" ${s(0.9)}/><path d="M13.5 10.5c0-4 3-6.2 6.5-6.2s6.5 2.2 6.5 6.2z" fill="#D9B25E" ${s(0.9)}/><path d="M13.6 9.3h12.8" stroke="#8E2B3E" stroke-width="1.4"/>`);
		if (p.band) parts.push('<path d="M12.8 11.8q7.2-5.4 14.4 0" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round"/>');
		if (p.cap) parts.push(`<path d="M11.5 11.5c1-4.5 4.5-6.8 8.5-6.8s7.5 2.3 8.5 6.8z" fill="#1E2A44" ${s(0.9)}/><rect x="10.8" y="10.4" width="18.4" height="2.8" rx="1" fill="#141B2E" ${s(0.6)}/><circle cx="20" cy="8.2" r="1.5" fill="#D9B25E"/>`);
		return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">${parts.join('')}</svg>`;
	}

	function colour(id) {
		return PEOPLE[id]?.bg2 ?? '#999';
	}

	function tokenBg(id) {
		const p = PEOPLE[id];
		return p ? `radial-gradient(circle at 50% 35%, ${p.bg2}, ${p.bg} 75%)` : '#333';
	}

	const chalk = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" stroke="#FFFFFF" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 2.4" aria-hidden="true"><circle cx="18" cy="8" r="4"/><path d="M18 12v11M8 17l10 2 10-2M14 33l4-10 4 10"/></svg>`;

	return { floor, item, portrait, colour, tokenBg, chalk, PEOPLE };
})();
