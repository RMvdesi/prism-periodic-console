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
 */
/**
 * Obsidian Prism — V14 Google DeepMind Official Spectrum · Full-Bleed Dark & Light Key Art Display (1600x480)
 *
 * V14 核心光学架构（对标 Google 官方模型发布视觉 · 静态主视觉优先 · 克制微动效辅助）：
 *   1. 1600x480 满幅贯通式 Google DeepMind 官方海报横幅（0 简陋代码多面体、0 中间劈半竖线）：
 *      - 左至中区（~42%）：满幅高精烘焙折光光学玻璃雕塑（1H 天青球环 / 6C 官方皇家钴蓝虹彩水晶簇 /
 *        10Ne 珊瑚红橙→暖金莫比乌斯玻璃环 / 18Ar 电光靛紫同心光学透镜 / Claude 陶土暖珀拱门 /
 *        Flash 电光青双棱羽翼 / GPT 银青冰晶六角结 / Orch 星云紫金陀螺双环）+ 半透明大号元素符号水印，
 *        无缝向右流淌过渡至纯净社论排版留白区。
 *   2. 真·暗夜（Dark）与白昼（Light）双套独立海报底图适配：
 *      - 暗色主题（obsidian-dark / warm-dark）：深邃星云天鹅绒夜底 + 自发光折光玻璃雕塑 + 纯白锐字 + 烟熏毛玻璃胶囊；
 *      - 浅色主题（crystal-light / alabaster-light）：明亮白昼瓷白冰雾渐变底 + 日光通透彩色玻璃雕塑 + 深炭墨高对比锐字 + 白冰毛玻璃胶囊（彻底消灭浅色黑砖屏！）。
 *   3. 静态艺术为主，微动效仅作克制点睛（严格 0fps 静止休眠）：
 *      - 静止态 100% 零耗电（isAnimating() === false）；
 *      - 仅在切模型/切深浅主题（200ms 柔滑叠化 + 微妙水平视差滑移）、切档位（220ms 毛玻璃胶囊阻尼滑移 + ~8% 柔光微涌）、
 *        以及指针掠过/旋转视角（斜向清透玻璃镜面掠光）时响应，随后立即回归 0fps。
 *
 * Contract:
 *   globalThis.PrismPeriodicOledScreen = { createOledScreenPainter }
 *   module.exports = { createOledScreenPainter }
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = api;
  }
  if (root && typeof root === 'object') {
    root.PrismPeriodicOledScreen = api;
  }
  if (typeof globalThis === 'object' && globalThis) {
    globalThis.PrismPeriodicOledScreen = api;
  }
  if (typeof window === 'object' && window) {
    window.PrismPeriodicOledScreen = api;
  }
})(
  typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this,
  function (moduleRoot) {
    'use strict';

    var TWO_PI = Math.PI * 2;
    var DEFAULT_WIDTH = 1600;
    var DEFAULT_HEIGHT = 480;
    var FADE_DURATION_MS = 200;
    var SLIDER_DURATION_MS = 220;
    var ANIM_STALE_GUARD_MS = 650;
    var MAX_WALLPAPER_CACHE = 24;

    /* 满幅海报构图视觉锚点：左移玻璃雕塑视口 (-46px / 浅色10Ne -64px) + 雕塑右翼纯净分离大水印 (~x:500..664) + 右侧社论排版区 (x:682..1548) */
    var SCULPT_SHIFT_X = -46;
    var SCULPT_SHIFT_LIGHT_NEON = -64;
    var SCULPT_AURA_CX = 236;
    var SCULPT_AURA_CY = 240;
    var WATERMARK_LEFT_SINGLE_X = 504;
    var WATERMARK_LEFT_PAIR_X = 500;
    var WATERMARK_LEFT_LIGHT_NEON_X = 518;
    var WATERMARK_LEFT_TRIPLE_X = 496;
    var WATERMARK_Y = 248;

    var RIGHT_ZONE_X = 682;
    var RIGHT_ZONE_END = 1548;
    var RIGHT_ZONE_W = RIGHT_ZONE_END - RIGHT_ZONE_X; /* 866 */

    /* 思考档位毛玻璃胶囊严格锁定在 [682, 1504] x [296, 388]，100% 保持 getEffortUvRects() 零死区热区几何契约 */
    var WELL_X = 682;
    var WELL_RIGHT = 1504;
    var WELL_W = WELL_RIGHT - WELL_X; /* 822 */
    var WELL_Y = 296;
    var WELL_H = 92;

    var SANS_STACK = '"Google Sans", "Plus Jakarta Sans", "Inter", "SF Pro Display", "Helvetica Neue", "PingFang SC", "Segoe UI", system-ui, sans-serif';
    var MONO_STACK = '"JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, monospace';

    var ALL_WALLPAPER_KEYS = ['1', '6', '10', '18', 'claude', 'flash', 'gpt', 'orchestrator', 'standby'];

    /* V14 Google DeepMind 官方四大元素模型光谱（彻底告别苍白死灰 6C 与泥棕 10Ne） */
    var ELEMENT_OPTIC_THEMES = {
      1: {
        sculptKey: '1',
        watermark: 'H',
        familyPrefix: 'GEMINI 4 · 01 HYDROGEN',
        accent: '#38BDF8',
        secondary: '#7DD3FC',
        lightAccent: '#0284C7',
        lightSecondary: '#0EA5E9',
        glow: '#BAE6FD',
        darkBgLeft: '#0B2D42',
        darkBgMid: '#071B2B',
        darkBgRight: '#04101C',
        lightBgLeft: '#D6EFFD',
        lightBgMid: '#ECF8FF',
        lightBgRight: '#F7FCFF',
        pillDarkTop: '#0EA5E9',
        pillDarkBot: '#0284C7',
        pillLightTop: '#0EA5E9',
        pillLightBot: '#0284C7',
        defaultTier: 'AGILE · SKY ICE',
      },
      6: {
        sculptKey: '6',
        watermark: 'C',
        familyPrefix: 'GEMINI 4 · 06 CARBON',
        accent: '#3B82F6',
        secondary: '#67E8F9',
        lightAccent: '#1D4ED8',
        lightSecondary: '#0284C7',
        glow: '#93C5FD',
        darkBgLeft: '#0E266B',
        darkBgMid: '#091845',
        darkBgRight: '#050D29',
        lightBgLeft: '#DCE7FF',
        lightBgMid: '#EEF4FF',
        lightBgRight: '#F8FAFF',
        pillDarkTop: '#3B82F6',
        pillDarkBot: '#0284C7',
        pillLightTop: '#2563EB',
        pillLightBot: '#0284C7',
        defaultTier: 'PRO · COBALT',
      },
      10: {
        sculptKey: '10',
        watermark: 'Ne',
        familyPrefix: 'GEMINI 4 · 10 NEON',
        accent: '#FF6B4A',
        secondary: '#FFB347',
        lightAccent: '#EA580C',
        lightSecondary: '#D97706',
        glow: '#FDBA74',
        darkBgLeft: '#38120B',
        darkBgMid: '#200B07',
        darkBgRight: '#120605',
        lightBgLeft: '#FFE0CE',
        lightBgMid: '#FFF2EA',
        lightBgRight: '#FFFAF7',
        pillDarkTop: '#FF6B4A',
        pillDarkBot: '#EA580C',
        pillLightTop: '#F95B3D',
        pillLightBot: '#EA580C',
        defaultTier: 'FLOW · CORAL',
      },
      18: {
        sculptKey: '18',
        watermark: 'Ar',
        familyPrefix: 'GEMINI 4 · 18 ARGON',
        accent: '#7C5CFF',
        secondary: '#4F7CFF',
        lightAccent: '#6D28D9',
        lightSecondary: '#4338CA',
        glow: '#C4B5FD',
        darkBgLeft: '#1E1154',
        darkBgMid: '#130B38',
        darkBgRight: '#09061E',
        lightBgLeft: '#E6DFFF',
        lightBgMid: '#F3EFFF',
        lightBgRight: '#FBF9FF',
        pillDarkTop: '#7C5CFF',
        pillDarkBot: '#4F46E5',
        pillLightTop: '#6D28D9',
        pillLightBot: '#4F46E5',
        defaultTier: 'PRO · INDIGO',
      },
    };

    /* V14 右侧 2x3 AUX-06 副盘品牌专属光谱与高精玻璃底图映射（全员 0 几何多边形回退） */
    var AUX_OPTIC_THEMES = {
      orchestrator: {
        sculptKey: 'orchestrator',
        auxKind: 'orchestrator',
        watermark: 'Or',
        familyPrefix: 'GEMINI · ORCHESTRATOR',
        accent: '#8B5CF6',
        secondary: '#F5B942',
        lightAccent: '#6D28D9',
        lightSecondary: '#B45309',
        glow: '#DDD6FE',
        darkBgLeft: '#1D1242',
        darkBgMid: '#130C2C',
        darkBgRight: '#0A071A',
        lightBgLeft: '#ECE5FF',
        lightBgMid: '#F6F2FF',
        lightBgRight: '#FCFBFF',
        pillDarkTop: '#7C3AED',
        pillDarkBot: '#B45309',
        pillLightTop: '#6D28D9',
        pillLightBot: '#B45309',
        defaultBadge: 'ORCH',
        defaultTier: 'DUAL-CORE',
      },
      flash: {
        sculptKey: 'flash',
        auxKind: 'flash',
        watermark: 'Fl',
        familyPrefix: 'GEMINI · FLASH',
        accent: '#00D4FF',
        secondary: '#38BDF8',
        lightAccent: '#0284C7',
        lightSecondary: '#0891B2',
        glow: '#A5F3FC',
        darkBgLeft: '#062C3D',
        darkBgMid: '#051A26',
        darkBgRight: '#030E17',
        lightBgLeft: '#D2F4FF',
        lightBgMid: '#ECFBFF',
        lightBgRight: '#F8FDFF',
        pillDarkTop: '#06B6D4',
        pillDarkBot: '#0284C7',
        pillLightTop: '#0891B2',
        pillLightBot: '#0284C7',
        defaultBadge: 'FLASH',
        defaultTier: 'HYPER · FAST',
      },
      claude: {
        sculptKey: 'claude',
        auxKind: 'claude',
        watermark: 'Cl',
        familyPrefix: 'ANTHROPIC · CLAUDE',
        accent: '#E07A48',
        secondary: '#F4A261',
        lightAccent: '#C25929',
        lightSecondary: '#B45309',
        glow: '#FED7AA',
        darkBgLeft: '#33190D',
        darkBgMid: '#1D0F08',
        darkBgRight: '#110905',
        lightBgLeft: '#F6E5D4',
        lightBgMid: '#FCF4EC',
        lightBgRight: '#FFFDF9',
        pillDarkTop: '#DC6B38',
        pillDarkBot: '#B45309',
        pillLightTop: '#C25929',
        pillLightBot: '#9A3412',
        defaultBadge: 'CLAUDE',
        defaultTier: 'ARTISAN · CRAFT',
      },
      gpt: {
        sculptKey: 'gpt',
        auxKind: 'gpt',
        watermark: 'Gp',
        familyPrefix: 'OPEN · REASONING',
        accent: '#5EEAD4',
        secondary: '#99F6E4',
        lightAccent: '#0F766E',
        lightSecondary: '#0D9488',
        glow: '#CCFBF1',
        darkBgLeft: '#0D2426',
        darkBgMid: '#081619',
        darkBgRight: '#050C0F',
        lightBgLeft: '#D8F3EC',
        lightBgMid: '#EEF9F6',
        lightBgRight: '#F9FCFB',
        pillDarkTop: '#14B8A6',
        pillDarkBot: '#0F766E',
        pillLightTop: '#0D9488',
        pillLightBot: '#0F766E',
        defaultBadge: 'GPT',
        defaultTier: 'SILVER · MINT',
      },
      generic: {
        sculptKey: 'flash',
        auxKind: 'generic',
        watermark: 'Ax',
        familyPrefix: 'AUX · EXTERNAL',
        accent: '#38BDF8',
        secondary: '#7DD3FC',
        lightAccent: '#0284C7',
        lightSecondary: '#0891B2',
        glow: '#BAE6FD',
        darkBgLeft: '#062C3D',
        darkBgMid: '#051A26',
        darkBgRight: '#030E17',
        lightBgLeft: '#D2F4FF',
        lightBgMid: '#ECFBFF',
        lightBgRight: '#F8FDFF',
        pillDarkTop: '#0284C7',
        pillDarkBot: '#0369A1',
        pillLightTop: '#0284C7',
        pillLightBot: '#0369A1',
        defaultBadge: 'AUX',
        defaultTier: 'AUX · MODEL',
      },
    };

    /* V14.1 114 颗未解锁盲键与预留槽专属「未雕琢哑光原石晶坯」中性石板光谱（零盗用 6C 蓝晶！） */
    var STANDBY_OPTIC_THEME = {
      sculptKey: 'standby',
      watermark: 'Au',
      familyPrefix: 'PERIODIC · STANDBY',
      accent: '#94A3B8',
      secondary: '#CBD5E1',
      lightAccent: '#475569',
      lightSecondary: '#64748B',
      glow: '#CBD5E1',
      darkBgLeft: '#16191F',
      darkBgMid: '#0E1116',
      darkBgRight: '#090B0F',
      lightBgLeft: '#E5E7EB',
      lightBgMid: '#EFF1F5',
      lightBgRight: '#F9FAFC',
      pillDarkTop: '#475569',
      pillDarkBot: '#334155',
      pillLightTop: '#64748B',
      pillLightBot: '#475569',
      defaultBadge: 'STANDBY',
      defaultTier: 'STANDBY',
    };

    var EXACT_CORE_NAMES_BY_Z = {
      1: { sym: 'H', name: 'HYDROGEN' },
      6: { sym: 'C', name: 'CARBON' },
      10: { sym: 'NE', name: 'NEON' },
      18: { sym: 'AR', name: 'ARGON' },
    };

    var STANDARD_ATOMIC_MASS_BY_Z = {
      1: '1.008', 2: '4.0026', 3: '6.94', 4: '9.0122', 5: '10.81', 6: '12.011', 7: '14.007', 8: '15.999', 9: '18.998', 10: '20.180',
      11: '22.990', 12: '24.305', 13: '26.982', 14: '28.085', 15: '30.974', 16: '32.06', 17: '35.45', 18: '39.948',
      19: '39.098', 20: '40.078', 21: '44.956', 22: '47.867', 23: '50.942', 24: '51.996', 25: '54.938', 26: '55.845', 27: '58.933', 28: '58.693', 29: '63.546', 30: '65.38',
      31: '69.723', 32: '72.630', 33: '74.922', 34: '78.971', 35: '79.904', 36: '83.798',
      37: '85.468', 38: '87.62', 39: '88.906', 40: '91.224', 41: '92.906', 42: '95.95', 43: '98', 44: '101.07', 45: '102.91', 46: '106.42', 47: '107.87', 48: '112.41',
      49: '114.82', 50: '118.71', 51: '121.76', 52: '127.60', 53: '126.90', 54: '131.29',
      55: '132.91', 56: '137.33', 57: '138.91', 58: '140.12', 59: '140.91', 60: '144.24', 61: '145', 62: '150.36', 63: '151.96', 64: '157.25',
      65: '158.93', 66: '162.50', 67: '164.93', 68: '167.26', 69: '168.93', 70: '173.05', 71: '174.97',
      72: '178.49', 73: '180.95', 74: '183.84', 75: '186.21', 76: '190.23', 77: '192.22', 78: '195.08', 79: '196.97', 80: '200.59',
      81: '204.38', 82: '207.2', 83: '208.98', 84: '209', 85: '210', 86: '222',
      87: '223', 88: '226', 89: '227', 90: '232.04', 91: '231.04', 92: '238.03', 93: '237', 94: '244', 95: '243', 96: '247',
      97: '247', 98: '251', 99: '252', 100: '257', 101: '258', 102: '259', 103: '266',
      104: '267', 105: '268', 106: '269', 107: '270', 108: '277', 109: '278', 110: '281', 111: '282', 112: '285',
      113: '286', 114: '289', 115: '290', 116: '293', 117: '294', 118: '294',
    };

    var ORCH_VIOLET_HEX = '#8B5CF6';
    var ORCH_GOLD_HEX = '#F5B942';
    var ORCH_NON_PLANNER_LABEL = 'NON-PLANNER · 编排态不可选';

    /* ============================================================================
     * 1. 基础数学、弹簧曲线与色彩工具
     * ============================================================================ */
    function clamp(v, lo, hi) {
      return v < lo ? lo : v > hi ? hi : v;
    }

    function smoothstep01(t) {
      var x = clamp(t, 0, 1);
      return x * x * (3 - 2 * x);
    }

    function easeOutCubic(t) {
      var p = clamp(t, 0, 1);
      var inv = 1 - p;
      return 1 - inv * inv * inv;
    }

    function easeOutCrystalFader(t) {
      var p = clamp(t, 0, 1);
      if (p >= 0.9995) return 1.0;
      var decay = Math.pow(1 - p, 3.85);
      return 1 - decay * Math.cos(p * Math.PI * 1.06);
    }

    function runtimeNowMs() {
      if (typeof performance === 'object' && performance && typeof performance.now === 'function') {
        return performance.now();
      }
      return Date.now();
    }

    function hexToRgb01(hex) {
      var s = String(hex || '').trim();
      if (s.charAt(0) === '#') s = s.slice(1);
      if (s.length === 3) {
        s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
      }
      if (s.length !== 6) return [0.30, 0.56, 0.96];
      var num = parseInt(s, 16);
      if (isNaN(num)) return [0.30, 0.56, 0.96];
      return [
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255,
      ];
    }

    function mixRgb(a, b, t) {
      var k = clamp(t, 0, 1);
      return [
        a[0] + (b[0] - a[0]) * k,
        a[1] + (b[1] - a[1]) * k,
        a[2] + (b[2] - a[2]) * k,
      ];
    }

    function rgb01ToCss(rgb, alpha) {
      var r = Math.round(clamp(rgb[0], 0, 1) * 255);
      var g = Math.round(clamp(rgb[1], 0, 1) * 255);
      var b = Math.round(clamp(rgb[2], 0, 1) * 255);
      if (alpha === undefined || alpha >= 0.999) {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      }
      var a = Math.round(clamp(alpha, 0, 1) * 1000) / 1000;
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }

    var ORCH_VIOLET_RGB = hexToRgb01(ORCH_VIOLET_HEX);
    var ORCH_GOLD_RGB = hexToRgb01(ORCH_GOLD_HEX);

    function detectAuxKind(raw) {
      var d = raw || {};
      var idProbe = (String(d.auxId || '') + ' ' + String(d.auxSlotId || '')).toLowerCase();
      if (/standby|blind|reserved/.test(idProbe) && d.isAvailable === false && !d.orchUnsupported) return 'standby';
      if (/orch|dual[-_\s]?core|planner/.test(idProbe)) return 'orchestrator';
      if (/flash|lite|turbo/.test(idProbe)) return 'flash';
      if (/claude|opus|sonnet|haiku|anthropic/.test(idProbe)) return 'claude';
      if (/gpt|oss|openai|\bo1\b|\bo3\b|\bo4\b/.test(idProbe)) return 'gpt';
      var probe = (
        idProbe + ' ' +
        String(d.symbol || '') + ' ' +
        String(d.badgeText || d.badgeCode || '') + ' ' +
        String(d.title || '')
      ).toLowerCase();
      if (/orch|dual[-_\s]?core|planner/.test(probe)) return 'orchestrator';
      if (/flash|lite|fast|turbo/.test(probe)) return 'flash';
      if (/claude|opus|sonnet|haiku|anthropic/.test(probe)) return 'claude';
      if (/gpt|oss|openai|\bo1\b|\bo3\b|\bo4\b/.test(probe)) return 'gpt';
      return 'generic';
    }

    function deriveOpticProfile(info) {
      if (info && !info.isAvailable && !info.orchUnsupported) {
        return STANDBY_OPTIC_THEME;
      }
      if (info && info.isAuxModel) {
        if (info.auxKind === 'standby') return STANDBY_OPTIC_THEME;
        var baseAux = AUX_OPTIC_THEMES[info.auxKind] || AUX_OPTIC_THEMES.generic;
        return baseAux;
      }

      var zNum = Number(info && info.z) || 6;
      if (ELEMENT_OPTIC_THEMES[zNum]) {
        return ELEMENT_OPTIC_THEMES[zNum];
      }

      var gStr = String((info && info.groupCode) || '');
      var col = parseInt(gStr.replace(/[^0-9]/g, ''), 10) || ((zNum % 18) + 1);
      if (col === 1 || col === 2) return ELEMENT_OPTIC_THEMES[1];
      if (col >= 13 && col <= 16) return ELEMENT_OPTIC_THEMES[6];
      if (col === 17) return ELEMENT_OPTIC_THEMES[10];
      return ELEMENT_OPTIC_THEMES[18];
    }

    function deriveEffortEnergyFromTier(effortName, normPos) {
      var key = String(effortName || '').toLowerCase().trim();
      if (key === 'low' || key === 'minimal') return 0.28;
      if (key === 'medium' || key === 'med') return 0.54;
      if (key === 'high') return 0.80;
      if (key === 'xhigh' || key === 'extra' || key === 'max' || key === 'ultra') return 1.0;
      var t = clamp(Number(normPos) || 0, 0, 1);
      return 0.28 + 0.72 * t;
    }

    function computeContinuousEffortEnergy(levels, sliderPos, explicitEnergy) {
      if (typeof explicitEnergy === 'number' && isFinite(explicitEnergy)) {
        return clamp(explicitEnergy, 0.22, 1.0);
      }
      if (!Array.isArray(levels) || !levels.length) return 0.80;
      if (levels.length === 1) {
        return deriveEffortEnergyFromTier(levels[0] && levels[0].effort, 0.80);
      }
      var maxIdx = levels.length - 1;
      var pos = clamp(typeof sliderPos === 'number' ? sliderPos : maxIdx, 0, maxIdx);
      var i0 = Math.floor(pos);
      var i1 = Math.min(maxIdx, i0 + 1);
      var frac = pos - i0;
      var e0 = deriveEffortEnergyFromTier(levels[i0] && levels[i0].effort, i0 / maxIdx);
      var e1 = deriveEffortEnergyFromTier(levels[i1] && levels[i1].effort, i1 / maxIdx);
      return clamp(e0 + (e1 - e0) * frac, 0.28, 1.0);
    }

    function hasCjkText(str) {
      return /[\u4e00-\u9fff]/.test(String(str || ''));
    }

    function extractElementUpperName(info) {
      var explicitEn = String((info && info.elementEn) || '').trim();
      if (explicitEn && /^[A-Za-z][A-Za-z\s-]{0,28}$/.test(explicitEn)) {
        return explicitEn.toUpperCase();
      }
      var title = String((info && info.title) || '').trim();
      var mTitle = /·\s*([A-Za-z][A-Za-z\s-]{1,26}?)(?:\s*(?:[—–(]|-\s*Unreleased)|\s*$)/i.exec(title);
      if (mTitle && mTitle[1]) {
        return mTitle[1].trim().toUpperCase();
      }
      var chem = String((info && info.chemLabel) || '').trim();
      var mChem = /·\s*([A-Za-z][A-Za-z\s-]{1,26}?)(?:\s*\(|\s*$)/.exec(chem);
      if (mChem && mChem[1]) {
        return mChem[1].trim().toUpperCase();
      }
      if (/^[A-Za-z][A-Za-z\s-]{1,26}$/.test(chem)) {
        return chem.toUpperCase();
      }
      var symUpper = String((info && info.symbol) || 'C').trim().toUpperCase();
      var exactCore = EXACT_CORE_NAMES_BY_Z[Number(info && info.z)];
      if (exactCore && exactCore.sym === symUpper) {
        return exactCore.name;
      }
      return symUpper || 'C';
    }

    function toTitleCaseWords(str) {
      return String(str || '')
        .trim()
        .replace(/[A-Za-z]+/g, function (w) {
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        });
    }

    function cleanHeroTitle(info) {
      var t = String((info && info.title) || (info && info.symbol) || '').trim();
      if (!info.isAvailable || info.orchUnsupported || info.blindFlash) {
        t = t.replace(/\s*·\s*\d+(?:\.\d+)?\s*·\s*STANDBY$/i, '').trim();
        t = t.replace(/\s*[—–-]\s*(?:Unreleased|Standby)$/i, '').trim();
      }
      return t || String((info && info.symbol) || 'Gemini 4 Carbon');
    }

    function formatBlindElementCapsuleLabel(info, upperEnName) {
      if (info.blindFlash && info.blindFlashBanner) {
        return String(info.blindFlashBanner);
      }
      var numStr = String(info.numLabel || info.z || '').trim();
      var symStr = String(info.symbol || '').trim();
      var rawEn = String(info.elementEn || '').trim();
      var niceName = rawEn && /^[A-Za-z][A-Za-z\s-]{0,28}$/.test(rawEn)
        ? toTitleCaseWords(rawEn)
        : toTitleCaseWords(upperEnName || symStr);
      var massStr = String(info.mass || '').trim();
      var parts = [];
      if (numStr || symStr) {
        parts.push((numStr ? numStr + ' ' : '') + symStr);
      }
      if (niceName && niceName.toUpperCase() !== symStr.toUpperCase()) {
        parts.push(niceName);
      }
      if (massStr) {
        parts.push(massStr);
      }
      parts.push('STANDBY');
      return parts.join(' · ');
    }

    function resolveEditorialKickerText(info, optic, upperEnName) {
      var numStr = String(info.numLabel || info.z || '6').trim();
      var padNum = numStr.length === 1 ? '0' + numStr : numStr;
      var symStr = String(info.symbol || 'C').trim();
      var rawBadge = String(info.badgeText || '').trim();

      if (info.orchUnsupported) {
        if (info.isAuxModel) {
          var cleanAux = rawBadge.replace(/^ORCH\s*[·•-]\s*/i, '').trim() || symStr || optic.defaultBadge || 'AUX';
          return 'ORCHESTRATOR · ' + cleanAux.toUpperCase().slice(0, 12);
        }
        var uCode = /^\d/.test(symStr) ? symStr : (numStr + symStr);
        return 'ORCHESTRATOR · ' + uCode + ' ' + upperEnName;
      }

      if (info.orchLatched) {
        var orchCode = '';
        if (rawBadge) {
          orchCode = /^ORCH\b/i.test(rawBadge) ? rawBadge.slice(0, 18) : ('ORCH · ' + rawBadge).slice(0, 18);
        } else if (info.isAuxModel) {
          if (info.auxKind === 'orchestrator' && (!symStr || /^orch$/i.test(symStr))) {
            orchCode = 'ORCH';
          } else {
            var aCode = (!symStr || /^orch$/i.test(symStr))
              ? (/opus/i.test(info.title) ? 'OPUS' : (optic.defaultBadge || 'AUX'))
              : symStr.toUpperCase();
            orchCode = 'ORCH · ' + aCode;
          }
        } else {
          var eCode = /^\d/.test(symStr) ? symStr : (numStr + symStr);
          orchCode = 'ORCH · ' + eCode;
        }
        return orchCode.toUpperCase();
      }

      if (!info.isAvailable) {
        return padNum + ' ' + symStr.toUpperCase() + ' · ' + (upperEnName || 'ELEMENT');
      }

      if (info.isAuxModel) {
        if (info.auxKind === 'claude') {
          return /sonnet/i.test(info.title) ? 'ANTHROPIC · CLAUDE SONNET' : 'ANTHROPIC · CLAUDE OPUS';
        }
        if (info.auxKind === 'flash') {
          return 'GEMINI · ' + (rawBadge || 'FLASH').toUpperCase();
        }
        if (info.auxKind === 'gpt') {
          return 'OPEN · ' + (rawBadge || 'GPT').toUpperCase();
        }
        if (info.auxKind === 'generic') {
          return 'AUX · ' + (rawBadge || symStr || 'MODEL').toUpperCase();
        }
        return optic.familyPrefix || ('AUX · ' + (rawBadge || 'ORCH').toUpperCase());
      }

      if (EXACT_CORE_NAMES_BY_Z[info.z]) {
        return 'GEMINI 4 · ' + padNum + ' ' + EXACT_CORE_NAMES_BY_Z[info.z].name;
      }
      return 'GEMINI · ' + padNum + ' ' + (upperEnName || symStr.toUpperCase());
    }

    function resolveTopRightRoleTag(info, optic, upperEnName) {
      var explicitTag = String(info.tierTag || info.roleBadge || '').trim();
      if (info.orchUnsupported) {
        if (explicitTag && /LOCK|NON-PLANNER|UNSUPPORTED/i.test(explicitTag)) {
          return explicitTag.toUpperCase().slice(0, 22);
        }
        return 'ORCH · LOCKED';
      }
      if (info.orchLatched) {
        if (explicitTag && (/DUAL/i.test(explicitTag) || /\+1H/i.test(explicitTag))) {
          return explicitTag.toUpperCase().slice(0, 22);
        }
        return 'DUAL-CORE · +1H';
      }
      if (explicitTag) {
        return explicitTag.toUpperCase().slice(0, 20);
      }
      if (info.blindFlash) {
        return 'STANDBY · CHEM';
      }
      if (!info.isAvailable) {
        return upperEnName || 'STANDBY';
      }
      if (info.isAuxModel) {
        if (info.auxKind === 'claude' && /opus/i.test(info.title)) {
          return 'APEX · CRAFT';
        }
        return optic.defaultTier || 'DUAL-CORE';
      }
      return optic.defaultTier || 'PRO · OFFICIAL';
    }

    function resolveBannerTokens(tp, optic, info) {
      var id = String((tp && tp.id) || '');
      var isLight = Boolean(tp && tp.isLight) || id === 'crystal-light' || id === 'alabaster-light';
      var isWarm = id === 'warm-dark' || id === 'alabaster-light';
      var isMono = Boolean(tp && tp.isMono);
      var isOrchSealed = Boolean(info && info.orchUnsupported);
      var isStandbyStone = Boolean(optic && optic.sculptKey === 'standby');

      var themeKey = isLight
        ? (isWarm ? 'alabaster-light' : 'crystal-light')
        : (isWarm ? 'warm-dark' : 'obsidian-dark');

      var accentHex = isLight ? (optic.lightAccent || optic.accent) : optic.accent;
      var secHex = isLight ? (optic.lightSecondary || optic.secondary || optic.accent) : (optic.secondary || optic.accent);
      var accentRgb = (isMono || isOrchSealed || isStandbyStone)
        ? (isLight ? [0.29, 0.34, 0.42] : [0.64, 0.70, 0.79])
        : hexToRgb01(accentHex);
      var secRgb = (isMono || isOrchSealed || isStandbyStone)
        ? (isLight ? [0.39, 0.45, 0.54] : [0.76, 0.82, 0.89])
        : hexToRgb01(secHex);
      var glowRgb = (isMono || isOrchSealed || isStandbyStone)
        ? (isLight ? [0.45, 0.51, 0.60] : [0.82, 0.87, 0.93])
        : hexToRgb01(optic.glow || optic.accent);

      var pillTopHex = isMono
        ? (isLight ? '#1E293B' : '#E2E8F0')
        : (isLight ? (optic.pillLightTop || accentHex) : (optic.pillDarkTop || optic.accent));
      var pillBotHex = isMono
        ? (isLight ? '#0F172A' : '#CBD5E1')
        : (isLight ? (optic.pillLightBot || secHex) : (optic.pillDarkBot || secHex));

      var bgLeft = isMono
        ? (isLight ? '#EBEBEB' : '#121212')
        : isOrchSealed
        ? (isLight ? '#DCE4EF' : '#1B2330')
        : (isLight ? optic.lightBgLeft : optic.darkBgLeft);
      var bgMid = isMono
        ? (isLight ? '#F4F4F4' : '#0B0B0B')
        : isOrchSealed
        ? (isLight ? '#EBF0F7' : '#111722')
        : (isLight ? optic.lightBgMid : optic.darkBgMid);
      var bgRight = isMono
        ? (isLight ? '#FAFAFA' : '#070707')
        : isOrchSealed
        ? (isLight ? '#F7F9FC' : '#090D13')
        : (isLight ? optic.lightBgRight : optic.darkBgRight);

      return {
        isLight: isLight,
        isWarm: isWarm,
        isMono: isMono,
        isOrchSealed: isOrchSealed,
        isStandbyStone: isStandbyStone,
        themeKey: themeKey,
        sculptKey: optic.sculptKey,
        watermark: optic.watermark || 'C',
        bgLeft: bgLeft,
        bgMid: bgMid,
        bgRight: bgRight,
        titleHex: isLight ? (isWarm ? '#161412' : '#0B1120') : '#FFFFFF',
        standbyTitleHex: isLight ? (isWarm ? '#161412' : '#0F172A') : '#F8FAFC',
        lockedTitleHex: isLight ? '#526075' : '#9AA7BC',
        kickerCss: isOrchSealed
          ? (isLight ? 'rgba(71, 85, 105, 0.78)' : 'rgba(176, 190, 210, 0.76)')
          : isStandbyStone
          ? (isLight ? 'rgba(30, 41, 59, 0.82)' : 'rgba(203, 213, 225, 0.86)')
          : (isLight ? 'rgba(15, 23, 42, 0.78)' : 'rgba(236, 242, 255, 0.88)'),
        watermarkCss: (isMono || isOrchSealed || isStandbyStone)
          ? (isLight ? 'rgba(30, 41, 59, 0.118)' : 'rgba(203, 213, 225, 0.125)')
          : (isLight
              ? rgb01ToCss(mixRgb(accentRgb, [0.10, 0.14, 0.24], 0.24), 0.152)
              : rgb01ToCss(mixRgb(glowRgb, [1, 1, 1], 0.48), 0.162)),
        watermarkFadeCss: (isMono || isOrchSealed || isStandbyStone)
          ? (isLight ? 'rgba(30, 41, 59, 0.084)' : 'rgba(203, 213, 225, 0.090)')
          : (isLight
              ? rgb01ToCss(mixRgb(accentRgb, [0.10, 0.14, 0.24], 0.24), 0.114)
              : rgb01ToCss(mixRgb(glowRgb, [1, 1, 1], 0.48), 0.122)),
        wellFillTop: isLight ? 'rgba(255, 255, 255, 0.76)' : 'rgba(255, 255, 255, 0.088)',
        wellFillBot: isLight ? 'rgba(241, 245, 252, 0.62)' : 'rgba(255, 255, 255, 0.045)',
        wellOutlineCss: isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.18)',
        wellDividerCss: isLight ? 'rgba(15, 23, 42, 0.14)' : 'rgba(255, 255, 255, 0.17)',
        inactiveEffortCss: isLight ? 'rgba(30, 41, 59, 0.76)' : 'rgba(232, 238, 250, 0.78)',
        hoverEffortCss: isLight ? '#0F172A' : '#FFFFFF',
        pillTopHex: pillTopHex,
        pillBotHex: pillBotHex,
        pillTextHex: (isMono && !isLight) ? '#0F172A' : '#FFFFFF',
        pillGlowCss: rgb01ToCss(accentRgb, isLight ? 0.26 : 0.42),
        pillBorderCss: isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.48)',
        accentRgb: accentRgb,
        secRgb: secRgb,
        glowRgb: glowRgb,
        accentCss: rgb01ToCss(accentRgb, 1.0),
        secCss: rgb01ToCss(secRgb, 1.0),
        glowCss: rgb01ToCss(glowRgb, 1.0),
      };
    }

    /* ============================================================================
     * 2. 安全 Canvas 2D 原语（100% 兼容真实浏览器与单测 Mock 2D Context）
     * ============================================================================ */
    function createOffscreenSurface(doc, externalCanvas, w, h) {
      var c = externalCanvas || null;
      var owned = false;
      if (!c && doc && typeof doc.createElement === 'function') {
        try {
          c = doc.createElement('canvas');
          owned = true;
        } catch (_e) {
          c = null;
        }
      }
      if (!c || typeof c.getContext !== 'function') return null;
      try {
        if (c.width !== w) c.width = w;
        if (c.height !== h) c.height = h;
        var ctx = c.getContext('2d');
        if (!ctx) return null;
        return { canvas: c, ctx: ctx, owned: owned };
      } catch (_err) {
        return null;
      }
    }

    function drawRoundRectPath(ctx, x, y, w, h, r) {
      var rw = Math.max(0, w);
      var rh = Math.max(0, h);
      var rr = Math.max(0, Math.min(r, rw * 0.5, rh * 0.5));
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, rr);
      ctx.arcTo(x + rw, y + rh, x, y + rh, rr);
      ctx.arcTo(x, y + rh, x, y, rr);
      ctx.arcTo(x, y, x + rw, y, rr);
      ctx.closePath();
    }

    function drawEllipseArcSafe(ctx, cx, cy, rx, ry, rot, a0, a1, ccw) {
      var safeRx = Math.max(0.5, rx);
      var safeRy = Math.max(0.5, ry);
      if (typeof ctx.ellipse === 'function') {
        ctx.ellipse(cx, cy, safeRx, safeRy, rot || 0, a0, a1, Boolean(ccw));
        return;
      }
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(safeRx, safeRy);
      ctx.arc(0, 0, 1, a0, a1, Boolean(ccw));
      ctx.restore();
    }

    function setCompositeSafe(ctx, mode) {
      if (!ctx) return;
      try {
        ctx.globalCompositeOperation = mode;
      } catch (_e) {}
    }

    function measureTextSafe(ctx, str) {
      var text = String(str || '');
      if (!ctx || typeof ctx.measureText !== 'function') {
        return text.length * 14;
      }
      var m = ctx.measureText(text);
      return m && typeof m.width === 'number' ? m.width : text.length * 14;
    }

    function truncateText(ctx, text, maxW) {
      var str = String(text || '');
      if (!str || maxW <= 0) return '';
      if (measureTextSafe(ctx, str) <= maxW) return str;
      var lo = 0;
      var hi = str.length;
      while (lo < hi) {
        var mid = Math.ceil((lo + hi) * 0.5);
        if (measureTextSafe(ctx, str.slice(0, mid) + '…') <= maxW) {
          lo = mid;
        } else {
          hi = mid - 1;
        }
      }
      return str.slice(0, Math.max(1, lo)) + '…';
    }

    function fitSingleLineFontSize(ctx, text, weight, family, maxPx, minPx, maxWidth) {
      var px = maxPx;
      var step = 2;
      while (px > minPx) {
        ctx.font = weight + ' ' + px + 'px ' + family;
        if (measureTextSafe(ctx, text) <= maxWidth) {
          return px;
        }
        px = Math.max(minPx, px - step);
      }
      ctx.font = weight + ' ' + minPx + 'px ' + family;
      return minPx;
    }

    function makeLinearGrad(ctx, x0, y0, x1, y1, stops, fallbackCss) {
      if (!ctx || typeof ctx.createLinearGradient !== 'function') {
        return fallbackCss || '#000000';
      }
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      if (!g || typeof g.addColorStop !== 'function') return fallbackCss || '#000000';
      for (var i = 0; i < stops.length; i++) {
        g.addColorStop(clamp(stops[i][0], 0, 1), stops[i][1]);
      }
      return g;
    }

    function makeRadialGrad(ctx, x0, y0, r0, x1, y1, r1, stops, fallbackCss) {
      if (!ctx || typeof ctx.createRadialGradient !== 'function') {
        return fallbackCss || 'rgba(0,0,0,0)';
      }
      var g = ctx.createRadialGradient(x0, y0, Math.max(0, r0), x1, y1, Math.max(0.1, r1));
      if (!g || typeof g.addColorStop !== 'function') return fallbackCss || 'rgba(0,0,0,0)';
      for (var i = 0; i < stops.length; i++) {
        g.addColorStop(clamp(stops[i][0], 0, 1), stops[i][1]);
      }
      return g;
    }

    function setShadow(ctx, color, blur, ox, oy) {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur || 0;
      ctx.shadowOffsetX = ox || 0;
      ctx.shadowOffsetY = oy || 0;
    }

    function clearShadow(ctx) {
      ctx.shadowColor = 'rgba(0,0,0,0)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    function setLetterSpacingSafe(ctx, spacingCss) {
      if (ctx && 'letterSpacing' in ctx) {
        try {
          ctx.letterSpacing = spacingCss;
        } catch (_e) {}
      }
    }

    function resolveGrainAssetsPackage(runtimeRoot) {
      return (
        (runtimeRoot && runtimeRoot.PrismPeriodicGrainAssets) ||
        (moduleRoot && moduleRoot.PrismPeriodicGrainAssets) ||
        (typeof globalThis !== 'undefined' && globalThis && globalThis.PrismPeriodicGrainAssets) ||
        (typeof window !== 'undefined' && window && window.PrismPeriodicGrainAssets) ||
        (typeof require === 'function'
          ? (function () {
              try {
                return require('./pbr-grain-assets.js');
              } catch (_e) {
                return null;
              }
            })()
          : null)
      );
    }

    /* ============================================================================
     * 3. 思考档位毛玻璃胶囊热区几何计算器（x: 656..1504, y: 296..388 零死区契约）
     * ============================================================================ */
    function computeQuartzFaderWellLayout(width, height, rawLevels, deckInfo, blendState) {
      var W = width > 0 ? width : DEFAULT_WIDTH;
      var H = height > 0 ? height : DEFAULT_HEIGHT;
      var scaleX = W / DEFAULT_WIDTH;
      var scaleY = H / DEFAULT_HEIGHT;

      var levels = Array.isArray(rawLevels) ? rawLevels : [];
      if (!levels.length) {
        return { well: null, items: [], activeIndex: 0 };
      }

      var n = Math.min(levels.length, 6);
      var wellX = WELL_X;
      var wellY = WELL_Y;
      var wellH = WELL_H;
      var wellR = 46; /* 圆润毛玻璃胶囊端头 */
      var insetPad = 6;
      var blockH = wellH - insetPad * 2;
      var blockR = 40;

      var wellW = WELL_W;
      var innerX = wellX + insetPad;
      var innerY = wellY + insetPad;
      var innerW = wellW - insetPad * 2;
      var slotW = innerW / n;

      var pressArr = blendState && (blendState.effortPress || blendState.pressArr || null);
      var hoverArr = blendState && (blendState.effortHover || blendState.hoverArr || null);

      var items = [];
      var activeIndex = -1;

      for (var i = 0; i < n; i++) {
        var lv = levels[i] || {};
        var effStr = String(lv.effort !== undefined ? lv.effort : '');
        var labelStr = String(lv.label || effStr || '');
        var isActive = Boolean(lv.active);
        if (isActive && activeIndex < 0) {
          activeIndex = i;
        }

        var hitLeftX = i === 0 ? wellX : (innerX + i * slotW);
        var hitRightX = i === n - 1 ? (wellX + wellW) : (innerX + (i + 1) * slotW);
        var hitW = hitRightX - hitLeftX;
        var hitY = wellY;
        var hitH = wellH;

        var u0 = clamp(hitLeftX / DEFAULT_WIDTH, 0, 1);
        var u1 = clamp(hitRightX / DEFAULT_WIDTH, 0, 1);
        var v0 = clamp(hitY / DEFAULT_HEIGHT, 0, 1);
        var v1 = clamp((hitY + hitH) / DEFAULT_HEIGHT, 0, 1);

        var px = hitLeftX * scaleX;
        var py = hitY * scaleY;
        var pw = hitW * scaleX;
        var ph = hitH * scaleY;

        var slotLeftX = innerX + i * slotW;
        var slotCenterX = slotLeftX + slotW * 0.5;

        var isHovBool = Boolean(deckInfo && deckInfo.hoveredEffort === effStr && effStr !== '');
        var isPrsBool = Boolean(deckInfo && deckInfo.pressedEffort === effStr && effStr !== '');
        var dynHov = hoverArr && typeof hoverArr[i] === 'number' ? hoverArr[i] : 0;
        var dynPrs = pressArr && typeof pressArr[i] === 'number' ? pressArr[i] : 0;

        items.push({
          index: i,
          effort: effStr,
          label: labelStr,
          active: isActive,
          x: px,
          y: py,
          w: pw,
          h: ph,
          px: px,
          py: py,
          pw: pw,
          ph: ph,
          lx: hitLeftX,
          ly: hitY,
          lw: hitW,
          lh: hitH,
          slotX: slotLeftX,
          slotW: slotW,
          lcx: slotCenterX,
          u0: u0,
          v0: v0,
          u1: u1,
          v1: v1,
          hover: clamp(Math.max(isHovBool ? 1 : 0, dynHov), 0, 1),
          press: clamp(Math.max(isPrsBool ? 1 : 0, dynPrs), 0, 1),
        });
      }

      if (activeIndex < 0) activeIndex = 0;

      return {
        well: {
          x: wellX * scaleX,
          y: wellY * scaleY,
          w: wellW * scaleX,
          h: wellH * scaleY,
          lx: wellX,
          ly: wellY,
          lw: wellW,
          lh: wellH,
          lr: wellR,
          insetPad: insetPad,
          innerX: innerX,
          innerY: innerY,
          innerW: innerW,
          slotW: slotW,
          blockH: blockH,
          blockR: blockR,
          cy: wellY + wellH * 0.5,
        },
        items: items,
        activeIndex: activeIndex,
      };
    }

    /* ============================================================================
     * 4. 矢量星芒徽标、锁扣图标与 #0 Orch 星云紫金双环光学柔晕
     * ============================================================================ */
    function drawGeminiSparkleGlyph(ctx, cx, cy, r, fillStyle) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      if (typeof ctx.quadraticCurveTo === 'function') {
        ctx.quadraticCurveTo(cx, cy, cx + r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + r);
        ctx.quadraticCurveTo(cx, cy, cx - r, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - r);
      } else {
        ctx.lineTo(cx + r * 0.28, cy - r * 0.28);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx + r * 0.28, cy + r * 0.28);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r * 0.28, cy + r * 0.28);
        ctx.lineTo(cx - r, cy);
        ctx.lineTo(cx - r * 0.28, cy - r * 0.28);
      }
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.restore();
    }

    function drawPadlockVectorGlyph(ctx, cx, cy, scale, strokeCss, bodyTopCss, bodyBotCss, keyholeCss) {
      var s = scale || 1.0;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(s, s);

      ctx.beginPath();
      ctx.arc(0, -8, 10.5, Math.PI, 0, false);
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = strokeCss;
      ctx.stroke();

      drawRoundRectPath(ctx, -14.5, -5.5, 29, 23, 5.5);
      ctx.fillStyle = makeLinearGrad(ctx, 0, -5.5, 0, 17.5, [[0, bodyTopCss], [1, bodyBotCss]], bodyTopCss);
      ctx.fill();
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = strokeCss;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 4.5, 3.2, 0, TWO_PI);
      ctx.fillStyle = keyholeCss;
      ctx.fill();
      ctx.fillRect(-1.4, 6.2, 2.8, 5.5);

      ctx.restore();
    }

    /* #0 Orch 双核锁存态：柔和叠印在规划主核官方玻璃海报外围的 Gemini 星云紫金光学双环（isMono 下严格退回零色度银灰单色环） */
    function drawSubtleOrchDualRingAura(ctx, cx, cy, tokens, alpha) {
      if (alpha <= 0.01) return;
      var isLight = tokens.isLight;
      var isMono = Boolean(tokens.isMono);
      var ringPriRgb = isMono
        ? (isLight ? [0.22, 0.22, 0.22] : [0.88, 0.88, 0.88])
        : ORCH_VIOLET_RGB;
      var ringSecRgb = isMono
        ? (isLight ? [0.38, 0.38, 0.38] : [0.72, 0.72, 0.72])
        : ORCH_GOLD_RGB;
      ctx.save();
      ctx.globalAlpha = clamp(alpha, 0, 1);
      if (!isLight) {
        setCompositeSafe(ctx, 'screen');
      }

      var halo = makeRadialGrad(
        ctx, cx, cy, 36, cx, cy, 242,
        [
          [0.0, rgb01ToCss(ringPriRgb, isLight ? 0.12 : 0.24)],
          [0.56, rgb01ToCss(ringSecRgb, isLight ? 0.08 : 0.15)],
          [1.0, 'rgba(0, 0, 0, 0)'],
        ],
        'rgba(0, 0, 0, 0)'
      );
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, 640, DEFAULT_HEIGHT);

      ctx.beginPath();
      drawEllipseArcSafe(ctx, cx, cy, 206, 98, -0.40, 0, TWO_PI, false);
      ctx.lineWidth = isLight ? 2.6 : 3.2;
      ctx.strokeStyle = makeLinearGrad(
        ctx, cx - 196, cy - 94, cx + 196, cy + 94,
        [
          [0.0, rgb01ToCss(ringPriRgb, isLight ? 0.56 : 0.80)],
          [0.5, isMono
            ? (isLight ? 'rgba(72, 72, 72, 0.22)' : 'rgba(224, 224, 224, 0.48)')
            : (isLight ? 'rgba(124, 58, 237, 0.26)' : 'rgba(245, 240, 255, 0.62)')],
          [1.0, rgb01ToCss(ringSecRgb, isLight ? 0.52 : 0.76)],
        ],
        isMono ? '#737373' : ORCH_VIOLET_HEX
      );
      ctx.stroke();

      ctx.beginPath();
      drawEllipseArcSafe(ctx, cx, cy, 196, 90, 0.44, 0, TWO_PI, false);
      ctx.lineWidth = isLight ? 2.2 : 2.6;
      ctx.strokeStyle = makeLinearGrad(
        ctx, cx - 186, cy + 84, cx + 186, cy - 84,
        [
          [0.0, rgb01ToCss(ringSecRgb, isLight ? 0.50 : 0.72)],
          [0.5, isMono
            ? (isLight ? 'rgba(96, 96, 96, 0.20)' : 'rgba(196, 196, 196, 0.42)')
            : (isLight ? 'rgba(217, 119, 6, 0.24)' : 'rgba(253, 230, 138, 0.54)')],
          [1.0, rgb01ToCss(ringPriRgb, isLight ? 0.54 : 0.76)],
        ],
        isMono ? '#8A8A8A' : ORCH_GOLD_HEX
      );
      ctx.stroke();

      drawGeminiSparkleGlyph(
        ctx, cx - 178, cy - 66, 11,
        isMono ? (isLight ? '#404040' : '#E5E5E5') : (isLight ? '#7C3AED' : '#DDD6FE')
      );
      drawGeminiSparkleGlyph(
        ctx, cx + 176, cy + 64, 10,
        isMono ? (isLight ? '#595959' : '#CFCFCF') : (isLight ? '#D97706' : '#FDE68A')
      );

      setCompositeSafe(ctx, 'source-over');
      ctx.restore();
    }

    /* ============================================================================
     * 5. 满幅深浅官方海报背景绘制器（支持 200ms 叠化 + 微妙视差平移 + ~8% 切档辉度微涌 + V14.1 原石晶坯 & 重度冰封雾化）
     * ============================================================================ */
    function buildFrostedDownsampleCanvas(doc, wpEntry, isLight) {
      if (!doc || typeof doc.createElement !== 'function' || !wpEntry || !wpEntry.img) return null;
      try {
        var stageW1 = 112;
        var stageH1 = 34;
        var stageW2 = 320;
        var stageH2 = 96;
        var c1 = doc.createElement('canvas');
        var c2 = doc.createElement('canvas');
        if (!c1 || !c2 || typeof c1.getContext !== 'function' || typeof c2.getContext !== 'function') return null;
        c1.width = stageW1;
        c1.height = stageH1;
        c2.width = stageW2;
        c2.height = stageH2;
        var g1 = c1.getContext('2d');
        var g2 = c2.getContext('2d');
        if (!g1 || !g2) return null;

        g1.imageSmoothingEnabled = true;
        g1.imageSmoothingQuality = 'high';
        if ('filter' in g1) {
          try {
            g1.filter = isLight
              ? 'blur(2.2px) saturate(0.08) brightness(0.99) contrast(0.84)'
              : 'blur(2.2px) saturate(0.08) brightness(0.88) contrast(0.88)';
          } catch (_e1) {}
        }
        g1.drawImage(wpEntry.img, -4, -3, stageW1 + 8, stageH1 + 6);

        /* Pixel-level ~92% cold-slate desaturation fallback on compact 112x34 buffer when getImageData is supported */
        if (typeof g1.getImageData === 'function' && typeof g1.putImageData === 'function') {
          try {
            var imgData = g1.getImageData(0, 0, stageW1, stageH1);
            var px = imgData && imgData.data;
            if (px && px.length >= stageW1 * stageH1 * 4) {
              var slateR = isLight ? 232 : 34;
              var slateG = isLight ? 238 : 44;
              var slateB = isLight ? 247 : 58;
              var veilMix = isLight ? 0.24 : 0.20;
              for (var p = 0; p < px.length; p += 4) {
                var r = px[p];
                var g = px[p + 1];
                var b = px[p + 2];
                var lum = 0.299 * r + 0.587 * g + 0.114 * b;
                var dr = lum * 0.92 + r * 0.08;
                var dg = lum * 0.92 + g * 0.08;
                var db = Math.min(255, lum * 0.95 + b * 0.08 + (isLight ? 3 : 5));
                px[p] = Math.round(dr * (1 - veilMix) + slateR * veilMix);
                px[p + 1] = Math.round(dg * (1 - veilMix) + slateG * veilMix);
                px[p + 2] = Math.round(db * (1 - veilMix) + slateB * veilMix);
              }
              g1.putImageData(imgData, 0, 0);
            }
          } catch (_pxErr) {}
        }

        g2.imageSmoothingEnabled = true;
        g2.imageSmoothingQuality = 'high';
        if ('filter' in g2) {
          try {
            g2.filter = 'blur(2.8px)';
          } catch (_e2) {}
        }
        g2.drawImage(c1, 0, 0, stageW1, stageH1, 0, 0, stageW2, stageH2);
        c1.width = 0;
        c1.height = 0;
        try {
          c2.src = wpEntry.src;
        } catch (_srcErr) {}
        return c2;
      } catch (_err) {
        return null;
      }
    }

    function drawFullBleedBannerLayer(ctx, W, H, bgState, grainPkg, alpha, slideOffsetX, orbitYaw, orbitPitch, effortSwell) {
      if (alpha <= 0.002) return;
      var tokens = bgState.tokens;
      var isOrchUnsupported = Boolean(bgState.orchUnsupported);
      var isAvail = Boolean(bgState.isAvailable && !isOrchUnsupported);
      var isOrchActive = Boolean(bgState.orchLatched && isAvail);

      var parX = clamp(-orbitYaw * 16, -12, 12) + (slideOffsetX || 0);
      var parY = clamp(-orbitPitch * 10, -8, 8);

      ctx.save();
      ctx.globalAlpha = clamp(alpha, 0, 1);

      /* 1) 满幅流体大气渐变底色（确保即使异步贴图未就绪也 100% 呈现深/浅官方色韵，零黑砖！） */
      ctx.fillStyle = makeLinearGrad(
        ctx, 0, 0, W, H * 0.9,
        [
          [0.0, tokens.bgLeft],
          [0.48, tokens.bgMid],
          [1.0, tokens.bgRight],
        ],
        tokens.bgMid
      );
      ctx.fillRect(0, 0, W, H);

      /* 2) 绘制预烘焙 960x288 (10:3) 满幅雕塑或未雕琢原石晶坯 WebP（盲键固定走 standby，严格零 '6' 盗用回退！） */
      var modeTag = tokens.isLight ? 'light' : 'dark';
      var wpDict = tokens.isLight
        ? (grainPkg && grainPkg.OLED_WALLPAPERS_LIGHT ? grainPkg.OLED_WALLPAPERS_LIGHT : (grainPkg && grainPkg.OLED_WALLPAPERS))
        : (grainPkg && grainPkg.OLED_WALLPAPERS ? grainPkg.OLED_WALLPAPERS : null);

      var lookupKey = (!isAvail && !isOrchUnsupported) ? 'standby' : (tokens.sculptKey || 'standby');
      var wpEntry = bgState.requestWp ? bgState.requestWp(modeTag, lookupKey, wpDict) : null;

      if (wpEntry && wpEntry.ready && !wpEntry.failed && wpEntry.img) {
        ctx.save();
        var drawSource = wpEntry.img;
        var supportsFilterProp = 'filter' in ctx;
        var usingOffscreenFrosted = false;

        if (isOrchUnsupported) {
          ctx.globalAlpha = clamp(alpha * (tokens.isLight ? 0.76 : 0.74), 0, 1);
          if (bgState.getFrostedSurface && (bgState.preferOffscreenBlur || !supportsFilterProp)) {
            var frostedSurf = bgState.getFrostedSurface(modeTag, lookupKey, wpEntry, tokens.isLight);
            if (frostedSurf) {
              drawSource = frostedSurf;
              usingOffscreenFrosted = true;
            }
          }
        }

        if (tokens.isMono || isOrchUnsupported) {
          var filterApplied = false;
          if (supportsFilterProp) {
            try {
              if (usingOffscreenFrosted) {
                ctx.filter = tokens.isMono ? 'blur(8px) grayscale(1)' : 'blur(8px)';
              } else if (tokens.isMono && isOrchUnsupported) {
                ctx.filter = tokens.isLight
                  ? 'blur(16px) grayscale(1) brightness(0.99) contrast(0.84)'
                  : 'blur(16px) grayscale(1) brightness(0.88) contrast(0.88)';
              } else if (tokens.isMono) {
                ctx.filter = tokens.isLight
                  ? 'grayscale(1) contrast(1.02) brightness(0.99)'
                  : 'grayscale(1) contrast(1.08) brightness(0.88)';
              } else {
                ctx.filter = tokens.isLight
                  ? 'blur(16px) saturate(0.08) brightness(0.99) contrast(0.84)'
                  : 'blur(16px) saturate(0.08) brightness(0.88) contrast(0.88)';
              }
              filterApplied = Boolean(ctx.filter && ctx.filter !== 'none');
            } catch (_fErr) {}
          }
          if (isOrchUnsupported && !filterApplied && !usingOffscreenFrosted && bgState.getFrostedSurface) {
            var fallbackFrosted = bgState.getFrostedSurface(modeTag, lookupKey, wpEntry, tokens.isLight);
            if (fallbackFrosted) {
              drawSource = fallbackFrosted;
              usingOffscreenFrosted = true;
            }
          }
        }

        /* 雕塑视口左移 (-46px / 浅色10Ne -64px)，右侧等量延展铺满至 W；冰封模糊强制开启四边 overscan 防漏底边 */
        var isLightNeonSculpt = Boolean(tokens.isLight && String(lookupKey) === '10');
        var baseShiftX = isLightNeonSculpt ? SCULPT_SHIFT_LIGHT_NEON : SCULPT_SHIFT_X;
        var baseDrawW = W - baseShiftX;
        if (isOrchUnsupported) {
          var frostBleedX = 48;
          var frostBleedY = 48;
          ctx.drawImage(
            drawSource,
            baseShiftX - frostBleedX + parX,
            -frostBleedY + parY,
            baseDrawW + frostBleedX * 2,
            H + frostBleedY * 2
          );
        } else if (Math.abs(parX) > 0.25 || Math.abs(parY) > 0.25) {
          var bleedX = 24;
          var bleedY = 12;
          ctx.drawImage(drawSource, baseShiftX - bleedX + parX, -bleedY + parY, baseDrawW + bleedX * 2, H + bleedY * 2);
        } else {
          ctx.drawImage(drawSource, baseShiftX, 0, baseDrawW, H);
        }

        if (supportsFilterProp) {
          try {
            ctx.filter = 'none';
          } catch (_fErr2) {}
        }
        ctx.restore();

        /* 2b) V14.1 NON-PLANNER 重度冰封磨砂毛玻璃结霜面纱（向右平滑无痕消融至 0 alpha，零中部竖缝、左区零圆形锁贴纸） */
        if (isOrchUnsupported) {
          ctx.save();
          ctx.globalAlpha = clamp(alpha, 0, 1);
          ctx.fillStyle = makeLinearGrad(
            ctx, 0, 0, 820, 0,
            tokens.isLight
              ? [
                  [0.0, 'rgba(241, 245, 251, 0.42)'],
                  [0.46, 'rgba(244, 247, 252, 0.24)'],
                  [0.80, 'rgba(247, 249, 252, 0.06)'],
                  [1.0, 'rgba(247, 249, 252, 0)'],
                ]
              : [
                  [0.0, 'rgba(164, 186, 214, 0.145)'],
                  [0.46, 'rgba(132, 154, 184, 0.082)'],
                  [0.80, 'rgba(100, 120, 148, 0.022)'],
                  [1.0, 'rgba(100, 120, 148, 0)'],
                ],
            'rgba(0, 0, 0, 0)'
          );
          ctx.fillRect(0, 0, 820, H);

          ctx.fillStyle = makeRadialGrad(
            ctx, SCULPT_AURA_CX + parX * 0.4, SCULPT_AURA_CY + parY * 0.4, 18,
            SCULPT_AURA_CX + parX * 0.4, SCULPT_AURA_CY + parY * 0.4, 330,
            tokens.isLight
              ? [
                  [0.0, 'rgba(255, 255, 255, 0.24)'],
                  [0.58, 'rgba(241, 245, 251, 0.10)'],
                  [1.0, 'rgba(255, 255, 255, 0)'],
                ]
              : [
                  [0.0, 'rgba(203, 218, 238, 0.115)'],
                  [0.58, 'rgba(148, 168, 194, 0.045)'],
                  [1.0, 'rgba(0, 0, 0, 0)'],
                ],
            'rgba(0, 0, 0, 0)'
          );
          ctx.fillRect(0, 0, 720, H);
          ctx.restore();
        }
      }

      /* 3) 雕塑右翼干净分离的半透明元素符号水印（对标概念图 C：H / C / Ne / Ar / Op / Au，双字符饱满清晰，三字符防越界） */
      var wmText = String(bgState.watermark || tokens.watermark || 'C');
      if (wmText) {
        ctx.save();
        var wmLen = wmText.length;
        var isLightNeonWm = Boolean(tokens.isLight && String(lookupKey) === '10');
        var wmSize = wmLen >= 3 ? 132 : (wmLen === 2 ? 180 : 220);
        var wmBaseX = wmLen >= 3
          ? WATERMARK_LEFT_TRIPLE_X
          : (wmLen === 2
              ? (isLightNeonWm ? WATERMARK_LEFT_LIGHT_NEON_X : WATERMARK_LEFT_PAIR_X)
              : WATERMARK_LEFT_SINGLE_X);
        var wmLeftX = wmBaseX + parX * 0.55;
        var maxWmWidth = Math.max(96, RIGHT_ZONE_X - wmLeftX - 18);
        var wmSpanW = Math.min(maxWmWidth, wmLen >= 2 ? 172 : 160);
        ctx.font = '800 ' + wmSize + 'px ' + SANS_STACK;
        setLetterSpacingSafe(ctx, wmLen >= 2 ? '-0.045em' : '-0.03em');
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = makeLinearGrad(
          ctx,
          wmLeftX,
          WATERMARK_Y,
          wmLeftX + wmSpanW,
          WATERMARK_Y,
          [
            [0.0, tokens.watermarkCss],
            [0.84, tokens.watermarkCss],
            [1.0, tokens.watermarkFadeCss || tokens.watermarkCss],
          ],
          tokens.watermarkCss
        );
        ctx.fillText(wmText, wmLeftX, WATERMARK_Y + parY * 0.45, maxWmWidth);
        setLetterSpacingSafe(ctx, '0px');
        ctx.restore();
      }

      /* 4) 切档位瞬间克制辅助动效：雕塑区柔和 ~8% 环境亮度微涌（静止时 effortSwell === 0） */
      if (effortSwell > 0.002 && isAvail) {
        ctx.save();
        setCompositeSafe(ctx, tokens.isLight ? 'source-over' : 'screen');
        var swellAlpha = clamp(effortSwell * (tokens.isLight ? 0.14 : 0.11), 0, 0.18);
        ctx.fillStyle = makeRadialGrad(
          ctx, SCULPT_AURA_CX + parX, SCULPT_AURA_CY + parY, 16,
          SCULPT_AURA_CX + parX, SCULPT_AURA_CY + parY, 340,
          [
            [0.0, tokens.isLight ? rgb01ToCss(tokens.accentRgb, swellAlpha) : rgb01ToCss(tokens.glowRgb, swellAlpha)],
            [0.55, rgb01ToCss(tokens.secRgb, swellAlpha * 0.45)],
            [1.0, 'rgba(0, 0, 0, 0)'],
          ],
          'rgba(0, 0, 0, 0)'
        );
        ctx.fillRect(0, 0, 760, H);
        setCompositeSafe(ctx, 'source-over');
        ctx.restore();
      }

      /* 5) #0 Orch 锁存叠合态：不替换主核玻璃雕塑，仅在雕塑周围柔和叠印星云紫金双环光晕 */
      if (isOrchActive && bgState.auxKind !== 'orchestrator') {
        drawSubtleOrchDualRingAura(ctx, SCULPT_AURA_CX + parX * 0.7, SCULPT_AURA_CY + parY * 0.7, tokens, 1.0);
      }

      ctx.restore();
    }

    /* ============================================================================
     * 6. 右侧 ~58% Google DeepMind 纯净社论级标题栏（x: 656..1548）
     * ============================================================================ */
    function drawEditorialHeroHeader(ctx, info, optic, tokens, upperEnName) {
      var kickerText = resolveEditorialKickerText(info, optic, upperEnName);
      var roleTag = resolveTopRightRoleTag(info, optic, upperEnName);
      var heroTitle = cleanHeroTitle(info);
      var isOrchUnsupported = Boolean(info.orchUnsupported);
      var isOrchActive = Boolean(info.orchLatched && !isOrchUnsupported);
      var isAvail = Boolean(info.isAvailable && !isOrchUnsupported);
      var isLight = tokens.isLight;

      ctx.save();

      /* Row 1 左侧：✦ 星芒微标 + Google DeepMind 无边框高雅大写微题头 */
      var kickerY = 82;
      var starCx = RIGHT_ZONE_X + 13;
      var starGrad = isOrchActive && !tokens.isMono
        ? makeLinearGrad(ctx, starCx - 12, kickerY - 12, starCx + 12, kickerY + 12, [[0, ORCH_VIOLET_HEX], [1, ORCH_GOLD_HEX]], ORCH_VIOLET_HEX)
        : makeLinearGrad(ctx, starCx - 12, kickerY - 12, starCx + 12, kickerY + 12, [[0, tokens.accentCss], [1, tokens.secCss]], tokens.accentCss);
      drawGeminiSparkleGlyph(ctx, starCx, kickerY, 13, starGrad);

      ctx.font = '700 26px ' + MONO_STACK;
      setLetterSpacingSafe(ctx, '0.06em');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isOrchActive && !tokens.isMono
        ? (isLight ? '#4C1D95' : '#EDE9FE')
        : tokens.kickerCss;
      var maxKickerW = RIGHT_ZONE_W - 290;
      var drawnKicker = truncateText(ctx, kickerText, maxKickerW);
      ctx.fillText(drawnKicker, RIGHT_ZONE_X + 36, kickerY + 1);
      setLetterSpacingSafe(ctx, '0px');

      /* Row 1 右上角：轻透精致状态胶囊（保留 DUAL-CORE · +1H / STANDBY 等语义，宽容上限确保零省略号截断） */
      ctx.font = '700 21px ' + MONO_STACK;
      setLetterSpacingSafe(ctx, '0.045em');
      var fitRole = truncateText(ctx, roleTag, 320);
      var roleW = measureTextSafe(ctx, fitRole);
      var pillH = 44;
      var pillW = Math.round(roleW + 48);
      var pillX = RIGHT_ZONE_END - pillW;
      var pillY = kickerY - pillH * 0.5;

      drawRoundRectPath(ctx, pillX, pillY, pillW, pillH, pillH * 0.5);
      if (isOrchActive && !tokens.isMono) {
        ctx.fillStyle = isLight ? 'rgba(139, 92, 246, 0.11)' : 'rgba(139, 92, 246, 0.20)';
      } else {
        ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.055)' : 'rgba(255, 255, 255, 0.08)';
      }
      ctx.fill();

      drawRoundRectPath(ctx, pillX + 0.75, pillY + 0.75, pillW - 1.5, pillH - 1.5, (pillH - 1.5) * 0.5);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = isOrchActive && !tokens.isMono
        ? (isLight ? 'rgba(109, 40, 217, 0.34)' : 'rgba(196, 181, 253, 0.52)')
        : (isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.18)');
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pillX + 19, kickerY, 4.4, 0, TWO_PI);
      ctx.fillStyle = isOrchActive && !tokens.isMono ? ORCH_GOLD_HEX : tokens.accentCss;
      ctx.fill();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isLight ? '#1E293B' : 'rgba(241, 245, 255, 0.92)';
      ctx.fillText(fitRole, pillX + 31, kickerY + 1);
      setLetterSpacingSafe(ctx, '0px');

      /* Row 2 主视觉：高对比大号无衬线标题（Dark 纯白 / Light 深炭墨，零泛灰零截断） */
      setLetterSpacingSafe(ctx, '-0.025em');
      var maxHeroPx = isOrchActive ? 82 : 84;
      var titlePx = fitSingleLineFontSize(ctx, heroTitle, '700', SANS_STACK, maxHeroPx, 64, RIGHT_ZONE_W);
      if (measureTextSafe(ctx, heroTitle) > RIGHT_ZONE_W) {
        titlePx = fitSingleLineFontSize(ctx, heroTitle, '700', SANS_STACK, 62, 44, RIGHT_ZONE_W);
      }
      ctx.font = '700 ' + titlePx + 'px ' + SANS_STACK;
      var finalTitle = truncateText(ctx, heroTitle, RIGHT_ZONE_W);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      if (!isLight && !isOrchUnsupported) {
        setShadow(ctx, 'rgba(0, 0, 0, 0.52)', 12, 0, 3);
      }
      ctx.fillStyle = isOrchUnsupported
        ? tokens.lockedTitleHex
        : (isAvail ? tokens.titleHex : (tokens.standbyTitleHex || tokens.titleHex));
      ctx.fillText(finalTitle, RIGHT_ZONE_X, 186);
      clearShadow(ctx);
      setLetterSpacingSafe(ctx, '0px');

      ctx.restore();
    }

    /* ============================================================================
     * 7. 通透磨砂毛玻璃胶囊档位条 `[ Low | Medium | High | Extra ]`（y: 296..388）
     * ============================================================================ */
    function drawFrostedEffortCapsuleBar(ctx, wellLayout, info, tokens, sliderPos) {
      var wl = wellLayout.well;
      var items = wellLayout.items;
      var n = items.length;
      if (!wl || !n) return;

      var wellX = wl.lx; /* 656 */
      var wellY = wl.ly; /* 296 */
      var wellW = wl.lw; /* 848 -> 1504 */
      var wellH = wl.lh; /* 92 -> 388 */
      var wellR = wl.lr; /* 46 胶囊圆角 */
      var wellCy = wl.cy;
      var innerX = wl.innerX;
      var innerY = wl.innerY;
      var slotW = wl.slotW;
      var blockH = wl.blockH;
      var blockR = wl.blockR;
      var isOrchActive = Boolean(info.orchLatched && !info.orchUnsupported);
      var isLight = tokens.isLight;

      var clampedPos = clamp(sliderPos, 0, Math.max(0, n - 1));
      var nearestIdx = clamp(Math.round(clampedPos), 0, n - 1);
      var activeItem = items[nearestIdx];

      var curBlockBaseX = innerX + clampedPos * slotW;
      var curBlockRightX = curBlockBaseX + slotW;
      var targetLabelPx = n <= 3 ? 42 : (n === 4 ? 38 : 35);

      ctx.save();

      /* 1) 通透磨砂毛玻璃外胶囊底座（Dark 烟熏毛玻璃 / Light 白冰毛玻璃） */
      if (isLight) {
        setShadow(ctx, 'rgba(15, 23, 42, 0.08)', 14, 0, 4);
      } else {
        setShadow(ctx, 'rgba(0, 0, 0, 0.34)', 16, 0, 4);
      }
      drawRoundRectPath(ctx, wellX, wellY, wellW, wellH, wellR);
      ctx.fillStyle = makeLinearGrad(
        ctx, wellX, wellY, wellX, wellY + wellH,
        [
          [0.0, tokens.wellFillTop],
          [1.0, tokens.wellFillBot],
        ],
        tokens.wellFillTop
      );
      ctx.fill();
      clearShadow(ctx);

      drawRoundRectPath(ctx, wellX + 0.75, wellY + 0.75, wellW - 1.5, wellH - 1.5, wellR - 0.75);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = (isOrchActive && !tokens.isMono)
        ? (isLight ? 'rgba(109, 40, 217, 0.26)' : 'rgba(196, 181, 253, 0.32)')
        : tokens.wellOutlineCss;
      ctx.stroke();

      /* 2) 相邻槽位柔和分隔细竖线 `|` 与未激活档位文字 */
      for (var di = 1; di < n; di++) {
        var divX = innerX + di * slotW;
        var touchingActive = divX >= curBlockBaseX - 8 && divX <= curBlockRightX + 8;
        if (!touchingActive) {
          ctx.fillStyle = tokens.wellDividerCss;
          ctx.fillRect(Math.round(divX) - 0.75, Math.round(wellCy - 17), 1.5, 34);
        }
      }

      for (var ii = 0; ii < n; ii++) {
        var it = items[ii];
        var distSlots = Math.abs(clampedPos - ii);
        var slotVis = smoothstep01((distSlots - 0.28) / 0.44);
        if (slotVis <= 0.02) continue;

        var hov = it.hover;
        if (hov > 0.05) {
          ctx.save();
          ctx.globalAlpha = slotVis * (0.45 + 0.55 * hov);
          drawRoundRectPath(ctx, it.slotX + 4, innerY + 2, slotW - 8, blockH - 4, blockR - 2);
          ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.055)' : 'rgba(255, 255, 255, 0.08)';
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = slotVis;
        var slotPx = fitSingleLineFontSize(ctx, it.label, '600', SANS_STACK, targetLabelPx, 32, slotW - 18);
        ctx.font = '600 ' + slotPx + 'px ' + SANS_STACK;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = hov > 0.12 ? tokens.hoverEffortCss : tokens.inactiveEffortCss;
        ctx.fillText(truncateText(ctx, it.label, slotW - 14), it.lcx, wellCy + 1);
        ctx.restore();
      }

      /* 3) 激活档位官方双色渐变水晶毛玻璃滑块胶囊 */
      var actPrs = activeItem ? activeItem.press : 0;
      var pressInset = actPrs * 1.4;
      var bx = curBlockBaseX + pressInset;
      var by = innerY + pressInset * 0.8;
      var bw = Math.max(64, slotW - pressInset * 2);
      var bh = blockH - pressInset * 1.6;
      var br = Math.min(blockR, bh * 0.5);
      var blockCx = bx + bw * 0.5;
      var blockCy = by + bh * 0.5;

      ctx.save();
      setShadow(ctx, tokens.pillGlowCss, 16, 0, 3);
      drawRoundRectPath(ctx, bx, by, bw, bh, br);
      ctx.fillStyle = makeLinearGrad(
        ctx, bx, by, bx + bw, by + bh,
        [
          [0.0, tokens.pillTopHex],
          [1.0, tokens.pillBotHex],
        ],
        tokens.pillTopHex
      );
      ctx.fill();
      clearShadow(ctx);

      /* 顶部玻璃高光微折射层 */
      drawRoundRectPath(ctx, bx, by, bw, bh, br);
      ctx.clip();
      ctx.fillStyle = makeLinearGrad(
        ctx, bx, by, bx, by + bh * 0.52,
        [
          [0.0, 'rgba(255, 255, 255, 0.28)'],
          [1.0, 'rgba(255, 255, 255, 0.0)'],
        ],
        'rgba(255, 255, 255, 0)'
      );
      ctx.fillRect(bx, by, bw, bh * 0.52);

      if (isOrchActive && !tokens.isMono) {
        var eBarW = Math.max(48, bw * 0.52);
        var eBarH = 4.5;
        drawRoundRectPath(ctx, blockCx - eBarW * 0.5, by + bh - 10, eBarW, eBarH, 2.25);
        ctx.fillStyle = makeLinearGrad(
          ctx, blockCx - eBarW * 0.5, by, blockCx + eBarW * 0.5, by,
          [[0, '#DDD6FE'], [0.5, '#FFFFFF'], [1, '#FDE68A']],
          '#FFFFFF'
        );
        ctx.fill();
      }
      ctx.restore();

      drawRoundRectPath(ctx, bx + 0.75, by + 0.75, bw - 1.5, bh - 1.5, Math.max(2, br - 0.75));
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = (isOrchActive && !tokens.isMono)
        ? makeLinearGrad(ctx, bx, by, bx + bw, by + bh, [[0, 'rgba(221, 214, 254, 0.88)'], [1, 'rgba(253, 230, 138, 0.85)']], tokens.pillBorderCss)
        : tokens.pillBorderCss;
      ctx.stroke();

      var actLabel = activeItem ? activeItem.label : '';
      var actPx = fitSingleLineFontSize(ctx, actLabel, '700', SANS_STACK, targetLabelPx, 32, bw - 18);
      ctx.font = '700 ' + actPx + 'px ' + SANS_STACK;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (tokens.pillTextHex === '#FFFFFF') {
        setShadow(ctx, 'rgba(0, 0, 0, 0.34)', 4, 0, 1);
      }
      ctx.fillStyle = tokens.pillTextHex;
      ctx.fillText(truncateText(ctx, actLabel, bw - 14), blockCx, blockCy + (isOrchActive ? -2 : 1));
      clearShadow(ctx);

      ctx.restore();
    }

    /* 单档位、盲键 1s 化学快闪（含原子质量 STANDBY）或 Orchestrator 非编排主核锁定（NON-PLANNER）胶囊 —— 深浅双模通透适配 */
    function drawSingleModeStatusCapsule(ctx, info, tokens, upperEnName) {
      var capX = WELL_X;
      var capY = WELL_Y;
      var capW = WELL_W;
      var capH = WELL_H;
      var capR = 46;
      var capCy = capY + capH * 0.5;
      var isOrchUnsupported = Boolean(info.orchUnsupported);
      var isOrchActive = Boolean(info.orchLatched && !isOrchUnsupported);
      var isAvail = Boolean(info.isAvailable && !isOrchUnsupported);
      var isLight = tokens.isLight;
      var isChemCapsule = Boolean(info.blindFlash || (!isAvail && !isOrchUnsupported && !info.isAuxModel));

      var badgeLabel = 'ADAPTIVE · AUTO REASONING';
      if (info.blindFlash) {
        badgeLabel = formatBlindElementCapsuleLabel(info, upperEnName);
      } else if (isOrchUnsupported) {
        badgeLabel = info.orchUnsupportedLabel ? String(info.orchUnsupportedLabel) : ORCH_NON_PLANNER_LABEL;
      } else if (info.singleModeLabel) {
        badgeLabel = String(info.singleModeLabel).toUpperCase();
      } else if (isOrchActive) {
        badgeLabel = 'ORCH · ADAPTIVE REASONING';
      } else if (!isAvail) {
        if (!info.isAuxModel) {
          badgeLabel = formatBlindElementCapsuleLabel(info, upperEnName);
        } else {
          badgeLabel = hasCjkText(info.unreleasedText) ? 'STANDBY · 未开放副盘槽位' : 'STANDBY · RESERVED MACRO SLOT';
        }
      }

      ctx.save();
      drawRoundRectPath(ctx, capX, capY, capW, capH, capR);
      if (isOrchUnsupported) {
        ctx.fillStyle = isLight ? 'rgba(226, 232, 240, 0.78)' : 'rgba(30, 39, 52, 0.68)';
      } else if (info.blindFlash) {
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.86)' : 'rgba(22, 27, 36, 0.76)';
      } else {
        ctx.fillStyle = makeLinearGrad(ctx, capX, capY, capX, capY + capH, [[0, tokens.wellFillTop], [1, tokens.wellFillBot]], tokens.wellFillTop);
      }
      ctx.fill();

      drawRoundRectPath(ctx, capX + 0.85, capY + 0.85, capW - 1.7, capH - 1.7, capR - 0.85);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = isOrchUnsupported
        ? (isLight ? 'rgba(100, 116, 139, 0.28)' : 'rgba(148, 163, 184, 0.34)')
        : (info.blindFlash
            ? (isLight ? 'rgba(15, 23, 42, 0.20)' : 'rgba(203, 213, 225, 0.36)')
            : tokens.wellOutlineCss);
      ctx.stroke();

      var iconCx = capX + 48;
      if (isOrchUnsupported) {
        drawPadlockVectorGlyph(
          ctx,
          iconCx,
          capCy + 1,
          0.76,
          isLight ? '#475569' : '#CBD5E1',
          isLight ? 'rgba(100, 116, 139, 0.20)' : 'rgba(148, 163, 184, 0.32)',
          isLight ? 'rgba(71, 85, 105, 0.30)' : 'rgba(51, 65, 85, 0.52)',
          isLight ? '#FFFFFF' : '#0F172A'
        );
      } else {
        ctx.beginPath();
        ctx.arc(iconCx, capCy, 7, 0, TWO_PI);
        ctx.fillStyle = (isAvail || info.blindFlash) ? tokens.accentCss : (isLight ? '#475569' : '#CBD5E1');
        ctx.fill();
      }

      var maxCapTxtW = capW - 108;
      var fontFam = isChemCapsule ? MONO_STACK : SANS_STACK;
      var capFontPx = fitSingleLineFontSize(ctx, badgeLabel, '700', fontFam, isChemCapsule ? 31 : 34, 26, maxCapTxtW);
      ctx.font = '700 ' + capFontPx + 'px ' + fontFam;
      setLetterSpacingSafe(ctx, '0.025em');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isOrchUnsupported
        ? (isLight ? '#475569' : '#B8C5D9')
        : (isLight ? '#0F172A' : '#F8FAFC');
      ctx.fillText(truncateText(ctx, badgeLabel, maxCapTxtW), iconCx + 28, capCy + 1);
      setLetterSpacingSafe(ctx, '0px');
      ctx.restore();
    }

    /* 细腻光学玻璃表面微掠光（静止态 0 白雾污染防止浅色屏竖切泛白，动态指针扫掠由 GPU SCREEN_FS 及显式视差实时响应） */
    function drawEditorialGlassSheenOverlay(ctx, W, H, isLight, orbitYaw, orbitPitch, pointerSweepX) {
      ctx.save();
      var hasExplicitSweep = typeof pointerSweepX === 'number' && isFinite(pointerSweepX);
      var hasOrbitMotion = Math.abs(Number(orbitYaw) || 0) > 0.008 || Math.abs(Number(orbitPitch) || 0) > 0.008;
      if (hasExplicitSweep || hasOrbitMotion) {
        var yawShift = clamp((Number(orbitYaw) || 0) * 180, -140, 140);
        var pitchShift = clamp((Number(orbitPitch) || 0) * 80, -60, 60);
        var ptrShift = hasExplicitSweep ? clamp((pointerSweepX - 0.5) * 640, -320, 320) : 0;
        var totalShiftX = yawShift + ptrShift;

        ctx.fillStyle = makeLinearGrad(
          ctx, 260 + totalShiftX, -60 + pitchShift, 780 + totalShiftX, H + 80 + pitchShift,
          [
            [0.0, 'rgba(255, 255, 255, 0)'],
            [0.44, isLight ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.018)'],
            [0.50, isLight ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.052)'],
            [0.56, isLight ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.016)'],
            [1.0, 'rgba(255, 255, 255, 0)'],
          ],
          'rgba(255, 255, 255, 0)'
        );
        ctx.fillRect(0, 0, W, H);
      }

      ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, W - 2, H - 2);
      ctx.restore();
    }

    /* ============================================================================
     * 8. V14.1 按需共享海报解码池（支持 120ms 长按静默预热 + 90s 空闲自动瘦身回收 + 0 冷启动解码）
     * ============================================================================ */
    var sharedPoolsByRoot = typeof WeakMap === 'function' ? new WeakMap() : null;
    var fallbackSharedPool = null;

    function getSharedPoolForRoot(runtimeRoot) {
      var keyObj = (runtimeRoot && typeof runtimeRoot === 'object') ? runtimeRoot : null;
      if (sharedPoolsByRoot && keyObj) {
        var existing = sharedPoolsByRoot.get(keyObj);
        if (!existing) {
          existing = {
            entries: new Map(),
            frosted: new Map(),
            listeners: new Set(),
          };
          sharedPoolsByRoot.set(keyObj, existing);
        }
        return existing;
      }
      if (!fallbackSharedPool) {
        fallbackSharedPool = {
          entries: new Map(),
          frosted: new Map(),
          listeners: new Set(),
        };
      }
      return fallbackSharedPool;
    }

    function resolveImageConstructorForRoot(rt) {
      if (rt && typeof rt.Image === 'function') return rt.Image;
      if (typeof Image === 'function') return Image;
      return null;
    }

    function requestPoolWallpaperEntry(runtimeRoot, pool, modeTag, keyId, wallpapersDict) {
      if (!pool || !wallpapersDict) return null;
      var keyStr = String(keyId);
      var src = wallpapersDict[keyId] || wallpapersDict[keyStr];
      if (typeof src !== 'string' || !src) return null;

      var cacheKey = modeTag + ':' + keyStr;
      var existing = pool.entries.get(cacheKey);
      if (existing && existing.src === src && !existing.disposed) {
        return existing;
      }

      var ImgCtor = resolveImageConstructorForRoot(runtimeRoot);
      if (!ImgCtor) return null;

      if (pool.entries.size >= MAX_WALLPAPER_CACHE) {
        var oldestKey = pool.entries.keys().next().value;
        var oldEntry = pool.entries.get(oldestKey);
        if (oldEntry && oldEntry.img) {
          oldEntry.img.onload = null;
          oldEntry.img.onerror = null;
        }
        pool.entries.delete(oldestKey);
      }

      var entry = {
        z: Number(keyId) || 0,
        key: keyStr,
        mode: modeTag,
        src: src,
        img: null,
        ready: false,
        failed: false,
        disposed: false,
      };

      try {
        var img = new ImgCtor();
        entry.img = img;
        img.onload = function () {
          if (entry.disposed) return;
          entry.ready = true;
          pool.listeners.forEach(function (fn) {
            try {
              fn({ z: entry.z, key: entry.key, mode: entry.mode });
            } catch (_cbErr) {}
          });
        };
        img.onerror = function () {
          if (entry.disposed) return;
          entry.failed = true;
        };
        img.src = src;
        if (img.complete && (img.naturalWidth > 0 || img.width > 0)) {
          entry.ready = true;
        }
      } catch (_imgErr) {
        entry.failed = true;
      }

      pool.entries.set(cacheKey, entry);
      return entry;
    }

    function prewarmOledWallpaper(runtimeRoot, modeTag, keyId) {
      var rt = runtimeRoot || (typeof window !== 'undefined' ? window : moduleRoot);
      var grainPkg = resolveGrainAssetsPackage(rt);
      if (!grainPkg) return false;
      var mTag = modeTag === 'light' ? 'light' : 'dark';
      var kId = keyId ? String(keyId) : '6';
      var dict = mTag === 'light'
        ? (grainPkg.OLED_WALLPAPERS_LIGHT || grainPkg.OLED_WALLPAPERS)
        : grainPkg.OLED_WALLPAPERS;
      if (!dict) return false;
      var pool = getSharedPoolForRoot(rt);
      var ent = requestPoolWallpaperEntry(rt, pool, mTag, kId, dict);
      return Boolean(ent && ent.img);
    }

    function evictIdleOledWallpapers(runtimeRoot) {
      var rt = runtimeRoot || (typeof window !== 'undefined' ? window : moduleRoot);
      var pool = getSharedPoolForRoot(rt);
      if (!pool) return 0;
      var count = pool.entries.size;
      pool.entries.forEach(function (entry) {
        if (!entry) return;
        entry.disposed = true;
        if (entry.img) {
          entry.img.onload = null;
          entry.img.onerror = null;
          try {
            entry.img.src = '';
          } catch (_e) {}
          entry.img = null;
        }
      });
      pool.entries.clear();
      pool.frosted.forEach(function (cv) {
        if (cv) {
          try {
            cv.width = 0;
            cv.height = 0;
          } catch (_e2) {}
        }
      });
      pool.frosted.clear();
      return count;
    }

    function getCachedOledWallpaperCount(runtimeRoot) {
      var rt = runtimeRoot || (typeof window !== 'undefined' ? window : moduleRoot);
      var pool = getSharedPoolForRoot(rt);
      return pool ? pool.entries.size : 0;
    }

    /* ============================================================================
     * 9. 主工厂函数 createOledScreenPainter
     * ============================================================================ */
    function createOledScreenPainter(options) {
      var opts = options || {};
      var width = Math.max(320, Math.round(Number(opts.width) || DEFAULT_WIDTH));
      var height = Math.max(120, Math.round(Number(opts.height) || DEFAULT_HEIGHT));
      var root = opts.root || (typeof window !== 'undefined' ? window : moduleRoot);
      var doc = opts.doc || (root && root.document) || (typeof document !== 'undefined' ? document : null);
      var onAsyncAssetReady = typeof opts.onAsyncAssetReady === 'function' ? opts.onAsyncAssetReady : null;
      var useLazySharedPool = Boolean(opts.lazyWallpapers === true);
      var isRealBrowserDom = Boolean(root && typeof root.HTMLElement === 'function');

      var surf = createOffscreenSurface(doc, opts.canvas || null, width, height);
      var disposed = false;

      var sharedPool = useLazySharedPool ? getSharedPoolForRoot(root) : null;
      var wallpaperCache = new Map();
      var localFrostedCache = new Map();

      var sharedListener = null;
      if (sharedPool && onAsyncAssetReady) {
        sharedListener = function (meta) {
          if (!disposed) {
            onAsyncAssetReady(meta);
          }
        };
        sharedPool.listeners.add(sharedListener);
      }

      /* 200ms 跨模型 / 跨深浅主题柔焦视差叠化状态机 */
      var currentBgState = null;
      var fromBgState = null;
      var fadeStartMs = 0;
      var fadeUsesCustomClock = false;
      var crossFadeActive = false;

      /* 220ms 毛玻璃胶囊滑块阻尼平移 + ~8% 环境亮度微涌状态机 */
      var sliderTrackIdentity = '';
      var sliderCurrentPos = 0;
      var sliderFromPos = 0;
      var sliderTargetIdx = 0;
      var sliderStartMs = 0;
      var sliderUsesCustomClock = false;
      var sliderAnimActive = false;
      var wasDraggingSlider = false;

      var lastDeckInfo = null;
      var lastThemeProfile = null;
      var lastBlendState = null;

      function readPainterClockMs() {
        if (root && root.performance && typeof root.performance.now === 'function') {
          return root.performance.now();
        }
        if (root && root.Date && typeof root.Date.now === 'function') {
          return root.Date.now();
        }
        return runtimeNowMs();
      }

      function getImageConstructor() {
        return resolveImageConstructorForRoot(root);
      }

      function getFrostedSurfaceForKey(modeTag, keyId, wpEntry, isLight) {
        if (disposed || !wpEntry || !wpEntry.img) return null;
        var fKey = modeTag + ':' + String(keyId);
        var targetMap = sharedPool ? sharedPool.frosted : localFrostedCache;
        var cachedCv = targetMap.get(fKey);
        if (cachedCv && cachedCv.width > 0) return cachedCv;
        if (targetMap.size >= 16) {
          var firstK = targetMap.keys().next().value;
          var oldCv = targetMap.get(firstK);
          if (oldCv) {
            try {
              oldCv.width = 0;
              oldCv.height = 0;
            } catch (_e) {}
          }
          targetMap.delete(firstK);
        }
        var built = buildFrostedDownsampleCanvas(doc, wpEntry, isLight);
        if (built) {
          targetMap.set(fKey, built);
        }
        return built;
      }

      function requestWallpaperEntry(modeTag, keyId, wallpapersDict) {
        if (disposed || !wallpapersDict) return null;
        if (sharedPool) {
          return requestPoolWallpaperEntry(root, sharedPool, modeTag, keyId, wallpapersDict);
        }
        var keyStr = String(keyId);
        var src = wallpapersDict[keyId] || wallpapersDict[keyStr];
        if (typeof src !== 'string' || !src) return null;

        var cacheKey = modeTag + ':' + keyStr;
        var existing = wallpaperCache.get(cacheKey);
        if (existing && existing.src === src) {
          return existing;
        }

        var ImgCtor = getImageConstructor();
        if (!ImgCtor) return null;

        if (wallpaperCache.size >= MAX_WALLPAPER_CACHE) {
          var oldestKey = wallpaperCache.keys().next().value;
          var oldEntry = wallpaperCache.get(oldestKey);
          if (oldEntry && oldEntry.img) {
            oldEntry.img.onload = null;
            oldEntry.img.onerror = null;
          }
          wallpaperCache.delete(oldestKey);
        }

        var entry = {
          z: Number(keyId) || 0,
          key: keyStr,
          mode: modeTag,
          src: src,
          img: null,
          ready: false,
          failed: false,
        };

        try {
          var img = new ImgCtor();
          entry.img = img;
          img.onload = function () {
            if (disposed) return;
            entry.ready = true;
            if (onAsyncAssetReady) {
              try {
                onAsyncAssetReady({ z: entry.z, key: entry.key, mode: entry.mode });
              } catch (_cbErr) {}
            }
          };
          img.onerror = function () {
            if (disposed) return;
            entry.failed = true;
          };
          img.src = src;
          if (img.complete && (img.naturalWidth > 0 || img.width > 0)) {
            entry.ready = true;
          }
        } catch (_imgErr) {
          entry.failed = true;
        }

        wallpaperCache.set(cacheKey, entry);
        return entry;
      }

      function preloadAllWallpapers(grainPkg) {
        if (disposed || !grainPkg || useLazySharedPool) return;
        var darkDict = grainPkg.OLED_WALLPAPERS || null;
        var lightDict = grainPkg.OLED_WALLPAPERS_LIGHT || null;
        for (var i = 0; i < ALL_WALLPAPER_KEYS.length; i++) {
          var k = ALL_WALLPAPER_KEYS[i];
          if (darkDict && darkDict[k]) requestWallpaperEntry('dark', k, darkDict);
          if (lightDict && lightDict[k]) requestWallpaperEntry('light', k, lightDict);
        }
      }

      if (!useLazySharedPool) {
        preloadAllWallpapers(resolveGrainAssetsPackage(root));
      }

      function normalizeDeckInfo(raw) {
        var d = raw || {};
        var isAux = Boolean(d.isAuxModel || d.auxId);
        var auxKind = isAux ? detectAuxKind(d) : '';
        var z = Number(d.z) || 6;
        var orchLatched = Boolean(d.orchLatched);
        var orchUnsupported = Boolean(d.orchUnsupported);
        var isAvail = d.isAvailable !== false && !orchUnsupported;
        return {
          z: z,
          isAuxModel: isAux,
          auxId: d.auxId ? String(d.auxId) : '',
          auxKind: auxKind,
          orchLatched: orchLatched,
          orchUnsupported: orchUnsupported,
          orchUnsupportedLabel: d.orchUnsupportedLabel ? String(d.orchUnsupportedLabel) : '',
          badgeText: d.badgeText ? String(d.badgeText) : (d.badgeCode ? String(d.badgeCode) : ''),
          tierTag: d.tierTag ? String(d.tierTag) : (d.roleBadge ? String(d.roleBadge) : ''),
          singleModeLabel: d.singleModeLabel ? String(d.singleModeLabel) : '',
          accentHex: typeof d.accentHex === 'string' ? d.accentHex : '',
          secondaryHex: typeof d.secondaryHex === 'string' ? d.secondaryHex : '',
          continuousGlow: Boolean(d.continuousGlow === true),
          numLabel: d.numLabel !== undefined && d.numLabel !== '' ? String(d.numLabel) : String(z),
          groupCode: String(d.groupCode || 'G14'),
          symbol: String(d.symbol || 'C'),
          elementEn: d.elementEn ? String(d.elementEn) : '',
          mass: d.mass !== undefined && d.mass !== null && String(d.mass).trim() !== ''
            ? String(d.mass).trim()
            : (isAux ? '' : (STANDARD_ATOMIC_MASS_BY_Z[z] || '')),
          title: String(d.title || (isAux ? 'Orchestrator' : 'Gemini 4 Carbon')),
          subtitle: String(d.subtitle || ''),
          chemLabel: String(d.chemLabel || (z + ' ' + (d.symbol || 'C'))),
          sessionBanner: d.sessionBanner ? String(d.sessionBanner) : '',
          isAvailable: isAvail,
          blindFlash: Boolean(d.blindFlash),
          blindFlashBanner: d.blindFlashBanner ? String(d.blindFlashBanner) : '',
          unreleasedText: String(d.unreleasedText || 'Unreleased · Locked Keycap'),
          effortTitle: String(d.effortTitle || 'Thinking Level'),
          levels: isAvail && Array.isArray(d.levels) ? d.levels : [],
          hoveredEffort: d.hoveredEffort ? String(d.hoveredEffort) : '',
          pressedEffort: d.pressedEffort ? String(d.pressedEffort) : '',
          dragEffortProgress: typeof d.dragEffortProgress === 'number' ? d.dragEffortProgress : undefined,
        };
      }

      function resolveRenderCallArgs(arg2, arg3, arg4) {
        var tp = null;
        var bs = {};
        var explicitNow = undefined;

        if (typeof arg4 === 'number' && isFinite(arg4)) {
          tp = arg2 && typeof arg2 === 'object' ? arg2 : null;
          bs = arg3 && typeof arg3 === 'object' ? arg3 : {};
          explicitNow = arg4;
        } else if (typeof arg3 === 'number' && isFinite(arg3)) {
          bs = arg2 && typeof arg2 === 'object' ? arg2 : {};
          if (bs.themeProfile && typeof bs.themeProfile === 'object') {
            tp = bs.themeProfile;
          } else if ('isLight' in bs || 'id' in bs || 'isMono' in bs) {
            tp = bs;
          } else {
            tp = lastThemeProfile;
          }
          explicitNow = arg3;
        } else {
          var o2 = arg2 && typeof arg2 === 'object' ? arg2 : null;
          var o3 = arg3 && typeof arg3 === 'object' ? arg3 : null;
          if (o3) {
            tp = o2;
            bs = o3;
          } else if (
            o2 &&
            ('orbitYaw' in o2 ||
              'orbitPitch' in o2 ||
              'effortHover' in o2 ||
              'effortPress' in o2 ||
              'crossFadeAlpha' in o2 ||
              (typeof o2.now === 'number' && !('isLight' in o2) && !('id' in o2)))
          ) {
            bs = o2;
            tp = (o2.themeProfile && typeof o2.themeProfile === 'object') ? o2.themeProfile : lastThemeProfile;
          } else {
            tp = o2;
            bs = {};
          }
          if (typeof bs.now === 'number' && isFinite(bs.now)) {
            explicitNow = bs.now;
          }
        }

        if (tp && typeof tp === 'object') {
          lastThemeProfile = tp;
        }
        return {
          tp: tp || lastThemeProfile || {},
          bs: bs || {},
          explicitNow: explicitNow,
        };
      }

      function render(deckInfo, arg2, arg3, arg4) {
        if (disposed) return null;

        var parsed = resolveRenderCallArgs(arg2, arg3, arg4);
        var info = normalizeDeckInfo(deckInfo);
        var tp = parsed.tp;
        var bs = parsed.bs;
        var reducedMotion = Boolean(bs.reducedMotion || tp.reducedMotion);

        lastDeckInfo = info;
        lastBlendState = bs;

        var grainPkg = resolveGrainAssetsPackage(root);
        if (!useLazySharedPool) {
          preloadAllWallpapers(grainPkg);
        }

        var optic = deriveOpticProfile(info);
        var tokens = resolveBannerTokens(tp, optic, info);

        var rawYaw = bs.orbitYaw !== undefined ? bs.orbitYaw : (bs.chassisYaw !== undefined ? bs.chassisYaw : bs.yaw);
        var rawPitch = bs.orbitPitch !== undefined ? bs.orbitPitch : (bs.chassisPitch !== undefined ? bs.chassisPitch : bs.pitch);
        var orbitYaw = typeof rawYaw === 'number' && isFinite(rawYaw) ? clamp(rawYaw, -1.35, 1.35) : 0;
        var orbitPitch = typeof rawPitch === 'number' && isFinite(rawPitch) ? clamp(rawPitch, -1.15, 1.15) : 0;
        var pointerSweepX = typeof bs.pointerNormX === 'number' ? bs.pointerNormX : undefined;

        var hasCustomNow = typeof parsed.explicitNow === 'number' && isFinite(parsed.explicitNow);
        var now = hasCustomNow ? parsed.explicitNow : readPainterClockMs();

        var LW = DEFAULT_WIDTH;
        var LH = DEFAULT_HEIGHT;
        var wellLayout = computeQuartzFaderWellLayout(LW, LH, info.levels, info, bs);
        var nLevels = wellLayout.items.length;

        var modelIdentity = info.isAuxModel
          ? ('aux:' + info.auxKind + ':' + (info.auxId || info.badgeText || info.title))
          : ('elem:' + info.z);

        /* 1) 220ms 毛玻璃滑块弹簧与 ~8% 切档辉度微涌包络 */
        var effortSwell = 0;
        if (nLevels > 0) {
          var nextTrackId = modelIdentity + ':' + nLevels;
          var targetIdx = wellLayout.activeIndex;
          var rawDrag = typeof bs.dragEffortProgress === 'number' && isFinite(bs.dragEffortProgress)
            ? bs.dragEffortProgress
            : info.dragEffortProgress;
          var hasDragProg = typeof rawDrag === 'number' && isFinite(rawDrag);

          if (hasDragProg) {
            sliderTrackIdentity = nextTrackId;
            sliderCurrentPos = clamp(rawDrag, 0, 1) * Math.max(0, nLevels - 1);
            sliderTargetIdx = targetIdx;
            sliderAnimActive = false;
            wasDraggingSlider = true;
          } else if (sliderTrackIdentity !== nextTrackId) {
            sliderTrackIdentity = nextTrackId;
            sliderCurrentPos = targetIdx;
            sliderFromPos = targetIdx;
            sliderTargetIdx = targetIdx;
            sliderAnimActive = false;
            wasDraggingSlider = false;
          } else if (wasDraggingSlider) {
            wasDraggingSlider = false;
            sliderTargetIdx = targetIdx;
            if (reducedMotion || Math.abs(sliderCurrentPos - targetIdx) < 0.004) {
              sliderCurrentPos = targetIdx;
              sliderAnimActive = false;
            } else {
              sliderFromPos = sliderCurrentPos;
              sliderStartMs = now;
              sliderUsesCustomClock = hasCustomNow;
              sliderAnimActive = true;
            }
          } else if (targetIdx !== sliderTargetIdx) {
            if (reducedMotion) {
              sliderCurrentPos = targetIdx;
              sliderFromPos = targetIdx;
              sliderTargetIdx = targetIdx;
              sliderAnimActive = false;
            } else {
              sliderFromPos = sliderCurrentPos;
              sliderTargetIdx = targetIdx;
              sliderStartMs = now;
              sliderUsesCustomClock = hasCustomNow;
              sliderAnimActive = true;
            }
          }

          if (sliderAnimActive) {
            var sElapsed = Math.max(0, now - sliderStartMs);
            if (sElapsed >= SLIDER_DURATION_MS) {
              sliderCurrentPos = sliderTargetIdx;
              sliderAnimActive = false;
            } else {
              var sNorm = clamp(sElapsed / SLIDER_DURATION_MS, 0, 1);
              var sp = easeOutCrystalFader(sNorm);
              sliderCurrentPos = sliderFromPos + (sliderTargetIdx - sliderFromPos) * sp;
              effortSwell = Math.sin(sNorm * Math.PI);
            }
          } else if (!hasDragProg) {
            sliderCurrentPos = sliderTargetIdx;
          }
        } else {
          sliderTrackIdentity = '';
          sliderAnimActive = false;
          wasDraggingSlider = false;
        }

        computeContinuousEffortEnergy(info.levels, sliderCurrentPos, bs.effortEnergy);

        /* 2) 200ms 跨模型 / 跨深浅主题柔焦视差叠化状态机 */
        var stateModeTag = info.orchUnsupported
          ? ('orch-locked:' + modelIdentity)
          : (info.isAvailable
              ? ((info.orchLatched ? 'orch-avail:' : 'avail:') + modelIdentity)
              : ((info.blindFlash ? 'chem-flash:' : 'locked:') + optic.sculptKey + ':' + modelIdentity));
        var nextBgKey =
          tokens.themeKey +
          (tokens.isMono ? ':mono:' : ':color:') +
          stateModeTag;

        var rawGenWm = String(info.badgeText || info.symbol || 'Ax').trim().slice(0, 2);
        var normGenWm = /^[A-Za-z]{2}$/.test(rawGenWm)
          ? (rawGenWm.charAt(0).toUpperCase() + rawGenWm.charAt(1).toLowerCase())
          : rawGenWm;
        var watermarkGlyph = info.isAuxModel
          ? (info.auxKind === 'claude'
              ? (/sonnet/i.test(info.title) ? 'Sn' : (/opus/i.test(info.title) ? 'Op' : 'Cl'))
              : info.auxKind === 'generic'
              ? (normGenWm || 'Ax')
              : (optic.watermark || 'Or'))
          : String(info.symbol || optic.watermark || 'C').slice(0, 3);

        var nextBgObj = {
          key: nextBgKey,
          z: info.z,
          isAuxModel: info.isAuxModel,
          auxKind: info.auxKind,
          watermark: watermarkGlyph,
          isAvailable: info.isAvailable,
          blindFlash: info.blindFlash,
          orchLatched: info.orchLatched,
          orchUnsupported: info.orchUnsupported,
          tokens: tokens,
          requestWp: requestWallpaperEntry,
          getFrostedSurface: getFrostedSurfaceForKey,
          preferOffscreenBlur: Boolean(bs.forceOffscreenBlur),
        };

        if (!currentBgState) {
          currentBgState = nextBgObj;
          fromBgState = null;
          crossFadeActive = false;
        } else if (currentBgState.key !== nextBgKey) {
          if (reducedMotion) {
            currentBgState = nextBgObj;
            fromBgState = null;
            crossFadeActive = false;
          } else {
            fromBgState = currentBgState;
            currentBgState = nextBgObj;
            fadeStartMs = now;
            fadeUsesCustomClock = hasCustomNow;
            crossFadeActive = true;
          }
        } else {
          currentBgState.tokens = tokens;
          currentBgState.watermark = watermarkGlyph;
          currentBgState.blindFlash = info.blindFlash;
          currentBgState.orchLatched = info.orchLatched;
          currentBgState.orchUnsupported = info.orchUnsupported;
        }

        var fadeAlpha = 1.0;
        if (typeof bs.crossFadeAlpha === 'number') {
          fadeAlpha = clamp(bs.crossFadeAlpha, 0, 1);
        } else if (crossFadeActive && fromBgState) {
          var elapsed = Math.max(0, now - fadeStartMs);
          if (elapsed >= FADE_DURATION_MS) {
            fadeAlpha = 1.0;
            crossFadeActive = false;
            fromBgState = null;
          } else {
            fadeAlpha = easeOutCubic(elapsed / FADE_DURATION_MS);
          }
        }

        if (!surf || !surf.ctx) {
          return null;
        }

        var ctx = surf.ctx;
        var sx = width / DEFAULT_WIDTH;
        var sy = height / DEFAULT_HEIGHT;

        ctx.save();
        if (sx !== 1 || sy !== 1) {
          ctx.scale(sx, sy);
        }
        setCompositeSafe(ctx, 'source-over');
        ctx.globalAlpha = 1.0;

        /* Layer 1: 满幅深浅官方海报底图（切模型/深浅时带 14px 优雅水平视差滑移） */
        if (crossFadeActive && fromBgState && fadeAlpha < 0.999) {
          drawFullBleedBannerLayer(ctx, LW, LH, fromBgState, grainPkg, 1.0, -14 * fadeAlpha, orbitYaw, orbitPitch, 0);
          drawFullBleedBannerLayer(ctx, LW, LH, currentBgState, grainPkg, fadeAlpha, 14 * (1.0 - fadeAlpha), orbitYaw, orbitPitch, effortSwell);
        } else {
          drawFullBleedBannerLayer(ctx, LW, LH, currentBgState, grainPkg, 1.0, 0, orbitYaw, orbitPitch, effortSwell);
        }

        var upperEnName = extractElementUpperName(info);

        /* Layer 2: 右侧社论级微标 + 主标题 + 毛玻璃胶囊档位条 / 状态胶囊（左区玻璃雕塑 100% 净空无圆形锁贴纸） */
        drawEditorialHeroHeader(ctx, info, optic, tokens, upperEnName);

        if (info.blindFlash) {
          drawSingleModeStatusCapsule(ctx, info, tokens, upperEnName);
        } else if (!info.orchUnsupported && info.isAvailable && wellLayout.well && nLevels > 1) {
          drawFrostedEffortCapsuleBar(ctx, wellLayout, info, tokens, sliderCurrentPos);
        } else {
          drawSingleModeStatusCapsule(ctx, info, tokens, upperEnName);
        }

        /* Layer 3: 清透斜向玻璃镜面微掠光（零黑色扫描网，完美还原白昼明亮色泽） */
        drawEditorialGlassSheenOverlay(ctx, LW, LH, tokens.isLight, orbitYaw, orbitPitch, pointerSweepX);

        ctx.restore();
        return surf.canvas;
      }

      function getEffortUvRects(levelsOrDeckInfo) {
        if (disposed) return [];
        var rawLevels = null;
        var refDeck = lastDeckInfo;

        if (Array.isArray(levelsOrDeckInfo)) {
          rawLevels = levelsOrDeckInfo;
        } else if (levelsOrDeckInfo && typeof levelsOrDeckInfo === 'object') {
          if (levelsOrDeckInfo.isAvailable === false || levelsOrDeckInfo.orchUnsupported) return [];
          rawLevels = Array.isArray(levelsOrDeckInfo.levels) ? levelsOrDeckInfo.levels : [];
          refDeck = levelsOrDeckInfo;
        } else if (lastDeckInfo) {
          if (lastDeckInfo.isAvailable === false || lastDeckInfo.orchUnsupported) return [];
          rawLevels = lastDeckInfo.levels;
        }

        if (!Array.isArray(rawLevels) || !rawLevels.length) return [];
        return computeQuartzFaderWellLayout(width, height, rawLevels, refDeck, lastBlendState).items;
      }

      function isAnimating(nowOverride) {
        if (disposed) return false;
        var hasNow = typeof nowOverride === 'number' && !isNaN(nowOverride);

        var fadeRunning = false;
        if (crossFadeActive && fromBgState) {
          if (hasNow) {
            fadeRunning = nowOverride - fadeStartMs < FADE_DURATION_MS;
          } else if (!fadeUsesCustomClock) {
            if (readPainterClockMs() - fadeStartMs > ANIM_STALE_GUARD_MS) {
              crossFadeActive = false;
              fromBgState = null;
            } else {
              fadeRunning = true;
            }
          } else {
            fadeRunning = true;
          }
        }

        var sliderRunning = false;
        if (sliderAnimActive) {
          if (hasNow) {
            sliderRunning = nowOverride - sliderStartMs < SLIDER_DURATION_MS;
          } else if (!sliderUsesCustomClock) {
            if (readPainterClockMs() - sliderStartMs > ANIM_STALE_GUARD_MS) {
              sliderAnimActive = false;
              sliderCurrentPos = sliderTargetIdx;
            } else {
              sliderRunning = true;
            }
          } else {
            sliderRunning = true;
          }
        }

        var continuous = Boolean(
          lastDeckInfo &&
          lastDeckInfo.continuousGlow === true &&
          !(lastBlendState && lastBlendState.reducedMotion)
        );

        return Boolean(fadeRunning || sliderRunning || continuous);
      }

      function getCanvas() {
        return !disposed && surf ? surf.canvas : null;
      }

      function dispose() {
        if (disposed) return;
        disposed = true;
        crossFadeActive = false;
        sliderAnimActive = false;
        wasDraggingSlider = false;
        sliderTrackIdentity = '';
        currentBgState = null;
        fromBgState = null;
        lastDeckInfo = null;
        lastThemeProfile = null;
        lastBlendState = null;

        if (sharedPool && sharedListener) {
          sharedPool.listeners.delete(sharedListener);
          sharedListener = null;
        }

        wallpaperCache.forEach(function (entry) {
          if (entry && entry.img) {
            entry.img.onload = null;
            entry.img.onerror = null;
          }
        });
        wallpaperCache.clear();
        localFrostedCache.forEach(function (cv) {
          if (cv) {
            try {
              cv.width = 0;
              cv.height = 0;
            } catch (_e) {}
          }
        });
        localFrostedCache.clear();

        if (surf) {
          if (surf.owned && surf.canvas) {
            try {
              surf.canvas.width = 0;
              surf.canvas.height = 0;
            } catch (_e) {}
          }
          surf.ctx = null;
          surf.canvas = null;
          surf = null;
        }
      }

      return {
        width: width,
        height: height,
        get canvas() {
          return !disposed && surf ? surf.canvas : null;
        },
        getCanvas: getCanvas,
        render: render,
        getEffortUvRects: getEffortUvRects,
        isAnimating: isAnimating,
        dispose: dispose,
      };
    }

    return {
      createOledScreenPainter: createOledScreenPainter,
      prewarmOledWallpaper: prewarmOledWallpaper,
      evictIdleOledWallpapers: evictIdleOledWallpapers,
      getCachedOledWallpaperCount: getCachedOledWallpaperCount,
    };
  }
);
