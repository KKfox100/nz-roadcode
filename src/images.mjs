/**
 * 自绘图示库 —— 全部为原创 SVG，不依赖任何外部图片资源。
 *
 * 两类：
 *   signs     道路标志牌，viewBox 200x200
 *   diagrams  路口场景示意图，viewBox 400x300
 */

const FONT = "'Segoe UI', 'Microsoft YaHei', Arial, Helvetica, sans-serif";

/* ---------- 基础形状 ---------- */

const diamond = (fill, stroke = '#1f2937', inner = '') => `
  <polygon points="100,6 194,100 100,194 6,100" fill="${fill}" stroke="${stroke}" stroke-width="7" stroke-linejoin="round"/>
  ${inner}`;

const circle = (fill, stroke, sw, inner = '') => `
  <circle cx="100" cy="100" r="91" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  ${inner}`;

const roundRect = (fill, stroke, inner = '', rx = 10) => `
  <rect x="6" y="34" width="188" height="132" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="7"/>
  ${inner}`;

const txt = (s, size, fill = '#1f2937', y = 100, weight = '700', x = 100) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle" dominant-baseline="central">${s}</text>`;

/* ---------- 道路标志 ---------- */

export const signs = {
  'sign-stop': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="停车标志">
      <polygon points="61,8 139,8 192,61 192,139 139,192 61,192 8,139 8,61"
               fill="#dc2626" stroke="#ffffff" stroke-width="10" stroke-linejoin="round"/>
      <polygon points="61,8 139,8 192,61 192,139 139,192 61,192 8,139 8,61"
               fill="none" stroke="#dc2626" stroke-width="4" stroke-linejoin="round"/>
      ${txt('STOP', 42, '#ffffff', 104, '800')}
    </svg>`,

  'sign-giveway': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="让行标志">
      <polygon points="100,182 6,18 194,18" fill="#dc2626" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
      <polygon points="100,146 46,42 154,42" fill="#ffffff"/>
      ${txt('GIVE', 26, '#dc2626', 74, '800')}
      ${txt('WAY', 26, '#dc2626', 104, '800')}
    </svg>`,

  'sign-speed-50': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="限速 50">
      ${circle('#ffffff', '#dc2626', 20)}
      ${txt('50', 76, '#1f2937', 104, '800')}
    </svg>`,

  'sign-no-entry': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="禁止驶入">
      ${circle('#dc2626', '#ffffff', 10)}
      <rect x="30" y="88" width="140" height="26" rx="6" fill="#ffffff"/>
    </svg>`,

  'sign-roundabout': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="环岛标志">
      ${circle('#1d4ed8', '#ffffff', 8)}
      <g fill="none" stroke="#ffffff" stroke-width="15" stroke-linecap="round">
        <path d="M100 44 A56 56 0 0 1 156 100"/>
        <path d="M156 100 A56 56 0 0 1 100 156"/>
        <path d="M100 156 A56 56 0 0 1 44 100"/>
      </g>
      <polygon points="152,74 168,102 136,102" fill="#ffffff"/>
      <polygon points="100,152 128,168 100,136" fill="#ffffff" transform="rotate(120 100 100)"/>
      <polygon points="100,152 128,168 100,136" fill="#ffffff" transform="rotate(240 100 100)"/>
    </svg>`,

  'sign-pedestrian': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="人行横道">
      <rect x="6" y="6" width="188" height="188" rx="12" fill="#1d4ed8" stroke="#ffffff" stroke-width="8"/>
      <g fill="#ffffff">
        <circle cx="96" cy="56" r="14"/>
        <path d="M96 72 L96 118 L74 158 L86 158 L104 124 L120 158 L132 158 L112 118 L112 72 Z"/>
        <rect x="60" y="150" width="80" height="9" rx="3"/>
        <rect x="60" y="166" width="80" height="9" rx="3"/>
      </g>
    </svg>`,

  'sign-school': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="学校区域">
      ${diamond('#facc15', '#1f2937', `
        <g fill="#1f2937">
          <circle cx="78" cy="72" r="12"/>
          <path d="M78 86 L78 124 L62 152 L72 152 L84 128 L96 152 L106 152 L90 124 L90 86 Z"/>
          <circle cx="126" cy="88" r="10"/>
          <path d="M126 100 L126 130 L114 152 L123 152 L132 134 L141 152 L150 152 L138 130 L138 100 Z"/>
        </g>`)}
    </svg>`,

  'sign-no-overtaking': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="禁止超车">
      ${circle('#ffffff', '#dc2626', 18, `
        <g>
          <rect x="52" y="72" width="42" height="26" rx="8" fill="#1f2937"/>
          <rect x="58" y="66" width="26" height="12" rx="5" fill="#1f2937"/>
          <circle cx="61" cy="102" r="7" fill="#1f2937"/>
          <circle cx="86" cy="102" r="7" fill="#1f2937"/>
          <rect x="106" y="104" width="42" height="26" rx="8" fill="#dc2626"/>
          <rect x="112" y="98" width="26" height="12" rx="5" fill="#dc2626"/>
          <circle cx="115" cy="134" r="7" fill="#1f2937"/>
          <circle cx="140" cy="134" r="7" fill="#1f2937"/>
        </g>`)}
    </svg>`,

  'sign-roadworks': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="道路施工">
      ${diamond('#f97316', '#1f2937', `
        <g fill="#1f2937">
          <path d="M58 148 L86 82 L114 148 Z"/>
          <rect x="92" y="56" width="10" height="30" rx="4"/>
          <path d="M102 58 L134 74 L102 90 Z"/>
          <circle cx="86" cy="60" r="11"/>
        </g>`)}
    </svg>`,

  'sign-curve-right': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="前方右弯">
      ${diamond('#facc15', '#1f2937', `
        <path d="M80 152 L80 108 Q80 76 116 76" fill="none" stroke="#1f2937" stroke-width="16" stroke-linecap="round"/>
        <polygon points="150,76 116,52 116,100" fill="#1f2937"/>`)}
    </svg>`,

  'sign-no-stopping': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="禁止停靠">
      ${circle('#1d4ed8', '#dc2626', 18, `
        <g stroke="#dc2626" stroke-width="17" stroke-linecap="round">
          <line x1="42" y1="42" x2="158" y2="158"/>
          <line x1="158" y1="42" x2="42" y2="158"/>
        </g>`)}
    </svg>`,

  'sign-one-way': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="单行道">
      <rect x="10" y="58" width="180" height="84" rx="10" fill="#1d4ed8" stroke="#ffffff" stroke-width="8"/>
      <polygon points="170,100 120,68 120,132" fill="#ffffff"/>
      <rect x="46" y="86" width="80" height="28" rx="6" fill="#ffffff"/>
    </svg>`,

  'sign-keep-left': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="靠左行驶">
      ${circle('#1d4ed8', '#ffffff', 8, `
        <path d="M126 50 L78 100 L126 150" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
        <polygon points="78,100 122,64 122,136" fill="#ffffff" transform="rotate(-90 78 100)"/>`)}
    </svg>`,

  'sign-railway': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="铁路道口">
      ${diamond('#facc15', '#1f2937', `
        <g stroke="#1f2937" stroke-width="11" stroke-linecap="round">
          <line x1="52" y1="52" x2="148" y2="148"/>
          <line x1="148" y1="52" x2="52" y2="148"/>
        </g>
        <g fill="#1f2937">
          <rect x="72" y="128" width="56" height="26" rx="7"/>
          <rect x="80" y="112" width="40" height="18" rx="6"/>
          <circle cx="84" cy="158" r="7"/>
          <circle cx="116" cy="158" r="7"/>
        </g>`)}
    </svg>`,

  'sign-speed-bump': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="减速带">
      ${diamond('#facc15', '#1f2937', `
        <path d="M30 130 Q100 60 170 130" fill="none" stroke="#1f2937" stroke-width="14" stroke-linecap="round"/>
        <line x1="30" y1="146" x2="170" y2="146" stroke="#1f2937" stroke-width="9" stroke-linecap="round"/>`)}
    </svg>`,

  'sign-no-uturn': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="禁止掉头">
      ${circle('#ffffff', '#dc2626', 18, `
        <path d="M70 148 L70 92 A30 30 0 0 1 130 92 L130 120" fill="none" stroke="#1f2937" stroke-width="15" stroke-linecap="round"/>
        <polygon points="130,142 108,112 152,112" fill="#1f2937"/>
        <line x1="44" y1="44" x2="156" y2="156" stroke="#dc2626" stroke-width="17" stroke-linecap="round"/>`)}
    </svg>`,

  'sign-clearway': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="清空车道">
      ${roundRect('#1d4ed8', '#ffffff', `
        <g stroke="#ffffff" stroke-width="8" stroke-linecap="round">
          <line x1="30" y1="62" x2="170" y2="62"/>
          <line x1="30" y1="138" x2="170" y2="138"/>
        </g>
        ${txt('CLEARWAY', 25, '#ffffff', 100, '800')}`)}
    </svg>`,

  'sign-motorway': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="高速公路">
      ${roundRect('#15803d', '#ffffff', `
        <g fill="#ffffff">
          <rect x="66" y="52" width="16" height="94" rx="7"/>
          <rect x="118" y="52" width="16" height="94" rx="7"/>
          <path d="M100 52 Q76 76 76 100 Q76 124 100 148" fill="none" stroke="#ffffff" stroke-width="10"/>
          <path d="M100 52 Q124 76 124 100 Q124 124 100 148" fill="none" stroke="#ffffff" stroke-width="10"/>
        </g>`)}
    </svg>`,

  'sign-bus-lane': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="公交专用道">
      <rect x="10" y="40" width="180" height="120" rx="10" fill="#1d4ed8" stroke="#ffffff" stroke-width="8"/>
      ${txt('BUS', 40, '#ffffff', 78, '800')}
      <rect x="52" y="118" width="96" height="24" rx="6" fill="#ffffff"/>
      <circle cx="72" cy="146" r="9" fill="#1d4ed8" stroke="#ffffff" stroke-width="4"/>
      <circle cx="128" cy="146" r="9" fill="#1d4ed8" stroke="#ffffff" stroke-width="4"/>
    </svg>`,

  'sign-crossroad': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="前方十字路口">
      ${diamond('#facc15', '#1f2937', `
        <g stroke="#1f2937" stroke-width="15" stroke-linecap="square">
          <line x1="100" y1="46" x2="100" y2="154"/>
          <line x1="46" y1="100" x2="154" y2="100"/>
        </g>`)}
    </svg>`,

  'sign-t-intersection': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="前方 T 型路口">
      ${diamond('#facc15', '#1f2937', `
        <g stroke="#1f2937" stroke-width="15" stroke-linecap="square">
          <line x1="48" y1="74" x2="152" y2="74"/>
          <line x1="100" y1="74" x2="100" y2="152"/>
        </g>`)}
    </svg>`,

  'sign-narrow-bridge': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="前方窄桥">
      ${diamond('#facc15', '#1f2937', `
        <g stroke="#1f2937" stroke-width="9" fill="none" stroke-linecap="round">
          <path d="M42 78 L42 128 L78 128"/>
          <path d="M158 78 L158 128 L122 128"/>
          <line x1="42" y1="78" x2="158" y2="78"/>
        </g>`)}
    </svg>`,

  'sign-steep-descent': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="陡坡下坡">
      ${diamond('#facc15', '#1f2937', `
        <polygon points="48,148 152,148 152,68" fill="#1f2937"/>
        ${txt('10%', 26, '#facc15', 128, '800')}`)}
    </svg>`,

  'sign-slippery': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="路面湿滑">
      ${diamond('#facc15', '#1f2937', `
        <g fill="#1f2937">
          <rect x="52" y="102" width="66" height="26" rx="9"/>
          <rect x="60" y="90" width="42" height="18" rx="7"/>
          <circle cx="66" cy="134" r="9"/>
          <circle cx="104" cy="134" r="9"/>
        </g>
        <g stroke="#1f2937" stroke-width="7" fill="none" stroke-linecap="round">
          <path d="M118 62 Q142 74 122 92"/>
          <path d="M140 52 Q168 66 146 88"/>
        </g>`)}
    </svg>`,

  'sign-hospital': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="医院">
      <rect x="6" y="6" width="188" height="188" rx="12" fill="#1d4ed8" stroke="#ffffff" stroke-width="8"/>
      <g fill="#ffffff">
        <rect x="82" y="46" width="36" height="108" rx="6"/>
        <rect x="46" y="82" width="108" height="36" rx="6"/>
      </g>
    </svg>`,

  'sign-no-left-turn': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="禁止左转">
      ${circle('#ffffff', '#dc2626', 18, `
        <path d="M132 148 L132 100 Q132 74 106 74 L78 74" fill="none" stroke="#1f2937" stroke-width="15" stroke-linecap="round"/>
        <polygon points="52,74 84,52 84,96" fill="#1f2937"/>
        <line x1="44" y1="156" x2="156" y2="44" stroke="#dc2626" stroke-width="17" stroke-linecap="round"/>`)}
    </svg>`,

  'sign-rumble-strip': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="颠簸路面">
      ${diamond('#facc15', '#1f2937', `
        <g stroke="#1f2937" stroke-width="9" fill="none" stroke-linecap="round">
          <path d="M40 108 L66 84 L92 108 L118 84 L144 108 L160 92"/>
          <line x1="40" y1="140" x2="160" y2="140"/>
        </g>`)}
    </svg>`,

  'sign-cycle-lane': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="自行车道">
      <rect x="6" y="6" width="188" height="188" rx="12" fill="#1d4ed8" stroke="#ffffff" stroke-width="8"/>
      <g fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round">
        <circle cx="64" cy="126" r="26"/>
        <circle cx="140" cy="126" r="26"/>
        <path d="M64 126 L92 78 L124 78 M92 78 L110 126 M124 78 L140 126"/>
      </g>
      <circle cx="110" cy="58" r="9" fill="#ffffff"/>
    </svg>`,

  'sign-loading-zone': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="货车装卸区">
      <rect x="10" y="48" width="180" height="104" rx="10" fill="#ffffff" stroke="#1f2937" stroke-width="8"/>
      <g fill="#1f2937">
        <rect x="34" y="86" width="60" height="34" rx="5"/>
        <path d="M94 96 L124 96 L140 112 L140 120 L94 120 Z"/>
        <circle cx="58" cy="128" r="10"/>
        <circle cx="122" cy="128" r="10"/>
      </g>
      ${txt('LOADING', 21, '#1f2937', 68, '800')}
    </svg>`,

  'sign-traffic-light': () => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="前方有信号灯">
      ${diamond('#facc15', '#1f2937', `
        <rect x="76" y="46" width="48" height="108" rx="14" fill="#1f2937"/>
        <circle cx="100" cy="72" r="12" fill="#ef4444"/>
        <circle cx="100" cy="100" r="12" fill="#facc15"/>
        <circle cx="100" cy="128" r="12" fill="#22c55e"/>`)}
    </svg>`,
};

/* ---------- 路口场景示意图 ---------- */

/**
 * 一辆车。标签画在**车身正中**，而不是车身外侧 ——
 * 画在外侧时标签会随朝向跑出 viewBox（靠下的车尤其容易），
 * 也会和示意图的说明文字撞在一起。
 */
const car = (x, y, w, h, fill, label, dir = 'up') => {
  const rot = { up: 0, down: 180, left: 90, right: -90 }[dir];
  const cx = x + w / 2;
  const cy = y + h / 2;
  return `
    <g transform="rotate(${rot} ${cx} ${cy})">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 3}" fill="${fill}" stroke="#0f172a" stroke-width="2.5"/>
      <rect x="${x + w * 0.16}" y="${y + h * 0.10}" width="${w * 0.68}" height="${h * 0.20}" rx="4" fill="#dbeafe" opacity="0.9"/>
      <rect x="${x + w * 0.16}" y="${y + h * 0.68}" width="${w * 0.68}" height="${h * 0.20}" rx="4" fill="#dbeafe" opacity="0.55"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
    <text x="${cx}" y="${cy + 1}" font-family="${FONT}" font-size="15" font-weight="800" fill="#0f172a" text-anchor="middle" dominant-baseline="central">${label}</text>`;
};

const roadV = (x, w, h = 300) => `<rect x="${x}" y="0" width="${w}" height="${h}" fill="#cbd5e1"/>`;
const roadH = (y, h, w = 400) => `<rect x="0" y="${y}" width="${w}" height="${h}" fill="#cbd5e1"/>`;

const dashes = (points, horizontal) =>
  points.map(p => horizontal
    ? `<line x1="${p}" y1="150" x2="${p + 26}" y2="150" stroke="#ffffff" stroke-width="4"/>`
    : `<line x1="200" y1="${p}" x2="200" y2="${p + 26}" stroke="#ffffff" stroke-width="4"/>`
  ).join('');

export const diagrams = {
  'sv-crossroads': () => `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="无标志十字路口让行示意">
      <rect width="400" height="300" fill="#f1f5f9"/>
      ${roadV(152, 96)}
      ${roadH(102, 96)}
      ${dashes([20, 66, 210, 256], false)}
      ${dashes([20, 66, 262, 308], true)}
      ${car(178, 196, 44, 78, '#2563eb', '蓝')}
      ${car(258, 128, 78, 44, '#dc2626', '红', 'left')}
    </svg>`,

  'sv-roundabout': () => `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="环岛让行示意">
      <rect width="400" height="300" fill="#f1f5f9"/>
      ${roadV(152, 96)}
      ${roadH(102, 96)}
      <circle cx="200" cy="150" r="62" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0"/>
      <circle cx="200" cy="150" r="62" fill="none" stroke="#cbd5e1" stroke-width="46"/>
      <circle cx="200" cy="150" r="39" fill="#a7f3d0" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="200" cy="150" r="85" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="14 10"/>
      ${car(258, 108, 74, 42, '#dc2626', '红', 'left')}
      ${car(180, 214, 42, 74, '#2563eb', '蓝')}
    </svg>`,

  'sv-t-junction': () => `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="T 型路口让行示意">
      <rect width="400" height="300" fill="#f1f5f9"/>
      ${roadH(84, 96)}
      <rect x="152" y="180" width="96" height="120" fill="#cbd5e1"/>
      ${dashes([20, 66, 262, 308], true)}
      <line x1="200" y1="196" x2="200" y2="222" stroke="#ffffff" stroke-width="4"/>
      ${car(74, 110, 78, 44, '#dc2626', '红', 'right')}
      ${car(178, 200, 44, 78, '#2563eb', '蓝')}
    </svg>`,

  'sv-right-turn': () => `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="右转让直行示意">
      <rect width="400" height="300" fill="#f1f5f9"/>
      ${roadV(152, 96)}
      ${roadH(102, 96)}
      ${dashes([20, 66, 210, 256], false)}
      ${dashes([20, 66, 262, 308], true)}
      ${car(180, 196, 42, 74, '#2563eb', '蓝')}
      ${car(180, 26, 42, 74, '#dc2626', '红', 'down')}
      <path d="M202 214 Q202 150 268 150" fill="none" stroke="#2563eb" stroke-width="4" stroke-dasharray="9 7" marker-end="url(#arw)"/>
      <defs>
        <marker id="arw" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0 0 L7 3 L0 6 Z" fill="#2563eb"/>
        </marker>
      </defs>
    </svg>`,
};

/* ---------- 道路标线（俯视） ----------

   标线和标志牌是两种东西：标志牌考「这个牌子什么意思」，标线考「路上这条线
   能不能压」。后者光靠文字描述（「黄色实线」「白色虚线」）很容易背混，
   所以这里全部画成俯视图 —— 学习时看到的就是实际开车时看到的样子。

   配色沿用场景图：路面 #cbd5e1，白色标线 #ffffff，黄色标线 #f0b429
   （新西兰黄线偏橙，不是纯黄）。
*/

const RM = '#cbd5e1';   // 路面
const RB = '#f1f5f9';   // 路面以外的背景
const RW = '#ffffff';   // 白色标线
const RY = '#f0b429';   // 黄色标线

/** 一条水平双向道路；centerLine / edge 由调用方给出 */
const lane = (centerLine = '', edge = '') => `
  <rect width="400" height="240" fill="${RB}"/>
  <rect x="0" y="60" width="400" height="120" fill="${RM}"/>
  ${edge}
  ${centerLine}`;

export const markings = {
  'mark-center-yellow-solid': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="道路中央黄色实线">
      ${lane(`<line x1="0" y1="120" x2="400" y2="120" stroke="${RY}" stroke-width="7"/>`)}
    </svg>`,

  'mark-center-yellow-dashed': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="道路中央黄色虚线">
      ${lane(`<line x1="0" y1="120" x2="400" y2="120" stroke="${RY}" stroke-width="7" stroke-dasharray="40 30"/>`)}
    </svg>`,

  'mark-center-white-dashed': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="道路中央白色虚线">
      ${lane(`<line x1="0" y1="120" x2="400" y2="120" stroke="${RW}" stroke-width="7" stroke-dasharray="40 30"/>`)}
    </svg>`,

  'mark-center-white-solid': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="道路中央白色实线">
      ${lane(`<line x1="0" y1="120" x2="400" y2="120" stroke="${RW}" stroke-width="7"/>`)}
    </svg>`,

  'mark-edge-white-solid': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="道路边缘白色实线">
      ${lane('', `
        <line x1="0" y1="74" x2="400" y2="74" stroke="${RW}" stroke-width="6"/>
        <line x1="0" y1="166" x2="400" y2="166" stroke="${RW}" stroke-width="6"/>`)}
    </svg>`,

  'mark-edge-yellow-dashed': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="路边黄色虚线">
      ${lane('', `
        <line x1="0" y1="82" x2="400" y2="82" stroke="${RY}" stroke-width="7" stroke-dasharray="40 30"/>
        <line x1="0" y1="158" x2="400" y2="158" stroke="${RY}" stroke-width="7" stroke-dasharray="40 30"/>`)}
    </svg>`,

  'mark-edge-yellow-solid': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="路边黄色实线">
      ${lane('', `
        <line x1="0" y1="82" x2="400" y2="82" stroke="${RY}" stroke-width="7"/>
        <line x1="0" y1="158" x2="400" y2="158" stroke="${RY}" stroke-width="7"/>`)}
    </svg>`,

  'mark-hatched-median': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="中央斜线阴影区">
      ${lane('')}
      <line x1="70" y1="96" x2="330" y2="96" stroke="${RW}" stroke-width="5"/>
      <line x1="70" y1="144" x2="330" y2="144" stroke="${RW}" stroke-width="5"/>
      <g stroke="${RW}" stroke-width="5" stroke-linecap="round">
        <line x1="76" y1="144" x2="100" y2="96"/>
        <line x1="116" y1="144" x2="140" y2="96"/>
        <line x1="156" y1="144" x2="180" y2="96"/>
        <line x1="196" y1="144" x2="220" y2="96"/>
        <line x1="236" y1="144" x2="260" y2="96"/>
        <line x1="276" y1="144" x2="300" y2="96"/>
        <line x1="316" y1="144" x2="330" y2="112"/>
      </g>
    </svg>`,

  'mark-yellow-box': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="黄色网格禁停区">
      <rect width="400" height="240" fill="${RB}"/>
      <rect x="0" y="24" width="400" height="192" fill="${RM}"/>
      <rect x="96" y="46" width="208" height="148" fill="none" stroke="${RY}" stroke-width="6"/>
      <g stroke="${RY}" stroke-width="5" stroke-linecap="round">
        <line x1="96" y1="46" x2="200" y2="194"/>
        <line x1="96" y1="120" x2="304" y2="46"/>
        <line x1="96" y1="194" x2="304" y2="120"/>
        <line x1="200" y1="46" x2="304" y2="194"/>
      </g>
    </svg>`,

  'mark-zebra-crossing': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="人行横道（斑马线）">
      ${lane('')}
      <g fill="${RW}">
        <rect x="83" y="60" width="34" height="120"/>
        <rect x="133" y="60" width="34" height="120"/>
        <rect x="183" y="60" width="34" height="120"/>
        <rect x="233" y="60" width="34" height="120"/>
        <rect x="283" y="60" width="34" height="120"/>
      </g>
    </svg>`,

  'mark-cycle-lane': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="自行车道">
      <rect width="400" height="240" fill="${RB}"/>
      <rect x="0" y="40" width="400" height="160" fill="${RM}"/>
      <rect x="0" y="40" width="400" height="46" fill="#dbe3ea"/>
      <line x1="0" y1="86" x2="400" y2="86" stroke="${RW}" stroke-width="6"/>
      <line x1="0" y1="120" x2="400" y2="120" stroke="${RW}" stroke-width="6" stroke-dasharray="40 30"/>
      <g transform="translate(170,44) scale(1.05)" fill="none" stroke="${RW}" stroke-width="5" stroke-linecap="round">
        <circle cx="12" cy="30" r="11"/>
        <circle cx="52" cy="30" r="11"/>
        <path d="M12 30 L26 12 L42 12 L52 30 M26 12 L32 30 L12 30 M42 12 L36 30"/>
      </g>
    </svg>`,

  'mark-no-marking-junction': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="没有标志也没有标线的十字路口">
      <rect width="400" height="240" fill="${RB}"/>
      <rect x="0" y="76" width="400" height="88" fill="${RM}"/>
      <rect x="156" y="0" width="88" height="240" fill="${RM}"/>
    </svg>`,

  'mark-bridge-giveway': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="单车道桥，本侧须让行">
      <rect width="400" height="240" fill="${RB}"/>
      <rect x="0" y="72" width="400" height="96" fill="${RM}"/>
      <rect x="146" y="96" width="108" height="48" fill="#aab6c2"/>
      <line x1="146" y1="96" x2="254" y2="96" stroke="#64748b" stroke-width="6"/>
      <line x1="146" y1="144" x2="254" y2="144" stroke="#64748b" stroke-width="6"/>
      <circle cx="70" cy="120" r="30" fill="#dc2626" stroke="#ffffff" stroke-width="5"/>
      <polygon points="70,102 86,132 54,132" fill="#ffffff"/>
      <polygon points="70,102 86,132 54,132" fill="none"/>
      <text x="70" y="176" font-family="${FONT}" font-size="15" font-weight="700" fill="#b91c1c" text-anchor="middle">让行</text>
    </svg>`,

  'mark-bridge-priority': () => `
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="单车道桥，本侧优先通行">
      <rect width="400" height="240" fill="${RB}"/>
      <rect x="0" y="72" width="400" height="96" fill="${RM}"/>
      <rect x="146" y="96" width="108" height="48" fill="#aab6c2"/>
      <line x1="146" y1="96" x2="254" y2="96" stroke="#64748b" stroke-width="6"/>
      <line x1="146" y1="144" x2="254" y2="144" stroke="#64748b" stroke-width="6"/>
      <rect x="40" y="92" width="60" height="56" rx="6" fill="#1d4ed8" stroke="#ffffff" stroke-width="5"/>
      <polygon points="70,102 90,120 70,138" fill="#ffffff"/>
      <text x="70" y="176" font-family="${FONT}" font-size="15" font-weight="700" fill="#1d4ed8" text-anchor="middle">优先</text>
    </svg>`
};

/**
 * 场景示意图的文字说明。
 * 刻意**不画进 SVG 里** —— 画在 SVG 内会和车辆标签抢位置（两者都在图的下方），
 * 而且中文字体在 SVG 里没有换行能力。放到 HTML 里排版更可控。
 */
/* ---------- 缩略图专用的加粗版标线 ----------

   列表里的缩略图只有几十像素宽。标线图的 viewBox 是 400 宽、线宽 7，
   缩到 50px 时线只剩 0.9px —— 白线在浅色路面上直接消失，缩略图就成
   了一块空白色块。

   这里只把**标线本身**的描边放大（白色和黄色），不碰其他描边：
   单车道桥那两张图里有个红圈让行标志，它的白边如果一起放大 3 倍
   会变成一坨。所以按颜色精确匹配。
*/
const scaleMarkingStrokes = (svg, s) =>
  svg.replace(
    /stroke="(#ffffff|#f0b429)" stroke-width="([\d.]+)"/g,
    (_, color, w) => `stroke="${color}" stroke-width="${+(parseFloat(w) * s).toFixed(2)}"`
  );

export const thumbnails = Object.fromEntries(
  Object.entries(markings).map(([key, fn]) => [key, () => scaleMarkingStrokes(fn(), 3)])
);

export const captions = {
  'sv-crossroads': '无标志十字路口 · 蓝车直行，红车从右侧驶来',
  'sv-roundabout': '环岛 · 蓝车准备进入，红车已在环岛内',
  'sv-t-junction': 'T 型路口 · 蓝车在支路，红车在贯通道路',
  'sv-right-turn': '蓝车右转 · 红车对向直行'
};

export const allImages = { ...signs, ...diagrams, ...markings };

/** 按 key 取 SVG；找不到时返回一个占位图而不是抛错。 */
export function renderImage(key) {
  const fn = allImages[key];
  if (!fn) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="4"/><text x="100" y="100" font-family="${FONT}" font-size="14" fill="#94a3b8" text-anchor="middle" dominant-baseline="central">暂无图示</text></svg>`;
  }
  return fn();
}

export const imageKeys = Object.keys(allImages);
