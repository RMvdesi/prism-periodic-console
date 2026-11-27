/*!
 * PRISM-118 · Periodic Console — Curatorial Monograph & Single-GPU Exhibition Controller
 * Copyright (c) 2026 RMvdesi (https://github.com/RMvdesi). All Rights Reserved.
 * Original Design for Obsidian Prism (https://github.com/RMvdesi/obsidian-prism)
 */
(function () {
  'use strict';

  var TELEMETRY_PRESETS = [
    {
      tag: '27%',
      usedTokens: 142336,
      maxTokens: 524288,
      cacheHitRate: 0.94,
      tps: 148,
      history: [0.16, 0.19, 0.18, 0.22, 0.24, 0.21, 0.25, 0.26, 0.24, 0.27, 0.28, 0.27],
    },
    {
      tag: '54%',
      usedTokens: 283115,
      maxTokens: 524288,
      cacheHitRate: 0.91,
      tps: 132,
      history: [0.28, 0.33, 0.36, 0.39, 0.42, 0.45, 0.44, 0.48, 0.51, 0.50, 0.53, 0.54],
    },
    {
      tag: '84%',
      usedTokens: 440402,
      maxTokens: 524288,
      cacheHitRate: 0.87,
      tps: 108,
      history: [0.56, 0.61, 0.65, 0.68, 0.72, 0.75, 0.74, 0.78, 0.80, 0.82, 0.83, 0.84],
    },
  ];

  var SOUND_LABELS = {
    lift: '155→210 Hz',
    step: '308→224 Hz',
    slam: '145→68 Hz',
    ratchet: '1180 Hz Detent',
    latch: '-0.135U Catch',
    blind: '164→92 Hz',
  };

  var I18N = {
    'zh-CN': {
      'header.byline': '设计稿档案',
      'hero.h1.line1': '以 CNC 6063 铝为构想的',
      'hero.h1.line2': '元素周期表交互设计稿。',
      'hero.sub': 'Z = 1..118 元素矩阵、十八幅暗明双模视窗底版与五层程序化声学的静态图版及实时 WebGL2 交互原型。',
      'hero.standbyNote': '原型待机中 · 零 GPU 绘制调用',
      'hero.wakeBtn': '[ + ] 展开 PRISM-118 原型',

      'plaque.k1': '材质',
      'plaque.k2': '光学',
      'plaque.v2': '18 幅双模底版 · 64×32 环境图',
      'plaque.k3': '声学',
      'plaque.v3': '5 层实时合成',
      'plaque.k4': '运行态',
      'plaque.scroll': '图版 I–IV',

      'p1.kicker': 'Plate I · 概念与原型',
      'p1.title.pre': '概念手稿',
      'p1.title.post': '与实机原型对照',
      'p1.prose': '通过手写 GLSL ES 3.0 着色器将前期视觉草图落实为可交互的 WebGL2 原型，对照验证海玻璃键帽漫反射、透明轴座与 45° 倒角高光在实时渲染中的表现。',
      'p1.n1.k': '键帽材质',
      'p1.n1.v': '烟熏海玻璃（暗）· 粉彩冰翡玉（明）',
      'p1.n2.k': '轴座与微晶',
      'p1.n2.v': '保彩水晶轴座 · 0.88U 磁悬浮微晶',
      'p1.n3.k': '机身工艺',
      'p1.n3.v': '喷砂 6063 铝 · 150px 近场追光',
      'p1.fig1': '图 1.1 · 概念草图：磨砂玻璃键帽与滚花旋钮',
      'p1.fig2': '图 1.2 · 实时 GLSL ES 3.0：3.5× 局部微距渲染',
      'p1.fig3': '图 1.3 · 360° 悬浮视图：18×7 周期表矩阵与磁吸 AUX-06',
      'p1.fig4': '图 1.4 · 概念草图：黑曜 6C 钴蓝配色',
      'p1.fig5': '图 1.5 · 实时渲染：黑曜三联结构原型',
      'p1.fig6': '图 1.6 · 概念草图：暖白玉 18Ar 浅色配色',
      'p1.fig7': '图 1.7 · 实时渲染：浅色双模视窗原型',

      'p2.kicker': 'Plate II · 色度与底版',
      'p2.title': '十八幅暗明双模视窗光学底版',
      'p2.prose': '内嵌 1600×480 视窗为深色与浅色主题分别准备九幅独立底版（十六幅活跃主题底版与两幅待机原石底版）。除四颗核心元素键外，其余八十六颗盲键对应 114 种待机元素，#0 Orch 锁定态对非规划项施加 16px 结霜模糊。',
      'p2.s1': 'Hydrogen · 晴空冰蓝',
      'p2.s2': 'Carbon · 皇家钴蓝',
      'p2.s3': 'Neon · 珊瑚流金',
      'p2.s4': 'Argon · 电光靛紫',
      'p2.s5': 'Orch · 星云紫金',
      'p2.fig1': '图 2.1 · 八组主题双模底版：1600×480 深色（左）与浅色（右）对照',
      'p2.fig2.k': '图 2.2 · 待机盲键：IOR 1.54 哑光原石底版',
      'p2.fig2.v': '86 颗物理盲键映射 114 种未分配元素，配备深色玄武岩与浅色石膏原石底版及原子量读数。',
      'p2.fig3.k': '图 2.3 · #0 Orch 锁止态：16px 结霜模糊状态',
      'p2.fig3.v': '双核编排锁止态对非规划模型施加 16px 高斯核、48px 防黑边出血与 92% 冷灰去饱和结霜面纱。',
      'p2.fig4': '图 2.4 · AUX-06 机械自锁（-0.135U）：双核路由视图与双雷达对照',

      'p3.kicker': 'Plate III · 声学与性能约束',
      'p3.title': '五层程序化声学与自适应渲染约束',
      'p3.prose': '原型零音频采样文件，六类机械声效由独立音频模块实时合成；WebGL2 管线锁定 5 Programs / 10 Shaders / 4 VAOs / 5 Textures / 1 FBO，结合 FrameGlobals UBO、64×32 环境图与 1024/512px 动态阴影，支持 300Hz 瞬态交互并在静息后完全停止 rAF。',
      'p3.k1': '管线封顶与 UBO',
      'p3.m1': '5 Programs · 10 Shaders · 4 VAOs · FrameGlobals UBO',
      'p3.k2': '动态阴影与环境图',
      'p3.m2': '5 Textures · 1 FBO · 64×32 RGB8 环境反射图',
      'p3.k3': '瞬态与静息帧率',
      'p3.m3': '瞬态解锁 300Hz · 巡航/Eco 60fps · 静止即停机',
      'p3.k4': '长按静默预热',
      'p3.m4': '冷启动 0 解码 · 长按无感预热底版与颗粒',
      'p3.k5': '闲置缓存回收',
      'p3.m5': '收起满 90s 自动释放底版、噪点池与字符图集',
      'p3.k6': '热路径零回流',
      'p3.m6': 'Read-then-Write 展开 · rAF 合批与 16ms 矩形缓存',
      'p3.diagTitle': '图 3.1 · 五层程序化声学包络剖面（对数频率标尺）',
      'p3.audTitle': '声学试听点 · 点击任意行实时合成',
      'p3.s1': '磁悬浮陶瓷提拉 · Lift',
      'p3.s2': '冰翡玉档位步进 · Step',
      'p3.s3': '115ms 确认触底低频声 · Slam',
      'p3.s4': '钻石滚花旋钮棘轮 · Ratchet',
      'p3.s5': '#0 Orch 双段机械自锁 · Latch',
      'p3.s6': '待机盲键阻尼轻叩 · Blind',

      'p4.kicker': 'Plate IV · 内嵌流交互',
      'p4.title.pre': '非模态内嵌',
      'p4.title.post': '交互原型',
      'p4.prose': '页面仅保留顶部一处常驻 WebGL2 实例。下方游标输入条用于演示展开态下打字不拦截快捷键、短按菜单、点击 1px 微铭牌及 420ms 长按径向环的联动关系。',
      'p4.fig1': '图 4.1 · 四套主题下的 1px 发丝微铭牌对照',
      'p4.tag': '单实例 GPU · 实时同步就绪',
      'p4.initMsg': '在下方游标线敲击 f、r、空格并按 Enter 测试零拦截；点微铭牌或长按 420ms 唤出径向环。',
      'p4.placeholder': '直接在此输入文字（试试敲击 f、r、空格并按 Enter，绝不触发全屏或关闭控制台）...',
      'p4.send': '发送 ↵',
      'p4.quickHdr': '短按快速菜单 · 点 [6C] 微铭牌或长按 420ms 唤出径向环',
      'p4.orchBtn': '#0 Orch',
      'p4.orbitBtn': '360° 检视',
      'p4.focusBtn': '↑ 聚焦 3D 展台',
      'p4.p1k': '短按菜单（<110ms）',
      'p4.p1': '轻点模型名弹出快速菜单，不中断当前输入语境。',
      'p4.p2k': '1px 发丝微铭牌',
      'p4.p2': '轻点 [6C] 发丝微铭牌直接切换唯一 3D 控制台状态。',
      'p4.p3k': '420ms 径向长按环',
      'p4.p3': '按住触发器 110ms 浮现径向环、120ms 静默预热、420ms 响应。',

      'col.kicker': 'Colophon · 设计稿归档',
      'col.statement': 'PRISM-118 交互与光学设计稿归档 · 仅作视觉与原型展示',
      'col.s1': '5 GLSL Programs · 300Hz 瞬态 / 0.0 fps 休眠',
      'col.s2': '18 幅双模视窗底版 · 1024/512px 动态阴影',
      'col.s3': '7 份零依赖原生模块 · 零同步回流',
      'col.sdkToggle': '技术原型结构与挂载笔记',
      'col.sdkKicker': '7 份解耦原生模块 · 零外部 3D 依赖 · 对称卸载',
      'col.sdkDesc': '本页交互原型由七份无外部 3D 依赖的原生脚本（pbr-grain-assets / audio-fx / model-catalog / oled-cyber-screen / keyboard-3d-gl / bento-ui / periodic-console）解耦驱动，仅用于实时设计稿预览。',
      'col.wpZh': '设计笔记（中文）',
      'col.wpEn': 'Design Notes (EN)',
      'col.legal': '© 2026 RMvdesi · All Rights Reserved · 仅作设计稿展示',
      'col.linkWpZh': '设计笔记',
      'col.linkWpEn': 'Design Notes',

      'dim.themeLbl': '画廊氛围与机身材质',
      'dim.accentLbl': '光学边缘追光色调',
      'dim.perfLbl': '渲染与动态阴影档位',
      'dim.perfBalanced': 'Balanced · 300Hz',
      'dim.perfEco': 'Eco · 60fps · 512px',
      'dim.stageLbl': '实时原型操作',
      'dim.dock': '内嵌视图',
      'dim.full': '360° 全屏 (F)',
      'dim.tour': '3D 巡礼',
      'dim.orch': '#0 Orch 双核',
      'dim.reset': '归正 3D 视角 (R)',
      'dim.flip': '翻转左翼卡',
      'dim.toggleDock': '收起 / 展开 3D 原型',
    },

    en: {
      'header.byline': 'Design Study Archive',
      'hero.h1.line1': 'A Periodic Interface Study,',
      'hero.h1.line2': 'Rendered in 6063 Aluminum.',
      'hero.sub': 'Z = 1..118 periodic matrix, eighteen dual-mode optical screen plates, and five-layer procedural key acoustics presented as static plates and a live WebGL2 prototype.',
      'hero.standbyNote': 'Prototype on Standby · Zero GPU Draw Calls',
      'hero.wakeBtn': '[ + ] Open PRISM-118 Prototype',

      'plaque.k1': 'Material',
      'plaque.k2': 'Optics',
      'plaque.v2': '18 Dual-Mode Plates · 64×32 Env',
      'plaque.k3': 'Acoustics',
      'plaque.v3': '5-Layer Synthesis',
      'plaque.k4': 'State',
      'plaque.scroll': 'Plates I–IV',

      'p1.kicker': 'Plate I · Concept & Prototype',
      'p1.title.pre': 'Concept Studies & ',
      'p1.title.post': 'Live WebGL2 Prototype',
      'p1.prose': 'Early visual explorations translated into a hand-written GLSL ES 3.0 prototype to evaluate smoked glass keycaps, clear switch stems, and 45° aluminum chamfers in real time.',
      'p1.n1.k': 'Keycaps',
      'p1.n1.v': 'Smoked Sea-Glass (Noir) · Pastel Ice-Jade (Paper)',
      'p1.n2.k': 'Stems & Crystals',
      'p1.n2.v': 'Chroma-Protected Crystal · 0.88U Micro-Crystals',
      'p1.n3.k': 'Chassis',
      'p1.n3.v': 'Bead-Blasted 6063 Aluminum · 150px Near-Field Rim',
      'p1.fig1': 'Fig 1.1 · Concept Study: Frosted Glass Caps & Knurled Encoder',
      'p1.fig2': 'Fig 1.2 · Real-Time GLSL ES 3.0: 3.5× Macro Render',
      'p1.fig3': 'Fig 1.3 · 360° Orbit View: 18×7 Periodic Matrix & Magnetic AUX-06',
      'p1.fig4': 'Fig 1.4 · Concept: Obsidian 6C Cobalt Palette',
      'p1.fig5': 'Fig 1.5 · Live Render: Obsidian Triptych Prototype',
      'p1.fig6': 'Fig 1.6 · Concept: Alabaster 18Ar Daylight Palette',
      'p1.fig7': 'Fig 1.7 · Live Render: Daylight Screen Prototype',

      'p2.kicker': 'Plate II · Chromatic Plates',
      'p2.title': 'Eighteen Dual-Mode Optical Screen Plates',
      'p2.prose': 'The 1600×480 display pairs nine dark plates with nine daylight plates (16 active themes and 2 raw-quartz standby plates). Beyond the four active elements, 86 physical blind keys map the remaining 114 standby elements, while #0 Orch applies a 16px frosted blur to non-planners.',
      'p2.s1': 'Hydrogen · Sky-Ice',
      'p2.s2': 'Carbon · Royal Cobalt',
      'p2.s3': 'Neon · Coral Gold',
      'p2.s4': 'Argon · Electric Indigo',
      'p2.s5': 'Orch · Amethyst-Gold',
      'p2.fig1': 'Fig 2.1 · Eight Theme Masterplates: 1600×480 Dark (Left) & Daylight (Right)',
      'p2.fig2.k': 'Fig 2.2 · Standby Elements: IOR 1.54 Raw Quartz',
      'p2.fig2.v': '86 physical blind keys map all 114 unassigned elements with smoked-basalt (dark) and matte-plaster (light) quartz plates plus atomic weights.',
      'p2.fig3.k': 'Fig 2.3 · #0 Orch Sealed: 16px Ice-Fog Blur',
      'p2.fig3.v': 'Latching #0 Orch seals non-planner models behind a 16px Gaussian kernel, 48px edge-bleed guard, and 92% cold-slate frosted blur.',
      'p2.fig4': 'Fig 2.4 · AUX-06 Mechanical Latch (-0.135U): Dual-Core Routing & Ghost Radar',

      'p3.kicker': 'Plate III · Acoustics & Constraints',
      'p3.title': 'Five-Layer Acoustics & Adaptive Render Constraints',
      'p3.prose': 'No audio samples are bundled; six key sounds are synthesized via a dedicated Web Audio module while WebGL2 stays capped at 5 programs, 10 shaders, 4 VAOs, 5 textures, and 1 shadow FBO, combining FrameGlobals UBO, 64×32 env lighting, 1024/512px dynamic shadows, and 300Hz bursts down to 0fps idle.',
      'p3.k1': 'Pipeline Cap & UBO',
      'p3.m1': '5 Programs · 10 Shaders · 4 VAOs · FrameGlobals UBO',
      'p3.k2': 'Dynamic Shadow & Env',
      'p3.m2': '5 Textures · 1 FBO · 64×32 RGB8 Metal Env Map',
      'p3.k3': 'Adaptive Refresh',
      'p3.m3': '300Hz Burst · 60fps Steady / Eco · 0.0 fps Idle Halt',
      'p3.k4': 'Hold Pre-Warm',
      'p3.m4': '0 cold decode · 120ms silent hold pre-warm',
      'p3.k5': 'Cache Eviction',
      'p3.m5': 'Auto-evicts plates, grain & legend atlas after 90s',
      'p3.k6': 'Hot-Path DOM',
      'p3.m6': 'Read-then-Write open · rAF batch & 16ms rect cache',
      'p3.diagTitle': 'Fig 3.1 · Five-Layer Procedural Envelope Profile (Log Hz)',
      'p3.audTitle': 'Audition Points · Click Any Line to Synthesize',
      'p3.s1': 'Magnetic Ceramic Lift',
      'p3.s2': 'Ice-Jade Effort Step',
      'p3.s3': '115ms Bottom-Out Thock Slam',
      'p3.s4': 'Knurled Rotary Ratchet',
      'p3.s5': '#0 Orch Dual-Stage Latch',
      'p3.s6': 'Matte Blind-Key Fidget',

      'p4.kicker': 'Plate IV · In-Flow Interaction',
      'p4.title.pre': 'Non-Modal In-Flow ',
      'p4.title.post': 'Interaction Study',
      'p4.prose': 'A single WebGL2 instance stays mounted in the prologue stage. Use the cursor line below to inspect non-modal typing, short-click menus, the 1px hairline mini-badge, and the 420ms hold ring.',
      'p4.fig1': 'Fig 4.1 · Theme-Native 1px Hairline Mini-Badges Across Four Themes',
      'p4.tag': 'Single GPU · Live Sync Ready',
      'p4.initMsg': 'Type f, r, space and press Enter below to verify zero hijacking; click the mini-badge or hold 420ms for the radial ring.',
      'p4.placeholder': 'Type freely along the cursor line (try f, r, space + Enter — zero shortcut hijacking)...',
      'p4.send': 'Dispatch ↵',
      'p4.quickHdr': 'Short-Click Menu · Click [6C] Badge or Hold 420ms for Radial Ring',
      'p4.orchBtn': '#0 Orch',
      'p4.orbitBtn': '360° Orbit',
      'p4.focusBtn': '↑ Focus 3D Stage',
      'p4.p1k': 'Short Click (<110ms)',
      'p4.p1': 'Short-click the label to open the quick menu without breaking flow.',
      'p4.p2k': '1px Mini-Badge',
      'p4.p2': 'Click the 1px hairline mini-badge to toggle the single live 3D console.',
      'p4.p3k': '420ms Radial Hold',
      'p4.p3': 'Hold 110ms for the radial ring, 120ms for silent pre-warm, 420ms to actuate.',

      'col.kicker': 'Colophon · Design Archive',
      'col.statement': 'PRISM-118 Interaction & Optical Design Study · Archived for Visual Reference',
      'col.s1': '5 GLSL Programs · 300Hz Burst / 0.0 fps Idle',
      'col.s2': '18 Dual-Mode Plates · 1024/512px Dynamic Shadow',
      'col.s3': '7 Dependency-Free Modules · Zero Reflow',
      'col.sdkToggle': 'Prototype Structure & Mount Notes',
      'col.sdkKicker': '7 Decoupled Native Modules · Zero External 3D Libs · Clean Teardown',
      'col.sdkDesc': 'Seven dependency-free modules (pbr-grain-assets, audio-fx, model-catalog, oled-cyber-screen, keyboard-3d-gl, bento-ui, periodic-console) drive the live interactive preview on this page.',
      'col.wpZh': '设计笔记（中文）',
      'col.wpEn': 'Design Notes (EN)',
      'col.legal': '© 2026 RMvdesi · All Rights Reserved · Design study archive',
      'col.linkWpZh': '设计笔记',
      'col.linkWpEn': 'Design Notes',

      'dim.themeLbl': 'Gallery Atmosphere & Chassis',
      'dim.accentLbl': 'Optical Rim Accent',
      'dim.perfLbl': 'Render & Dynamic Shadow Profile',
      'dim.perfBalanced': 'Balanced · 300Hz',
      'dim.perfEco': 'Eco · 60fps · 512px',
      'dim.stageLbl': 'Prototype Controls',
      'dim.dock': 'In-Flow View',
      'dim.full': '360° Stage (F)',
      'dim.tour': '3D Tour',
      'dim.orch': '#0 Orch Dual',
      'dim.reset': 'Reset Orbit (R)',
      'dim.flip': 'Flip Spec Card',
      'dim.toggleDock': 'Toggle 3D Prototype',
    },
  };

  var params = new URLSearchParams(window.location.search || '');
  var currentLang = /^en/i.test(params.get('lang') || '') ? 'en' : 'zh-CN';
  var currentKit = (params.get('theme') || params.get('kit') || 'obsidian').toLowerCase();
  if (['obsidian', 'warm', 'crystal', 'alabaster'].indexOf(currentKit) === -1) {
    currentKit = 'obsidian';
  }
  var currentAccent = (params.get('accent') || 'follow').toLowerCase();
  if (['follow', 'cobalt', 'iris', 'amber', 'mono'].indexOf(currentAccent) === -1) {
    currentAccent = 'follow';
  }
  var currentPerfMode =
    /^(?:performance|eco)$/i.test(params.get('perf') || params.get('performanceMode') || '')
      ? 'performance'
      : 'balanced';
  var initStageMode =
    params.get('stage') === 'fullscreen' || params.get('mode') === 'fullscreen' ? 'fullscreen' : 'drawer';
  var autoOpen = params.get('open') !== '0';

  var telemetryIndex = 0;
  var consoleApp = null;
  var tourRafId = 0;
  var auditionAudioEngine = null;
  var lastKnownRendererMode = 'WEBGL2';
  var audioStatusTimer = 0;
  var lastFeedState = { kind: 'init' };

  function loadProgressiveCjkSerif() {
    try {
      var loc = window.location;
      if (!loc || loc.protocol !== 'https:') return;
      var host = String(loc.hostname || '').toLowerCase();
      if (!host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return;
      if (document.getElementById('sc-cjk-serif-link')) return;
      var link = document.createElement('link');
      link.id = 'sc-cjk-serif-link';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&display=swap';
      if (document.head) document.head.appendChild(link);
    } catch (e) {}
  }

  function renderFeedMessage() {
    var tagEl = document.getElementById('sc-feed-tag');
    var msgEl = document.getElementById('sc-feed-msg');
    if (!tagEl || !msgEl) return;
    var zh = currentLang === 'zh-CN';
    var st = lastFeedState || { kind: 'init' };
    var tagText = I18N[currentLang]['p4.tag'];
    var msgText = I18N[currentLang]['p4.initMsg'];

    if (st.kind === 'dispatch') {
      tagText = zh ? '零劫持验证通过' : 'Zero-Intercept Verified';
      msgText =
        (zh ? '输入已无阻送出（3D 控制台保持原态）："' : 'Dispatched cleanly while stage held steady: "') +
        String(st.text || '').slice(0, 64) +
        '"';
    } else if (st.kind === 'model') {
      tagText = st.orchLatched ? 'Single GPU · Orch Dual' : 'Single GPU · Synced';
      msgText = (zh ? '唯一 WebGL2 实例已实时切换 → ' : 'Single WebGL2 stage synchronized → ') + String(st.label || '');
    } else if (st.kind === 'effort') {
      tagText = 'Single GPU · Effort';
      msgText =
        (zh ? '思考力度已步进 → ' : 'Thinking effort stepped → ') +
        String(st.effort || '').toUpperCase() +
        (st.label ? ' · ' + st.label : '');
    } else if (st.kind === 'orch') {
      tagText = st.latched ? '#0 Orch Latched' : '#0 Orch Unlatched';
      msgText = st.latched
        ? zh
          ? '双核编排机械开关已锁下：主规划核 ' + st.plannerName + ' + 1H 执行核（非规划键冰封）'
          : 'Dual-Core latched: Planner ' + st.plannerName + ' + 1H Executor (non-planners sealed)'
        : zh
          ? '已恢复全盘单模型直连模式'
          : 'Restored standalone single-model mode';
    } else if (st.kind === 'open') {
      tagText = st.isOpen ? 'Single GPU · Active' : 'Single GPU · Standby';
      msgText = st.isOpen
        ? zh
          ? '序幕唯一 3D 展台已推升就绪（点 [ ↑ 聚焦 3D 展台 ] 或微铭牌随时切换）'
          : 'Prologue 3D artifact stage is live (click Focus 3D Stage or mini-badge anytime)'
        : zh
          ? '序幕 3D 展台已静默休眠（0 GPU 绘制，点微铭牌或长按 420ms 唤醒）'
          : 'Prologue 3D stage sleeping at 0 draw calls (click mini-badge or hold 420ms to rise)';
    }

    tagEl.textContent = tagText;
    msgEl.textContent = msgText;
  }

  function setFeedState(nextState) {
    lastFeedState = nextState || { kind: 'init' };
    renderFeedMessage();
  }

  function applyTranslations() {
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('data-prism-lang', currentLang);

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i += 1) {
      var k = nodes[i].getAttribute('data-i18n');
      if (k && I18N[currentLang] && I18N[currentLang][k] !== undefined) {
        nodes[i].textContent = I18N[currentLang][k];
      }
    }

    var phNodes = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phNodes.length; j += 1) {
      var pk = phNodes[j].getAttribute('data-i18n-placeholder');
      if (pk && I18N[currentLang] && I18N[currentLang][pk] !== undefined) {
        phNodes[j].setAttribute('placeholder', I18N[currentLang][pk]);
      }
    }

    var langBtns = document.querySelectorAll('[data-lang-btn]');
    for (var l = 0; l < langBtns.length; l += 1) {
      langBtns[l].setAttribute('data-active', langBtns[l].getAttribute('data-lang-btn') === currentLang ? '1' : '0');
    }

    if (consoleApp && typeof consoleApp.setLocale === 'function') {
      consoleApp.setLocale(currentLang);
    }
    renderFeedMessage();
    syncExhibitionState();
  }

  function compactModelCode(model) {
    if (!model || !model.label) return '6C Carbon';
    var lbl = String(model.label);
    if (/carbon/i.test(lbl)) return '6C Carbon';
    if (/hydrogen/i.test(lbl)) return '1H Hydrogen';
    if (/neon/i.test(lbl)) return '10Ne Neon';
    if (/argon/i.test(lbl)) return '18Ar Argon';
    if (/opus/i.test(lbl)) return 'Opus 5.5';
    if (/sonnet/i.test(lbl)) return 'Sonnet 5.5';
    if (/flash/i.test(lbl)) return 'Flash 3.8';
    return lbl.slice(0, 18);
  }

  function syncExhibitionState() {
    var kitBtns = document.querySelectorAll('[data-kit-btn]');
    for (var i = 0; i < kitBtns.length; i += 1) {
      kitBtns[i].setAttribute('data-active', kitBtns[i].getAttribute('data-kit-btn') === currentKit ? '1' : '0');
    }
    var accBtns = document.querySelectorAll('[data-accent-btn]');
    for (var j = 0; j < accBtns.length; j += 1) {
      accBtns[j].setAttribute('data-active', accBtns[j].getAttribute('data-accent-btn') === currentAccent ? '1' : '0');
    }
    var perfBtns = document.querySelectorAll('[data-perf-btn]');
    for (var p = 0; p < perfBtns.length; p += 1) {
      perfBtns[p].setAttribute('data-active', perfBtns[p].getAttribute('data-perf-btn') === currentPerfMode ? '1' : '0');
    }

    if (!consoleApp) return;
    var st = consoleApp.getStatus();
    var isFull = st.stageMode === 'fullscreen';

    var dockBtn = document.getElementById('btn-stage-dock');
    var fullBtn = document.getElementById('btn-stage-full');
    if (dockBtn) dockBtn.setAttribute('data-active', st.open && !isFull ? '1' : '0');
    if (fullBtn) fullBtn.setAttribute('data-active', st.open && isFull ? '1' : '0');

    var orchBtn = document.getElementById('btn-hero-orch');
    var sandboxOrchBtn = document.getElementById('btn-sandbox-orch');
    if (orchBtn) orchBtn.setAttribute('data-active', st.orchLatched ? '1' : '0');
    if (sandboxOrchBtn) sandboxOrchBtn.setAttribute('data-active', st.orchLatched ? '1' : '0');

    var flipBtn = document.getElementById('btn-hero-flip');
    if (flipBtn) flipBtn.setAttribute('data-active', st.cardFlipped ? '1' : '0');

    var standbyEl = document.getElementById('sc-stage-standby');
    if (standbyEl) {
      standbyEl.setAttribute('data-visible', st.open ? '0' : '1');
      standbyEl.hidden = Boolean(st.open);
    }

    if (st.open && st.rendererMode && st.rendererMode !== 'headless') {
      lastKnownRendererMode = String(st.rendererMode).toUpperCase();
    }

    var plaqueLive = document.getElementById('sc-plaque-live');
    if (plaqueLive) {
      var sel = consoleApp.getSelectedModel();
      var shortCode = compactModelCode(sel);
      var shTag = (st.shadowMapSize || (currentPerfMode === 'performance' ? 512 : 1024)) + 'px';
      var prefix = st.open ? '0.0 fps · ' + shTag : 'Standby';
      plaqueLive.textContent = prefix + ' · ' + (st.orchLatched ? 'Orch · ' : '') + shortCode;
    }
  }

  function applyThemeAndAccent(kitKey, accentKey) {
    if (kitKey) currentKit = kitKey;
    if (accentKey) currentAccent = accentKey;
    if (consoleApp && typeof consoleApp.setTheme === 'function') {
      consoleApp.setTheme(currentKit, currentAccent);
    }
    syncExhibitionState();
  }

  function applyPerformanceMode(modeKey) {
    currentPerfMode = /^(?:performance|eco)$/i.test(String(modeKey || '')) ? 'performance' : 'balanced';
    document.documentElement.setAttribute('data-prism-perf-mode', currentPerfMode);
    if (consoleApp && typeof consoleApp.setPerformanceMode === 'function') {
      consoleApp.setPerformanceMode(currentPerfMode);
    }
    syncExhibitionState();
  }

  function applyTelemetryPreset(idx) {
    telemetryIndex = ((idx % TELEMETRY_PRESETS.length) + TELEMETRY_PRESETS.length) % TELEMETRY_PRESETS.length;
    var preset = TELEMETRY_PRESETS[telemetryIndex];
    var btn = document.getElementById('btn-hero-telemetry');
    if (btn) btn.textContent = '512K: ' + preset.tag;
    var feedRight = document.getElementById('sc-feed-telemetry');
    if (feedRight) {
      feedRight.textContent =
        Math.round(preset.usedTokens / 1024) +
        'K / 512K (' +
        preset.tag +
        ') · KV ' +
        Math.round(preset.cacheHitRate * 100) +
        '%';
    }
    if (consoleApp && typeof consoleApp.setTelemetry === 'function') {
      consoleApp.setTelemetry(preset);
    }
  }

  /* Atelier Light Floating Dimmer Controls */
  function setAtelierOpen(wantOpen) {
    var dock = document.getElementById('sc-atelier-dock');
    var panel = document.getElementById('sc-dimmer-panel');
    var toggleBtn = document.getElementById('btn-atelier-toggle');
    if (!dock || !panel || !toggleBtn) return;
    var openBool = Boolean(wantOpen);
    if (openBool) syncExhibitionState();
    dock.setAttribute('data-open', openBool ? '1' : '0');
    panel.hidden = !openBool;
    toggleBtn.setAttribute('aria-expanded', openBool ? 'true' : 'false');
  }

  /* Interactive 360° Orbit Tour */
  function smootherstep01(x) {
    var u = Math.max(0, Math.min(1, x));
    return u * u * u * (u * (u * 6 - 15) + 10);
  }

  function stopOrbitTour() {
    if (tourRafId) {
      cancelAnimationFrame(tourRafId);
      tourRafId = 0;
    }
    var tourBtn = document.getElementById('btn-nav-tour');
    if (tourBtn) tourBtn.setAttribute('data-active', '0');
  }

  function runOrbitTour() {
    if (!consoleApp) return;
    stopOrbitTour();
    setAtelierOpen(false);
    if (!consoleApp.isOpen()) {
      consoleApp.open();
    }
    if (consoleApp.getStageMode() !== 'fullscreen') {
      consoleApp.setStageMode('fullscreen');
    }
    syncExhibitionState();
    var tourBtn = document.getElementById('btn-nav-tour');
    if (tourBtn) tourBtn.setAttribute('data-active', '1');

    var startOrbit = consoleApp.getChassisOrbit() || { pitch: 0, yaw: 0 };
    var frames = [
      { t: 0.0, pitch: startOrbit.pitch || 0, yaw: startOrbit.yaw || 0 },
      { t: 0.35, pitch: 0.34, yaw: -0.56 },
      { t: 0.72, pitch: -0.42, yaw: 0.50 },
      { t: 1.0, pitch: 0.22, yaw: -0.34 },
    ];
    var durationMs = 2400;
    var startTs = 0;

    function step(now) {
      if (!consoleApp || !consoleApp.isOpen()) {
        stopOrbitTour();
        return;
      }
      if (!startTs) startTs = now;
      var p = Math.min(1, Math.max(0, (now - startTs) / durationMs));
      var pose = frames[frames.length - 1];
      for (var i = 0; i < frames.length - 1; i += 1) {
        if (p <= frames[i + 1].t || i === frames.length - 2) {
          var span = Math.max(1e-5, frames[i + 1].t - frames[i].t);
          var w = smootherstep01((p - frames[i].t) / span);
          pose = {
            pitch: frames[i].pitch + (frames[i + 1].pitch - frames[i].pitch) * w,
            yaw: frames[i].yaw + (frames[i + 1].yaw - frames[i].yaw) * w,
          };
          break;
        }
      }
      consoleApp.setChassisOrbit(pose.pitch, pose.yaw);
      if (p < 1) {
        tourRafId = requestAnimationFrame(step);
        return;
      }
      stopOrbitTour();
    }
    tourRafId = requestAnimationFrame(step);
  }

  /* Procedural 5-Layer Web Audio Audition Synthesizer (Uses Purified PrismPeriodicAudioFx) */
  function playAuditionSound(kind) {
    try {
      if (!auditionAudioEngine && window.PrismPeriodicAudioFx && typeof window.PrismPeriodicAudioFx.createAudioFxEngine === 'function') {
        auditionAudioEngine = window.PrismPeriodicAudioFx.createAudioFxEngine({
          root: window,
          doc: document,
          muted: false,
          respectReducedMotion: false,
        });
      }
      if (auditionAudioEngine) {
        var mapped = kind === 'latch' ? 'orch-latch' : kind === 'blind' ? 'fidget' : kind;
        auditionAudioEngine.playSound(mapped, 2);
      }
    } catch (e) {}
  }

  function initShowcase() {
    loadProgressiveCjkSerif();
    var sdk = window.PrismPeriodicConsole;
    if (!sdk || typeof sdk.mount !== 'function') return;

    var triggerBtn = document.getElementById('sc-model-trigger');
    var quickMenu = document.getElementById('sc-quick-menu');
    var dockHost = document.getElementById('sc-dock-host');
    var composerBox = document.getElementById('sc-composer-card');
    var composerInput = document.getElementById('sc-composer-input');
    var sendBtn = document.getElementById('sc-send-btn');

    consoleApp = sdk.mount({
      trigger: triggerBtn,
      mountContainer: dockHost,
      composerEl: composerBox,
      theme: currentKit,
      accent: currentAccent,
      locale: currentLang,
      performanceMode: currentPerfMode,
      initialStageMode: initStageMode,
      autoOpen: autoOpen,
      telemetry: TELEMETRY_PRESETS[0],
      onDismissMenu: function () {
        if (quickMenu) quickMenu.setAttribute('data-open', '0');
      },
      onSelectModel: function (model, meta) {
        setFeedState({
          kind: 'model',
          label: model && model.label ? model.label : '',
          orchLatched: Boolean(meta && meta.orchLatched),
        });
        syncExhibitionState();
      },
      onSelectEffort: function (effort, model) {
        setFeedState({
          kind: 'effort',
          effort: effort,
          label: model && model.label ? model.label : '',
        });
        syncExhibitionState();
      },
      onToggleOrchestrator: function (latched, planner) {
        var pName = planner && planner.label ? planner.label : 'Carbon';
        setFeedState({
          kind: 'orch',
          latched: Boolean(latched),
          plannerName: pName,
        });
        syncExhibitionState();
      },
      onOpenChange: function (isOpenNow) {
        setFeedState({
          kind: 'open',
          isOpen: Boolean(isOpenNow),
        });
        syncExhibitionState();
      },
      onStageModeChange: function () {
        syncExhibitionState();
      },
    });

    /* Populate Frameless Quick Menu in Plate IV */
    var quickList = document.getElementById('sc-quick-items');
    var quickSeeds = [
      'gemini-4-carbon-high',
      'gemini-4-hydrogen-high',
      'gemini-4-neon-high',
      'gemini-4-argon-high',
      'prism-orchestrator',
      'claude-opus-5-5-high',
      'gemini-3.8-flash-high',
      'gpt-oss-120b-high',
    ];
    if (quickList) {
      for (var qi = 0; qi < quickSeeds.length; qi += 1) {
        (function (idStr) {
          var matchedOpt = null;
          for (var m = 0; m < sdk.DEFAULT_MODELS.length; m += 1) {
            if (sdk.DEFAULT_MODELS[m].modelId === idStr) {
              matchedOpt = sdk.DEFAULT_MODELS[m];
              break;
            }
          }
          if (!matchedOpt) return;
          var qBtn = document.createElement('button');
          qBtn.type = 'button';
          qBtn.className = 'sc-quick-item';
          qBtn.textContent = matchedOpt.label;
          qBtn.addEventListener('click', function () {
            consoleApp.selectModel(matchedOpt);
            if (quickMenu) quickMenu.setAttribute('data-open', '0');
          });
          quickList.appendChild(qBtn);
        })(quickSeeds[qi]);
      }
    }

    if (triggerBtn && quickMenu) {
      triggerBtn.addEventListener('click', function (ev) {
        if (ev.target && typeof ev.target.closest === 'function' && ev.target.closest('.pp-mini-keycap')) {
          return;
        }
        var nextOpen = quickMenu.getAttribute('data-open') !== '1';
        quickMenu.setAttribute('data-open', nextOpen ? '1' : '0');
      });
      document.addEventListener('click', function (ev) {
        if (!quickMenu.contains(ev.target) && !triggerBtn.contains(ev.target)) {
          quickMenu.setAttribute('data-open', '0');
        }
      });
    }

    /* Plate IV Frameless Cursor-Line Composer Dispatch */
    function sendComposerPrompt() {
      if (!composerInput) return;
      var val = String(composerInput.value || '').trim();
      if (!val) return;
      composerInput.value = '';
      setFeedState({ kind: 'dispatch', text: val });
    }

    if (composerInput) {
      composerInput.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) {
          ev.preventDefault();
          sendComposerPrompt();
        }
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', sendComposerPrompt);
    }

    /* Plate IV Smooth Focus & Live Sync Actions */
    var focusStageBtn = document.getElementById('btn-sandbox-focus');
    if (focusStageBtn) {
      focusStageBtn.addEventListener('click', function () {
        stopOrbitTour();
        if (!consoleApp.isOpen()) consoleApp.open();
        if (consoleApp.getStageMode() !== 'drawer') consoleApp.setStageMode('drawer');
        syncExhibitionState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    var sandboxOrbitBtn = document.getElementById('btn-sandbox-orbit');
    if (sandboxOrbitBtn) {
      sandboxOrbitBtn.addEventListener('click', function () {
        if (!consoleApp.isOpen()) consoleApp.open();
        consoleApp.setStageMode('fullscreen');
        syncExhibitionState();
      });
    }

    var sandboxOrchBtn = document.getElementById('btn-sandbox-orch');
    if (sandboxOrchBtn) {
      sandboxOrchBtn.addEventListener('click', function () {
        consoleApp.toggleOrchestrator();
        syncExhibitionState();
      });
    }

    /* Prologue Standby Wake Button */
    var wakeBtn = document.getElementById('btn-stage-wake');
    if (wakeBtn) {
      wakeBtn.addEventListener('click', function () {
        stopOrbitTour();
        if (!consoleApp.isOpen()) consoleApp.open();
        if (consoleApp.getStageMode() !== 'drawer') consoleApp.setStageMode('drawer');
        syncExhibitionState();
      });
    }

    /* Escape from 360° Fullscreen gracefully returns to the embedded Prologue stage */
    window.addEventListener(
      'keydown',
      function (ev) {
        if (
          ev.key === 'Escape' &&
          consoleApp &&
          consoleApp.isOpen() &&
          consoleApp.getStageMode() === 'fullscreen'
        ) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          stopOrbitTour();
          consoleApp.setStageMode('drawer');
          syncExhibitionState();
        }
      },
      true
    );

    /* Book-Header Bilingual Controls */
    var langBtns = document.querySelectorAll('[data-lang-btn]');
    for (var lb = 0; lb < langBtns.length; lb += 1) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var nextLang = btn.getAttribute('data-lang-btn') === 'en' ? 'en' : 'zh-CN';
          if (nextLang !== currentLang) {
            currentLang = nextLang;
            applyTranslations();
          }
        });
      })(langBtns[lb]);
    }

    /* Atelier Light Floating Dimmer Interactions */
    var atelierDock = document.getElementById('sc-atelier-dock');
    var atelierToggle = document.getElementById('btn-atelier-toggle');
    var atelierClose = document.getElementById('btn-dimmer-close');

    if (atelierToggle && atelierDock) {
      atelierToggle.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var isOpenNow = atelierDock.getAttribute('data-open') === '1';
        setAtelierOpen(!isOpenNow);
      });
    }
    if (atelierClose) {
      atelierClose.addEventListener('click', function () {
        setAtelierOpen(false);
      });
    }
    document.addEventListener('click', function (ev) {
      if (atelierDock && atelierDock.getAttribute('data-open') === '1' && !atelierDock.contains(ev.target)) {
        setAtelierOpen(false);
      }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && atelierDock && atelierDock.getAttribute('data-open') === '1') {
        setAtelierOpen(false);
      }
    });

    /* Atelier Light Theme, Accent, Performance & Stage Buttons */
    var kitBtns = document.querySelectorAll('[data-kit-btn]');
    for (var k = 0; k < kitBtns.length; k += 1) {
      (function (btn) {
        btn.addEventListener('click', function () {
          applyThemeAndAccent(btn.getAttribute('data-kit-btn'), null);
        });
      })(kitBtns[k]);
    }

    var accBtns = document.querySelectorAll('[data-accent-btn]');
    for (var a = 0; a < accBtns.length; a += 1) {
      (function (btn) {
        btn.addEventListener('click', function () {
          applyThemeAndAccent(null, btn.getAttribute('data-accent-btn'));
        });
      })(accBtns[a]);
    }

    var perfBtns = document.querySelectorAll('[data-perf-btn]');
    for (var pb = 0; pb < perfBtns.length; pb += 1) {
      (function (btn) {
        btn.addEventListener('click', function () {
          applyPerformanceMode(btn.getAttribute('data-perf-btn'));
        });
      })(perfBtns[pb]);
    }

    var dockBtn = document.getElementById('btn-stage-dock');
    var fullBtn = document.getElementById('btn-stage-full');
    if (dockBtn) {
      dockBtn.addEventListener('click', function () {
        stopOrbitTour();
        if (!consoleApp.isOpen()) consoleApp.open();
        consoleApp.setStageMode('drawer');
        syncExhibitionState();
      });
    }
    if (fullBtn) {
      fullBtn.addEventListener('click', function () {
        setAtelierOpen(false);
        if (!consoleApp.isOpen()) consoleApp.open();
        consoleApp.setStageMode('fullscreen');
        syncExhibitionState();
      });
    }

    var tourBtn = document.getElementById('btn-nav-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', runOrbitTour);
    }

    var toggleDockBtn = document.getElementById('btn-hero-toggle-dock');
    if (toggleDockBtn) {
      toggleDockBtn.addEventListener('click', function () {
        stopOrbitTour();
        if (consoleApp.isOpen()) {
          consoleApp.toggle();
        } else {
          consoleApp.open();
          if (consoleApp.getStageMode() !== 'drawer') consoleApp.setStageMode('drawer');
        }
        syncExhibitionState();
      });
    }

    var resetOrbitBtn = document.getElementById('btn-hero-reset');
    if (resetOrbitBtn) {
      resetOrbitBtn.addEventListener('click', function () {
        stopOrbitTour();
        if (!consoleApp.isOpen()) consoleApp.open();
        if (typeof consoleApp.resetChassisOrbit === 'function') {
          consoleApp.resetChassisOrbit();
        }
        syncExhibitionState();
      });
    }

    var flipCardBtn = document.getElementById('btn-hero-flip');
    if (flipCardBtn) {
      flipCardBtn.addEventListener('click', function () {
        if (!consoleApp.isOpen()) consoleApp.open();
        consoleApp.toggleCardFlip();
        syncExhibitionState();
      });
    }

    var orchHeroBtn = document.getElementById('btn-hero-orch');
    if (orchHeroBtn) {
      orchHeroBtn.addEventListener('click', function () {
        if (!consoleApp.isOpen()) consoleApp.open();
        consoleApp.toggleOrchestrator();
        syncExhibitionState();
      });
    }

    var teleHeroBtn = document.getElementById('btn-hero-telemetry');
    if (teleHeroBtn) {
      teleHeroBtn.addEventListener('click', function () {
        applyTelemetryPreset(telemetryIndex + 1);
      });
    }

    /* Plate III Acoustic Audition Rows */
    var soundRows = document.querySelectorAll('[data-sound-kind]');
    var audioStatusEl = document.getElementById('sc-audio-status');
    for (var si = 0; si < soundRows.length; si += 1) {
      (function (row) {
        row.addEventListener('click', function () {
          var kind = row.getAttribute('data-sound-kind');
          playAuditionSound(kind);
          row.setAttribute('data-playing', '1');
          if (audioStatusEl) {
            audioStatusEl.textContent = 'Synth · ' + (SOUND_LABELS[kind] || 'Active');
          }
          clearTimeout(audioStatusTimer);
          audioStatusTimer = setTimeout(function () {
            if (audioStatusEl) audioStatusEl.textContent = 'Ready';
          }, 420);
          setTimeout(function () {
            row.setAttribute('data-playing', '0');
          }, 220);
        });
      })(soundRows[si]);
    }

    /* Colophon Expandable SDK Drawer (Collapsed by Default) */
    var sdkDrawer = document.getElementById('sc-sdk-drawer');
    var sdkToggle = document.getElementById('btn-sdk-toggle');
    var sdkPanel = document.getElementById('sc-sdk-panel');
    var sdkSign = document.getElementById('sc-sdk-sign');
    if (sdkDrawer && sdkToggle && sdkPanel) {
      sdkToggle.addEventListener('click', function () {
        var nextOpen = sdkDrawer.getAttribute('data-open') !== '1';
        sdkDrawer.setAttribute('data-open', nextOpen ? '1' : '0');
        sdkPanel.hidden = !nextOpen;
        sdkToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        if (sdkSign) sdkSign.textContent = nextOpen ? '[ − ]' : '[ + ]';
      });
    }

    /* URL Overrides for Automated Curatorial Photography */
    if (params.has('orbitPitch') || params.has('orbitYaw')) {
      var op = parseFloat(params.get('orbitPitch') || '0') || 0;
      var oy = parseFloat(params.get('orbitYaw') || '0') || 0;
      consoleApp.setChassisOrbit(op, oy);
    }
    if (params.get('orch') === '1') {
      consoleApp.toggleOrchestrator(true);
    }
    if (params.get('model')) {
      consoleApp.selectModel(params.get('model'));
    }

    applyTelemetryPreset(0);
    applyTranslations();

    window.__prismExhibition = {
      console: consoleApp,
      setTheme: applyThemeAndAccent,
      setPerformanceMode: applyPerformanceMode,
      setLang: function (lang) {
        currentLang = /^en/i.test(lang) ? 'en' : 'zh-CN';
        applyTranslations();
      },
      setAtelierOpen: setAtelierOpen,
      runOrbitTour: runOrbitTour,
      getRendererMode: function () {
        return lastKnownRendererMode;
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowcase);
  } else {
    initShowcase();
  }
})();
