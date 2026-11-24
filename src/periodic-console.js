/*!
 * PRISM-118 · Periodic Console — Original Industrial & Optical Design Monograph
 * Copyright (c) 2026 RMvdesi (https://github.com/RMvdesi). All Rights Reserved.
 *
 * Flagship Product Attribution:
 *   Obsidian Prism (https://github.com/RMvdesi/obsidian-prism)
 *
 * PROPRIETARY DESIGN & SOURCE NOTICE:
 * Published solely for public online interactive exhibition, technical craft
 * inspection, and authorship attribution. Unauthorized copying, redistribution,
 * commercial use, derivative porting/cloning, or removal of attribution is
 * strictly prohibited. See LICENSE in the repository root for full terms.
 *
 * Public Standard SDK Contract:
 *   PrismPeriodicConsole.mount(options) / PrismPeriodicConsole.createPeriodicConsole(options)
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module && typeof module.exports === 'object') { module.exports = api; }
  if (root && typeof root === 'object') { root.PrismPeriodicConsole = api; }
  if (typeof globalThis === 'object' && globalThis) { globalThis.PrismPeriodicConsole = api; }
  if (typeof window === 'object' && window) { window.PrismPeriodicConsole = api; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    'use strict';
    var STYLE_ID = 'prism-periodic-console-css';
    var ROOT_ID = 'prism-periodic-console-root';
    var ROOT_MARKER_ATTR = 'data-prism-periodic-console';
    var MUTE_STORAGE_KEY = 'prism_periodic_console_muted';
    var DEFAULT_MODELS = Object.freeze([
      { label: 'Gemini 4 Hydrogen (Low)', value: 'gemini-4-hydrogen-low', modelId: 'gemini-4-hydrogen-low' },
      { label: 'Gemini 4 Hydrogen (Medium)', value: 'gemini-4-hydrogen-medium', modelId: 'gemini-4-hydrogen-medium' },
      { label: 'Gemini 4 Hydrogen (High)', value: 'gemini-4-hydrogen-high', modelId: 'gemini-4-hydrogen-high' },
      { label: 'Gemini 4 Hydrogen (XHigh)', value: 'gemini-4-hydrogen-xhigh', modelId: 'gemini-4-hydrogen-xhigh' },
      { label: 'Gemini 4 Carbon (Low)', value: 'gemini-4-carbon-low', modelId: 'gemini-4-carbon-low' },
      { label: 'Gemini 4 Carbon (Medium)', value: 'gemini-4-carbon-medium', modelId: 'gemini-4-carbon-medium' },
      { label: 'Gemini 4 Carbon (High)', value: 'gemini-4-carbon-high', modelId: 'gemini-4-carbon-high' },
      { label: 'Gemini 4 Neon (Low)', value: 'gemini-4-neon-low', modelId: 'gemini-4-neon-low' },
      { label: 'Gemini 4 Neon (Medium)', value: 'gemini-4-neon-medium', modelId: 'gemini-4-neon-medium' },
      { label: 'Gemini 4 Neon (High)', value: 'gemini-4-neon-high', modelId: 'gemini-4-neon-high' },
      { label: 'Gemini 4 Neon Extra', value: 'gemini-4-neon-xhigh', modelId: 'gemini-4-neon-xhigh' },
      { label: 'Gemini 4 Argon (Low)', value: 'gemini-4-argon-low', modelId: 'gemini-4-argon-low' },
      { label: 'Gemini 4 Argon (Medium)', value: 'gemini-4-argon-medium', modelId: 'gemini-4-argon-medium' },
      { label: 'Gemini 4 Argon (High)', value: 'gemini-4-argon-high', modelId: 'gemini-4-argon-high' },
      { label: 'Orchestrator', value: 'orchestrator', modelId: 'prism-orchestrator' },
      { label: 'Gemini 3.8 Flash (Low)', value: 'gemini-3.8-flash-low', modelId: 'gemini-3.8-flash-low' },
      { label: 'Gemini 3.8 Flash (Medium)', value: 'gemini-3.8-flash-medium', modelId: 'gemini-3.8-flash-medium' },
      { label: 'Gemini 3.8 Flash (High)', value: 'gemini-3.8-flash-high', modelId: 'gemini-3.8-flash-high' },
      { label: 'Claude Opus 5.5 (Low)', value: 'claude-opus-5-5-low', modelId: 'claude-opus-5-5-low' },
      { label: 'Claude Opus 5.5 (Medium)', value: 'claude-opus-5-5-medium', modelId: 'claude-opus-5-5-medium' },
      { label: 'Claude Opus 5.5 (High)', value: 'claude-opus-5-5-high', modelId: 'claude-opus-5-5-high' },
      { label: 'Claude Sonnet 5.5 (Low)', value: 'claude-sonnet-5-5-low', modelId: 'claude-sonnet-5-5-low' },
      { label: 'Claude Sonnet 5.5 (Medium)', value: 'claude-sonnet-5-5-medium', modelId: 'claude-sonnet-5-5-medium' },
      { label: 'Claude Sonnet 5.5 (High)', value: 'claude-sonnet-5-5-high', modelId: 'claude-sonnet-5-5-high' },
      { label: 'GPT-OSS 120B (Medium)', value: 'gpt-oss-120b-medium', modelId: 'gpt-oss-120b-medium' },
      { label: 'GPT-OSS 120B (High)', value: 'gpt-oss-120b-high', modelId: 'gpt-oss-120b-high' }
    ]);
    var DEFAULT_ORCHESTRATOR_PLANNERS = Object.freeze(DEFAULT_MODELS.filter(function (o) {
      var id = o.modelId || "";
      return id.indexOf("gemini-4-neon-") === 0 || id.indexOf("gemini-4-carbon-") === 0 || id.indexOf("gemini-4-argon-") === 0 || id.indexOf("claude-opus-") === 0;
    }));
    var SVG_NS = 'http://www.w3.org/2000/svg';

    var HOLD_RING_DELAY_MS = 110;
    var HOLD_PREWARM_DELAY_MS = 120;
    var HOLD_OPEN_DELAY_MS = 420;
    var HOLD_MAX_DRIFT_PX = 10;
    var IDLE_EVICT_DELAY_MS = 90000;
    var SHORT_VIEWPORT_HEIGHT_PX = 560;
    var SUPPRESS_CLICK_WINDOW_MS = 800;
    var BLIND_HOVER_DWELL_MS = 150;
    var CONFIRM_SLAM_DELAY_MS = 115;
    var ORBIT_DRAG_THRESHOLD_PX = 6;
    var SLIDER_SCRUB_THRESHOLD_PX = 3;
    var ORBIT_PITCH_RAD_PER_PX = 0.0046;
    var ORBIT_YAW_RAD_PER_PX = 0.0046;
    var ORBIT_FLING_WINDOW_MS = 50;
    var ORBIT_MAX_VEL_RAD = 6.2;
    var ORBIT_FALLBACK_FLING_SCALE = 0.88;
    var POST_DRAG_SUPPRESS_MS = 360;
    var DEFAULT_MAX_CONTEXT_TOKENS = 524288; /* PRISM-118 512K standard context capacity */
    var DOCK_WIDE_BREAKPOINT_PX = 1180;
    var DOCK_MEDIUM_BREAKPOINT_PX = 960;
    var DOCK_COMPACT_BREAKPOINT_PX = DOCK_WIDE_BREAKPOINT_PX;
    var DOCK_OPEN_TRANSITION_MS = 300;
    var DOCK_CLOSE_TRANSITION_MS = 260;
    var BLIND_FLASH_DURATION_MS = 1000;
    var LOCAL_RIM_RADIUS_PX = 160;
    var EXT_RIM_PROXIMITY_PX = 150; /* V13.1: 150px external near-edge CNC chamfer specular proximity sensing */

    var EFFORT_ORDER = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'];
    var EFFORT_NORM_MAP = {
      off: 0.12,
      minimal: 0.2,
      low: 0.25,
      medium: 0.5,
      high: 0.78,
      xhigh: 1.0,
      max: 1.0,
    };
    var EFFORT_LABELS = {
      off: 'Off',
      minimal: 'Minimal',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      xhigh: 'Extra',
      max: 'Max',
    };

    var MODEL_TRIGGER_TEXT_RE =
      /(?:gemini|hydrogen|carbon|neon|argon|flash|claude|sonnet|opus|haiku|gpt|openai|o1|o3|o4|codex|orchestrator|编排|调度器)/i;

    var EXCLUDED_FAMILY_RE =
      /\b(?:orchestrator|claude|anthropic|sonnet|opus|haiku|gpt|openai|codex|deepseek|llama|mistral|qwen)\b|\bo[134](?:-[a-z0-9]+)?\b|编排|调度器/i;

    var ZH_EFFORT_PAREN_RE =
      /\s*[（(]\s*(超高|极高|超深|高思考|中思考|低思考|极低|最低|深度思考|思考中?|中等|高|中|低|自动|关闭)\s*[)）]\s*$/;

    var EN_EFFORT_PAREN_RE =
      /\s*\(\s*(off|minimal|low|medium|med|high|xhigh|extra|max|auto)(?:\s+thinking)?\s*\)\s*$/i;

    /* Compact 90-slot main periodic table (18 cols x 7 rows):
       [z, symbol, name, zh, mass, row, col, group, numLabel?] */
    var RAW_SLOTS_90 = [
      [1, 'H', 'Hydrogen', '氢', '1.008', 1, 1, 'nonmetal'],
      [2, 'He', 'Helium', '氦', '4.0026', 1, 18, 'noble'],

      [3, 'Li', 'Lithium', '锂', '6.94', 2, 1, 'alkali'],
      [4, 'Be', 'Beryllium', '铍', '9.0122', 2, 2, 'alkaline'],
      [5, 'B', 'Boron', '硼', '10.81', 2, 13, 'metalloid'],
      [6, 'C', 'Carbon', '碳', '12.011', 2, 14, 'nonmetal'],
      [7, 'N', 'Nitrogen', '氮', '14.007', 2, 15, 'nonmetal'],
      [8, 'O', 'Oxygen', '氧', '15.999', 2, 16, 'nonmetal'],
      [9, 'F', 'Fluorine', '氟', '18.998', 2, 17, 'halogen'],
      [10, 'Ne', 'Neon', '氖', '20.180', 2, 18, 'noble'],

      [11, 'Na', 'Sodium', '钠', '22.990', 3, 1, 'alkali'],
      [12, 'Mg', 'Magnesium', '镁', '24.305', 3, 2, 'alkaline'],
      [13, 'Al', 'Aluminium', '铝', '26.982', 3, 13, 'post-transition'],
      [14, 'Si', 'Silicon', '硅', '28.085', 3, 14, 'metalloid'],
      [15, 'P', 'Phosphorus', '磷', '30.974', 3, 15, 'nonmetal'],
      [16, 'S', 'Sulfur', '硫', '32.06', 3, 16, 'nonmetal'],
      [17, 'Cl', 'Chlorine', '氯', '35.45', 3, 17, 'halogen'],
      [18, 'Ar', 'Argon', '氩', '39.948', 3, 18, 'noble'],

      [19, 'K', 'Potassium', '钾', '39.098', 4, 1, 'alkali'],
      [20, 'Ca', 'Calcium', '钙', '40.078', 4, 2, 'alkaline'],
      [21, 'Sc', 'Scandium', '钪', '44.956', 4, 3, 'transition'],
      [22, 'Ti', 'Titanium', '钛', '47.867', 4, 4, 'transition'],
      [23, 'V', 'Vanadium', '钒', '50.942', 4, 5, 'transition'],
      [24, 'Cr', 'Chromium', '铬', '51.996', 4, 6, 'transition'],
      [25, 'Mn', 'Manganese', '锰', '54.938', 4, 7, 'transition'],
      [26, 'Fe', 'Iron', '铁', '55.845', 4, 8, 'transition'],
      [27, 'Co', 'Cobalt', '钴', '58.933', 4, 9, 'transition'],
      [28, 'Ni', 'Nickel', '镍', '58.693', 4, 10, 'transition'],
      [29, 'Cu', 'Copper', '铜', '63.546', 4, 11, 'transition'],
      [30, 'Zn', 'Zinc', '锌', '65.38', 4, 12, 'transition'],
      [31, 'Ga', 'Gallium', '镓', '69.723', 4, 13, 'post-transition'],
      [32, 'Ge', 'Germanium', '锗', '72.630', 4, 14, 'metalloid'],
      [33, 'As', 'Arsenic', '砷', '74.922', 4, 15, 'metalloid'],
      [34, 'Se', 'Selenium', '硒', '78.971', 4, 16, 'nonmetal'],
      [35, 'Br', 'Bromine', '溴', '79.904', 4, 17, 'halogen'],
      [36, 'Kr', 'Krypton', '氪', '83.798', 4, 18, 'noble'],

      [37, 'Rb', 'Rubidium', '铷', '85.468', 5, 1, 'alkali'],
      [38, 'Sr', 'Strontium', '锶', '87.62', 5, 2, 'alkaline'],
      [39, 'Y', 'Yttrium', '钇', '88.906', 5, 3, 'transition'],
      [40, 'Zr', 'Zirconon'.replace('non', 'nium'), '锆', '91.224', 5, 4, 'transition'],
      [41, 'Nb', 'Niobium', '铌', '92.906', 5, 5, 'transition'],
      [42, 'Mo', 'Molybdenum', '钼', '95.95', 5, 6, 'transition'],
      [43, 'Tc', 'Technetium', '锝', '98', 5, 7, 'transition'],
      [44, 'Ru', 'Ruthenium', '钌', '101.07', 5, 8, 'transition'],
      [45, 'Rh', 'Rhodium', '铑', '102.91', 5, 9, 'transition'],
      [46, 'Pd', 'Palladium', '钯', '106.42', 5, 10, 'transition'],
      [47, 'Ag', 'Silver', '银', '107.87', 5, 11, 'transition'],
      [48, 'Cd', 'Cadmium', '镉', '112.41', 5, 12, 'transition'],
      [49, 'In', 'Indium', '铟', '114.82', 5, 13, 'post-transition'],
      [50, 'Sn', 'Tin', '锡', '118.71', 5, 14, 'post-transition'],
      [51, 'Sb', 'Antimony', '锑', '121.76', 5, 15, 'metalloid'],
      [52, 'Te', 'Tellurium', '碲', '127.60', 5, 16, 'metalloid'],
      [53, 'I', 'Iodine', '碘', '126.90', 5, 17, 'halogen'],
      [54, 'Xe', 'Xenon', '氙', '131.29', 5, 18, 'noble'],

      [55, 'Cs', 'Caesium', '铯', '132.91', 6, 1, 'alkali'],
      [56, 'Ba', 'Barium', '钡', '137.33', 6, 2, 'alkaline'],
      [57, 'La', 'Lanthanum', '镧', '138.91', 6, 3, 'lanthanoid', '57-71'],
      [72, 'Hf', 'Hafnium', '铪', '178.49', 6, 4, 'transition'],
      [73, 'Ta', 'Tantalum', '钽', '180.95', 6, 5, 'transition'],
      [74, 'W', 'Tungsten', '钨', '183.84', 6, 6, 'transition'],
      [75, 'Re', 'Rhenium', '铼', '186.21', 6, 7, 'transition'],
      [76, 'Os', 'Osmium', '锇', '190.23', 6, 8, 'transition'],
      [77, 'Ir', 'Iridium', '铱', '192.22', 6, 9, 'transition'],
      [78, 'Pt', 'Platinum', '铂', '195.08', 6, 10, 'transition'],
      [79, 'Au', 'Gold', '金', '196.97', 6, 11, 'transition'],
      [80, 'Hg', 'Mercury', '汞', '200.59', 6, 12, 'transition'],
      [81, 'Tl', 'Thallium', '铊', '204.38', 6, 13, 'post-transition'],
      [82, 'Pb', 'Lead', '铅', '207.2', 6, 14, 'post-transition'],
      [83, 'Bi', 'Bismuth', '铋', '208.98', 6, 15, 'post-transition'],
      [84, 'Po', 'Polonium', '钋', '209', 6, 16, 'metalloid'],
      [85, 'At', 'Astatine', '砹', '210', 6, 17, 'halogen'],
      [86, 'Rn', 'Radon', '氡', '222', 6, 18, 'noble'],

      [87, 'Fr', 'Francium', '钫', '223', 7, 1, 'alkali'],
      [88, 'Ra', 'Radium', '镭', '226', 7, 2, 'alkaline'],
      [89, 'Ac', 'Actinium', '锕', '227', 7, 3, 'actinoid', '89-103'],
      [104, 'Rf', 'Rutherfordium', '𬬻', '267', 7, 4, 'transition'],
      [105, 'Db', 'Dubnium', '𬭊', '268', 7, 5, 'transition'],
      [106, 'Sg', 'Seaborgium', '𬭳', '269', 7, 6, 'transition'],
      [107, 'Bh', 'Bohrium', '𬭛', '270', 7, 7, 'transition'],
      [108, 'Hs', 'Hassium', '𬭶', '277', 7, 8, 'transition'],
      [109, 'Mt', 'Meitnerium', '鿏', '278', 7, 9, 'transition'],
      [110, 'Ds', 'Darmstadtium', '𫟼', '281', 7, 10, 'transition'],
      [111, 'Rg', 'Roentgenium', '𬬭', '282', 7, 11, 'transition'],
      [112, 'Cn', 'Copernicium', '鎶', '285', 7, 12, 'transition'],
      [113, 'Nh', 'Nihonium', '鉨', '286', 7, 13, 'post-transition'],
      [114, 'Fl', 'Flerovium', '𫓧', '289', 7, 14, 'post-transition'],
      [115, 'Mc', 'Moscovium', '镆', '290', 7, 15, 'post-transition'],
      [116, 'Lv', 'Livermorium', '𫟷', '293', 7, 16, 'post-transition'],
      [117, 'Ts', 'Tennessine', '鿬', '294', 7, 17, 'halogen'],
      [118, 'Og', 'Oganesson', '鿫', '294', 7, 18, 'noble'],
    ];

    /* Remaining f-block elements (58..71 -> slot 57, 90..103 -> slot 89) so all 118 IUPAC elements match */
    var RAW_FBLOCK_28 = [
      [58, 'Ce', 'Cerium', '铈', '140.12', 57, 'lanthanoid'],
      [59, 'Pr', 'Praseodymium', '镨', '140.91', 57, 'lanthanoid'],
      [60, 'Nd', 'Neodymium', '钕', '144.24', 57, 'lanthanoid'],
      [61, 'Pm', 'Promethium', '钷', '145', 57, 'lanthanoid'],
      [62, 'Sm', 'Samarium', '钐', '150.36', 57, 'lanthanoid'],
      [63, 'Eu', 'Europium', '铕', '151.96', 57, 'lanthanoid'],
      [64, 'Gd', 'Gadolinium', '钆', '157.25', 57, 'lanthanoid'],
      [65, 'Tb', 'Terbium', '铽', '158.93', 57, 'lanthanoid'],
      [66, 'Dy', 'Dysprosium', '镝', '162.50', 57, 'lanthanoid'],
      [67, 'Ho', 'Holmium', '钬', '164.93', 57, 'lanthanoid'],
      [68, 'Er', 'Erbium', '铒', '167.26', 57, 'lanthanoid'],
      [69, 'Tm', 'Thulium', '铥', '168.93', 57, 'lanthanoid'],
      [70, 'Yb', 'Ytterbium', '镱', '173.05', 57, 'lanthanoid'],
      [71, 'Lu', 'Lutetium', '镥', '174.97', 57, 'lanthanoid'],

      [90, 'Th', 'Thorium', '钍', '232.04', 89, 'actinoid'],
      [91, 'Pa', 'Protactinium', '镤', '231.04', 89, 'actinoid'],
      [92, 'U', 'Uranium', '铀', '238.03', 89, 'actinoid'],
      [93, 'Np', 'Neptunium', '镎', '237', 89, 'actinoid'],
      [94, 'Pu', 'Plutonium', '钚', '244', 89, 'actinoid'],
      [95, 'Am', 'Americium', '镅', '243', 89, 'actinoid'],
      [96, 'Cm', 'Curium', '锔', '247', 89, 'actinoid'],
      [97, 'Bk', 'Berkelium', '锫', '247', 89, 'actinoid'],
      [98, 'Cf', 'Californium', '锎', '251', 89, 'actinoid'],
      [99, 'Es', 'Einsteinium', '锿', '252', 89, 'actinoid'],
      [100, 'Fm', 'Fermium', '镄', '257', 89, 'actinoid'],
      [101, 'Md', 'Mendelevium', '钔', '258', 89, 'actinoid'],
      [102, 'No', 'Nobelium', '锘', '259', 89, 'actinoid'],
      [103, 'Lr', 'Lawrencium', '铹', '266', 89, 'actinoid'],
    ];

    var ELEMENT_BY_NAME = new Map();
    var SLOT_BY_Z = new Map();

    var ELEMENTS_90 = Object.freeze(
      RAW_SLOTS_90.map(function (r) {
        var item = Object.freeze({
          z: r[0],
          slotZ: r[0],
          symbol: r[1],
          name: r[2],
          zh: r[3],
          mass: r[4],
          row: r[5],
          col: r[6],
          group: r[7],
          numLabel: r[8] || String(r[0]),
        });
        SLOT_BY_Z.set(item.z, item);
        ELEMENT_BY_NAME.set(item.name.toLowerCase(), item);
        return item;
      })
    );

    for (var fi = 0; fi < RAW_FBLOCK_28.length; fi += 1) {
      var fr = RAW_FBLOCK_28[fi];
      var parentSlot = SLOT_BY_Z.get(fr[5]);
      var fItem = Object.freeze({
        z: fr[0],
        slotZ: fr[5],
        symbol: fr[1],
        name: fr[2],
        zh: fr[3],
        mass: fr[4],
        row: parentSlot ? parentSlot.row : 6,
        col: parentSlot ? parentSlot.col : 3,
        group: fr[6],
        numLabel: String(fr[0]),
      });
      ELEMENT_BY_NAME.set(fItem.name.toLowerCase(), fItem);
    }

    /* US/UK IUPAC spelling aliases */
    ELEMENT_BY_NAME.set('aluminum', SLOT_BY_Z.get(13));
    ELEMENT_BY_NAME.set('cesium', SLOT_BY_Z.get(55));
    ELEMENT_BY_NAME.set('sulphur', SLOT_BY_Z.get(16));

    var GROUP_META = {
      nonmetal: { en: 'Reactive Nonmetal', zh: '活泼非金属' },
      noble: { en: 'Noble Gas', zh: '稀有气体' },
      alkali: { en: 'Alkali Metal', zh: '碱金属' },
      alkaline: { en: 'Alkaline Earth Metal', zh: '碱土金属' },
      metalloid: { en: 'Metalloid', zh: '类金属' },
      halogen: { en: 'Halogen', zh: '卤素' },
      'post-transition': { en: 'Post-Transition Metal', zh: '后过渡金属' },
      transition: { en: 'Transition Metal', zh: '过渡金属' },
      lanthanoid: { en: 'Lanthanoid Series', zh: '镧系稀土' },
      actinoid: { en: 'Actinoid Series', zh: '锕系元素' },
    };

    var ELEMENT_LORE = {
      1: {
        en: 'Group 1 · Reactive Nonmetal · Agile High-Throughput Reasoning',
        zh: '第 1 族 · 活泼非金属 · 轻量疾速高吞吐推理核',
      },
      6: {
        en: 'Group 14 · Tetravalent Carbon Core · Flagship Deep Synthesis',
        zh: '第 14 族 · 四价碳基核心 · 旗舰深度推理与工程主力',
      },
      10: {
        en: 'Group 18 · Noble Gas · Luminous Low-Latency Multimodal',
        zh: '第 18 族 · 稀有气体 · 灵动多模态与敏捷响应核',
      },
      18: {
        en: 'Group 18 · Noble Gas · Balanced Precision & Visual Craft',
        zh: '第 18 族 · 稀有气体 · 视觉审美与均衡分析核',
      },
    };

    /* Host Bottom Trigger Satin Clearcoat Mineral PBT Mini-Keycap Palettes (GMK Mineral Contract) */
    /* V14.1 Theme-Native Frosted Hairline Micro-Badge Palette Resolver (~8-10% whisper tint harmony, 0 fake 3D skirt/gloss) */
    var MINI_BADGE_SOUL_HEX = {
      1: { dark: '#56C8FA', light: '#0284C7' },
      6: { dark: '#669DF6', light: '#2563EB' },
      10: { dark: '#F4845F', light: '#D95D24' },
      18: { dark: '#9B7DF7', light: '#6D28D9' },
      orchestrator: { dark: '#E2B354', light: '#A16207' },
      flash: { dark: '#38BDF8', light: '#0284C7' },
      claude: { dark: '#DF8458', light: '#B45309' },
      gpt: { dark: '#4FD1C5', light: '#0F766E' },
      fallback: { dark: '#8EA4C8', light: '#475569' },
    };

    var MINI_BADGE_THEME_SUBSTRATES = {
      'obsidian-dark': {
        surfaceRgb: [255, 255, 255],
        surfaceBaseAlpha: 0.038,
        tintSurfaceAlpha: 0.092,
        borderRgb: [218, 228, 255],
        borderAlpha: 0.19,
        fgRgb: [204, 212, 226],
        fgTintMix: 0.36,
        borderTintMix: 0.28,
      },
      'warm-dark': {
        surfaceRgb: [245, 236, 222],
        surfaceBaseAlpha: 0.046,
        tintSurfaceAlpha: 0.096,
        borderRgb: [232, 206, 174],
        borderAlpha: 0.22,
        fgRgb: [218, 208, 194],
        fgTintMix: 0.38,
        borderTintMix: 0.30,
      },
      'crystal-light': {
        surfaceRgb: [15, 23, 42],
        surfaceBaseAlpha: 0.056,
        tintSurfaceAlpha: 0.096,
        borderRgb: [15, 23, 42],
        borderAlpha: 0.22,
        fgRgb: [26, 36, 52],
        fgTintMix: 0.24,
        borderTintMix: 0.26,
      },
      'alabaster-light': {
        surfaceRgb: [42, 32, 20],
        surfaceBaseAlpha: 0.062,
        tintSurfaceAlpha: 0.096,
        borderRgb: [42, 32, 20],
        borderAlpha: 0.23,
        fgRgb: [36, 30, 24],
        fgTintMix: 0.22,
        borderTintMix: 0.24,
      },
    };

    function parseHexRgb255(hex, fallbackRgb) {
      var s = String(hex || '').trim();
      if (s.charAt(0) === '#') s = s.slice(1);
      if (s.length === 3) {
        s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
      }
      if (s.length !== 6) return fallbackRgb || [136, 150, 172];
      var num = parseInt(s, 16);
      if (isNaN(num)) return fallbackRgb || [136, 150, 172];
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    function lerpRgb255(a, b, t) {
      var k = t < 0 ? 0 : t > 1 ? 1 : t;
      return [
        Math.round(a[0] + (b[0] - a[0]) * k),
        Math.round(a[1] + (b[1] - a[1]) * k),
        Math.round(a[2] + (b[2] - a[2]) * k),
      ];
    }

    function rgba255Css(rgb, alpha) {
      var a = Math.round((alpha < 0 ? 0 : alpha > 1 ? 1 : alpha) * 1000) / 1000;
      return 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + a + ')';
    }

    function rgb255ToHex(rgb) {
      var to2 = function (v) {
        var h = Math.max(0, Math.min(255, Math.round(v))).toString(16);
        return h.length === 1 ? '0' + h : h;
      };
      return ('#' + to2(rgb[0]) + to2(rgb[1]) + to2(rgb[2])).toUpperCase();
    }

    function resolveThemeNativeMiniBadgeColors(tintKey, profile) {
      var prof = profile || { id: 'obsidian-dark', isLight: false, isMono: false, accent: 'follow', primaryHex: '#669DF6' };
      var kitId = MINI_BADGE_THEME_SUBSTRATES[prof.id] ? prof.id : (prof.isLight ? 'crystal-light' : 'obsidian-dark');
      var sub = MINI_BADGE_THEME_SUBSTRATES[kitId];

      if (prof.isMono || prof.accent === 'mono') {
        var monoFg = prof.isLight
          ? (kitId === 'alabaster-light' ? '#3B352E' : '#334155')
          : (kitId === 'warm-dark' ? '#CFC8BE' : '#C8CDD6');
        return {
          bg: rgba255Css(sub.surfaceRgb, sub.surfaceBaseAlpha + 0.012),
          fg: monoFg,
          border: rgba255Css(sub.borderRgb, sub.borderAlpha),
        };
      }

      var soulEntry = MINI_BADGE_SOUL_HEX[tintKey] || MINI_BADGE_SOUL_HEX.fallback;
      var soulHex = prof.isLight ? soulEntry.light : soulEntry.dark;
      var soulRgb = parseHexRgb255(soulHex, sub.fgRgb);

      var harmonyRgb = soulRgb;
      var acc = String(prof.accent || 'follow');
      if (acc === 'cobalt' || acc === 'iris' || acc === 'amber') {
        var hostAccRgb = parseHexRgb255(prof.primaryHex, soulRgb);
        harmonyRgb = lerpRgb255(hostAccRgb, soulRgb, 0.25);
      } else if (kitId === 'warm-dark' && tintKey === 'orchestrator') {
        harmonyRgb = [228, 182, 98];
      }

      var bgRgb = lerpRgb255(sub.surfaceRgb, harmonyRgb, 0.62);
      var borderRgb = lerpRgb255(sub.borderRgb, harmonyRgb, sub.borderTintMix);
      var fgRgb = lerpRgb255(sub.fgRgb, harmonyRgb, sub.fgTintMix);

      return {
        bg: rgba255Css(bgRgb, sub.tintSurfaceAlpha),
        fg: rgb255ToHex(fgRgb),
        border: rgba255Css(borderRgb, sub.borderAlpha + 0.04),
      };
    }

    /* V14 Google DeepMind Official Spectrum HUD Gem Tokens */
    var CORE_FOUR_ELEMENTS = [
      { slotZ: 1, symbol: 'H' },
      { slotZ: 6, symbol: 'C' },
      { slotZ: 10, symbol: 'Ne' },
      { slotZ: 18, symbol: 'Ar' },
    ];

    var HUD_GEM_STYLES = {
      1: {
        dot: 'linear-gradient(135deg, #38BDF8 0%, #7DD3FC 55%, #BAE6FD 100%)',
        glow: 'rgba(56, 189, 248, 0.36)',
        ring: 'rgba(56, 189, 248, 0.24)',
        haloDark: 'rgba(56, 189, 248, 0.032)',
        haloLight: 'rgba(2, 132, 199, 0.024)',
      },
      6: {
        dot: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #67E8F9 100%)',
        glow: 'rgba(59, 130, 246, 0.38)',
        ring: 'rgba(96, 165, 250, 0.26)',
        haloDark: 'rgba(59, 130, 246, 0.034)',
        haloLight: 'rgba(29, 78, 216, 0.024)',
      },
      10: {
        dot: 'linear-gradient(135deg, #FF5A3D 0%, #FF6B4A 52%, #FFB347 100%)',
        glow: 'rgba(255, 107, 74, 0.38)',
        ring: 'rgba(255, 138, 92, 0.25)',
        haloDark: 'rgba(255, 107, 74, 0.032)',
        haloLight: 'rgba(234, 88, 12, 0.024)',
      },
      18: {
        dot: 'linear-gradient(135deg, #3B66F5 0%, #7C5CFF 55%, #A78BFA 100%)',
        glow: 'rgba(124, 92, 255, 0.38)',
        ring: 'rgba(139, 92, 246, 0.26)',
        haloDark: 'rgba(124, 92, 255, 0.034)',
        haloLight: 'rgba(109, 40, 217, 0.024)',
      },
      fallback: {
        dot: 'linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%)',
        glow: 'rgba(59, 130, 246, 0.34)',
        ring: 'rgba(96, 165, 250, 0.22)',
        haloDark: 'rgba(59, 130, 246, 0.048)',
        haloLight: 'rgba(37, 99, 235, 0.036)',
      },
      monoDark: {
        dot: 'linear-gradient(180deg, #F1F5F9 0%, #CBD5E1 100%)',
        glow: 'rgba(226, 232, 240, 0.36)',
        ring: 'rgba(226, 232, 240, 0.22)',
        haloDark: 'rgba(208, 216, 230, 0.058)',
        haloLight: 'rgba(100, 116, 139, 0.045)',
      },
      monoLight: {
        dot: 'linear-gradient(180deg, #334155 0%, #0F172A 100%)',
        glow: 'rgba(51, 65, 85, 0.26)',
        ring: 'rgba(51, 65, 85, 0.18)',
        haloDark: 'rgba(208, 216, 230, 0.058)',
        haloLight: 'rgba(71, 85, 105, 0.045)',
      },
    };

    var PICKER_CSS = [
      /* V14 PRISM-118 Precision Hardware Desk Console · Google Official Dual-Tone Spectrum */
      '#prism-periodic-console-root{',
      'position:fixed;inset:0;z-index:2147483640;display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'gap:8px;padding:10px 12px;box-sizing:border-box;overflow:hidden;isolation:isolate;',
      'font-family:"Inter","SF Pro Display","Plus Jakarta Sans",-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Noto Sans SC",sans-serif;',
      '--pp-ambient-mul:1;',
      '--pp-px:-999px;--pp-py:-999px;--pp-card-px:-999px;--pp-card-py:-999px;',
      '--pp-right-px:-999px;--pp-right-py:-999px;--pp-dock-rim-alpha:0;--pp-card-rim-alpha:0;--pp-right-rim-alpha:0;',
      '--pp-model-accent:#3B82F6;--pp-model-secondary:#67E8F9;--pp-model-grad:linear-gradient(90deg,#3B82F6 0%,#67E8F9 100%);--pp-model-glow:rgba(59,130,246,0.32);',
      '--pp-aura-px:0px;--pp-aura-py:0px;--pp-shadow-px:0px;--pp-shadow-py:0px;',
      '--pp-elem-halo:rgba(226,232,240,0.02);--pp-elem-ring:rgba(226,232,240,0.24);',
      '--pp-spatial-scrim:radial-gradient(ellipse 80% 72% at 50% 44%,rgba(16,18,22,0.84) 0%,rgba(10,12,15,0.92) 60%,rgba(6,7,10,0.96) 100%);',
      '--pp-felt-bg:radial-gradient(ellipse 72% 85% at 50% 18%,rgba(255,255,255,0.032) 0%,rgba(255,255,255,0.006) 48%,rgba(0,0,0,0.34) 100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.014) 0px,rgba(255,255,255,0.014) 1px,transparent 1px,transparent 3px),repeating-linear-gradient(-45deg,rgba(0,0,0,0.075) 0px,rgba(0,0,0,0.075) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#181A1F 0%,#121418 100%);',
      '--pp-dock-hairline:rgba(218,228,242,0.12);--pp-grip-bg:rgba(220,228,240,0.22);',
      '--pp-cnc-shell:linear-gradient(168deg,#3B4049 0%,#2B3038 36%,#20242B 100%);',
      '--pp-cnc-border:rgba(196,208,224,0.22);--pp-cnc-chamfer-top:rgba(244,248,255,0.44);--pp-cnc-chamfer-bot:rgba(0,0,0,0.72);',
      '--pp-cnc-shadow:0 12px 26px rgba(0,0,0,0.52),0 2px 6px rgba(0,0,0,0.62);--pp-cnc-engraving:rgba(210,218,230,0.52);',
      '--pp-screen-bg:linear-gradient(180deg,#0A0C10 0%,#0E1116 100%);--pp-screen-border:rgba(255,255,255,0.08);',
      '--pp-screen-inset:inset 0 2px 7px rgba(0,0,0,0.72),inset 0 0 0 1px rgba(0,0,0,0.55);',
      '--pp-btn-well-bg:linear-gradient(180deg,#12151B 0%,#181C24 100%);',
      '--pp-btn-metal:linear-gradient(165deg,#4B525E 0%,#303640 52%,#22262E 100%);',
      '--pp-btn-metal-hover:linear-gradient(165deg,#5A6372 0%,#3A414D 52%,#292E38 100%);--pp-btn-metal-fg:#E8EEF6;',
      '--pp-bento-fg:#F5F7FA;--pp-bento-sub:#B6C0CE;--pp-bento-dim:#7C8798;',
      '--pp-bento-pill-bg:rgba(255,255,255,0.055);--pp-bento-pill-border:rgba(255,255,255,0.13);',
      '--pp-bento-pill-active:rgba(240,245,252,0.16);--pp-bento-track:rgba(255,255,255,0.10);',
      '--pp-seg-active-bg:linear-gradient(180deg,rgba(255,255,255,0.145) 0%,rgba(255,255,255,0.085) 100%);--pp-seg-active-fg:#F8FAFC;--pp-seg-active-border:rgba(255,255,255,0.22);--pp-seg-active-shadow:inset 0 1px 0 rgba(255,255,255,0.32),inset 0 -1px 0 rgba(0,0,0,0.44),0 1px 3px rgba(0,0,0,0.36);',
      '--pp-rim-core:rgba(255,255,255,0.92);--pp-rim-ice:rgba(214,226,244,0.48);--pp-rim-violet:rgba(168,180,200,0.16);',
      '--pp-contact-shadow:radial-gradient(ellipse 49% 25% at 50% 56%,rgba(0,0,0,0.68) 0%,rgba(0,0,0,0.34) 50%,rgba(0,0,0,0) 82%);',
      '--pp-levitation-shadow:radial-gradient(ellipse 56% 36% at 50% 66%,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.28) 54%,rgba(0,0,0,0) 86%);',
      '--pp-topo-color:rgba(176,192,214,0.30);--pp-topo-mul:0.035;',
      '--pp-hud-bg:linear-gradient(180deg,rgba(36,40,48,0.88) 0%,rgba(22,25,31,0.94) 100%);',
      '--pp-hud-border:rgba(218,228,242,0.18);--pp-hud-top-gleam:rgba(255,255,255,0.28);--pp-hud-bottom-lip:rgba(0,0,0,0.52);',
      '--pp-hud-shadow:rgba(0,0,0,0.44);--pp-hud-fg:#F5F7FA;--pp-hud-muted:#B6C0CE;--pp-hud-hover-fg:#FFFFFF;',
      '--pp-reset-active-bg:linear-gradient(180deg,#3C434F 0%,#262B33 100%);--pp-reset-active-ring:rgba(226,234,246,0.48);',
      '--pp-reset-active-shadow:inset 0 1px 0 rgba(255,255,255,0.46),0 8px 20px rgba(0,0,0,0.46);',
      '--pp-reset-kbd-bg:rgba(255,255,255,0.09);--pp-reset-kbd-border:rgba(255,255,255,0.16);--pp-focus-ring:rgba(226,236,248,0.58);',
      '--pp-tooltip-bg:rgba(13,16,22,0.96);--pp-tooltip-border:rgba(218,228,242,0.20);',
      '--pp-orch-bus:#F0BD5E;--pp-orch-ret:#B494F6;--pp-orch-node:#151224;',
      '--pp-orch-box-bd:rgba(168,132,232,0.44);--pp-orch-box-bg:rgba(158,122,224,0.10);',
      '--pp-orch-run-bd:rgba(125,211,252,0.36);--pp-orch-run-bg:rgba(125,211,252,0.08);',
      'background:var(--pp-spatial-scrim);',
      'backdrop-filter:blur(16px) saturate(110%);-webkit-backdrop-filter:blur(16px) saturate(110%);',
      'opacity:0;transition:opacity 180ms cubic-bezier(0.2,0,0,1);',
      '}',
      '#prism-periodic-console-root[data-open="1"]{opacity:1;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"]{',
      'position:relative;inset:auto;z-index:24;flex:0 0 auto;width:100%;height:0px;',
      'display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;',
      'padding:0;gap:0;overflow:hidden;border-top:1px solid var(--pp-dock-hairline);',
      'background:var(--pp-felt-bg);box-shadow:inset 0 10px 24px rgba(0,0,0,0.28);',
      'backdrop-filter:none;-webkit-backdrop-filter:none;',
      'transition:height 300ms cubic-bezier(0.22,1,0.36,1),opacity 180ms ease;',
      '}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-in-flow="0"]{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:2147483640;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-open="1"]{height:clamp(336px,38vh,392px);max-height:calc(100vh - 176px);opacity:1;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"][data-open="1"]{height:clamp(368px,43vh,422px);max-height:calc(100vh - 176px);}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"][data-open="1"]{height:var(--pp-short-dock-h,236px) !important;max-height:calc(100vh - 176px);}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-spatial-dock{padding:6px 10px 6px;gap:8px;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-stage{min-height:0 !important;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-micro-tags,#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-source-row,#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-tele-subscreen,#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-pulse-svg{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-radar-pane{grid-template-columns:68px minmax(0,1fr);gap:4px;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-short-viewport="1"] .pp-radar-svg{width:66px;height:66px;}',
      '@media (max-height:560px){#prism-periodic-console-root[data-stage-mode="drawer"][data-open="1"]{height:clamp(184px,45vh,252px) !important;max-height:calc(100vh - 176px);}#prism-periodic-console-root[data-stage-mode="drawer"] .pp-spatial-dock{padding:6px 10px 6px;gap:8px;}#prism-periodic-console-root[data-stage-mode="drawer"] .pp-stage{min-height:0 !important;}#prism-periodic-console-root[data-stage-mode="drawer"] .pp-micro-tags,#prism-periodic-console-root[data-stage-mode="drawer"] .pp-source-row,#prism-periodic-console-root[data-stage-mode="drawer"] .pp-tele-subscreen,#prism-periodic-console-root[data-stage-mode="drawer"] .pp-pulse-svg{display:none;}#prism-periodic-console-root[data-stage-mode="drawer"] .pp-radar-pane{grid-template-columns:68px minmax(0,1fr);gap:4px;}#prism-periodic-console-root[data-stage-mode="drawer"] .pp-radar-svg{width:66px;height:66px;}}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-closing="1"]{height:0px !important;opacity:0;transition:height 260ms cubic-bezier(0.32,0,0.67,0),opacity 180ms ease;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"] > .pp-deskmat-stage{opacity:0;pointer-events:none;}',
      '#prism-periodic-console-root[data-orbit-dragging="1"],#prism-periodic-console-root[data-orbit-dragging="1"] *{cursor:grabbing !important;}',
      '#prism-periodic-console-root[data-orbit-dragging="1"] .pp-hit-layer .pp-hit-btn{pointer-events:none !important;}',
      '#prism-periodic-console-root[data-effort-dragging="1"],#prism-periodic-console-root[data-effort-dragging="1"] *{cursor:ew-resize !important;}',
      /* Warm Dark Bronze-Titanium CNC + Champagne Chamfer */
      '#prism-periodic-console-root[data-kit="warm-dark"]{',
      '--pp-spatial-scrim:radial-gradient(ellipse 80% 72% at 50% 44%,rgba(22,18,15,0.85) 0%,rgba(14,11,9,0.93) 60%,rgba(8,6,5,0.97) 100%);',
      '--pp-felt-bg:radial-gradient(ellipse 72% 85% at 50% 18%,rgba(255,240,218,0.036) 0%,rgba(255,240,218,0.008) 48%,rgba(0,0,0,0.36) 100%),repeating-linear-gradient(45deg,rgba(255,240,218,0.015) 0px,rgba(255,240,218,0.015) 1px,transparent 1px,transparent 3px),repeating-linear-gradient(-45deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#1C1714 0%,#14100E 100%);',
      '--pp-dock-hairline:rgba(232,202,162,0.14);--pp-grip-bg:rgba(232,202,162,0.24);',
      '--pp-cnc-shell:linear-gradient(168deg,#42362D 0%,#302720 38%,#221B16 100%);',
      '--pp-cnc-border:rgba(224,194,154,0.24);--pp-cnc-chamfer-top:rgba(252,232,200,0.46);--pp-cnc-chamfer-bot:rgba(0,0,0,0.74);',
      '--pp-cnc-engraving:rgba(226,204,174,0.55);',
      '--pp-screen-bg:linear-gradient(180deg,#0C0A08 0%,#120E0B 100%);--pp-screen-border:rgba(245,224,196,0.09);',
      '--pp-btn-well-bg:linear-gradient(180deg,#171310 0%,#1F1915 100%);',
      '--pp-btn-metal:linear-gradient(165deg,#544539 0%,#392E26 52%,#261E19 100%);',
      '--pp-btn-metal-hover:linear-gradient(165deg,#645345 0%,#45382E 52%,#2F261F 100%);',
      '--pp-btn-metal-fg:#FAF3E8;--pp-bento-fg:#FAF5EE;--pp-bento-sub:#CEC0B0;--pp-bento-dim:#948474;',
      '--pp-seg-active-bg:linear-gradient(180deg,rgba(252,232,202,0.155) 0%,rgba(230,196,154,0.088) 100%);--pp-seg-active-fg:#FFF8EE;--pp-seg-active-border:rgba(244,214,174,0.24);--pp-seg-active-shadow:inset 0 1px 0 rgba(255,242,220,0.30),inset 0 -1px 0 rgba(0,0,0,0.48),0 1px 3px rgba(0,0,0,0.40);',
      '--pp-rim-core:rgba(255,244,226,0.92);--pp-rim-ice:rgba(236,196,144,0.48);--pp-rim-violet:rgba(200,152,108,0.16);',
      '--pp-tooltip-bg:rgba(20,16,13,0.97);--pp-tooltip-border:rgba(232,202,162,0.22);',
      '}',
      /* Crystal Light — Silver Anodized CNC Aluminum (Apple Studio / Braun Edition) */
      '#prism-periodic-console-root[data-kit="crystal-light"]{',
      '--pp-spatial-scrim:radial-gradient(ellipse 80% 72% at 50% 44%,rgba(230,235,242,0.88) 0%,rgba(216,222,232,0.94) 60%,rgba(202,210,222,0.97) 100%);',
      '--pp-felt-bg:radial-gradient(ellipse 76% 88% at 50% 16%,rgba(255,255,255,0.34) 0%,rgba(255,255,255,0.06) 52%,rgba(100,112,130,0.12) 100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.14) 0px,rgba(255,255,255,0.14) 1px,transparent 1px,transparent 3px),repeating-linear-gradient(-45deg,rgba(40,52,70,0.036) 0px,rgba(40,52,70,0.036) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#D8DDE5 0%,#CFD5DF 100%);',
      '--pp-dock-hairline:rgba(25,35,52,0.13);--pp-grip-bg:rgba(30,41,59,0.20);',
      '--pp-cnc-shell:linear-gradient(168deg,#F2F5F9 0%,#E1E6EE 44%,#CFD6E1 100%);',
      '--pp-cnc-border:rgba(15,23,42,0.14);--pp-cnc-chamfer-top:rgba(255,255,255,0.98);--pp-cnc-chamfer-bot:rgba(51,65,85,0.22);',
      '--pp-cnc-shadow:0 10px 22px rgba(24,36,56,0.18),0 2px 5px rgba(24,36,56,0.14);--pp-cnc-engraving:rgba(48,58,74,0.68);',
      '--pp-screen-bg:linear-gradient(180deg,#F9FBFE 0%,#EEF2F8 100%);--pp-screen-border:rgba(15,23,42,0.10);',
      '--pp-screen-inset:inset 0 1.5px 4px rgba(15,23,42,0.10),inset 0 0 0 1px rgba(15,23,42,0.06);',
      '--pp-btn-well-bg:linear-gradient(180deg,#D2D9E3 0%,#E0E6EF 100%);',
      '--pp-btn-metal:linear-gradient(165deg,#FFFFFF 0%,#E6EBF2 52%,#CED6E2 100%);',
      '--pp-btn-metal-hover:linear-gradient(165deg,#FFFFFF 0%,#F2F6FB 52%,#DCE3EE 100%);',
      '--pp-btn-metal-fg:#18202C;--pp-bento-fg:#111827;--pp-bento-sub:#3B4657;--pp-bento-dim:#606D80;',
      '--pp-bento-pill-bg:rgba(15,23,42,0.055);--pp-bento-pill-border:rgba(15,23,42,0.14);',
      '--pp-bento-pill-active:#FFFFFF;--pp-bento-track:rgba(15,23,42,0.11);',
      '--pp-seg-active-bg:linear-gradient(180deg,#FFFFFF 0%,#F0F4FA 100%);--pp-seg-active-fg:#0F172A;--pp-seg-active-border:rgba(15,23,42,0.18);--pp-seg-active-shadow:0 1px 3px rgba(15,23,42,0.14),0 0.5px 1px rgba(15,23,42,0.08),inset 0 1px 0 #FFFFFF;',
      '--pp-rim-core:rgba(255,255,255,0.98);--pp-rim-ice:rgba(96,136,214,0.44);--pp-rim-violet:rgba(59,130,246,0.16);',
      '--pp-contact-shadow:radial-gradient(ellipse 49% 25% at 50% 56%,rgba(24,36,56,0.24) 0%,rgba(30,41,59,0.10) 50%,rgba(24,36,56,0) 82%);',
      '--pp-levitation-shadow:radial-gradient(ellipse 56% 36% at 50% 66%,rgba(24,36,56,0.26) 0%,rgba(30,41,59,0.10) 54%,rgba(24,36,56,0) 86%);',
      '--pp-hud-bg:linear-gradient(180deg,rgba(250,252,255,0.90) 0%,rgba(232,238,246,0.95) 100%);',
      '--pp-hud-border:rgba(15,23,42,0.14);--pp-hud-top-gleam:#FFFFFF;--pp-hud-bottom-lip:rgba(15,23,42,0.08);',
      '--pp-hud-shadow:rgba(15,23,42,0.14);--pp-hud-fg:#0F172A;--pp-hud-muted:#334155;--pp-hud-hover-fg:#0F172A;',
      '--pp-reset-active-bg:linear-gradient(180deg,#FFFFFF 0%,#EDF2FA 100%);--pp-reset-active-ring:rgba(37,99,235,0.42);',
      '--pp-reset-active-shadow:inset 0 1px 0 #FFFFFF,0 6px 16px rgba(15,23,42,0.14);',
      '--pp-reset-kbd-bg:rgba(15,23,42,0.06);--pp-reset-kbd-border:rgba(15,23,42,0.14);--pp-focus-ring:rgba(37,99,235,0.46);',
      '--pp-tooltip-bg:rgba(250,252,255,0.98);--pp-tooltip-border:rgba(15,23,42,0.16);',
      '--pp-orch-bus:#C2780E;--pp-orch-ret:#6D28D9;--pp-orch-node:#FFFFFF;',
      '--pp-orch-box-bd:rgba(109,40,217,0.32);--pp-orch-box-bg:rgba(124,58,237,0.07);',
      '--pp-orch-run-bd:rgba(2,132,199,0.32);--pp-orch-run-bg:rgba(14,165,233,0.07);',
      '}',
      /* Alabaster Light — Braun / Apple Studio Warm Silver CNC Aluminum */
      '#prism-periodic-console-root[data-kit="alabaster-light"]{',
      '--pp-spatial-scrim:radial-gradient(ellipse 80% 72% at 50% 44%,rgba(228,224,217,0.88) 0%,rgba(214,209,200,0.94) 60%,rgba(200,194,184,0.97) 100%);',
      '--pp-felt-bg:radial-gradient(ellipse 76% 88% at 50% 16%,rgba(255,254,250,0.34) 0%,rgba(255,253,248,0.06) 52%,rgba(90,82,70,0.12) 100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.14) 0px,rgba(255,255,255,0.14) 1px,transparent 1px,transparent 3px),repeating-linear-gradient(-45deg,rgba(60,52,42,0.042) 0px,rgba(60,52,42,0.042) 1px,transparent 1px,transparent 3px),linear-gradient(180deg,#D6D2C9 0%,#CBC6BC 100%);',
      '--pp-dock-hairline:rgba(48,42,34,0.14);--pp-grip-bg:rgba(58,50,40,0.22);',
      '--pp-cnc-shell:linear-gradient(168deg,#F4F3EF 0%,#E4E2DC 44%,#D3D0C8 100%);',
      '--pp-cnc-border:rgba(40,36,30,0.15);--pp-cnc-chamfer-top:rgba(255,255,255,0.98);--pp-cnc-chamfer-bot:rgba(68,62,52,0.24);',
      '--pp-cnc-shadow:0 10px 22px rgba(42,36,28,0.18),0 2px 5px rgba(42,36,28,0.14);--pp-cnc-engraving:rgba(56,52,46,0.70);',
      '--pp-screen-bg:linear-gradient(180deg,#FAF9F6 0%,#F0EEE9 100%);--pp-screen-border:rgba(40,36,30,0.10);',
      '--pp-screen-inset:inset 0 1.5px 4px rgba(40,36,30,0.10),inset 0 0 0 1px rgba(40,36,30,0.06);',
      '--pp-btn-well-bg:linear-gradient(180deg,#D6D3CB 0%,#E4E1DA 100%);',
      '--pp-btn-metal:linear-gradient(165deg,#FFFFFF 0%,#EAE8E2 52%,#D4D1C9 100%);',
      '--pp-btn-metal-hover:linear-gradient(165deg,#FFFFFF 0%,#F5F3EE 52%,#E0DDD5 100%);',
      '--pp-btn-metal-fg:#1B1C20;--pp-bento-fg:#15161A;--pp-bento-sub:#42444B;--pp-bento-dim:#666972;',
      '--pp-bento-pill-bg:rgba(28,30,36,0.055);--pp-bento-pill-border:rgba(28,30,36,0.14);',
      '--pp-bento-pill-active:#FFFFFF;--pp-bento-track:rgba(28,30,36,0.12);',
      '--pp-seg-active-bg:linear-gradient(180deg,#FFFFFF 0%,#F4F2ED 100%);--pp-seg-active-fg:#14161B;--pp-seg-active-border:rgba(32,34,40,0.18);--pp-seg-active-shadow:0 1px 3px rgba(40,36,28,0.15),0 0.5px 1px rgba(40,36,28,0.09),inset 0 1px 0 #FFFFFF;',
      '--pp-rim-core:rgba(255,255,255,0.98);--pp-rim-ice:rgba(120,136,162,0.40);--pp-rim-violet:rgba(59,130,246,0.14);',
      '--pp-contact-shadow:radial-gradient(ellipse 49% 25% at 50% 56%,rgba(42,36,28,0.24) 0%,rgba(68,58,46,0.10) 50%,rgba(42,36,28,0) 82%);',
      '--pp-levitation-shadow:radial-gradient(ellipse 56% 36% at 50% 66%,rgba(42,36,28,0.26) 0%,rgba(68,58,46,0.10) 54%,rgba(42,36,28,0) 86%);',
      '--pp-hud-bg:linear-gradient(180deg,rgba(252,251,248,0.92) 0%,rgba(236,233,226,0.96) 100%);',
      '--pp-hud-border:rgba(40,36,30,0.14);--pp-hud-top-gleam:#FFFFFF;--pp-hud-bottom-lip:rgba(40,36,30,0.08);',
      '--pp-hud-shadow:rgba(40,36,30,0.14);--pp-hud-fg:#15161A;--pp-hud-muted:#42444B;--pp-hud-hover-fg:#15161A;',
      '--pp-reset-active-bg:linear-gradient(180deg,#FFFFFF 0%,#F3F1EC 100%);--pp-reset-active-ring:rgba(37,99,235,0.38);',
      '--pp-reset-active-shadow:inset 0 1px 0 #FFFFFF,0 6px 16px rgba(40,36,30,0.14);',
      '--pp-reset-kbd-bg:rgba(40,36,30,0.06);--pp-reset-kbd-border:rgba(40,36,30,0.14);--pp-focus-ring:rgba(37,99,235,0.44);',
      '--pp-tooltip-bg:rgba(252,251,248,0.98);--pp-tooltip-border:rgba(40,36,30,0.16);',
      '--pp-orch-bus:#B45309;--pp-orch-ret:#6D28D9;--pp-orch-node:#FAF9F6;',
      '--pp-orch-box-bd:rgba(109,40,217,0.32);--pp-orch-box-bg:rgba(124,58,237,0.07);',
      '--pp-orch-run-bd:rgba(2,132,199,0.32);--pp-orch-run-bg:rgba(14,165,233,0.07);',
      '}',
      '#prism-periodic-console-root[data-mono="1"]{',
      '--pp-orch-bus:#D4D8E0;--pp-orch-ret:#9CA3AF;--pp-orch-node:#12151B;',
      '--pp-orch-box-bd:rgba(203,213,225,0.32);--pp-orch-box-bg:rgba(226,232,240,0.06);',
      '--pp-orch-run-bd:rgba(148,163,184,0.28);--pp-orch-run-bg:rgba(148,163,184,0.05);',
      '}',
      '#prism-periodic-console-root[data-kit="crystal-light"][data-mono="1"],#prism-periodic-console-root[data-kit="alabaster-light"][data-mono="1"]{',
      '--pp-orch-bus:#334155;--pp-orch-ret:#64748B;--pp-orch-node:#FFFFFF;',
      '--pp-orch-box-bd:rgba(51,65,85,0.26);--pp-orch-box-bg:rgba(51,65,85,0.05);',
      '--pp-orch-run-bd:rgba(71,85,105,0.24);--pp-orch-run-bg:rgba(71,85,105,0.04);',
      '}',
      '#prism-periodic-console-root[data-kit="crystal-light"][data-stage-mode="drawer"],#prism-periodic-console-root[data-kit="alabaster-light"][data-stage-mode="drawer"]{backdrop-filter:none;-webkit-backdrop-filter:none;}',
      '.pp-dock-top-rim{',
      'position:absolute;left:0;right:0;top:0;height:1.5px;pointer-events:none;z-index:8;opacity:var(--pp-dock-rim-alpha,0);transition:opacity 80ms linear;',
      'background:radial-gradient(176px circle at var(--pp-px,-999px) 0px,var(--pp-rim-core) 0%,var(--pp-rim-ice) 44%,var(--pp-rim-violet) 76%,transparent 100%);',
      '}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-pointer-near="1"] .pp-dock-top-rim{opacity:var(--pp-dock-rim-alpha,1);}',
      '.pp-dock-grip{',
      'position:absolute;top:4px;left:50%;transform:translateX(-50%);width:30px;height:2.5px;border-radius:999px;',
      'background:var(--pp-grip-bg);pointer-events:none;z-index:7;',
      '}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-dock-top-rim,#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-dock-grip{display:none;}',
      /* V13.1 True Triptych Console Layout: Left MOD-01 + Center PRISM-118&AUX-06 + Right MOD-02 */
      '.pp-spatial-dock{',
      'position:relative;z-index:2;display:flex;flex-direction:row;align-items:stretch;justify-content:space-between;',
      'width:100%;max-width:none;height:100%;flex:1 1 auto;min-height:0;',
      'padding:11px 14px 10px;gap:12px;border-radius:0;box-sizing:border-box;',
      'background:transparent;border:0;box-shadow:none;',
      '}',
      '.pp-bento-grid,.pp-stage,.pp-right-wing{',
      'opacity:0;transform:translate3d(0,8px,0);',
      'transition:opacity 240ms cubic-bezier(0.22,1,0.36,1),transform 260ms cubic-bezier(0.22,1,0.36,1);',
      '}',
      '.pp-bento-grid{transition-delay:0ms;}',
      '.pp-stage{transition-delay:40ms;}',
      '.pp-right-wing{transition-delay:80ms;}',
      '#prism-periodic-console-root[data-open="1"] .pp-bento-grid,#prism-periodic-console-root[data-open="1"] .pp-stage,#prism-periodic-console-root[data-open="1"] .pp-right-wing{',
      'opacity:1;transform:translate3d(0,0,0);',
      '}',
      '.pp-bento-grid{position:relative;z-index:4;flex:0 0 clamp(284px,24.8%,338px);width:clamp(284px,24.8%,338px);height:100%;min-width:0;display:flex;flex-direction:column;}',
      '.pp-flip-inner{position:relative;width:100%;height:100%;display:flex;flex-direction:column;}',
      '.pp-right-wing{position:relative;z-index:4;flex:0 0 clamp(218px,19.2%,268px);width:clamp(218px,19.2%,268px);height:100%;min-width:0;display:flex;flex-direction:column;}',
      '.pp-bento-card{',
      'position:relative;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;gap:5px;',
      'padding:6px 8px 7px;border-radius:11px;box-sizing:border-box;min-width:0;overflow:visible;',
      'background:var(--pp-cnc-shell);border:1px solid var(--pp-cnc-border);color:var(--pp-bento-fg);',
      'box-shadow:inset 0 1px 0 var(--pp-cnc-chamfer-top),inset 0 -1.5px 0 var(--pp-cnc-chamfer-bot),var(--pp-cnc-shadow);',
      'user-select:none;-webkit-user-select:none;',
      '}',
      '#prism-periodic-console-root[data-corners="sharp"] .pp-bento-card{border-radius:7px;}',
      '#prism-periodic-console-root[data-corners="soft"] .pp-bento-card{border-radius:13px;}',
      '.pp-bento-card::before{',
      'content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1.25px;pointer-events:none;z-index:6;',
      'background:radial-gradient(164px circle at var(--pp-card-px,-999px) var(--pp-card-py,-999px),var(--pp-rim-core) 0%,var(--pp-rim-ice) 42%,var(--pp-rim-violet) 74%,transparent 100%);',
      '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);',
      '-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;',
      'opacity:var(--pp-card-rim-alpha,0);transition:opacity 80ms linear;',
      '}',
      '.pp-telemetry-pod::before{',
      'background:radial-gradient(164px circle at var(--pp-right-px,-999px) var(--pp-right-py,-999px),var(--pp-rim-core) 0%,var(--pp-rim-ice) 42%,var(--pp-rim-violet) 74%,transparent 100%);',
      'opacity:var(--pp-right-rim-alpha,0);',
      '}',
      '#prism-periodic-console-root[data-pointer-near="1"] .pp-spec-card::before{opacity:var(--pp-card-rim-alpha,1);}',
      '#prism-periodic-console-root[data-pointer-near="1"] .pp-telemetry-pod::before{opacity:var(--pp-right-rim-alpha,1);}',
      '.pp-cnc-header{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:0 3px;height:13px;flex:0 0 auto;}',
      '.pp-cnc-label{font-family:"JetBrains Mono","SF Mono",Consolas,monospace;font-size:8.5px;font-weight:720;letter-spacing:0.10em;text-transform:uppercase;color:var(--pp-cnc-engraving);line-height:1;white-space:nowrap;}',
      '.pp-card-flip-btn{',
      'display:inline-flex;align-items:center;gap:3px;height:16px;padding:0 5px;border-radius:4px;',
      'border:1px solid var(--pp-bento-pill-border);background:var(--pp-bento-pill-bg);color:var(--pp-bento-dim);',
      'font-family:"JetBrains Mono",Consolas,monospace;font-size:8.5px;font-weight:700;cursor:pointer;line-height:1;',
      'transition:background 120ms ease,color 120ms ease,border-color 120ms ease;',
      '}',
      '.pp-card-flip-btn:hover{background:var(--pp-bento-pill-active);color:var(--pp-bento-fg);border-color:var(--pp-spec-accent,var(--pp-model-accent));}',
      '.pp-card-flip-btn svg{width:9.5px;height:9.5px;display:block;}',
      '#prism-periodic-console-root[data-dock-tier="wide"] .pp-card-flip-btn,#prism-periodic-console-root[data-dock-tier="medium"] .pp-card-flip-btn{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);border:0;opacity:0;}',
      '.pp-recess-screen{position:relative;display:flex;flex-direction:column;border-radius:6.5px;padding:5.5px 7.5px;box-sizing:border-box;min-width:0;background:var(--pp-screen-bg);border:1px solid var(--pp-screen-border);box-shadow:var(--pp-screen-inset);}',
      '.pp-spec-body{display:flex;flex-direction:column;gap:4.5px;min-width:0;flex:1 1 auto;min-height:0;overflow:hidden;}',
      '.pp-spec-main{display:flex;flex-direction:column;gap:3px;min-width:0;flex:0 0 auto;}',
      '.pp-spec-kicker-row{display:flex;align-items:center;justify-content:space-between;gap:5px;min-width:0;}',
      '.pp-family-badge{display:inline-flex;align-items:center;gap:4.5px;height:17px;padding:0 6px;border-radius:4px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9px;font-weight:760;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;background:var(--pp-bento-pill-bg);border:1px solid var(--pp-spec-accent,var(--pp-model-accent));color:var(--pp-bento-fg);}',
      '.pp-family-dot{width:5px;height:5px;border-radius:50%;background:var(--pp-spec-accent,var(--pp-model-accent));}',
      '.pp-state-tag{font-family:"JetBrains Mono",Consolas,monospace;font-size:8.8px;font-weight:700;color:var(--pp-bento-dim);letter-spacing:0.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.pp-spec-title{margin:0;font-size:15.5px;font-weight:800;line-height:1.1;letter-spacing:-0.02em;color:var(--pp-bento-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.pp-micro-tags{display:flex;align-items:center;gap:4px;flex-wrap:nowrap;overflow:hidden;}',
      '.pp-micro-tag{display:inline-flex;align-items:center;height:15px;padding:0 5px;border-radius:3.5px;border:1px solid var(--pp-bento-pill-border);background:var(--pp-bento-pill-bg);font-size:9px;font-weight:660;color:var(--pp-bento-sub);white-space:nowrap;line-height:1;}',
      '.pp-spec-tagline{display:none;}',
      '.pp-radar-pane{flex:1 1 auto;min-height:0;overflow:hidden;display:grid;grid-template-columns:88px minmax(0,1fr);gap:6px;align-items:center;}',
      '.pp-radar-col{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5px;min-width:0;}',
      '.pp-radar-svg{width:88px;height:88px;display:block;overflow:visible;}',
      '.pp-radar-vtx-lbl{font-size:8.8px;font-weight:720;fill:var(--pp-bento-sub);letter-spacing:0.01em;}',
      '.pp-radar-poly,.pp-radar-poly-runner,.pp-radar-poly-cmp{transition:all 180ms cubic-bezier(0.22,1,0.36,1);}',
      '.pp-radar-legend{display:none;align-items:center;justify-content:center;gap:6px;font-size:8.2px;font-weight:680;color:var(--pp-bento-dim);line-height:1;}',
      '.pp-radar-legend[data-show="1"]{display:flex;}',
      '.pp-radar-leg-item{display:inline-flex;align-items:center;gap:3px;white-space:nowrap;}',
      '.pp-radar-leg-swatch{width:7px;height:2px;border-radius:1px;background:var(--pp-spec-accent,var(--pp-model-accent));}',
      '.pp-radar-leg-swatch.is-dashed{background:transparent;border-top:1.5px dashed var(--pp-bento-sub);}',
      '.pp-radar-bars{display:flex;flex-direction:column;gap:3.2px;min-width:0;}',
      '.pp-radar-row{display:grid;grid-template-columns:54px minmax(0,1fr) 48px;align-items:center;gap:4px;font-size:10px;line-height:1.1;}',
      '.pp-spec-card[data-comparing="1"] .pp-radar-pane{grid-template-columns:82px minmax(0,1fr);gap:5px;}',
      '.pp-spec-card[data-comparing="1"] .pp-radar-svg{width:82px;height:82px;}',
      '.pp-spec-card[data-comparing="1"] .pp-radar-row{grid-template-columns:54px minmax(0,1fr) 68px;}',
      '.pp-radar-lbl{color:var(--pp-bento-sub);font-weight:680;font-size:9.4px;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.pp-radar-track{height:4.5px;border-radius:2px;background:var(--pp-bento-track);overflow:hidden;position:relative;}',
      '.pp-radar-track::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(90deg,transparent calc(50% - 0.5px),rgba(255,255,255,0.24) calc(50% - 0.5px),rgba(255,255,255,0.24) calc(50% + 0.5px),transparent calc(50% + 0.5px),transparent calc(75% - 0.5px),rgba(255,255,255,0.24) calc(75% - 0.5px),rgba(255,255,255,0.24) calc(75% + 0.5px),transparent calc(75% + 0.5px));}',
      '#prism-periodic-console-root[data-theme="light"] .pp-radar-track::after{background:linear-gradient(90deg,transparent calc(50% - 0.5px),rgba(15,23,42,0.18) calc(50% - 0.5px),rgba(15,23,42,0.18) calc(50% + 0.5px),transparent calc(50% + 0.5px),transparent calc(75% - 0.5px),rgba(15,23,42,0.18) calc(75% - 0.5px),rgba(15,23,42,0.18) calc(75% + 0.5px),transparent calc(75% + 0.5px));}',
      '.pp-radar-fill{height:100%;border-radius:2px;background:var(--pp-spec-grad,var(--pp-spec-accent,var(--pp-model-accent)));transition:width 200ms cubic-bezier(0.22,1,0.36,1);}',
      '.pp-radar-val-wrap{display:inline-flex;align-items:baseline;justify-content:flex-end;gap:2.5px;min-width:0;}',
      '.pp-radar-val{font-family:"JetBrains Mono",Consolas,monospace;font-weight:760;color:var(--pp-bento-fg);text-align:right;font-size:9.8px;font-variant-numeric:tabular-nums;white-space:nowrap;}',
      '.pp-delta-tag{display:none;font-family:"JetBrains Mono",Consolas,monospace;font-size:7.8px;font-weight:760;white-space:nowrap;}',
      '.pp-delta-tag[data-dir="up"]{display:inline;color:#93C5FD;}',
      '.pp-delta-tag[data-dir="down"]{display:inline;color:#F0A07A;}',
      '#prism-periodic-console-root[data-theme="light"] .pp-delta-tag[data-dir="up"]{color:#1D4ED8;}',
      '#prism-periodic-console-root[data-theme="light"] .pp-delta-tag[data-dir="down"]{color:#B45309;}',
      '.pp-radar-scale-row{display:grid;grid-template-columns:54px minmax(0,1fr) 48px;align-items:center;gap:4px;margin-top:1px;}',
      '.pp-spec-card[data-comparing="1"] .pp-radar-scale-row{grid-template-columns:54px minmax(0,1fr) 68px;}',
      '.pp-radar-scale-ticks{position:relative;height:9px;font-family:"JetBrains Mono",Consolas,monospace;font-size:7.3px;color:var(--pp-bento-dim);line-height:1;}',
      '.pp-radar-scale-ticks span{position:absolute;top:0;white-space:nowrap;}',
      '.pp-radar-scale-ticks span[data-tick="0"]{left:0;}',
      '.pp-radar-scale-ticks span[data-tick="50"]{left:50%;transform:translateX(-50%);}',
      '.pp-radar-scale-ticks span[data-tick="75"]{left:75%;transform:translateX(-50%);}',
      '.pp-radar-scale-ticks span[data-tick="100"]{right:0;}',
      '.pp-spec-card[data-comparing="1"] .pp-radar-scale-ticks span[data-tick="75"],#prism-periodic-console-root[data-dock-tier="medium"] .pp-radar-scale-ticks span[data-tick="75"],#prism-periodic-console-root[data-spec-compact="1"] .pp-radar-scale-ticks span[data-tick="75"]{display:none;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-radar-pane{grid-template-columns:74px minmax(0,1fr);gap:4px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-radar-svg{width:74px;height:74px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-radar-row,#prism-periodic-console-root[data-spec-compact="1"] .pp-radar-scale-row{grid-template-columns:53px minmax(0,1fr) 46px;gap:3px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-spec-card[data-comparing="1"] .pp-radar-pane{grid-template-columns:70px minmax(0,1fr);gap:3.5px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-spec-card[data-comparing="1"] .pp-radar-svg{width:70px;height:70px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-spec-card[data-comparing="1"] .pp-radar-lbl{font-size:8.8px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-spec-card[data-comparing="1"] .pp-radar-row,#prism-periodic-console-root[data-spec-compact="1"] .pp-spec-card[data-comparing="1"] .pp-radar-scale-row{grid-template-columns:50px minmax(0,1fr) 64px;gap:3px;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-spec-card[data-comparing="1"] .pp-radar-scale-ticks span[data-tick="50"]{display:none;}',
      '#prism-periodic-console-root[data-spec-compact="1"] .pp-bench-source{font-size:7.6px;letter-spacing:-0.015em;}',
      '#prism-periodic-console-root[data-spec-compact="1"][data-source-short="0"] .pp-bench-source{font-size:7.3px;letter-spacing:-0.025em;}',
      '.pp-effort-strip{display:flex;flex-direction:column;gap:3.5px;flex:0 0 auto;position:relative;}',
      '.pp-effort-row-top{display:flex;align-items:center;gap:6px;min-width:0;}',
      '.pp-bento-efforts{flex:1 1 auto;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:2px;padding:2px;border-radius:6px;background:var(--pp-btn-well-bg);border:1px solid var(--pp-screen-border);box-shadow:inset 0 1.5px 4px rgba(0,0,0,0.45);}',
      '.pp-bento-eff-btn{position:relative;overflow:hidden;height:22px;padding:0 5px 1.5px;border-radius:4px;border:1px solid transparent;background:transparent;color:var(--pp-bento-sub);font-family:"JetBrains Mono",inherit;font-size:10px;font-weight:720;cursor:pointer;line-height:1;white-space:nowrap;transition:background 130ms ease,color 130ms ease,border-color 130ms ease,box-shadow 130ms ease;}',
      '.pp-bento-eff-btn:hover{color:var(--pp-bento-fg);background:var(--pp-bento-pill-bg);}',
      '.pp-bento-eff-btn[data-active="1"]{background:var(--pp-seg-active-bg);color:var(--pp-seg-active-fg);border-color:var(--pp-seg-active-border);box-shadow:var(--pp-seg-active-shadow);}',
      '.pp-bento-eff-btn[data-active="1"]::after{content:"";position:absolute;left:8px;right:8px;bottom:1.5px;height:2px;border-radius:1px;background:var(--pp-spec-accent,var(--pp-model-accent));background-image:var(--pp-spec-grad,none);box-shadow:0 0 6px var(--pp-spec-glow,var(--pp-model-glow));transition:background 150ms ease,box-shadow 150ms ease;}',
      '#prism-periodic-console-root[data-theme="light"] .pp-bento-eff-btn[data-active="1"]::after{box-shadow:0 0 3px var(--pp-spec-glow,var(--pp-model-glow));}',
      '.pp-bento-eff-note{display:none;}',
      '.pp-bento-efforts .pp-bento-eff-note{display:flex;align-items:center;justify-content:center;height:22px;padding:0 8px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.5px;font-weight:700;color:var(--pp-bento-dim);letter-spacing:0.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.pp-source-row{display:flex;align-items:center;justify-content:space-between;gap:5px;min-width:0;position:relative;}',
      '.pp-bench-source{font-family:"JetBrains Mono",Consolas,monospace;font-size:8.2px;font-weight:620;color:var(--pp-bento-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1 1 auto;}',
      '.pp-info-trigger{position:relative;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;border:1px solid var(--pp-bento-pill-border);background:var(--pp-bento-pill-bg);color:var(--pp-bento-dim);font-family:"JetBrains Mono",monospace;font-size:8.5px;font-weight:780;cursor:help;line-height:1;padding:0;}',
      '.pp-info-trigger:hover,.pp-info-trigger:focus-visible{color:var(--pp-bento-fg);border-color:var(--pp-spec-accent,var(--pp-model-accent));}',
      '.pp-bench-tooltip{position:absolute;left:0;right:0;bottom:calc(100% + 6px);z-index:24;padding:8px 9px;border-radius:7px;background:var(--pp-tooltip-bg);border:1px solid var(--pp-tooltip-border);color:var(--pp-bento-fg);box-shadow:0 10px 26px rgba(0,0,0,0.48);font-size:9.5px;line-height:1.42;opacity:0;visibility:hidden;transform:translateY(4px);pointer-events:none;transition:opacity 140ms ease,transform 140ms ease,visibility 140ms ease;}',
      '.pp-source-row:hover .pp-bench-tooltip,.pp-source-row:focus-within .pp-bench-tooltip{opacity:1;visibility:visible;transform:translateY(0);}',
      '.pp-tt-head{font-weight:780;margin-bottom:4px;color:var(--pp-bento-fg);letter-spacing:0.02em;}',
      '.pp-tt-line{color:var(--pp-bento-sub);margin:1.5px 0;}',
      '.pp-tt-line strong{color:var(--pp-bento-fg);font-weight:740;}',
      /* MOD-02 // TELEMETRY Machined Circular Controls + 512K Screen + Dynamic Sub-Screen */
      '.pp-machined-ctrls{display:flex;align-items:center;justify-content:space-evenly;gap:8px;padding:1px 4px 2px;flex:0 0 auto;}',
      '.pp-machined-well{display:flex;align-items:center;justify-content:center;width:34px;height:34px;padding:3px;border-radius:50%;box-sizing:border-box;background:var(--pp-btn-well-bg);box-shadow:inset 0 2px 4px rgba(0,0,0,0.68),0 1px 0 rgba(255,255,255,0.14);}',
      '.pp-machined-btn{display:inline-flex;align-items:center;justify-content:center;gap:2px;width:28px;height:28px;padding:0;border-radius:50%;border:1px solid var(--pp-cnc-border);background:var(--pp-btn-metal);color:var(--pp-btn-metal-fg);box-shadow:inset 0 1px 0 var(--pp-cnc-chamfer-top),inset 0 -1px 2px rgba(0,0,0,0.35),0 2px 4px rgba(0,0,0,0.38);font-family:"JetBrains Mono",Consolas,monospace;font-size:11.5px;font-weight:800;cursor:pointer;line-height:1;transition:transform 90ms ease,background 130ms ease,border-color 140ms ease;}',
      '.pp-machined-btn:hover{background:var(--pp-btn-metal-hover);border-color:var(--pp-model-accent);}',
      '.pp-machined-btn:active{transform:translateY(1px) scale(0.94);}',
      '.pp-machined-btn svg{width:13px;height:13px;display:block;flex:0 0 auto;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"] .pp-stage-mode-btn svg{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-stage-mode-btn .pp-stage-key-tag{display:none;}',
      '.pp-machined-btn[data-muted="1"] .pp-vol-wave{display:none;}',
      '.pp-machined-btn[data-muted="0"] .pp-vol-mute{display:none;}',
      '.pp-stage-btn-lbl{display:none;}',
      '.pp-tele-screen{flex:1.28 1 0;min-height:0;overflow:hidden;justify-content:space-between;gap:2px;padding:5px 7.5px;}',
      '.pp-tele-top-row{display:flex;align-items:baseline;justify-content:space-between;gap:6px;}',
      '.pp-tele-hero-512k{font-family:"JetBrains Mono",Consolas,monospace;font-size:20px;font-weight:800;line-height:1;letter-spacing:-0.03em;color:var(--pp-bento-fg);}',
      '.pp-tele-health{font-family:"JetBrains Mono",Consolas,monospace;font-size:8.2px;font-weight:760;padding:1.5px 5px;border-radius:3.5px;background:var(--pp-bento-pill-bg);border:1px solid var(--pp-bento-pill-border);color:var(--pp-bento-sub);white-space:nowrap;}',
      '.pp-tele-health[data-level="warn"]{color:#E5A856;border-color:rgba(229,168,86,0.44);}',
      '#prism-periodic-console-root[data-theme="light"] .pp-tele-health[data-level="warn"]{color:#B45309;border-color:rgba(180,83,9,0.36);}',
      '.pp-tele-sub-row{display:flex;align-items:center;justify-content:space-between;gap:4px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.6px;color:var(--pp-bento-sub);}',
      '.pp-tele-big-num{font-weight:760;color:var(--pp-bento-fg);font-variant-numeric:tabular-nums;}',
      '.pp-tele-cap-lbl{font-size:8.8px;color:var(--pp-bento-dim);}',
      '.pp-crystal-bar{position:relative;height:5px;border-radius:2px;background:var(--pp-bento-track);overflow:hidden;flex:0 0 auto;}',
      '.pp-crystal-fill{height:100%;border-radius:2px;background:var(--pp-model-grad,var(--pp-model-accent));transition:width 240ms cubic-bezier(0.22,1,0.36,1);}',
      '.pp-tele-ticks{display:flex;justify-content:space-between;font-family:"JetBrains Mono",Consolas,monospace;font-size:7.6px;color:var(--pp-bento-dim);line-height:1;}',
      '.pp-pulse-svg{width:100%;height:26px;display:block;overflow:visible;flex:0 1 auto;}',
      '.pp-tele-metrics{display:flex;align-items:center;justify-content:space-between;gap:6px;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.2px;color:var(--pp-bento-sub);line-height:1.15;}',
      '.pp-tele-kv strong{color:var(--pp-bento-fg);font-weight:760;font-variant-numeric:tabular-nums;}',
      '.pp-tele-subscreen{flex:0.78 1 0;min-height:0;overflow:hidden;justify-content:space-between;gap:2px;padding:4.5px 7.5px;}',
      '.pp-solo-view{display:flex;flex-direction:column;justify-content:space-between;height:100%;gap:2px;}',
      '.pp-orch-view{display:none;flex-direction:column;justify-content:space-between;height:100%;gap:2px;}',
      '#prism-periodic-console-root[data-orch-latched="1"] .pp-solo-view{display:none;}',
      '#prism-periodic-console-root[data-orch-latched="1"] .pp-orch-view{display:flex;}',
      '.pp-sub-title{font-family:"JetBrains Mono",Consolas,monospace;font-size:9px;font-weight:720;color:var(--pp-bento-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center;}',
      '.pp-acoustics-svg{width:100%;height:24px;display:block;}',
      '.pp-pinhole-row{display:flex;align-items:center;justify-content:center;gap:5px;}',
      '.pp-pinhole-dot{width:4px;height:4px;border-radius:50%;background:var(--pp-bento-track);transition:background 160ms ease,box-shadow 160ms ease;}',
      '.pp-pinhole-dot[data-lit="1"]{background:var(--pp-model-grad,var(--pp-model-accent));box-shadow:0 0 5px var(--pp-model-glow);}',
      '.pp-topo-svg{width:100%;height:26px;display:block;overflow:visible;}',
      '.pp-topo-nodes{display:flex;align-items:center;justify-content:space-between;gap:4px;}',
      '.pp-topo-box{flex:1 1 0;min-width:0;padding:4px 5px;border-radius:4.5px;border:1px solid var(--pp-orch-box-bd);background:var(--pp-orch-box-bg);text-align:center;}',
      '.pp-topo-box.is-runner{border-color:var(--pp-orch-run-bd);background:var(--pp-orch-run-bg);}',
      '.pp-topo-role{display:block;font-family:"JetBrains Mono",Consolas,monospace;font-size:7.5px;font-weight:720;letter-spacing:0.06em;color:var(--pp-bento-dim);text-transform:uppercase;}',
      '.pp-topo-val{display:block;font-family:"JetBrains Mono",Consolas,monospace;font-size:9.5px;font-weight:800;color:var(--pp-bento-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.pp-topo-arrow{flex:0 0 auto;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:800;color:var(--pp-orch-bus);}',
      /* Medium (960-1180px) & Narrow (<960px) Sleek 38px CNC Top Hardware Bar */
      '.pp-compact-bar{display:none;align-items:center;justify-content:space-between;gap:8px;height:38px;padding:0 8px 0 11px;border-radius:8px;background:var(--pp-cnc-shell);border:1px solid var(--pp-cnc-border);color:var(--pp-bento-fg);box-shadow:inset 0 1px 0 var(--pp-cnc-chamfer-top),0 4px 12px rgba(0,0,0,0.28);font-size:11.5px;flex:0 0 auto;user-select:none;box-sizing:border-box;}',
      '.pp-compact-left{display:inline-flex;align-items:center;gap:7px;min-width:0;overflow:hidden;cursor:pointer;}',
      '.pp-compact-hw-badge{display:none;align-items:center;font-family:"JetBrains Mono","SF Mono",Consolas,monospace;font-size:9px;font-weight:740;letter-spacing:0.09em;text-transform:uppercase;color:var(--pp-cnc-engraving);white-space:nowrap;}',
      '.pp-compact-model-pill{display:none;align-items:center;gap:5px;height:20px;padding:0 7px;border-radius:4.5px;background:var(--pp-screen-bg);border:1px solid var(--pp-screen-border);box-shadow:var(--pp-screen-inset);font-family:"JetBrains Mono",Consolas,monospace;font-size:9.5px;font-weight:740;color:var(--pp-bento-fg);white-space:nowrap;}',
      '.pp-compact-pill-dot{width:5px;height:5px;border-radius:50%;background:var(--pp-model-accent);box-shadow:0 0 5px var(--pp-model-glow);flex:0 0 auto;}',
      '.pp-compact-title{font-weight:780;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.pp-compact-metrics{font-family:"JetBrains Mono",Consolas,monospace;font-size:10.5px;color:var(--pp-bento-sub);white-space:nowrap;}',
      '.pp-compact-right{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;}',
      '.pp-compact-tele-wrap{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 7px;border-radius:5px;background:var(--pp-screen-bg);border:1px solid var(--pp-screen-border);box-shadow:var(--pp-screen-inset);}',
      '.pp-compact-512k{font-family:"JetBrains Mono",Consolas,monospace;font-size:9.6px;font-weight:740;color:var(--pp-bento-sub);white-space:nowrap;font-variant-numeric:tabular-nums;}',
      '.pp-compact-tele-bar{width:46px;height:4px;border-radius:2px;background:var(--pp-bento-track);overflow:hidden;flex:0 0 auto;}',
      '.pp-compact-tele-fill{height:100%;border-radius:2px;background:var(--pp-model-grad,var(--pp-model-accent));transition:width 240ms cubic-bezier(0.22,1,0.36,1);}',
      '.pp-compact-toggle-lbl{font-size:10px;font-weight:740;color:var(--pp-model-accent);white-space:nowrap;cursor:pointer;}',
      '.pp-compact-ctrls{display:inline-flex;align-items:center;gap:4px;}',
      '.pp-compact-ctrls .pp-machined-btn{width:24px;height:24px;font-size:10px;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-spatial-dock{display:grid;grid-template-columns:clamp(278px,27.5%,328px) minmax(0,1fr);grid-template-rows:38px minmax(0,1fr);gap:8px 10px;padding:9px 12px 8px;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-compact-bar{display:flex;grid-column:1 / -1;grid-row:1;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-compact-left{cursor:default;gap:8px;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-compact-hw-badge,#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-compact-model-pill{display:inline-flex;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-narrow-only,#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-compact-toggle-lbl{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-bento-grid{grid-column:1;grid-row:2;width:100%;flex:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-stage{grid-column:2;grid-row:2;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="medium"] .pp-right-wing{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"] .pp-spatial-dock{flex-direction:column;gap:6px;padding:8px 10px 6px;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"] .pp-compact-bar{display:flex;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"] .pp-compact-tele-bar{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"] .pp-bento-grid,#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"] .pp-right-wing{display:none;position:absolute;top:50px;left:10px;width:min(336px,calc(100% - 20px));height:282px;z-index:16;flex:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"][data-compact-expanded="1"][data-card-flipped="0"] .pp-bento-grid{display:flex;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"][data-dock-tier="narrow"][data-compact-expanded="1"][data-card-flipped="1"] .pp-right-wing{display:flex;}',
      /* Fullscreen Studio Showcase (F): Wings Retreat to Clean Corner Float Cards */
      '#prism-periodic-console-root[data-stage-mode="fullscreen"]{justify-content:center;padding:12px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-spatial-dock{position:relative;display:block;width:min(98vw,1560px);height:calc(100vh - 24px);padding:0;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-stage{position:absolute;inset:52px 0 38px 0;width:100%;height:auto;max-width:none;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-bento-grid{position:absolute;top:4px;left:8px;width:auto;max-width:450px;height:auto;z-index:10;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-right-wing{position:absolute;top:4px;right:8px;width:auto;max-width:340px;height:auto;z-index:10;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-bento-card{flex-direction:row;align-items:center;gap:10px;padding:6px 10px;height:auto;border-radius:10px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-bento-foldable,#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-cnc-header,#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-tele-subscreen,#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-pulse-svg,#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-tele-ticks,#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-tele-metrics{display:none !important;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-spec-body{flex-direction:row;align-items:center;gap:8px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-spec-main{flex-direction:row;align-items:center;gap:7px;padding:0;background:transparent;border:0;box-shadow:none;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-spec-title{font-size:13.5px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-micro-tags{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-bento-efforts{width:auto;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-tele-screen{flex-direction:row;align-items:center;gap:8px;padding:4px 8px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-tele-top-row{display:none;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-crystal-bar{width:56px;flex:0 0 56px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-machined-ctrls{display:flex;gap:5px;padding:0;order:2;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-machined-well{width:30px;height:30px;padding:2px;}',
      '#prism-periodic-console-root[data-stage-mode="fullscreen"] .pp-machined-btn{width:24px;height:24px;}',
      /* Studio Cyclorama Background (Fullscreen Only — Zero Colored Floor Underglow!) */
      '.pp-deskmat-stage{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;user-select:none;-webkit-user-select:none;}',
      '.pp-deskmat-glow{position:absolute;inset:0;pointer-events:none;background:var(--pp-felt-bg);opacity:0.96;}',
      '.pp-prism-aura,.pp-prism-aura-wings,.pp-prism-aura-core,.pp-studio-halo{opacity:0 !important;pointer-events:none;}',
      '.pp-deskmat-topo{position:absolute;inset:-3%;width:106%;height:106%;display:block;pointer-events:none;color:var(--pp-topo-color);opacity:calc(var(--pp-ambient-mul,1) * var(--pp-topo-mul,0.018));}',
      '.pp-deskmat-topo path{stroke-width:0.85;}',
      '.pp-stage{position:relative;z-index:1;flex:1 1 0;min-width:0;width:100%;height:100%;min-height:190px;background:transparent;border:0;box-shadow:none;padding:0;margin:0;box-sizing:border-box;user-select:none;-webkit-user-select:none;}',
      '.pp-floor-shadow{position:absolute;left:4%;right:4%;top:30%;bottom:-16%;z-index:0;pointer-events:none;border-radius:50%;transform:translate3d(var(--pp-shadow-px,0px),var(--pp-shadow-py,0px),0);transition:transform 140ms cubic-bezier(0.22,1,0.36,1);}',
      '#prism-periodic-console-root[data-orbit-dragging="1"] .pp-floor-shadow{transition:none;}',
      '.pp-floor-shadow::before{content:"";position:absolute;inset:14% 2% -6% 2%;pointer-events:none;border-radius:50%;background:var(--pp-levitation-shadow);filter:blur(28px);}',
      '.pp-floor-shadow::after{content:"";position:absolute;inset:24% 8% 4% 8%;pointer-events:none;border-radius:50%;background:var(--pp-contact-shadow);filter:blur(12px);transform:translate3d(calc(var(--pp-shadow-px,0px) * -0.35),calc(var(--pp-shadow-py,0px) * -0.35),0);}',
      '.pp-gl-canvas{position:relative;z-index:1;display:block;width:100%;height:100%;background:transparent;border:0;outline:none;touch-action:none;}',
      '.pp-hit-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2;}',
      '.pp-hit-btn{position:absolute;margin:0;padding:0;border:0;background:transparent;color:transparent;opacity:0;pointer-events:auto;cursor:inherit;box-sizing:border-box;border-radius:6px;outline:none;}',
      '.pp-hit-btn:focus-visible{opacity:1;cursor:pointer;box-shadow:0 0 0 2px var(--pp-focus-ring);background:rgba(148,163,184,0.14);}',
      '.pp-key-blind{pointer-events:none !important;width:1px !important;height:1px !important;}',
      '.pp-sr-only{position:absolute !important;width:1px !important;height:1px !important;padding:0 !important;margin:-1px !important;overflow:hidden !important;clip:rect(0,0,0,0) !important;clip-path:inset(50%) !important;white-space:nowrap !important;border:0 !important;pointer-events:none !important;}',
      '.pp-hud-pill{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);z-index:9;display:inline-flex;align-items:center;justify-content:center;padding:0;margin:0;background:transparent;border:0;box-shadow:none;font-size:11px;line-height:1;user-select:none;-webkit-user-select:none;}',
      '#prism-periodic-console-root[data-stage-mode="drawer"] .pp-hud-pill{right:16px;left:auto;transform:none;opacity:0;pointer-events:none;}',
      '.pp-hud-reset-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:0 0 auto;height:28px;padding:0 10.5px 0 9px;margin:0;border-radius:999px;box-sizing:border-box;background:var(--pp-hud-bg);border:1px solid var(--pp-hud-border);color:var(--pp-hud-muted);box-shadow:inset 0 1px 0 var(--pp-hud-top-gleam),inset 0 -1px 0 var(--pp-hud-bottom-lip),0 8px 20px var(--pp-hud-shadow);font-family:inherit;font-size:11px;font-weight:620;line-height:1;white-space:nowrap;cursor:pointer;outline:none;transition:opacity 180ms ease,background 160ms ease,color 150ms ease,border-color 180ms ease,transform 100ms ease;}',
      '.pp-hud-reset-btn svg{width:13px;height:13px;display:block;pointer-events:none;flex:0 0 auto;}',
      '.pp-reset-label{pointer-events:none;line-height:1;}',
      '.pp-reset-kbd{display:inline-flex;align-items:center;justify-content:center;height:15px;min-width:15px;padding:0 4px;border-radius:4px;background:var(--pp-reset-kbd-bg);border:1px solid var(--pp-reset-kbd-border);font-size:9.5px;font-weight:700;font-family:"JetBrains Mono",Consolas,monospace;line-height:1;opacity:0.86;pointer-events:none;}',
      '.pp-hud-reset-btn[data-rotated="0"]{opacity:0.42;}',
      '.pp-hud-reset-btn[data-rotated="0"]:hover{opacity:0.92;color:var(--pp-hud-hover-fg);}',
      '.pp-hud-reset-btn:active{transform:translateY(0.5px) scale(0.96);}',
      '.pp-hud-reset-btn[data-rotated="1"]{opacity:1;color:var(--pp-hud-fg);background:var(--pp-reset-active-bg);border-color:var(--pp-reset-active-ring);box-shadow:var(--pp-reset-active-shadow);}',
      '.pp-hold-ring{position:fixed;pointer-events:none;z-index:2147483645;box-sizing:border-box;}',
      '.pp-hold-ring svg{display:block;width:100%;height:100%;overflow:visible;}',
      '.pp-mini-keycap{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:0.5px;height:16px;padding:0 5px;margin:0 2px;border-radius:4px;box-sizing:border-box;flex:0 0 auto;background:var(--mk-bg,rgba(255,255,255,0.045));color:var(--mk-fg,var(--secondary-foreground,#C8D0DF));border:1px solid var(--mk-border,rgba(218,228,255,0.19));box-shadow:none;font-family:var(--prism-mono-stack,"JetBrains Mono","Google Sans Code","SF Mono","Cascadia Code",Consolas,ui-monospace,monospace);font-size:9.5px;font-weight:600;line-height:1;vertical-align:middle;pointer-events:auto;cursor:pointer;user-select:none;-webkit-user-select:none;font-variant-numeric:tabular-nums;letter-spacing:0.015em;}',
      'html[data-pp-open="1"] .pp-mini-keycap{pointer-events:auto;cursor:pointer;}',
      '.pp-mk-z{position:relative;font-size:9.5px;font-weight:600;line-height:1;letter-spacing:0.01em;}',
      '.pp-mk-z:empty{display:none;}',
      '.pp-mk-sym{position:relative;font-size:9.5px;font-weight:600;line-height:1;letter-spacing:0.015em;}',
      '@media (prefers-reduced-motion:reduce){',
      '#prism-periodic-console-root,.pp-spatial-dock,.pp-bento-grid,.pp-stage,.pp-right-wing,.pp-hud-pill,.pp-hud-reset-btn,.pp-floor-shadow,.pp-radar-poly,.pp-radar-poly-runner,.pp-radar-poly-cmp,.pp-radar-fill,.pp-crystal-fill,.pp-bench-tooltip{transition:none !important;transition-delay:0ms !important;}',
      '}',
    ].join('\n');

    function normalizeZhEffortWord(word) {
      if (word === '超高' || word === '极高' || word === '超深') return 'xhigh';
      if (word === '中' || word === '中等' || word === '中思考') return 'medium';
      if (word === '低' || word === '低思考' || word === '极低' || word === '最低') return 'low';
      if (word === '关闭') return 'off';
      if (word === '自动') return 'auto';
      return 'high';
    }

    function normalizeEnEffortWord(word) {
      var w = String(word || '').toLowerCase();
      if (w === 'extra') return 'xhigh';
      if (w === 'med') return 'medium';
      return w;
    }

    /**
     * Parse a raw model label or host modelOption into a Google chemical element descriptor.
     * Strictly rejects Orchestrator, Flash, Claude, GPT/OpenAI/Codex, and custom models.
     */
    function parseElementModelLabel(input) {
      if (!input) return null;
      var rawLabel = '';
      var modelId = '';
      if (typeof input === 'string') {
        rawLabel = input.trim();
      } else if (typeof input === 'object') {
        if (input.isCustom) return null;
        rawLabel = typeof input.label === 'string' ? input.label.trim() : '';
        modelId = typeof input.modelId === 'string' ? input.modelId.trim() : '';
      }
      if (!rawLabel) return null;
      if (EXCLUDED_FAMILY_RE.test(rawLabel) || (modelId && EXCLUDED_FAMILY_RE.test(modelId))) {
        return null;
      }

      var baseName = rawLabel.replace(/^.*?\bcurrent:\s*/i, '').trim();
      var effort = '';
      var hasExplicitEffort = false;

      var zhMatch = ZH_EFFORT_PAREN_RE.exec(baseName);
      if (zhMatch) {
        effort = normalizeZhEffortWord(zhMatch[1]);
        baseName = baseName.slice(0, zhMatch.index).trim();
        hasExplicitEffort = true;
      } else {
        var enMatch = EN_EFFORT_PAREN_RE.exec(baseName);
        if (enMatch) {
          effort = normalizeEnEffortWord(enMatch[1]);
          baseName = baseName.slice(0, enMatch.index).trim();
          hasExplicitEffort = true;
        } else {
          var bareEnMatch = /\s+(extra\s+high|xhigh|extra|max|high|medium|med|low|minimal|off|auto)\s*$/i.exec(baseName);
          if (bareEnMatch) {
            var rawEff = bareEnMatch[1].toLowerCase().replace(/\s+/g, '');
            effort = rawEff === 'extrahigh' ? 'xhigh' : normalizeEnEffortWord(rawEff);
            baseName = baseName.slice(0, bareEnMatch.index).trim();
            hasExplicitEffort = true;
          } else {
            var bareZhMatch = /\s+(超高思考|极高思考|高思考|中等思考|中思考|低思考|极低思考|最低思考|超深|超高|极高|中等|极低|最低|自动|关闭|高|中|低)\s*$/.exec(baseName);
            if (bareZhMatch) {
              effort = normalizeZhEffortWord(bareZhMatch[1].replace(/思考$/, ''));
              baseName = baseName.slice(0, bareZhMatch.index).trim();
              hasExplicitEffort = true;
            }
          }
        }
      }

      if (!baseName || EXCLUDED_FAMILY_RE.test(baseName)) return null;
      if (effort === 'auto') return null;

      var tokens = baseName
        .replace(/[^a-zA-Z0-9.]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      if (!tokens.length) return null;

      var hasGooglePrefix = /\b(?:gemini|google)\b/i.test(baseName) || /\bgemini\b/i.test(modelId);
      if (!hasGooglePrefix) return null;

      var matchedElement = null;
      for (var i = tokens.length - 1; i >= 0; i -= 1) {
        var tok = tokens[i].toLowerCase();
        if (tok === 'gemini' || tok === 'google') continue;
        if (/^\d+(?:\.\d+)*$/.test(tok)) continue;
        var elHit = ELEMENT_BY_NAME.get(tok);
        if (elHit) {
          matchedElement = elHit;
          break;
        }
        return null;
      }

      if (!matchedElement) return null;
      var normEffort = effort && EFFORT_LABELS[effort] ? effort : 'medium';
      var slot = SLOT_BY_Z.get(matchedElement.slotZ) || matchedElement;

      return {
        z: matchedElement.z,
        slotZ: slot.z,
        symbol: slot.symbol,
        elementSymbol: matchedElement.symbol,
        name: slot.name,
        elementName: matchedElement.name,
        zh: slot.zh,
        mass: slot.mass,
        group: slot.group,
        baseName: baseName,
        effort: normEffort,
        effortLabel: hasExplicitEffort ? EFFORT_LABELS[normEffort] || normEffort : 'Default',
        hasExplicitEffort: hasExplicitEffort,
      };
    }

    /**
     * Match & aggregate Google chemical element models from host `modelOptions` (and optional `effortIndex`).
     * Returns a sorted Array of matched element entries, augmented with `.byZ` and `.bySymbol` Maps.
     */
    function matchGoogleElementModels(modelOptions, effortIndex) {
      var grouped = new Map();

      function ingestOption(opt, forcedEffort) {
        if (!opt) return;
        var optionObj = typeof opt === 'string' ? { label: opt, value: opt } : opt;
        if (typeof optionObj.label !== 'string') return;
        var parsed = parseElementModelLabel(optionObj);
        if (!parsed) return;

        var eff = forcedEffort ? normalizeEnEffortWord(forcedEffort) : parsed.effort;
        if (!EFFORT_LABELS[eff]) eff = parsed.effort || 'medium';

        var entry = grouped.get(parsed.slotZ);
        if (!entry) {
          var slot = SLOT_BY_Z.get(parsed.slotZ);
          entry = {
            z: parsed.z,
            slotZ: parsed.slotZ,
            symbol: slot ? slot.symbol : parsed.symbol,
            name: parsed.elementName || parsed.name,
            zh: slot ? slot.zh : parsed.zh,
            mass: slot ? slot.mass : parsed.mass,
            group: slot ? slot.group : parsed.group,
            baseName: parsed.baseName,
            _byEffort: new Map(),
          };
          grouped.set(parsed.slotZ, entry);
        }
        if (!entry._byEffort.has(eff)) {
          entry._byEffort.set(eff, {
            effort: eff,
            label: parsed.hasExplicitEffort || forcedEffort ? EFFORT_LABELS[eff] || eff : 'Default',
            option: optionObj,
            modelOption: optionObj,
          });
        }
      }

      if (Array.isArray(modelOptions)) {
        for (var i = 0; i < modelOptions.length; i += 1) {
          ingestOption(modelOptions[i], '');
        }
      }

      if (effortIndex instanceof Map) {
        effortIndex.forEach(function (innerMap) {
          if (!(innerMap instanceof Map)) return;
          innerMap.forEach(function (opt, effKey) {
            ingestOption(opt, String(effKey || ''));
          });
        });
      }

      var result = [];
      var byZ = new Map();
      var bySymbol = new Map();

      var sortedKeys = Array.from(grouped.keys()).sort(function (a, b) {
        return a - b;
      });

      for (var k = 0; k < sortedKeys.length; k += 1) {
        var slotZ = sortedKeys[k];
        var raw = grouped.get(slotZ);
        var levels = [];
        for (var ei = 0; ei < EFFORT_ORDER.length; ei += 1) {
          var ek = EFFORT_ORDER[ei];
          if (raw._byEffort.has(ek)) {
            levels.push(raw._byEffort.get(ek));
          }
        }
        var finalized = {
          z: raw.z,
          slotZ: raw.slotZ,
          symbol: raw.symbol,
          name: raw.name,
          elementName: raw.name,
          zh: raw.zh,
          mass: raw.mass,
          group: raw.group,
          baseName: raw.baseName,
          levels: levels,
          defaultOption: levels.length ? levels[levels.length - 1].option : null,
        };
        result.push(finalized);
        byZ.set(slotZ, finalized);
        bySymbol.set(finalized.symbol, finalized);
      }

      Object.defineProperty(result, 'byZ', { value: byZ, enumerable: false });
      Object.defineProperty(result, 'bySymbol', { value: bySymbol, enumerable: false });
      return result;
    }

    /* V12 2026Q4 Authoritative Public Raw Benchmark Registry (Zero Fabricated 99/100 Scores) */
    var BENCHMARK_SOURCE_CITATION =
      'Artificial Analysis v5.0 · Terminal-Bench · SWE-bench (2026Q4)';
    var BENCHMARK_SOURCE_CITATION_SHORT = 'AA v5 · TermBench · SWE-bench (2026Q4)';

    var RADAR_AXES = [
      { key: 'aa', zh: 'AA v5', en: 'AA v5', vertexZh: '推理', vertexEn: 'AA' },
      { key: 'term', zh: 'TermBench', en: 'TermBench', vertexZh: '终端', vertexEn: 'Term' },
      { key: 'sci', zh: 'HLE-D', en: 'HLE-D', vertexZh: '科学', vertexEn: 'Sci' },
      { key: 'swe', zh: 'SWE-Pro', en: 'SWE-Pro', vertexZh: '工程', vertexEn: 'SWE' },
      { key: 'tps', zh: '吞吐极速', en: 'Velocity', vertexZh: '极速', vertexEn: 'Speed' },
    ];

    /* A3: True 100 / 100% / 400 tok/s Full-Scale Ceilings (leaves 30%~40% future frontier headroom) */
    var BENCHMARK_CEILINGS = {
      aa: 100,
      term: 100,
      'HLE-D': 100,
      'GPQA-D': 100,
      'MMLU-Pro': 100,
      'SWE-Pro': 100,
      AutoBench: 100,
      DeepSWE: 100,
      'SWE-Ver': 100,
      'SWE-Verified': 100,
      tps: 400,
    };

    var BENCHMARK_2026Q4_DB = {
      10: {
        sciName: 'HLE-D',
        sweName: 'AutoBench',
        tps: 110,
        tiers: {
          low: { aa: 47, term: 32.8, sci: 54.2, swe: 64.0 },
          medium: { aa: 55, term: 51.4, sci: 62.8, swe: 72.5 },
          high: { aa: 60, term: 61.9, sci: 68.4, swe: 77.8 },
          xhigh: { aa: 61, term: 63.6, sci: 71.3, swe: 79.3 },
        },
        defaultTier: 'high',
      },
      6: {
        sciName: 'HLE-D',
        sweName: 'SWE-Pro',
        tps: 68,
        tiers: {
          low: { aa: 50, term: 46.5, sci: 55.0, swe: 74.0 },
          medium: { aa: 56, term: 58.4, sci: 63.5, swe: 80.6 },
          high: { aa: 60, term: 65.2, sci: 69.1, swe: 84.5 },
        },
        defaultTier: 'high',
      },
      18: {
        sciName: 'HLE-D',
        sweName: 'AutoBench',
        tps: 82,
        tiers: {
          low: { aa: 42, term: 44.0, sci: 45.0, swe: 62.0 },
          medium: { aa: 47, term: 57.1, sci: 52.4, swe: 69.5 },
          high: { aa: 50, term: 55.1, sci: 56.7, swe: 72.4 },
        },
        defaultTier: 'high',
      },
      1: {
        sciName: 'HLE-D',
        sweName: 'AutoBench',
        tps: 168,
        tiers: {
          low: { aa: 38, term: 18.5, sci: 32.2, swe: 60.5 },
          medium: { aa: 46, term: 41.2, sci: 46.5, swe: 68.4 },
          high: { aa: 51, term: 54.0, sci: 54.6, swe: 74.2 },
          xhigh: { aa: 54, term: 53.5, sci: 58.8, swe: 76.1 },
        },
        defaultTier: 'high',
      },
      'claude-opus': {
        sciName: 'GPQA-D',
        sweName: 'SWE-Pro',
        tps: 54,
        tiers: {
          low: { aa: 51, term: 54.2, sci: 86.4, swe: 79.5 },
          medium: { aa: 57, term: 61.5, sci: 91.2, swe: 85.8 },
          high: { aa: 60, term: 66.4, sci: 93.9, swe: 89.9 },
        },
        defaultTier: 'high',
      },
      'claude-sonnet': {
        sciName: 'GPQA-D',
        sweName: 'SWE-Pro',
        tps: 88,
        tiers: {
          low: { aa: 46, term: 53.0, sci: 85.0, swe: 71.2 },
          medium: { aa: 52, term: 61.8, sci: 90.8, swe: 77.4 },
          high: { aa: 56, term: 70.6, sci: 94.1, swe: 81.3 },
        },
        defaultTier: 'high',
      },
      flash: {
        sciName: 'GPQA-D',
        sweName: 'DeepSWE',
        tps: 215,
        tiers: {
          low: { aa: 25, term: 14.2, sci: 84.0, swe: 64.2 },
          medium: { aa: 28, term: 17.5, sci: 91.5, swe: 70.1 },
          high: { aa: 31, term: 19.7, sci: 95.3, swe: 73.7 },
        },
        defaultTier: 'high',
      },
      'gpt-oss': {
        sciName: 'MMLU-Pro',
        sweName: 'SWE-Verified',
        tps: 135,
        tiers: {
          low: { aa: 44, term: 31.4, sci: 79.2, swe: 33.6 },
          medium: { aa: 44, term: 31.4, sci: 79.2, swe: 33.6 },
          high: { aa: 44, term: 31.4, sci: 79.2, swe: 33.6 },
        },
        defaultTier: 'high',
      },
    };

    function resolveBenchmarkMetrics(benchKey, effortCode, zh, isAvailable) {
      if (isAvailable === false) {
        return {
          ratios: [0.28, 0.28, 0.28, 0.28, 0.28],
          rows: [
            { label: 'AA v5', valText: '—', fillPct: 18 },
            { label: 'TermBench', valText: '—', fillPct: 18 },
            { label: 'HLE-D', valText: '—', fillPct: 18 },
            { label: 'SWE-Pro', valText: '—', fillPct: 18 },
            { label: zh ? '吞吐速率' : 'Velocity', valText: '—', fillPct: 18 },
          ],
          compactText: zh ? '未开放席位' : 'Locked Slot',
        };
      }
      var rec = BENCHMARK_2026Q4_DB[benchKey] || BENCHMARK_2026Q4_DB[6];
      var normEff = String(effortCode || '').toLowerCase();
      if (normEff === 'max' || normEff === 'extra') normEff = 'xhigh';
      if (normEff === 'minimal' || normEff === 'off') normEff = 'low';
      var tier =
        rec.tiers[normEff] ||
        (normEff === 'xhigh' && rec.tiers.high) ||
        rec.tiers[rec.defaultTier] ||
        rec.tiers.high ||
        rec.tiers.medium;

      var sciCeil = BENCHMARK_CEILINGS[rec.sciName] || 100;
      var sweCeil = BENCHMARK_CEILINGS[rec.sweName] || 100;
      var r0 = Math.max(0.06, Math.min(1.0, tier.aa / BENCHMARK_CEILINGS.aa));
      var r1 = Math.max(0.06, Math.min(1.0, tier.term / BENCHMARK_CEILINGS.term));
      var r2 = Math.max(0.06, Math.min(1.0, tier.sci / sciCeil));
      var r3 = Math.max(0.06, Math.min(1.0, tier.swe / sweCeil));
      var r4 = Math.max(0.06, Math.min(1.0, rec.tps / BENCHMARK_CEILINGS.tps));

      var sweDisplayLbl = rec.sweName === 'SWE-Verified' ? 'SWE-Ver' : rec.sweName;
      var aaStr = String(tier.aa);
      var termStr = tier.term.toFixed(1) + '%';
      var sciStr = tier.sci.toFixed(1) + '%';
      var sweStr = tier.swe.toFixed(1) + '%';
      var tpsStr = rec.tps + ' tok/s';

      return {
        ratios: [r0, r1, r2, r3, r4],
        rawValues: [tier.aa, tier.term, tier.sci, tier.swe, rec.tps],
        rows: [
          { label: 'AA v5', valText: aaStr, fillPct: Math.round(r0 * 100), raw: tier.aa, unit: 'int' },
          { label: 'TermBench', valText: termStr, fillPct: Math.round(r1 * 100), raw: tier.term, unit: 'pct' },
          { label: rec.sciName, valText: sciStr, fillPct: Math.round(r2 * 100), raw: tier.sci, unit: 'pct' },
          { label: sweDisplayLbl, valText: sweStr, fillPct: Math.round(r3 * 100), raw: tier.swe, unit: 'pct' },
          { label: zh ? '吞吐速率' : 'Velocity', valText: tpsStr, fillPct: Math.round(r4 * 100), raw: rec.tps, unit: 'tps' },
        ],
        compactText: 'AA ' + aaStr + ' · Term ' + termStr + ' · ' + tpsStr,
      };
    }

    var ELEMENT_SPEC_PROFILES = {
      1: {
        badge: '01 · H · AGILE',
        accentHex: '#38BDF8',
        secondaryHex: '#7DD3FC',
        accentHexLight: '#0284C7',
        secondaryHexLight: '#0EA5E9',
        glowRgba: 'rgba(56, 189, 248, 0.28)',
        roleTag: 'HIGH-THROUGHPUT',
        switchSpecZh: 'Sky-Ice Crystal',
        switchSpecEn: 'Sky-Ice Crystal',
        taglineZh: '第 1 族活泼非金属 · 轻量疾速高吞吐并发推理核',
        taglineEn: 'Group 1 Reactive Nonmetal · Agile High-Throughput Reasoning Core',
        scenesZh: ['高频检索', '512K 并发', '极速响应'],
        scenesEn: ['Fast Search', '512K Shard', 'Low Latency'],
      },
      6: {
        badge: '06 · C · PRO',
        accentHex: '#3B82F6',
        secondaryHex: '#67E8F9',
        accentHexLight: '#1D4ED8',
        secondaryHexLight: '#0284C7',
        glowRgba: 'rgba(59, 130, 246, 0.30)',
        roleTag: 'COBALT · PRO',
        switchSpecZh: 'Cobalt Diamond Prism',
        switchSpecEn: 'Cobalt Diamond Prism',
        taglineZh: '第 14 族四价碳基核心 · 旗舰深度合成与复杂工程主力',
        taglineEn: 'Group 14 Tetravalent Carbon · Flagship Deep Synthesis & Architecture',
        scenesZh: ['深度推理', '512K 架构', '代码主力'],
        scenesEn: ['Reasoning', '512K Arch', 'Code Pro'],
      },
      10: {
        badge: '10 · Ne · FLOW',
        accentHex: '#FF6B4A',
        secondaryHex: '#FFB347',
        accentHexLight: '#EA580C',
        secondaryHexLight: '#D97706',
        glowRgba: 'rgba(255, 107, 74, 0.30)',
        roleTag: 'CORAL · FLOW',
        switchSpecZh: 'Coral-Gold Glass',
        switchSpecEn: 'Coral-Gold Glass',
        taglineZh: '第 18 族稀有气体 · 低延迟流式多模态与创意前端核',
        taglineEn: 'Group 18 Noble Gas · Luminous Low-Latency Multimodal & UI Craft',
        scenesZh: ['流式编码', '多模态', '创意前沿'],
        scenesEn: ['Live Coding', 'Multimodal', 'UI Craft'],
      },
      18: {
        badge: '18 · Ar · PRO',
        accentHex: '#7C5CFF',
        secondaryHex: '#4F7CFF',
        accentHexLight: '#6D28D9',
        secondaryHexLight: '#4338CA',
        glowRgba: 'rgba(124, 92, 255, 0.30)',
        roleTag: 'INDIGO · QA',
        switchSpecZh: 'Indigo-Violet Prism',
        switchSpecEn: 'Indigo-Violet Prism',
        taglineZh: '第 18 族稀有气体 · 高审美多模态视觉质检与精密分析核',
        taglineEn: 'Group 18 Noble Gas · High-Aesthetic Visual QA & Balanced Precision',
        scenesZh: ['视觉验证', '512K 审校', '精密分析'],
        scenesEn: ['Visual QA', '512K Audit', 'Precision'],
      },
      fallback: {
        badge: 'ELEMENT · SERIES',
        accentHex: '#60A5FA',
        secondaryHex: '#38BDF8',
        accentHexLight: '#2563EB',
        secondaryHexLight: '#0284C7',
        glowRgba: 'rgba(96, 165, 250, 0.24)',
        roleTag: 'ELEMENT CORE',
        switchSpecZh: 'Crystal Prism',
        switchSpecEn: 'Crystal Prism',
        taglineZh: 'Google 化学元素直连序列 · 原生全模态长窗口推理核',
        taglineEn: 'Google Chemical Element Series · Native Long-Context Core',
        scenesZh: ['通用推理', '代码生成', '512K 长窗'],
        scenesEn: ['Reasoning', 'Code Gen', '512K Ctx'],
      },
    };

    var AUX_MODEL_PRESETS = [
      {
        id: 'orchestrator',
        oledAuxId: 'orchestrator',
        miniKey: 'orchestrator',
        shortLabel: 'Orch',
        subLabel: 'LATCH',
        badgeCode: 'ORCH',
        defaultTitle: 'Orchestrator',
        roleTag: 'DUAL-CORE',
        accentHex: '#8B5CF6',
        accentHexLight: '#6D28D9',
        secondaryHex: '#F5B942',
        secondaryHexLight: '#B45309',
        glowRgba: 'rgba(139, 92, 246, 0.32)',
        taglineZh: '星云紫蓝×暖金自锁编排开关 · 主核规划 + 1H 高速卸载',
        taglineEn: 'Dual-Core Latching Mode Switch · Planner Core + 1H Offload',
        scenesZh: ['双核规划', '512K 路由', '1H 卸载'],
        scenesEn: ['Dual-Core', '512K Route', '1H Offload'],
      },
      {
        id: 'flash',
        oledAuxId: 'flash',
        miniKey: 'flash',
        shortLabel: 'Flash',
        subLabel: '3.8',
        badgeCode: 'FLASH',
        defaultTitle: 'Gemini 3.8 Flash',
        roleTag: 'HYPER-SPEED',
        accentHex: '#00D4FF',
        accentHexLight: '#0284C7',
        secondaryHex: '#67E8F9',
        secondaryHexLight: '#0891B2',
        glowRgba: 'rgba(0, 212, 255, 0.30)',
        taglineZh: '电光青蓝亚秒级响应核 · 大规模代码检索与高频跑腿主力',
        taglineEn: 'Sub-Second Hyper-Velocity Core · Rapid Codebase Exploration & Triage',
        scenesZh: ['极速检索', '日志初筛', '高频并发'],
        scenesEn: ['Fast Search', 'Log Triage', 'Parallel'],
      },
      {
        id: 'claude-opus',
        oledAuxId: 'claude',
        miniKey: 'claude',
        shortLabel: 'Opus',
        subLabel: '5.5',
        badgeCode: 'OPUS',
        defaultTitle: 'Claude Opus 5.5',
        roleTag: 'ARTISAN · DEEP',
        accentHex: '#E07A48',
        accentHexLight: '#C25929',
        secondaryHex: '#F4A261',
        secondaryHexLight: '#B45309',
        glowRgba: 'rgba(224, 122, 72, 0.30)',
        taglineZh: 'Anthropic 陶土暖珀晶体旗舰 · 深度审计、架构思辨与细腻写作核',
        taglineEn: 'Flagship Artisan Reasoning · Deep Code Audit & Nuanced Synthesis',
        scenesZh: ['深度审阅', '架构思辨', '精工写作'],
        scenesEn: ['Code Audit', 'Deep Debug', 'Craft'],
      },
      {
        id: 'claude-sonnet',
        oledAuxId: 'claude',
        miniKey: 'claude',
        shortLabel: 'Sonnet',
        subLabel: '5.5',
        badgeCode: 'SONNET',
        defaultTitle: 'Claude Sonnet 5.5',
        roleTag: 'AGILE · CODE',
        accentHex: '#D97742',
        accentHexLight: '#B45309',
        secondaryHex: '#F4B26A',
        secondaryHexLight: '#D97706',
        glowRgba: 'rgba(217, 119, 66, 0.28)',
        taglineZh: 'Anthropic 陶土暖珀敏捷编码核 · 高频组件构建与工具链协同主力',
        taglineEn: 'Balanced Agile Coding Core · Rapid UI Engineering & Tool Use',
        scenesZh: ['前端精工', '敏捷迭代', '工具协同'],
        scenesEn: ['UI Craft', 'Fast Build', 'Tool Use'],
      },
      {
        id: 'gpt-oss',
        oledAuxId: 'gpt',
        miniKey: 'gpt',
        shortLabel: 'GPT',
        subLabel: '120B',
        badgeCode: 'GPT',
        defaultTitle: 'GPT-OSS 120B',
        roleTag: 'MATRIX · LOGIC',
        accentHex: '#4FD1C5',
        accentHexLight: '#0F766E',
        secondaryHex: '#99F6E4',
        secondaryHexLight: '#0D9488',
        glowRgba: 'rgba(79, 209, 197, 0.28)',
        taglineZh: '极简银青冰薄荷逻辑矩阵推理核 · 后端逻辑交叉核验与开放权重推理',
        taglineEn: 'Silver-Mint Logic Matrix · Backend Cross-Verification & Math',
        scenesZh: ['算法推演', '后端盲审', '逻辑校验'],
        scenesEn: ['Algorithms', 'Audit', 'Logic Check'],
      },
      {
        id: 'blind',
        oledAuxId: 'standby',
        miniKey: 'fallback',
        shortLabel: '—',
        subLabel: 'LOCK',
        badgeCode: 'AUX',
        defaultTitle: 'Aux Macro Slot — Reserved',
        roleTag: 'RESERVED',
        accentHex: '#64748B',
        accentHexLight: '#475569',
        secondaryHex: '#475569',
        glowRgba: 'rgba(100, 116, 139, 0.22)',
        taglineZh: '定制 CNC 铝合金 2x3 副盘预留扩展键位 · 暗刻阳极盲键',
        taglineEn: 'Bespoke CNC 2x3 Aux Macro Pad Reserved Anodized Blind Keycap',
        scenesZh: ['扩展席位', '暗刻盲键', 'AUX-06'],
        scenesEn: ['Reserved', 'Blind Cap', 'AUX-06'],
      },
    ];

    function stripEffortSuffixFromLabel(rawLabel) {
      var clean = String(rawLabel || '').replace(/^.*?\bcurrent:\s*/i, '').trim();
      var effort = '';
      var hasExplicit = false;
      var zhM = ZH_EFFORT_PAREN_RE.exec(clean);
      if (zhM) {
        effort = normalizeZhEffortWord(zhM[1]);
        clean = clean.slice(0, zhM.index).trim();
        hasExplicit = true;
      } else {
        var enM = EN_EFFORT_PAREN_RE.exec(clean);
        if (enM) {
          effort = normalizeEnEffortWord(enM[1]);
          clean = clean.slice(0, enM.index).trim();
          hasExplicit = true;
        } else {
          var bareEn = /\s+(extra\s+high|xhigh|extra|max|high|medium|med|low|minimal|off)\s*$/i.exec(clean);
          if (bareEn) {
            var rEff = bareEn[1].toLowerCase().replace(/\s+/g, '');
            effort = rEff === 'extrahigh' ? 'xhigh' : normalizeEnEffortWord(rEff);
            clean = clean.slice(0, bareEn.index).trim();
            hasExplicit = true;
          }
        }
      }
      return {
        baseName: clean || String(rawLabel || '').trim(),
        effort: effort && EFFORT_LABELS[effort] ? effort : '',
        hasExplicitEffort: hasExplicit,
      };
    }

    function classifyNonElementOption(optionObj, forcedEffortKey) {
      var rawLabel = typeof optionObj.label === 'string' ? optionObj.label.trim() : '';
      var modelId = typeof optionObj.modelId === 'string' ? optionObj.modelId.trim() : '';
      var hay = (rawLabel + ' ' + modelId).toLowerCase();

      if (/orchestrator|编排|调度器/.test(hay)) {
        var isVariant = /\(/.test(rawLabel);
        return {
          groupKey: 'orchestrator',
          priority: 0,
          preset: AUX_MODEL_PRESETS[0],
          baseName: 'Orchestrator',
          variantEffort: '',
          variantLabel: '',
          preferAsDefault: !isVariant,
        };
      }
      var stripped = stripEffortSuffixFromLabel(rawLabel);
      var effResolved = forcedEffortKey ? normalizeEnEffortWord(forcedEffortKey) : stripped.effort;
      var hasExp = Boolean(forcedEffortKey || stripped.hasExplicitEffort);
      if (!EFFORT_LABELS[effResolved]) effResolved = '';

      if (/\bflash\b/.test(hay)) {
        var verFlash = /\b(\d+\.\d+)\b/.exec(stripped.baseName);
        var fEff = effResolved || 'high';
        return {
          groupKey: 'flash',
          priority: 1,
          preset: AUX_MODEL_PRESETS[1],
          baseName: stripped.baseName,
          subLabelOverride: verFlash ? verFlash[1] : 'FAST',
          variantEffort: fEff,
          variantLabel: hasExp ? EFFORT_LABELS[fEff] || fEff : 'Adaptive',
          preferAsDefault: !hasExp || fEff === 'high',
        };
      }
      if (/\bopus\b/.test(hay)) {
        var verOpus = /\b(\d+(?:\.\d+)?)\b/.exec(stripped.baseName);
        var oEff = effResolved || 'high';
        return {
          groupKey: 'claude-opus',
          priority: 2,
          preset: AUX_MODEL_PRESETS[2],
          baseName: stripped.baseName,
          subLabelOverride: verOpus ? verOpus[1] : 'DEEP',
          variantEffort: oEff,
          variantLabel: hasExp ? EFFORT_LABELS[oEff] || oEff : 'High',
          preferAsDefault: !hasExp || oEff === 'high',
        };
      }
      if (/\b(?:sonnet|haiku|claude|anthropic)\b/.test(hay)) {
        var isHaiku = /\bhaiku\b/.test(hay);
        var verCl = /\b(\d+(?:\.\d+)?)\b/.exec(stripped.baseName);
        var sEff = effResolved || 'high';
        return {
          groupKey: isHaiku ? 'claude-haiku' : 'claude-sonnet',
          priority: isHaiku ? 3.5 : 3,
          preset: AUX_MODEL_PRESETS[3],
          baseName: stripped.baseName,
          shortLabelOverride: isHaiku ? 'Haiku' : /\bsonnet\b/.test(hay) ? 'Sonnet' : 'Claude',
          badgeCodeOverride: isHaiku ? 'HAIKU' : /\bsonnet\b/.test(hay) ? 'SONNET' : 'CLAUDE',
          subLabelOverride: verCl ? verCl[1] : 'CODE',
          variantEffort: sEff,
          variantLabel: hasExp ? EFFORT_LABELS[sEff] || sEff : 'Adaptive',
          preferAsDefault: !hasExp || sEff === 'high',
        };
      }
      if (/\b(?:gpt|openai|codex|deepseek|qwen|llama|mistral)\b|\bo[134](?:-[a-z0-9]+)?\b/.test(hay)) {
        var subGpt = /\b(\d+[bB])\b/.exec(stripped.baseName);
        var isCodex = /\bcodex\b/.test(hay);
        var gEff = effResolved || 'medium';
        return {
          groupKey: isCodex ? 'codex' : 'gpt-oss',
          priority: 4,
          preset: AUX_MODEL_PRESETS[4],
          baseName: stripped.baseName,
          shortLabelOverride: isCodex ? 'Codex' : 'GPT',
          badgeCodeOverride: isCodex ? 'CODEX' : 'GPT',
          subLabelOverride: subGpt ? subGpt[1].toUpperCase() : 'OSS',
          variantEffort: gEff,
          variantLabel: hasExp ? EFFORT_LABELS[gEff] || gEff : 'Adaptive',
          preferAsDefault: !hasExp || gEff === 'high' || gEff === 'medium',
        };
      }
      var cleanShort = stripped.baseName.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/)[0] || 'Aux';
      if (cleanShort.length > 6) cleanShort = cleanShort.slice(0, 6);
      var cEff = effResolved || 'high';
      return {
        groupKey: 'custom:' + stripped.baseName.toLowerCase(),
        priority: 5,
        preset: AUX_MODEL_PRESETS[4],
        baseName: stripped.baseName,
        shortLabelOverride: cleanShort,
        badgeCodeOverride: cleanShort.toUpperCase(),
        subLabelOverride: 'EXT',
        variantEffort: cEff,
        variantLabel: hasExp ? EFFORT_LABELS[cEff] || cEff : 'Default',
        preferAsDefault: true,
      };
    }

    /**
     * Extract non-element host models into a 6-slot 2x3 Aux Macro Pad array.
     * Slot #0 is strictly prioritized for Orchestrator latching toggle when present.
     * Supports aggregating multi-effort options from `effortIndex` and `orchestratorPlanners`.
     */
    function matchHostAuxModels(modelOptions, effortIndex, orchestratorPlanners) {
      var hasHostMenu = Array.isArray(modelOptions) && modelOptions.length > 0;
      if (!hasHostMenu) {
        var demoOut = [];
        for (var di = 0; di < 6; di += 1) {
          var dp = AUX_MODEL_PRESETS[di];
          var isDemoAvail = di < 5;
          var demoOpt = isDemoAvail
            ? { label: dp.defaultTitle, value: dp.id, modelId: dp.id }
            : null;
          var demoBench = resolveBenchmarkMetrics(dp.id, 'high', true, isDemoAvail);
          demoOut.push({
            slotIndex: di,
            auxIndex: di,
            id: dp.id,
            oledAuxId: dp.oledAuxId,
            miniKey: dp.miniKey,
            shortLabel: dp.shortLabel,
            subLabel: dp.subLabel,
            badgeCode: dp.badgeCode,
            title: dp.defaultTitle,
            roleTag: dp.roleTag,
            accentHex: dp.accentHex,
            accentHexLight: dp.accentHexLight || dp.accentHex,
            secondaryHex: dp.secondaryHex,
            glowRgba: dp.glowRgba,
            taglineZh: dp.taglineZh,
            taglineEn: dp.taglineEn,
            scenesZh: dp.scenesZh,
            scenesEn: dp.scenesEn,
            scores: demoBench.ratios.slice(),
            available: isDemoAvail,
            levels:
              isDemoAvail && dp.id !== 'orchestrator'
                ? [{ effort: 'high', label: 'Adaptive', option: demoOpt, modelOption: demoOpt }]
                : [],
            defaultOption: demoOpt,
            allOptions: demoOpt ? [demoOpt] : [],
          });
        }
        return demoOut;
      }

      var groups = new Map();
      var orderCounter = 0;

      function ingestAuxOpt(rawOpt, forcedEffKey) {
        if (!rawOpt) return;
        var optObj =
          typeof rawOpt === 'string'
            ? { label: rawOpt, value: rawOpt }
            : rawOpt.nodeType === 1
            ? { label: String(rawOpt.textContent || '').trim(), _domNode: rawOpt }
            : rawOpt;
        if (!optObj || typeof optObj.label !== 'string' || !optObj.label.trim()) return;
        if (parseElementModelLabel(optObj)) return;

        var cls = classifyNonElementOption(optObj, forcedEffKey);
        var g = groups.get(cls.groupKey);
        if (!g) {
          g = {
            groupKey: cls.groupKey,
            priority: cls.priority,
            order: orderCounter++,
            preset: cls.preset,
            baseName: cls.baseName,
            shortLabel: cls.shortLabelOverride || cls.preset.shortLabel,
            subLabel: cls.subLabelOverride || cls.preset.subLabel,
            badgeCode: cls.badgeCodeOverride || cls.preset.badgeCode,
            byEffort: new Map(),
            defaultOption: optObj,
            hasPreferredDefault: Boolean(cls.preferAsDefault),
            allOptions: [],
          };
          groups.set(cls.groupKey, g);
        }
        if (g.allOptions.indexOf(optObj) === -1) {
          g.allOptions.push(optObj);
        }
        if (!g.hasPreferredDefault && cls.preferAsDefault) {
          g.defaultOption = optObj;
          g.hasPreferredDefault = true;
        }
        if (cls.groupKey !== 'orchestrator') {
          var effCode = cls.variantEffort || 'high';
          if (!g.byEffort.has(effCode)) {
            g.byEffort.set(effCode, {
              effort: effCode,
              label: cls.variantLabel || 'Adaptive',
              option: optObj,
              modelOption: optObj,
            });
          }
        }
      }

      for (var i = 0; i < modelOptions.length; i += 1) {
        ingestAuxOpt(modelOptions[i], '');
      }
      if (effortIndex instanceof Map) {
        effortIndex.forEach(function (innerMap) {
          if (!(innerMap instanceof Map)) return;
          innerMap.forEach(function (opt, effKey) {
            ingestAuxOpt(opt, String(effKey || ''));
          });
        });
      }
      if (Array.isArray(orchestratorPlanners)) {
        for (var pi = 0; pi < orchestratorPlanners.length; pi += 1) {
          var pOpt = orchestratorPlanners[pi];
          if (pOpt && !parseElementModelLabel(pOpt) && groups.size > 0) {
            var pCls = classifyNonElementOption(pOpt, '');
            if (groups.has(pCls.groupKey)) {
              ingestAuxOpt(pOpt, '');
            }
          }
        }
      }

      var sortedGroups = Array.from(groups.values()).sort(function (a, b) {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.order - b.order;
      });

      var slots = [];
      for (var k = 0; k < 6; k += 1) {
        if (k < sortedGroups.length) {
          var sg = sortedGroups[k];
          var pr = sg.preset;
          var orderedLevels = [];
          for (var ei = 0; ei < EFFORT_ORDER.length; ei += 1) {
            var ek = EFFORT_ORDER[ei];
            if (sg.byEffort.has(ek)) {
              orderedLevels.push(sg.byEffort.get(ek));
            }
          }
          sg.byEffort.forEach(function (lvObj, lvKey) {
            if (EFFORT_ORDER.indexOf(lvKey) === -1) {
              orderedLevels.push(lvObj);
            }
          });
          if (orderedLevels.length >= 2) {
            for (var li = 0; li < orderedLevels.length; li += 1) {
              if (EFFORT_LABELS[orderedLevels[li].effort]) {
                orderedLevels[li].label = EFFORT_LABELS[orderedLevels[li].effort];
              }
            }
          }
          var slotId = pr.id === 'blind' ? 'aux-' + k : pr.id;
          var initBench = resolveBenchmarkMetrics(slotId, 'high', true, true);
          slots.push({
            slotIndex: k,
            auxIndex: k,
            id: slotId,
            oledAuxId: pr.oledAuxId,
            miniKey: pr.miniKey,
            shortLabel: sg.shortLabel,
            subLabel: sg.subLabel,
            badgeCode: sg.badgeCode,
            title: sg.baseName,
            roleTag: pr.roleTag,
            accentHex: pr.accentHex,
            accentHexLight: pr.accentHexLight || pr.accentHex,
            secondaryHex: pr.secondaryHex,
            glowRgba: pr.glowRgba,
            taglineZh: pr.taglineZh,
            taglineEn: pr.taglineEn,
            scenesZh: pr.scenesZh,
            scenesEn: pr.scenesEn,
            scores: initBench.ratios.slice(),
            available: true,
            levels: orderedLevels,
            defaultOption: sg.defaultOption,
            allOptions: sg.allOptions,
          });
        } else {
          var bp = AUX_MODEL_PRESETS[5];
          slots.push({
            slotIndex: k,
            auxIndex: k,
            id: 'blind-' + k,
            oledAuxId: 'standby',
            miniKey: 'fallback',
            shortLabel: bp.shortLabel,
            subLabel: bp.subLabel,
            badgeCode: bp.badgeCode,
            title: bp.defaultTitle,
            roleTag: bp.roleTag,
            accentHex: bp.accentHex,
            secondaryHex: bp.secondaryHex,
            glowRgba: bp.glowRgba,
            taglineZh: bp.taglineZh,
            taglineEn: bp.taglineEn,
            scenesZh: bp.scenesZh,
            scenesEn: bp.scenesEn,
            scores: [0.28, 0.28, 0.28, 0.28, 0.28],
            available: false,
            levels: [],
            defaultOption: null,
            allOptions: [],
          });
        }
      }
      return slots;
    }

    function formatCompactTokensK(tokens) {
      var n = Math.max(0, Number(tokens) || 0);
      if (n >= 524288 && Math.abs(n - 524288) < 1024) return '512K';
      if (n >= 1000) {
        var kVal = n / 1024;
        return (kVal >= 100 ? kVal.toFixed(0) : kVal.toFixed(1).replace(/\.0$/, '')) + 'K';
      }
      return String(Math.round(n));
    }

    function parseTokenStringNumber(str) {
      if (!str || typeof str !== 'string') return NaN;
      var m = /(\d+(?:\.\d+)?)\s*([kKmM])?\b/.exec(str.replace(/,/g, ''));
      if (!m) return NaN;
      var num = parseFloat(m[1]);
      if (!Number.isFinite(num)) return NaN;
      var unit = (m[2] || '').toLowerCase();
      if (unit === 'k') return Math.round(num * 1024);
      if (unit === 'm') return Math.round(num * 1024 * 1024);
      return Math.round(num);
    }

    /**
     * Read live 512K context & compute telemetry from declarative options or DOM nodes.
     * Strictly aligns default maximum window capacity to PRISM-118 512K (524,288 tokens).
     */
    function readConsoleTelemetry(doc, root, activeSeed, telemetryOverride) {
      var maxTokens = DEFAULT_MAX_CONTEXT_TOKENS;
      var usedTokens = NaN;
      var cacheRate = NaN;
      var tps = NaN;
      var customHistory = null;

      try {
        var resolvedOverride = typeof telemetryOverride === 'function' ? telemetryOverride() : telemetryOverride;
        var src =
          (resolvedOverride && typeof resolvedOverride === 'object' && resolvedOverride) ||
          (root && root.PrismPeriodicTelemetry && typeof root.PrismPeriodicTelemetry === 'object' && root.PrismPeriodicTelemetry) ||
          null;
        if (src) {
          var rawUsed =
            src.usedTokens !== undefined
              ? src.usedTokens
              : src.contextTokens !== undefined
              ? src.contextTokens
              : src.totalTokens !== undefined
              ? src.totalTokens
              : src.tokens;
          if (typeof rawUsed === 'number' && Number.isFinite(rawUsed) && rawUsed >= 0) {
            usedTokens = rawUsed;
          } else if (typeof rawUsed === 'string') {
            usedTokens = parseTokenStringNumber(rawUsed);
          }
          var rawMax = src.maxTokens || src.contextLimit || src.windowSize;
          if (typeof rawMax === 'number' && Number.isFinite(rawMax) && rawMax >= DEFAULT_MAX_CONTEXT_TOKENS) {
            maxTokens = Math.round(rawMax);
          }
          if (typeof src.cacheHitRate === 'number' && Number.isFinite(src.cacheHitRate)) {
            cacheRate = src.cacheHitRate <= 1 ? src.cacheHitRate * 100 : src.cacheHitRate;
          }
          if (typeof src.tps === 'number' && Number.isFinite(src.tps)) {
            tps = src.tps;
          }
          if (Array.isArray(src.history) && src.history.length >= 4) {
            customHistory = src.history;
          }
        }
      } catch (e) {}

      if (!Number.isFinite(usedTokens) && doc && typeof doc.querySelector === 'function') {
        try {
          var tokNode = doc.querySelector('[data-prism-telemetry="tokens"], [data-testid="context-tokens"]');
          if (tokNode && typeof tokNode.textContent === 'string') {
            var parsedDomTok = parseTokenStringNumber(tokNode.textContent);
            if (Number.isFinite(parsedDomTok) && parsedDomTok >= 0) {
              usedTokens = parsedDomTok;
            }
          }
          if (!Number.isFinite(usedTokens)) {
            var pctNode = doc.querySelector('[data-testid="context-percent"]');
            if (pctNode && typeof pctNode.textContent === 'string') {
              var pm = /(\d+(?:\.\d+)?)\s*%/.exec(pctNode.textContent);
              if (pm) {
                usedTokens = Math.round((parseFloat(pm[1]) / 100) * maxTokens);
              }
            }
          }
          if (!Number.isFinite(tps)) {
            var tpsNode = doc.querySelector('[data-testid="tps"]');
            if (tpsNode && typeof tpsNode.textContent === 'string') {
              var tm = /(\d+(?:\.\d+)?)/.exec(tpsNode.textContent);
              if (tm) tps = parseFloat(tm[1]);
            }
          }
        } catch (e) {}
      }

      var seedNum = Math.abs(Number(activeSeed) || 6);
      if (!Number.isFinite(usedTokens)) {
        /* Deterministic realistic fallback telemetry anchored against 512K window */
        usedTokens = 74752 + ((seedNum * 11264) % 96256);
      }
      usedTokens = Math.max(0, Math.min(maxTokens, Math.round(usedTokens)));
      var ratio = maxTokens > 0 ? Math.max(0, Math.min(1, usedTokens / maxTokens)) : 0;
      var pct = Math.round(ratio * 1000) / 10;

      if (!Number.isFinite(cacheRate)) {
        cacheRate = 91 + (seedNum % 7);
      }
      cacheRate = Math.max(0, Math.min(99.9, cacheRate));

      if (!Number.isFinite(tps)) {
        tps = seedNum === 1 ? 168 : seedNum === 10 ? 146 : 94 + (seedNum % 32);
      }

      var pulse = [];
      if (customHistory) {
        for (var hi = 0; hi < Math.min(12, customHistory.length); hi += 1) {
          pulse.push(Math.max(0.08, Math.min(0.96, Number(customHistory[hi]) || 0.4)));
        }
      } else {
        var baseLv = Math.max(0.18, Math.min(0.84, ratio * 0.72 + 0.18));
        for (var pi = 0; pi < 10; pi += 1) {
          var wave = Math.sin(pi * 0.85 + seedNum * 0.7) * 0.16 + Math.cos(pi * 1.4 - seedNum * 0.3) * 0.08;
          pulse.push(Math.max(0.12, Math.min(0.95, baseLv + wave + (pi / 10) * 0.1)));
        }
      }

      return {
        usedTokens: usedTokens,
        maxTokens: maxTokens,
        usedLabel: formatCompactTokensK(usedTokens),
        maxLabel: formatCompactTokensK(maxTokens),
        freeLabel: formatCompactTokensK(Math.max(0, maxTokens - usedTokens)),
        ratio: ratio,
        percentText: pct.toFixed(1) + '%',
        cacheText: Math.round(cacheRate) + '%',
        tpsText: Math.round(tps) + ' tok/s',
        healthLevel: ratio > 0.78 ? 'warn' : 'ok',
        pulse: pulse,
      };
    }

    /**
     * Resolve live Obsidian Prism UI theme profile from document root attributes & host state.
     * Maps accurately to the 4 custom mechanical keyboard chassis kits:
     *   - 'obsidian-dark' | 'warm-dark' | 'crystal-light' | 'alabaster-light'
     */
    var cachedComputedThemeByDoc = typeof WeakMap === 'function' ? new WeakMap() : null;

    function invalidateComputedThemeCache(doc) {
      if (cachedComputedThemeByDoc && doc && typeof doc === 'object') {
        cachedComputedThemeByDoc.delete(doc);
      }
    }

    function detectLightDarkMode(doc, root) {
      try {
        var de = doc && doc.documentElement;
        if (de && typeof de.getAttribute === 'function') {
          var explicit = de.getAttribute('data-prism-theme') || de.getAttribute('data-theme') || '';
          if (explicit === 'light') return 'light';
          if (explicit === 'dark') return 'dark';
        }
        if (de && de.classList && typeof de.classList.contains === 'function') {
          if (de.classList.contains('light') && !de.classList.contains('dark')) return 'light';
          if (de.classList.contains('dark')) return 'dark';
        }
        if (doc && doc.body && doc.body.classList && typeof doc.body.classList.contains === 'function') {
          if (doc.body.classList.contains('light') && !doc.body.classList.contains('dark')) return 'light';
          if (doc.body.classList.contains('dark')) return 'dark';
        }
        if (cachedComputedThemeByDoc && doc && typeof doc === 'object') {
          var cachedMode = cachedComputedThemeByDoc.get(doc);
          if (cachedMode === 'light' || cachedMode === 'dark') return cachedMode;
        }
        if (root && typeof root.getComputedStyle === 'function' && (doc.body || de)) {
          var bg = root.getComputedStyle(doc.body || de).backgroundColor || '';
          var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/i.exec(bg);
          if (m) {
            var alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
            if (alpha > 0.1) {
              var lum = 0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3]);
              var resolvedMode = lum > 145 ? 'light' : 'dark';
              if (cachedComputedThemeByDoc && doc && typeof doc === 'object') {
                cachedComputedThemeByDoc.set(doc, resolvedMode);
              }
              return resolvedMode;
            }
          }
        }
        if (root && typeof root.matchMedia === 'function') {
          if (root.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        }
      } catch (e) {}
      return 'dark';
    }

    function resolvePrismThemeProfile(doc, root) {
      var de = doc && doc.documentElement;
      var ga = function (attr) {
        try {
          return de && typeof de.getAttribute === 'function' ? de.getAttribute(attr) || '' : '';
        } catch (e) {
          return '';
        }
      };

      var rawPalette = ga('data-prism-palette').toLowerCase();
      var palette =
        rawPalette === 'warm' || rawPalette === 'claude' || rawPalette === 'host' || rawPalette === 'obsidian'
          ? rawPalette
          : 'obsidian';

      var theme = detectLightDarkMode(doc, root);
      var isLight = theme === 'light';

      var rawLightPreset = ga('data-prism-light-preset').toLowerCase();
      var lightPreset = rawLightPreset === 'alabaster' ? 'alabaster' : 'crystal';

      var rawAccent = ga('data-prism-accent').toLowerCase();
      var accent =
        rawAccent === 'cobalt' ||
        rawAccent === 'iris' ||
        rawAccent === 'amber' ||
        rawAccent === 'mono' ||
        rawAccent === 'follow'
          ? rawAccent
          : 'follow';
      var isMono = accent === 'mono';

      var rawCorners = ga('data-prism-corners').toLowerCase();
      var corners = rawCorners === 'sharp' || rawCorners === 'soft' ? rawCorners : 'balanced';

      var rawAmbient = ga('data-prism-ambient');
      var ambientMul = 1;
      if (rawAmbient !== '' && rawAmbient !== null && rawAmbient !== undefined) {
        var numAmb = Number(rawAmbient);
        if (Number.isFinite(numAmb)) {
          ambientMul = numAmb <= 0 ? 0 : numAmb > 1 ? Math.min(1, numAmb / 100) : numAmb;
        }
      }

      var isWarmTone = palette === 'warm' || palette === 'claude';
      var kitId = 'obsidian-dark';
      if (isLight) {
        kitId = isWarmTone || lightPreset === 'alabaster' ? 'alabaster-light' : 'crystal-light';
      } else {
        kitId = isWarmTone ? 'warm-dark' : 'obsidian-dark';
      }

      /* Resolve 6-spectrum family rimTone for optical edge dispersion */
      var rimTone = 'default';
      if (accent === 'mono' || accent === 'cobalt' || accent === 'iris' || accent === 'amber') {
        rimTone = accent;
      } else if (isWarmTone || (isLight && lightPreset === 'alabaster')) {
        rimTone = 'warm';
      }

      var primaryHex = '#669DF6';
      if (accent === 'cobalt') {
        primaryHex = isLight ? '#2563EB' : '#669DF6';
      } else if (accent === 'iris') {
        primaryHex = isLight ? '#7C3AED' : '#A58AF8';
      } else if (accent === 'amber') {
        primaryHex = isLight ? '#D97706' : '#F2B84B';
      } else if (accent === 'mono') {
        primaryHex = isLight ? '#334155' : '#D4D7E0';
      } else if (kitId === 'warm-dark') {
        primaryHex = '#D97757';
      } else if (kitId === 'alabaster-light') {
        primaryHex = isWarmTone ? '#C25934' : '#B45309';
      } else if (kitId === 'crystal-light') {
        primaryHex = '#2563EB';
      }

      return {
        id: kitId,
        theme: theme,
        isLight: isLight,
        palette: palette,
        lightPreset: lightPreset,
        accent: accent,
        rimTone: rimTone,
        isMono: isMono,
        corners: corners,
        ambientMul: ambientMul,
        primaryHex: primaryHex,
      };
    }

    function miniKeycapColorsForZ(slotZ, profile) {
      return resolveThemeNativeMiniBadgeColors(slotZ, profile);
    }

    function hudGemColorsForZ(slotZ, profile) {
      if (profile && profile.isMono) {
        return profile.isLight ? HUD_GEM_STYLES.monoLight : HUD_GEM_STYLES.monoDark;
      }
      return HUD_GEM_STYLES[slotZ] || HUD_GEM_STYLES.fallback;
    }

    function selectHudIslandElements(entries, availMap) {
      if (!Array.isArray(entries) || entries.length === 0) {
        return CORE_FOUR_ELEMENTS.slice();
      }
      if (entries.length <= 4) {
        return entries.slice();
      }
      var picked = [];
      var seen = new Set();
      for (var ci = 0; ci < CORE_FOUR_ELEMENTS.length; ci += 1) {
        var cz = CORE_FOUR_ELEMENTS[ci].slotZ;
        if (availMap && availMap.has(cz)) {
          picked.push(availMap.get(cz));
          seen.add(cz);
        }
      }
      for (var ei = 0; ei < entries.length && picked.length < 4; ei += 1) {
        var ez = entries[ei].slotZ || entries[ei].z;
        if (!seen.has(ez)) {
          picked.push(entries[ei]);
          seen.add(ez);
        }
      }
      return picked;
    }

    /* Resolve Baked PBR / SVG Grain Assets from globalThis or CommonJS (graceful null fallback) */
    function resolveOledScreenModule(root) {
      if (root && root.PrismPeriodicOledScreen && typeof root.PrismPeriodicOledScreen === 'object') {
        return root.PrismPeriodicOledScreen;
      }
      if (
        typeof globalThis === 'object' &&
        globalThis &&
        globalThis.PrismPeriodicOledScreen &&
        typeof globalThis.PrismPeriodicOledScreen === 'object'
      ) {
        return globalThis.PrismPeriodicOledScreen;
      }
      if (typeof require === 'function') {
        try {
          var mod = require('./oled-cyber-screen.js');
          if (mod && typeof mod === 'object') return mod;
        } catch (e) {}
      }
      return null;
    }

    function isNodeConnectedToDoc(docRef, node) {
      if (!node || !docRef) return false;
      if (typeof node.isConnected === 'boolean') return node.isConnected;
      if (docRef.documentElement && typeof docRef.documentElement.contains === 'function') {
        return docRef.documentElement.contains(node);
      }
      var cur = node;
      while (cur) {
        if (cur === docRef || cur === docRef.documentElement || cur === docRef.body) return true;
        cur = cur.parentNode || cur.parentElement;
      }
      return false;
    }

    function resolveGrainAssets(root) {
      if (root && root.PrismPeriodicGrainAssets && typeof root.PrismPeriodicGrainAssets === 'object') {
        return root.PrismPeriodicGrainAssets;
      }
      if (
        typeof globalThis === 'object' &&
        globalThis &&
        globalThis.PrismPeriodicGrainAssets &&
        typeof globalThis.PrismPeriodicGrainAssets === 'object'
      ) {
        return globalThis.PrismPeriodicGrainAssets;
      }
      if (typeof require === 'function') {
        try {
          var mod = require('./pbr-grain-assets.js');
          if (mod && typeof mod === 'object') return mod;
        } catch (e) {}
      }
      return null;
    }

    var SAFE_SVG_PATH_RE = /^[MmLlHhVvCcSsQqTtAaZz0-9.,+\-\sEe]+$/;

    function normalizeSvgAsset(rawAsset, fallbackSize) {
      if (!rawAsset || typeof rawAsset !== 'object') return null;
      var defDim = Number(fallbackSize) > 0 ? Number(fallbackSize) : 2048;
      var viewBoxStr = '0 0 ' + defDim + ' ' + defDim;
      var rawVb = rawAsset.viewBox;
      if (typeof rawVb === 'number' && Number.isFinite(rawVb) && rawVb > 0) {
        var hNum = Number(rawAsset.height || rawAsset.vbH);
        viewBoxStr = '0 0 ' + rawVb + ' ' + (Number.isFinite(hNum) && hNum > 0 ? hNum : rawVb);
      } else if (typeof rawVb === 'string' && rawVb.trim()) {
        var trimmedVb = rawVb.trim();
        if (/^\d+(?:\.\d+)?$/.test(trimmedVb)) {
          viewBoxStr = '0 0 ' + trimmedVb + ' ' + trimmedVb;
        } else if (/^[\d.\-\s]+$/.test(trimmedVb)) {
          viewBoxStr = trimmedVb.replace(/\s+/g, ' ');
        }
      } else if (Number(rawAsset.width) > 0 && Number(rawAsset.height) > 0) {
        viewBoxStr = '0 0 ' + Number(rawAsset.width) + ' ' + Number(rawAsset.height);
      }

      var rawPaths = Array.isArray(rawAsset.paths) ? rawAsset.paths : [];
      var paths = [];
      for (var i = 0; i < rawPaths.length; i += 1) {
        var item = rawPaths[i];
        var dStr = '';
        var strokeOnly = false;
        var strokeWidth = 0;
        var fillRule = '';
        if (typeof item === 'string') {
          dStr = item.trim();
          if (dStr && !/[zZ]\s*$/.test(dStr)) {
            strokeOnly = true;
            strokeWidth = 2.2;
          }
        } else if (item && typeof item === 'object' && typeof item.d === 'string') {
          dStr = item.d.trim();
          if (item.fill === 'none' || item.strokeOnly) {
            strokeOnly = true;
          }
          if (Number(item.strokeWidth) > 0) {
            strokeWidth = Number(item.strokeWidth);
          }
          if (typeof item.fillRule === 'string' && item.fillRule) {
            fillRule = item.fillRule;
          }
        }
        if (!dStr || !SAFE_SVG_PATH_RE.test(dStr)) continue;
        paths.push({
          d: dStr,
          strokeOnly: strokeOnly,
          strokeWidth: strokeWidth,
          fillRule: fillRule,
        });
      }
      if (!paths.length) return null;
      return { viewBox: viewBoxStr, paths: paths };
    }

    function appendSvgPathsToNode(doc, svgEl, spec) {
      for (var i = 0; i < spec.paths.length; i += 1) {
        var p = spec.paths[i];
        var attrs = { d: p.d };
        if (p.strokeOnly) {
          attrs.fill = 'none';
          attrs.stroke = 'currentColor';
          attrs['stroke-width'] = String(p.strokeWidth || 2.2);
          attrs['stroke-linecap'] = 'round';
          attrs['stroke-linejoin'] = 'round';
        } else {
          attrs.fill = 'currentColor';
          if (p.fillRule) attrs['fill-rule'] = p.fillRule;
        }
        svgEl.appendChild(mkSvg(doc, 'path', attrs));
      }
    }

    function mountDeskmatTopoSvgIfAvailable(doc, stageWrap, root) {
      if (!doc || !stageWrap) return false;
      if (stageWrap.getAttribute('data-has-topo') === '1') return true;
      var assets = resolveGrainAssets(root);
      var topoSpec = assets && assets.DESKMAT_TOPO ? normalizeSvgAsset(assets.DESKMAT_TOPO, 2048) : null;
      if (!topoSpec) return false;
      var svg = mkSvg(doc, 'svg', {
        class: 'pp-deskmat-topo',
        viewBox: topoSpec.viewBox,
        preserveAspectRatio: 'xMidYMid slice',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      appendSvgPathsToNode(doc, svg, topoSpec);
      stageWrap.appendChild(svg);
      stageWrap.setAttribute('data-has-topo', '1');
      return true;
    }

    function buildDeskmatStage(doc, root) {
      var stageWrap = mkEl(doc, 'div', 'pp-deskmat-stage');
      stageWrap.setAttribute('aria-hidden', 'true');
      stageWrap.setAttribute('data-prism-owned', '1');
      stageWrap.setAttribute('data-has-topo', '0');
      var glowEl = mkEl(doc, 'div', 'pp-deskmat-glow');
      var auraEl = mkEl(doc, 'div', 'pp-prism-aura');
      auraEl.setAttribute('aria-hidden', 'true');
      auraEl.setAttribute('data-prism-owned', '1');
      var auraWings = mkEl(doc, 'div', 'pp-prism-aura-wings');
      var auraCore = mkEl(doc, 'div', 'pp-prism-aura-core');
      auraEl.appendChild(auraWings);
      auraEl.appendChild(auraCore);
      stageWrap.appendChild(glowEl);
      stageWrap.appendChild(auraEl);
      mountDeskmatTopoSvgIfAvailable(doc, stageWrap, root);
      return stageWrap;
    }

    /* Dual-layer Volumetric Levitation Back-Halo & Far-Field Diffuse Shadow under 3D chassis */
    function mountStudioFloorRig(doc, stageContainer) {
      if (!doc || !stageContainer) return;
      var haloEl = mkEl(doc, 'div', 'pp-studio-halo');
      haloEl.setAttribute('aria-hidden', 'true');
      var shadowEl = mkEl(doc, 'div', 'pp-floor-shadow');
      shadowEl.setAttribute('aria-hidden', 'true');
      stageContainer.appendChild(haloEl);
      stageContainer.appendChild(shadowEl);
    }

    /* Pure DOM Precision Linear SVG Icons (createElementNS only, zero unsafe markup) */
    function buildHudResetViewSvg(doc) {
      /* Optical Reticle & Orbit Return Icon for External Reset View Capsule */
      var svg = mkSvg(doc, 'svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M4.3 10.2a8.1 8.1 0 0 1 14.2-3.9',
          stroke: 'currentColor',
          'stroke-width': '1.45',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M18.7 3.5v3.3h-3.3',
          stroke: 'currentColor',
          'stroke-width': '1.45',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M19.7 13.8a8.1 8.1 0 0 1-14.2 3.9',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
          opacity: '0.68',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'circle', {
          cx: '12',
          cy: '12',
          r: '3.2',
          stroke: 'currentColor',
          'stroke-width': '1.35',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M12 6.6v1.8M12 15.6v1.8M6.6 12h1.8M15.6 12h1.8',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'circle', {
          cx: '12',
          cy: '12',
          r: '0.95',
          fill: 'currentColor',
        })
      );
      return svg;
    }

    function buildHudMuteSvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M11 5.4L6.4 9.2H3.5v5.6h2.9L11 18.6V5.4z',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          class: 'pp-vol-wave',
          d: 'M15.1 9a4.5 4.5 0 0 1 0 6',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          class: 'pp-vol-wave',
          d: 'M18.1 6.5a8 8 0 0 1 0 11',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          class: 'pp-vol-mute',
          d: 'M15.8 9.6l4.8 4.8',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          class: 'pp-vol-mute',
          d: 'M20.6 9.6l-4.8 4.8',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      return svg;
    }

    function buildHudCloseSvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M7.2 7.2l9.6 9.6',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M16.8 7.2l-9.6 9.6',
          stroke: 'currentColor',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      return svg;
    }

    function buildStageModeIconSvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      var pathNode = mkSvg(doc, 'path', {
        d: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
        stroke: 'currentColor',
        'stroke-width': '1.6',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      });
      svg.appendChild(pathNode);
      return { svg: svg, path: pathNode };
    }

    function computePentagonPoint(cx, cy, radius, idx) {
      var ang = -Math.PI * 0.5 + (idx * Math.PI * 2) / 5;
      return {
        x: cx + Math.cos(ang) * radius,
        y: cy + Math.sin(ang) * radius,
      };
    }

    function buildPentagonPointsAttr(cx, cy, radius, ratios) {
      var pts = [];
      for (var i = 0; i < 5; i += 1) {
        var rScale = Array.isArray(ratios) ? Math.max(0.15, Math.min(1, Number(ratios[i]) || 0.5)) : 1;
        var pt = computePentagonPoint(cx, cy, radius * rScale, i);
        pts.push(pt.x.toFixed(1) + ',' + pt.y.toFixed(1));
      }
      return pts.join(' ');
    }

    function buildPentagonPathAttr(cx, cy, radius) {
      var segs = [];
      for (var i = 0; i < 5; i += 1) {
        var pt = computePentagonPoint(cx, cy, radius, i);
        segs.push((i === 0 ? 'M' : 'L') + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1));
      }
      return segs.join(' ') + ' Z';
    }

    function buildCardFlipIconSvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M17 4l3 3-3 3M20 7H9a5 5 0 0 0-5 5M7 20l-3-3 3-3M4 17h11a5 5 0 0 0 5-5',
          stroke: 'currentColor',
          'stroke-width': '1.65',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        })
      );
      return svg;
    }

    function buildFiveAxisRadarSvg(doc) {
      var cx = 66;
      var cy = 68;
      var maxR = 40;
      var svg = mkSvg(doc, 'svg', {
        class: 'pp-radar-svg',
        viewBox: '0 0 132 132',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });

      /* Outer 100%, 75% & 50% reference pentagon rings (<path> so <polygon> stays strictly reserved for data envelopes) */
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: buildPentagonPathAttr(cx, cy, maxR),
          stroke: 'currentColor',
          'stroke-opacity': '0.24',
          'stroke-width': '1.05',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: buildPentagonPathAttr(cx, cy, maxR * 0.75),
          stroke: 'currentColor',
          'stroke-opacity': '0.14',
          'stroke-width': '0.9',
          'stroke-dasharray': '2.4 2.2',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: buildPentagonPathAttr(cx, cy, maxR * 0.50),
          stroke: 'currentColor',
          'stroke-opacity': '0.12',
          'stroke-width': '0.85',
          'stroke-dasharray': '2 2.4',
        })
      );
      var vertexLabels = [];
      for (var s = 0; s < 5; s += 1) {
        var tip = computePentagonPoint(cx, cy, maxR, s);
        svg.appendChild(
          mkSvg(doc, 'line', {
            x1: String(cx),
            y1: String(cy),
            x2: tip.x.toFixed(1),
            y2: tip.y.toFixed(1),
            stroke: 'currentColor',
            'stroke-opacity': '0.14',
            'stroke-width': '0.9',
          })
        );
        var lPt = computePentagonPoint(cx, cy, maxR + 13.5, s);
        var anchor = s === 0 ? 'middle' : s === 1 || s === 2 ? 'start' : 'end';
        var lx = lPt.x + (s === 1 ? -4 : s === 4 ? 4 : s === 2 ? -5 : s === 3 ? 5 : 0);
        var ly = lPt.y + (s === 0 ? -1.5 : s === 2 || s === 3 ? 3.5 : 2.5);
        var vLbl = mkSvg(doc, 'text', {
          class: 'pp-radar-vtx-lbl',
          x: lx.toFixed(1),
          y: ly.toFixed(1),
          'text-anchor': anchor,
        });
        vLbl.textContent = RADAR_AXES[s].vertexZh;
        svg.appendChild(vLbl);
        vertexLabels.push(vLbl);
      }

      var rDefs = mkSvg(doc, 'defs');
      var rFillGrad = mkSvg(doc, 'linearGradient', {
        id: 'pp-radar-fill-grad',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
      });
      var rFillStop0 = mkSvg(doc, 'stop', { offset: '0%', 'stop-color': '#3B82F6', 'stop-opacity': '0.32' });
      var rFillStop1 = mkSvg(doc, 'stop', { offset: '100%', 'stop-color': '#67E8F9', 'stop-opacity': '0.18' });
      rFillGrad.appendChild(rFillStop0);
      rFillGrad.appendChild(rFillStop1);
      var rStrokeGrad = mkSvg(doc, 'linearGradient', {
        id: 'pp-radar-stroke-grad',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
      });
      var rStrokeStop0 = mkSvg(doc, 'stop', { offset: '0%', 'stop-color': '#3B82F6' });
      var rStrokeStop1 = mkSvg(doc, 'stop', { offset: '100%', 'stop-color': '#67E8F9' });
      rStrokeGrad.appendChild(rStrokeStop0);
      rStrokeGrad.appendChild(rStrokeStop1);
      rDefs.appendChild(rFillGrad);
      rDefs.appendChild(rStrokeGrad);
      svg.appendChild(rDefs);

      /* Secondary dashed polygon for 1H Hydrogen runner core when Orchestrator is latched */
      var runnerPoly = mkSvg(doc, 'polygon', {
        class: 'pp-radar-poly-runner',
        'data-radar-role': 'runner-1h',
        points: buildPentagonPointsAttr(cx, cy, maxR, [0.51, 0.54, 0.54, 0.74, 0.42]),
        fill: 'rgba(56, 189, 248, 0.12)',
        stroke: '#38BDF8',
        'stroke-width': '1.35',
        'stroke-dasharray': '3.2 2.2',
        'stroke-linejoin': 'round',
      });

      /* Live hover comparison dashed polygon (displays committed baseline while hovering another model) */
      var comparePoly = mkSvg(doc, 'polygon', {
        class: 'pp-radar-poly-cmp',
        'data-radar-role': 'compare',
        points: buildPentagonPointsAttr(cx, cy, maxR, [0.60, 0.65, 0.69, 0.84, 0.17]),
        fill: 'rgba(148, 163, 184, 0.08)',
        stroke: '#94A3B8',
        'stroke-width': '1.25',
        'stroke-dasharray': '2.8 2.2',
        'stroke-linejoin': 'round',
      });

      var dataPoly = mkSvg(doc, 'polygon', {
        class: 'pp-radar-poly',
        'data-radar-role': 'primary',
        points: buildPentagonPointsAttr(cx, cy, maxR, [0.60, 0.65, 0.69, 0.84, 0.17]),
        fill: 'url(#pp-radar-fill-grad)',
        stroke: 'url(#pp-radar-stroke-grad)',
        'stroke-width': '1.7',
        'stroke-linejoin': 'round',
      });
      svg.appendChild(dataPoly);

      var dots = [];
      for (var d = 0; d < 5; d += 1) {
        var dp = computePentagonPoint(cx, cy, maxR * 0.65, d);
        var dot = mkSvg(doc, 'circle', {
          cx: dp.x.toFixed(1),
          cy: dp.y.toFixed(1),
          r: '2.1',
          fill: '#3B82F6',
        });
        svg.appendChild(dot);
        dots.push(dot);
      }

      return {
        svg: svg,
        poly: dataPoly,
        fillStop0: rFillStop0,
        fillStop1: rFillStop1,
        strokeStop0: rStrokeStop0,
        strokeStop1: rStrokeStop1,
        runnerPoly: runnerPoly,
        runnerMounted: false,
        comparePoly: comparePoly,
        compareMounted: false,
        vertexLabels: vertexLabels,
        dots: dots,
        cx: cx,
        cy: cy,
        maxR: maxR,
      };
    }

    function updateFiveAxisRadarSvg(radarRefs, scores, accentHex, secondaryHex, glowRgba, runnerScores, compareScores, zh, isLight) {
      if (!radarRefs || !radarRefs.poly) return;
      var arr = Array.isArray(scores) && scores.length >= 5 ? scores : [0.6, 0.6, 0.6, 0.6, 0.3];
      var strokeHex = accentHex || (isLight ? '#1D4ED8' : '#3B82F6');
      var secHex = secondaryHex || strokeHex;
      radarRefs.poly.setAttribute('points', buildPentagonPointsAttr(radarRefs.cx, radarRefs.cy, radarRefs.maxR, arr));
      if (radarRefs.fillStop0 && radarRefs.fillStop1 && radarRefs.strokeStop0 && radarRefs.strokeStop1) {
        radarRefs.fillStop0.setAttribute('stop-color', strokeHex);
        radarRefs.fillStop0.setAttribute('stop-opacity', isLight ? '0.24' : '0.34');
        radarRefs.fillStop1.setAttribute('stop-color', secHex);
        radarRefs.fillStop1.setAttribute('stop-opacity', isLight ? '0.14' : '0.20');
        radarRefs.strokeStop0.setAttribute('stop-color', strokeHex);
        radarRefs.strokeStop1.setAttribute('stop-color', secHex);
        radarRefs.poly.setAttribute('stroke', 'url(#pp-radar-stroke-grad)');
        radarRefs.poly.setAttribute('fill', 'url(#pp-radar-fill-grad)');
      } else {
        radarRefs.poly.setAttribute('stroke', strokeHex);
        radarRefs.poly.setAttribute('fill', glowRgba || 'rgba(59, 130, 246, 0.24)');
      }

      if (Array.isArray(radarRefs.vertexLabels)) {
        for (var vi = 0; vi < radarRefs.vertexLabels.length && vi < RADAR_AXES.length; vi += 1) {
          radarRefs.vertexLabels[vi].textContent = zh ? RADAR_AXES[vi].vertexZh : RADAR_AXES[vi].vertexEn;
        }
      }

      var wantRunner = Array.isArray(runnerScores) && runnerScores.length >= 5;
      if (wantRunner && radarRefs.runnerPoly) {
        radarRefs.runnerPoly.setAttribute(
          'points',
          buildPentagonPointsAttr(radarRefs.cx, radarRefs.cy, radarRefs.maxR, runnerScores)
        );
        radarRefs.runnerPoly.setAttribute('stroke', isLight ? '#0284C7' : '#38BDF8');
        radarRefs.runnerPoly.setAttribute('fill', isLight ? 'rgba(2, 132, 199, 0.10)' : 'rgba(56, 189, 248, 0.12)');
        if (!radarRefs.runnerMounted) {
          if (typeof radarRefs.svg.insertBefore === 'function') {
            radarRefs.svg.insertBefore(radarRefs.runnerPoly, radarRefs.poly);
          } else {
            radarRefs.svg.appendChild(radarRefs.runnerPoly);
          }
          radarRefs.runnerMounted = true;
        }
      } else if (!wantRunner && radarRefs.runnerMounted && radarRefs.runnerPoly) {
        safeRemove(radarRefs.runnerPoly);
        radarRefs.runnerMounted = false;
      }

      var wantCompare = !wantRunner && Array.isArray(compareScores) && compareScores.length >= 5;
      if (wantCompare && radarRefs.comparePoly) {
        radarRefs.comparePoly.setAttribute(
          'points',
          buildPentagonPointsAttr(radarRefs.cx, radarRefs.cy, radarRefs.maxR, compareScores)
        );
        radarRefs.comparePoly.setAttribute('stroke', isLight ? '#64748B' : '#CBD5E1');
        radarRefs.comparePoly.setAttribute('fill', isLight ? 'rgba(100, 116, 139, 0.08)' : 'rgba(203, 213, 225, 0.09)');
        if (!radarRefs.compareMounted) {
          if (typeof radarRefs.svg.insertBefore === 'function') {
            radarRefs.svg.insertBefore(radarRefs.comparePoly, radarRefs.poly);
          } else {
            radarRefs.svg.appendChild(radarRefs.comparePoly);
          }
          radarRefs.compareMounted = true;
        }
      } else if (!wantCompare && radarRefs.compareMounted && radarRefs.comparePoly) {
        safeRemove(radarRefs.comparePoly);
        radarRefs.compareMounted = false;
      }

      for (var i = 0; i < 5; i += 1) {
        var rScale = Math.max(0.15, Math.min(1, Number(arr[i]) || 0.5));
        var pt = computePentagonPoint(radarRefs.cx, radarRefs.cy, radarRefs.maxR * rScale, i);
        var dot = radarRefs.dots[i];
        if (dot) {
          dot.setAttribute('cx', pt.x.toFixed(1));
          dot.setAttribute('cy', pt.y.toFixed(1));
          dot.setAttribute('fill', i >= 2 ? secHex : strokeHex);
        }
      }
    }

    function buildTelemetryPulseSvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        class: 'pp-pulse-svg',
        viewBox: '0 0 180 38',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      var defs = mkSvg(doc, 'defs');
      var grad = mkSvg(doc, 'linearGradient', {
        id: 'pp-pulse-grad',
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
      });
      var stopTop = mkSvg(doc, 'stop', { offset: '0%', 'stop-color': '#3B82F6', 'stop-opacity': '0.28' });
      var stopBot = mkSvg(doc, 'stop', { offset: '100%', 'stop-color': '#67E8F9', 'stop-opacity': '0.0' });
      grad.appendChild(stopTop);
      grad.appendChild(stopBot);
      var lineGrad = mkSvg(doc, 'linearGradient', {
        id: 'pp-pulse-stroke-grad',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%',
      });
      var lStop0 = mkSvg(doc, 'stop', { offset: '0%', 'stop-color': '#3B82F6' });
      var lStop1 = mkSvg(doc, 'stop', { offset: '100%', 'stop-color': '#67E8F9' });
      lineGrad.appendChild(lStop0);
      lineGrad.appendChild(lStop1);
      defs.appendChild(grad);
      defs.appendChild(lineGrad);
      svg.appendChild(defs);

      /* Precision oscilloscope vernier scale ticks along top baseline (mirrors concept renders 1-3) */
      for (var ti = 0; ti <= 32; ti += 1) {
        var tx = 4 + (ti / 32) * 172;
        var isMajor = ti % 8 === 0;
        svg.appendChild(
          mkSvg(doc, 'line', {
            x1: tx.toFixed(1),
            y1: isMajor ? '1.5' : '3.5',
            x2: tx.toFixed(1),
            y2: '6.5',
            stroke: 'currentColor',
            'stroke-opacity': isMajor ? '0.32' : '0.14',
            'stroke-width': isMajor ? '0.9' : '0.7',
          })
        );
      }

      /* Center equilibrium hairline */
      svg.appendChild(
        mkSvg(doc, 'line', {
          x1: '4',
          y1: '22',
          x2: '176',
          y2: '22',
          stroke: 'currentColor',
          'stroke-opacity': '0.12',
          'stroke-width': '0.75',
        })
      );

      var areaPath = mkSvg(doc, 'path', {
        d: 'M4 22 L176 22 Z',
        fill: 'url(#pp-pulse-grad)',
      });
      var linePath = mkSvg(doc, 'path', {
        d: 'M4 22 L176 22',
        stroke: 'url(#pp-pulse-stroke-grad)',
        'stroke-width': '1.4',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      });
      var endDot = mkSvg(doc, 'circle', {
        cx: '176',
        cy: '22',
        r: '2.2',
        fill: '#67E8F9',
      });
      svg.appendChild(areaPath);
      svg.appendChild(linePath);
      svg.appendChild(endDot);
      return { svg: svg, area: areaPath, line: linePath, dot: endDot, stopTop: stopTop, stopBot: stopBot, lStop0: lStop0, lStop1: lStop1 };
    }

    function updateTelemetryPulseSvg(pulseRefs, points, accentHex, secondaryHex) {
      if (!pulseRefs || !pulseRefs.line) return;
      var arr = Array.isArray(points) && points.length >= 2 ? points : [0.22, 0.28, 0.25, 0.34, 0.31, 0.42];
      var x0 = 4;
      var w = 172;
      var yMid = 22.5;
      var samples = 44;
      var mean = 0;
      for (var mi = 0; mi < arr.length; mi += 1) {
        mean += Number(arr[mi]) || 0.35;
      }
      mean /= arr.length;

      /* Precision bipolar ECG / telemetry pulse bursts modulated by live context history */
      var segs = [];
      var lastX = x0;
      var lastY = yMid;
      for (var i = 0; i <= samples; i += 1) {
        var u = i / samples;
        var px = x0 + u * w;
        var hPos = u * (arr.length - 1);
        var idx0 = Math.floor(hPos);
        var idx1 = Math.min(arr.length - 1, idx0 + 1);
        var frac = hPos - idx0;
        var hVal = (Number(arr[idx0]) || 0.35) * (1 - frac) + (Number(arr[idx1]) || 0.35) * frac;
        var edgeFade = Math.sin(u * Math.PI);
        /* 3 coherent hardware telemetry bursts across the horizontal axis */
        var b1 = Math.exp(-Math.pow((u - 0.23) / 0.052, 2)) * Math.sin((u - 0.23) * 96) * 1.18;
        var b2 = Math.exp(-Math.pow((u - 0.51) / 0.064, 2)) * Math.sin((u - 0.51) * 112) * 1.52;
        var b3 = Math.exp(-Math.pow((u - 0.80) / 0.056, 2)) * Math.sin((u - 0.80) * 100) * 1.12;
        var microRipple = Math.sin(u * 52 + mean * 8) * 0.14;
        var ampScale = (0.58 + Math.min(0.62, hVal * 0.78)) * (0.24 + 0.76 * edgeFade);
        var dy = (b1 + b2 + b3 + microRipple) * 12.8 * ampScale;
        var py = Math.max(7.5, Math.min(36.5, yMid - dy - (hVal - mean) * 10));
        segs.push((i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1));
        lastX = px;
        lastY = py;
      }
      var lineD = segs.join(' ');
      var areaD = lineD + ' L' + lastX.toFixed(1) + ' 36 L' + x0.toFixed(1) + ' 36 Z';
      var hex = accentHex || '#3B82F6';
      var sec = secondaryHex || hex;
      pulseRefs.line.setAttribute('d', lineD);
      if (pulseRefs.lStop0 && pulseRefs.lStop1) {
        pulseRefs.lStop0.setAttribute('stop-color', hex);
        pulseRefs.lStop1.setAttribute('stop-color', sec);
        pulseRefs.line.setAttribute('stroke', 'url(#pp-pulse-stroke-grad)');
      } else {
        pulseRefs.line.setAttribute('stroke', hex);
      }
      pulseRefs.area.setAttribute('d', areaD);
      pulseRefs.dot.setAttribute('cx', lastX.toFixed(1));
      pulseRefs.dot.setAttribute('cy', lastY.toFixed(1));
      pulseRefs.dot.setAttribute('fill', sec);
      if (pulseRefs.stopTop) pulseRefs.stopTop.setAttribute('stop-color', hex);
      if (pulseRefs.stopBot) pulseRefs.stopBot.setAttribute('stop-color', sec);
    }

    function buildSoloAcousticsSvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        class: 'pp-acoustics-svg',
        viewBox: '0 0 180 36',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      var barCount = 29;
      var bars = [];
      var mid = (barCount - 1) * 0.5;
      for (var i = 0; i < barCount; i += 1) {
        var dist = Math.abs(i - mid) / mid;
        var env = Math.max(0.14, Math.pow(1 - dist * 0.88, 1.55));
        var h = Math.max(3, env * 28);
        var x = 6 + i * 5.95;
        var y = 18 - h * 0.5;
        var rect = mkSvg(doc, 'rect', {
          x: x.toFixed(1),
          y: y.toFixed(1),
          width: '2.3',
          height: h.toFixed(1),
          rx: '1.15',
          fill: '#3B82F6',
          opacity: (0.28 + env * 0.66).toFixed(2),
        });
        svg.appendChild(rect);
        bars.push(rect);
      }
      return { svg: svg, bars: bars };
    }

    function updateSoloAcousticsSvg(acRefs, accentHex, secondaryHex, energyNorm, seedNum) {
      if (!acRefs || !Array.isArray(acRefs.bars)) return;
      var hex = accentHex || '#3B82F6';
      var sec = secondaryHex || hex;
      var eNorm = Math.max(0.32, Math.min(1.0, Number(energyNorm) || 0.72));
      var seed = Number(seedNum) || 6;
      var count = acRefs.bars.length;
      var mid = (count - 1) * 0.5;
      for (var i = 0; i < count; i += 1) {
        var dist = Math.abs(i - mid) / mid;
        var wave = 0.74 + 0.26 * Math.abs(Math.sin(i * 0.92 + seed * 0.45));
        var env = Math.max(0.12, Math.pow(1 - dist * 0.9, 1.48) * wave * eNorm);
        var h = Math.max(3, env * 30);
        var rect = acRefs.bars[i];
        rect.setAttribute('y', (18 - h * 0.5).toFixed(1));
        rect.setAttribute('height', h.toFixed(1));
        rect.setAttribute('fill', i >= mid ? sec : hex);
        rect.setAttribute('opacity', (0.22 + env * 0.72).toFixed(2));
      }
    }

    function buildDualCoreTopologySvg(doc) {
      var svg = mkSvg(doc, 'svg', {
        class: 'pp-topo-svg',
        viewBox: '0 0 180 26',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      });
      /* Top forward dispatch bus (Planner -> Runner) */
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M38 6 L142 6',
          stroke: 'var(--pp-orch-bus)',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M137 3 L143 6 L137 9',
          stroke: 'var(--pp-orch-bus)',
          'stroke-width': '1.35',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        })
      );
      /* Bottom verification feedback loop (Runner -> Planner) */
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M142 20 L38 20',
          stroke: 'var(--pp-orch-ret)',
          'stroke-width': '1.2',
          'stroke-dasharray': '3 2.5',
          'stroke-linecap': 'round',
        })
      );
      svg.appendChild(
        mkSvg(doc, 'path', {
          d: 'M43 17 L37 20 L43 23',
          stroke: 'var(--pp-orch-ret)',
          'stroke-width': '1.2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        })
      );
      /* Micro center router node */
      svg.appendChild(
        mkSvg(doc, 'circle', {
          cx: '90',
          cy: '13',
          r: '3.2',
          fill: 'var(--pp-orch-node)',
          stroke: 'var(--pp-orch-bus)',
          'stroke-width': '1.2',
        })
      );
      return svg;
    }

    function buildBentoTwinCards(doc, handlers) {
      /* Medium (960-1180px) & Narrow (< 960px) Sleek 38px Precision Top Hardware Bar */
      var compactBar = mkEl(doc, 'div', 'pp-compact-bar');
      compactBar.setAttribute('data-testid', 'pp-compact-summary');

      var compactLeft = mkEl(doc, 'div', 'pp-compact-left');
      compactLeft.setAttribute('role', 'button');
      compactLeft.setAttribute('tabindex', '0');
      /* Medium (960-1180px): understated hardware badge + subtle active model pill (no MOD-01 duplication) */
      var compactHwBadge = mkEl(
        doc,
        'span',
        'pp-compact-hw-badge',
        'PRISM-118 // CNC-6063 · 512K TELEMETRY'
      );
      var compactModelPill = mkEl(doc, 'span', 'pp-compact-model-pill');
      var compactPillDot = mkEl(doc, 'span', 'pp-compact-pill-dot');
      compactPillDot.setAttribute('aria-hidden', 'true');
      var compactPillText = mkEl(doc, 'span', '', '6C · High');
      compactModelPill.appendChild(compactPillDot);
      compactModelPill.appendChild(compactPillText);
      /* Narrow (<960px): full summary because MOD-01 is collapsed */
      var compactDot = mkEl(doc, 'span', 'pp-family-dot pp-narrow-only');
      var compactTitle = mkEl(doc, 'span', 'pp-compact-title pp-narrow-only', 'Gemini 4 Carbon');
      var compactMetrics = mkEl(doc, 'span', 'pp-compact-metrics pp-narrow-only', 'AA 60 · Term 65.2%');
      var compactToggleLbl = mkEl(doc, 'span', 'pp-compact-toggle-lbl pp-narrow-only', '展开面板 ▾');
      compactLeft.appendChild(compactHwBadge);
      compactLeft.appendChild(compactModelPill);
      compactLeft.appendChild(compactDot);
      compactLeft.appendChild(compactTitle);
      compactLeft.appendChild(compactMetrics);
      compactLeft.appendChild(compactToggleLbl);

      var compactRight = mkEl(doc, 'div', 'pp-compact-right');
      var compactTeleWrap = mkEl(doc, 'div', 'pp-compact-tele-wrap');
      var compact512k = mkEl(doc, 'span', 'pp-compact-512k', '105K / 512K');
      var compact512kBar = mkEl(doc, 'div', 'pp-compact-tele-bar');
      var compact512kFill = mkEl(doc, 'div', 'pp-compact-tele-fill');
      setStyleVar(compact512kFill, 'width', '21%');
      compact512kBar.appendChild(compact512kFill);
      compactTeleWrap.appendChild(compact512k);
      compactTeleWrap.appendChild(compact512kBar);
      var compactCtrls = mkEl(doc, 'div', 'pp-compact-ctrls');

      var compactStageBtn = mkEl(doc, 'button', 'pp-machined-btn');
      compactStageBtn.type = 'button';
      var compactModeIcon = buildStageModeIconSvg(doc);
      compactStageBtn.appendChild(compactModeIcon.svg);
      compactStageBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleStageMode === 'function') {
          handlers.onToggleStageMode();
        }
      });

      var compactMuteBtn = mkEl(doc, 'button', 'pp-machined-btn');
      compactMuteBtn.type = 'button';
      compactMuteBtn.setAttribute('data-muted', '0');
      compactMuteBtn.appendChild(buildHudMuteSvg(doc));
      compactMuteBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleMute === 'function') {
          handlers.onToggleMute();
        }
      });

      var compactCloseBtn = mkEl(doc, 'button', 'pp-machined-btn');
      compactCloseBtn.type = 'button';
      compactCloseBtn.appendChild(buildHudCloseSvg(doc));
      compactCloseBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onConfirmClose === 'function') {
          handlers.onConfirmClose();
        }
      });

      compactCtrls.appendChild(compactStageBtn);
      compactCtrls.appendChild(compactMuteBtn);
      compactCtrls.appendChild(compactCloseBtn);
      compactRight.appendChild(compactTeleWrap);
      compactRight.appendChild(compactCtrls);

      compactBar.appendChild(compactLeft);
      compactBar.appendChild(compactRight);
      compactBar.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
      });
      compactLeft.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleCompactExpand === 'function') {
          handlers.onToggleCompactExpand();
        }
      });
      compactBar.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (ev.target === compactBar && handlers && typeof handlers.onToggleCompactExpand === 'function') {
          handlers.onToggleCompactExpand();
        }
      });

      /* Left Wing: MOD-01 // SPEC CNC Hardware Module (.pp-bento-grid) */
      var grid = mkEl(doc, 'div', 'pp-bento-grid');
      grid.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
      });
      grid.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });

      var flipInner = mkEl(doc, 'div', 'pp-flip-inner');
      var specCard = mkEl(doc, 'section', 'pp-bento-card pp-spec-card');
      specCard.setAttribute('data-testid', 'pp-bento-spec-card');

      /* CNC Laser-Etched Header + Compact Popover Flip Button */
      var specHeader = mkEl(doc, 'div', 'pp-cnc-header');
      var specEngrave = mkEl(doc, 'span', 'pp-cnc-label', 'MOD-01 // SPEC');
      var cardFlipBtn = mkEl(doc, 'button', 'pp-card-flip-btn');
      cardFlipBtn.type = 'button';
      cardFlipBtn.setAttribute('data-testid', 'pp-card-flip-btn');
      cardFlipBtn.setAttribute('aria-pressed', 'false');
      cardFlipBtn.appendChild(buildCardFlipIconSvg(doc));
      var cardFlipLabel = mkEl(doc, 'span', '', '512K');
      cardFlipBtn.appendChild(cardFlipLabel);
      cardFlipBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleCardFlip === 'function') {
          handlers.onToggleCardFlip();
        }
      });
      specHeader.appendChild(specEngrave);
      specHeader.appendChild(cardFlipBtn);

      var specBody = mkEl(doc, 'div', 'pp-spec-body');

      /* Tier 1: Model Identity + 3 Understated Etched Micro-Tags */
      var specMain = mkEl(doc, 'div', 'pp-recess-screen pp-spec-main');
      var kickerRow = mkEl(doc, 'div', 'pp-spec-kicker-row');
      var famBadge = mkEl(doc, 'span', 'pp-family-badge');
      var famDot = mkEl(doc, 'span', 'pp-family-dot');
      famDot.setAttribute('aria-hidden', 'true');
      var famText = mkEl(doc, 'span', '', '6 C · DIAMOND');
      famBadge.appendChild(famDot);
      famBadge.appendChild(famText);
      var stateTag = mkEl(doc, 'span', 'pp-state-tag pp-bento-foldable', 'ACTIVE');
      kickerRow.appendChild(famBadge);
      kickerRow.appendChild(stateTag);

      var titleEl = mkEl(doc, 'h2', 'pp-spec-title', 'Gemini 4 Carbon');
      var microTagsEl = mkEl(doc, 'div', 'pp-micro-tags');
      var microTagNodes = [];
      for (var ti = 0; ti < 3; ti += 1) {
        var tagSpan = mkEl(doc, 'span', 'pp-micro-tag', '');
        microTagsEl.appendChild(tagSpan);
        microTagNodes.push(tagSpan);
      }
      var taglineEl = mkEl(doc, 'p', 'pp-spec-tagline pp-bento-foldable', '');

      specMain.appendChild(kickerRow);
      specMain.appendChild(titleEl);
      specMain.appendChild(microTagsEl);
      specMain.appendChild(taglineEl);

      /* Tier 2: Enlarged Pentagon Radar + 5 Bold 2026Q4 Benchmark Rows + Scale Ticks */
      var radarPane = mkEl(doc, 'div', 'pp-recess-screen pp-radar-pane pp-bento-foldable');
      var radarCol = mkEl(doc, 'div', 'pp-radar-col');
      var radarSvgRefs = buildFiveAxisRadarSvg(doc);
      var radarLegend = mkEl(doc, 'div', 'pp-radar-legend');
      radarLegend.setAttribute('data-show', '0');
      var legPri = mkEl(doc, 'span', 'pp-radar-leg-item');
      legPri.appendChild(mkEl(doc, 'span', 'pp-radar-leg-swatch'));
      var legPriText = mkEl(doc, 'span', '', '6C');
      legPri.appendChild(legPriText);
      var legSec = mkEl(doc, 'span', 'pp-radar-leg-item');
      legSec.appendChild(mkEl(doc, 'span', 'pp-radar-leg-swatch is-dashed'));
      var legSecText = mkEl(doc, 'span', '', '1H');
      legSec.appendChild(legSecText);
      radarLegend.appendChild(legPri);
      radarLegend.appendChild(legSec);
      radarCol.appendChild(radarSvgRefs.svg);
      radarCol.appendChild(radarLegend);

      var radarBarsWrap = mkEl(doc, 'div', 'pp-radar-bars');
      var barRefs = [];
      for (var bi = 0; bi < RADAR_AXES.length; bi += 1) {
        var rRow = mkEl(doc, 'div', 'pp-radar-row');
        var rLbl = mkEl(doc, 'span', 'pp-radar-lbl', RADAR_AXES[bi].zh);
        var rTrack = mkEl(doc, 'div', 'pp-radar-track');
        var rFill = mkEl(doc, 'div', 'pp-radar-fill');
        setStyleVar(rFill, 'width', '65%');
        rTrack.appendChild(rFill);
        var rValWrap = mkEl(doc, 'span', 'pp-radar-val-wrap');
        var rVal = mkEl(doc, 'span', 'pp-radar-val', '60');
        var rDelta = mkEl(doc, 'span', 'pp-delta-tag', '');
        rValWrap.appendChild(rVal);
        rValWrap.appendChild(rDelta);
        rRow.appendChild(rLbl);
        rRow.appendChild(rTrack);
        rRow.appendChild(rValWrap);
        radarBarsWrap.appendChild(rRow);
        barRefs.push({ lbl: rLbl, fill: rFill, val: rVal, delta: rDelta });
      }
      var scaleRow = mkEl(doc, 'div', 'pp-radar-scale-row');
      scaleRow.appendChild(mkEl(doc, 'span', '', ''));
      var scaleTicks = mkEl(doc, 'div', 'pp-radar-scale-ticks');
      var t0 = mkEl(doc, 'span', '', '0');
      t0.setAttribute('data-tick', '0');
      var t50 = mkEl(doc, 'span', '', '50%');
      t50.setAttribute('data-tick', '50');
      var t75 = mkEl(doc, 'span', '', '75%');
      t75.setAttribute('data-tick', '75');
      var t100 = mkEl(doc, 'span', '', '100');
      t100.setAttribute('data-tick', '100');
      scaleTicks.appendChild(t0);
      scaleTicks.appendChild(t50);
      scaleTicks.appendChild(t75);
      scaleTicks.appendChild(t100);
      scaleRow.appendChild(scaleTicks);
      scaleRow.appendChild(mkEl(doc, 'span', '', ''));
      radarBarsWrap.appendChild(scaleRow);

      radarPane.appendChild(radarCol);
      radarPane.appendChild(radarBarsWrap);

      /* Tier 3: Compact Segmented Mechanical Effort Tray + Authoritative Source + Hover Tooltip */
      var effortStrip = mkEl(doc, 'div', 'pp-effort-strip');
      var effortTopRow = mkEl(doc, 'div', 'pp-effort-row-top');
      var effortCapsuleGroup = mkEl(doc, 'div', 'pp-bento-efforts');
      var effortNoteEl = mkEl(doc, 'span', 'pp-bento-eff-note pp-bento-foldable', '');
      effortTopRow.appendChild(effortCapsuleGroup);
      effortTopRow.appendChild(effortNoteEl);

      var sourceRow = mkEl(doc, 'div', 'pp-source-row pp-bento-foldable');
      var sourceCiteEl = mkEl(doc, 'div', 'pp-bench-source', BENCHMARK_SOURCE_CITATION);
      var infoBtn = mkEl(doc, 'button', 'pp-info-trigger', 'i');
      infoBtn.type = 'button';
      infoBtn.setAttribute('aria-label', 'Benchmark metrics and thinking tiers explanation');
      var benchTooltip = mkEl(doc, 'div', 'pp-bench-tooltip');
      benchTooltip.setAttribute('role', 'tooltip');
      var ttHead = mkEl(doc, 'div', 'pp-tt-head', '2026Q4 评测口径与思考档位说明');
      var ttLines = [];
      for (var tli = 0; tli < 5; tli += 1) {
        var lineNode = mkEl(doc, 'div', 'pp-tt-line', '');
        benchTooltip.appendChild(lineNode);
        ttLines.push(lineNode);
      }
      benchTooltip.insertBefore(ttHead, ttLines[0]);
      sourceRow.appendChild(sourceCiteEl);
      sourceRow.appendChild(infoBtn);
      sourceRow.appendChild(benchTooltip);

      effortStrip.appendChild(effortTopRow);
      effortStrip.appendChild(sourceRow);

      specBody.appendChild(specMain);
      specBody.appendChild(radarPane);
      specCard.appendChild(specHeader);
      specCard.appendChild(specBody);
      specCard.appendChild(effortStrip);
      flipInner.appendChild(specCard);
      grid.appendChild(flipInner);

      /* Right Wing: MOD-02 // TELEMETRY CNC Hardware Module (.pp-right-wing) */
      var rightWing = mkEl(doc, 'div', 'pp-right-wing');
      rightWing.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
      });
      rightWing.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });

      var telePod = mkEl(doc, 'section', 'pp-bento-card pp-telemetry-pod');
      telePod.setAttribute('data-testid', 'pp-bento-telemetry-pod');

      var teleHeader = mkEl(doc, 'div', 'pp-cnc-header');
      var teleKicker = mkEl(doc, 'span', 'pp-cnc-label', 'MOD-02 // TELEMETRY');
      var cardFlipBackBtn = mkEl(doc, 'button', 'pp-card-flip-btn pp-card-flip-back-btn');
      cardFlipBackBtn.type = 'button';
      cardFlipBackBtn.setAttribute('data-testid', 'pp-card-flip-back-btn');
      cardFlipBackBtn.setAttribute('aria-pressed', 'true');
      cardFlipBackBtn.appendChild(buildCardFlipIconSvg(doc));
      var cardFlipBackLabel = mkEl(doc, 'span', '', 'Spec');
      cardFlipBackBtn.appendChild(cardFlipBackLabel);
      cardFlipBackBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleCardFlip === 'function') {
          handlers.onToggleCardFlip();
        }
      });
      teleHeader.appendChild(teleKicker);
      teleHeader.appendChild(cardFlipBackBtn);

      /* 3 Integrated Machined Circular Aluminum Micro-Buttons ([F], [Mute], [Close]) */
      var machinedCtrls = mkEl(doc, 'div', 'pp-machined-ctrls');
      var stageWell = mkEl(doc, 'div', 'pp-machined-well');
      var stageModeBtn = mkEl(doc, 'button', 'pp-machined-btn pp-stage-mode-btn');
      stageModeBtn.type = 'button';
      stageModeBtn.setAttribute('data-testid', 'pp-stage-mode-btn');
      stageModeBtn.setAttribute('data-pp-action', 'toggle-stage-mode');
      var modeIconRefs = buildStageModeIconSvg(doc);
      var modeLabelSpan = mkEl(doc, 'span', 'pp-stage-btn-lbl', '全屏展台');
      var modeKeyTag = mkEl(doc, 'span', 'pp-stage-key-tag', 'F');
      stageModeBtn.appendChild(modeIconRefs.svg);
      stageModeBtn.appendChild(modeKeyTag);
      stageModeBtn.appendChild(modeLabelSpan);
      stageModeBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleStageMode === 'function') {
          handlers.onToggleStageMode();
        }
      });
      stageWell.appendChild(stageModeBtn);

      var muteWell = mkEl(doc, 'div', 'pp-machined-well');
      var quickMuteBtn = mkEl(doc, 'button', 'pp-machined-btn');
      quickMuteBtn.type = 'button';
      quickMuteBtn.setAttribute('data-muted', '0');
      quickMuteBtn.appendChild(buildHudMuteSvg(doc));
      quickMuteBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onToggleMute === 'function') {
          handlers.onToggleMute();
        }
      });
      muteWell.appendChild(quickMuteBtn);

      var closeWell = mkEl(doc, 'div', 'pp-machined-well');
      var quickCloseBtn = mkEl(doc, 'button', 'pp-machined-btn');
      quickCloseBtn.type = 'button';
      quickCloseBtn.appendChild(buildHudCloseSvg(doc));
      quickCloseBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (handlers && typeof handlers.onConfirmClose === 'function') {
          handlers.onConfirmClose();
        }
      });
      closeWell.appendChild(quickCloseBtn);

      machinedCtrls.appendChild(stageWell);
      machinedCtrls.appendChild(muteWell);
      machinedCtrls.appendChild(closeWell);

      /* Middle Recessed Screen: Permanent 512K Context Liquid-Crystal Meter */
      var teleScreen = mkEl(doc, 'div', 'pp-recess-screen pp-tele-screen');
      var teleTopRow = mkEl(doc, 'div', 'pp-tele-top-row');
      var teleHero512k = mkEl(doc, 'span', 'pp-tele-hero-512k', '512K');
      var teleHealth = mkEl(doc, 'span', 'pp-tele-health pp-bento-foldable', 'OPTIMAL');
      teleHealth.setAttribute('data-level', 'ok');
      teleTopRow.appendChild(teleHero512k);
      teleTopRow.appendChild(teleHealth);

      var teleSubRow = mkEl(doc, 'div', 'pp-tele-sub-row');
      var bigNumEl = mkEl(doc, 'span', 'pp-tele-big-num', '105K / 512K');
      var capLblEl = mkEl(doc, 'span', 'pp-tele-cap-lbl pp-bento-foldable', '20.5%');
      teleSubRow.appendChild(bigNumEl);
      teleSubRow.appendChild(capLblEl);

      var crystalBar = mkEl(doc, 'div', 'pp-crystal-bar');
      var crystalFill = mkEl(doc, 'div', 'pp-crystal-fill');
      setStyleVar(crystalFill, 'width', '20.5%');
      crystalBar.appendChild(crystalFill);

      var ticksRow = mkEl(doc, 'div', 'pp-tele-ticks pp-bento-foldable');
      ticksRow.appendChild(mkEl(doc, 'span', '', '0'));
      ticksRow.appendChild(mkEl(doc, 'span', '', '128K'));
      ticksRow.appendChild(mkEl(doc, 'span', '', '384K'));
      ticksRow.appendChild(mkEl(doc, 'span', '', '512K'));

      var pulseSvgRefs = buildTelemetryPulseSvg(doc);

      var teleMetrics = mkEl(doc, 'div', 'pp-tele-metrics pp-bento-foldable');
      var cacheKv = mkEl(doc, 'span', 'pp-tele-kv');
      var cacheLbl = mkEl(doc, 'span', '', 'KV Cache ');
      var cacheVal = mkEl(doc, 'strong', '', '97%');
      cacheKv.appendChild(cacheLbl);
      cacheKv.appendChild(cacheVal);

      var freeKv = mkEl(doc, 'span', 'pp-tele-kv');
      var freeLbl = mkEl(doc, 'span', '', '余量 ');
      var freeVal = mkEl(doc, 'strong', '', '407K');
      freeKv.appendChild(freeLbl);
      freeKv.appendChild(freeVal);
      teleMetrics.appendChild(cacheKv);
      teleMetrics.appendChild(freeKv);

      teleScreen.appendChild(teleTopRow);
      teleScreen.appendChild(teleSubRow);
      teleScreen.appendChild(crystalBar);
      teleScreen.appendChild(ticksRow);
      teleScreen.appendChild(pulseSvgRefs.svg);
      teleScreen.appendChild(teleMetrics);

      /* Bottom Dynamic Sub-Screen: Solo Prism Switch & Acoustics vs Orch Dual-Core Routing Topology */
      var teleSubScreen = mkEl(doc, 'div', 'pp-recess-screen pp-tele-subscreen');

      var soloView = mkEl(doc, 'div', 'pp-solo-view');
      var soloSwitchTitle = mkEl(doc, 'div', 'pp-sub-title', 'High · 0.88U Diamond Prism');
      var soloAcousticsRefs = buildSoloAcousticsSvg(doc);
      var pinholeRow = mkEl(doc, 'div', 'pp-pinhole-row');
      var pinholeDots = [];
      for (var pd = 0; pd < 4; pd += 1) {
        var pDot = mkEl(doc, 'span', 'pp-pinhole-dot');
        pDot.setAttribute('data-lit', pd < 3 ? '1' : '0');
        pinholeRow.appendChild(pDot);
        pinholeDots.push(pDot);
      }
      soloView.appendChild(soloSwitchTitle);
      soloView.appendChild(soloAcousticsRefs.svg);
      soloView.appendChild(pinholeRow);

      var orchView = mkEl(doc, 'div', 'pp-orch-view');
      orchView.setAttribute('data-testid', 'pp-dualcore-topology');
      var orchTopoTitle = mkEl(doc, 'div', 'pp-sub-title', 'Dual-Core Routing Topology');
      var topoNodes = mkEl(doc, 'div', 'pp-topo-nodes');
      var plannerBox = mkEl(doc, 'div', 'pp-topo-box');
      var plannerRoleEl = mkEl(doc, 'span', 'pp-topo-role', '规划核');
      var plannerValEl = mkEl(doc, 'span', 'pp-topo-val', '6C High');
      plannerBox.appendChild(plannerRoleEl);
      plannerBox.appendChild(plannerValEl);
      var topoArrow = mkEl(doc, 'span', 'pp-topo-arrow', '→');
      var runnerBox = mkEl(doc, 'div', 'pp-topo-box is-runner');
      var runnerRoleEl = mkEl(doc, 'span', 'pp-topo-role', '执行核');
      var runnerValEl = mkEl(doc, 'span', 'pp-topo-val', '1H High');
      runnerBox.appendChild(runnerRoleEl);
      runnerBox.appendChild(runnerValEl);
      topoNodes.appendChild(plannerBox);
      topoNodes.appendChild(topoArrow);
      topoNodes.appendChild(runnerBox);
      var dualCoreTopoSvg = buildDualCoreTopologySvg(doc);
      orchView.appendChild(orchTopoTitle);
      orchView.appendChild(topoNodes);
      orchView.appendChild(dualCoreTopoSvg);

      teleSubScreen.appendChild(soloView);
      teleSubScreen.appendChild(orchView);

      telePod.appendChild(teleHeader);
      telePod.appendChild(machinedCtrls);
      telePod.appendChild(teleScreen);
      telePod.appendChild(teleSubScreen);
      rightWing.appendChild(telePod);

      return {
        compactBar: compactBar,
        compactHwBadge: compactHwBadge,
        compactPillText: compactPillText,
        compactTitle: compactTitle,
        compactMetrics: compactMetrics,
        compactToggleLbl: compactToggleLbl,
        compact512k: compact512k,
        compact512kFill: compact512kFill,
        compactStageBtn: compactStageBtn,
        compactModeIcon: compactModeIcon,
        compactMuteBtn: compactMuteBtn,
        compactCloseBtn: compactCloseBtn,
        grid: grid,
        rightWing: rightWing,
        flipInner: flipInner,
        cardFlipBtn: cardFlipBtn,
        cardFlipLabel: cardFlipLabel,
        cardFlipBackBtn: cardFlipBackBtn,
        cardFlipBackLabel: cardFlipBackLabel,
        specCard: specCard,
        telePod: telePod,
        ctrlCapsule: machinedCtrls,
        famText: famText,
        stateTag: stateTag,
        titleEl: titleEl,
        microTagNodes: microTagNodes,
        taglineEl: taglineEl,
        radarSvgRefs: radarSvgRefs,
        radarLegend: radarLegend,
        legPriText: legPriText,
        legSecText: legSecText,
        barRefs: barRefs,
        effortCapsuleGroup: effortCapsuleGroup,
        lastBentoEffSig: '',
        effortNoteEl: effortNoteEl,
        sourceCiteEl: sourceCiteEl,
        ttHead: ttHead,
        ttLines: ttLines,
        teleKicker: teleKicker,
        teleHealth: teleHealth,
        stageModeBtn: stageModeBtn,
        modeIconRefs: modeIconRefs,
        modeLabelSpan: modeLabelSpan,
        quickMuteBtn: quickMuteBtn,
        quickCloseBtn: quickCloseBtn,
        bigNumEl: bigNumEl,
        capLblEl: capLblEl,
        crystalFill: crystalFill,
        cacheLbl: cacheLbl,
        cacheVal: cacheVal,
        freeLbl: freeLbl,
        freeVal: freeVal,
        pulseSvgRefs: pulseSvgRefs,
        soloSwitchTitle: soloSwitchTitle,
        soloAcousticsRefs: soloAcousticsRefs,
        pinholeDots: pinholeDots,
        orchTopoTitle: orchTopoTitle,
        plannerRoleEl: plannerRoleEl,
        plannerValEl: plannerValEl,
        runnerRoleEl: runnerRoleEl,
        runnerValEl: runnerValEl,
      };
    }

    /* Resolve 3D WebGL2 / Canvas2D Renderer Factory from globalThis or CommonJS */
    function resolveKeyboard3DFactory(root) {
      if (root && root.PrismPeriodicKeyboard3D && typeof root.PrismPeriodicKeyboard3D.createKeyboard3DRenderer === 'function') {
        return root.PrismPeriodicKeyboard3D;
      }
      if (
        typeof globalThis === 'object' &&
        globalThis &&
        globalThis.PrismPeriodicKeyboard3D &&
        typeof globalThis.PrismPeriodicKeyboard3D.createKeyboard3DRenderer === 'function'
      ) {
        return globalThis.PrismPeriodicKeyboard3D;
      }
      if (typeof require === 'function') {
        try {
          var mod = require('./keyboard-3d-gl.js');
          if (mod && typeof mod.createKeyboard3DRenderer === 'function') return mod;
        } catch (e) {}
      }
      return null;
    }

    /* Standard Declarative Data Context Resolution (Zero Host Internals) */
    function resolveTargetElement(docRef, targetOrSelector) {
      if (!targetOrSelector) return null;
      if (typeof targetOrSelector === 'object' && targetOrSelector.nodeType === 1) return targetOrSelector;
      if (typeof targetOrSelector === 'string' && docRef && typeof docRef.querySelector === 'function') {
        try { return docRef.querySelector(targetOrSelector); } catch (e) { return null; }
      }
      return null;
    }
    function normalizeModelOptionItem(item) {
      if (!item) return null;
      if (typeof item === 'string') return { label: item, value: item, modelId: item };
      if (typeof item === 'object' && typeof item.label === 'string' && item.label.trim()) return item;
      return null;
    }
    function findMatchingOptionInList(list, query) {
      if (!Array.isArray(list) || !list.length || !query) return null;
      if (typeof query === 'object') {
        for (var i = 0; i < list.length; i += 1) { if (list[i] === query) return list[i]; }
        var qId = query.modelId || query.value || "", qLbl = query.label || "";
        for (var j = 0; j < list.length; j += 1) {
          var c = list[j]; if (!c) continue;
          if (qId && (c.modelId === qId || c.value === qId)) return c;
          if (qLbl && c.label === qLbl) return c;
        }
        return normalizeModelOptionItem(query);
      }
      var qStr = String(query).trim(); if (!qStr) return null;
      for (var k = 0; k < list.length; k += 1) {
        var o = list[k]; if (o && (o.modelId === qStr || o.value === qStr || o.label === qStr)) return o;
      }
      var qLow = qStr.toLowerCase();
      for (var m = 0; m < list.length; m += 1) {
        var o2 = list[m]; if (o2 && ((o2.modelId && o2.modelId.toLowerCase() === qLow) || (o2.label && o2.label.toLowerCase() === qLow))) return o2;
      }
      return null;
    }
    /* Safe DOM helpers (compatible with Browser DOM & minimal Node VM test harnesses) */
    function safeRemove(node) {
      if (!node) return;
      if (typeof node.remove === 'function') {
        node.remove();
      } else if (node.parentNode && typeof node.parentNode.removeChild === 'function') {
        node.parentNode.removeChild(node);
      } else if (node.parentElement && typeof node.parentElement.removeChild === 'function') {
        node.parentElement.removeChild(node);
      }
    }

    function setStyleVar(el, prop, val) {
      if (!el || !el.style) return;
      if (val === null || val === undefined || val === '') {
        if (typeof el.style.removeProperty === 'function') {
          el.style.removeProperty(prop);
        } else {
          delete el.style[prop];
        }
        return;
      }
      if (typeof el.style.setProperty === 'function') {
        el.style.setProperty(prop, String(val));
      } else {
        el.style[prop] = String(val);
      }
    }

    function mkEl(doc, tag, className, text) {
      var el = doc.createElement(tag);
      if (className) el.className = className;
      if (text !== undefined && text !== null) el.textContent = String(text);
      return el;
    }

    function mkSvg(doc, tag, attrs) {
      var el =
        typeof doc.createElementNS === 'function' ? doc.createElementNS(SVG_NS, tag) : doc.createElement(tag);
      if (attrs) {
        var keys = Object.keys(attrs);
        for (var i = 0; i < keys.length; i += 1) {
          el.setAttribute(keys[i], String(attrs[keys[i]]));
        }
      }
      return el;
    }

    function isOwnedDecorationNode(node) {
      if (!node || typeof node !== 'object') return false;
      var cl = node.classList;
      if (cl && typeof cl.contains === 'function') {
        if (cl.contains('prism-model-glyph') || cl.contains('pp-mini-keycap')) return true;
      }
      if (typeof node.getAttribute === 'function') {
        if (node.getAttribute('data-prism-owned') === '1') return true;
      }
      return false;
    }

    /* Extract host button text while strictly ignoring Prism glyph & mini-keycap badges */
    function readCleanButtonLabel(btn, includeAria) {
      if (!btn) return '';
      var parts = [];
      function walk(node) {
        if (!node || isOwnedDecorationNode(node)) return;
        if (node.nodeType === 3) {
          parts.push(node.nodeValue || '');
          return;
        }
        if (node.childNodes && node.childNodes.length > 0) {
          for (var i = 0; i < node.childNodes.length; i += 1) {
            walk(node.childNodes[i]);
          }
          return;
        }
        if (node.children && node.children.length > 0) {
          var nonOwned = 0;
          for (var j = 0; j < node.children.length; j += 1) {
            var ch = node.children[j];
            if (isOwnedDecorationNode(ch)) continue;
            nonOwned += 1;
            walk(ch);
          }
          if (!nonOwned && typeof node._text === 'string' && node._text) {
            parts.push(node._text);
          }
          return;
        }
        if (typeof node._text === 'string') {
          parts.push(node._text);
        } else if (typeof node.textContent === 'string') {
          parts.push(node.textContent);
        }
      }
      walk(btn);
      if (includeAria && typeof btn.getAttribute === 'function') {
        var aria = btn.getAttribute('aria-label') || '';
        if (aria) parts.push(aria);
      }
      return parts.join(' ').replace(/\s+/g, ' ').trim();
    }

    function cleanupResiduals(doc) {
      if (!doc) return;
      try {
        if (doc.documentElement && typeof doc.documentElement.removeAttribute === 'function') {
          doc.documentElement.removeAttribute(ROOT_MARKER_ATTR);
          doc.documentElement.removeAttribute('data-pp-open');
        }
      } catch (e) {}
      try {
        if (typeof doc.getElementById === 'function') {
          safeRemove(doc.getElementById(STYLE_ID));
          safeRemove(doc.getElementById(ROOT_ID));
        }
        if (typeof doc.querySelectorAll === 'function') {
          var leftovers = doc.querySelectorAll(
            '#' + STYLE_ID + ', #' + ROOT_ID + ', .pp-hold-ring, .pp-mini-keycap'
          );
          for (var i = 0; i < leftovers.length; i += 1) {
            safeRemove(leftovers[i]);
          }
        }
      } catch (e) {}
    }

    function isReducedMotion(doc, root) {
      try {
        if (doc && doc.documentElement && doc.documentElement.getAttribute('data-prism-motion') === 'off') {
          return true;
        }
        if (root && typeof root.matchMedia === 'function') {
          return Boolean(root.matchMedia('(prefers-reduced-motion: reduce)').matches);
        }
      } catch (e) {}
      return false;
    }

    function isZhLocale(doc, root) {
      try {
        var de = doc && doc.documentElement;
        var attr = (de && de.getAttribute && (de.getAttribute('data-prism-lang') || de.getAttribute('lang'))) || '';
        if (/^en/i.test(attr)) return false;
        if (/^zh/i.test(attr)) return true;
        var navLang = (root && root.navigator && root.navigator.language) || '';
        if (/^en/i.test(navLang)) return false;
      } catch (e) {}
      return true;
    }

    function readMutedPref(root) {
      try {
        var ls = root && root.localStorage;
        if (ls && typeof ls.getItem === 'function') {
          return ls.getItem(MUTE_STORAGE_KEY) === '1';
        }
      } catch (e) {}
      return false;
    }

    function writeMutedPref(root, muted) {
      try {
        var ls = root && root.localStorage;
        if (ls && typeof ls.setItem === 'function') {
          ls.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0');
        }
      } catch (e) {}
    }

    function elementMatches(el, selector) {
      if (!el) return false;
      if (typeof el.matches === 'function') return el.matches(selector);
      return false;
    }

    function isInsideExcludedZone(el) {
      if (!el || typeof el.closest !== 'function') return false;
      return Boolean(el.closest('#' + ROOT_ID + ', [role="menu"], [role="listbox"], [data-prism-menu]'));
    }
    function isLikelyComposerToolbar(btn) {
      if (!btn || typeof btn.closest !== 'function') return false;
      return Boolean(btn.closest('[data-prism-composer], [role="toolbar"], form, footer'));
    }
    function findFallbackModelTrigger(doc, configuredTrigger) {
      var direct = resolveTargetElement(doc, configuredTrigger);
      if (direct && !isInsideExcludedZone(direct)) return direct;
      if (!doc || typeof doc.querySelector !== 'function') return null;
      var explicit = doc.querySelector('[data-prism-trigger], [data-pp-trigger="1"], [data-testid="prism-model-trigger"]');
      if (explicit && !isInsideExcludedZone(explicit)) return explicit;
      var glyph = doc.querySelector('.prism-model-glyph');
      if (glyph && typeof glyph.closest === 'function') {
        var gBtn = glyph.closest('button, [role="button"]');
        if (gBtn && !isInsideExcludedZone(gBtn)) return gBtn;
      }
      return null;
    }
    function collectVisibleModelTriggerButtons(doc, configuredTrigger) {
      var found = [];
      var pushUnique = function (btn) {
        if (!btn || isInsideExcludedZone(btn)) return;
        if (found.indexOf(btn) === -1) found.push(btn);
      };
      var direct = resolveTargetElement(doc, configuredTrigger);
      if (direct) pushUnique(direct);
      if (!doc || typeof doc.querySelectorAll !== 'function') return found;
      try {
        var triggers = doc.querySelectorAll('[data-prism-trigger], [data-pp-trigger="1"], [data-testid="prism-model-trigger"]');
        for (var i = 0; i < triggers.length; i += 1) pushUnique(triggers[i]);
        var glyphs = doc.querySelectorAll('.prism-model-glyph');
        for (var j = 0; j < glyphs.length; j += 1) {
          var g = glyphs[j];
          if (g && typeof g.closest === 'function') pushUnique(g.closest('button, [role="button"]'));
        }
      } catch (e) {}
      return found;
    }
    /**
     * Mount Periodic Picker instance.
     */
    function mountPeriodicPicker(options) {
      var opts = options && typeof options === 'object' ? options : {};
      var root = opts.root || (typeof window !== 'undefined' ? window : globalThis);
      var doc = opts.doc || (root && root.document) || (typeof document !== 'undefined' ? document : null);
      var initialMode = opts.mode === 'off' ? 'off' : 'on';
      var requestedStageMode =
        opts.initialStageMode === 'fullscreen' || opts.stageMode === 'fullscreen' ? 'fullscreen' : 'drawer';

      var setTimer = (root && typeof root.setTimeout === 'function' ? root.setTimeout.bind(root) : setTimeout);
      var clearTimer = (root && typeof root.clearTimeout === 'function' ? root.clearTimeout.bind(root) : clearTimeout);
      var reqRaf =
        root && typeof root.requestAnimationFrame === 'function'
          ? root.requestAnimationFrame.bind(root)
          : typeof requestAnimationFrame === 'function'
          ? requestAnimationFrame
          : null;
      var cancelRaf =
        root && typeof root.cancelAnimationFrame === 'function'
          ? root.cancelAnimationFrame.bind(root)
          : typeof cancelAnimationFrame === 'function'
          ? cancelAnimationFrame
          : null;

      /* Clean up any pre-existing singleton instance before mounting */
      if (root && root.__prismPeriodicConsoleInstance && typeof root.__prismPeriodicConsoleInstance.destroy === 'function') {
        try {
          root.__prismPeriodicConsoleInstance.destroy();
        } catch (e) {}
      }

      if (initialMode === 'off') {
        cleanupResiduals(doc);
        var offStageMode = requestedStageMode;
        var offController = {
          destroy: function () {
            cleanupResiduals(doc);
          },
          getStatus: function () {
            return { status: 'off', mode: 'off', stageMode: offStageMode, orchLatched: false };
          },
          setMode: function (nextMode) {
            if (nextMode === 'on') {
              var reOpts = {};
              var optKeys = Object.keys(opts);
              for (var ok = 0; ok < optKeys.length; ok += 1) {
                reOpts[optKeys[ok]] = opts[optKeys[ok]];
              }
              reOpts.root = root;
              reOpts.doc = doc;
              reOpts.mode = 'on';
              reOpts.initialStageMode = offStageMode;
              return mountPeriodicPicker(reOpts);
            }
            cleanupResiduals(doc);
            return offController;
          },
          open: function () {
            return false;
          },
          close: function () {},
          toggle: function () {
            return false;
          },
          isOpen: function () {
            return false;
          },
          getStageMode: function () {
            return offStageMode;
          },
          setStageMode: function (m) {
            offStageMode = m === 'fullscreen' ? 'fullscreen' : 'drawer';
            return offStageMode;
          },
          toggleStageMode: function () {
            offStageMode = offStageMode === 'drawer' ? 'fullscreen' : 'drawer';
            return offStageMode;
          },
          toggleCardFlip: function () {
            return false;
          },
          setTheme: function () {
            return null;
          },
          setLocale: function () {},
          setTelemetry: function () {},
          selectModel: function () {
            return false;
          },
          toggleOrchestrator: function () {
            return false;
          },
          getSelectedModel: function () {
            return null;
          },
          syncBadges: function () {},
          setPointerNorm: function () {},
          setPointerClient: function () {},
          getProjectedRects: function () {
            return null;
          },
          getChassisOrbit: function () {
            return { pitch: 0, yaw: 0, isRotated: false };
          },
          setChassisOrbit: function () {
            return false;
          },
          resetChassisOrbit: function () {
            return false;
          },
        };
        return offController;
      }

      var currentMode = 'on';
      var stageMode = requestedStageMode;
      var isDestroyed = false;
      var muted = readMutedPref(root);
      var audioCtx = null;
      var noiseBuf = null;
      var explicitConfirmSlamMs =
        opts.confirmSlamMs !== undefined && Number.isFinite(Number(opts.confirmSlamMs))
          ? Math.max(0, Math.round(Number(opts.confirmSlamMs)))
          : opts.enableConfirmSlam === true
          ? CONFIRM_SLAM_DELAY_MS
          : opts.enableConfirmSlam === false
          ? 0
          : null;

      function readClockMs() {
        if (root && root.performance && typeof root.performance.now === 'function') {
          return root.performance.now();
        }
        return Date.now();
      }

      /* Long-press state */
      var holdState = null;
      var suppressUntilMs = 0;
      var suppressTimer = 0;

      /* V12 In-Flow Push-Up Desk Dock, 3D Flip Card, 3D Renderer & Live-sync state */
      var overlayEl = null;
      var deskmatEl = null;
      var dockTopRimEl = null;
      var dockGripEl = null;
      var spatialDockEl = null;
      var bentoRefs = null;
      var stageEl = null;
      var canvasEl = null;
      var hitLayerEl = null;
      var hudPillEl = null;
      var activeRenderer = null;
      var dockResizeObserver = null;
      var lastPointerClient = { x: -9999, y: -9999, active: false };
      var extNearRendererActive = false;
      var cachedDockBounds = { left: 60, top: 220, width: 1280, height: 340 };
      var cachedCardBounds = { left: 74, top: 232, width: 300, height: 316 };
      var cachedRightCardBounds = { left: 1080, top: 232, width: 246, height: 316 };
      var cachedStageBounds = { left: 320, top: 220, width: 760, height: 340, valid: false };
      var lastStageRectFn = null;
      var rimGlowWasActive = false;
      var lastStageCursor = '';
      var lastBentoDomSig = '';
      var configuredIdleEvictMs =
        opts.idleEvictMs !== undefined && Number.isFinite(Number(opts.idleEvictMs))
          ? Math.max(50, Math.round(Number(opts.idleEvictMs)))
          : IDLE_EVICT_DELAY_MS;
      var hasExplicitIdleEvictOpt = opts.idleEvictMs !== undefined && Number.isFinite(Number(opts.idleEvictMs));
      var idleEvictTimer = 0;

      var configuredTriggerOpt = opts.trigger || null;
      var configuredMountContainer = opts.mountContainer || opts.container || null;
      var configuredComposerOpt = opts.composerEl || opts.composer || null;
      var activeTelemetrySource = opts.telemetry !== undefined ? opts.telemetry : null;
      var scrollSettleTimer = 0;
      var normalizedModels = [];
      var rawSourceModels = Array.isArray(opts.models) && opts.models.length > 0 ? opts.models : (Array.isArray(opts.modelOptions) && opts.modelOptions.length > 0 ? opts.modelOptions : DEFAULT_MODELS);
      for (var mi = 0; mi < rawSourceModels.length; mi += 1) {
        var normItem = normalizeModelOptionItem(rawSourceModels[mi]);
        if (normItem) normalizedModels.push(normItem);
      }
      if (normalizedModels.length === 0) normalizedModels = DEFAULT_MODELS.slice();
      var normalizedPlanners = null;
      if (Array.isArray(opts.orchestratorPlanners)) {
        normalizedPlanners = [];
        for (var pi = 0; pi < opts.orchestratorPlanners.length; pi += 1) {
          var pNorm = findMatchingOptionInList(normalizedModels, opts.orchestratorPlanners[pi]) || normalizeModelOptionItem(opts.orchestratorPlanners[pi]);
          if (pNorm) normalizedPlanners.push(pNorm);
        }
      } else if (rawSourceModels === DEFAULT_MODELS) {
        normalizedPlanners = DEFAULT_ORCHESTRATOR_PLANNERS.slice();
      }
      var defaultCarbonOpt = findMatchingOptionInList(normalizedModels, 'gemini-4-carbon-high') || normalizedModels[0] || null;
      var resolvedInitSelected = findMatchingOptionInList(normalizedModels, opts.selectedModel || opts.initialModel) || defaultCarbonOpt;
      var resolvedDefaultPlanner = findMatchingOptionInList(normalizedModels, opts.orchestratorDefaultPlanner) || defaultCarbonOpt;
      var resolvedInitPlanner = findMatchingOptionInList(normalizedModels, opts.orchestratorPlanner) || resolvedDefaultPlanner;
      var declarativeCtx = {
        modelOptions: normalizedModels,
        selectedModel: resolvedInitSelected,
        effortIndex: opts.effortIndex instanceof Map ? opts.effortIndex : null,
        orchestratorPlanners: normalizedPlanners,
        orchestratorPlannerIndex: opts.orchestratorPlannerIndex instanceof Map ? opts.orchestratorPlannerIndex : null,
        orchestratorDefaultPlanner: resolvedDefaultPlanner,
        orchestratorPick: {
          model: resolvedInitPlanner,
          select: function (val, plannerOpt) {
            declarativeCtx.orchestratorPick.model = plannerOpt || declarativeCtx.orchestratorPick.model;
            if (typeof opts.onToggleOrchestrator === 'function') {
              try { opts.onToggleOrchestrator(true, declarativeCtx.orchestratorPick.model, { value: val, selectedZ: selectedZ, selectedAuxIndex: selectedAuxIndex }); } catch (eCb) {}
            }
          }
        }
      };
      function applyDeclarativeThemeAttrs(themeKit, accentKey) {
        if (!doc || !doc.documentElement || typeof doc.documentElement.setAttribute !== 'function') return;
        var de = doc.documentElement;
        if (themeKit) {
          var tk = String(themeKit).toLowerCase();
          var tSpec = { theme: 'dark', palette: 'obsidian', lightPreset: 'crystal' };
          if (tk === 'warm' || tk === 'warm-dark' || tk === 'claude') tSpec = { theme: 'dark', palette: 'warm', lightPreset: 'crystal' };
          else if (tk === 'crystal' || tk === 'crystal-light' || tk === 'light') tSpec = { theme: 'light', palette: 'obsidian', lightPreset: 'crystal' };
          else if (tk === 'alabaster' || tk === 'alabaster-light') tSpec = { theme: 'light', palette: 'warm', lightPreset: 'alabaster' };
          de.setAttribute('data-prism-theme', tSpec.theme);
          de.setAttribute('data-prism-palette', tSpec.palette);
          de.setAttribute('data-prism-light-preset', tSpec.lightPreset);
          if (de.classList && typeof de.classList.toggle === 'function') { de.classList.toggle('light', tSpec.theme === 'light'); de.classList.toggle('dark', tSpec.theme === 'dark'); }
          if (doc.body && doc.body.classList && typeof doc.body.classList.toggle === 'function') { doc.body.classList.toggle('light', tSpec.theme === 'light'); doc.body.classList.toggle('dark', tSpec.theme === 'dark'); }
        }
        if (accentKey) de.setAttribute('data-prism-accent', String(accentKey).toLowerCase());
        invalidateComputedThemeCache(doc);
      }
      if (opts.theme || opts.accent) applyDeclarativeThemeAttrs(opts.theme, opts.accent);
      if ((opts.locale || opts.lang) && doc && doc.documentElement && typeof doc.documentElement.setAttribute === 'function') {
        doc.documentElement.setAttribute('data-prism-lang', String(opts.locale || opts.lang));
      }
      function readHostModelContext() {
        if (root && root.PrismPeriodicState && typeof root.PrismPeriodicState === 'object') {
          if (typeof root.PrismPeriodicState.getContext === 'function') { var ext = root.PrismPeriodicState.getContext(); if (ext) return ext; }
          if (Array.isArray(root.PrismPeriodicState.modelOptions)) return root.PrismPeriodicState;
        }
        return declarativeCtx;
      }
      var activeAnchorBtn = null;
      var activeHostCtx = declarativeCtx;
      var initialOption = null;
      var initialOrchLatched = false;
      var initialOrchPickModel = null;
      var hasModified = false;
      var fullAvailableEntries = [];
      var fullAvailableByZ = new Map();
      var fullAuxSlots = [];
      var orchRegistry = null;
      var orchLatched = false;
      var availableEntries = [];
      var availableByZ = new Map();
      var auxSlots = [];
      var selectedZ = null;
      var selectedAuxIndex = null;
      var hoveredZ = null;
      var hoveredAuxIndex = null;
      var inspectedBlindZ = null;
      var inspectedBlindAuxIndex = null;
      var blindFlashZ = null;
      var pressedZ = null;
      var pressedAuxIndex = null;
      var hoveredEffort = null;
      var pressedEffort = null;
      var dragEffortProgress = null;
      var hoveredBtn = null;
      var pressedBtn = null;
      var lockedShakeZ = null;
      var lockedShakeAuxIndex = null;
      var cardFlipped = false;
      var compactExpanded = false;
      var isConfirmClosing = false;
      var isDrawerClosing = false;
      var confirmSlamZ = null;
      var confirmSlamAuxIndex = null;
      var pointerDownOutside = false;
      var isOrbitDragging = false;
      var gestureState = null;
      var pendingServoOrbit = null;
      var suppressPostDragClickUntil = 0;
      var activeEffortByZ = new Map();
      var activeEffortByAux = new Map();
      var activeCommittedAuxBadge = null;
      var activeCommittedElementZ = null;

      var keyNodesByZ = new Map();
      var auxKeyNodes = [];
      var hudChipByZ = new Map();
      var uiRefs = null;

      var openRafId = 0;
      var modeLayoutRafId = 0;
      var orbitSyncRafId = 0;
      var badgeSyncTimer = 0;
      var blindDwellTimer = 0;
      var blindFlashTimer = 0;
      var confirmCloseTimer = 0;
      var drawerClosingTimer = 0;
      var pendingTimers = new Set();

      /* MutationObservers for live Prism theme attributes, host conversation swaps & bottom trigger label */
      var themeObserver = null;
      var hostDomObserver = null;
      var triggerObserver = null;
      var observedButtons = new Set();
      var isMutatingBadge = false;

      function cancelIdleResourceEviction() {
        if (idleEvictTimer) {
          clearTimer(idleEvictTimer);
          idleEvictTimer = 0;
        }
      }

      function performIdleResourceEviction() {
        idleEvictTimer = 0;
        if (isDestroyed || overlayEl || holdState) return;
        var oledMod = resolveOledScreenModule(root);
        if (oledMod && typeof oledMod.evictIdleOledWallpapers === 'function') {
          try {
            oledMod.evictIdleOledWallpapers(root);
          } catch (e) {}
        }
        var grainMod = resolveGrainAssets(root);
        if (grainMod && typeof grainMod.evictGrainTextures === 'function') {
          try {
            grainMod.evictGrainTextures();
          } catch (eG) {}
        }
        noiseBuf = null;
        if (audioCtx && audioCtx.state === 'running' && typeof audioCtx.suspend === 'function') {
          try {
            audioCtx.suspend();
          } catch (e2) {}
        }
      }

      function scheduleIdleResourceEviction() {
        cancelIdleResourceEviction();
        if (isDestroyed || currentMode === 'off' || overlayEl || holdState) return;
        var oledMod = resolveOledScreenModule(root);
        var cachedWpCount =
          oledMod && typeof oledMod.getCachedOledWallpaperCount === 'function'
            ? oledMod.getCachedOledWallpaperCount(root)
            : 0;
        if (cachedWpCount <= 0 && !hasExplicitIdleEvictOpt) {
          return;
        }
        idleEvictTimer = setTimer(performIdleResourceEviction, configuredIdleEvictMs);
      }

      function scheduleTrackedTimer(fn, delayMs) {
        var tid = setTimer(function () {
          pendingTimers.delete(tid);
          fn();
        }, delayMs);
        pendingTimers.add(tid);
        return tid;
      }

      function cancelBlindDwellTimer() {
        if (blindDwellTimer) {
          clearTimer(blindDwellTimer);
          pendingTimers.delete(blindDwellTimer);
          blindDwellTimer = 0;
        }
      }

      function cancelBlindFlashTimer() {
        if (blindFlashTimer) {
          clearTimer(blindFlashTimer);
          pendingTimers.delete(blindFlashTimer);
          blindFlashTimer = 0;
        }
        blindFlashZ = null;
      }

      function stopOrbitFollowSync() {
        if (orbitSyncRafId && cancelRaf) {
          cancelRaf(orbitSyncRafId);
        }
        orbitSyncRafId = 0;
      }

      function clearTransientAsync() {
        if (openRafId && cancelRaf) {
          cancelRaf(openRafId);
        }
        openRafId = 0;
        if (modeLayoutRafId && cancelRaf) {
          cancelRaf(modeLayoutRafId);
        }
        modeLayoutRafId = 0;
        stopOrbitFollowSync();
        blindDwellTimer = 0;
        blindFlashTimer = 0;
        blindFlashZ = null;
        extNearRendererActive = false;
        confirmCloseTimer = 0;
        drawerClosingTimer = 0;
        isConfirmClosing = false;
        isDrawerClosing = false;
        confirmSlamZ = null;
        confirmSlamAuxIndex = null;
        lockedShakeAuxIndex = null;
        isOrbitDragging = false;
        gestureState = null;
        pendingServoOrbit = null;
        dragEffortProgress = null;
        suppressPostDragClickUntil = 0;
        pendingTimers.forEach(function (tid) {
          clearTimer(tid);
        });
        pendingTimers.clear();
      }

      function clearBadgeTimer() {
        if (badgeSyncTimer) {
          clearTimer(badgeSyncTimer);
          badgeSyncTimer = 0;
        }
      }

      /* Tracked global listeners for 100% symmetric teardown */
      var docListeners = [];
      var rootListeners = [];

      function onDoc(type, fn, capture) {
        if (!doc || typeof doc.addEventListener !== 'function') return;
        doc.addEventListener(type, fn, Boolean(capture));
        docListeners.push([type, fn, Boolean(capture)]);
      }

      function onRoot(type, fn, capture) {
        if (!root || typeof root.addEventListener !== 'function') return;
        root.addEventListener(type, fn, Boolean(capture));
        rootListeners.push([type, fn, Boolean(capture)]);
      }

      function removeAllListeners() {
        if (doc && typeof doc.removeEventListener === 'function') {
          for (var i = 0; i < docListeners.length; i += 1) {
            var dl = docListeners[i];
            doc.removeEventListener(dl[0], dl[1], dl[2]);
          }
        }
        docListeners.length = 0;
        if (root && typeof root.removeEventListener === 'function') {
          for (var j = 0; j < rootListeners.length; j += 1) {
            var rl = rootListeners[j];
            root.removeEventListener(rl[0], rl[1], rl[2]);
          }
        }
        rootListeners.length = 0;
      }

      /* V7 Ceramic Jade Keycap & CNC Aluminum Gasket "Creamy Mahjong / Raindrop Pebble" Synthesizer */
      function getAudioContext() {
        if (muted || isReducedMotion(doc, root) || isDestroyed) return null;
        if (audioCtx) {
          if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
            try {
              audioCtx.resume();
            } catch (e) {}
          }
          return audioCtx;
        }
        var Ctor = (root && (root.AudioContext || root.webkitAudioContext)) || null;
        if (typeof Ctor !== 'function') return null;
        try {
          audioCtx = new Ctor();
          return audioCtx;
        } catch (e) {
          return null;
        }
      }

      function getShortNoiseBuffer(ctx) {
        if (noiseBuf) return noiseBuf;
        if (!ctx || typeof ctx.createBuffer !== 'function') return null;
        try {
          var sr = ctx.sampleRate || 44100;
          var len = Math.max(384, Math.floor(sr * 0.044));
          var buf = ctx.createBuffer(1, len, sr);
          var data = buf.getChannelData(0);
          var seed = 20261122;
          var prev = 0;
          for (var i = 0; i < len; i += 1) {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            var white = (seed / 4294967296) * 2 - 1;
            /* One-pole warm brown/pink smoothing to strip harsh plastic fizz at source */
            prev = prev * 0.62 + white * 0.38;
            var env = Math.pow(1 - i / len, 2.05);
            data[i] = prev * env * 1.45;
          }
          noiseBuf = buf;
          return buf;
        } catch (e) {
          return null;
        }
      }

      function createLowpassBus(ctx, dest, cutoffHz, qVal, now) {
        if (ctx && typeof ctx.createBiquadFilter === 'function') {
          var lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(cutoffHz, now);
          lp.Q.setValueAtTime(qVal || 0.72, now);
          lp.connect(dest);
          return lp;
        }
        return dest;
      }

      function triggerCeramicLiftSound(ctx, now) {
        /* Magnetic Fluid Levitation ("lift" / "select"):
           Warm low-frequency cavity rise (155Hz -> 210Hz) + damped air-cushion sigh, 0 shrill highs */
        var bus = createLowpassBus(ctx, ctx.destination, 1320, 0.68, now);

        var magOsc = ctx.createOscillator();
        var magGain = ctx.createGain();
        magOsc.type = 'sine';
        magOsc.frequency.setValueAtTime(155, now);
        magOsc.frequency.exponentialRampToValueAtTime(210, now + 0.078);
        magGain.gain.setValueAtTime(0.0001, now);
        magGain.gain.linearRampToValueAtTime(0.105, now + 0.006);
        magGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.092);
        magOsc.connect(magGain);
        magGain.connect(bus);
        magOsc.start(now);
        magOsc.stop(now + 0.098);

        var jadeOsc = ctx.createOscillator();
        var jadeGain = ctx.createGain();
        jadeOsc.type = 'triangle';
        jadeOsc.frequency.setValueAtTime(232, now + 0.002);
        jadeOsc.frequency.exponentialRampToValueAtTime(308, now + 0.056);
        jadeGain.gain.setValueAtTime(0.0001, now + 0.002);
        jadeGain.gain.linearRampToValueAtTime(0.044, now + 0.009);
        jadeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.064);
        jadeOsc.connect(jadeGain);
        jadeGain.connect(bus);
        jadeOsc.start(now + 0.002);
        jadeOsc.stop(now + 0.07);

        var nBuf = getShortNoiseBuffer(ctx);
        if (nBuf && typeof ctx.createBufferSource === 'function') {
          var src = ctx.createBufferSource();
          src.buffer = nBuf;
          var airGain = ctx.createGain();
          airGain.gain.setValueAtTime(0.0001, now);
          airGain.gain.linearRampToValueAtTime(0.032, now + 0.005);
          airGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          if (typeof ctx.createBiquadFilter === 'function') {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.setValueAtTime(460, now);
            bp.Q.setValueAtTime(1.45, now);
            src.connect(bp);
            bp.connect(airGain);
          } else {
            src.connect(airGain);
          }
          airGain.connect(bus);
          src.start(now);
          src.stop(now + 0.044);
        }
      }

      function triggerJadePebbleStepSound(ctx, now, stepIndex) {
        /* Thinking-Tier Switch ("step"):
           Restrained warm river-pebble / temple-woodblock micro-tap, smooth & non-fatiguing */
        var idx = Math.max(0, Math.min(5, Number(stepIndex) || 0));
        var mul = 0.94 + idx * 0.052;
        var bus = createLowpassBus(ctx, ctx.destination, 1740, 0.74, now);

        var coreOsc = ctx.createOscillator();
        var coreGain = ctx.createGain();
        coreOsc.type = 'sine';
        coreOsc.frequency.setValueAtTime(308 * mul, now);
        coreOsc.frequency.exponentialRampToValueAtTime(224 * mul, now + 0.048);
        coreGain.gain.setValueAtTime(0.0001, now);
        coreGain.gain.linearRampToValueAtTime(0.082, now + 0.0028);
        coreGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.056);
        coreOsc.connect(coreGain);
        coreGain.connect(bus);
        coreOsc.start(now);
        coreOsc.stop(now + 0.062);

        var bodyOsc = ctx.createOscillator();
        var bodyGain = ctx.createGain();
        bodyOsc.type = 'triangle';
        bodyOsc.frequency.setValueAtTime(518 * mul, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(382 * mul, now + 0.026);
        bodyGain.gain.setValueAtTime(0.0001, now);
        bodyGain.gain.linearRampToValueAtTime(0.042, now + 0.002);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(bus);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.035);

        var nBuf = getShortNoiseBuffer(ctx);
        if (nBuf && typeof ctx.createBufferSource === 'function') {
          var src = ctx.createBufferSource();
          src.buffer = nBuf;
          var nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.034, now);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.017);
          if (typeof ctx.createBiquadFilter === 'function') {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.setValueAtTime(760 * mul, now);
            bp.Q.setValueAtTime(2.15, now);
            src.connect(bp);
            bp.connect(nGain);
          } else {
            src.connect(nGain);
          }
          nGain.connect(bus);
          src.start(now);
          src.stop(now + 0.022);
        }
      }

      function triggerCeramicBottomOutSlam(ctx, now, gainScale) {
        /* Deep Ceramic Bottom-Out Mahjong Thock ("slam" / "commit"):
           1) 145Hz -> 118Hz -> 68Hz solid CNC aluminum chassis & Poron plate thump
           2) 548Hz -> 386Hz thick-walled ceramic jade cavity creamy resonance
           3) POM cross-stem seat transient strictly lowpass-clamped <= 2050Hz (zero >2200Hz plastic clack) */
        var g = gainScale || 1;
        var masterBus = createLowpassBus(ctx, ctx.destination, 2050, 0.76, now);

        /* Layer 1: Solid CNC Aluminum Plate & Gasket Sub-Thump (145Hz -> 118Hz -> 68Hz) */
        var plateOsc = ctx.createOscillator();
        var plateGain = ctx.createGain();
        plateOsc.type = 'sine';
        plateOsc.frequency.setValueAtTime(145, now);
        plateOsc.frequency.exponentialRampToValueAtTime(118, now + 0.022);
        plateOsc.frequency.exponentialRampToValueAtTime(68, now + 0.094);
        plateGain.gain.setValueAtTime(0.0001, now);
        plateGain.gain.linearRampToValueAtTime(0.155 * g, now + 0.003);
        plateGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.102);
        plateOsc.connect(plateGain);
        plateGain.connect(masterBus);
        plateOsc.start(now);
        plateOsc.stop(now + 0.108);

        /* Layer 2: Thick Ceramic-Jade Wall Creamy Mahjong Body (548Hz -> 386Hz) */
        var ceramicOsc = ctx.createOscillator();
        var ceramicGain = ctx.createGain();
        ceramicOsc.type = 'triangle';
        ceramicOsc.frequency.setValueAtTime(548, now);
        ceramicOsc.frequency.exponentialRampToValueAtTime(386, now + 0.042);
        ceramicGain.gain.setValueAtTime(0.0001, now);
        ceramicGain.gain.linearRampToValueAtTime(0.092 * g, now + 0.0025);
        ceramicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);
        ceramicOsc.connect(ceramicGain);
        ceramicGain.connect(masterBus);
        ceramicOsc.start(now);
        ceramicOsc.stop(now + 0.054);

        /* Layer 3: Damped POM Box-Stem Bottom-Out Cushion Transient */
        var nBuf = getShortNoiseBuffer(ctx);
        if (nBuf && typeof ctx.createBufferSource === 'function') {
          var src = ctx.createBufferSource();
          src.buffer = nBuf;
          var nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.096 * g, now);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
          if (typeof ctx.createBiquadFilter === 'function') {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.setValueAtTime(670, now);
            bp.Q.setValueAtTime(1.65, now);
            src.connect(bp);
            bp.connect(nGain);
          } else {
            src.connect(nGain);
          }
          nGain.connect(masterBus);
          src.start(now);
          src.stop(now + 0.03);
        }

        /* Layer 4: +13ms Micro Cross-Socket Seat Lock Settle (134Hz -> 118Hz) */
        var seatOsc = ctx.createOscillator();
        var seatGain = ctx.createGain();
        seatOsc.type = 'sine';
        seatOsc.frequency.setValueAtTime(134, now + 0.013);
        seatOsc.frequency.exponentialRampToValueAtTime(118, now + 0.058);
        seatGain.gain.setValueAtTime(0.0001, now + 0.013);
        seatGain.gain.linearRampToValueAtTime(0.042 * g, now + 0.017);
        seatGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.064);
        seatOsc.connect(seatGain);
        seatGain.connect(masterBus);
        seatOsc.start(now + 0.013);
        seatOsc.stop(now + 0.07);
      }

      function triggerRotaryRatchetSound(ctx, now, stepIndex) {
        /* Precision CNC Diamond-Knurled Rotary Encoder Detent Ratchet ("ratchet"):
           Dual short crisp metallic ticks pitch-graded subtly across effort steps */
        var idx = Math.max(0, Math.min(5, Number(stepIndex) || 0));
        var mul = 0.92 + idx * 0.065;
        var bus = createLowpassBus(ctx, ctx.destination, 2650, 0.85, now);

        var detentOsc = ctx.createOscillator();
        var detentGain = ctx.createGain();
        detentOsc.type = 'triangle';
        detentOsc.frequency.setValueAtTime(1180 * mul, now);
        detentOsc.frequency.exponentialRampToValueAtTime(640 * mul, now + 0.015);
        detentGain.gain.setValueAtTime(0.0001, now);
        detentGain.gain.linearRampToValueAtTime(0.056, now + 0.0014);
        detentGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.019);
        detentOsc.connect(detentGain);
        detentGain.connect(bus);
        detentOsc.start(now);
        detentOsc.stop(now + 0.022);

        var bodyOsc = ctx.createOscillator();
        var bodyGain = ctx.createGain();
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(340 * mul, now + 0.006);
        bodyOsc.frequency.exponentialRampToValueAtTime(215 * mul, now + 0.028);
        bodyGain.gain.setValueAtTime(0.0001, now + 0.006);
        bodyGain.gain.linearRampToValueAtTime(0.036, now + 0.0085);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(bus);
        bodyOsc.start(now + 0.006);
        bodyOsc.stop(now + 0.036);

        var nBuf = getShortNoiseBuffer(ctx);
        if (nBuf && typeof ctx.createBufferSource === 'function') {
          var src = ctx.createBufferSource();
          src.buffer = nBuf;
          var nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.038, now);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.011);
          if (typeof ctx.createBiquadFilter === 'function') {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.setValueAtTime(1840 * mul, now);
            bp.Q.setValueAtTime(3.2, now);
            src.connect(bp);
            bp.connect(nGain);
          } else {
            src.connect(nGain);
          }
          nGain.connect(bus);
          src.start(now);
          src.stop(now + 0.015);
        }
      }

      function triggerOrchLatchSound(ctx, now, latching) {
        /* Heavy Dual-Stage Mechanical Latch Switch ("orch-latch" / "orch-unlatch"):
           Stage 1: Damped titanium switch housing sink + Stage 2 (+18ms): crisp spring-detent catch */
        var bus = createLowpassBus(ctx, ctx.destination, 2120, 0.78, now);
        var s1Osc = ctx.createOscillator();
        var s1Gain = ctx.createGain();
        s1Osc.type = 'sine';
        s1Osc.frequency.setValueAtTime(latching ? 158 : 188, now);
        s1Osc.frequency.exponentialRampToValueAtTime(latching ? 74 : 112, now + 0.052);
        s1Gain.gain.setValueAtTime(0.0001, now);
        s1Gain.gain.linearRampToValueAtTime(0.098, now + 0.0025);
        s1Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.062);
        s1Osc.connect(s1Gain);
        s1Gain.connect(bus);
        s1Osc.start(now);
        s1Osc.stop(now + 0.068);

        var t2 = now + 0.018;
        var s2Osc = ctx.createOscillator();
        var s2Gain = ctx.createGain();
        s2Osc.type = 'triangle';
        s2Osc.frequency.setValueAtTime(latching ? 780 : 620, t2);
        s2Osc.frequency.exponentialRampToValueAtTime(latching ? 510 : 790, t2 + 0.036);
        s2Gain.gain.setValueAtTime(0.0001, t2);
        s2Gain.gain.linearRampToValueAtTime(0.058, t2 + 0.002);
        s2Gain.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.044);
        s2Osc.connect(s2Gain);
        s2Gain.connect(bus);
        s2Osc.start(t2);
        s2Osc.stop(t2 + 0.05);

        var nBuf = getShortNoiseBuffer(ctx);
        if (nBuf && typeof ctx.createBufferSource === 'function') {
          var src = ctx.createBufferSource();
          src.buffer = nBuf;
          var nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.052, t2);
          nGain.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.016);
          if (typeof ctx.createBiquadFilter === 'function') {
            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.setValueAtTime(latching ? 1120 : 1380, t2);
            bp.Q.setValueAtTime(2.4, t2);
            src.connect(bp);
            bp.connect(nGain);
          } else {
            src.connect(nGain);
          }
          nGain.connect(bus);
          src.start(t2);
          src.stop(t2 + 0.02);
        }
      }

      function triggerBlindFidgetSound(ctx, now) {
        /* Subtle matte PBT standby keycap fidget thock (soft, non-fatiguing, tactile) */
        var bus = createLowpassBus(ctx, ctx.destination, 1180, 0.72, now);
        var thockOsc = ctx.createOscillator();
        var thockGain = ctx.createGain();
        thockOsc.type = 'sine';
        thockOsc.frequency.setValueAtTime(164, now);
        thockOsc.frequency.exponentialRampToValueAtTime(92, now + 0.038);
        thockGain.gain.setValueAtTime(0.0001, now);
        thockGain.gain.linearRampToValueAtTime(0.052, now + 0.0024);
        thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        thockOsc.connect(thockGain);
        thockGain.connect(bus);
        thockOsc.start(now);
        thockOsc.stop(now + 0.05);

        var capOsc = ctx.createOscillator();
        var capGain = ctx.createGain();
        capOsc.type = 'triangle';
        capOsc.frequency.setValueAtTime(385, now);
        capOsc.frequency.exponentialRampToValueAtTime(260, now + 0.022);
        capGain.gain.setValueAtTime(0.0001, now);
        capGain.gain.linearRampToValueAtTime(0.024, now + 0.0018);
        capGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);
        capOsc.connect(capGain);
        capGain.connect(bus);
        capOsc.start(now);
        capOsc.stop(now + 0.03);
      }

      function playSound(kind, stepIndex) {
        var ctx = getAudioContext();
        if (!ctx) return;
        try {
          var now = ctx.currentTime;
          if (kind === 'chime' || kind === 'open') {
            /* Warm Restrained Jade Resonance Welcome Tone (mellow D4 + A4, 0 shrill bell) */
            var welcomeBus = createLowpassBus(ctx, ctx.destination, 1480, 0.65, now);
            var freqs = [293.66, 440.0];
            var gains = [0.038, 0.02];
            for (var i = 0; i < freqs.length; i += 1) {
              var osc = ctx.createOscillator();
              var gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freqs[i], now + i * 0.024);
              gain.gain.setValueAtTime(0.0001, now + i * 0.024);
              gain.gain.linearRampToValueAtTime(gains[i], now + i * 0.024 + 0.014);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24 + i * 0.035);
              osc.connect(gain);
              gain.connect(welcomeBus);
              osc.start(now + i * 0.024);
              osc.stop(now + 0.28 + i * 0.035);
            }
          } else if (kind === 'down') {
            /* Lubed linear rail pre-travel soft cushion touch */
            var downBus = createLowpassBus(ctx, ctx.destination, 1180, 0.68, now);
            var dOsc = ctx.createOscillator();
            var dGain = ctx.createGain();
            dOsc.type = 'sine';
            dOsc.frequency.setValueAtTime(138, now);
            dOsc.frequency.exponentialRampToValueAtTime(82, now + 0.034);
            dGain.gain.setValueAtTime(0.0001, now);
            dGain.gain.linearRampToValueAtTime(0.032, now + 0.003);
            dGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);
            dOsc.connect(dGain);
            dGain.connect(downBus);
            dOsc.start(now);
            dOsc.stop(now + 0.042);
          } else if (kind === 'lift' || kind === 'select' || kind === 'keycap') {
            /* Warm magnetic-fluid keycap levitation thocky/marbly resonance */
            triggerCeramicLiftSound(ctx, now);
          } else if (kind === 'step') {
            /* Restrained ceramic-jade pebble micro-tap */
            triggerJadePebbleStepSound(ctx, now, stepIndex);
          } else if (kind === 'ratchet') {
            /* Precision rotary encoder detent ratchet click */
            triggerRotaryRatchetSound(ctx, now, stepIndex);
          } else if (kind === 'orch-latch') {
            /* Dual-stage mechanical switch latch lock */
            triggerOrchLatchSound(ctx, now, true);
          } else if (kind === 'orch-unlatch') {
            /* Dual-stage mechanical switch unlatch release */
            triggerOrchLatchSound(ctx, now, false);
          } else if (kind === 'fidget') {
            /* Soft matte PBT standby blind key fidget thock */
            triggerBlindFidgetSound(ctx, now);
          } else if (kind === 'slam' || kind === 'commit' || kind === 'confirm') {
            /* Full-bodied thick ceramic bottom-out Mahjong thock */
            triggerCeramicBottomOutSlam(ctx, now, 0.85);
          } else if (kind === 'reset') {
            /* Silky magnetic home-detent snap chime (lowpass <= 1560Hz, 0 harsh highs) */
            var resetBus = createLowpassBus(ctx, ctx.destination, 1560, 0.72, now);
            var glideOsc = ctx.createOscillator();
            var glideGain = ctx.createGain();
            glideOsc.type = 'sine';
            glideOsc.frequency.setValueAtTime(348, now);
            glideOsc.frequency.exponentialRampToValueAtTime(262, now + 0.068);
            glideGain.gain.setValueAtTime(0.0001, now);
            glideGain.gain.linearRampToValueAtTime(0.052, now + 0.006);
            glideGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.082);
            glideOsc.connect(glideGain);
            glideGain.connect(resetBus);
            glideOsc.start(now);
            glideOsc.stop(now + 0.088);

            var snapOsc = ctx.createOscillator();
            var snapGain = ctx.createGain();
            snapOsc.type = 'triangle';
            snapOsc.frequency.setValueAtTime(392, now + 0.018);
            snapOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.062);
            snapGain.gain.setValueAtTime(0.0001, now + 0.018);
            snapGain.gain.linearRampToValueAtTime(0.032, now + 0.024);
            snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.088);
            snapOsc.connect(snapGain);
            snapGain.connect(resetBus);
            snapOsc.start(now + 0.018);
            snapOsc.stop(now + 0.094);
          } else if (kind === 'prism-wave') {
            /* Bespoke CNC Titanium Artisan Keycap Harmonic Click (lowpass <= 1980Hz, crisp metallic overtone) */
            var waveBus = createLowpassBus(ctx, ctx.destination, 1980, 0.78, now);
            var bodyClickOsc = ctx.createOscillator();
            var bodyClickGain = ctx.createGain();
            bodyClickOsc.type = 'sine';
            bodyClickOsc.frequency.setValueAtTime(172, now);
            bodyClickOsc.frequency.exponentialRampToValueAtTime(92, now + 0.056);
            bodyClickGain.gain.setValueAtTime(0.0001, now);
            bodyClickGain.gain.linearRampToValueAtTime(0.082, now + 0.0025);
            bodyClickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.068);
            bodyClickOsc.connect(bodyClickGain);
            bodyClickGain.connect(waveBus);
            bodyClickOsc.start(now);
            bodyClickOsc.stop(now + 0.074);

            var chimeFreqs = [659.25, 987.77];
            var chimeGains = [0.044, 0.026];
            for (var ci = 0; ci < chimeFreqs.length; ci += 1) {
              var hOsc = ctx.createOscillator();
              var hGain = ctx.createGain();
              hOsc.type = ci === 0 ? 'triangle' : 'sine';
              hOsc.frequency.setValueAtTime(chimeFreqs[ci], now + ci * 0.008);
              hOsc.frequency.exponentialRampToValueAtTime(chimeFreqs[ci] * 0.88, now + 0.092 + ci * 0.018);
              hGain.gain.setValueAtTime(0.0001, now + ci * 0.008);
              hGain.gain.linearRampToValueAtTime(chimeGains[ci], now + ci * 0.008 + 0.004);
              hGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.105 + ci * 0.022);
              hOsc.connect(hGain);
              hGain.connect(waveBus);
              hOsc.start(now + ci * 0.008);
              hOsc.stop(now + 0.118 + ci * 0.022);
            }

            var wnBuf = getShortNoiseBuffer(ctx);
            if (wnBuf && typeof ctx.createBufferSource === 'function') {
              var wSrc = ctx.createBufferSource();
              wSrc.buffer = wnBuf;
              var wGain = ctx.createGain();
              wGain.gain.setValueAtTime(0.04, now);
              wGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
              if (typeof ctx.createBiquadFilter === 'function') {
                var wBp = ctx.createBiquadFilter();
                wBp.type = 'bandpass';
                wBp.frequency.setValueAtTime(1220, now);
                wBp.Q.setValueAtTime(2.4, now);
                wSrc.connect(wBp);
                wBp.connect(wGain);
              } else {
                wSrc.connect(wGain);
              }
              wGain.connect(waveBus);
              wSrc.start(now);
              wSrc.stop(now + 0.024);
            }
          } else if (kind === 'lock') {
            /* Muted silicone dampener thud on locked non-planner keycap */
            var lockBus = createLowpassBus(ctx, ctx.destination, 640, 0.7, now);
            var lOsc = ctx.createOscillator();
            var lGain = ctx.createGain();
            lOsc.type = 'sine';
            lOsc.frequency.setValueAtTime(112, now);
            lOsc.frequency.exponentialRampToValueAtTime(62, now + 0.048);
            lGain.gain.setValueAtTime(0.0001, now);
            lGain.gain.linearRampToValueAtTime(0.056, now + 0.003);
            lGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.054);
            lOsc.connect(lGain);
            lGain.connect(lockBus);
            lOsc.start(now);
            lOsc.stop(now + 0.06);
          }
        } catch (e) {}
      }

      function closeAudioContext() {
        noiseBuf = null;
        if (!audioCtx) return;
        var ctx = audioCtx;
        audioCtx = null;
        try {
          if (typeof ctx.close === 'function') ctx.close();
        } catch (e) {}
      }

      /* Inject stylesheet */
      function ensureStyles() {
        if (!doc) return;
        var existing = typeof doc.getElementById === 'function' ? doc.getElementById(STYLE_ID) : null;
        if (existing) return;
        var styleEl = doc.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.setAttribute('id', STYLE_ID);
        styleEl.textContent = PICKER_CSS;
        var mountTarget = doc.head || doc.documentElement;
        if (mountTarget && typeof mountTarget.appendChild === 'function') {
          mountTarget.appendChild(styleEl);
        }
      }

      /* Trigger Detection */
      function matchModelTriggerButton(target) {
        if (!target || typeof target.closest !== 'function') return null;
        var btn = target.closest('button, [role="button"]');
        if (!btn) return null;
        if (isInsideExcludedZone(btn)) return null;

        var configuredEl = resolveTargetElement(doc, configuredTriggerOpt);
        if (configuredEl && btn === configuredEl) return btn;
        if (elementMatches(btn, '[data-prism-trigger], [data-pp-trigger="1"], [data-testid="prism-model-trigger"]')) return btn;
        if (typeof btn.querySelector === 'function' && btn.querySelector('.prism-model-glyph')) return btn;
        var hasPopup = typeof btn.hasAttribute === 'function' && btn.hasAttribute('aria-haspopup');
        if (hasPopup || isLikelyComposerToolbar(btn)) {
          var labelText = readCleanButtonLabel(btn, true);
          if (MODEL_TRIGGER_TEXT_RE.test(labelText) && readHostModelContext(btn, root, doc)) {
            return btn;
          }
        }
        return null;
      }

      function miniKeycapColorsForAux(miniKey, profile) {
        return resolveThemeNativeMiniBadgeColors(miniKey || 'fallback', profile);
      }

      function formatOrchElementCompactBadge(slotZ, optSlot) {
        var zNum = Number(slotZ) || 6;
        var sl = optSlot || SLOT_BY_Z.get(zNum);
        var sym = sl && sl.symbol ? String(sl.symbol) : 'C';
        if (sym.length === 1) {
          return '0·' + zNum + sym;
        }
        return '0·' + sym;
      }

      function resolveAuxTwoLetterBadgeCode(groupIdOrText, fallbackTitle) {
        var probe = (String(groupIdOrText || '') + ' ' + String(fallbackTitle || '')).toLowerCase();
        if (/\bopus\b|claude-opus/.test(probe)) return 'OP';
        if (/\bsonnet\b|claude-sonnet/.test(probe)) return 'SN';
        if (/\bhaiku\b|claude-haiku/.test(probe)) return 'HK';
        if (/\b(?:claude|anthropic)\b/.test(probe)) return 'CL';
        if (/\bflash\b/.test(probe)) return 'FL';
        if (/\bcodex\b/.test(probe)) return 'CX';
        if (/\b(?:gpt|openai|gpt-oss)\b|\bo[134](?:-[a-z0-9]+)?\b/.test(probe)) return 'GP';
        var cleaned = String(fallbackTitle || groupIdOrText || 'AX').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        return cleaned.slice(0, 2) || 'AX';
      }

      function formatOrchAuxCompactBadge(auxIdOrText, fallbackTitle) {
        var probe = (String(auxIdOrText || '') + ' ' + String(fallbackTitle || '')).toLowerCase();
        if (/\bopus\b|claude-opus/.test(probe)) return '0·Op';
        if (/\bsonnet\b|claude-sonnet/.test(probe)) return '0·Sn';
        if (/\bhaiku\b|claude-haiku/.test(probe)) return '0·Hk';
        if (/\b(?:claude|anthropic)\b/.test(probe)) return '0·Cl';
        if (/\bflash\b/.test(probe)) return '0·Fl';
        if (/\bcodex\b/.test(probe)) return '0·Cx';
        if (/\b(?:gpt|openai|gpt-oss)\b|\bo[134](?:-[a-z0-9]+)?\b/.test(probe)) return '0·Gp';
        return '0·Op';
      }

      function inferOrchCompactBadgeFromHost(hostCtx, rawBtnLabel) {
        var candidates = [];
        if (hostCtx && hostCtx.orchestratorPick && hostCtx.orchestratorPick.model) {
          candidates.push(hostCtx.orchestratorPick.model);
        }
        if (rawBtnLabel) {
          var pm = /\(([^)]+)\)/.exec(String(rawBtnLabel));
          if (pm && pm[1]) {
            candidates.push('Gemini 4 ' + pm[1].trim());
            candidates.push(pm[1].trim());
          }
        }
        if (hostCtx && hostCtx.orchestratorDefaultPlanner) {
          candidates.push(hostCtx.orchestratorDefaultPlanner);
        }
        if (hostCtx && Array.isArray(hostCtx.orchestratorPlanners) && hostCtx.orchestratorPlanners.length > 0) {
          candidates.push(hostCtx.orchestratorPlanners[0]);
        }
        for (var i = 0; i < candidates.length; i += 1) {
          var cand = candidates[i];
          if (!cand) continue;
          var elP = parseElementModelLabel(cand);
          if (elP) return formatOrchElementCompactBadge(elP.slotZ);
          var rawStr = typeof cand === 'string' ? cand : String(cand.label || cand.modelId || '');
          if (/\b(?:opus|sonnet|haiku|claude|flash|gpt|codex)\b/i.test(rawStr)) {
            return formatOrchAuxCompactBadge(rawStr, rawStr);
          }
        }
        if (activeCommittedElementZ !== null) {
          return formatOrchElementCompactBadge(activeCommittedElementZ);
        }
        if (hostCtx && Array.isArray(hostCtx.modelOptions) && hostCtx.modelOptions.length > 0) {
          var foundZs = new Set();
          var hasOpusOpt = false;
          for (var m = 0; m < hostCtx.modelOptions.length; m += 1) {
            var mo = hostCtx.modelOptions[m];
            var mp = parseElementModelLabel(mo);
            if (mp) foundZs.add(mp.slotZ);
            else if (mo && /\bopus\b/i.test(String(mo.label || '') + ' ' + String(mo.modelId || ''))) {
              hasOpusOpt = true;
            }
          }
          if (foundZs.has(6)) return '0·6C';
          if (foundZs.has(10)) return '0·Ne';
          if (foundZs.has(18)) return '0·Ar';
          if (hasOpusOpt) return '0·Op';
        }
        return '0·6C';
      }

      function classifyDirectHostAuxBadge(rawLabel, modelId, hostCtx) {
        var txt = String(rawLabel || '').trim();
        var mid = String(modelId || '').trim();
        var hay = (txt + ' ' + mid).toLowerCase();
        if (!hay.trim()) return null;

        if (/orchestrator|编排|调度器/.test(hay)) {
          return {
            kind: 'aux',
            auxId: 'orchestrator',
            shortLabel: inferOrchCompactBadgeFromHost(hostCtx, txt),
            miniKey: 'orchestrator',
          };
        }
        if (/\bopus\b/.test(hay)) {
          return { kind: 'aux', auxId: 'claude-opus', shortLabel: 'OP', miniKey: 'claude' };
        }
        if (/\bsonnet\b/.test(hay)) {
          return { kind: 'aux', auxId: 'claude-sonnet', shortLabel: 'SN', miniKey: 'claude' };
        }
        if (/\bhaiku\b/.test(hay)) {
          return { kind: 'aux', auxId: 'claude-haiku', shortLabel: 'HK', miniKey: 'claude' };
        }
        if (/\b(?:claude|anthropic)\b/.test(hay)) {
          return { kind: 'aux', auxId: 'claude-sonnet', shortLabel: 'CL', miniKey: 'claude' };
        }
        if (/\bflash\b/.test(hay)) {
          return { kind: 'aux', auxId: 'flash', shortLabel: 'FL', miniKey: 'flash' };
        }
        if (/\bcodex\b/.test(hay)) {
          return { kind: 'aux', auxId: 'codex', shortLabel: 'CX', miniKey: 'gpt' };
        }
        if (/\b(?:gpt|openai)\b|\bo[134](?:-[a-z0-9]+)?\b/.test(hay)) {
          return { kind: 'aux', auxId: 'gpt-oss', shortLabel: 'GP', miniKey: 'gpt' };
        }
        return null;
      }

      /* Resolve element or aux-committed badge descriptor for a host model-selector button */
      function resolveButtonBadgeDescriptor(btn) {
        if (!btn) return null;
        var hostCtx = readHostModelContext(btn, root, doc);
        var ctxSel = hostCtx && hostCtx.selectedModel ? hostCtx.selectedModel : null;
        var cleanNow = readCleanButtonLabel(btn, false);
        var ctxLabel = ctxSel && typeof ctxSel.label === 'string' ? ctxSel.label.trim() : '';

        /* If user actively picked an aux model / Orch planner from the console and host session still matches it */
        if (activeCommittedAuxBadge) {
          var matchesBtn = cleanNow && cleanNow === activeCommittedAuxBadge.label;
          var matchesCtx = (!cleanNow || cleanNow === ctxLabel) && ctxLabel && ctxLabel === activeCommittedAuxBadge.label;
          if (matchesBtn || matchesCtx) {
            return {
              kind: 'aux',
              auxId: activeCommittedAuxBadge.id,
              shortLabel: activeCommittedAuxBadge.shortLabel,
              miniKey: activeCommittedAuxBadge.miniKey || 'fallback',
            };
          }
          if (!overlayEl && (cleanNow || ctxLabel)) {
            activeCommittedAuxBadge = null;
          }
        }

        if (activeCommittedElementZ !== null && ctxSel) {
          var committedParsed = parseElementModelLabel(ctxSel);
          if (
            committedParsed &&
            committedParsed.slotZ === activeCommittedElementZ &&
            (!cleanNow || !EXCLUDED_FAMILY_RE.test(cleanNow))
          ) {
            var directCheck = cleanNow ? parseElementModelLabel(cleanNow) : committedParsed;
            if (!directCheck || directCheck.slotZ === activeCommittedElementZ) {
              return {
                kind: 'element',
                slotZ: committedParsed.slotZ,
                symbol: committedParsed.symbol,
              };
            }
          }
        }

        if (cleanNow) {
          if (!EXCLUDED_FAMILY_RE.test(cleanNow)) {
            var direct = parseElementModelLabel(cleanNow);
            if (direct) {
              return { kind: 'element', slotZ: direct.slotZ, symbol: direct.symbol };
            }
            if (ctxSel && typeof ctxSel.modelId === 'string') {
              var assisted = parseElementModelLabel({
                label: cleanNow,
                modelId: ctxSel.modelId,
              });
              if (assisted) {
                return { kind: 'element', slotZ: assisted.slotZ, symbol: assisted.symbol };
              }
            }
          }
          var auxDirect = classifyDirectHostAuxBadge(
            cleanNow,
            ctxSel && typeof ctxSel.modelId === 'string' && (!ctxLabel || ctxLabel === cleanNow) ? ctxSel.modelId : '',
            hostCtx
          );
          if (auxDirect) return auxDirect;
          return null;
        }
        if (ctxSel) {
          var fallbackParsed = parseElementModelLabel(ctxSel);
          if (fallbackParsed) {
            return { kind: 'element', slotZ: fallbackParsed.slotZ, symbol: fallbackParsed.symbol };
          }
          var auxFallback = classifyDirectHostAuxBadge(ctxSel.label, ctxSel.modelId, hostCtx);
          if (auxFallback) return auxFallback;
        }
        return null;
      }

      /* Host Bottom Model Trigger Mini PBT Keycap Badge Sync (.pp-mini-keycap) */
      function removeAllMiniKeycaps() {
        if (!doc || typeof doc.querySelectorAll !== 'function') return;
        try {
          var badges = doc.querySelectorAll('.pp-mini-keycap');
          for (var i = 0; i < badges.length; i += 1) {
            safeRemove(badges[i]);
          }
        } catch (e) {}
      }

      function placeMiniBadgeInButton(btn, badge) {
        if (!btn || !badge) return;
        var glyph = typeof btn.querySelector === 'function' ? btn.querySelector('.prism-model-glyph') : null;
        if (glyph && glyph.parentNode === btn && typeof btn.insertBefore === 'function') {
          if (badge.parentNode !== btn || glyph.nextSibling !== badge) {
            if (glyph.nextSibling) {
              btn.insertBefore(badge, glyph.nextSibling);
            } else if (typeof btn.appendChild === 'function') {
              btn.appendChild(badge);
            }
          }
          return;
        }
        if (badge.parentNode === btn) return;
        var chList = btn.children || btn.childNodes;
        var lastChild =
          btn.lastElementChild ||
          btn.lastChild ||
          (chList && chList.length > 0 ? chList[chList.length - 1] : null);
        var lastTag = lastChild && lastChild.tagName ? String(lastChild.tagName).toLowerCase() : '';
        if (
          lastTag === 'svg' &&
          lastChild !== btn.firstChild &&
          lastChild.parentNode === btn &&
          typeof btn.insertBefore === 'function'
        ) {
          btn.insertBefore(badge, lastChild);
          return;
        }
        if (typeof btn.appendChild === 'function') {
          btn.appendChild(badge);
        }
      }

      function syncMiniKeycapOnSingleButton(btn, profile) {
        if (!btn || !doc) return;
        var existing = typeof btn.querySelector === 'function' ? btn.querySelector('.pp-mini-keycap') : null;
        var desc = resolveButtonBadgeDescriptor(btn);

        if (!desc) {
          if (existing) {
            isMutatingBadge = true;
            try {
              safeRemove(existing);
            } finally {
              isMutatingBadge = false;
            }
          }
          return;
        }

        var isAuxDesc = desc.kind === 'aux';
        var zText = isAuxDesc ? '' : String(desc.slotZ);
        var symText = isAuxDesc ? desc.shortLabel : desc.symbol;
        var colors = isAuxDesc
          ? miniKeycapColorsForAux(desc.miniKey, profile)
          : miniKeycapColorsForZ(desc.slotZ, profile);
        var sig =
          (isAuxDesc ? 'aux:' + desc.auxId + ':' + symText : desc.slotZ + ':' + desc.symbol) +
          ':' +
          profile.id +
          ':' +
          (profile.accent || 'follow') +
          ':' +
          (profile.isMono ? '1' : '0');

        isMutatingBadge = true;
        try {
          var badge = existing;
          if (!badge) {
            badge = mkEl(doc, 'span', 'pp-mini-keycap');
            badge.setAttribute('data-prism-no-i18n', '1');
            badge.setAttribute('data-prism-owned', '1');
            badge.setAttribute('aria-hidden', 'true');
            var zSpan = mkEl(doc, 'span', 'pp-mk-z', zText);
            var symSpan = mkEl(doc, 'span', 'pp-mk-sym', symText);
            badge.appendChild(zSpan);
            badge.appendChild(symSpan);
            placeMiniBadgeInButton(btn, badge);
          } else {
            placeMiniBadgeInButton(btn, badge);
            if (badge.getAttribute('data-sig') !== sig) {
              var zNode = badge.querySelector ? badge.querySelector('.pp-mk-z') : badge.firstChild;
              var sNode = badge.querySelector ? badge.querySelector('.pp-mk-sym') : badge.children && badge.children[1];
              if (zNode) zNode.textContent = zText;
              if (sNode) sNode.textContent = symText;
            }
          }

          if (badge.getAttribute('data-sig') !== sig) {
            badge.setAttribute('data-sig', sig);
            if (isAuxDesc) {
              badge.removeAttribute('data-z');
              badge.setAttribute('data-aux-id', desc.auxId);
              badge.setAttribute('data-symbol', symText);
            } else {
              badge.removeAttribute('data-aux-id');
              badge.setAttribute('data-z', String(desc.slotZ));
              badge.setAttribute('data-symbol', desc.symbol);
            }
            setStyleVar(badge, '--mk-bg', colors.bg);
            setStyleVar(badge, '--mk-fg', colors.fg);
            setStyleVar(badge, '--mk-border', colors.border);
            setStyleVar(badge, '--mk-skirt', null);
            setStyleVar(badge, '--mk-gloss', null);
            setStyleVar(badge, '--mk-gleam', null);
          }
        } finally {
          isMutatingBadge = false;
        }
      }

      function pruneDisconnectedObservedButtons() {
        if (observedButtons.size === 0) return;
        var stale = [];
        observedButtons.forEach(function (b) {
          if (!isNodeConnectedToDoc(doc, b)) stale.push(b);
        });
        if (stale.length === 0) return;
        for (var i = 0; i < stale.length; i += 1) {
          observedButtons.delete(stale[i]);
        }
        if (triggerObserver && observedButtons.size === 0) {
          try {
            triggerObserver.disconnect();
          } catch (e) {}
        }
      }

      function attachTriggerObserverIfNeeded(buttons) {
        var ObsCtor = (root && root.MutationObserver) || (typeof MutationObserver === 'function' ? MutationObserver : null);
        if (!ObsCtor) return;
        pruneDisconnectedObservedButtons();
        if (!triggerObserver) {
          triggerObserver = new ObsCtor(function (mutations) {
            if (isMutatingBadge || isDestroyed || currentMode === 'off') return;
            var relevant = false;
            for (var i = 0; i < mutations.length; i += 1) {
              var m = mutations[i];
              if (m && m.target && isOwnedDecorationNode(m.target)) continue;
              if (m && m.target && m.target.parentElement && isOwnedDecorationNode(m.target.parentElement)) continue;
              relevant = true;
              break;
            }
            if (relevant) {
              if (!overlayEl) {
                activeCommittedElementZ = null;
              }
              scheduleBadgeSync(24);
            }
          });
        }
        for (var b = 0; b < buttons.length; b += 1) {
          var btn = buttons[b];
          if (btn && !observedButtons.has(btn)) {
            try {
              triggerObserver.observe(btn, { childList: true, characterData: true, subtree: true });
              observedButtons.add(btn);
            } catch (e) {}
          }
        }
      }

      function syncMiniKeycapBadges() {
        if (isDestroyed || currentMode === 'off' || !doc) return;
        ensureStyles();
        var profile = resolvePrismThemeProfile(doc, root);
        var buttons = collectVisibleModelTriggerButtons(doc, configuredTriggerOpt);
        if (activeAnchorBtn && buttons.indexOf(activeAnchorBtn) === -1 && !isInsideExcludedZone(activeAnchorBtn)) {
          buttons.push(activeAnchorBtn);
        }
        for (var i = 0; i < buttons.length; i += 1) {
          syncMiniKeycapOnSingleButton(buttons[i], profile);
        }
        attachTriggerObserverIfNeeded(buttons);
      }

      function scheduleBadgeSync(delayMs) {
        if (isDestroyed || currentMode === 'off') return;
        if (badgeSyncTimer) return;
        badgeSyncTimer = setTimer(function () {
          badgeSyncTimer = 0;
          if (!isDestroyed && currentMode === 'on') {
            syncMiniKeycapBadges();
          }
        }, Math.max(16, Number(delayMs) || 50));
      }

      /* Hold Ring UI (Zero React DOM mutation — fixed overlay on document.body, GMK mineral-aware) */
      function resolveHoldRingStops(profile) {
        if (profile.accent === 'cobalt') {
          return {
            track: profile.isLight ? 'rgba(63,102,133,0.20)' : 'rgba(81,125,159,0.24)',
            stops: profile.isLight
              ? [
                  ['0%', '#3F6685'],
                  ['100%', '#517D9F'],
                ]
              : [
                  ['0%', '#517D9F'],
                  ['100%', '#7DA4C4'],
                ],
          };
        }
        if (profile.accent === 'iris') {
          return {
            track: profile.isLight ? 'rgba(66,86,139,0.20)' : 'rgba(130,148,204,0.24)',
            stops: profile.isLight
              ? [
                  ['0%', '#31426E'],
                  ['100%', '#566CA3'],
                ]
              : [
                  ['0%', '#42568B'],
                  ['100%', '#8B9FD4'],
                ],
          };
        }
        if (profile.accent === 'amber') {
          return {
            track: profile.isLight ? 'rgba(180,108,42,0.22)' : 'rgba(214,162,84,0.24)',
            stops: profile.isLight
              ? [
                  ['0%', '#B46928'],
                  ['100%', '#D48B3E'],
                ]
              : [
                  ['0%', '#C98A42'],
                  ['100%', '#E0B06A'],
                ],
          };
        }
        if (profile.accent === 'mono') {
          return {
            track: profile.isLight ? 'rgba(35,38,44,0.18)' : 'rgba(212,215,224,0.20)',
            stops: profile.isLight
              ? [
                  ['0%', '#23262C'],
                  ['100%', '#525866'],
                ]
              : [
                  ['0%', '#F2F4F8'],
                  ['100%', '#8E96A4'],
                ],
          };
        }
        if (profile.palette === 'warm' || profile.palette === 'claude' || profile.id === 'alabaster-light') {
          return {
            track: profile.isLight ? 'rgba(170,110,64,0.18)' : 'rgba(217,138,78,0.22)',
            stops: [
              ['0%', '#D8B36A'],
              ['52%', '#D98A4E'],
              ['100%', '#DCE4F0'],
            ],
          };
        }
        return {
          track: profile.isLight ? 'rgba(51,65,85,0.18)' : 'rgba(226,232,240,0.22)',
          stops: [
            ['0%', '#7DD3FC'],
            ['35%', '#DCE4F0'],
            ['70%', '#D98A4E'],
            ['100%', '#4F7CF0'],
          ],
        };
      }

      function spawnHoldRing(btn) {
        if (!doc || !doc.body || !btn || typeof btn.getBoundingClientRect !== 'function') return null;
        var rect = btn.getBoundingClientRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) return null;

        var profile = resolvePrismThemeProfile(doc, root);
        var ringSpec = resolveHoldRingStops(profile);

        var pad = 3;
        var w = Math.round(rect.width + pad * 2);
        var h = Math.round(rect.height + pad * 2);
        var radius = 10;
        try {
          if (root && typeof root.getComputedStyle === 'function') {
            var cs = root.getComputedStyle(btn);
            var parsedR = parseFloat(cs && cs.borderRadius);
            if (Number.isFinite(parsedR) && parsedR >= 0) {
              radius = Math.min(Math.round(h / 2), Math.round(parsedR + pad));
            }
          }
        } catch (e) {}

        var wrap = mkEl(doc, 'div', 'pp-hold-ring');
        setStyleVar(wrap, 'left', Math.round(rect.left - pad) + 'px');
        setStyleVar(wrap, 'top', Math.round(rect.top - pad) + 'px');
        setStyleVar(wrap, 'width', w + 'px');
        setStyleVar(wrap, 'height', h + 'px');

        var perim = Math.max(40, Math.round(2 * (w + h)));
        var svg = mkSvg(doc, 'svg', { viewBox: '0 0 ' + w + ' ' + h, fill: 'none' });
        var defs = mkSvg(doc, 'defs');
        var gradId = 'pp-ring-grad';
        var grad = mkSvg(doc, 'linearGradient', { id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
        for (var i = 0; i < ringSpec.stops.length; i += 1) {
          grad.appendChild(mkSvg(doc, 'stop', { offset: ringSpec.stops[i][0], 'stop-color': ringSpec.stops[i][1] }));
        }
        defs.appendChild(grad);
        svg.appendChild(defs);

        var trackRect = mkSvg(doc, 'rect', {
          x: '1',
          y: '1',
          width: String(Math.max(2, w - 2)),
          height: String(Math.max(2, h - 2)),
          rx: String(radius),
          ry: String(radius),
          stroke: ringSpec.track,
          'stroke-width': '2',
        });
        var progRect = mkSvg(doc, 'rect', {
          x: '1',
          y: '1',
          width: String(Math.max(2, w - 2)),
          height: String(Math.max(2, h - 2)),
          rx: String(radius),
          ry: String(radius),
          stroke: 'url(#' + gradId + ')',
          'stroke-width': '2.2',
          'stroke-linecap': 'round',
          'stroke-dasharray': String(perim),
          'stroke-dashoffset': String(perim),
        });
        svg.appendChild(trackRect);
        svg.appendChild(progRect);
        wrap.appendChild(svg);
        doc.body.appendChild(wrap);

        var remainMs = Math.max(80, HOLD_OPEN_DELAY_MS - HOLD_RING_DELAY_MS);
        var raf = reqRaf
          ? reqRaf(function () {
              setStyleVar(progRect, 'transition', 'stroke-dashoffset ' + remainMs + 'ms linear');
              progRect.setAttribute('stroke-dashoffset', '0');
            })
          : 0;

        return { el: wrap, raf: raf };
      }

      function prewarmActiveModelAssets(btn) {
        if (isDestroyed || currentMode === 'off') return;
        try {
          var grainMod = resolveGrainAssets(root);
          if (grainMod && typeof grainMod.getGrainTextures === 'function') {
            grainMod.getGrainTextures();
          }
          var oledMod = resolveOledScreenModule(root);
          if (oledMod && typeof oledMod.prewarmOledWallpaper === 'function') {
            var profile = resolvePrismThemeProfile(doc, root);
            var modeTag = profile.isLight ? 'light' : 'dark';
            var desc = resolveButtonBadgeDescriptor(btn);
            var targetKey = '6';
            if (desc) {
              if (desc.kind === 'element') {
                var zNum = Number(desc.slotZ) || 6;
                targetKey = zNum === 1 || zNum === 6 || zNum === 10 || zNum === 18 ? String(zNum) : 'standby';
              } else if (desc.kind === 'aux') {
                if (desc.auxId === 'orchestrator' && desc.shortLabel) {
                  if (/6C/i.test(desc.shortLabel)) targetKey = '6';
                  else if (/Ne/i.test(desc.shortLabel)) targetKey = '10';
                  else if (/Ar/i.test(desc.shortLabel)) targetKey = '18';
                  else if (/1H/i.test(desc.shortLabel)) targetKey = '1';
                  else if (/Op/i.test(desc.shortLabel)) targetKey = 'claude';
                  else targetKey = 'orchestrator';
                } else if (desc.miniKey === 'claude' || desc.miniKey === 'flash' || desc.miniKey === 'gpt' || desc.miniKey === 'orchestrator') {
                  targetKey = desc.miniKey;
                }
              }
            }
            oledMod.prewarmOledWallpaper(root, modeTag, targetKey);
          }
        } catch (e) {}
      }

      function cancelHold(skipEvictSchedule) {
        var hadHold = Boolean(holdState);
        if (holdState) {
          if (holdState.ringTimer) clearTimer(holdState.ringTimer);
          if (holdState.prewarmTimer) clearTimer(holdState.prewarmTimer);
          if (holdState.openTimer) clearTimer(holdState.openTimer);
          if (holdState.ring && holdState.ring.raf && cancelRaf) {
            cancelRaf(holdState.ring.raf);
          }
          if (holdState.ring && holdState.ring.el) {
            safeRemove(holdState.ring.el);
          }
          holdState = null;
        }
        if (doc && typeof doc.querySelectorAll === 'function') {
          try {
            var strayRings = doc.querySelectorAll('.pp-hold-ring');
            for (var i = 0; i < strayRings.length; i += 1) {
              safeRemove(strayRings[i]);
            }
          } catch (e) {}
        }
        if (hadHold && !skipEvictSchedule && !overlayEl && !isDestroyed && currentMode === 'on') {
          scheduleIdleResourceEviction();
        }
      }

      function armSuppressNextClick() {
        suppressUntilMs = readClockMs() + SUPPRESS_CLICK_WINDOW_MS;
        if (suppressTimer) clearTimer(suppressTimer);
        suppressTimer = setTimer(function () {
          suppressTimer = 0;
          suppressUntilMs = 0;
        }, SUPPRESS_CLICK_WINDOW_MS + 20);
      }

      function dismissExternalDropdown(ctx) {
        if (ctx && typeof ctx.setIsOpen === 'function') { try { ctx.setIsOpen(false); } catch (e) {} }
        if (typeof opts.onDismissMenu === 'function') { try { opts.onDismissMenu(); } catch (e2) {} }
      }
      function syncTriggerLabelDomIfPresent(labelText) {
        if (!doc || !labelText) return;
        var buttons = collectVisibleModelTriggerButtons(doc, configuredTriggerOpt);
        for (var i = 0; i < buttons.length; i += 1) {
          var btn = buttons[i];
          if (!btn || typeof btn.querySelector !== 'function') continue;
          var labelNode = btn.querySelector('[data-prism-trigger-label]');
          if (labelNode) {
            isMutatingBadge = true;
            try {
              labelNode.textContent = String(labelText);
            } finally {
              isMutatingBadge = false;
            }
            continue;
          }
          if (btn.childNodes && btn.childNodes.length > 0) {
            for (var cn = 0; cn < btn.childNodes.length; cn += 1) {
              var ch = btn.childNodes[cn];
              if (ch && ch.nodeType === 3 && String(ch.nodeValue || '').trim()) {
                isMutatingBadge = true;
                try {
                  ch.nodeValue = String(labelText);
                } finally {
                  isMutatingBadge = false;
                }
                break;
              }
            }
          }
        }
      }
      function buildSelectionCallbackMeta() {
        var activeEff = selectedZ !== null ? (activeEffortByZ.get(selectedZ) || '') : (selectedAuxIndex !== null ? (activeEffortByAux.get(selectedAuxIndex) || '') : '');
        return {
          orchLatched: Boolean(orchLatched), selectedZ: selectedZ, selectedAuxIndex: selectedAuxIndex, effort: activeEff,
          planner: activeHostCtx && activeHostCtx.orchestratorPick ? activeHostCtx.orchestratorPick.model || null : null,
          stageMode: stageMode
        };
      }
      function commitModelOption(ctx, targetOption) {
        if (!targetOption || !targetOption.label) return false;
        var targetCtx = ctx || declarativeCtx;
        targetCtx.selectedModel = targetOption;
        if (targetCtx !== declarativeCtx) declarativeCtx.selectedModel = targetOption;
        syncTriggerLabelDomIfPresent(targetOption.label);
        if (typeof targetOption.onClick === 'function') { try { targetOption.onClick(targetOption); } catch (e0) {} }
        if (targetCtx && typeof targetCtx.onSelectModel === 'function') { try { targetCtx.onSelectModel(targetOption, buildSelectionCallbackMeta()); } catch (e1) {} }
        if (typeof opts.onSelectModel === 'function') { try { opts.onSelectModel(targetOption, buildSelectionCallbackMeta()); } catch (e2) {} }
        syncMiniKeycapBadges();
        return true;
      }
      /* Choose preferred effort level when switching to an element */
      function resolveLevelForElement(entry, preferredEffort) {
        if (!entry || !entry.levels || !entry.levels.length) return null;
        var remembered = activeEffortByZ.get(entry.slotZ);
        var candidates = [preferredEffort, remembered, 'high', 'medium'];
        for (var c = 0; c < candidates.length; c += 1) {
          var want = candidates[c];
          if (!want) continue;
          for (var i = 0; i < entry.levels.length; i += 1) {
            if (entry.levels[i].effort === want) return entry.levels[i];
          }
        }
        return entry.levels[entry.levels.length - 1];
      }

      function resolveLevelForAuxSlot(auxSlot, preferredEffort) {
        if (!auxSlot || !auxSlot.levels || !auxSlot.levels.length) return null;
        var remembered = activeEffortByAux.get(auxSlot.slotIndex);
        var candidates = [preferredEffort, remembered, 'high', 'medium'];
        for (var c = 0; c < candidates.length; c += 1) {
          var want = candidates[c];
          if (!want) continue;
          for (var i = 0; i < auxSlot.levels.length; i += 1) {
            if (auxSlot.levels[i].effort === want) return auxSlot.levels[i];
          }
        }
        for (var j = 0; j < auxSlot.levels.length; j += 1) {
          if (auxSlot.defaultOption && auxSlot.levels[j].option === auxSlot.defaultOption) {
            return auxSlot.levels[j];
          }
        }
        return auxSlot.levels[0];
      }

      /* Build Orchestrator Planner Whitelist & Effort Option Registry */
      function buildOrchestratorRegistry(hostCtx) {
        var allowedZSet = new Set();
        var allowedAuxIdSet = new Set();
        var plannerByZ = new Map();
        var plannerByAuxId = new Map();
        var hasExplicitWhitelist = Boolean(
          hostCtx && Array.isArray(hostCtx.orchestratorPlanners) && hostCtx.orchestratorPlanners.length > 0
        );
        var latchCapable = Boolean(
          !hostCtx ||
            Array.isArray(hostCtx.orchestratorPlanners) ||
            (hostCtx.orchestratorPick && typeof hostCtx.orchestratorPick === 'object') ||
            hostCtx.orchestratorPlannerIndex instanceof Map ||
            hostCtx.orchestratorDefaultPlanner
        );

        function recordPlannerOpt(rawOpt, forcedEffKey) {
          if (!rawOpt) return;
          var optObj = typeof rawOpt === 'string' ? { label: rawOpt, value: rawOpt } : rawOpt;
          if (!optObj || typeof optObj.label !== 'string' || !optObj.label.trim()) return;
          var parsedEl = parseElementModelLabel(optObj);
          if (parsedEl) {
            allowedZSet.add(parsedEl.slotZ);
            var effEl = forcedEffKey ? normalizeEnEffortWord(forcedEffKey) : parsedEl.effort || 'high';
            if (!EFFORT_LABELS[effEl]) effEl = 'high';
            var zMap = plannerByZ.get(parsedEl.slotZ);
            if (!zMap) {
              zMap = new Map();
              plannerByZ.set(parsedEl.slotZ, zMap);
            }
            if (!zMap.has(effEl)) {
              zMap.set(effEl, optObj);
            }
            return;
          }
          var clsAux = classifyNonElementOption(optObj, forcedEffKey);
          if (clsAux && clsAux.groupKey && clsAux.groupKey !== 'orchestrator') {
            allowedAuxIdSet.add(clsAux.groupKey);
            var effAux = clsAux.variantEffort || 'high';
            var aMap = plannerByAuxId.get(clsAux.groupKey);
            if (!aMap) {
              aMap = new Map();
              plannerByAuxId.set(clsAux.groupKey, aMap);
            }
            if (!aMap.has(effAux)) {
              aMap.set(effAux, optObj);
            }
          }
        }

        if (hasExplicitWhitelist) {
          for (var i = 0; i < hostCtx.orchestratorPlanners.length; i += 1) {
            recordPlannerOpt(hostCtx.orchestratorPlanners[i], '');
          }
        }
        if (hostCtx && hostCtx.orchestratorPlannerIndex instanceof Map) {
          hostCtx.orchestratorPlannerIndex.forEach(function (innerMap) {
            if (!(innerMap instanceof Map)) return;
            innerMap.forEach(function (opt, effKey) {
              recordPlannerOpt(opt, String(effKey || ''));
            });
          });
        }

        if (allowedZSet.size === 0 && allowedAuxIdSet.size === 0) {
          /* Authoritative V12 Default Planner Whitelist: 10Ne Neon, 6C Carbon, 18Ar Argon, Claude Opus 5.5 */
          allowedZSet.add(10);
          allowedZSet.add(6);
          allowedZSet.add(18);
          allowedAuxIdSet.add('claude-opus');
        }

        return {
          latchCapable: latchCapable,
          allowedZSet: allowedZSet,
          allowedAuxIdSet: allowedAuxIdSet,
          plannerByZ: plannerByZ,
          plannerByAuxId: plannerByAuxId,
        };
      }

      function mergeOrderedLevelsWithPlannerMap(baseLevels, plannerMap) {
        var byEff = new Map();
        if (Array.isArray(baseLevels)) {
          for (var i = 0; i < baseLevels.length; i += 1) {
            var bl = baseLevels[i];
            if (bl && bl.effort) {
              byEff.set(bl.effort, {
                effort: bl.effort,
                label: bl.label,
                option: bl.option,
                modelOption: bl.modelOption || bl.option,
              });
            }
          }
        }
        if (plannerMap instanceof Map) {
          plannerMap.forEach(function (pOpt, effCode) {
            if (!byEff.has(effCode)) {
              byEff.set(effCode, {
                effort: effCode,
                label: EFFORT_LABELS[effCode] || effCode,
                option: pOpt,
                modelOption: pOpt,
              });
            }
          });
        }
        var out = [];
        for (var k = 0; k < EFFORT_ORDER.length; k += 1) {
          var ek = EFFORT_ORDER[k];
          if (byEff.has(ek)) out.push(byEff.get(ek));
        }
        byEff.forEach(function (lv, ek2) {
          if (EFFORT_ORDER.indexOf(ek2) === -1) out.push(lv);
        });
        if (out.length >= 2) {
          for (var m = 0; m < out.length; m += 1) {
            if (EFFORT_LABELS[out[m].effort]) {
              out[m].label = EFFORT_LABELS[out[m].effort];
            }
          }
        }
        return out;
      }

      function syncHitButtonsAvailabilityDom() {
        keyNodesByZ.forEach(function (btn, z) {
          var isAvailNow = availableByZ.has(z);
          btn.className = 'pp-hit-btn pp-key ' + (isAvailNow ? 'pp-key-avail' : 'pp-key-blind');
          if (z === selectedZ) btn.classList.add('is-levitated');
          btn.setAttribute('data-available', isAvailNow ? '1' : '0');
          if (isAvailNow) {
            btn.removeAttribute('tabindex');
            btn.removeAttribute('aria-disabled');
            btn.setAttribute('aria-pressed', z === selectedZ ? 'true' : 'false');
          } else {
            btn.setAttribute('tabindex', '-1');
            btn.setAttribute('aria-disabled', 'true');
            btn.removeAttribute('aria-pressed');
          }
        });
        for (var ai = 0; ai < auxKeyNodes.length; ai += 1) {
          var auxBtn = auxKeyNodes[ai];
          var aSlot = auxSlots[ai];
          if (!auxBtn || !aSlot) continue;
          var isAuxAvailNow = Boolean(aSlot.available);
          var isOrchBtn = ai === 0 && aSlot.id === 'orchestrator';
          auxBtn.className = 'pp-hit-btn pp-aux-key ' + (isAuxAvailNow ? 'pp-key-avail' : 'pp-key-blind');
          if (selectedAuxIndex === ai) auxBtn.classList.add('is-levitated');
          auxBtn.setAttribute('data-available', isAuxAvailNow ? '1' : '0');
          if (isOrchBtn) {
            auxBtn.setAttribute('data-latched', orchLatched ? '1' : '0');
            auxBtn.setAttribute('aria-pressed', orchLatched ? 'true' : 'false');
          } else if (isAuxAvailNow) {
            auxBtn.setAttribute('aria-pressed', selectedAuxIndex === ai ? 'true' : 'false');
          } else {
            auxBtn.removeAttribute('aria-pressed');
          }
          if (isAuxAvailNow) {
            auxBtn.removeAttribute('tabindex');
            auxBtn.removeAttribute('aria-disabled');
          } else {
            auxBtn.setAttribute('tabindex', '-1');
            auxBtn.setAttribute('aria-disabled', 'true');
          }
        }
      }

      function recomputeEffectiveAvailability() {
        var reg = orchRegistry || buildOrchestratorRegistry(activeHostCtx);
        if (!orchLatched) {
          availableEntries = fullAvailableEntries.slice();
          availableByZ = new Map(fullAvailableByZ);
          auxSlots = [];
          for (var i = 0; i < fullAuxSlots.length; i += 1) {
            var src = fullAuxSlots[i];
            auxSlots.push(
              Object.assign({}, src, {
                available: Boolean(src.available),
                levels: Array.isArray(src.levels) ? src.levels.slice() : [],
              })
            );
          }
        } else {
          availableEntries = [];
          availableByZ = new Map();
          for (var e = 0; e < fullAvailableEntries.length; e += 1) {
            var elEntry = fullAvailableEntries[e];
            if (!reg.allowedZSet.has(elEntry.slotZ)) continue;
            var mergedElLevels = mergeOrderedLevelsWithPlannerMap(
              elEntry.levels,
              reg.plannerByZ.get(elEntry.slotZ)
            );
            var clonedEntry = Object.assign({}, elEntry, {
              levels: mergedElLevels,
            });
            availableEntries.push(clonedEntry);
            availableByZ.set(elEntry.slotZ, clonedEntry);
          }
          auxSlots = [];
          for (var k = 0; k < fullAuxSlots.length; k += 1) {
            var aSrc = fullAuxSlots[k];
            if (k === 0 && aSrc.id === 'orchestrator') {
              auxSlots.push(
                Object.assign({}, aSrc, {
                  available: Boolean(aSrc.available),
                  levels: [],
                })
              );
            } else {
              var allowedInOrch = Boolean(aSrc.available && reg.allowedAuxIdSet.has(aSrc.id));
              var mergedAuxLevels = allowedInOrch
                ? mergeOrderedLevelsWithPlannerMap(aSrc.levels, reg.plannerByAuxId.get(aSrc.id))
                : Array.isArray(aSrc.levels)
                ? aSrc.levels.slice()
                : [];
              auxSlots.push(
                Object.assign({}, aSrc, {
                  available: allowedInOrch,
                  levels: mergedAuxLevels,
                })
              );
            }
          }
        }
        syncHitButtonsAvailabilityDom();
      }

      function resolvePlannerCandidateRef(candidate) {
        if (!candidate) return null;
        var optObj = typeof candidate === 'string' ? { label: candidate, value: candidate } : candidate;
        var parsedEl = parseElementModelLabel(optObj);
        if (parsedEl && availableByZ.has(parsedEl.slotZ)) {
          return { kind: 'element', z: parsedEl.slotZ, effort: parsedEl.effort || '' };
        }
        var clsAux = classifyNonElementOption(optObj, '');
        if (clsAux && clsAux.groupKey && clsAux.groupKey !== 'orchestrator') {
          for (var k = 1; k < auxSlots.length; k += 1) {
            if (auxSlots[k] && auxSlots[k].available && auxSlots[k].id === clsAux.groupKey) {
              return { kind: 'aux', auxIndex: k, effort: clsAux.variantEffort || '' };
            }
          }
        }
        /* Match short name inside parentheses e.g. "Orchestrator (Carbon)" */
        var rawText = typeof optObj.label === 'string' ? optObj.label : String(candidate || '');
        var parenM = /\(([^)]+)\)/.exec(rawText);
        if (parenM) {
          var innerHint = parenM[1].trim();
          var innerEl = parseElementModelLabel('Gemini 4 ' + innerHint);
          if (innerEl && availableByZ.has(innerEl.slotZ)) {
            return { kind: 'element', z: innerEl.slotZ, effort: innerEl.effort || '' };
          }
          if (/opus/i.test(innerHint)) {
            for (var op = 1; op < auxSlots.length; op += 1) {
              if (auxSlots[op] && auxSlots[op].available && auxSlots[op].id === 'claude-opus') {
                return { kind: 'aux', auxIndex: op, effort: '' };
              }
            }
          }
        }
        return null;
      }

      function ensureValidPlannerSelectedForOrch(preferredHint) {
        if (selectedZ !== null && availableByZ.has(selectedZ)) return;
        if (
          selectedAuxIndex !== null &&
          selectedAuxIndex > 0 &&
          auxSlots[selectedAuxIndex] &&
          auxSlots[selectedAuxIndex].available
        ) {
          return;
        }
        var hints = [
          preferredHint,
          activeHostCtx && activeHostCtx.orchestratorPick && activeHostCtx.orchestratorPick.model,
          activeHostCtx && activeHostCtx.orchestratorDefaultPlanner,
        ];
        for (var h = 0; h < hints.length; h += 1) {
          var ref = resolvePlannerCandidateRef(hints[h]);
          if (ref) {
            if (ref.kind === 'element') {
              selectedZ = ref.z;
              selectedAuxIndex = null;
              if (ref.effort) activeEffortByZ.set(ref.z, ref.effort);
              return;
            }
            if (ref.kind === 'aux') {
              selectedZ = null;
              selectedAuxIndex = ref.auxIndex;
              if (ref.effort) activeEffortByAux.set(ref.auxIndex, ref.effort);
              return;
            }
          }
        }
        var priorityZs = [10, 6, 18];
        for (var pz = 0; pz < priorityZs.length; pz += 1) {
          if (availableByZ.has(priorityZs[pz])) {
            selectedZ = priorityZs[pz];
            selectedAuxIndex = null;
            return;
          }
        }
        if (availableEntries.length > 0) {
          selectedZ = availableEntries[0].slotZ;
          selectedAuxIndex = null;
          return;
        }
        for (var ak = 1; ak < auxSlots.length; ak += 1) {
          if (auxSlots[ak] && auxSlots[ak].available) {
            selectedZ = null;
            selectedAuxIndex = ak;
            return;
          }
        }
      }

      function findHostOrchestratorOption(plannerNameHint) {
        var orchSlot = fullAuxSlots && fullAuxSlots[0] && fullAuxSlots[0].id === 'orchestrator' ? fullAuxSlots[0] : null;
        if (orchSlot && Array.isArray(orchSlot.allOptions) && orchSlot.allOptions.length > 0) {
          if (plannerNameHint) {
            var hintLower = String(plannerNameHint).toLowerCase();
            for (var i = 0; i < orchSlot.allOptions.length; i += 1) {
              var cand = orchSlot.allOptions[i];
              if (cand && typeof cand.label === 'string' && cand.label.toLowerCase().indexOf(hintLower) !== -1) {
                return cand;
              }
            }
          }
          if (orchSlot.defaultOption) return orchSlot.defaultOption;
          return orchSlot.allOptions[0];
        }
        if (activeHostCtx && Array.isArray(activeHostCtx.modelOptions)) {
          for (var j = 0; j < activeHostCtx.modelOptions.length; j += 1) {
            var mo = activeHostCtx.modelOptions[j];
            if (mo && typeof mo.label === 'string' && /orchestrator|编排|调度器/i.test(mo.label)) {
              return mo;
            }
          }
        }
        return { label: 'Orchestrator', value: 'orchestrator', modelId: 'orchestrator' };
      }

      function resolvePlannerOptionForPick(kind, zOrAuxId, effortCode, fallbackOpt) {
        var reg = orchRegistry;
        if (reg) {
          var map = kind === 'element' ? reg.plannerByZ.get(zOrAuxId) : reg.plannerByAuxId.get(zOrAuxId);
          if (map instanceof Map && map.size > 0) {
            if (effortCode && map.has(effortCode)) return map.get(effortCode);
            if (map.has('high')) return map.get('high');
            var firstVal = map.values().next();
            if (firstVal && !firstVal.done) return firstVal.value;
          }
        }
        return fallbackOpt || null;
      }

      function commitOrchestratorPlannerPick(ctx, plannerOpt) {
        if (!ctx || !plannerOpt) return false;
        var pick = ctx.orchestratorPick;
        if (!pick || typeof pick !== 'object') return false;
        var applied = false;
        try {
          var valToSelect =
            plannerOpt.value !== undefined && plannerOpt.value !== null && plannerOpt.value !== ''
              ? plannerOpt.value
              : plannerOpt.modelId || plannerOpt.label;
          if (typeof pick.select === 'function') {
            pick.select(valToSelect, plannerOpt);
            applied = true;
          }
          pick.model = plannerOpt;
        } catch (e) {}
        return applied;
      }

      function syncHostWithActiveState() {
        if (orchLatched) {
          if (selectedZ !== null && availableByZ.has(selectedZ)) {
            var elEntry = availableByZ.get(selectedZ);
            var elSlot = SLOT_BY_Z.get(selectedZ);
            var elChosen = resolveLevelForElement(elEntry, activeEffortByZ.get(selectedZ) || '');
            if (elChosen) activeEffortByZ.set(selectedZ, elChosen.effort);
            var elPlannerOpt = resolvePlannerOptionForPick(
              'element',
              selectedZ,
              elChosen ? elChosen.effort : 'high',
              elChosen ? elChosen.option : null
            );
            var orchOptEl = findHostOrchestratorOption(elEntry.name || (elSlot && elSlot.name) || '');
            activeCommittedElementZ = null;
            activeCommittedAuxBadge = {
              id: 'orchestrator',
              label: orchOptEl.label,
              shortLabel: formatOrchElementCompactBadge(selectedZ, elSlot),
              miniKey: 'orchestrator',
            };
            var didCommitOrchEl = commitModelOption(activeHostCtx, orchOptEl);
            var didPickEl = commitOrchestratorPlannerPick(activeHostCtx, elPlannerOpt);
            if (didCommitOrchEl || didPickEl) hasModified = true;
            syncMiniKeycapBadges();
            return;
          }
          if (selectedAuxIndex !== null && selectedAuxIndex > 0 && auxSlots[selectedAuxIndex]) {
            var aSlot = auxSlots[selectedAuxIndex];
            var aChosen = resolveLevelForAuxSlot(aSlot, activeEffortByAux.get(selectedAuxIndex) || '');
            if (aChosen) activeEffortByAux.set(selectedAuxIndex, aChosen.effort);
            var aFallbackOpt = (aChosen && aChosen.option) || aSlot.defaultOption;
            var aPlannerOpt = resolvePlannerOptionForPick(
              'aux',
              aSlot.id,
              aChosen ? aChosen.effort : 'high',
              aFallbackOpt
            );
            var orchOptAux = findHostOrchestratorOption(aSlot.shortLabel || aSlot.title || '');
            activeCommittedElementZ = null;
            activeCommittedAuxBadge = {
              id: 'orchestrator',
              label: orchOptAux.label,
              shortLabel: formatOrchAuxCompactBadge(aSlot.id, aSlot.shortLabel || aSlot.title),
              miniKey: 'orchestrator',
            };
            var didCommitOrchAux = commitModelOption(activeHostCtx, orchOptAux);
            var didPickAux = commitOrchestratorPlannerPick(activeHostCtx, aPlannerOpt);
            if (didCommitOrchAux || didPickAux) hasModified = true;
            syncMiniKeycapBadges();
            return;
          }
          return;
        }

        /* Standalone mode (orchLatched === false) */
        if (selectedZ !== null && availableByZ.has(selectedZ)) {
          var stEntry = availableByZ.get(selectedZ);
          var stChosen = resolveLevelForElement(stEntry, activeEffortByZ.get(selectedZ) || '');
          activeCommittedAuxBadge = null;
          activeCommittedElementZ = selectedZ;
          if (stChosen) {
            activeEffortByZ.set(selectedZ, stChosen.effort);
            if (commitModelOption(activeHostCtx, stChosen.option)) {
              hasModified = true;
            } else {
              syncMiniKeycapBadges();
            }
          }
          return;
        }
        if (selectedAuxIndex !== null && selectedAuxIndex >= 0 && auxSlots[selectedAuxIndex]) {
          var stAux = auxSlots[selectedAuxIndex];
          var stAuxChosen = resolveLevelForAuxSlot(stAux, activeEffortByAux.get(selectedAuxIndex) || '');
          var stOpt = (stAuxChosen && stAuxChosen.option) || stAux.defaultOption;
          if (stAuxChosen) activeEffortByAux.set(selectedAuxIndex, stAuxChosen.effort);
          var prevElemZForOrch = activeCommittedElementZ;
          activeCommittedElementZ = null;
          if (stOpt) {
            var stShortBadge =
              stAux.id === 'orchestrator'
                ? (prevElemZForOrch !== null
                    ? formatOrchElementCompactBadge(prevElemZForOrch)
                    : inferOrchCompactBadgeFromHost(activeHostCtx, stOpt.label))
                : resolveAuxTwoLetterBadgeCode(stAux.id, stAux.title || stOpt.label);
            activeCommittedAuxBadge = {
              id: stAux.id,
              label: stOpt.label,
              shortLabel: stShortBadge,
              miniKey: stAux.miniKey,
            };
            if (commitModelOption(activeHostCtx, stOpt)) {
              hasModified = true;
            } else {
              syncMiniKeycapBadges();
            }
          }
        }
      }

      function resolveInspectedElementZ() {
        if (hoveredZ !== null && availableByZ.has(hoveredZ)) return hoveredZ;
        if (inspectedBlindZ !== null) return inspectedBlindZ;
        if (blindFlashZ !== null && !availableByZ.has(blindFlashZ)) return blindFlashZ;
        if (selectedZ !== null) return selectedZ;
        if (availableEntries.length > 0) return availableEntries[0].slotZ;
        return 6;
      }

      function formatAntigravTierNote(activeEffortCode, isAvailable, isAuxSingle, zh, isOrchActive) {
        if (isOrchActive && isAvailable) {
          return zh ? '常规步骤卸载至 1H (~168 tok/s)' : 'Routine steps offloaded to 1H (~168 tok/s)';
        }
        if (!isAvailable) {
          return zh ? '暗刻阳极盲键 · 0.00U 锁定态' : 'Anodized Blind Key · 0.00U Locked';
        }
        if (isAuxSingle) {
          return zh ? '0.76U 反重力悬浮 + 自适应推理' : '0.76U Levitation + Adaptive Mode';
        }
        var code = String(activeEffortCode || 'high').toLowerCase();
        if (code.indexOf('xhigh') === 0 || code === 'max') {
          return zh ? 'Extra · 1.06U 满功率三环全息场' : 'Extra · 1.06U 3-Ring Holographic Field';
        }
        if (code.indexOf('high') === 0) {
          return zh ? 'High · 0.88U 折光微晶光柱悬浮' : 'High · 0.88U Crystal Pillar Lift';
        }
        if (code.indexOf('med') === 0) {
          return zh ? 'Medium · 0.64U 双磁通环均衡悬浮' : 'Medium · 0.64U Dual-Flux Balanced Lift';
        }
        return zh ? 'Low · 0.40U 轻盈疾速低延迟微浮' : 'Low · 0.40U Agile Low-Latency Float';
      }

      function formatSwitchSpecText(effortCode, switchName, isAvailable, isAuxSingle) {
        if (!isAvailable) return '0.00U · Matte PBT Standby';
        var sw = switchName || 'Crystal Prism';
        if (isAuxSingle) return 'Adaptive · 0.76U ' + sw;
        var code = String(effortCode || 'high').toLowerCase();
        if (code.indexOf('xhigh') === 0 || code === 'max') return 'XHigh · 1.06U ' + sw;
        if (code.indexOf('high') === 0) return 'High · 0.88U ' + sw;
        if (code.indexOf('med') === 0) return 'Med · 0.64U ' + sw;
        return 'Low · 0.40U ' + sw;
      }

      function resolveEffortLitDots(effortCode, isAvailable) {
        if (!isAvailable) return 0;
        var code = String(effortCode || 'high').toLowerCase();
        if (code.indexOf('xhigh') === 0 || code === 'max') return 4;
        if (code.indexOf('high') === 0) return 3;
        if (code.indexOf('med') === 0) return 2;
        return 1;
      }

      function resolveEffortShortBadge(effortCode) {
        var code = String(effortCode || 'high').toLowerCase();
        if (code.indexOf('xhigh') === 0 || code === 'max') return 'XHigh';
        if (code.indexOf('high') === 0) return 'High';
        if (code.indexOf('med') === 0) return 'Med';
        if (code === 'low' || code === 'minimal') return 'Low';
        return 'High';
      }

      function resolveCommittedCompareBaseline(zh) {
        if (selectedAuxIndex !== null && auxSlots[selectedAuxIndex] && auxSlots[selectedAuxIndex].available) {
          var sAux = auxSlots[selectedAuxIndex];
          if (sAux.slotIndex === 0 && sAux.id === 'orchestrator') return null;
          var sAuxLvl = resolveLevelForAuxSlot(sAux, '');
          var sAuxEff = sAuxLvl ? sAuxLvl.effort : 'high';
          return {
            kind: 'aux',
            key: sAux.slotIndex,
            shortTag: sAux.shortLabel || sAux.badgeCode || 'Aux',
            bench: resolveBenchmarkMetrics(sAux.id, sAuxEff, zh, true),
          };
        }
        if (selectedZ !== null && availableByZ.has(selectedZ)) {
          var sEntry = availableByZ.get(selectedZ);
          var sSlot = SLOT_BY_Z.get(selectedZ);
          var sEff = activeEffortByZ.get(selectedZ) || '';
          if (!sEff) {
            var sDef = resolveLevelForElement(sEntry, '');
            sEff = sDef ? sDef.effort : 'high';
          }
          return {
            kind: 'element',
            key: selectedZ,
            shortTag: sSlot ? sSlot.numLabel + sSlot.symbol : String(selectedZ),
            bench: resolveBenchmarkMetrics(selectedZ, sEff, zh, true),
          };
        }
        return null;
      }

      function attachCompareDeltas(rows, baseBench) {
        if (!Array.isArray(rows)) return [];
        var baseVals = baseBench && Array.isArray(baseBench.rawValues) ? baseBench.rawValues : null;
        var baseRows = baseBench && Array.isArray(baseBench.rows) ? baseBench.rows : null;
        var out = [];
        for (var i = 0; i < rows.length; i += 1) {
          var r = rows[i];
          var deltaText = '';
          var deltaDir = '';
          var sameMetric = !baseRows || !baseRows[i] || baseRows[i].label === r.label;
          if (sameMetric && baseVals && typeof r.raw === 'number' && typeof baseVals[i] === 'number') {
            var diff = r.raw - baseVals[i];
            if (Math.abs(diff) >= 0.05) {
              deltaDir = diff > 0 ? 'up' : 'down';
              var sign = diff > 0 ? '+' : '';
              if (r.unit === 'pct') {
                deltaText = sign + diff.toFixed(1) + '%';
              } else {
                deltaText = sign + Math.round(diff);
              }
            }
          }
          out.push({
            label: r.label,
            valText: r.valText,
            fillPct: r.fillPct,
            deltaText: deltaText,
            deltaDir: deltaDir,
          });
        }
        return out;
      }

      function resolveCommittedTelemetrySpec(zh) {
        if (selectedAuxIndex !== null && auxSlots[selectedAuxIndex] && auxSlots[selectedAuxIndex].available) {
          var sAux = auxSlots[selectedAuxIndex];
          var isOrchAux = Boolean(orchLatched && sAux.slotIndex > 0);
          var sAuxLvl = resolveLevelForAuxSlot(sAux, '');
          var sAuxEff = sAuxLvl ? sAuxLvl.effort : 'high';
          var sAuxEffLabel = EFFORT_LABELS[sAuxEff] || 'High';
          return {
            accentHex: isOrchAux ? '#8B5CF6' : sAux.accentHex || '#3B82F6',
            secondaryHex: isOrchAux ? '#F5B942' : sAux.secondaryHex || sAux.accentHex || '#67E8F9',
            accentHexLight: isOrchAux ? '#6D28D9' : sAux.accentHexLight || sAux.accentHex || '#1D4ED8',
            secondaryHexLight: isOrchAux ? '#B45309' : sAux.secondaryHexLight || sAux.secondaryHex || sAux.accentHexLight || '#0284C7',
            glowRgba: isOrchAux ? 'rgba(139, 92, 246, 0.30)' : sAux.glowRgba || 'rgba(59, 130, 246, 0.26)',
            compactPillLabel: isOrchAux
              ? 'ORCH · ' + (sAux.shortLabel || 'Aux') + ' + 1H'
              : (sAux.shortLabel || 'Aux') + ' · ' + sAuxEffLabel,
            switchSpec: formatSwitchSpecText(
              sAuxEff,
              (sAux.shortLabel || 'Aux') + ' Switch',
              true,
              !sAux.levels || sAux.levels.length <= 1
            ),
            litDots: resolveEffortLitDots(sAuxEff, true),
            telemetrySeed: 20 + sAux.slotIndex * 3,
          };
        }
        var cz = selectedZ !== null && availableByZ.has(selectedZ) ? selectedZ : 6;
        var cEntry = availableByZ.get(cz) || null;
        var cProf = ELEMENT_SPEC_PROFILES[cz] || ELEMENT_SPEC_PROFILES[6];
        var cEff = activeEffortByZ.get(cz) || '';
        if (!cEff && cEntry) {
          var cDef = resolveLevelForElement(cEntry, '');
          cEff = cDef ? cDef.effort : 'high';
        }
        var isOrchMain = Boolean(orchLatched);
        var cSlotMeta = SLOT_BY_Z.get(cz) || ELEMENTS_90[5];
        var cTag = cSlotMeta ? String(cz) + cSlotMeta.symbol : '6C';
        var cEffLabel = EFFORT_LABELS[cEff || 'high'] || 'High';
        return {
          accentHex: isOrchMain ? '#8B5CF6' : cProf.accentHex,
          secondaryHex: isOrchMain ? '#F5B942' : cProf.secondaryHex || cProf.accentHex,
          accentHexLight: isOrchMain ? '#6D28D9' : cProf.accentHexLight || cProf.accentHex,
          secondaryHexLight: isOrchMain ? '#B45309' : cProf.secondaryHexLight || cProf.accentHexLight || cProf.accentHex,
          glowRgba: isOrchMain ? 'rgba(139, 92, 246, 0.28)' : cProf.glowRgba,
          compactPillLabel: isOrchMain ? 'ORCH · ' + cTag + ' + 1H' : cTag + ' · ' + cEffLabel,
          switchSpec: formatSwitchSpecText(
            cEff || 'high',
            zh ? cProf.switchSpecZh : cProf.switchSpecEn,
            Boolean(cEntry),
            cEntry && cEntry.levels ? cEntry.levels.length <= 1 : false
          ),
          litDots: resolveEffortLitDots(cEff || 'high', Boolean(cEntry)),
          telemetrySeed: cz,
        };
      }

      function resolveActivePlannerTopologyLabel() {
        if (selectedAuxIndex !== null && selectedAuxIndex > 0 && auxSlots[selectedAuxIndex]) {
          var aSlot = auxSlots[selectedAuxIndex];
          var aEff = activeEffortByAux.get(selectedAuxIndex) || 'high';
          return (aSlot.shortLabel || 'Opus') + ' ' + resolveEffortShortBadge(aEff);
        }
        var pz = selectedZ !== null ? selectedZ : 6;
        var pSlot = SLOT_BY_Z.get(pz);
        var pEff = activeEffortByZ.get(pz) || 'high';
        return (pSlot ? pSlot.numLabel + pSlot.symbol : '6C') + ' ' + resolveEffortShortBadge(pEff);
      }

      /* Build state payload for 3D Renderer, OLED Screen & V13.1 CNC Triptych Console */
      function buildCurrentDeckPayload(zh) {
        var currentSessionOpt = activeHostCtx && activeHostCtx.selectedModel;
        var currentParsed = parseElementModelLabel(currentSessionOpt);
        var sessionBanner = null;
        if (selectedZ === null && !orchLatched && currentSessionOpt && currentSessionOpt.label && !currentParsed) {
          var rawName = String(currentSessionOpt.label);
          sessionBanner = zh
            ? '当前会话：' + rawName + ' · 点选已点亮键帽即可切换'
            : 'Current session: ' + rawName + ' · Click a lit keycap to switch';
        }

        var runnerBench1H = orchLatched ? resolveBenchmarkMetrics(1, 'high', zh, true) : null;
        var activePlannerTopo = resolveActivePlannerTopologyLabel();

        /* Optional 1-second standby chemistry flash banner on OLED when any of the 114 blind keys is pressed */
        var blindFlashSlot = blindFlashZ !== null ? SLOT_BY_Z.get(blindFlashZ) || null : null;
        var blindFlashBannerText = '';
        if (blindFlashSlot) {
          blindFlashBannerText =
            blindFlashSlot.numLabel +
            ' ' +
            blindFlashSlot.symbol +
            ' · ' +
            blindFlashSlot.name +
            ' · ' +
            blindFlashSlot.mass +
            ' · STANDBY';
        }

        /* Priority:
           1) Hovered Aux (except #0 Orch when already latched -> keep active planner visible!)
           2) Hovered Available Element
           3) Inspected Blind Element / Aux (including dimmed non-planners in Orch mode)
           4) Selected Aux
           5) Selected / Default Element */
        var inspectAuxSlot = null;
        var isHoverPreview = false;
        var effectiveHoverAux =
          hoveredAuxIndex === 0 && orchLatched ? null : hoveredAuxIndex;

        if (effectiveHoverAux !== null && auxSlots[effectiveHoverAux]) {
          inspectAuxSlot = auxSlots[effectiveHoverAux];
          isHoverPreview = effectiveHoverAux !== selectedAuxIndex;
        } else if (hoveredZ !== null && availableByZ.has(hoveredZ)) {
          inspectAuxSlot = null;
          isHoverPreview = hoveredZ !== selectedZ;
        } else if (inspectedBlindZ !== null) {
          inspectAuxSlot = null;
          isHoverPreview = true;
        } else if (inspectedBlindAuxIndex !== null && auxSlots[inspectedBlindAuxIndex]) {
          inspectAuxSlot = auxSlots[inspectedBlindAuxIndex];
          isHoverPreview = true;
        } else if (blindFlashZ !== null && !availableByZ.has(blindFlashZ)) {
          inspectAuxSlot = null;
          isHoverPreview = false;
        } else if (selectedAuxIndex !== null && auxSlots[selectedAuxIndex]) {
          inspectAuxSlot = auxSlots[selectedAuxIndex];
          isHoverPreview = false;
        }

        var baseline = !orchLatched && isHoverPreview ? resolveCommittedCompareBaseline(zh) : null;

        if (inspectAuxSlot) {
          var fullOrigAux = fullAuxSlots[inspectAuxSlot.slotIndex] || inspectAuxSlot;
          var isNonPlannerAuxLocked = Boolean(
            orchLatched &&
              inspectAuxSlot.slotIndex > 0 &&
              fullOrigAux &&
              fullOrigAux.available &&
              !inspectAuxSlot.available
          );

          var activeAuxEff = '';
          if (inspectAuxSlot.available && inspectAuxSlot.levels.length > 0) {
            var chosenAuxLvl = resolveLevelForAuxSlot(inspectAuxSlot, '');
            activeAuxEff = chosenAuxLvl ? chosenAuxLvl.effort : inspectAuxSlot.levels[0].effort;
          }
          var auxLevelsOut = [];
          if (inspectAuxSlot.available) {
            for (var ai = 0; ai < inspectAuxSlot.levels.length; ai += 1) {
              var alv = inspectAuxSlot.levels[ai];
              auxLevelsOut.push({
                effort: alv.effort,
                label: alv.label,
                active: alv.effort === activeAuxEff,
                option: alv.option,
              });
            }
          }

          var isOrchTogglePreview = inspectAuxSlot.slotIndex === 0 && inspectAuxSlot.id === 'orchestrator';
          var isOrchAuxPlanner = Boolean(orchLatched && !isOrchTogglePreview && inspectAuxSlot.available);
          var auxBenchKey = isOrchTogglePreview ? 6 : inspectAuxSlot.id;
          var auxBenchKnown = Boolean(inspectAuxSlot.available || isNonPlannerAuxLocked);
          var auxBench = resolveBenchmarkMetrics(auxBenchKey, activeAuxEff || 'high', zh, auxBenchKnown);
          var useAuxCompare = Boolean(
            baseline &&
              inspectAuxSlot.available &&
              !isOrchTogglePreview &&
              !(baseline.kind === 'aux' && baseline.key === inspectAuxSlot.slotIndex)
          );
          var auxRowsWithDelta = useAuxCompare ? attachCompareDeltas(auxBench.rows, baseline.bench) : auxBench.rows;

          var auxDisplayTitle = isOrchAuxPlanner
            ? 'Orch · ' + inspectAuxSlot.title.replace(/^Claude\s+/i, '')
            : inspectAuxSlot.title;
          var auxOledBadge = isOrchAuxPlanner
            ? 'ORCH · ' + inspectAuxSlot.badgeCode
            : inspectAuxSlot.shortLabel;
          var auxCardBadge = isOrchAuxPlanner
            ? 'ORCH · ' + inspectAuxSlot.badgeCode + ' · DUAL-CORE'
            : inspectAuxSlot.badgeCode + ' · ' + inspectAuxSlot.roleTag;
          var auxStateText = isNonPlannerAuxLocked
            ? zh
              ? '编排态不可选'
              : 'NON-PLANNER'
            : !inspectAuxSlot.available
            ? zh
              ? '预留槽位'
              : 'RESERVED'
            : isOrchTogglePreview
            ? zh
              ? '点击锁存双核编排'
              : 'CLICK TO LATCH ORCH'
            : isHoverPreview
            ? zh
              ? '悬停对比'
              : 'COMPARE'
            : zh
            ? '当前激活'
            : 'ACTIVE';

          var auxSingle = auxLevelsOut.length <= 1;
          var auxMicroTags = zh ? inspectAuxSlot.scenesZh : inspectAuxSlot.scenesEn;
          return {
            inspectKind: 'aux',
            auxSlot: inspectAuxSlot,
            slot: null,
            availEntry: null,
            bentoSpec: {
              kind: 'aux',
              auxIndex: inspectAuxSlot.slotIndex,
              z: null,
              badge: auxCardBadge,
              stateText: auxStateText,
              title: auxDisplayTitle,
              shortTag: inspectAuxSlot.shortLabel || inspectAuxSlot.badgeCode,
              microTags: Array.isArray(auxMicroTags) ? auxMicroTags.slice(0, 3) : [],
              tagline: isNonPlannerAuxLocked
                ? zh
                  ? '该模型不在编排主核白名单内 · 解锁 #0 Orch 后可单独调用'
                  : 'Not in orchestratorPlanners whitelist · Unlatch #0 Orch to use standalone'
                : zh
                ? inspectAuxSlot.taglineZh
                : inspectAuxSlot.taglineEn,
              scores: auxBench.ratios,
              benchRows: auxRowsWithDelta,
              compactText: auxBench.compactText,
              runnerRatios: isOrchAuxPlanner && runnerBench1H ? runnerBench1H.ratios : null,
              compareRatios: useAuxCompare ? baseline.bench.ratios : null,
              compareTag: useAuxCompare ? baseline.shortTag : '',
              accentHex: isOrchAuxPlanner ? '#8B5CF6' : inspectAuxSlot.accentHex,
              secondaryHex: isOrchAuxPlanner ? '#F5B942' : inspectAuxSlot.secondaryHex || inspectAuxSlot.accentHex,
              accentHexLight: isOrchAuxPlanner ? '#6D28D9' : inspectAuxSlot.accentHexLight || inspectAuxSlot.accentHex,
              secondaryHexLight: isOrchAuxPlanner ? '#B45309' : inspectAuxSlot.secondaryHexLight || inspectAuxSlot.secondaryHex || inspectAuxSlot.accentHexLight,
              glowRgba: isOrchAuxPlanner ? 'rgba(139, 92, 246, 0.30)' : inspectAuxSlot.glowRgba,
              isAvailable: inspectAuxSlot.available,
              levels: auxLevelsOut,
              activeEffort: activeAuxEff,
              tierNote: isNonPlannerAuxLocked
                ? zh
                  ? 'NON-PLANNER · 编排态锁定'
                  : 'NON-PLANNER · Locked in Orch'
                : isOrchTogglePreview
                ? zh
                  ? '#0 机械自锁开关 · 主核 + 1H 并发'
                  : '#0 Latching Switch · Planner + 1H'
                : formatAntigravTierNote(activeAuxEff, inspectAuxSlot.available, auxSingle, zh, isOrchAuxPlanner),
              switchSpec: formatSwitchSpecText(
                activeAuxEff,
                inspectAuxSlot.shortLabel + ' Switch',
                inspectAuxSlot.available,
                auxSingle
              ),
              litDots: resolveEffortLitDots(activeAuxEff, inspectAuxSlot.available),
              plannerTopoLabel: activePlannerTopo,
              telemetrySeed: 20 + inspectAuxSlot.slotIndex * 3,
            },
            deckInfo: {
              z: 0,
              isAuxModel: true,
              auxId: inspectAuxSlot.oledAuxId || inspectAuxSlot.id,
              auxSlotId: inspectAuxSlot.id,
              auxIndex: inspectAuxSlot.slotIndex,
              orchLatched: isOrchAuxPlanner,
              orchUnsupported: isNonPlannerAuxLocked,
              badgeText: auxOledBadge,
              badgeCode: inspectAuxSlot.badgeCode,
              roleTag: inspectAuxSlot.roleTag,
              numLabel: inspectAuxSlot.badgeCode,
              groupCode: 'AUX',
              symbol: inspectAuxSlot.shortLabel,
              elementEn: inspectAuxSlot.title,
              mass: '512K',
              title: auxDisplayTitle,
              chemLabel: inspectAuxSlot.badgeCode + ' · ' + inspectAuxSlot.title,
              subtitle: zh ? inspectAuxSlot.taglineZh : inspectAuxSlot.taglineEn,
              sessionBanner: sessionBanner,
              blindFlash: Boolean(blindFlashBannerText && !isHoverPreview),
              blindFlashBanner: !isHoverPreview ? blindFlashBannerText : '',
              isAvailable: Boolean(inspectAuxSlot.available),
              unreleasedText: isNonPlannerAuxLocked
                ? zh
                  ? 'NON-PLANNER · 编排态不可选'
                  : 'NON-PLANNER · Locked in Orch'
                : inspectAuxSlot.available
                ? ''
                : zh
                ? '未开放 · 副盘暗刻盲键'
                : 'Reserved · Blind Macro Key',
              effortTitle: zh ? '思考深度' : 'Thinking Mode',
              levels: auxLevelsOut,
              hoveredEffort: hoveredEffort,
              pressedEffort: pressedEffort,
              dragEffortProgress: dragEffortProgress,
            },
          };
        }

        var inspectZ = resolveInspectedElementZ();
        var slot = SLOT_BY_Z.get(inspectZ) || ELEMENTS_90[5];
        var availEntry = availableByZ.get(inspectZ) || null;
        var fullElemEntry = fullAvailableByZ.get(inspectZ) || null;
        var groupInfo = GROUP_META[slot.group] || GROUP_META.transition;
        var elProf = ELEMENT_SPEC_PROFILES[slot.z] || ELEMENT_SPEC_PROFILES.fallback;

        if (availEntry) {
          var lore = ELEMENT_LORE[slot.z];
          var subtitle = lore
            ? zh
              ? lore.zh
              : lore.en
            : zh
            ? '第 ' + slot.col + ' 族 · ' + groupInfo.zh + ' · Google 元素直连模型'
            : 'Group ' + slot.col + ' · ' + groupInfo.en + ' · Google Element Series';

          var currentSelEff = selectedZ !== null ? activeEffortByZ.get(selectedZ) || '' : '';
          var activeEff = selectedZ === slot.z ? activeEffortByZ.get(slot.z) || '' : '';
          if (!activeEff) {
            var defLvl = resolveLevelForElement(availEntry, currentSelEff);
            activeEff = defLvl ? defLvl.effort : '';
          }

          var levelsOut = [];
          for (var li = 0; li < availEntry.levels.length; li += 1) {
            var lv = availEntry.levels[li];
            levelsOut.push({
              effort: lv.effort,
              label: lv.label,
              active: lv.effort === activeEff,
              option: lv.option,
            });
          }

          var elBench = resolveBenchmarkMetrics(slot.z, activeEff, zh, true);
          var isOrchElemPlanner = Boolean(orchLatched);
          var useElemCompare = Boolean(
            baseline && !(baseline.kind === 'element' && baseline.key === slot.z)
          );
          var elemRowsWithDelta = useElemCompare ? attachCompareDeltas(elBench.rows, baseline.bench) : elBench.rows;
          var elemDisplayTitle = isOrchElemPlanner
            ? 'Orch · ' + (availEntry.name || slot.name)
            : availEntry.baseName;
          var elemOledBadge = isOrchElemPlanner
            ? 'ORCH · ' + slot.numLabel + slot.symbol
            : slot.numLabel + slot.symbol;
          var elemCardBadge = isOrchElemPlanner
            ? 'ORCH · ' + slot.numLabel + ' ' + slot.symbol + ' · +1H'
            : slot.numLabel + ' ' + slot.symbol + ' · ' + elProf.roleTag;
          var elMicroTags = zh ? elProf.scenesZh : elProf.scenesEn;

          return {
            inspectKind: 'element',
            auxSlot: null,
            slot: slot,
            availEntry: availEntry,
            bentoSpec: {
              kind: 'element',
              auxIndex: null,
              z: slot.z,
              badge: elemCardBadge,
              stateText:
                selectedZ === slot.z
                  ? hoveredAuxIndex === 0 && orchLatched
                    ? zh
                      ? '编排锁存 · 点 #0 解锁'
                      : 'ORCH LATCHED'
                    : zh
                    ? '当前激活'
                    : 'ACTIVE'
                  : zh
                  ? '悬停对比'
                  : 'COMPARE',
              title: elemDisplayTitle,
              shortTag: slot.numLabel + slot.symbol,
              microTags: Array.isArray(elMicroTags) ? elMicroTags.slice(0, 3) : [],
              tagline: zh ? elProf.taglineZh : elProf.taglineEn,
              scores: elBench.ratios,
              benchRows: elemRowsWithDelta,
              compactText: elBench.compactText,
              runnerRatios: isOrchElemPlanner && runnerBench1H ? runnerBench1H.ratios : null,
              compareRatios: useElemCompare ? baseline.bench.ratios : null,
              compareTag: useElemCompare ? baseline.shortTag : '',
              accentHex: isOrchElemPlanner ? '#8B5CF6' : elProf.accentHex,
              secondaryHex: isOrchElemPlanner ? '#F5B942' : elProf.secondaryHex || elProf.accentHex,
              accentHexLight: isOrchElemPlanner ? '#6D28D9' : elProf.accentHexLight || elProf.accentHex,
              secondaryHexLight: isOrchElemPlanner ? '#B45309' : elProf.secondaryHexLight || elProf.accentHexLight || elProf.accentHex,
              glowRgba: isOrchElemPlanner ? 'rgba(139, 92, 246, 0.28)' : elProf.glowRgba,
              isAvailable: true,
              levels: levelsOut,
              activeEffort: activeEff,
              tierNote: formatAntigravTierNote(activeEff, true, levelsOut.length <= 1, zh, isOrchElemPlanner),
              switchSpec: formatSwitchSpecText(
                activeEff,
                zh ? elProf.switchSpecZh : elProf.switchSpecEn,
                true,
                levelsOut.length <= 1
              ),
              litDots: resolveEffortLitDots(activeEff, true),
              plannerTopoLabel: activePlannerTopo,
              telemetrySeed: slot.z,
            },
            deckInfo: {
              z: slot.z,
              isAuxModel: false,
              orchLatched: isOrchElemPlanner,
              orchUnsupported: false,
              badgeText: elemOledBadge,
              roleTag: elProf.roleTag,
              numLabel: slot.numLabel,
              groupCode: 'G' + slot.col,
              symbol: slot.symbol,
              elementEn: availEntry.name || slot.name,
              mass: slot.mass,
              title: elemDisplayTitle,
              chemLabel: slot.numLabel + ' ' + slot.symbol + ' · ' + availEntry.name + (zh ? ' (' + slot.zh + ')' : ''),
              subtitle: subtitle,
              sessionBanner: sessionBanner,
              blindFlash: Boolean(blindFlashBannerText && !isHoverPreview),
              blindFlashBanner: !isHoverPreview ? blindFlashBannerText : '',
              isAvailable: true,
              unreleasedText: '',
              effortTitle: zh ? '思考深度' : 'Thinking Level',
              levels: levelsOut,
              hoveredEffort: hoveredEffort,
              pressedEffort: pressedEffort,
              dragEffortProgress: dragEffortProgress,
            },
          };
        }

        /* Non-Planner Element Dimmed under Orchestrator Mode (e.g. 1H Hydrogen) */
        if (orchLatched && fullElemEntry) {
          var lockedElBench = resolveBenchmarkMetrics(slot.z, 'high', zh, true);
          return {
            inspectKind: 'blind-element',
            auxSlot: null,
            slot: slot,
            availEntry: null,
            bentoSpec: {
              kind: 'blind-element',
              auxIndex: null,
              z: slot.z,
              badge: slot.numLabel + ' ' + slot.symbol + ' · NON-PLANNER',
              stateText: zh ? '编排态不可选' : 'LOCKED IN ORCH',
              title: fullElemEntry.baseName,
              shortTag: slot.numLabel + slot.symbol,
              microTags: zh ? ['编排态锁定', '1H 后台执行', '解锁可直连'] : ['Orch Locked', '1H Runner', 'Standalone'],
              tagline: zh
                ? slot.z === 1
                  ? '编排态下 1H 自动作为后台高速执行核 (~168 tok/s)，不可设为主规划核'
                  : '该元素不在编排主核白名单内 · 解锁 #0 Orch 可单独调用'
                : 'Not in orchestratorPlanners whitelist · Unlatch #0 Orch for standalone use',
              scores: lockedElBench.ratios,
              benchRows: lockedElBench.rows,
              compactText: lockedElBench.compactText,
              runnerRatios: null,
              compareRatios: null,
              compareTag: '',
              accentHex: elProf.accentHex,
              accentHexLight: elProf.accentHexLight || elProf.accentHex,
              glowRgba: elProf.glowRgba,
              isAvailable: false,
              levels: [],
              activeEffort: '',
              tierNote: zh ? 'NON-PLANNER · 编排态不可作主核' : 'NON-PLANNER · Locked in Orch',
              switchSpec: '0.00U · Orch Locked',
              litDots: 0,
              plannerTopoLabel: activePlannerTopo,
              telemetrySeed: slot.z,
            },
            deckInfo: {
              z: slot.z,
              isAuxModel: false,
              orchLatched: false,
              orchUnsupported: true,
              badgeText: slot.numLabel + slot.symbol,
              numLabel: slot.numLabel,
              groupCode: 'G' + slot.col,
              symbol: slot.symbol,
              elementEn: fullElemEntry.name || slot.name,
              mass: slot.mass,
              title: fullElemEntry.baseName,
              chemLabel: slot.numLabel + ' ' + slot.symbol + ' · ' + (fullElemEntry.name || slot.name),
              subtitle: zh ? elProf.taglineZh : elProf.taglineEn,
              sessionBanner: sessionBanner,
              blindFlash: false,
              blindFlashBanner: '',
              isAvailable: false,
              unreleasedText: zh ? 'NON-PLANNER · 编排态不可选' : 'NON-PLANNER · Locked in Orch',
              effortTitle: zh ? '编排状态' : 'Planner Status',
              levels: [],
              hoveredEffort: null,
              pressedEffort: null,
            },
          };
        }

        var isBlindFlashNow = Boolean(blindFlashZ === slot.z);
        var chemFlashStr =
          slot.numLabel + ' ' + slot.symbol + ' · ' + slot.name + ' · ' + slot.mass + ' · STANDBY';
        var unrelText = isBlindFlashNow
          ? chemFlashStr
          : fullAvailableEntries.length === 0
          ? zh
            ? '当前宿主未返回可用元素模型'
            : 'No live element models detected'
          : zh
          ? '未发布 · 待机盲键'
          : 'Standby · Matte PBT Keycap';
        var blindBench = resolveBenchmarkMetrics(slot.z, '', zh, false);

        return {
          inspectKind: 'blind-element',
          auxSlot: null,
          slot: slot,
          availEntry: null,
          bentoSpec: {
            kind: 'blind-element',
            auxIndex: null,
            z: slot.z,
            badge: slot.numLabel + ' ' + slot.symbol + ' · STANDBY',
            stateText: zh ? '待机盲键' : 'STANDBY',
            title: slot.numLabel + ' ' + slot.symbol + ' · ' + slot.name,
            shortTag: slot.numLabel + slot.symbol,
            microTags: [zh ? '第 ' + slot.col + ' 族' : 'Group ' + slot.col, slot.mass + ' u', 'STANDBY'],
            tagline: zh
              ? '第 ' + slot.col + ' 族 · ' + groupInfo.zh + ' · 尚未开放的化学元素键位'
              : 'Group ' + slot.col + ' · ' + groupInfo.en + ' · Unreleased Element Keycap',
            scores: blindBench.ratios,
            benchRows: blindBench.rows,
            compactText: blindBench.compactText,
            runnerRatios: null,
            compareRatios: null,
            compareTag: '',
            accentHex: '#94A3B8',
            accentHexLight: '#475569',
            glowRgba: 'rgba(148, 163, 184, 0.22)',
            isAvailable: false,
            levels: [],
            activeEffort: '',
            tierNote: formatAntigravTierNote('', false, false, zh, false),
            switchSpec: '0.00U · Matte PBT Standby',
            litDots: 0,
            plannerTopoLabel: activePlannerTopo,
            telemetrySeed: slot.z,
          },
          deckInfo: {
            z: slot.z,
            isAuxModel: false,
            orchLatched: false,
            orchUnsupported: false,
            blindFlash: isBlindFlashNow,
            blindFlashBanner: isBlindFlashNow ? chemFlashStr : '',
            numLabel: slot.numLabel,
            groupCode: 'G' + slot.col,
            symbol: slot.symbol,
            elementEn: slot.name,
            mass: slot.mass,
            title: isBlindFlashNow
              ? slot.numLabel + ' ' + slot.symbol + ' · ' + slot.name
              : slot.numLabel + ' ' + slot.symbol + ' · ' + slot.name + ' — Standby',
            chemLabel: zh ? slot.zh : slot.name,
            subtitle: zh
              ? '第 ' + slot.col + ' 族 · ' + groupInfo.zh + ' · ' + slot.mass + ' u · 物理待机盲键'
              : 'Group ' + slot.col + ' · ' + groupInfo.en + ' · ' + slot.mass + ' u · Standby Keycap',
            sessionBanner: sessionBanner,
            isAvailable: false,
            unreleasedText: unrelText,
            effortTitle: zh ? '元素状态' : 'Element Status',
            levels: [],
            hoveredEffort: null,
            pressedEffort: null,
          },
        };
      }

      function syncBentoTwinCardsDom(bSpec, zh, profile) {
        if (!bentoRefs || !bSpec || !overlayEl) return;
        var isLight = Boolean(profile && profile.isLight);
        var isMono = Boolean(profile && profile.isMono);
        var committed = resolveCommittedTelemetrySpec(zh);
        var tele = readConsoleTelemetry(doc, root, committed.telemetrySeed, activeTelemetrySource);
        var useShortCite =
          overlayEl.getAttribute('data-source-short') === '1' ||
          (overlayEl.getAttribute('data-dock-tier') || 'wide') !== 'wide';
        var bentoSig =
          (profile ? profile.id + ':' + profile.accent + ':' + (isMono ? '1' : '0') : '') +
          '|' +
          (zh ? 'zh' : 'en') +
          '|' +
          stageMode +
          '|' +
          (muted ? '1' : '0') +
          '|' +
          (useShortCite ? '1' : '0') +
          '|' +
          (cardFlipped ? '1' : '0') +
          '|' +
          (compactExpanded ? '1' : '0') +
          '|' +
          (orchLatched ? '1' : '0') +
          '|' +
          bSpec.badge +
          '|' +
          bSpec.stateText +
          '|' +
          bSpec.title +
          '|' +
          (bSpec.tagline || '') +
          '|' +
          bSpec.accentHex +
          '|' +
          (bSpec.tierNote || '') +
          '|' +
          (bSpec.compactText || '') +
          '|' +
          (bSpec.shortTag || '') +
          '|' +
          (bSpec.compareTag || '') +
          '|' +
          (bSpec.plannerTopoLabel || '') +
          '|' +
          (Array.isArray(bSpec.microTags) ? bSpec.microTags.join(',') : '') +
          '|' +
          (Array.isArray(bSpec.compareRatios) ? bSpec.compareRatios.join(',') : '') +
          '|' +
          (Array.isArray(bSpec.runnerRatios) ? bSpec.runnerRatios.join(',') : '') +
          '|' +
          (bSpec.scores ? bSpec.scores.join(',') : '') +
          '|' +
          (bSpec.levels
            ? bSpec.levels
                .map(function (l) {
                  return l.effort + ':' + (l.active ? '1' : '0') + ':' + l.label;
                })
                .join(',')
            : '') +
          '|' +
          committed.compactPillLabel +
          '|' +
          committed.accentHex +
          '|' +
          (committed.switchSpec || '') +
          '|' +
          (committed.litDots || 0) +
          '|' +
          tele.usedLabel +
          '/' +
          tele.maxLabel +
          ':' +
          tele.percentText +
          ':' +
          tele.cacheText +
          ':' +
          tele.healthLevel;
        if (lastBentoDomSig === bentoSig) return;
        lastBentoDomSig = bentoSig;
        var committedAccentHex = isMono
          ? (isLight ? '#334155' : '#E2E8F0')
          : (isLight && committed.accentHexLight ? committed.accentHexLight : committed.accentHex);
        var committedSecondaryHex = isMono
          ? (isLight ? '#475569' : '#CBD5E1')
          : (isLight && committed.secondaryHexLight
              ? committed.secondaryHexLight
              : (committed.secondaryHex || committedAccentHex));
        var committedGlowRgba = isMono
          ? 'rgba(148, 163, 184, 0.24)'
          : (committed.glowRgba || 'rgba(59, 130, 246, 0.26)');

        var specAccentHex = isMono
          ? (isLight ? '#334155' : '#E2E8F0')
          : (isLight && bSpec.accentHexLight ? bSpec.accentHexLight : bSpec.accentHex);
        var specSecondaryHex = isMono
          ? (isLight ? '#475569' : '#CBD5E1')
          : (isLight && bSpec.secondaryHexLight
              ? bSpec.secondaryHexLight
              : (bSpec.secondaryHex || specAccentHex));
        var specGlowRgba = isMono
          ? 'rgba(148, 163, 184, 0.24)'
          : (bSpec.glowRgba || 'rgba(59, 130, 246, 0.26)');

        /* Keep overlay/MOD-02 locked to the real committed model; only MOD-01 shifts accent/gradient on hover preview */
        setStyleVar(overlayEl, '--pp-model-accent', committedAccentHex);
        setStyleVar(overlayEl, '--pp-model-secondary', committedSecondaryHex);
        setStyleVar(
          overlayEl,
          '--pp-model-grad',
          'linear-gradient(90deg, ' + committedAccentHex + ' 0%, ' + committedSecondaryHex + ' 100%)'
        );
        setStyleVar(overlayEl, '--pp-model-glow', committedGlowRgba);
        if (bentoRefs.specCard) {
          setStyleVar(bentoRefs.specCard, '--pp-spec-accent', specAccentHex);
          setStyleVar(bentoRefs.specCard, '--pp-spec-secondary', specSecondaryHex);
          setStyleVar(
            bentoRefs.specCard,
            '--pp-spec-grad',
            'linear-gradient(90deg, ' + specAccentHex + ' 0%, ' + specSecondaryHex + ' 100%)'
          );
          setStyleVar(bentoRefs.specCard, '--pp-spec-glow', specGlowRgba);
        }

        bentoRefs.famText.textContent = bSpec.badge;
        bentoRefs.stateTag.textContent = bSpec.stateText;
        bentoRefs.titleEl.textContent = bSpec.title;
        bentoRefs.taglineEl.textContent = bSpec.tagline;

        /* 3 Understated Etched Micro-Tags */
        if (Array.isArray(bentoRefs.microTagNodes)) {
          var tags = Array.isArray(bSpec.microTags) ? bSpec.microTags : [];
          for (var ti = 0; ti < bentoRefs.microTagNodes.length; ti += 1) {
            var tNode = bentoRefs.microTagNodes[ti];
            var tVal = tags[ti] || '';
            tNode.textContent = tVal;
            setStyleVar(tNode, 'display', tVal ? 'inline-flex' : 'none');
          }
        }

        /* Medium / Narrow Top 38px Precision Bar */
        if (bentoRefs.compactPillText) {
          bentoRefs.compactPillText.textContent = committed.compactPillLabel || '6C · High';
        }
        if (bentoRefs.compactTitle) bentoRefs.compactTitle.textContent = bSpec.title;
        if (bentoRefs.compactMetrics) bentoRefs.compactMetrics.textContent = bSpec.compactText || '';
        if (bentoRefs.compactToggleLbl) {
          bentoRefs.compactToggleLbl.textContent = compactExpanded
            ? zh
              ? '收起面板 ▴'
              : 'Hide Panel ▴'
            : zh
            ? '展开面板 ▾'
            : 'Details ▾';
        }

        /* Compact Popover Flip Buttons (Narrow bidirectional MOD-01 <-> MOD-02 toggle) */
        if (bentoRefs.cardFlipBtn && bentoRefs.cardFlipLabel) {
          bentoRefs.cardFlipBtn.setAttribute('aria-pressed', cardFlipped ? 'true' : 'false');
          var flipText = cardFlipped ? (zh ? '规格' : 'Spec') : '512K';
          var flipTitle = cardFlipped
            ? zh
              ? '切换回 MOD-01 评测规格面板'
              : 'Switch to MOD-01 Spec & Benchmarks'
            : zh
            ? '切换至 MOD-02 512K 实时遥测面板'
            : 'Switch to MOD-02 512K Telemetry';
          bentoRefs.cardFlipLabel.textContent = flipText;
          bentoRefs.cardFlipBtn.setAttribute('aria-label', flipTitle);
          bentoRefs.cardFlipBtn.title = flipTitle;
        }
        if (bentoRefs.cardFlipBackBtn && bentoRefs.cardFlipBackLabel) {
          var backText = zh ? '规格' : 'Spec';
          var backTitle = zh ? '切换回 MOD-01 评测规格面板' : 'Switch back to MOD-01 Spec';
          bentoRefs.cardFlipBackBtn.setAttribute('aria-pressed', cardFlipped ? 'true' : 'false');
          bentoRefs.cardFlipBackLabel.textContent = backText;
          bentoRefs.cardFlipBackBtn.setAttribute('aria-label', backTitle);
          bentoRefs.cardFlipBackBtn.title = backTitle;
        }

        /* Left MOD-01: Enlarged Pentagon Radar + Live Hover Comparison / 1H Orch Overlay + 5 Benchmark Bars */
        updateFiveAxisRadarSvg(
          bentoRefs.radarSvgRefs,
          bSpec.scores,
          specAccentHex,
          specSecondaryHex,
          specGlowRgba,
          bSpec.runnerRatios,
          bSpec.compareRatios,
          zh,
          isLight
        );
        if (bentoRefs.radarLegend && bentoRefs.legPriText && bentoRefs.legSecText) {
          if (bSpec.runnerRatios) {
            bentoRefs.radarLegend.setAttribute('data-show', '1');
            bentoRefs.legPriText.textContent = bSpec.shortTag || 'Planner';
            bentoRefs.legSecText.textContent = '1H';
          } else if (bSpec.compareRatios) {
            bentoRefs.radarLegend.setAttribute('data-show', '1');
            bentoRefs.legPriText.textContent = bSpec.shortTag || (zh ? '预览' : 'Hover');
            bentoRefs.legSecText.textContent = bSpec.compareTag || (zh ? '当前' : 'Active');
          } else {
            bentoRefs.radarLegend.setAttribute('data-show', '0');
          }
        }

        var rows = Array.isArray(bSpec.benchRows) ? bSpec.benchRows : [];
        var hasAnyDelta = false;
        for (var ri = 0; ri < bentoRefs.barRefs.length; ri += 1) {
          var br = bentoRefs.barRefs[ri];
          if (!br) continue;
          var rItem = rows[ri];
          if (rItem) {
            br.lbl.textContent = rItem.label;
            setStyleVar(br.fill, 'width', Math.max(8, Math.min(100, Number(rItem.fillPct) || 20)) + '%');
            br.val.textContent = rItem.valText;
            if (br.delta) {
              br.delta.textContent = rItem.deltaText || '';
              br.delta.setAttribute('data-dir', rItem.deltaDir || '');
              if (rItem.deltaText) hasAnyDelta = true;
            }
          }
        }
        if (bentoRefs.specCard) {
          bentoRefs.specCard.setAttribute('data-comparing', hasAnyDelta ? '1' : '0');
        }
        if (bentoRefs.sourceCiteEl) {
          bentoRefs.sourceCiteEl.textContent = useShortCite
            ? BENCHMARK_SOURCE_CITATION_SHORT
            : BENCHMARK_SOURCE_CITATION;
          bentoRefs.sourceCiteEl.title = BENCHMARK_SOURCE_CITATION;
        }
        if (bentoRefs.ttHead && Array.isArray(bentoRefs.ttLines)) {
          bentoRefs.ttHead.textContent = zh
            ? '2026Q4 评测口径与思考档位说明'
            : '2026Q4 Benchmarks & Thinking Tiers';
          var ttCopy = zh
            ? [
                'AA v5：Artificial Analysis 综合智力指数（满分 100）',
                'TermBench：命令行与终端自主排障通过率（%）',
                'HLE-D / GPQA-D：前沿科学与多步难题推理（%）',
                'SWE-Pro / AutoBench：真实软件工程修复率（%）',
                '思考档位：Low 极速响应 · Med 均衡 · High 深度 · XHigh 极限推理',
              ]
            : [
                'AA v5: Artificial Analysis Intelligence Index (0–100)',
                'TermBench: Autonomous terminal & CLI task accuracy (%)',
                'HLE-D / GPQA-D: Frontier science & deep reasoning (%)',
                'SWE-Pro / AutoBench: Real-world software engineering (%)',
                'Effort: Low Fast · Med Balanced · High Deep · XHigh Max',
              ];
          for (var tli = 0; tli < bentoRefs.ttLines.length; tli += 1) {
            bentoRefs.ttLines[tli].textContent = ttCopy[tli] || '';
          }
        }

        var bentoEffSig =
          bSpec.kind +
          ':' +
          (bSpec.z !== null ? bSpec.z : bSpec.auxIndex) +
          ':' +
          (orchLatched ? 'orch' : 'solo') +
          ':' +
          zh +
          '|' +
          (bSpec.levels || [])
            .map(function (l) {
              return l.effort + ':' + (l.active ? '1' : '0') + ':' + l.label;
            })
            .join(',');

        if (bentoRefs.lastBentoEffSig !== bentoEffSig) {
          bentoRefs.lastBentoEffSig = bentoEffSig;
          bentoRefs.effortCapsuleGroup.textContent = '';
          if (!bSpec.isAvailable || !bSpec.levels || bSpec.levels.length === 0) {
            var lockChip = mkEl(
              doc,
              'span',
              'pp-bento-eff-note',
              bSpec.stateText || (zh ? '锁定态' : 'Locked')
            );
            bentoRefs.effortCapsuleGroup.appendChild(lockChip);
          } else {
            for (var li = 0; li < bSpec.levels.length; li += 1) {
              (function (lvl) {
                var cBtn = mkEl(doc, 'button', 'pp-bento-eff-btn', lvl.label);
                cBtn.type = 'button';
                cBtn.setAttribute('data-bento-effort', lvl.effort);
                cBtn.setAttribute('data-active', lvl.active ? '1' : '0');
                cBtn.setAttribute('aria-pressed', lvl.active ? 'true' : 'false');
                cBtn.addEventListener('click', function (ev) {
                  ev.stopPropagation();
                  if (bSpec.kind === 'aux' && bSpec.auxIndex !== null) {
                    handleAuxEffortSelect(bSpec.auxIndex, lvl.effort);
                  } else if (bSpec.z !== null) {
                    handleEffortSelect(lvl.effort, bSpec.z);
                  }
                });
                bentoRefs.effortCapsuleGroup.appendChild(cBtn);
              })(bSpec.levels[li]);
            }
          }
        }
        bentoRefs.effortNoteEl.textContent = bSpec.tierNote || '';

        /* Right MOD-02: Permanent 512K Real-Time Context Meter + Dynamic Solo Acoustics / Orch Topology (never flickers on hover!) */
        bentoRefs.teleKicker.textContent = 'MOD-02 // TELEMETRY';
        bentoRefs.teleHealth.setAttribute('data-level', tele.healthLevel);
        bentoRefs.teleHealth.textContent =
          tele.healthLevel === 'warn'
            ? zh
              ? '紧凑 TIGHT'
              : 'TIGHT'
            : zh
            ? '充裕 OPTIMAL'
            : 'OPTIMAL';
        bentoRefs.bigNumEl.textContent = tele.usedLabel + ' / ' + tele.maxLabel;
        bentoRefs.capLblEl.textContent = tele.percentText;
        var fillPctStr = Math.max(3, Math.min(100, tele.ratio * 100)).toFixed(1) + '%';
        setStyleVar(bentoRefs.crystalFill, 'width', fillPctStr);
        bentoRefs.cacheLbl.textContent = zh ? '缓存 ' : 'KV ';
        bentoRefs.cacheVal.textContent = tele.cacheText;
        bentoRefs.freeLbl.textContent = zh ? '余量 ' : 'Free ';
        bentoRefs.freeVal.textContent = tele.freeLabel;
        updateTelemetryPulseSvg(bentoRefs.pulseSvgRefs, tele.pulse, committedAccentHex, committedSecondaryHex);
        if (bentoRefs.compact512k) {
          bentoRefs.compact512k.textContent = tele.usedLabel + ' / ' + tele.maxLabel;
        }
        if (bentoRefs.compact512kFill) {
          setStyleVar(bentoRefs.compact512kFill, 'width', fillPctStr);
        }

        /* Bottom Sub-Screen: Solo Switch Optics & Acoustics vs Orch Dual-Core Routing Topology */
        if (bentoRefs.soloSwitchTitle) {
          bentoRefs.soloSwitchTitle.textContent = committed.switchSpec || 'High · 0.88U Cobalt Diamond Prism';
        }
        if (bentoRefs.soloAcousticsRefs) {
          var acEnergy = committed.litDots ? 0.45 + committed.litDots * 0.14 : 0.35;
          updateSoloAcousticsSvg(bentoRefs.soloAcousticsRefs, committedAccentHex, committedSecondaryHex, acEnergy, committed.telemetrySeed);
        }
        if (Array.isArray(bentoRefs.pinholeDots)) {
          var litN = Math.max(0, Math.min(4, Number(committed.litDots) || 0));
          for (var pd = 0; pd < bentoRefs.pinholeDots.length; pd += 1) {
            bentoRefs.pinholeDots[pd].setAttribute('data-lit', pd < litN ? '1' : '0');
          }
        }
        if (bentoRefs.orchTopoTitle) {
          bentoRefs.orchTopoTitle.textContent = zh ? '双核路由拓扑 · DUAL-CORE' : 'Dual-Core Routing Topology';
        }
        if (bentoRefs.plannerRoleEl) bentoRefs.plannerRoleEl.textContent = zh ? '规划核' : 'PLANNER';
        if (bentoRefs.runnerRoleEl) bentoRefs.runnerRoleEl.textContent = zh ? '执行核' : 'RUNNER';
        if (bentoRefs.plannerValEl) bentoRefs.plannerValEl.textContent = bSpec.plannerTopoLabel || '6C High';
        if (bentoRefs.runnerValEl) bentoRefs.runnerValEl.textContent = '1H High';

        /* Integrated Machined Circular Controls (Right MOD-02 + Medium/Narrow Compact Bar) */
        var isFull = stageMode === 'fullscreen';
        var modeBtnText = isFull ? (zh ? '内嵌底坞' : 'In-Flow Dock') : zh ? '全屏展台' : '3D Stage';
        var modeTitle = isFull
          ? zh
            ? '收起回输入框正下方内嵌底坞 (F)'
            : 'Return to In-Flow Desk Dock below Input Box (F)'
          : zh
          ? '展开全屏 3D 展台并解锁自由旋转 (F)'
          : 'Expand Fullscreen 3D Stage & Free Orbit (F)';
        var modePathD = isFull
          ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'
          : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5';

        bentoRefs.modeLabelSpan.textContent = modeBtnText;
        bentoRefs.stageModeBtn.setAttribute('data-stage-mode', stageMode);
        bentoRefs.stageModeBtn.setAttribute('aria-pressed', isFull ? 'true' : 'false');
        bentoRefs.stageModeBtn.setAttribute('aria-label', modeTitle);
        bentoRefs.stageModeBtn.title = modeTitle;
        if (bentoRefs.modeIconRefs && bentoRefs.modeIconRefs.path) {
          bentoRefs.modeIconRefs.path.setAttribute('d', modePathD);
        }
        if (bentoRefs.compactStageBtn) {
          bentoRefs.compactStageBtn.setAttribute('aria-label', modeTitle);
          bentoRefs.compactStageBtn.title = modeTitle;
          if (bentoRefs.compactModeIcon && bentoRefs.compactModeIcon.path) {
            bentoRefs.compactModeIcon.path.setAttribute('d', modePathD);
          }
        }

        var muteTitleText = zh ? (muted ? '开启机械音效' : '静音') : muted ? 'Unmute Audio' : 'Mute Audio';
        var closeTitleText = zh ? '收起底坞 (Esc / Enter)' : 'Collapse Dock (Esc / Enter)';
        bentoRefs.quickMuteBtn.setAttribute('data-muted', muted ? '1' : '0');
        bentoRefs.quickMuteBtn.title = muteTitleText;
        bentoRefs.quickMuteBtn.setAttribute('aria-label', muteTitleText);
        bentoRefs.quickCloseBtn.title = closeTitleText;
        bentoRefs.quickCloseBtn.setAttribute('aria-label', closeTitleText);

        if (bentoRefs.compactMuteBtn) {
          bentoRefs.compactMuteBtn.setAttribute('data-muted', muted ? '1' : '0');
          bentoRefs.compactMuteBtn.title = muteTitleText;
          bentoRefs.compactMuteBtn.setAttribute('aria-label', muteTitleText);
        }
        if (bentoRefs.compactCloseBtn) {
          bentoRefs.compactCloseBtn.title = closeTitleText;
          bentoRefs.compactCloseBtn.setAttribute('aria-label', closeTitleText);
        }
      }

      function applyBoxRect(el, rect) {
        if (!el || !rect) return;
        setStyleVar(el, 'left', Math.round(rect.left) + 'px');
        setStyleVar(el, 'top', Math.round(rect.top) + 'px');
        setStyleVar(el, 'width', Math.max(1, Math.round(rect.width)) + 'px');
        setStyleVar(el, 'height', Math.max(1, Math.round(rect.height)) + 'px');
      }

      function fallbackKeyRect(slot, stageW, stageH) {
        var padX = stageW * 0.055;
        var padTop = stageH * 0.14;
        var cellW = ((stageW - padX * 2) * 0.84) / 18;
        var cellH = (stageH * 0.78) / 7;
        return {
          left: padX + (slot.col - 1) * cellW + 1,
          top: padTop + (slot.row - 1) * cellH + 1,
          width: Math.max(12, cellW - 2),
          height: Math.max(12, cellH - 2),
        };
      }

      function fallbackAuxKeyRect(auxIdx, stageW, stageH) {
        var col = auxIdx % 2;
        var row = Math.floor(auxIdx / 2);
        var baseLeft = stageW * 0.855;
        var baseTop = stageH * 0.44;
        var cellW = Math.max(24, stageW * 0.045);
        var cellH = Math.max(24, stageH * 0.11);
        return {
          left: baseLeft + col * (cellW + 4),
          top: baseTop + row * (cellH + 4),
          width: cellW,
          height: cellH,
        };
      }

      function syncDockCompactState() {
        if (!overlayEl) return;
        if (stageMode !== 'drawer') {
          overlayEl.setAttribute('data-dock-tier', 'wide');
          overlayEl.setAttribute('data-dock-compact', '0');
          overlayEl.setAttribute('data-spec-compact', '0');
          overlayEl.setAttribute('data-source-short', '0');
          overlayEl.setAttribute('data-compact-expanded', '0');
          overlayEl.removeAttribute('data-short-viewport');
          setStyleVar(overlayEl, '--pp-short-dock-h', null);
          if (bentoRefs && bentoRefs.sourceCiteEl) {
            bentoRefs.sourceCiteEl.textContent = BENCHMARK_SOURCE_CITATION;
            bentoRefs.sourceCiteEl.title = BENCHMARK_SOURCE_CITATION;
          }
          return;
        }
        var winH = Number(root && root.innerHeight) || 800;
        if (winH > 0 && winH < SHORT_VIEWPORT_HEIGHT_PX) {
          var availShortH = winH - 180;
          try {
            var hostBox = overlayEl.parentElement;
            var composerBox = resolveTargetElement(doc, configuredComposerOpt) || (hostBox && typeof hostBox.querySelector === 'function' && hostBox.querySelector('[data-prism-composer]')) || (doc && typeof doc.querySelector === 'function' ? doc.querySelector('[data-prism-composer]') : null);
            if (composerBox && typeof composerBox.getBoundingClientRect === 'function') {
              var compR = composerBox.getBoundingClientRect();
              if (compR && compR.height > 28 && compR.height < winH * 0.7) {
                availShortH = Math.min(availShortH, winH - compR.height - 84);
              }
            }
          } catch (eShort) {}
          var minShortH = winH < 420 ? 172 : 196;
          var clampedShortH = Math.max(minShortH, Math.min(268, Math.round(availShortH)));
          overlayEl.setAttribute('data-short-viewport', '1');
          setStyleVar(overlayEl, '--pp-short-dock-h', clampedShortH + 'px');
        } else {
          overlayEl.removeAttribute('data-short-viewport');
          setStyleVar(overlayEl, '--pp-short-dock-h', null);
        }
        var measuredW = 0;
        try {
          if (typeof overlayEl.getBoundingClientRect === 'function') {
            var or = overlayEl.getBoundingClientRect();
            if (or && or.width > 160) measuredW = Number(or.width) || 0;
          }
          if (measuredW <= 160 && spatialDockEl && typeof spatialDockEl.getBoundingClientRect === 'function') {
            var dr = spatialDockEl.getBoundingClientRect();
            if (dr && dr.width > 160) measuredW = Number(dr.width) || 0;
          }
          if (measuredW <= 160 && overlayEl.parentElement) {
            var pw = Number(overlayEl.parentElement.clientWidth) || 0;
            if (pw > 160) {
              measuredW = pw;
            } else if (typeof overlayEl.parentElement.getBoundingClientRect === 'function') {
              var pr = overlayEl.parentElement.getBoundingClientRect();
              if (pr && pr.width > 160) measuredW = Number(pr.width) || 0;
            }
          }
          if (measuredW <= 160 && root && Number(root.innerWidth) > 160) {
            measuredW = Number(root.innerWidth);
          }
        } catch (e) {}
        if (measuredW <= 160) measuredW = 1280;

        var tier =
          measuredW >= DOCK_WIDE_BREAKPOINT_PX
            ? 'wide'
            : measuredW >= DOCK_MEDIUM_BREAKPOINT_PX
            ? 'medium'
            : 'narrow';
        var isCompact = tier !== 'wide';
        var isSpecCompact = tier === 'medium' || (tier === 'wide' && measuredW < 1300);
        var useShortSource = tier !== 'wide' || measuredW < 1260;
        overlayEl.setAttribute('data-dock-tier', tier);
        overlayEl.setAttribute('data-dock-compact', isCompact ? '1' : '0');
        overlayEl.setAttribute('data-spec-compact', isSpecCompact ? '1' : '0');
        overlayEl.setAttribute('data-source-short', useShortSource ? '1' : '0');
        if (tier !== 'narrow' && compactExpanded) {
          compactExpanded = false;
        }
        overlayEl.setAttribute('data-compact-expanded', tier === 'narrow' && compactExpanded ? '1' : '0');
        if (bentoRefs && bentoRefs.sourceCiteEl) {
          bentoRefs.sourceCiteEl.textContent = useShortSource
            ? BENCHMARK_SOURCE_CITATION_SHORT
            : BENCHMARK_SOURCE_CITATION;
          bentoRefs.sourceCiteEl.title = BENCHMARK_SOURCE_CITATION;
        }
      }

      function refreshCachedDockBounds() {
        scrollBoundsDirty = false;
        var targetNode = spatialDockEl || stageEl || overlayEl;
        if (!targetNode || typeof targetNode.getBoundingClientRect !== 'function') return;
        try {
          var r = targetNode.getBoundingClientRect();
          if (r && r.width > 40 && r.height > 40) {
            cachedDockBounds = {
              left: Number(r.left) || 0,
              top: Number(r.top) || 0,
              width: Number(r.width) || 1280,
              height: Number(r.height) || 340,
            };
          }
          if (bentoRefs && bentoRefs.grid && typeof bentoRefs.grid.getBoundingClientRect === 'function') {
            var cr = bentoRefs.grid.getBoundingClientRect();
            if (cr && cr.width > 20 && cr.height > 20) {
              cachedCardBounds = {
                left: Number(cr.left) || 0,
                top: Number(cr.top) || 0,
                width: Number(cr.width) || 300,
                height: Number(cr.height) || 316,
              };
            }
          }
          if (bentoRefs && bentoRefs.rightWing && typeof bentoRefs.rightWing.getBoundingClientRect === 'function') {
            var rr = bentoRefs.rightWing.getBoundingClientRect();
            if (rr && rr.width > 20 && rr.height > 20) {
              cachedRightCardBounds = {
                left: Number(rr.left) || 0,
                top: Number(rr.top) || 0,
                width: Number(rr.width) || 246,
                height: Number(rr.height) || 316,
              };
            }
          }
          if (stageEl && typeof stageEl.getBoundingClientRect === 'function') {
            var sr = stageEl.getBoundingClientRect();
            lastStageRectFn = stageEl.getBoundingClientRect;
            if (sr && sr.width > 80 && sr.height > 60) {
              cachedStageBounds = {
                left: Number(sr.left) || 0,
                top: Number(sr.top) || 0,
                width: Number(sr.width) || 1280,
                height: Number(sr.height) || 680,
                valid: true,
              };
              if (activeRenderer && typeof activeRenderer.syncCanvasBounds === 'function') {
                activeRenderer.syncCanvasBounds(cachedStageBounds);
              }
            } else {
              cachedStageBounds.valid = false;
            }
          }
        } catch (e) {}
      }

      var lastBoundsSyncMs = 0;
      var scrollBoundsDirty = false;

      function clearLocalRimGlow() {
        if (!overlayEl) return;
        rimGlowWasActive = false;
        overlayEl.setAttribute('data-pointer-near', '0');
        setStyleVar(overlayEl, '--pp-dock-rim-alpha', '0');
        setStyleVar(overlayEl, '--pp-card-rim-alpha', '0');
        setStyleVar(overlayEl, '--pp-right-rim-alpha', '0');
        setStyleVar(overlayEl, '--pp-px', '-999px');
        setStyleVar(overlayEl, '--pp-py', '-999px');
        setStyleVar(overlayEl, '--pp-card-px', '-999px');
        setStyleVar(overlayEl, '--pp-card-py', '-999px');
        setStyleVar(overlayEl, '--pp-right-px', '-999px');
        setStyleVar(overlayEl, '--pp-right-py', '-999px');
      }

      function smoothRimWeight(distPx, maxDistPx) {
        if (distPx <= 0) return 1;
        if (distPx >= maxDistPx) return 0;
        var u = 1 - distPx / maxDistPx;
        return u * u * (3 - 2 * u);
      }

      function updateDynamicPrismCssVars(clientX, clientY) {
        if (!overlayEl) return { nearAny: false, extDockDist: Infinity };
        var cx = Number(clientX) || 0;
        var cy = Number(clientY) || 0;
        var b = cachedDockBounds;
        var cb = cachedCardBounds;
        var rb = cachedRightCardBounds;
        var localX = cx - b.left;
        var localY = cy - b.top;
        var cardX = cx - cb.left;
        var cardY = cy - cb.top;
        var rightX = cx - rb.left;
        var rightY = cy - rb.top;

        /* External 150px near-edge proximity sensing (0 synchronous layout reads inside pointermove!) */
        var dxDock = Math.max(0, -localX, localX - b.width);
        var dyDockBox = Math.max(0, -localY, localY - b.height);
        var extDockDist = Math.hypot(dxDock, dyDockBox);
        var dyTopEdge = localY < 0 ? -localY : localY * 0.78;
        var topRimDist = Math.hypot(dxDock, dyTopEdge);
        var dockAlpha = smoothRimWeight(topRimDist, EXT_RIM_PROXIMITY_PX);

        var dxCard = Math.max(0, -cardX, cardX - cb.width);
        var dyCard = Math.max(0, -cardY, cardY - cb.height);
        var extCardDist = Math.hypot(dxCard, dyCard);
        var cardAlpha = smoothRimWeight(extCardDist, EXT_RIM_PROXIMITY_PX);

        var dxRight = Math.max(0, -rightX, rightX - rb.width);
        var dyRight = Math.max(0, -rightY, rightY - rb.height);
        var extRightDist = Math.hypot(dxRight, dyRight);
        var rightAlpha = smoothRimWeight(extRightDist, EXT_RIM_PROXIMITY_PX);

        var nearAny = dockAlpha > 0.008 || cardAlpha > 0.008 || rightAlpha > 0.008;
        if (!nearAny && !rimGlowWasActive) {
          return { nearAny: false, extDockDist: extDockDist };
        }
        if (!nearAny && rimGlowWasActive) {
          clearLocalRimGlow();
          return { nearAny: false, extDockDist: extDockDist };
        }
        rimGlowWasActive = true;
        overlayEl.setAttribute('data-pointer-near', '1');
        setStyleVar(overlayEl, '--pp-dock-rim-alpha', dockAlpha.toFixed(3));
        setStyleVar(overlayEl, '--pp-card-rim-alpha', cardAlpha.toFixed(3));
        setStyleVar(overlayEl, '--pp-right-rim-alpha', rightAlpha.toFixed(3));
        setStyleVar(overlayEl, '--pp-px', localX.toFixed(1) + 'px');
        setStyleVar(overlayEl, '--pp-py', localY.toFixed(1) + 'px');
        setStyleVar(overlayEl, '--pp-card-px', cardX.toFixed(1) + 'px');
        setStyleVar(overlayEl, '--pp-card-py', cardY.toFixed(1) + 'px');
        setStyleVar(overlayEl, '--pp-right-px', rightX.toFixed(1) + 'px');
        setStyleVar(overlayEl, '--pp-right-py', rightY.toFixed(1) + 'px');
        return { nearAny: nearAny, extDockDist: extDockDist };
      }

      function getChassisOrbitSafe() {
        if (activeRenderer && typeof activeRenderer.getChassisOrbit === 'function') {
          try {
            var o = activeRenderer.getChassisOrbit();
            if (o && typeof o === 'object') {
              var p = Number(o.pitch) || 0;
              var y = Number(o.yaw) || 0;
              var rot = o.isRotated !== undefined ? Boolean(o.isRotated) : Math.hypot(p, y) > 0.008;
              if (!rot && pendingServoOrbit && Math.hypot(pendingServoOrbit.pitch, pendingServoOrbit.yaw) > 0.008) {
                return { pitch: pendingServoOrbit.pitch, yaw: pendingServoOrbit.yaw, isRotated: true };
              }
              return { pitch: p, yaw: y, isRotated: rot };
            }
          } catch (e) {}
        }
        return { pitch: 0, yaw: 0, isRotated: false };
      }

      function syncOrbitParallaxAndHud() {
        if (!overlayEl) return;
        var orbit = getChassisOrbitSafe();
        var reduced = isReducedMotion(doc, root);
        var auraPx = reduced ? 0 : -orbit.yaw * 42;
        var auraPy = reduced ? 0 : -orbit.pitch * 30;
        var shPx = reduced ? 0 : orbit.yaw * 18;
        var shPy = reduced ? 0 : orbit.pitch * 14;
        setStyleVar(overlayEl, '--pp-aura-px', auraPx.toFixed(2) + 'px');
        setStyleVar(overlayEl, '--pp-aura-py', auraPy.toFixed(2) + 'px');
        setStyleVar(overlayEl, '--pp-shadow-px', shPx.toFixed(2) + 'px');
        setStyleVar(overlayEl, '--pp-shadow-py', shPy.toFixed(2) + 'px');
        if (uiRefs && uiRefs.resetBtn) {
          var rotFlag = orbit.isRotated ? '1' : '0';
          if (uiRefs.lastRotatedFlag !== rotFlag) {
            uiRefs.lastRotatedFlag = rotFlag;
            uiRefs.resetBtn.setAttribute('data-rotated', rotFlag);
          }
        }
      }

      function startOrbitFollowSync() {
        if (!reqRaf || !overlayEl || isDestroyed || !activeRenderer) return;
        if (orbitSyncRafId) return;
        var lastPitch = NaN;
        var lastYaw = NaN;
        var unchangedFrames = 0;
        var stepCount = 0;
        function tick() {
          orbitSyncRafId = 0;
          if (!overlayEl || isDestroyed || !activeRenderer) return;
          if (typeof activeRenderer.getChassisOrbit === 'function') {
            try {
              var rawO = activeRenderer.getChassisOrbit();
              if (rawO) {
                var rp = Number(rawO.pitch) || 0;
                var ry = Number(rawO.yaw) || 0;
                if (Boolean(rawO.isRotated) || Math.hypot(rp, ry) > 0.008) {
                  pendingServoOrbit = null;
                }
              }
            } catch (e) {}
          }
          var hasIdleApi = typeof activeRenderer.isIdle === 'function';
          var idleDone = hasIdleApi ? Boolean(activeRenderer.isIdle()) : false;
          if (idleDone && !isOrbitDragging) {
            pendingServoOrbit = null;
          }
          /* Zero layout thrashing while coasting: only sync 96+ DOM hit buttons once settled */
          syncOrbitParallaxAndHud();
          var o = getChassisOrbitSafe();
          if (Math.abs(o.pitch - lastPitch) < 1e-5 && Math.abs(o.yaw - lastYaw) < 1e-5) {
            unchangedFrames += 1;
          } else {
            unchangedFrames = 0;
            lastPitch = o.pitch;
            lastYaw = o.yaw;
          }
          stepCount += 1;
          if (stepCount >= 240) {
            pendingServoOrbit = null;
            if (!isOrbitDragging) syncHitLayerRects();
            return;
          }
          if (hasIdleApi) {
            if (idleDone && !isOrbitDragging) {
              syncHitLayerRects();
              return;
            }
          } else if (!isOrbitDragging && unchangedFrames >= 2) {
            syncHitLayerRects();
            return;
          }
          orbitSyncRafId = reqRaf(tick);
        }
        orbitSyncRafId = reqRaf(tick);
      }

      /* Sync transparent semantic <button> rects from 3D Renderer projection (only when settled/opened/resized) */
      function syncHitLayerRects(skipBoundsMeasure) {
        if (!overlayEl || !stageEl || !uiRefs || isOrbitDragging) return;
        syncOrbitParallaxAndHud();
        if (!skipBoundsMeasure) {
          refreshCachedDockBounds();
        }
        var stageRect = readStageBoundsZeroReflow();
        var stageW = stageRect && stageRect.valid && stageRect.width > 80 ? stageRect.width : 1280;
        var stageH = stageRect && stageRect.valid && stageRect.height > 60 ? stageRect.height : 680;

        var proj = null;
        if (activeRenderer && typeof activeRenderer.getInteractiveProjectedRects === 'function') {
          try {
            proj = activeRenderer.getInteractiveProjectedRects();
          } catch (e) {
            proj = null;
          }
        }

        var keyRectMap = new Map();
        if (proj && Array.isArray(proj.availableKeys)) {
          for (var i = 0; i < proj.availableKeys.length; i += 1) {
            var pk = proj.availableKeys[i];
            keyRectMap.set(pk.slotZ || pk.z, {
              left: pk.left,
              top: pk.top,
              width: pk.width,
              height: pk.height,
            });
          }
        } else if (proj && Array.isArray(proj.keys)) {
          for (var k = 0; k < proj.keys.length; k += 1) {
            var item = proj.keys[k];
            if (!item.available) continue;
            keyRectMap.set(item.slotZ || item.z, {
              left: item.left,
              top: item.top,
              width: item.width,
              height: item.height,
            });
          }
        } else {
          availableByZ.forEach(function (_, z) {
            var slot = SLOT_BY_Z.get(z);
            if (slot) keyRectMap.set(z, fallbackKeyRect(slot, stageW, stageH));
          });
        }

        /* Prevent adjacent-row projected skirt overlap (e.g. 10 Ne above 18 Ar in col 18) */
        keyRectMap.forEach(function (rUpper, zUpper) {
          if (zUpper === selectedZ) return;
          var sUpper = SLOT_BY_Z.get(zUpper);
          if (!sUpper) return;
          keyRectMap.forEach(function (rLower, zLower) {
            if (zUpper === zLower || zLower === selectedZ) return;
            var sLower = SLOT_BY_Z.get(zLower);
            if (!sLower || sLower.col !== sUpper.col || sLower.row <= sUpper.row) return;
            var bottomUpper = rUpper.top + rUpper.height;
            if (bottomUpper > rLower.top - 1) {
              rUpper.height = Math.max(12, rLower.top - rUpper.top - 1);
            }
          });
        });

        keyRectMap.forEach(function (rectVal, zKey) {
          var btn = keyNodesByZ.get(zKey);
          if (btn) applyBoxRect(btn, rectVal);
        });

        /* Sync 6 Aux Macro Pad semantic buttons (rects.auxKeys) */
        if (auxKeyNodes.length > 0) {
          var projAux = proj && Array.isArray(proj.auxKeys) ? proj.auxKeys : null;
          for (var ai = 0; ai < auxKeyNodes.length; ai += 1) {
            var ab = auxKeyNodes[ai];
            if (!ab) continue;
            var aSlot = auxSlots[ai];
            if (!aSlot || !aSlot.available) continue;
            var matchedAuxRect = null;
            if (projAux) {
              for (var pa = 0; pa < projAux.length; pa += 1) {
                var cand = projAux[pa];
                if (cand && (cand.auxIndex === ai || cand.slotIndex === ai)) {
                  matchedAuxRect = cand;
                  break;
                }
              }
            }
            applyBoxRect(ab, matchedAuxRect || fallbackAuxKeyRect(ai, stageW, stageH));
          }
        }

        if (uiRefs.effortButtons && uiRefs.effortButtons.length > 0) {
          var projEfforts = proj && Array.isArray(proj.efforts) ? proj.efforts : null;
          for (var ei = 0; ei < uiRefs.effortButtons.length; ei += 1) {
            var eb = uiRefs.effortButtons[ei];
            var effCode = eb.getAttribute('data-pp-effort');
            var matchedRect = null;
            if (projEfforts) {
              for (var pe = 0; pe < projEfforts.length; pe += 1) {
                if (projEfforts[pe].effort === effCode) {
                  matchedRect = projEfforts[pe];
                  break;
                }
              }
            }
            if (!matchedRect) {
              matchedRect = {
                left: stageW * 0.42 + ei * 58,
                top: stageH * 0.34,
                width: 52,
                height: 24,
              };
            }
            applyBoxRect(eb, matchedRect);
          }
        }
      }

      function readStageBoundsZeroReflow() {
        if (scrollBoundsDirty) {
          refreshCachedDockBounds();
        } else if (stageEl && stageEl.getBoundingClientRect !== lastStageRectFn && typeof stageEl.getBoundingClientRect === 'function') {
          try {
            var sr = stageEl.getBoundingClientRect();
            lastStageRectFn = stageEl.getBoundingClientRect;
            if (sr && sr.width > 80 && sr.height > 60) {
              cachedStageBounds = {
                left: Number(sr.left) || 0,
                top: Number(sr.top) || 0,
                width: Number(sr.width) || 1280,
                height: Number(sr.height) || 680,
                valid: true,
              };
            }
          } catch (e) {}
        }
        return cachedStageBounds;
      }

      function resizeCanvasToStage() {
        if (!stageEl || !canvasEl) return;
        refreshCachedDockBounds();
        var sBounds = readStageBoundsZeroReflow();
        var cssW = sBounds.valid ? sBounds.width : 1280;
        var cssH = sBounds.valid ? sBounds.height : 680;
        var dpr = Math.min(3, Math.max(1, Number(root && root.devicePixelRatio) || 1));
        if (activeRenderer && typeof activeRenderer.resize === 'function') {
          try {
            activeRenderer.resize(cssW, cssH, dpr, sBounds.valid ? sBounds : null);
          } catch (e) {}
        }
      }

      function resolveStageLocalPoint(clientX, clientY) {
        var sRect = readStageBoundsZeroReflow();
        var ox = sRect.valid ? sRect.left : 0;
        var oy = sRect.valid ? sRect.top : 0;
        return {
          x: (Number(clientX) || 0) - ox,
          y: (Number(clientY) || 0) - oy,
        };
      }

      function getProjectedEffortsSafe() {
        if (!activeRenderer || typeof activeRenderer.getInteractiveProjectedRects !== 'function') return null;
        try {
          var proj = activeRenderer.getInteractiveProjectedRects();
          if (proj && Array.isArray(proj.efforts) && proj.efforts.length > 0) {
            return proj.efforts;
          }
        } catch (e) {}
        return null;
      }

      function isPointInEffortSliderBand(clientX, clientY) {
        var efforts = getProjectedEffortsSafe();
        if (!efforts || efforts.length === 0) return false;
        var pt = resolveStageLocalPoint(clientX, clientY);
        var minL = Infinity;
        var minT = Infinity;
        var maxR = -Infinity;
        var maxB = -Infinity;
        for (var i = 0; i < efforts.length; i += 1) {
          var er = efforts[i];
          if (!er) continue;
          var l = Number(er.left) || 0;
          var t = Number(er.top) || 0;
          var r = l + Math.max(1, Number(er.width) || 0);
          var b = t + Math.max(1, Number(er.height) || 0);
          if (l < minL) minL = l;
          if (t < minT) minT = t;
          if (r > maxR) maxR = r;
          if (b > maxB) maxB = b;
        }
        if (!Number.isFinite(minL)) return false;
        return pt.x >= minL - 10 && pt.x <= maxR + 10 && pt.y >= minT - 7 && pt.y <= maxB + 7;
      }

      function resolveEffortAlongSlider(clientX, clientY) {
        var directEffort = null;
        if (activeRenderer && typeof activeRenderer.pick === 'function') {
          try {
            var picked = activeRenderer.pick(Number(clientX) || 0, Number(clientY) || 0);
            if (picked && picked.kind === 'effort' && picked.effort) {
              directEffort = picked.effort;
            }
          } catch (e) {}
        }
        var efforts = getProjectedEffortsSafe();
        if (!efforts || efforts.length === 0) {
          return { effort: directEffort, progress: null };
        }
        var pt = resolveStageLocalPoint(clientX, clientY);
        var centers = [];
        for (var i = 0; i < efforts.length; i += 1) {
          var er = efforts[i];
          centers.push({
            effort: er.effort,
            cx: (Number(er.left) || 0) + (Number(er.width) || 0) * 0.5,
            cy: (Number(er.top) || 0) + (Number(er.height) || 0) * 0.5,
          });
        }
        if (centers.length === 1) {
          return { effort: directEffort || centers[0].effort, progress: 1 };
        }
        var cFirst = centers[0];
        var cLast = centers[centers.length - 1];
        var vx = cLast.cx - cFirst.cx;
        var vy = cLast.cy - cFirst.cy;
        var lenSq = vx * vx + vy * vy;
        var progress =
          lenSq > 4 ? Math.max(0, Math.min(1, ((pt.x - cFirst.cx) * vx + (pt.y - cFirst.cy) * vy) / lenSq)) : 0;

        var bestEffort = centers[0].effort;
        var bestDist = Infinity;
        for (var j = 0; j < centers.length; j += 1) {
          var ti = centers.length > 1 ? j / (centers.length - 1) : 0;
          var dAxis = lenSq > 4 ? Math.abs(progress - ti) : Math.hypot(pt.x - centers[j].cx, pt.y - centers[j].cy);
          if (dAxis < bestDist) {
            bestDist = dAxis;
            bestEffort = centers[j].effort;
          }
        }
        return {
          effort: directEffort || bestEffort,
          progress: progress,
        };
      }

      function getActiveEffortForElement(slotZ) {
        if (slotZ === null || !availableByZ.has(slotZ)) return '';
        if (selectedZ === slotZ && activeEffortByZ.has(slotZ)) {
          return activeEffortByZ.get(slotZ) || '';
        }
        var entry = availableByZ.get(slotZ);
        var currentSelEff = selectedZ !== null ? activeEffortByZ.get(selectedZ) || '' : '';
        var defLvl = resolveLevelForElement(entry, currentSelEff);
        return defLvl ? defLvl.effort : '';
      }

      function resolveEffortLevelNorm(entry, chosenLvl, chosenIdx) {
        if (chosenLvl && EFFORT_NORM_MAP[chosenLvl.effort] !== undefined) {
          return EFFORT_NORM_MAP[chosenLvl.effort];
        }
        var count = entry && Array.isArray(entry.levels) ? entry.levels.length : 1;
        if (count <= 1) return 0.78;
        return Math.max(0.2, Math.min(1, 0.25 + (chosenIdx / (count - 1)) * 0.75));
      }

      function handleAuxEffortSelect(auxIdx, effortCode, soundOverride) {
        if (isConfirmClosing || isDrawerClosing) return;
        var slot = auxSlots[auxIdx];
        if (!slot || !slot.available || !slot.levels || !slot.levels.length) return;
        var chosenLvl = null;
        var chosenIdx = 0;
        for (var i = 0; i < slot.levels.length; i += 1) {
          if (slot.levels[i].effort === effortCode) {
            chosenLvl = slot.levels[i];
            chosenIdx = i;
            break;
          }
        }
        if (!chosenLvl) return;
        selectedZ = null;
        selectedAuxIndex = auxIdx;
        activeEffortByAux.set(auxIdx, chosenLvl.effort);
        syncHostWithActiveState();
        if (typeof opts.onSelectEffort === 'function') { try { opts.onSelectEffort(chosenLvl.effort, chosenLvl.option || declarativeCtx.selectedModel, buildSelectionCallbackMeta()); } catch (eEff) {} }
        playSound(soundOverride || 'step', chosenIdx);
        syncSceneAndDom();
        if (activeRenderer && !isReducedMotion(doc, root) && typeof activeRenderer.triggerEnergyPulse === 'function') {
          try {
            activeRenderer.triggerEnergyPulse(resolveEffortLevelNorm(slot, chosenLvl, chosenIdx));
          } catch (e) {}
        }
        scheduleSettledRectSync();
      }

      function handleEffortSelect(effortCode, inspectSlotZ, soundOverride) {
        if (isConfirmClosing || isDrawerClosing) return;
        var nonOrchHovAux = hoveredAuxIndex !== null && hoveredAuxIndex > 0 ? hoveredAuxIndex : null;
        if (
          (inspectSlotZ === undefined || inspectSlotZ === null || inspectSlotZ === 0) &&
          hoveredZ === null &&
          (nonOrchHovAux !== null || selectedAuxIndex !== null)
        ) {
          var targetAux = nonOrchHovAux !== null ? nonOrchHovAux : selectedAuxIndex;
          if (targetAux !== null && auxSlots[targetAux] && auxSlots[targetAux].available) {
            handleAuxEffortSelect(targetAux, effortCode, soundOverride);
            return;
          }
        }
        var candidateZ =
          inspectSlotZ !== undefined && inspectSlotZ !== null && inspectSlotZ !== 0
            ? inspectSlotZ
            : hoveredZ !== null && availableByZ.has(hoveredZ)
            ? hoveredZ
            : selectedZ !== null && availableByZ.has(selectedZ)
            ? selectedZ
            : resolveInspectedElementZ();
        if (candidateZ === null || !availableByZ.has(candidateZ)) return;
        var entry = availableByZ.get(candidateZ);
        var chosenLvl = null;
        var chosenIdx = 0;
        for (var i = 0; i < entry.levels.length; i += 1) {
          if (entry.levels[i].effort === effortCode) {
            chosenLvl = entry.levels[i];
            chosenIdx = i;
            break;
          }
        }
        if (!chosenLvl) return;
        var switchedElement = selectedZ !== candidateZ || selectedAuxIndex !== null;
        selectedZ = candidateZ;
        selectedAuxIndex = null;
        activeEffortByZ.set(candidateZ, chosenLvl.effort);
        if (!(gestureState && gestureState.scrubbing)) {
          pressedEffort = null;
        }
        if (hoveredEffort !== null) {
          hoveredEffort = chosenLvl.effort;
        }
        syncHostWithActiveState();
        if (typeof opts.onSelectEffort === 'function') { try { opts.onSelectEffort(chosenLvl.effort, chosenLvl.option || declarativeCtx.selectedModel, buildSelectionCallbackMeta()); } catch (eEff2) {} }
        var levelNorm = resolveEffortLevelNorm(entry, chosenLvl, chosenIdx);
        playSound(soundOverride || 'step', chosenIdx);
        syncSceneAndDom();
        if (activeRenderer && !isReducedMotion(doc, root)) {
          if (switchedElement && typeof activeRenderer.triggerWaveRipple === 'function') {
            try {
              activeRenderer.triggerWaveRipple(candidateZ, 1.0);
            } catch (e) {}
          }
          if (typeof activeRenderer.triggerEnergyPulse === 'function') {
            try {
              activeRenderer.triggerEnergyPulse(levelNorm);
            } catch (e) {}
          }
        }
        if (switchedElement) {
          scheduleSettledRectSync();
        }
      }

      function forwardPointerToRenderer(clientX, clientY, inside) {
        if (!activeRenderer) return false;
        var isInside = inside !== false;
        if (typeof activeRenderer.setPointerClient === 'function') {
          activeRenderer.setPointerClient(
            isInside ? Number(clientX) || 0 : -9999,
            isInside ? Number(clientY) || 0 : -9999,
            isInside
          );
          return true;
        }
        if (typeof activeRenderer.setPointerNorm === 'function') {
          if (!isInside) {
            activeRenderer.setPointerNorm(0, 0, false);
          } else {
            var sBoundsNorm = readStageBoundsZeroReflow();
            var rw = sBoundsNorm.valid && sBoundsNorm.width > 0 ? sBoundsNorm.width : 1280;
            var rh = sBoundsNorm.valid && sBoundsNorm.height > 0 ? sBoundsNorm.height : 680;
            var rl = sBoundsNorm.valid ? sBoundsNorm.left : 0;
            var rt = sBoundsNorm.valid ? sBoundsNorm.top : 0;
            var nx = Math.max(-1, Math.min(1, (((Number(clientX) || 0) - rl) / rw) * 2 - 1));
            var ny = Math.max(-1, Math.min(1, (((Number(clientY) || 0) - rt) / rh) * 2 - 1));
            activeRenderer.setPointerNorm(nx, ny, true);
          }
          return true;
        }
        return false;
      }

      function syncSceneAndDom(skipRectSync) {
        if (!overlayEl || !uiRefs) return;
        var zh = isZhLocale(doc, root);
        var profile = resolvePrismThemeProfile(doc, root);

        overlayEl.setAttribute('data-theme', profile.theme);
        overlayEl.setAttribute('data-kit', profile.id);
        overlayEl.setAttribute('data-rim-tone', profile.rimTone || 'default');
        overlayEl.setAttribute('data-corners', profile.corners);
        overlayEl.setAttribute('data-mono', profile.isMono ? '1' : '0');
        overlayEl.setAttribute('data-stage-mode', stageMode);
        overlayEl.setAttribute('data-card-flipped', cardFlipped ? '1' : '0');
        overlayEl.setAttribute('data-orch-latched', orchLatched ? '1' : '0');
        syncDockCompactState();

        var ambOpacity = profile.ambientMul <= 0 ? 0.22 : Math.max(0.35, Math.min(1, profile.ambientMul));
        setStyleVar(overlayEl, '--pp-ambient-mul', ambOpacity.toFixed(3));

        if (deskmatEl) {
          mountDeskmatTopoSvgIfAvailable(doc, deskmatEl, root);
        }

        /* Sync diffuse studio ambient halo to active/inspected element or aux jewel tint */
        var haloZ = selectedZ !== null ? selectedZ : resolveInspectedElementZ();
        var haloGem = hudGemColorsForZ(haloZ, profile);
        setStyleVar(overlayEl, '--pp-elem-halo', profile.isLight ? haloGem.haloLight : haloGem.haloDark);
        setStyleVar(overlayEl, '--pp-elem-ring', haloGem.ring);

        /* Update levitated class & aria-pressed across semantic keycap buttons */
        keyNodesByZ.forEach(function (btn, z) {
          if (z === selectedZ) {
            btn.classList.add('is-levitated');
            btn.setAttribute('aria-pressed', 'true');
          } else {
            btn.classList.remove('is-levitated');
            if (availableByZ.has(z)) btn.setAttribute('aria-pressed', 'false');
          }
        });

        /* Update semantic 2x3 Aux Macro Pad buttons */
        var isLatchModeCapable = Boolean(!orchRegistry || orchRegistry.latchCapable);
        for (var ak = 0; ak < auxKeyNodes.length; ak += 1) {
          var auxBtn = auxKeyNodes[ak];
          if (!auxBtn) continue;
          if (ak === 0 && isLatchModeCapable && auxSlots[0] && auxSlots[0].id === 'orchestrator') {
            auxBtn.classList.remove('is-levitated');
            auxBtn.setAttribute('data-latched', orchLatched ? '1' : '0');
            if (auxSlots[0].available) {
              auxBtn.setAttribute('aria-pressed', orchLatched ? 'true' : 'false');
            }
          } else {
            var isAuxSel = selectedAuxIndex === ak;
            if (isAuxSel) {
              auxBtn.classList.add('is-levitated');
              auxBtn.setAttribute('aria-pressed', 'true');
            } else {
              auxBtn.classList.remove('is-levitated');
              if (auxSlots[ak] && auxSlots[ak].available) {
                auxBtn.setAttribute('aria-pressed', 'false');
              }
            }
          }
        }

        /* Update Control Dock SR capsules */
        hudChipByZ.forEach(function (chipObj, z) {
          var c = hudGemColorsForZ(z, profile);
          var isSel = z === selectedZ;
          var isAvailChip = availableByZ.has(z);
          setStyleVar(chipObj.dot, '--dot-bg', c.dot);
          setStyleVar(chipObj.dot, '--dot-glow', c.glow || c.ring);
          setStyleVar(chipObj.btn, '--chip-ring', c.ring);
          chipObj.btn.setAttribute('data-selected', isSel ? '1' : '0');
          chipObj.btn.setAttribute('data-available', isAvailChip ? '1' : '0');
          chipObj.btn.setAttribute('aria-pressed', isSel ? 'true' : 'false');
        });

        /* Update SR-only inspector deck, V12 3D Flip Card & effort hit buttons */
        var payload = buildCurrentDeckPayload(zh);
        var dInfo = payload.deckInfo;

        syncBentoTwinCardsDom(payload.bentoSpec, zh, profile);

        if (dInfo.sessionBanner) {
          uiRefs.bannerText.textContent = dInfo.sessionBanner;
          uiRefs.banner.setAttribute('data-show', '1');
        } else {
          uiRefs.bannerText.textContent = '';
          uiRefs.banner.setAttribute('data-show', '0');
        }
        uiRefs.srTitle.textContent = dInfo.blindFlash && dInfo.blindFlashBanner ? dInfo.blindFlashBanner : dInfo.title;
        uiRefs.srChem.textContent = dInfo.chemLabel;
        uiRefs.srSub.textContent = dInfo.subtitle;

        /* Rebuild effort semantic hit buttons when inspected model/effort changes */
        var effSig =
          (dInfo.isAuxModel ? 'aux:' + dInfo.auxIndex : String(dInfo.z)) +
          ':' +
          (orchLatched ? 'orch' : 'solo') +
          '|' +
          dInfo.levels
            .map(function (l) {
              return l.effort + ':' + (l.active ? '1' : '0');
            })
            .join(',');

        var rebuiltEfforts = false;
        if (uiRefs.lastEffortSig !== effSig) {
          rebuiltEfforts = true;
          uiRefs.lastEffortSig = effSig;
          for (var oldIdx = 0; oldIdx < uiRefs.effortButtons.length; oldIdx += 1) {
            safeRemove(uiRefs.effortButtons[oldIdx]);
          }
          uiRefs.effortButtons.length = 0;

          for (var li = 0; li < dInfo.levels.length; li += 1) {
            (function (lvl) {
              var eBtn = mkEl(doc, 'button', 'pp-hit-btn pp-seg-btn', lvl.label);
              eBtn.type = 'button';
              eBtn.setAttribute('data-pp-effort', lvl.effort);
              eBtn.setAttribute('data-effort', lvl.effort);
              eBtn.setAttribute('data-active', lvl.active ? '1' : '0');
              eBtn.setAttribute('aria-pressed', lvl.active ? 'true' : 'false');
              eBtn.setAttribute('aria-label', dInfo.effortTitle + ': ' + lvl.label);
              eBtn.addEventListener('focus', function () {
                if (hoveredEffort !== lvl.effort) {
                  hoveredEffort = lvl.effort;
                  syncSceneAndDom(true);
                }
              });
              eBtn.addEventListener('blur', function () {
                if (hoveredEffort === lvl.effort) {
                  hoveredEffort = null;
                  syncSceneAndDom(true);
                }
              });
              eBtn.addEventListener('click', function (ev) {
                ev.stopPropagation();
                if (
                  hasPointerCoords(ev) &&
                  activeRenderer &&
                  typeof activeRenderer.pick === 'function'
                ) {
                  var picked = activeRenderer.pick(ev.clientX, ev.clientY);
                  if (picked) {
                    dispatchPickedTarget(picked);
                    return;
                  }
                }
                if (dInfo.isAuxModel && dInfo.auxIndex !== undefined) {
                  handleAuxEffortSelect(dInfo.auxIndex, lvl.effort);
                } else {
                  handleEffortSelect(lvl.effort, dInfo.z);
                }
              });
              hitLayerEl.appendChild(eBtn);
              uiRefs.effortButtons.push(eBtn);
            })(dInfo.levels[li]);
          }
        }

        if (uiRefs.resetBtn) {
          var resetLbl = zh ? '复位三维视角 (R)' : 'Reset 3D View (R)';
          uiRefs.resetBtn.setAttribute('aria-label', resetLbl);
          uiRefs.resetBtn.title = resetLbl;
          if (uiRefs.resetLabel) {
            uiRefs.resetLabel.textContent = zh ? '回正' : 'Reset';
          }
          var curOrbit = getChassisOrbitSafe();
          var rotFlagNow = curOrbit.isRotated ? '1' : '0';
          uiRefs.lastRotatedFlag = rotFlagNow;
          uiRefs.resetBtn.setAttribute('data-rotated', rotFlagNow);
        }
        if (uiRefs.muteBtn) {
          var muteLbl = zh
            ? muted
              ? '已静音（点击开启机械轴音效）'
              : '切换机械键盘音效'
            : muted
            ? 'Audio muted (Click to unmute)'
            : 'Toggle Mechanical Keycap Audio';
          uiRefs.muteBtn.setAttribute('data-muted', muted ? '1' : '0');
          uiRefs.muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
          uiRefs.muteBtn.setAttribute('aria-label', muteLbl);
          uiRefs.muteBtn.title = muteLbl;
        }
        if (uiRefs.closeBtn) {
          var closeLbl = zh ? '确认并关闭' : 'Confirm and close';
          uiRefs.closeBtn.setAttribute('aria-label', closeLbl);
          uiRefs.closeBtn.title = closeLbl;
        }

        /* Sync V13.1 3D Hardware Control Deck (knurled knob + 3 pinhole LEDs), #0 Orch Latch & 2x3 Aux Macro Pad */
        var litTierCount = payload && payload.bentoSpec ? Number(payload.bentoSpec.litDots) || 2 : 2;
        var hardwareStatePayload = {
          muted: Boolean(muted),
          hoveredControl: hoveredBtn,
          pressedControl: pressedBtn,
          effortTier: Math.max(0, Math.min(3, litTierCount - 1)),
        };
        if (activeRenderer && typeof activeRenderer.setHardwareState === 'function') {
          try {
            activeRenderer.setHardwareState(hardwareStatePayload);
          } catch (e) {}
        }
        if (activeRenderer && typeof activeRenderer.setState === 'function') {
          try {
            activeRenderer.setState({
              themeProfile: profile,
              stageMode: stageMode,
              orchLatched: Boolean(orchLatched),
              availableByZ: availableByZ,
              selectedZ: selectedZ,
              confirmSlamZ: confirmSlamZ,
              hoveredZ: hoveredZ,
              pressedZ: pressedZ,
              lockedShakeZ: lockedShakeZ,
              lockedShakeAuxIndex: lockedShakeAuxIndex,
              auxModels: auxSlots,
              selectedAuxIndex: selectedAuxIndex,
              hoveredAuxIndex: hoveredAuxIndex,
              pressedAuxIndex: pressedAuxIndex,
              confirmSlamAuxIndex: confirmSlamAuxIndex,
              confirmSlamActive: Boolean(
                isConfirmClosing && (confirmSlamZ !== null || confirmSlamAuxIndex !== null)
              ),
              deckInfo: dInfo,
              hardwareState: hardwareStatePayload,
              topControls: {
                muted: muted,
                hoveredBtn: hoveredBtn,
                pressedBtn: pressedBtn,
              },
              reducedMotion: isReducedMotion(doc, root),
            });
          } catch (e) {}
        }

        if (!isOrbitDragging && (!skipRectSync || rebuiltEfforts)) {
          syncHitLayerRects(Boolean(skipRectSync));
        }
      }

      function scheduleSettledRectSync() {
        if (!activeRenderer || isDestroyed || !overlayEl) return;
        scheduleTrackedTimer(function () {
          if (overlayEl && !isDestroyed && !isOrbitDragging) {
            syncHitLayerRects();
          }
        }, 180);
      }

      function shouldAnimateDrawerCollapse() {
        if (isDestroyed || !overlayEl || stageMode !== 'drawer' || isReducedMotion(doc, root)) {
          return false;
        }
        return Boolean(root && typeof root.HTMLElement === 'function');
      }

      function revertHostChangesIfNeeded() {
        if (!hasModified || !activeHostCtx) return;
        orchLatched = initialOrchLatched;
        activeCommittedAuxBadge = initialAuxBadge;
        activeCommittedElementZ = initialElementZ;
        if (initialOrchPickModel) {
          commitOrchestratorPlannerPick(activeHostCtx, initialOrchPickModel);
        }
        if (initialOption) {
          commitModelOption(activeHostCtx, initialOption);
        }
        hasModified = false;
      }

      function collapseDrawerAndClose(closeOpts) {
        var co = closeOpts && typeof closeOpts === 'object' ? closeOpts : {};
        if (!overlayEl || isDestroyed) return;
        if (!shouldAnimateDrawerCollapse()) {
          close(co);
          return;
        }
        if (isDrawerClosing) return;
        if (co.revert) {
          revertHostChangesIfNeeded();
        }
        clearTransientAsync();
        isDrawerClosing = true;
        clearLocalRimGlow();
        forwardPointerToRenderer(-9999, -9999, false);
        overlayEl.setAttribute('data-closing', '1');
        overlayEl.setAttribute('data-open', '0');
        drawerClosingTimer = scheduleTrackedTimer(function () {
          drawerClosingTimer = 0;
          if (!isDestroyed && overlayEl) {
            close({ revert: false, silent: true, fromAnimatedCollapse: true });
          }
        }, DOCK_CLOSE_TRANSITION_MS);
      }

      function resolveConfirmSlamDelayMs() {
        if (
          isDestroyed ||
          !overlayEl ||
          (selectedZ === null && selectedAuxIndex === null) ||
          isReducedMotion(doc, root)
        ) {
          return 0;
        }
        if (!activeRenderer || typeof activeRenderer.setState !== 'function') {
          return 0;
        }
        if (explicitConfirmSlamMs !== null) {
          return explicitConfirmSlamMs;
        }
        var isBrowserRuntime = Boolean(
          root && (typeof root.HTMLElement === 'function' || typeof root.WebGL2RenderingContext === 'function')
        );
        if (!isBrowserRuntime) return 0;
        if (typeof activeRenderer.getRendererMode === 'function') {
          var rMode = activeRenderer.getRendererMode();
          if (rMode !== 'webgl2' && rMode !== 'canvas2d') return 0;
        }
        return CONFIRM_SLAM_DELAY_MS;
      }

      function confirmAndClose() {
        if (isDestroyed || !overlayEl) return;
        if (isConfirmClosing || isDrawerClosing) return;

        playSound('slam');

        var slamDelay = resolveConfirmSlamDelayMs();
        if (slamDelay <= 0) {
          collapseDrawerAndClose({ revert: false });
          return;
        }

        isConfirmClosing = true;
        confirmSlamZ = selectedZ;
        confirmSlamAuxIndex = selectedAuxIndex;
        cancelBlindDwellTimer();
        cancelBlindFlashTimer();
        inspectedBlindZ = null;
        inspectedBlindAuxIndex = null;
        blindFlashZ = null;
        extNearRendererActive = false;
        hoveredZ = null;
        hoveredAuxIndex = null;
        pressedZ = selectedZ;
        pressedAuxIndex = selectedAuxIndex;
        hoveredEffort = null;
        pressedEffort = null;
        hoveredBtn = null;
        pressedBtn = null;
        lockedShakeZ = null;
        lockedShakeAuxIndex = null;
        lastPointerClient.x = -9999;
        lastPointerClient.y = -9999;
        lastPointerClient.active = false;
        clearLocalRimGlow();
        forwardPointerToRenderer(-9999, -9999, false);

        overlayEl.setAttribute('data-confirm-slam', '1');
        syncSceneAndDom(true);

        confirmCloseTimer = scheduleTrackedTimer(function () {
          confirmCloseTimer = 0;
          if (isDestroyed || !overlayEl) return;
          isConfirmClosing = false;
          collapseDrawerAndClose({ revert: false, silent: true });
        }, slamDelay);
      }

      function stepActiveEffortByDelta(deltaSteps) {
        if (isConfirmClosing || isDrawerClosing || !overlayEl) return false;
        var rawSteps = Math.trunc(Number(deltaSteps) || 0);
        if (rawSteps === 0) rawSteps = deltaSteps >= 0 ? 1 : -1;
        var dir = rawSteps >= 0 ? 1 : -1;
        var clampedDelta = Math.max(-4, Math.min(4, rawSteps));
        var curDeck = buildCurrentDeckPayload(isZhLocale(doc, root));
        var levels = curDeck && curDeck.bentoSpec && Array.isArray(curDeck.bentoSpec.levels)
          ? curDeck.bentoSpec.levels
          : [];
        if (levels.length < 2) {
          if (activeRenderer && typeof activeRenderer.rotateKnobStep === 'function') {
            try {
              activeRenderer.rotateKnobStep(dir);
            } catch (e) {}
          }
          playSound('ratchet', 1);
          return false;
        }
        var curIdx = 0;
        for (var i = 0; i < levels.length; i += 1) {
          if (levels[i].active) {
            curIdx = i;
            break;
          }
        }
        var nextIdx = Math.max(0, Math.min(levels.length - 1, curIdx + clampedDelta));
        if (activeRenderer && typeof activeRenderer.rotateKnobStep === 'function') {
          try {
            activeRenderer.rotateKnobStep(clampedDelta);
          } catch (e) {}
        }
        if (nextIdx === curIdx) {
          playSound('ratchet', nextIdx);
          return false;
        }
        var targetEffort = levels[nextIdx].effort;
        if (curDeck.inspectKind === 'aux' && curDeck.auxSlot) {
          handleAuxEffortSelect(curDeck.auxSlot.slotIndex, targetEffort, 'ratchet');
        } else if (curDeck.slot) {
          handleEffortSelect(targetEffort, curDeck.slot.z, 'ratchet');
        } else {
          handleEffortSelect(targetEffort, null, 'ratchet');
        }
        return true;
      }

      function handleAvailableKeyClick(slotZ) {
        if (isConfirmClosing || isDrawerClosing) return;
        var entry = availableByZ.get(slotZ);
        if (!entry) {
          triggerBlindKeyFeedback(slotZ);
          return;
        }

        /* Second click on the sole levitated keycap -> 115ms bottom-out slam & smooth collapse */
        if (selectedZ === slotZ && selectedAuxIndex === null) {
          confirmAndClose();
          return;
        }

        /* First click -> clear Aux selection, pull element keycap up in 3D, sync host immediately */
        cancelBlindDwellTimer();
        cancelBlindFlashTimer();
        inspectedBlindZ = null;
        inspectedBlindAuxIndex = null;
        blindFlashZ = null;
        extNearRendererActive = false;
        var prevEff = selectedZ !== null ? activeEffortByZ.get(selectedZ) || '' : '';
        var chosen = resolveLevelForElement(entry, prevEff);
        selectedZ = slotZ;
        selectedAuxIndex = null;
        confirmSlamAuxIndex = null;
        if (chosen) {
          activeEffortByZ.set(slotZ, chosen.effort);
        }
        syncHostWithActiveState();
        playSound('lift');
        syncSceneAndDom();
        if (activeRenderer && !isReducedMotion(doc, root) && typeof activeRenderer.triggerWaveRipple === 'function') {
          try {
            activeRenderer.triggerWaveRipple(slotZ, 1.0);
          } catch (e) {}
        }
        if (lastPointerClient.active) {
          forwardPointerToRenderer(lastPointerClient.x, lastPointerClient.y, true);
        }
        scheduleSettledRectSync();
      }

      function triggerBlindAuxKeyFeedback(auxIdx) {
        if (isConfirmClosing || isDrawerClosing) return;
        cancelBlindDwellTimer();
        cancelBlindFlashTimer();
        blindFlashZ = null;
        hoveredAuxIndex = auxIdx;
        inspectedBlindAuxIndex = auxIdx;
        playSound('lock');
        var btn = auxKeyNodes[auxIdx];
        if (btn) btn.classList.remove('is-locked-shake');

        lockedShakeAuxIndex = { auxIndex: auxIdx, progress: 0.25 };
        syncSceneAndDom(true);

        scheduleTrackedTimer(function () {
          if (isDestroyed || !overlayEl || isConfirmClosing || isDrawerClosing) return;
          if (btn) btn.classList.add('is-locked-shake');
          lockedShakeAuxIndex = { auxIndex: auxIdx, progress: 0.65 };
          syncSceneAndDom(true);
        }, 45);

        scheduleTrackedTimer(function () {
          if (btn) btn.classList.remove('is-locked-shake');
          lockedShakeAuxIndex = null;
          if (!isDestroyed && overlayEl && !isConfirmClosing && !isDrawerClosing) {
            syncSceneAndDom(true);
          }
        }, 155);
      }

      function handleAuxKeyClick(auxIdx) {
        if (isConfirmClosing || isDrawerClosing) return;
        var slot = auxSlots[auxIdx];
        if (!slot) return;

        /* V13.1 #0 Orch Mechanical Latching Switch with dual-stage sound + amethyst-gold pulse ripple */
        if (auxIdx === 0 && slot.id === 'orchestrator' && (!orchRegistry || orchRegistry.latchCapable)) {
          if (!slot.available) {
            triggerBlindAuxKeyFeedback(0);
            return;
          }
          cancelBlindDwellTimer();
          cancelBlindFlashTimer();
          blindFlashZ = null;
          inspectedBlindZ = null;
          inspectedBlindAuxIndex = null;
          lockedShakeZ = null;
          lockedShakeAuxIndex = null;

          orchLatched = !orchLatched;
          recomputeEffectiveAvailability();

          if (orchLatched) {
            ensureValidPlannerSelectedForOrch();
            syncHostWithActiveState();
            playSound('orch-latch');
            if (activeRenderer && !isReducedMotion(doc, root)) {
              if (typeof activeRenderer.triggerWaveRipple === 'function') {
                try {
                  activeRenderer.triggerWaveRipple('aux:0', 0.9);
                } catch (e) {}
              }
              if (typeof activeRenderer.triggerEnergyPulse === 'function') {
                try {
                  activeRenderer.triggerEnergyPulse(1.0);
                } catch (e) {}
              }
            }
          } else {
            syncHostWithActiveState();
            if (typeof opts.onToggleOrchestrator === 'function') { try { opts.onToggleOrchestrator(false, null, buildSelectionCallbackMeta()); } catch (eUn) {} }
            playSound('orch-unlatch');
            if (activeRenderer && !isReducedMotion(doc, root) && typeof activeRenderer.triggerWaveRipple === 'function') {
              try {
                activeRenderer.triggerWaveRipple('aux:0', 0.65);
              } catch (e) {}
            }
          }

          syncSceneAndDom();
          if (lastPointerClient.active) {
            forwardPointerToRenderer(lastPointerClient.x, lastPointerClient.y, true);
          }
          scheduleSettledRectSync();
          return;
        }

        if (!slot.available) {
          triggerBlindAuxKeyFeedback(auxIdx);
          return;
        }

        /* Second click on already-levitated Aux Macro Pad key (#1..#5) -> 115ms bottom-out slam & close */
        if (selectedAuxIndex === auxIdx && selectedZ === null) {
          confirmAndClose();
          return;
        }

        /* First click -> mutually lock out main element selection, levitate aux key & Live Sync host */
        cancelBlindDwellTimer();
        cancelBlindFlashTimer();
        inspectedBlindZ = null;
        inspectedBlindAuxIndex = null;
        blindFlashZ = null;
        extNearRendererActive = false;
        selectedZ = null;
        confirmSlamZ = null;
        selectedAuxIndex = auxIdx;
        var chosenAux = resolveLevelForAuxSlot(slot, '');
        if (chosenAux) {
          activeEffortByAux.set(auxIdx, chosenAux.effort);
        }
        syncHostWithActiveState();
        playSound('lift');
        syncSceneAndDom();
        if (activeRenderer && !isReducedMotion(doc, root)) {
          if (typeof activeRenderer.triggerEnergyPulse === 'function') {
            try {
              activeRenderer.triggerEnergyPulse(0.82);
            } catch (e) {}
          }
        }
        if (lastPointerClient.active) {
          forwardPointerToRenderer(lastPointerClient.x, lastPointerClient.y, true);
        }
        scheduleSettledRectSync();
      }

      function triggerBlindKeyFeedback(slotZ) {
        if (isConfirmClosing || isDrawerClosing) return;
        cancelBlindDwellTimer();
        cancelBlindFlashTimer();

        var isOrchNonPlanner = Boolean(orchLatched && fullAvailableByZ.has(slotZ));
        if (isOrchNonPlanner) {
          blindFlashZ = null;
          hoveredZ = slotZ;
          inspectedBlindZ = slotZ;
          playSound('lock');
          var lockBtn = keyNodesByZ.get(slotZ);
          if (lockBtn) lockBtn.classList.remove('is-locked-shake');

          lockedShakeZ = { z: slotZ, progress: 0.25 };
          syncSceneAndDom();

          scheduleTrackedTimer(function () {
            if (isDestroyed || !overlayEl || isConfirmClosing || isDrawerClosing) return;
            if (lockBtn) lockBtn.classList.add('is-locked-shake');
            lockedShakeZ = { z: slotZ, progress: 0.65 };
            syncSceneAndDom();
          }, 45);

          scheduleTrackedTimer(function () {
            if (lockBtn) lockBtn.classList.remove('is-locked-shake');
            lockedShakeZ = null;
            if (!isDestroyed && overlayEl && !isConfirmClosing && !isDrawerClosing) {
              syncSceneAndDom();
            }
          }, 155);
          return;
        }

        /* 114 Standby Periodic Blind Keys: physically pressable + soft thock + 1s chemistry OLED flash (keeps active floating key rock-steady) */
        blindFlashZ = slotZ;
        playSound('fidget');
        if (activeRenderer && typeof activeRenderer.triggerBlindKeyPress === 'function') {
          try {
            activeRenderer.triggerBlindKeyPress(slotZ);
          } catch (e) {}
        }
        syncSceneAndDom(true);

        var flashedZ = slotZ;
        blindFlashTimer = scheduleTrackedTimer(function () {
          blindFlashTimer = 0;
          if (blindFlashZ === flashedZ) {
            blindFlashZ = null;
          }
          if (!isDestroyed && overlayEl && !isConfirmClosing && !isDrawerClosing) {
            syncSceneAndDom(true);
          }
        }, BLIND_FLASH_DURATION_MS);
      }

      function resetOrbitViewAction(fromHardwareControl) {
        if (isConfirmClosing || isDrawerClosing || !overlayEl) return false;
        var beforeOrbit = getChassisOrbitSafe();
        pendingServoOrbit = null;
        var didReset = false;
        if (activeRenderer) {
          if (isReducedMotion(doc, root) && typeof activeRenderer.setChassisOrbit === 'function') {
            try {
              activeRenderer.setChassisOrbit(0, 0);
              didReset = true;
            } catch (e) {}
          } else if (typeof activeRenderer.resetChassisOrbit === 'function') {
            try {
              activeRenderer.resetChassisOrbit();
              didReset = true;
            } catch (e) {}
          } else if (typeof activeRenderer.setChassisOrbit === 'function') {
            try {
              activeRenderer.setChassisOrbit(0, 0);
              didReset = true;
            } catch (e) {}
          }
        }
        if (beforeOrbit.isRotated || didReset || fromHardwareControl) {
          playSound('reset');
        }
        syncHitLayerRects();
        if (didReset && !isReducedMotion(doc, root)) {
          stopOrbitFollowSync();
          startOrbitFollowSync();
        }
        return didReset;
      }

      function pushOrbitSample(samples, x, y, tMs) {
        if (!Array.isArray(samples)) return;
        samples.push({ x: x, y: y, t: tMs });
        while (samples.length > 1 && tMs - samples[0].t > 56) {
          samples.shift();
        }
        while (samples.length > 16) {
          samples.shift();
        }
      }

      function computeOrbitFlingVelocity(samples, endX, endY, endMs) {
        if (!Array.isArray(samples) || samples.length < 1) {
          return { velPitch: 0, velYaw: 0 };
        }
        var lastSample = samples[samples.length - 1];
        if (endMs - lastSample.t > 52) {
          return { velPitch: 0, velYaw: 0 };
        }
        var anchor = samples[0];
        for (var i = samples.length - 1; i >= 0; i -= 1) {
          var age = endMs - samples[i].t;
          anchor = samples[i];
          if (age >= ORBIT_FLING_WINDOW_MS) {
            break;
          }
        }
        var dtSec = (endMs - anchor.t) / 1000;
        if (dtSec < 0.004 || dtSec > 0.1) {
          return { velPitch: 0, velYaw: 0 };
        }
        var vx = (endX - anchor.x) / dtSec;
        var vy = (endY - anchor.y) / dtSec;
        var velPitch = Math.max(-ORBIT_MAX_VEL_RAD, Math.min(ORBIT_MAX_VEL_RAD, vy * ORBIT_PITCH_RAD_PER_PX));
        var velYaw = Math.max(-ORBIT_MAX_VEL_RAD, Math.min(ORBIT_MAX_VEL_RAD, vx * ORBIT_YAW_RAD_PER_PX));
        return { velPitch: velPitch, velYaw: velYaw };
      }

      /* Resolve In-Flow Push-Up Host Container ([data-prism-dock-host] -> flex-col ancestor -> doc.body) */
      function isFlexColumnContainer(el) {
        if (!el || typeof el !== 'object') return false;
        if (el.classList && typeof el.classList.contains === 'function' && el.classList.contains('flex-col')) {
          return true;
        }
        if (typeof el.className === 'string' && /\bflex-col\b/.test(el.className)) {
          return true;
        }
        if (el.style && el.style.flexDirection === 'column') {
          return true;
        }
        try {
          if (root && typeof root.getComputedStyle === 'function') {
            var cs = root.getComputedStyle(el);
            if (cs && String(cs.display).indexOf('flex') !== -1 && cs.flexDirection === 'column') {
              return true;
            }
          }
        } catch (e) {}
        return false;
      }

      function resolveDrawerMountHost(docRef, triggerEl) {
        if (!docRef) return { host: null, inFlow: false };
        try {
          var explicitHost = resolveTargetElement(docRef, configuredMountContainer);
          if (explicitHost && typeof explicitHost.appendChild === 'function') return { host: explicitHost, inFlow: explicitHost !== docRef.body };
          var dockHost = (triggerEl && typeof triggerEl.closest === 'function' && triggerEl.closest('[data-prism-dock-host]')) || (typeof docRef.querySelector === 'function' ? docRef.querySelector('[data-prism-dock-host]') : null);
          if (dockHost && typeof dockHost.appendChild === 'function') return { host: dockHost, inFlow: true };
          var composerBox = resolveTargetElement(docRef, configuredComposerOpt) || (triggerEl && typeof triggerEl.closest === 'function' && triggerEl.closest('[data-prism-composer]')) || (typeof docRef.querySelector === 'function' ? docRef.querySelector('[data-prism-composer]') : null);
          if (composerBox) {
            var cur = composerBox.parentElement, guard = 0;
            while (cur && cur !== docRef.body && cur !== docRef.documentElement && guard < 12) {
              if (isFlexColumnContainer(cur) && typeof cur.appendChild === 'function') return { host: cur, inFlow: true };
              cur = cur.parentElement; guard += 1;
            }
          }
        } catch (e) {}
        return { host: docRef.body, inFlow: false };
      }
      function findNearBottomScrollContainer(hostEl) {
        if (!hostEl || typeof hostEl.querySelectorAll !== 'function') return null;
        try {
          var candidates = hostEl.querySelectorAll('[data-prism-scroll], [role="log"], div, main, section');
          for (var i = 0; i < candidates.length; i += 1) {
            var el = candidates[i];
            if (!el || (overlayEl && (el === overlayEl || (typeof overlayEl.contains === 'function' && overlayEl.contains(el))))) continue;
            var sh = Number(el.scrollHeight) || 0, ch = Number(el.clientHeight) || 0, st = Number(el.scrollTop) || 0;
            if (sh > ch + 4 && sh - st - ch <= 72) return el;
          }
        } catch (e) {}
        return null;
      }
      function getStageModeAction() {
        return stageMode;
      }

      function setStageModeAction(nextStageMode) {
        if (isDestroyed || isDrawerClosing) return stageMode;
        var normalized = nextStageMode === 'fullscreen' ? 'fullscreen' : 'drawer';
        var prevMode = stageMode;
        stageMode = normalized;

        if (!overlayEl) {
          return stageMode;
        }

        overlayEl.setAttribute('data-stage-mode', stageMode);

        if (stageMode === 'fullscreen') {
          overlayEl.setAttribute('aria-modal', 'true');
          overlayEl.removeAttribute('data-in-flow');
          overlayEl.setAttribute('data-dock-compact', '0');
          overlayEl.setAttribute('data-compact-expanded', '0');
          if (doc && doc.body && overlayEl.parentNode !== doc.body) {
            doc.body.appendChild(overlayEl);
          }
          overlayEl.setAttribute('data-open', '1');
        } else if (prevMode === 'fullscreen' && stageMode === 'drawer') {
          /* Returning from fullscreen -> in-flow drawer resets 3D orbit & seamlessly re-docks below input box */
          if (isOrbitDragging) {
            isOrbitDragging = false;
            gestureState = null;
            overlayEl.removeAttribute('data-orbit-dragging');
            if (activeRenderer && typeof activeRenderer.endChassisOrbitDrag === 'function') {
              try {
                activeRenderer.endChassisOrbitDrag(0, 0);
              } catch (e) {}
            }
          }
          if (getChassisOrbitSafe().isRotated || pendingServoOrbit) {
            resetOrbitViewAction(false);
          }
          overlayEl.setAttribute('aria-modal', 'false');
          var mountDest = resolveDrawerMountHost(doc, activeAnchorBtn);
          overlayEl.setAttribute('data-in-flow', mountDest.inFlow ? '1' : '0');
          if (mountDest.host && overlayEl.parentNode !== mountDest.host) {
            mountDest.host.appendChild(overlayEl);
          }
          overlayEl.setAttribute('data-open', '1');
        }

        if (prevMode !== stageMode) {
          playSound('step', stageMode === 'fullscreen' ? 3 : 1);
          if (typeof opts.onStageModeChange === 'function') { try { opts.onStageModeChange(stageMode); } catch (eSm) {} }
        }

        syncDockCompactState();
        resizeCanvasToStage();
        syncSceneAndDom(true);
        if (!isOrbitDragging) {
          syncHitLayerRects();
        }

        if (reqRaf) {
          if (modeLayoutRafId && cancelRaf) {
            cancelRaf(modeLayoutRafId);
          }
          modeLayoutRafId = reqRaf(function () {
            modeLayoutRafId = 0;
            if (overlayEl && !isDestroyed) {
              syncDockCompactState();
              resizeCanvasToStage();
              if (!isOrbitDragging) {
                syncHitLayerRects();
              }
            }
          });
        }
        return stageMode;
      }

      function toggleStageModeAction() {
        return setStageModeAction(stageMode === 'drawer' ? 'fullscreen' : 'drawer');
      }

      function toggleCardFlipAction() {
        if (isConfirmClosing || isDrawerClosing || !overlayEl) return false;
        cardFlipped = !cardFlipped;
        playSound('step', cardFlipped ? 3 : 1);
        syncSceneAndDom(true);
        return cardFlipped;
      }

      function toggleCompactExpandAction() {
        if (isConfirmClosing || isDrawerClosing || !overlayEl) return false;
        compactExpanded = !compactExpanded;
        playSound('step', compactExpanded ? 2 : 0);
        syncSceneAndDom(true);
        return compactExpanded;
      }

      function toggleMuteAction() {
        if (isConfirmClosing || isDrawerClosing) return;
        muted = !muted;
        writeMutedPref(root, muted);
        if (!muted) playSound('step', 2);
        syncSceneAndDom();
      }

      function hasPointerCoords(ev) {
        if (!ev) return false;
        return (Number(ev.clientX) || 0) !== 0 || (Number(ev.clientY) || 0) !== 0;
      }

      function resolvePickedControlAction(picked) {
        if (!picked || picked.kind !== 'control') return null;
        return picked.action || picked.id || null;
      }

      function triggerPrismWaveAction() {
        if (isConfirmClosing || isDrawerClosing || !overlayEl) return false;
        playSound('prism-wave');
        if (activeRenderer) {
          if (typeof activeRenderer.triggerControlPress === 'function') {
            try {
              activeRenderer.triggerControlPress('prism-wave');
            } catch (e) {}
          }
          if (!isReducedMotion(doc, root) && typeof activeRenderer.triggerWaveRipple === 'function') {
            try {
              activeRenderer.triggerWaveRipple('prism-wave', 1.15);
            } catch (e) {}
          }
        }
        syncHitLayerRects();
        return true;
      }

      function dispatchPickedTarget(picked) {
        if (isConfirmClosing || isDrawerClosing) return;
        if (!picked) {
          if (stageMode === 'fullscreen') {
            confirmAndClose();
          }
          return;
        }
        if (picked.kind === 'chassis') {
          return;
        }
        if (picked.kind === 'aux-key') {
          var auxIdx = picked.auxIndex !== undefined ? picked.auxIndex : picked.slotIndex;
          if (Number.isFinite(auxIdx)) {
            handleAuxKeyClick(auxIdx);
          }
          return;
        }
        if (picked.kind === 'key') {
          var kz = picked.slotZ || picked.z;
          if (availableByZ.has(kz)) {
            handleAvailableKeyClick(kz);
          } else {
            triggerBlindKeyFeedback(kz);
          }
          return;
        }
        if (picked.kind === 'effort') {
          var curDeck = buildCurrentDeckPayload(isZhLocale(doc, root));
          if (curDeck.inspectKind === 'aux' && curDeck.auxSlot) {
            handleAuxEffortSelect(curDeck.auxSlot.slotIndex, picked.effort);
          } else {
            handleEffortSelect(picked.effort);
          }
          return;
        }
        if (picked.kind === 'control') {
          var ctrlAction = resolvePickedControlAction(picked);
          if (ctrlAction === 'prism-wave') {
            triggerPrismWaveAction();
          } else if (ctrlAction === 'reset-view' || ctrlAction === 'reset') {
            if (activeRenderer && typeof activeRenderer.triggerControlPress === 'function') {
              try {
                activeRenderer.triggerControlPress('reset-view');
              } catch (e) {}
            }
            resetOrbitViewAction(true);
          } else if (ctrlAction === 'mute') {
            toggleMuteAction();
            if (activeRenderer && typeof activeRenderer.triggerControlPress === 'function') {
              try {
                activeRenderer.triggerControlPress('mute');
              } catch (e) {}
            }
          } else if (ctrlAction === 'close') {
            if (activeRenderer && typeof activeRenderer.triggerControlPress === 'function') {
              try {
                activeRenderer.triggerControlPress('close');
              } catch (e) {}
            }
            confirmAndClose();
          }
        }
      }

      var initialAuxBadge = null;
      var initialElementZ = null;

      function syncSelectionStateFromHostCtx(hostCtxObj) {
        initialOption = hostCtxObj && hostCtxObj.selectedModel ? hostCtxObj.selectedModel : null;
        initialOrchPickModel =
          hostCtxObj && hostCtxObj.orchestratorPick && hostCtxObj.orchestratorPick.model
            ? hostCtxObj.orchestratorPick.model
            : null;
        initialAuxBadge = activeCommittedAuxBadge;
        initialElementZ = activeCommittedElementZ;
        hasModified = false;

        fullAvailableEntries = hostCtxObj
          ? matchGoogleElementModels(hostCtxObj.modelOptions, hostCtxObj.effortIndex)
          : [];
        fullAvailableByZ = fullAvailableEntries.byZ || new Map();
        fullAuxSlots = matchHostAuxModels(
          hostCtxObj ? hostCtxObj.modelOptions : null,
          hostCtxObj ? hostCtxObj.effortIndex : null,
          hostCtxObj ? hostCtxObj.orchestratorPlanners : null
        );
        orchRegistry = buildOrchestratorRegistry(hostCtxObj);

        orchLatched = false;
        selectedZ = null;
        selectedAuxIndex = null;

        if (initialOption) {
          var initParsed = parseElementModelLabel(initialOption);
          if (initParsed && fullAvailableByZ.has(initParsed.slotZ)) {
            selectedZ = initParsed.slotZ;
            activeEffortByZ.set(initParsed.slotZ, initParsed.effort);
          } else {
            var initAuxCls = classifyNonElementOption(initialOption, '');
            if (
              initAuxCls &&
              initAuxCls.groupKey === 'orchestrator' &&
              (!orchRegistry || orchRegistry.latchCapable)
            ) {
              orchLatched = true;
            } else {
              for (var ai = 0; ai < fullAuxSlots.length; ai += 1) {
                var aCandidate = fullAuxSlots[ai];
                if (!aCandidate || !aCandidate.available) continue;
                var labelMatched = false;
                if (Array.isArray(aCandidate.allOptions)) {
                  for (var oi = 0; oi < aCandidate.allOptions.length; oi += 1) {
                    if (aCandidate.allOptions[oi] && aCandidate.allOptions[oi].label === initialOption.label) {
                      labelMatched = true;
                      break;
                    }
                  }
                }
                if (labelMatched || (initAuxCls && aCandidate.id === initAuxCls.groupKey)) {
                  selectedAuxIndex = ai;
                  if (initAuxCls && initAuxCls.variantEffort) {
                    activeEffortByAux.set(ai, initAuxCls.variantEffort);
                  }
                  break;
                }
              }
            }
          }
        }

        initialOrchLatched = orchLatched;
        recomputeEffectiveAvailability();
        if (orchLatched) {
          ensureValidPlannerSelectedForOrch(initialOption);
        }
      }

      function open(anchorBtn) {
        if (isDestroyed || currentMode === 'off' || !doc || !doc.body) return false;
        cancelIdleResourceEviction();
        ensureStyles();
        lastBentoDomSig = '';
        lastStageCursor = '';
        rimGlowWasActive = false;

        if (overlayEl) {
          close({ revert: false, silent: true, skipEvictSchedule: true });
        }

        var triggerEl = resolveTargetElement(doc, anchorBtn) || findFallbackModelTrigger(doc, configuredTriggerOpt);
        activeAnchorBtn = triggerEl || null;
        activeHostCtx = readHostModelContext(triggerEl, root, doc);
        cardFlipped = false;
        compactExpanded = false;
        hoveredZ = null;
        hoveredAuxIndex = null;
        inspectedBlindZ = null;
        inspectedBlindAuxIndex = null;
        blindFlashZ = null;
        extNearRendererActive = false;
        pressedZ = null;
        pressedAuxIndex = null;
        hoveredEffort = null;
        pressedEffort = null;
        dragEffortProgress = null;
        hoveredBtn = null;
        pressedBtn = null;
        lockedShakeZ = null;
        lockedShakeAuxIndex = null;
        isConfirmClosing = false;
        isDrawerClosing = false;
        confirmSlamZ = null;
        confirmSlamAuxIndex = null;
        pointerDownOutside = false;
        isOrbitDragging = false;
        gestureState = null;
        pendingServoOrbit = null;
        suppressPostDragClickUntil = 0;
        lastPointerClient.x = -9999;
        lastPointerClient.y = -9999;
        lastPointerClient.active = false;

        syncSelectionStateFromHostCtx(activeHostCtx);

        var zh = isZhLocale(doc, root);
        var profile = resolvePrismThemeProfile(doc, root);

        overlayEl = mkEl(doc, 'div', 'pp-console-backdrop');
        overlayEl.id = ROOT_ID;
        overlayEl.setAttribute('id', ROOT_ID);
        overlayEl.setAttribute('role', 'dialog');
        overlayEl.setAttribute('aria-modal', stageMode === 'fullscreen' ? 'true' : 'false');
        overlayEl.setAttribute('aria-label', zh ? 'Google 元素周期表 3D 模型选择器' : 'Periodic Table 3D Model Picker');
        overlayEl.setAttribute('data-stage-mode', stageMode);
        overlayEl.setAttribute('data-theme', profile.theme);
        overlayEl.setAttribute('data-kit', profile.id);
        overlayEl.setAttribute('data-rim-tone', profile.rimTone || 'default');
        overlayEl.setAttribute('data-corners', profile.corners);
        overlayEl.setAttribute('data-mono', profile.isMono ? '1' : '0');
        overlayEl.setAttribute('data-card-flipped', '0');
        overlayEl.setAttribute('data-orch-latched', orchLatched ? '1' : '0');
        overlayEl.setAttribute('data-pointer-near', '0');
        overlayEl.setAttribute('data-open', '0');

        /* Clean Studio Cyclorama & Whisper-Subtle Silkscreen Topographic Stage (.pp-deskmat-stage) */
        deskmatEl = buildDeskmatStage(doc, root);

        /* V12 1px Local Cool-White Rim Hairline & 32x3px Anodized Aluminum Grip */
        dockTopRimEl = mkEl(doc, 'div', 'pp-dock-top-rim');
        dockTopRimEl.setAttribute('aria-hidden', 'true');
        dockGripEl = mkEl(doc, 'div', 'pp-dock-grip');
        dockGripEl.setAttribute('aria-hidden', 'true');

        /* V12 Horizontal Triptych Container (.pp-spatial-dock: 26% Left Flip Card + 74% Dual-Keyboard Stage) */
        spatialDockEl = mkEl(doc, 'div', 'pp-spatial-dock');

        /* Left Wing 3D Flip Card + Narrow Compact Bar + Top-Right Control Capsule */
        bentoRefs = buildBentoTwinCards(doc, {
          onToggleCardFlip: toggleCardFlipAction,
          onToggleCompactExpand: toggleCompactExpandAction,
          onToggleStageMode: toggleStageModeAction,
          onToggleMute: function () {
            toggleMuteAction();
            if (activeRenderer && typeof activeRenderer.triggerControlPress === 'function') {
              try {
                activeRenderer.triggerControlPress('mute');
              } catch (e) {}
            }
          },
          onConfirmClose: confirmAndClose,
        });

        /* Frameless 3D Hardware Stage (.pp-stage + .pp-modal alias for test harness compatibility) */
        stageEl = mkEl(doc, 'div', 'pp-stage pp-modal');
        mountStudioFloorRig(doc, stageEl);
        canvasEl = mkEl(doc, 'canvas', 'pp-gl-canvas');
        canvasEl.setAttribute('aria-hidden', 'true');
        hitLayerEl = mkEl(doc, 'div', 'pp-hit-layer');

        /* Hidden Accessibility Readout Node ([data-testid="pp-inspector-deck"]) */
        var srDeck = mkEl(doc, 'div', 'pp-sr-only');
        srDeck.setAttribute('data-testid', 'pp-inspector-deck');
        srDeck.setAttribute('aria-live', 'polite');
        var srBanner = mkEl(doc, 'div', '');
        srBanner.setAttribute('data-testid', 'pp-session-banner');
        srBanner.setAttribute('data-show', '0');
        var srBannerText = mkEl(doc, 'span', '', '');
        srBanner.appendChild(srBannerText);
        var srTitle = mkEl(doc, 'span', '', '');
        var srChem = mkEl(doc, 'span', '', '');
        var srSub = mkEl(doc, 'span', '', '');
        srDeck.appendChild(srBanner);
        srDeck.appendChild(srTitle);
        srDeck.appendChild(srChem);
        srDeck.appendChild(srSub);
        hitLayerEl.appendChild(srDeck);

        /* Semantic Keycap Hit Buttons (90 Periodic Elements — live dynamic availability check!) */
        keyNodesByZ.clear();
        for (var idx = 0; idx < ELEMENTS_90.length; idx += 1) {
          (function (slot) {
            var isAvailInit = availableByZ.has(slot.z);
            var keyBtn = mkEl(
              doc,
              'button',
              'pp-hit-btn pp-key ' + (isAvailInit ? 'pp-key-avail' : 'pp-key-blind')
            );
            keyBtn.type = 'button';
            keyBtn.setAttribute('data-pp-z', String(slot.z));
            keyBtn.setAttribute('data-z', String(slot.z));
            keyBtn.setAttribute('data-symbol', slot.symbol);
            keyBtn.setAttribute('data-available', isAvailInit ? '1' : '0');
            if (!isAvailInit) {
              keyBtn.setAttribute('tabindex', '-1');
              keyBtn.setAttribute('aria-disabled', 'true');
            }
            keyBtn.setAttribute(
              'aria-label',
              fullAvailableByZ.has(slot.z)
                ? fullAvailableByZ.get(slot.z).baseName + ' (' + slot.numLabel + ' ' + slot.symbol + ')'
                : slot.numLabel + ' ' + slot.symbol + ' ' + slot.name + ' (Unreleased)'
            );

            keyBtn.addEventListener('click', function (ev) {
              ev.stopPropagation();
              if (
                hasPointerCoords(ev) &&
                activeRenderer &&
                typeof activeRenderer.pick === 'function'
              ) {
                var picked = activeRenderer.pick(ev.clientX, ev.clientY);
                if (picked) {
                  dispatchPickedTarget(picked);
                  return;
                }
              }
              if (availableByZ.has(slot.z)) {
                handleAvailableKeyClick(slot.z);
              } else {
                triggerBlindKeyFeedback(slot.z);
              }
            });

            keyNodesByZ.set(slot.z, keyBtn);
            hitLayerEl.appendChild(keyBtn);
          })(ELEMENTS_90[idx]);
        }

        /* Semantic 2x3 Aux Macro Pad Hit Buttons (6 Slots: #0 Orch Latch + #1..#5 Aux Models) */
        auxKeyNodes.length = 0;
        for (var ak = 0; ak < auxSlots.length; ak += 1) {
          (function (auxSlot, slotIdx) {
            var isAuxAvail = Boolean(auxSlot.available);
            var isOrchSlot = slotIdx === 0 && auxSlot.id === 'orchestrator';
            var auxBtn = mkEl(
              doc,
              'button',
              'pp-hit-btn pp-aux-key ' + (isAuxAvail ? 'pp-key-avail' : 'pp-key-blind')
            );
            auxBtn.type = 'button';
            auxBtn.setAttribute('data-pp-aux', String(slotIdx));
            auxBtn.setAttribute('data-aux-index', String(slotIdx));
            auxBtn.setAttribute('data-aux-id', auxSlot.id);
            auxBtn.setAttribute('data-available', isAuxAvail ? '1' : '0');
            if (isOrchSlot) {
              auxBtn.setAttribute('data-latched', orchLatched ? '1' : '0');
              auxBtn.setAttribute('aria-pressed', orchLatched ? 'true' : 'false');
            } else {
              auxBtn.setAttribute('aria-pressed', selectedAuxIndex === slotIdx ? 'true' : 'false');
            }
            if (!isAuxAvail) {
              auxBtn.setAttribute('tabindex', '-1');
              auxBtn.setAttribute('aria-disabled', 'true');
            }
            auxBtn.setAttribute(
              'aria-label',
              isAuxAvail
                ? auxSlot.title + ' (' + auxSlot.badgeCode + ' ' + auxSlot.shortLabel + ')'
                : auxSlot.badgeCode + ' (Reserved Macro Key)'
            );
            auxBtn.addEventListener('click', function (ev) {
              ev.stopPropagation();
              if (
                hasPointerCoords(ev) &&
                activeRenderer &&
                typeof activeRenderer.pick === 'function'
              ) {
                var picked = activeRenderer.pick(ev.clientX, ev.clientY);
                if (picked) {
                  dispatchPickedTarget(picked);
                  return;
                }
              }
              handleAuxKeyClick(slotIdx);
            });
            auxKeyNodes.push(auxBtn);
            hitLayerEl.appendChild(auxBtn);
          })(auxSlots[ak], ak);
        }

        stageEl.appendChild(canvasEl);
        stageEl.appendChild(hitLayerEl);

        /* View-Reset Capsule + SR-Only Accessibility Proxy Toolbar (.pp-hud-pill) */
        hudPillEl = mkEl(doc, 'div', 'pp-hud-pill');
        hudPillEl.setAttribute('role', 'toolbar');
        hudPillEl.setAttribute('aria-label', zh ? '三维视角复位与无障碍快切栏' : '3D View Reset & Accessibility Controls');
        hudPillEl.addEventListener('pointerdown', function (ev) {
          ev.stopPropagation();
        });
        hudPillEl.addEventListener('click', function (ev) {
          ev.stopPropagation();
        });

        var resetBtn = mkEl(doc, 'button', 'pp-hud-icon-btn pp-hud-reset-btn');
        resetBtn.type = 'button';
        resetBtn.setAttribute('data-pp-action', 'reset-view');
        resetBtn.setAttribute('data-testid', 'pp-reset-view-btn');
        resetBtn.setAttribute('data-rotated', '0');
        var initResetLbl = zh ? '复位三维视角 (R)' : 'Reset 3D View (R)';
        resetBtn.setAttribute('aria-label', initResetLbl);
        resetBtn.title = initResetLbl;
        resetBtn.appendChild(buildHudResetViewSvg(doc));
        var resetLabelSpan = mkEl(doc, 'span', 'pp-reset-label', zh ? '回正' : 'Reset');
        var resetKbdSpan = mkEl(doc, 'span', 'pp-reset-kbd', 'R');
        resetKbdSpan.setAttribute('aria-hidden', 'true');
        resetBtn.appendChild(resetLabelSpan);
        resetBtn.appendChild(resetKbdSpan);
        resetBtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          resetOrbitViewAction();
        });

        /* 1x1px Screen-Reader & Keyboard Accessibility Proxies (.pp-sr-only) */
        var swatchesWrap = mkEl(doc, 'div', 'pp-hud-swatches pp-sr-only');
        hudChipByZ.clear();
        var hudElements = selectHudIslandElements(fullAvailableEntries, fullAvailableByZ);

        for (var hi = 0; hi < hudElements.length; hi += 1) {
          (function (elEntry) {
            var ez = elEntry.slotZ || elEntry.z;
            var isAvailChip = availableByZ.has(ez);
            var chip = mkEl(doc, 'button', 'pp-hud-chip pp-sr-only');
            chip.type = 'button';
            chip.setAttribute('data-hud-z', String(ez));
            chip.setAttribute('data-pp-swatch-z', String(ez));
            chip.setAttribute('data-available', isAvailChip ? '1' : '0');
            chip.setAttribute('data-selected', ez === selectedZ ? '1' : '0');
            chip.setAttribute('aria-pressed', ez === selectedZ ? 'true' : 'false');
            var dot = mkEl(doc, 'span', 'pp-hud-dot');
            dot.setAttribute('aria-hidden', 'true');
            var cPal = hudGemColorsForZ(ez, profile);
            setStyleVar(dot, '--dot-bg', cPal.dot);
            setStyleVar(dot, '--dot-glow', cPal.glow || cPal.ring);
            setStyleVar(chip, '--chip-ring', cPal.ring);
            var zSpan = mkEl(doc, 'span', 'pp-chip-z', String(ez));
            var spaceTxt = typeof doc.createTextNode === 'function' ? doc.createTextNode(' ') : mkEl(doc, 'span', '', ' ');
            var symSpan = mkEl(doc, 'span', 'pp-chip-sym', elEntry.symbol);
            chip.appendChild(dot);
            chip.appendChild(zSpan);
            chip.appendChild(spaceTxt);
            chip.appendChild(symSpan);
            chip.addEventListener('click', function (ev) {
              ev.stopPropagation();
              if (availableByZ.has(ez)) {
                handleAvailableKeyClick(ez);
              } else {
                triggerBlindKeyFeedback(ez);
              }
            });
            hudChipByZ.set(ez, { btn: chip, dot: dot });
            swatchesWrap.appendChild(chip);
          })(hudElements[hi]);
        }

        var hudActions = mkEl(doc, 'div', 'pp-hud-actions pp-sr-only');

        var muteBtn = mkEl(doc, 'button', 'pp-hud-icon-btn pp-hud-mute-btn pp-sr-only');
        muteBtn.type = 'button';
        muteBtn.setAttribute('data-pp-action', 'mute');
        muteBtn.setAttribute('data-testid', 'pp-mute-btn');
        muteBtn.setAttribute('data-muted', muted ? '1' : '0');
        muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
        muteBtn.setAttribute('aria-label', zh ? '切换机械键盘音效' : 'Toggle Mechanical Keycap Audio');
        muteBtn.appendChild(buildHudMuteSvg(doc));
        muteBtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          toggleMuteAction();
          if (activeRenderer && typeof activeRenderer.triggerControlPress === 'function') {
            try {
              activeRenderer.triggerControlPress('mute');
            } catch (e) {}
          }
        });

        var closeBtn = mkEl(doc, 'button', 'pp-hud-icon-btn pp-hud-close-btn pp-sr-only');
        closeBtn.type = 'button';
        closeBtn.setAttribute('data-pp-action', 'close');
        closeBtn.setAttribute('data-testid', 'pp-close-btn');
        closeBtn.setAttribute('aria-label', zh ? '确认并关闭' : 'Confirm and close');
        closeBtn.appendChild(buildHudCloseSvg(doc));
        closeBtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          confirmAndClose();
        });

        hudActions.appendChild(muteBtn);
        hudActions.appendChild(closeBtn);

        hudPillEl.appendChild(resetBtn);
        hudPillEl.appendChild(swatchesWrap);
        hudPillEl.appendChild(hudActions);

        spatialDockEl.appendChild(bentoRefs.compactBar);
        spatialDockEl.appendChild(bentoRefs.grid);
        spatialDockEl.appendChild(stageEl);
        spatialDockEl.appendChild(bentoRefs.rightWing);
        spatialDockEl.appendChild(hudPillEl);

        overlayEl.appendChild(deskmatEl);
        overlayEl.appendChild(dockTopRimEl);
        overlayEl.appendChild(dockGripEl);
        overlayEl.appendChild(spatialDockEl);

        /* Mount into [data-prism-dock-host] (in-flow push-up dock) when stageMode === 'drawer' */
        var pinnedScrollEl = null;
        if (stageMode === 'drawer') {
          var drawerMount = resolveDrawerMountHost(doc, triggerEl);
          overlayEl.setAttribute('data-in-flow', drawerMount.inFlow ? '1' : '0');
          if (drawerMount.inFlow) {
            pinnedScrollEl = findNearBottomScrollContainer(drawerMount.host);
          }
          (drawerMount.host || doc.body).appendChild(overlayEl);
        } else {
          doc.body.appendChild(overlayEl);
        }

        if (doc.documentElement && typeof doc.documentElement.setAttribute === 'function') {
          doc.documentElement.setAttribute('data-pp-open', '1');
        }
        if (typeof opts.onOpenChange === 'function') { try { opts.onOpenChange(true, stageMode); } catch (eOp) {} }

        uiRefs = {
          banner: srBanner,
          bannerText: srBannerText,
          srTitle: srTitle,
          srChem: srChem,
          srSub: srSub,
          resetBtn: resetBtn,
          resetLabel: resetLabelSpan,
          muteBtn: muteBtn,
          closeBtn: closeBtn,
          effortButtons: [],
          lastEffortSig: '',
          lastRotatedFlag: '0',
        };

        /* Attach ResizeObserver on overlayEl & spatialDockEl for live <1100px compact folding when sidebar resizes */
        var ResizeObsCtor =
          (root && root.ResizeObserver) || (typeof ResizeObserver === 'function' ? ResizeObserver : null);
        if (ResizeObsCtor && overlayEl) {
          try {
            dockResizeObserver = new ResizeObsCtor(function () {
              if (!overlayEl || isDestroyed || isDrawerClosing) return;
              syncDockCompactState();
              resizeCanvasToStage();
              if (!isOrbitDragging) syncHitLayerRects();
            });
            dockResizeObserver.observe(overlayEl);
            if (spatialDockEl) dockResizeObserver.observe(spatialDockEl);
          } catch (e) {
            dockResizeObserver = null;
          }
        }

        /* Instantiate 3D WebGL2 / Canvas2D Renderer */
        var kbFactory = resolveKeyboard3DFactory(root);
        if (kbFactory) {
          try {
            activeRenderer = kbFactory.createKeyboard3DRenderer({
              canvas: canvasEl,
              doc: doc,
              root: root,
              slots: ELEMENTS_90,
            });
          } catch (e) {
            activeRenderer = null;
          }
        }

        syncDockCompactState();
        resizeCanvasToStage();
        syncSceneAndDom();

        /* V8 Intro Wake: 340ms weightless levitation lift & left-to-right prismatic sweep */
        if (activeRenderer && !isReducedMotion(doc, root) && typeof activeRenderer.triggerIntroWake === 'function') {
          try {
            activeRenderer.triggerIntroWake();
            syncHitLayerRects();
            scheduleSettledRectSync();
          } catch (e) {}
        }

        /* Capture-phase guard: swallow synthetic post-drag click on stage/backdrop after 3D Orbit (>6px), Slider scrub or Knob turn */
        overlayEl.addEventListener(
          'click',
          function (ev) {
            if (suppressPostDragClickUntil > 0) {
              var inBentoOrHud =
                (bentoRefs &&
                  bentoRefs.grid &&
                  ev &&
                  ev.target &&
                  typeof bentoRefs.grid.contains === 'function' &&
                  bentoRefs.grid.contains(ev.target)) ||
                (bentoRefs &&
                  bentoRefs.rightWing &&
                  ev &&
                  ev.target &&
                  typeof bentoRefs.rightWing.contains === 'function' &&
                  bentoRefs.rightWing.contains(ev.target)) ||
                (bentoRefs &&
                  bentoRefs.compactBar &&
                  ev &&
                  ev.target &&
                  typeof bentoRefs.compactBar.contains === 'function' &&
                  bentoRefs.compactBar.contains(ev.target)) ||
                (hudPillEl && ev && ev.target && typeof hudPillEl.contains === 'function' && hudPillEl.contains(ev.target));
              var blockClick = !inBentoOrHud && readClockMs() <= suppressPostDragClickUntil;
              suppressPostDragClickUntil = 0;
              if (blockClick) {
                if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
                if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
                if (ev && typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
                return;
              }
            }
          },
          true
        );

        /* Rotary Encoder Knob Wheel Interaction: scroll over the diamond-knurled knob to step thinking effort */
        overlayEl.addEventListener('wheel', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing || !ev) return;
          if (!activeRenderer || typeof activeRenderer.pick !== 'function') return;
          var wx = Number(ev.clientX) || 0;
          var wy = Number(ev.clientY) || 0;
          var hitWheel = activeRenderer.pick(wx, wy);
          if (hitWheel && hitWheel.kind === 'control' && resolvePickedControlAction(hitWheel) === 'mute') {
            if (typeof ev.preventDefault === 'function') ev.preventDefault();
            if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
            var dir = (Number(ev.deltaY) || 0) < 0 ? 1 : -1;
            stepActiveEffortByDelta(dir);
          }
        });

        /* Fullscreen backdrop click outside spatial dock -> confirm & close (drawer has zero fullscreen mask) */
        overlayEl.addEventListener('click', function (ev) {
          if (stageMode === 'fullscreen' && (ev.target === overlayEl || (deskmatEl && ev.target === deskmatEl))) {
            confirmAndClose();
          }
        });

        function clearStageHoverAndPress() {
          if (isConfirmClosing || isDrawerClosing) return;
          cancelBlindDwellTimer();
          if (stageEl) setStyleVar(stageEl, 'cursor', 'default');
          if (canvasEl) setStyleVar(canvasEl, 'cursor', 'default');
          var hadHoverOrPress =
            hoveredZ !== null ||
            hoveredAuxIndex !== null ||
            inspectedBlindZ !== null ||
            inspectedBlindAuxIndex !== null ||
            pressedZ !== null ||
            pressedAuxIndex !== null ||
            hoveredEffort !== null ||
            pressedEffort !== null ||
            hoveredBtn !== null ||
            pressedBtn !== null;
          hoveredZ = null;
          hoveredAuxIndex = null;
          inspectedBlindZ = null;
          inspectedBlindAuxIndex = null;
          pressedZ = null;
          pressedAuxIndex = null;
          hoveredEffort = null;
          pressedEffort = null;
          hoveredBtn = null;
          pressedBtn = null;
          if (hadHoverOrPress) syncSceneAndDom(true);
        }

        var releasePressVisuals = function () {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing) return;
          if (pressedZ !== null || pressedAuxIndex !== null || pressedEffort !== null || pressedBtn !== null) {
            pressedZ = null;
            pressedAuxIndex = null;
            pressedEffort = null;
            pressedBtn = null;
            syncSceneAndDom(true);
          }
        };

        /* Zero-Conflict Multi-Modal Gesture Rig */
        overlayEl.addEventListener('pointerdown', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing || !ev || ev.button !== 0) return;
          suppressPostDragClickUntil = 0;

          var insideHud =
            hudPillEl && ev.target && typeof hudPillEl.contains === 'function' && hudPillEl.contains(ev.target);
          var insideRight =
            bentoRefs &&
            bentoRefs.rightWing &&
            ev.target &&
            typeof bentoRefs.rightWing.contains === 'function' &&
            bentoRefs.rightWing.contains(ev.target);
          var insideCompact =
            bentoRefs &&
            bentoRefs.compactBar &&
            ev.target &&
            typeof bentoRefs.compactBar.contains === 'function' &&
            bentoRefs.compactBar.contains(ev.target);
          var insideBento =
            bentoRefs &&
            bentoRefs.grid &&
            ev.target &&
            typeof bentoRefs.grid.contains === 'function' &&
            bentoRefs.grid.contains(ev.target);
          if (insideHud || insideRight || insideCompact || insideBento) return;

          if (compactExpanded) {
            compactExpanded = false;
            syncDockCompactState();
          }

          var sx = Number(ev.clientX) || 0;
          var sy = Number(ev.clientY) || 0;
          var nowTs = readClockMs();
          pointerDownOutside = false;
          if (!isOrbitDragging && nowTs - lastBoundsSyncMs > 80) {
            lastBoundsSyncMs = nowTs;
            refreshCachedDockBounds();
          }

          var hit =
            activeRenderer && typeof activeRenderer.pick === 'function' ? activeRenderer.pick(sx, sy) : null;
          var targetEffAttr =
            ev.target && typeof ev.target.getAttribute === 'function'
              ? ev.target.getAttribute('data-pp-effort')
              : null;
          var curDeckDown = buildCurrentDeckPayload(isZhLocale(doc, root));
          var isAvailInspected = Boolean(
            curDeckDown.deckInfo &&
              curDeckDown.deckInfo.isAvailable &&
              curDeckDown.deckInfo.levels &&
              curDeckDown.deckInfo.levels.length > 1
          );
          var inSliderBand =
            isAvailInspected &&
            Boolean((hit && hit.kind === 'effort') || targetEffAttr || isPointInEffortSliderBand(sx, sy));

          if (inSliderBand) {
            var startSliderRes = resolveEffortAlongSlider(sx, sy);
            var startEffort =
              (hit && hit.kind === 'effort' && hit.effort) || targetEffAttr || startSliderRes.effort || null;
            gestureState = {
              active: true,
              pointerId: ev.pointerId,
              kind: 'slider',
              scrubbing: false,
              inspectKind: curDeckDown.inspectKind,
              inspectZ: curDeckDown.slot ? curDeckDown.slot.z : resolveInspectedElementZ(),
              inspectAuxIndex: curDeckDown.auxSlot ? curDeckDown.auxSlot.slotIndex : null,
              startEffort: startEffort,
              startX: sx,
              startY: sy,
              lastX: sx,
              lastY: sy,
              samples: [],
            };
            if (startEffort) {
              hoveredEffort = startEffort;
              pressedEffort = startEffort;
              playSound('down');
              syncSceneAndDom(true);
            }
            return;
          }

          if (hit && hit.kind === 'control' && resolvePickedControlAction(hit) === 'mute') {
            hoveredBtn = 'mute';
            pressedBtn = 'mute';
            gestureState = {
              active: true,
              pointerId: ev.pointerId,
              kind: 'knob',
              rotated: false,
              accumPx: 0,
              startX: sx,
              startY: sy,
              lastX: sx,
              lastY: sy,
              samples: [],
            };
            playSound('down');
            syncSceneAndDom(true);
            return;
          }

          gestureState = {
            active: true,
            pointerId: ev.pointerId,
            kind: 'orbit',
            isOrbitDragging: false,
            drawerDragSuppressed: false,
            startX: sx,
            startY: sy,
            lastX: sx,
            lastY: sy,
            samples: [{ x: sx, y: sy, t: nowTs }],
          };

          if (!hit) {
            var clickedBackdropArea =
              ev.target === overlayEl || (deskmatEl && ev.target === deskmatEl);
            pointerDownOutside = Boolean(stageMode === 'fullscreen' && (clickedBackdropArea || true));
            return;
          }
          if (hit.kind === 'aux-key') {
            pressedAuxIndex = hit.auxIndex !== undefined ? hit.auxIndex : hit.slotIndex;
            playSound('down');
            syncSceneAndDom(true);
          } else if (hit.kind === 'key') {
            pressedZ = hit.slotZ || hit.z;
            playSound('down');
            syncSceneAndDom(true);
          } else if (hit.kind === 'control') {
            var downCtrl = resolvePickedControlAction(hit);
            hoveredBtn = downCtrl;
            pressedBtn = downCtrl;
            playSound('down');
            syncSceneAndDom(true);
          }
        });

        overlayEl.addEventListener('pointermove', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing || !ev) return;
          var cx = Number(ev.clientX) || 0;
          var cy = Number(ev.clientY) || 0;
          var nowTs = readClockMs();
          lastPointerClient.x = cx;
          lastPointerClient.y = cy;
          lastPointerClient.active = true;
          extNearRendererActive = false;

          /* Local 150px Cool-White CNC Chamfer Glint coordinates (0 reflow) */
          updateDynamicPrismCssVars(cx, cy);
          forwardPointerToRenderer(cx, cy, true);

          if (gestureState && gestureState.active) {
            var distFromStart = Math.hypot(cx - gestureState.startX, cy - gestureState.startY);

            if (gestureState.kind === 'knob') {
              var kDx = cx - gestureState.lastX;
              var kDy = gestureState.lastY - cy;
              gestureState.lastX = cx;
              gestureState.lastY = cy;
              if (distFromStart > ORBIT_DRAG_THRESHOLD_PX) {
                gestureState.dragged = true;
                overlayEl.setAttribute('data-effort-dragging', '1');
                try {
                  if (typeof overlayEl.setPointerCapture === 'function' && ev.pointerId !== undefined) {
                    overlayEl.setPointerCapture(ev.pointerId);
                  }
                } catch (e) {}
              }
              gestureState.accumPx += Math.abs(kDx) >= Math.abs(kDy) ? kDx : kDy;
              if (Math.abs(gestureState.accumPx) >= 16) {
                var kSteps = Math.trunc(gestureState.accumPx / 16);
                gestureState.accumPx -= kSteps * 16;
                gestureState.rotated = true;
                gestureState.dragged = true;
                stepActiveEffortByDelta(Math.max(-4, Math.min(4, kSteps)));
              }
              return;
            } else if (gestureState.kind === 'slider') {
              if (!gestureState.scrubbing && distFromStart > SLIDER_SCRUB_THRESHOLD_PX) {
                gestureState.scrubbing = true;
                overlayEl.setAttribute('data-effort-dragging', '1');
                try {
                  if (typeof overlayEl.setPointerCapture === 'function' && ev.pointerId !== undefined) {
                    overlayEl.setPointerCapture(ev.pointerId);
                  }
                } catch (e) {}
              }
              if (gestureState.scrubbing) {
                var sliderHit = resolveEffortAlongSlider(cx, cy);
                dragEffortProgress = sliderHit.progress;
                var scrubEffort = sliderHit.effort;
                if (scrubEffort) {
                  hoveredEffort = scrubEffort;
                  pressedEffort = scrubEffort;
                }
                if (gestureState.inspectKind === 'aux' && gestureState.inspectAuxIndex !== null) {
                  var auxSlotCur = auxSlots[gestureState.inspectAuxIndex];
                  var curAuxLvl = resolveLevelForAuxSlot(auxSlotCur, '');
                  var curAuxEff = curAuxLvl ? curAuxLvl.effort : '';
                  if (scrubEffort && scrubEffort !== curAuxEff) {
                    handleAuxEffortSelect(gestureState.inspectAuxIndex, scrubEffort);
                  } else {
                    syncSceneAndDom(true);
                  }
                } else {
                  var curEff = getActiveEffortForElement(gestureState.inspectZ);
                  if (scrubEffort && scrubEffort !== curEff) {
                    handleEffortSelect(scrubEffort, gestureState.inspectZ);
                  } else {
                    syncSceneAndDom(true);
                  }
                }
                gestureState.lastX = cx;
                gestureState.lastY = cy;
                return;
              }
            } else if (gestureState.kind === 'orbit') {
              /* Drawer Anti-Misdrag Lock: strictly forbid 3D chassis orbit drag while in drawer mode */
              if (stageMode !== 'fullscreen') {
                if (distFromStart > ORBIT_DRAG_THRESHOLD_PX && !gestureState.drawerDragSuppressed) {
                  gestureState.drawerDragSuppressed = true;
                  pointerDownOutside = false;
                  cancelBlindDwellTimer();
                  releasePressVisuals();
                }
                gestureState.lastX = cx;
                gestureState.lastY = cy;
                if (gestureState.drawerDragSuppressed) {
                  return;
                }
              } else {
                if (!gestureState.isOrbitDragging && distFromStart > ORBIT_DRAG_THRESHOLD_PX) {
                  gestureState.isOrbitDragging = true;
                  isOrbitDragging = true;
                  pointerDownOutside = false;
                  cancelBlindDwellTimer();
                  if (
                    hoveredZ !== null ||
                    hoveredAuxIndex !== null ||
                    inspectedBlindZ !== null ||
                    inspectedBlindAuxIndex !== null ||
                    pressedZ !== null ||
                    pressedAuxIndex !== null ||
                    pressedEffort !== null ||
                    pressedBtn !== null
                  ) {
                    hoveredZ = null;
                    hoveredAuxIndex = null;
                    inspectedBlindZ = null;
                    inspectedBlindAuxIndex = null;
                    pressedZ = null;
                    pressedAuxIndex = null;
                    pressedEffort = null;
                    pressedBtn = null;
                    syncSceneAndDom(true);
                  }
                  overlayEl.setAttribute('data-orbit-dragging', '1');
                  try {
                    if (typeof overlayEl.setPointerCapture === 'function' && ev.pointerId !== undefined) {
                      overlayEl.setPointerCapture(ev.pointerId);
                    }
                  } catch (e) {}
                  var ux = (cx - gestureState.startX) / distFromStart;
                  var uy = (cy - gestureState.startY) / distFromStart;
                  gestureState.lastX = gestureState.startX + ux * ORBIT_DRAG_THRESHOLD_PX;
                  gestureState.lastY = gestureState.startY + uy * ORBIT_DRAG_THRESHOLD_PX;
                  gestureState.samples = [{ x: gestureState.lastX, y: gestureState.lastY, t: nowTs }];
                }

                if (gestureState.isOrbitDragging) {
                  var stepDx = cx - gestureState.lastX;
                  var stepDy = cy - gestureState.lastY;
                  gestureState.lastX = cx;
                  gestureState.lastY = cy;
                  pushOrbitSample(gestureState.samples, cx, cy, nowTs);
                  var dPitch = stepDy * ORBIT_PITCH_RAD_PER_PX;
                  var dYaw = stepDx * ORBIT_YAW_RAD_PER_PX;
                  if (activeRenderer) {
                    if (
                      !isReducedMotion(doc, root) &&
                      typeof activeRenderer.dragChassisOrbitDelta === 'function'
                    ) {
                      try {
                        if (!pendingServoOrbit) {
                          var baseO = getChassisOrbitSafe();
                          pendingServoOrbit = { pitch: baseO.pitch, yaw: baseO.yaw };
                        }
                        pendingServoOrbit.pitch = Math.max(
                          -0.6283,
                          Math.min(0.6632, pendingServoOrbit.pitch + dPitch)
                        );
                        pendingServoOrbit.yaw = Math.max(
                          -0.7854,
                          Math.min(0.7854, pendingServoOrbit.yaw + dYaw)
                        );
                        activeRenderer.dragChassisOrbitDelta(dPitch, dYaw);
                        startOrbitFollowSync();
                      } catch (e) {}
                    } else if (typeof activeRenderer.addChassisOrbitDelta === 'function') {
                      try {
                        activeRenderer.addChassisOrbitDelta(dPitch, dYaw);
                      } catch (e) {}
                    }
                  }
                  syncOrbitParallaxAndHud();
                  return;
                }

                gestureState.lastX = cx;
                gestureState.lastY = cy;
                pushOrbitSample(gestureState.samples, cx, cy, nowTs);
              }
            }
          }

          var insideHudMove =
            hudPillEl && ev.target && typeof hudPillEl.contains === 'function' && hudPillEl.contains(ev.target);
          var insideRightMove =
            bentoRefs &&
            bentoRefs.rightWing &&
            ev.target &&
            typeof bentoRefs.rightWing.contains === 'function' &&
            bentoRefs.rightWing.contains(ev.target);
          var insideCompactMove =
            bentoRefs &&
            bentoRefs.compactBar &&
            ev.target &&
            typeof bentoRefs.compactBar.contains === 'function' &&
            bentoRefs.compactBar.contains(ev.target);
          var insideBentoMove =
            bentoRefs &&
            bentoRefs.grid &&
            ev.target &&
            typeof bentoRefs.grid.contains === 'function' &&
            bentoRefs.grid.contains(ev.target);
          if (insideHudMove || insideRightMove || insideCompactMove || insideBentoMove) {
            clearStageHoverAndPress();
            return;
          }

          if (activeRenderer && typeof activeRenderer.pick === 'function') {
            var hitMove = activeRenderer.pick(cx, cy);
            var nextHovZ = hitMove && hitMove.kind === 'key' ? hitMove.slotZ || hitMove.z : null;
            var nextHovAux =
              hitMove && hitMove.kind === 'aux-key'
                ? hitMove.auxIndex !== undefined
                  ? hitMove.auxIndex
                  : hitMove.slotIndex
                : null;
            var nextHovEff = hitMove && hitMove.kind === 'effort' ? hitMove.effort : null;
            var nextHovBtn = resolvePickedControlAction(hitMove);

            var interactiveCursor =
              (hitMove && hitMove.kind === 'key' && availableByZ.has(nextHovZ)) ||
              (hitMove &&
                hitMove.kind === 'aux-key' &&
                Boolean(auxSlots[nextHovAux] && auxSlots[nextHovAux].available)) ||
              (hitMove && (hitMove.kind === 'effort' || hitMove.kind === 'control'));
            var cursorVal = interactiveCursor ? 'pointer' : 'default';
            if (lastStageCursor !== cursorVal) {
              lastStageCursor = cursorVal;
              setStyleVar(stageEl, 'cursor', cursorVal);
              setStyleVar(canvasEl, 'cursor', cursorVal);
            }

            if (
              nextHovZ !== hoveredZ ||
              nextHovAux !== hoveredAuxIndex ||
              nextHovEff !== hoveredEffort ||
              nextHovBtn !== hoveredBtn
            ) {
              var zChanged = nextHovZ !== hoveredZ;
              var auxChanged = nextHovAux !== hoveredAuxIndex;
              hoveredZ = nextHovZ;
              hoveredAuxIndex = nextHovAux;
              hoveredEffort = nextHovEff;
              hoveredBtn = nextHovBtn;

              if (zChanged || auxChanged) {
                cancelBlindDwellTimer();
                inspectedBlindZ = null;
                inspectedBlindAuxIndex = null;
                if (nextHovZ !== null && !availableByZ.has(nextHovZ)) {
                  var targetBlindZ = nextHovZ;
                  var isOrchNonPlannerZ = Boolean(orchLatched && fullAvailableByZ.has(targetBlindZ));
                  if (isOrchNonPlannerZ) {
                    /* Immediate lock reticle preview for dimmed non-planner keys in Orch mode */
                    inspectedBlindZ = targetBlindZ;
                  } else if (blindFlashZ === null) {
                    blindDwellTimer = scheduleTrackedTimer(function () {
                      blindDwellTimer = 0;
                      if (
                        isDestroyed ||
                        !overlayEl ||
                        isConfirmClosing ||
                        isDrawerClosing ||
                        blindFlashZ !== null ||
                        hoveredZ !== targetBlindZ
                      ) {
                        return;
                      }
                      inspectedBlindZ = targetBlindZ;
                      syncSceneAndDom(true);
                    }, BLIND_HOVER_DWELL_MS);
                  }
                } else if (
                  nextHovAux !== null &&
                  auxSlots[nextHovAux] &&
                  !auxSlots[nextHovAux].available
                ) {
                  var targetBlindAux = nextHovAux;
                  var isOrchNonPlannerAux = Boolean(
                    orchLatched && fullAuxSlots[targetBlindAux] && fullAuxSlots[targetBlindAux].available
                  );
                  if (isOrchNonPlannerAux) {
                    inspectedBlindAuxIndex = targetBlindAux;
                  } else {
                    blindDwellTimer = scheduleTrackedTimer(function () {
                      blindDwellTimer = 0;
                      if (
                        isDestroyed ||
                        !overlayEl ||
                        isConfirmClosing ||
                        isDrawerClosing ||
                        hoveredAuxIndex !== targetBlindAux
                      ) {
                        return;
                      }
                      inspectedBlindAuxIndex = targetBlindAux;
                      syncSceneAndDom(true);
                    }, BLIND_HOVER_DWELL_MS);
                  }
                }
              }

              syncSceneAndDom(true);
            }
          }
        });

        function finishActiveGesture(ev, isCancel) {
          if (!overlayEl || isDestroyed) return;
          if (gestureState && gestureState.active) {
            var gs = gestureState;
            gestureState = null;
            try {
              if (typeof overlayEl.releasePointerCapture === 'function' && gs.pointerId !== undefined) {
                overlayEl.releasePointerCapture(gs.pointerId);
              }
            } catch (e) {}

            if (gs.kind === 'orbit' && gs.drawerDragSuppressed) {
              suppressPostDragClickUntil = readClockMs() + POST_DRAG_SUPPRESS_MS;
            } else if (gs.kind === 'orbit' && gs.isOrbitDragging) {
              isOrbitDragging = false;
              overlayEl.removeAttribute('data-orbit-dragging');
              suppressPostDragClickUntil = readClockMs() + POST_DRAG_SUPPRESS_MS;

              var endX = ev && ev.clientX !== undefined ? Number(ev.clientX) || gs.lastX : gs.lastX;
              var endY = ev && ev.clientY !== undefined ? Number(ev.clientY) || gs.lastY : gs.lastY;
              var endMs = readClockMs();
              var fling =
                !isCancel && !isConfirmClosing && !isDrawerClosing && !isReducedMotion(doc, root)
                  ? computeOrbitFlingVelocity(gs.samples, endX, endY, endMs)
                  : { velPitch: 0, velYaw: 0 };

              var needsAsyncSettleSync = false;
              if (activeRenderer) {
                if (typeof activeRenderer.endChassisOrbitDrag === 'function') {
                  try {
                    activeRenderer.endChassisOrbitDrag(fling.velPitch, fling.velYaw);
                  } catch (e) {}
                  if (!isConfirmClosing && !isDrawerClosing && !isReducedMotion(doc, root)) {
                    var stillCoasting =
                      typeof activeRenderer.isIdle === 'function' ? !activeRenderer.isIdle() : true;
                    if (stillCoasting) {
                      needsAsyncSettleSync = true;
                      startOrbitFollowSync();
                    }
                  }
                } else if (
                  !isCancel &&
                  !isConfirmClosing &&
                  !isDrawerClosing &&
                  !isReducedMotion(doc, root) &&
                  typeof activeRenderer.flingChassisOrbit === 'function'
                ) {
                  var flingPitch = fling.velPitch * ORBIT_FALLBACK_FLING_SCALE;
                  var flingYaw = fling.velYaw * ORBIT_FALLBACK_FLING_SCALE;
                  if (Math.hypot(flingPitch, flingYaw) > 0.025) {
                    try {
                      activeRenderer.flingChassisOrbit(flingPitch, flingYaw);
                      needsAsyncSettleSync = true;
                      startOrbitFollowSync();
                    } catch (e) {}
                  }
                }
              }
              if (!needsAsyncSettleSync) {
                syncHitLayerRects();
              } else {
                syncOrbitParallaxAndHud();
              }
            } else if (gs.kind === 'knob' && (gs.rotated || gs.dragged)) {
              overlayEl.removeAttribute('data-effort-dragging');
              suppressPostDragClickUntil = readClockMs() + POST_DRAG_SUPPRESS_MS;
              if (!isConfirmClosing && !isDrawerClosing) {
                syncSceneAndDom(true);
              }
            } else if (gs.kind === 'slider' && gs.scrubbing) {
              dragEffortProgress = null;
              overlayEl.removeAttribute('data-effort-dragging');
              suppressPostDragClickUntil = readClockMs() + POST_DRAG_SUPPRESS_MS;
              pressedEffort = null;
              if (!isConfirmClosing && !isDrawerClosing) {
                syncSceneAndDom(true);
              }
            }
          }
          releasePressVisuals();
        }

        overlayEl.addEventListener('pointerup', function (ev) {
          finishActiveGesture(ev, false);
        });
        overlayEl.addEventListener('pointercancel', function (ev) {
          finishActiveGesture(ev, true);
        });

        overlayEl.addEventListener('transitionend', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing) return;
          if (!ev || ev.target === overlayEl) {
            lastBoundsSyncMs = readClockMs();
            refreshCachedDockBounds();
          }
        });

        overlayEl.addEventListener('pointerleave', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing) return;
          if (isOrbitDragging || (gestureState && gestureState.scrubbing)) return;
          var stayedInWindow = Boolean(ev && ev.relatedTarget);
          if (stayedInWindow && Number.isFinite(Number(ev.clientX)) && Number.isFinite(Number(ev.clientY))) {
            updateDynamicPrismCssVars(ev.clientX, ev.clientY);
          } else {
            clearLocalRimGlow();
          }
          lastPointerClient.x = -9999;
          lastPointerClient.y = -9999;
          lastPointerClient.active = false;
          forwardPointerToRenderer(-9999, -9999, false);
          clearStageHoverAndPress();
        });

        stageEl.addEventListener('pointerleave', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing) return;
          if (isOrbitDragging || (gestureState && gestureState.scrubbing)) return;
          var stillInOverlay = Boolean(
            ev && ev.relatedTarget && typeof overlayEl.contains === 'function' && overlayEl.contains(ev.relatedTarget)
          );
          if (!stillInOverlay) {
            lastPointerClient.x = -9999;
            lastPointerClient.y = -9999;
            lastPointerClient.active = false;
            if (ev && ev.relatedTarget && Number.isFinite(Number(ev.clientX)) && Number.isFinite(Number(ev.clientY))) {
              updateDynamicPrismCssVars(ev.clientX, ev.clientY);
            } else {
              clearLocalRimGlow();
            }
            forwardPointerToRenderer(-9999, -9999, false);
          }
          clearStageHoverAndPress();
        });

        canvasEl.addEventListener('click', function (ev) {
          if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing) return;
          ev.stopPropagation();
          if (scrollBoundsDirty) {
            refreshCachedDockBounds();
          }
          var clickX = Number(ev.clientX) || 0;
          var clickY = Number(ev.clientY) || 0;
          if (activeRenderer && typeof activeRenderer.pick === 'function') {
            var hit = activeRenderer.pick(clickX, clickY);
            if (!hit) {
              if (hasPointerCoords(ev) && isPointInEffortSliderBand(clickX, clickY)) {
                var bandRes = resolveEffortAlongSlider(clickX, clickY);
                if (bandRes.effort) {
                  var cDeck = buildCurrentDeckPayload(isZhLocale(doc, root));
                  if (cDeck.inspectKind === 'aux' && cDeck.auxSlot) {
                    handleAuxEffortSelect(cDeck.auxSlot.slotIndex, bandRes.effort);
                  } else {
                    handleEffortSelect(bandRes.effort);
                  }
                  return;
                }
              }
              if ((stageMode === 'fullscreen' && pointerDownOutside) || !hasPointerCoords(ev)) {
                confirmAndClose();
              }
              return;
            }
            dispatchPickedTarget(hit);
          }
        });

        if (reqRaf) {
          if (openRafId && cancelRaf) {
            cancelRaf(openRafId);
          }
          openRafId = reqRaf(function () {
            openRafId = 0;
            if (overlayEl && !isDrawerClosing) {
              overlayEl.setAttribute('data-open', '1');
              if (pinnedScrollEl) {
                try {
                  pinnedScrollEl.scrollTop = pinnedScrollEl.scrollHeight;
                } catch (e) {}
                scheduleTrackedTimer(function () {
                  if (overlayEl && !isDrawerClosing && pinnedScrollEl) {
                    try {
                      pinnedScrollEl.scrollTop = pinnedScrollEl.scrollHeight;
                    } catch (e2) {}
                  }
                }, DOCK_OPEN_TRANSITION_MS + 16);
              }
              syncDockCompactState();
              resizeCanvasToStage();
              syncHitLayerRects();
            }
          });
        } else {
          overlayEl.setAttribute('data-open', '1');
          if (pinnedScrollEl) {
            try {
              pinnedScrollEl.scrollTop = pinnedScrollEl.scrollHeight;
            } catch (e) {}
          }
        }

        playSound('chime');
        return true;
      }

      function close(closeOpts) {
        var co = closeOpts && typeof closeOpts === 'object' ? closeOpts : {};
        var shouldRevert = Boolean(co.revert);

        clearTransientAsync();
        hoveredZ = null;
        hoveredAuxIndex = null;
        inspectedBlindZ = null;
        inspectedBlindAuxIndex = null;
        blindFlashZ = null;
        extNearRendererActive = false;
        pressedZ = null;
        pressedAuxIndex = null;
        hoveredEffort = null;
        pressedEffort = null;
        hoveredBtn = null;
        pressedBtn = null;
        lockedShakeZ = null;
        lockedShakeAuxIndex = null;
        pointerDownOutside = false;
        lastPointerClient.x = -9999;
        lastPointerClient.y = -9999;
        lastPointerClient.active = false;

        if (dockResizeObserver) {
          try {
            dockResizeObserver.disconnect();
          } catch (e) {}
          dockResizeObserver = null;
        }

        if (doc && doc.documentElement && typeof doc.documentElement.removeAttribute === 'function') {
          try {
            doc.documentElement.removeAttribute('data-pp-open');
          } catch (e) {}
        }

        if (!overlayEl) return;

        if (shouldRevert) {
          revertHostChangesIfNeeded();
        }

        if (activeRenderer && typeof activeRenderer.dispose === 'function') {
          try {
            activeRenderer.dispose();
          } catch (e) {}
        }
        activeRenderer = null;

        var toRemove = overlayEl;
        overlayEl = null;
        deskmatEl = null;
        dockTopRimEl = null;
        dockGripEl = null;
        spatialDockEl = null;
        bentoRefs = null;
        stageEl = null;
        canvasEl = null;
        hitLayerEl = null;
        hudPillEl = null;
        uiRefs = null;
        lastStageRectFn = null;
        cachedStageBounds.valid = false;
        rimGlowWasActive = false;
        lastStageCursor = '';
        lastBentoDomSig = '';
        keyNodesByZ.clear();
        auxKeyNodes.length = 0;
        hudChipByZ.clear();
        safeRemove(toRemove);
        syncMiniKeycapBadges();
        if (!co.silent || co.fromAnimatedCollapse) {
          if (typeof opts.onOpenChange === 'function') { try { opts.onOpenChange(false, stageMode); } catch (eCl) {} }
        }
        if (!co.skipEvictSchedule && (!co.silent || co.fromAnimatedCollapse)) {
          scheduleIdleResourceEviction();
        }
      }

      function isOpen() {
        return Boolean(overlayEl && !isDrawerClosing);
      }

      function setPointerNormExternal(nx, ny, inside) {
        if (isConfirmClosing || isDrawerClosing || !activeRenderer || typeof activeRenderer.setPointerNorm !== 'function') {
          return false;
        }
        activeRenderer.setPointerNorm(Number(nx) || 0, Number(ny) || 0, inside !== false);
        scheduleSettledRectSync();
        return true;
      }

      function setPointerClientExternal(clientX, clientY, inside) {
        if (isConfirmClosing || isDrawerClosing) return false;
        var isInside = inside !== false;
        lastPointerClient.x = isInside ? Number(clientX) || 0 : -9999;
        lastPointerClient.y = isInside ? Number(clientY) || 0 : -9999;
        lastPointerClient.active = isInside;
        if (isInside) {
          updateDynamicPrismCssVars(clientX, clientY);
        } else {
          clearLocalRimGlow();
        }
        if (!forwardPointerToRenderer(clientX, clientY, isInside)) return false;
        scheduleSettledRectSync();
        return true;
      }

      function getProjectedRectsExternal() {
        if (!activeRenderer || typeof activeRenderer.getInteractiveProjectedRects !== 'function') return null;
        try {
          return activeRenderer.getInteractiveProjectedRects();
        } catch (e) {
          return null;
        }
      }

      function setChassisOrbitExternal(pitchRad, yawRad) {
        if (
          isConfirmClosing ||
          isDrawerClosing ||
          !activeRenderer ||
          typeof activeRenderer.setChassisOrbit !== 'function'
        ) {
          return false;
        }
        try {
          pendingServoOrbit = null;
          stopOrbitFollowSync();
          activeRenderer.setChassisOrbit(Number(pitchRad) || 0, Number(yawRad) || 0);
          syncHitLayerRects();
          return true;
        } catch (e) {
          return false;
        }
      }

      /* Typing-Safe Keyboard Guard: Zero Interference with Host Chat Input / Editor */
      function isNodeEditableInput(node) {
        if (!node || typeof node !== 'object') return false;
        if (overlayEl && typeof overlayEl.contains === 'function' && overlayEl.contains(node)) {
          return false;
        }
        var tag = typeof node.tagName === 'string' ? node.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        if (node.isContentEditable === true) return true;
        if (typeof node.getAttribute === 'function') {
          var ce = node.getAttribute('contenteditable');
          if (ce === 'true' || ce === '' || ce === 'plaintext-only') return true;
          var role = node.getAttribute('role');
          if (role === 'textbox' || role === 'searchbox' || role === 'combobox') return true;
        }
        if (typeof node.closest === 'function') {
          var anc = node.closest(
            'input, textarea, select, [contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"], [role="textbox"]'
          );
          if (anc && (!overlayEl || typeof overlayEl.contains !== 'function' || !overlayEl.contains(anc))) {
            return true;
          }
        }
        return false;
      }

      function isEditableInputEvent(ev, docRef) {
        var t = ev && ev.target;
        if (isNodeEditableInput(t)) return true;
        if (!t || t === docRef || (docRef && (t === docRef.body || t === docRef.documentElement))) {
          if (docRef && isNodeEditableInput(docRef.activeElement)) {
            return true;
          }
        }
        return false;
      }

      function isExternalInteractiveControlNode(node) {
        if (!node || typeof node !== 'object') return false;
        if (overlayEl && (node === overlayEl || (typeof overlayEl.contains === 'function' && overlayEl.contains(node)))) {
          return false;
        }
        var selector =
          'button, a[href], select, summary, [role="button"], [role="link"], [role="menuitem"], [role="option"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"], [tabindex]:not([tabindex="-1"])';
        if (elementMatches(node, selector)) return true;
        if (typeof node.closest === 'function') {
          var anc = node.closest(selector);
          if (anc && (!overlayEl || typeof overlayEl.contains !== 'function' || !overlayEl.contains(anc))) {
            return true;
          }
        }
        var tag = typeof node.tagName === 'string' ? node.tagName.toUpperCase() : '';
        if (tag === 'BUTTON' || tag === 'A' || tag === 'SELECT' || tag === 'SUMMARY') return true;
        if (typeof node.getAttribute === 'function') {
          var role = node.getAttribute('role');
          if (
            role === 'button' ||
            role === 'link' ||
            role === 'menuitem' ||
            role === 'option' ||
            role === 'tab' ||
            role === 'switch' ||
            role === 'checkbox' ||
            role === 'radio'
          ) {
            return true;
          }
        }
        return false;
      }

      function isExternalInteractiveControlEvent(ev, docRef) {
        var t = ev && ev.target;
        if (isExternalInteractiveControlNode(t)) return true;
        if (!t || t === docRef || (docRef && (t === docRef.body || t === docRef.documentElement))) {
          if (docRef && isExternalInteractiveControlNode(docRef.activeElement)) {
            return true;
          }
        }
        return false;
      }

      /* Global Document Event Handlers */
      function onDocPointerDown(ev) {
        if (isDestroyed || currentMode === 'off' || !ev) return;
        if (overlayEl && isDrawerClosing) return;
        if (overlayEl) {
          /* Clicking the mini-keycap badge again while dock is open smoothly collapses the dock */
          if (
            opts.clickMiniBadgeToToggle !== false &&
            ev.button === 0 &&
            ev.target &&
            typeof ev.target.closest === 'function'
          ) {
            var hitBadge = ev.target.closest('.pp-mini-keycap');
            if (hitBadge && !isInsideExcludedZone(hitBadge)) {
              cancelHold();
              armSuppressNextClick();
              if (typeof ev.preventDefault === 'function') ev.preventDefault();
              if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
              dismissExternalDropdown(readHostModelContext(matchModelTriggerButton(hitBadge), root, doc));
              collapseDrawerAndClose({ revert: false });
              return;
            }
          }
        }
        if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.altKey || ev.shiftKey) return;

        var triggerBtn = matchModelTriggerButton(ev.target);
        if (!triggerBtn) return;
        if (
          !overlayEl &&
          opts.clickMiniBadgeToToggle !== false &&
          ev.target &&
          typeof ev.target.closest === 'function' &&
          ev.target.closest('.pp-mini-keycap')
        ) {
          return;
        }

        cancelIdleResourceEviction();
        cancelHold(true);
        var startX = Number(ev.clientX) || 0;
        var startY = Number(ev.clientY) || 0;
        var wasOpenAtHoldStart = Boolean(overlayEl && !isDrawerClosing);

        var state = {
          btn: triggerBtn,
          startX: startX,
          startY: startY,
          ring: null,
          ringTimer: 0,
          prewarmTimer: 0,
          openTimer: 0,
        };
        holdState = state;

        state.ringTimer = setTimer(function () {
          if (holdState !== state || isDestroyed || !isNodeConnectedToDoc(doc, triggerBtn)) {
            cancelHold(false);
            return;
          }
          state.ringTimer = 0;
          state.ring = spawnHoldRing(triggerBtn);
        }, HOLD_RING_DELAY_MS);

        if (!wasOpenAtHoldStart) {
          state.prewarmTimer = setTimer(function () {
            if (holdState !== state || isDestroyed || !isNodeConnectedToDoc(doc, triggerBtn)) return;
            state.prewarmTimer = 0;
            prewarmActiveModelAssets(triggerBtn);
          }, HOLD_PREWARM_DELAY_MS);
        }

        state.openTimer = setTimer(function () {
          if (holdState !== state || isDestroyed || !isNodeConnectedToDoc(doc, triggerBtn)) {
            cancelHold(false);
            return;
          }
          cancelHold(true);
          armSuppressNextClick();
          var ctx = readHostModelContext(triggerBtn, root, doc);
          dismissExternalDropdown(ctx);
          if (overlayEl && !isDrawerClosing) {
            collapseDrawerAndClose({ revert: false });
          } else if (!overlayEl) {
            open(triggerBtn);
          }
        }, HOLD_OPEN_DELAY_MS);
      }

      function onDocPointerMove(ev) {
        if (!holdState && (!overlayEl || isConfirmClosing || isDrawerClosing)) return;
        if (!ev || isDestroyed) return;
        if (holdState) {
          if (!isNodeConnectedToDoc(doc, holdState.btn)) {
            cancelHold();
          } else {
            var dx = (Number(ev.clientX) || 0) - holdState.startX;
            var dy = (Number(ev.clientY) || 0) - holdState.startY;
            if (dx * dx + dy * dy >= HOLD_MAX_DRIFT_PX * HOLD_MAX_DRIFT_PX) {
              cancelHold();
            }
          }
        }
        /* External 150px near-edge proximity sensing when cursor moves outside the dock (e.g. inside composer) */
        if (overlayEl && !isDestroyed && !isConfirmClosing && !isDrawerClosing) {
          var insideDock = Boolean(
            ev.target && typeof overlayEl.contains === 'function' && overlayEl.contains(ev.target)
          );
          if (!insideDock) {
            var prox = updateDynamicPrismCssVars(ev.clientX, ev.clientY);
            if (prox && prox.extDockDist <= EXT_RIM_PROXIMITY_PX) {
              extNearRendererActive = true;
              forwardPointerToRenderer(ev.clientX, ev.clientY, true);
            } else if (extNearRendererActive) {
              extNearRendererActive = false;
              forwardPointerToRenderer(-9999, -9999, false);
            }
          }
        }
      }

      function onDocPointerEnd() {
        if (holdState) cancelHold();
      }

      function onDocScroll() {
        if (holdState) cancelHold();
        if (overlayEl && !isDestroyed && !isConfirmClosing && !isDrawerClosing && !isOrbitDragging) {
          scrollBoundsDirty = true;
          var nowScrollMs = readClockMs();
          if (nowScrollMs - lastBoundsSyncMs > 90) {
            lastBoundsSyncMs = nowScrollMs;
            refreshCachedDockBounds();
          }
          if (scrollSettleTimer) {
            clearTimer(scrollSettleTimer);
            pendingTimers.delete(scrollSettleTimer);
          }
          scrollSettleTimer = scheduleTrackedTimer(function () {
            scrollSettleTimer = 0;
            if (overlayEl && !isDestroyed && !isConfirmClosing && !isDrawerClosing && !isOrbitDragging) refreshCachedDockBounds();
          }, 90);
        }
      }

      function onDocVisibilityChange() {
        if (doc && doc.hidden) {
          onWindowBlur();
        }
      }

      function onDocSuppressClick(ev) {
        if (!suppressUntilMs) {
          if (ev && ev.type === 'click') {
            if (opts.clickMiniBadgeToToggle !== false && ev.target && typeof ev.target.closest === 'function') {
              var clickedBadge = ev.target.closest('.pp-mini-keycap');
              if (clickedBadge && !isInsideExcludedZone(clickedBadge)) {
                var hostBtn = matchModelTriggerButton(clickedBadge);
                if (typeof ev.preventDefault === 'function') ev.preventDefault();
                if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
                if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
                dismissExternalDropdown(readHostModelContext(hostBtn, root, doc));
                if (overlayEl && !isDrawerClosing) {
                  collapseDrawerAndClose({ revert: false });
                } else if (!overlayEl) {
                  open(hostBtn);
                }
                return;
              }
            }
            if (!overlayEl) {
              syncMiniKeycapBadges();
            }
          }
          return;
        }
        if (readClockMs() > suppressUntilMs) {
          suppressUntilMs = 0;
          return;
        }
        if (ev && overlayEl && typeof overlayEl.contains === 'function' && overlayEl.contains(ev.target)) {
          return;
        }
        if (ev) {
          if (typeof ev.preventDefault === 'function') ev.preventDefault();
          if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
          if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
        }
        if (ev && ev.type === 'click') {
          suppressUntilMs = 0;
          if (suppressTimer) {
            clearTimer(suppressTimer);
            suppressTimer = 0;
          }
        }
      }

      function onDocKeyDown(ev) {
        if (holdState) cancelHold();
        if (!overlayEl || isDrawerClosing || !ev) return;
        if (ev.key === 'Escape') {
          if (typeof ev.preventDefault === 'function') ev.preventDefault();
          if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
          if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
          collapseDrawerAndClose({ revert: true });
          return;
        }
        /* Strict V12 Typing-Safe & Non-Modal Guard: Never hijack inputs or external buttons/links while docked! */
        if (isEditableInputEvent(ev, doc)) {
          return;
        }
        if (stageMode === 'drawer' && isExternalInteractiveControlEvent(ev, doc)) {
          return;
        }
        if (
          (ev.key === 'f' || ev.key === 'F') &&
          !ev.ctrlKey &&
          !ev.metaKey &&
          !ev.altKey &&
          !ev.shiftKey &&
          !isConfirmClosing
        ) {
          if (typeof ev.preventDefault === 'function') ev.preventDefault();
          if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
          toggleStageModeAction();
        } else if (
          (ev.key === 'r' || ev.key === 'R') &&
          !ev.ctrlKey &&
          !ev.metaKey &&
          !ev.altKey &&
          !ev.shiftKey &&
          !isConfirmClosing
        ) {
          if (getChassisOrbitSafe().isRotated) {
            if (typeof ev.preventDefault === 'function') ev.preventDefault();
            if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
            resetOrbitViewAction();
          }
        } else if (ev.key === 'Enter') {
          if (isConfirmClosing) {
            if (typeof ev.preventDefault === 'function') ev.preventDefault();
            if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
            return;
          }
          /* Allow focused effort pill, flip button or control button to handle Enter natively */
          var actEl = doc && doc.activeElement;
          if (actEl && typeof actEl.getAttribute === 'function') {
            var actKind = actEl.getAttribute('data-pp-action');
            var actTestId = actEl.getAttribute('data-testid');
            if (
              actEl.getAttribute('data-pp-effort') ||
              actEl.getAttribute('data-bento-effort') ||
              actKind === 'mute' ||
              actKind === 'reset-view' ||
              actTestId === 'pp-stage-mode-btn' ||
              actTestId === 'pp-card-flip-btn' ||
              actTestId === 'pp-compact-summary' ||
              actEl.getAttribute('data-hud-z')
            ) {
              return;
            }
          }
          if (typeof ev.preventDefault === 'function') ev.preventDefault();
          if (typeof ev.stopPropagation === 'function') ev.stopPropagation();
          confirmAndClose();
        }
      }

      function onWindowResize() {
        if (holdState) cancelHold();
        if (overlayEl && !isDrawerClosing) {
          syncDockCompactState();
          resizeCanvasToStage();
          syncHitLayerRects();
        }
      }

      function onWindowBlur() {
        if (holdState) cancelHold();
        if (overlayEl) {
          var wasDragging = isOrbitDragging;
          isOrbitDragging = false;
          gestureState = null;
          pendingServoOrbit = null;
          dragEffortProgress = null;
          overlayEl.removeAttribute('data-orbit-dragging');
          overlayEl.removeAttribute('data-effort-dragging');
          if (wasDragging && activeRenderer && typeof activeRenderer.endChassisOrbitDrag === 'function') {
            try {
              activeRenderer.endChassisOrbitDrag(0, 0);
            } catch (e) {}
          }
          if (!isConfirmClosing && !isDrawerClosing) {
            lastPointerClient.x = -9999;
            lastPointerClient.y = -9999;
            lastPointerClient.active = false;
            clearLocalRimGlow();
            forwardPointerToRenderer(-9999, -9999, false);
          }
        }
      }

      function onWindowMouseOut(ev) {
        if (!overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing || !ev) return;
        if (!ev.relatedTarget && !ev.toElement) {
          lastPointerClient.x = -9999;
          lastPointerClient.y = -9999;
          lastPointerClient.active = false;
          clearLocalRimGlow();
          forwardPointerToRenderer(-9999, -9999, false);
        }
      }

      function setupThemeObserver() {
        var ObsCtor = (root && root.MutationObserver) || (typeof MutationObserver === 'function' ? MutationObserver : null);
        if (!ObsCtor || !doc || !doc.documentElement) return;
        if (themeObserver) {
          try {
            themeObserver.disconnect();
          } catch (e) {}
        }
        themeObserver = new ObsCtor(function () {
          if (isDestroyed || currentMode === 'off') return;
          invalidateComputedThemeCache(doc);
          syncMiniKeycapBadges();
          if (overlayEl && !isDrawerClosing) {
            syncSceneAndDom();
          }
        });
        try {
          themeObserver.observe(doc.documentElement, {
            attributes: true,
            attributeFilter: [
              'data-prism-palette',
              'data-prism-theme',
              'data-theme',
              'data-prism-light-preset',
              'data-prism-accent',
              'data-prism-corners',
              'data-prism-ambient',
              'data-prism-motion',
              'data-prism-lang',
              'class',
            ],
          });
          if (doc.body) {
            themeObserver.observe(doc.body, {
              attributes: true,
              attributeFilter: ['class'],
            });
          }
        } catch (e) {}
      }

      function nodeSubtreeTouchesHostSurface(node) {
        if (!node || node.nodeType !== 1 || isOwnedDecorationNode(node)) return false;
        if (overlayEl && (node === overlayEl || (typeof overlayEl.contains === 'function' && overlayEl.contains(node)))) return false;
        if (node.classList && typeof node.classList.contains === 'function' && node.classList.contains('pp-hold-ring')) return false;
        if (typeof node.hasAttribute === 'function') {
          if (node.hasAttribute('data-prism-dock-host') || node.hasAttribute('data-prism-composer') || node.hasAttribute('data-prism-trigger') || node.getAttribute('data-pp-trigger') === '1') return true;
        }
        if (typeof node.querySelector === 'function') {
          if (node.querySelector('[data-prism-dock-host], [data-prism-composer], [data-prism-trigger], [data-pp-trigger="1"], .prism-model-glyph')) return true;
        }
        return false;
      }
      function recoverHostRemountIfNeeded() {
        if (isDestroyed || currentMode === 'off' || !doc) return;
        pruneDisconnectedObservedButtons();
        if (holdState && !isNodeConnectedToDoc(doc, holdState.btn)) {
          cancelHold(false);
        }
        var anchorWasDisconnected = Boolean(activeAnchorBtn && !isNodeConnectedToDoc(doc, activeAnchorBtn));
        if (anchorWasDisconnected) {
          activeCommittedAuxBadge = null;
          activeCommittedElementZ = null;
          activeAnchorBtn = findFallbackModelTrigger(doc, configuredTriggerOpt);
        }
        if (overlayEl && !isDrawerClosing && stageMode === 'drawer') {
          var nextTrigger = activeAnchorBtn || findFallbackModelTrigger(doc, configuredTriggerOpt);
          var mountDest = resolveDrawerMountHost(doc, nextTrigger);
          var overlayConnected = isNodeConnectedToDoc(doc, overlayEl);
          var hostSwapped = !overlayConnected || (mountDest.host && overlayEl.parentNode !== mountDest.host);
          if (hostSwapped || anchorWasDisconnected) {
            activeAnchorBtn = nextTrigger || null;
            if (hostSwapped) {
              activeCommittedAuxBadge = null;
              activeCommittedElementZ = null;
              overlayEl.setAttribute('data-in-flow', mountDest.inFlow ? '1' : '0');
              if (mountDest.host && typeof mountDest.host.appendChild === 'function') {
                mountDest.host.appendChild(overlayEl);
              }
            }
            activeHostCtx = readHostModelContext(nextTrigger, root, doc);
            syncSelectionStateFromHostCtx(activeHostCtx);
            overlayEl.setAttribute('data-orch-latched', orchLatched ? '1' : '0');
            syncHitButtonsAvailabilityDom();
            syncDockCompactState();
            resizeCanvasToStage();
            syncSceneAndDom(true);
            if (!isOrbitDragging) syncHitLayerRects(false);
          }
        }
        scheduleBadgeSync(20);
      }

      function setupHostDomObserver() {
        var ObsCtor = (root && root.MutationObserver) || (typeof MutationObserver === 'function' ? MutationObserver : null);
        if (!ObsCtor || !doc || !doc.body) return;
        if (hostDomObserver) {
          try {
            hostDomObserver.disconnect();
          } catch (e) {}
        }
        hostDomObserver = new ObsCtor(function (mutations) {
          if (isMutatingBadge || isDestroyed || currentMode === 'off') return;
          var needsRecovery = false;
          for (var i = 0; i < mutations.length; i += 1) {
            var m = mutations[i];
            if (!m || m.type !== 'childList') continue;
            if (m.target && (isOwnedDecorationNode(m.target) || (overlayEl && (m.target === overlayEl || (typeof overlayEl.contains === 'function' && overlayEl.contains(m.target)))))) {
              continue;
            }
            var added = m.addedNodes;
            if (added && added.length > 0) {
              for (var a = 0; a < added.length; a += 1) {
                if (nodeSubtreeTouchesHostSurface(added[a])) {
                  needsRecovery = true;
                  break;
                }
              }
            }
            if (needsRecovery) break;
            var removed = m.removedNodes;
            if (removed && removed.length > 0) {
              for (var r = 0; r < removed.length; r += 1) {
                if (nodeSubtreeTouchesHostSurface(removed[r])) {
                  needsRecovery = true;
                  break;
                }
              }
            }
            if (needsRecovery) break;
          }
          if (needsRecovery) {
            recoverHostRemountIfNeeded();
          }
        });
        try {
          hostDomObserver.observe(doc.body, { childList: true, subtree: true });
        } catch (e) {}
      }

      function disconnectObservers() {
        if (themeObserver) {
          try {
            themeObserver.disconnect();
          } catch (e) {}
          themeObserver = null;
        }
        if (hostDomObserver) {
          try {
            hostDomObserver.disconnect();
          } catch (e) {}
          hostDomObserver = null;
        }
        if (triggerObserver) {
          try {
            triggerObserver.disconnect();
          } catch (e) {}
          triggerObserver = null;
        }
        observedButtons.clear();
      }

      function activate() {
        if (!doc || !doc.documentElement) return;
        doc.documentElement.setAttribute(ROOT_MARKER_ATTR, '1');
        ensureStyles();
        onDoc('pointerdown', onDocPointerDown, true);
        onDoc('pointermove', onDocPointerMove, true);
        onDoc('pointerup', onDocPointerEnd, true);
        onDoc('pointercancel', onDocPointerEnd, true);
        onDoc('contextmenu', onDocPointerEnd, true);
        onDoc('scroll', onDocScroll, true);
        onDoc('visibilitychange', onDocVisibilityChange, false);
        onDoc('mouseup', onDocSuppressClick, true);
        onDoc('click', onDocSuppressClick, true);
        onDoc('keydown', onDocKeyDown, true);
        onRoot('resize', onWindowResize, false);
        onRoot('scroll', onDocScroll, false);
        onRoot('blur', onWindowBlur, false);
        onRoot('mouseout', onWindowMouseOut, false);
        setupThemeObserver();
        setupHostDomObserver();
        syncMiniKeycapBadges();
      }

      function deactivate() {
        cancelHold(true);
        cancelIdleResourceEviction();
        invalidateComputedThemeCache(doc);
        clearBadgeTimer();
        clearTransientAsync();
        disconnectObservers();
        if (suppressTimer) {
          clearTimer(suppressTimer);
          suppressTimer = 0;
        }
        suppressUntilMs = 0;
        close({ revert: false, silent: true, skipEvictSchedule: true });
        var oledMod = resolveOledScreenModule(root);
        if (oledMod && typeof oledMod.evictIdleOledWallpapers === 'function') {
          try {
            oledMod.evictIdleOledWallpapers(root);
          } catch (e) {}
        }
        var grainMod = resolveGrainAssets(root);
        if (grainMod && typeof grainMod.evictGrainTextures === 'function') {
          try {
            grainMod.evictGrainTextures();
          } catch (eG) {}
        }
        removeAllMiniKeycaps();
        removeAllListeners();
        closeAudioContext();
        cleanupResiduals(doc);
      }

      var instanceApi = {
        destroy: function () {
          if (isDestroyed) return;
          isDestroyed = true;
          currentMode = 'off';
          deactivate();
          if (root && root.__prismPeriodicConsoleInstance === instanceApi) {
            try {
              delete root.__prismPeriodicConsoleInstance;
            } catch (e) {
              root.__prismPeriodicConsoleInstance = undefined;
            }
          }
        },
        getStatus: function () {
          var grainMod = resolveGrainAssets(root);
          var oledMod = resolveOledScreenModule(root);
          return {
            status: isDestroyed ? 'destroyed' : currentMode === 'on' ? 'active' : 'off',
            mode: currentMode,
            stageMode: stageMode,
            orchLatched: Boolean(orchLatched),
            cardFlipped: Boolean(cardFlipped),
            open: Boolean(overlayEl && !isDrawerClosing),
            selectedZ: selectedZ,
            selectedAuxIndex: selectedAuxIndex,
            confirmClosing: isConfirmClosing,
            confirmSlamZ: confirmSlamZ,
            confirmSlamAuxIndex: confirmSlamAuxIndex,
            availableCount: availableEntries.length,
            grainDecoded: Boolean(
              grainMod && typeof grainMod.hasDecodedGrainTextures === 'function' && grainMod.hasDecodedGrainTextures()
            ),
            cachedWallpapers:
              oledMod && typeof oledMod.getCachedOledWallpaperCount === 'function'
                ? oledMod.getCachedOledWallpaperCount(root)
                : 0,
            audioState: audioCtx ? String(audioCtx.state || 'created') : 'none',
            rendererMode:
              activeRenderer && typeof activeRenderer.getRendererMode === 'function'
                ? activeRenderer.getRendererMode()
                : 'headless',
          };
        },
        setMode: function (nextMode) {
          if (isDestroyed) return instanceApi;
          var normalized = nextMode === 'off' ? 'off' : 'on';
          if (normalized === currentMode) return instanceApi;
          currentMode = normalized;
          if (currentMode === 'off') {
            deactivate();
          } else {
            activate();
          }
          return instanceApi;
        },
        open: open,
        close: close,
        toggle: function (anchorBtn) {
          if (isOpen()) { collapseDrawerAndClose({ revert: false }); return false; }
          return open(anchorBtn);
        },
        isOpen: isOpen,
        getStageMode: getStageModeAction,
        setStageMode: setStageModeAction,
        toggleStageMode: toggleStageModeAction,
        toggleCardFlip: toggleCardFlipAction,
        setTheme: function (themeKit, accentKey) {
          if (isDestroyed) return null;
          applyDeclarativeThemeAttrs(themeKit, accentKey);
          syncMiniKeycapBadges();
          if (overlayEl && !isDrawerClosing) syncSceneAndDom();
          return resolvePrismThemeProfile(doc, root);
        },
        setLocale: function (nextLang) {
          if (isDestroyed || !doc || !doc.documentElement) return;
          var normalizedLang = /^en/i.test(String(nextLang || '')) ? 'en' : 'zh-CN';
          doc.documentElement.setAttribute('data-prism-lang', normalizedLang);
          doc.documentElement.setAttribute('lang', normalizedLang);
          lastBentoDomSig = '';
          if (overlayEl && !isDrawerClosing) {
            overlayEl.setAttribute('aria-label', normalizedLang === 'zh-CN' ? 'PRISM-118 元素周期表 3D 模型控制台' : 'PRISM-118 Periodic 3D Model Console');
            syncDockCompactState();
            syncSceneAndDom(true);
          }
        },
        setTelemetry: function (nextTele) {
          activeTelemetrySource = nextTele;
          lastBentoDomSig = '';
          if (overlayEl && !isDrawerClosing) syncSceneAndDom(true);
        },
        selectModel: function (modelOrQuery) {
          if (isDestroyed) return false;
          var ctx = readHostModelContext();
          var found = findMatchingOptionInList(ctx.modelOptions, modelOrQuery) || normalizeModelOptionItem(modelOrQuery);
          if (!found) return false;
          commitModelOption(ctx, found);
          activeCommittedAuxBadge = null;
          activeCommittedElementZ = null;
          if (overlayEl && !isDrawerClosing) {
            syncSelectionStateFromHostCtx(ctx);
            overlayEl.setAttribute('data-orch-latched', orchLatched ? '1' : '0');
            syncSceneAndDom();
            if (!isOrbitDragging) syncHitLayerRects();
          }
          return true;
        },
        toggleOrchestrator: function (forceBool) {
          if (isDestroyed) return false;
          var want = typeof forceBool === 'boolean' ? forceBool : !orchLatched;
          if (overlayEl && !isDrawerClosing) {
            if (want !== orchLatched) handleAuxKeyClick(0);
            return orchLatched;
          }
          if (want === orchLatched) return orchLatched;
          orchLatched = want;
          var ctx = readHostModelContext();
          if (orchLatched) {
            var plannerOpt =
              (ctx && ctx.orchestratorPick && ctx.orchestratorPick.model) ||
              resolvedDefaultPlanner ||
              defaultCarbonOpt;
            var orchOpt = null;
            if (ctx && Array.isArray(ctx.modelOptions)) {
              for (var oi = 0; oi < ctx.modelOptions.length; oi += 1) {
                var cand = ctx.modelOptions[oi];
                if (cand && typeof cand.label === 'string' && /orchestrator|编排|调度器/i.test(cand.label)) {
                  orchOpt = cand;
                  break;
                }
              }
            }
            if (!orchOpt) {
              orchOpt = { label: 'Orchestrator', value: 'orchestrator', modelId: 'orchestrator' };
            }
            var parsedP = plannerOpt ? parseElementModelLabel(plannerOpt) : null;
            var shortCode = parsedP
              ? formatOrchElementCompactBadge(parsedP.slotZ)
              : formatOrchAuxCompactBadge(
                  plannerOpt && (plannerOpt.modelId || plannerOpt.label),
                  plannerOpt && plannerOpt.label
                );
            activeCommittedElementZ = null;
            activeCommittedAuxBadge = {
              id: 'orchestrator',
              label: orchOpt.label,
              shortLabel: shortCode,
              miniKey: 'orchestrator',
            };
            commitModelOption(ctx, orchOpt);
            commitOrchestratorPlannerPick(ctx, plannerOpt);
          } else {
            var restoreOpt =
              (ctx && ctx.orchestratorPick && ctx.orchestratorPick.model) ||
              resolvedDefaultPlanner ||
              defaultCarbonOpt;
            activeCommittedAuxBadge = null;
            var restoredParsed = restoreOpt ? parseElementModelLabel(restoreOpt) : null;
            activeCommittedElementZ = restoredParsed ? restoredParsed.slotZ : null;
            if (restoreOpt) commitModelOption(ctx, restoreOpt);
            if (typeof opts.onToggleOrchestrator === 'function') {
              try {
                opts.onToggleOrchestrator(false, null, buildSelectionCallbackMeta());
              } catch (eUn2) {}
            }
          }
          syncMiniKeycapBadges();
          return orchLatched;
        },
        getSelectedModel: function () {
          var ctx = readHostModelContext();
          return ctx ? ctx.selectedModel : null;
        },
        setPointerNorm: setPointerNormExternal,
        setPointerClient: setPointerClientExternal,
        getProjectedRects: getProjectedRectsExternal,
        getChassisOrbit: getChassisOrbitSafe,
        setChassisOrbit: setChassisOrbitExternal,
        resetChassisOrbit: resetOrbitViewAction,
        syncBadges: syncMiniKeycapBadges,
      };

      activate();
      if (opts.autoOpen === true || opts.defaultOpen === true) {
        open(configuredTriggerOpt);
      }
      if (root && typeof root === 'object') {
        root.__prismPeriodicConsoleInstance = instanceApi;
      }
      return instanceApi;
    }

    return {
      mount: mountPeriodicPicker,
      createPeriodicConsole: mountPeriodicPicker,
      DEFAULT_MODELS: DEFAULT_MODELS,
      DEFAULT_ORCHESTRATOR_PLANNERS: DEFAULT_ORCHESTRATOR_PLANNERS,
      ELEMENTS_90: ELEMENTS_90,
      BENCHMARK_2026Q4_DB: BENCHMARK_2026Q4_DB,
      resolveBenchmarkMetrics: resolveBenchmarkMetrics,
      matchGoogleElementModels: matchGoogleElementModels,
      matchAuxModels: matchHostAuxModels,
      parseElementModelLabel: parseElementModelLabel,
      resolveThemeProfile: resolvePrismThemeProfile,
    };
  }
);
