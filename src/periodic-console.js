/*!
 * PRISM-118 · Periodic Console — Interactive WebGL2 Console Controller
 * Copyright (c) 2026 RMvdesi (https://github.com/RMvdesi). All Rights Reserved.
 * Original Design for Obsidian Prism (https://github.com/RMvdesi/obsidian-prism)
 *
 * Public Standard SDK Contract:
 *   PrismPeriodicConsole.mount(options) / PrismPeriodicConsole.createPeriodicConsole(options)
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module && typeof module.exports === 'object') { module.exports = api; }
  if (root && typeof root === 'object') { root.PrismPeriodicConsole = api; }
  if (typeof globalThis === 'object' && globalThis) { globalThis.PrismPeriodicConsole = api; }
  if (typeof window === 'object' && window) { window.PrismPeriodicConsole = api; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (moduleRoot) {
    'use strict';

    function loadSiblingModule(globalKey, relPath) {
      var found =
        (moduleRoot && moduleRoot[globalKey]) ||
        (typeof globalThis !== 'undefined' && globalThis && globalThis[globalKey]) ||
        (typeof window !== 'undefined' && window && window[globalKey]) ||
        null;
      if (found) return found;
      if (typeof require === 'function') {
        try { return require(relPath); } catch (e) {}
      }
      return null;
    }

    var catalog = loadSiblingModule('PrismPeriodicCatalog', './model-catalog.js');
    var audioFx = loadSiblingModule('PrismPeriodicAudioFx', './audio-fx.js');
    var bentoUi = loadSiblingModule('PrismPeriodicBentoUI', './bento-ui.js');
    if (!catalog || !audioFx || !bentoUi) {
      throw new Error('PrismPeriodicConsole requires model-catalog.js, audio-fx.js, and bento-ui.js to be loaded first.');
    }

    var STYLE_ID = bentoUi.STYLE_ID || 'prism-periodic-console-css';
    var ROOT_ID = bentoUi.ROOT_ID || 'prism-periodic-console-root';
    var ROOT_MARKER_ATTR = bentoUi.ROOT_MARKER_ATTR || 'data-prism-periodic-console';
    var MUTE_STORAGE_KEY = audioFx.MUTE_STORAGE_KEY || 'prism_periodic_console_muted';
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


    function normalizePerformanceMode(rawMode) {
      var norm = String(rawMode || '').trim().toLowerCase();
      return norm === 'performance' || norm === 'eco' ? 'performance' : 'balanced';
    }

    /* Delegated Catalog Bindings (src/model-catalog.js) */
    var EFFORT_ORDER = catalog.EFFORT_ORDER;
    var EFFORT_NORM_MAP = catalog.EFFORT_NORM_MAP;
    var EFFORT_LABELS = catalog.EFFORT_LABELS;
    var MODEL_TRIGGER_TEXT_RE = catalog.MODEL_TRIGGER_TEXT_RE;
    var EXCLUDED_FAMILY_RE = catalog.EXCLUDED_FAMILY_RE;
    var ELEMENTS_90 = catalog.ELEMENTS_90;
    var SLOT_BY_Z = catalog.SLOT_BY_Z;
    var ELEMENT_BY_NAME = catalog.ELEMENT_BY_NAME;
    var GROUP_META = catalog.GROUP_META;
    var ELEMENT_LORE = catalog.ELEMENT_LORE;
    var ELEMENT_SPEC_PROFILES = catalog.ELEMENT_SPEC_PROFILES;
    var AUX_MODEL_PRESETS = catalog.AUX_MODEL_PRESETS;
    var BENCHMARK_SOURCE_CITATION = catalog.BENCHMARK_SOURCE_CITATION;
    var BENCHMARK_SOURCE_CITATION_SHORT = catalog.BENCHMARK_SOURCE_CITATION_SHORT;
    var RADAR_AXES = catalog.RADAR_AXES;
    var BENCHMARK_2026Q4_DB = catalog.BENCHMARK_2026Q4_DB;
    var CORE_FOUR_ELEMENTS = catalog.CORE_FOUR_ELEMENTS;
    var HUD_GEM_STYLES = catalog.HUD_GEM_STYLES;
    var normalizeZhEffortWord = catalog.normalizeZhEffortWord;
    var normalizeEnEffortWord = catalog.normalizeEnEffortWord;
    var stripEffortSuffixFromLabel = catalog.stripEffortSuffixFromLabel;
    var parseElementModelLabel = catalog.parseElementModelLabel;
    var matchGoogleElementModels = catalog.matchGoogleElementModels;
    var resolveBenchmarkMetrics = catalog.resolveBenchmarkMetrics;
    var classifyNonElementOption = catalog.classifyNonElementOption;
    var matchHostAuxModels = catalog.matchHostAuxModels;
    var resolveThemeNativeMiniBadgeColors = catalog.resolveThemeNativeMiniBadgeColors;

    /* Delegated Bento UI & Theme Bindings (src/bento-ui.js) */
    var PICKER_CSS = bentoUi.PICKER_CSS;
    var safeRemove = bentoUi.safeRemove;
    var setStyleVar = bentoUi.setStyleVar;
    var mkEl = bentoUi.mkEl;
    var mkSvg = bentoUi.mkSvg;
    var cleanupResiduals = bentoUi.cleanupUiResiduals;
    var isReducedMotion = bentoUi.isReducedMotion;
    var isZhLocale = bentoUi.isZhLocale;
    var invalidateComputedThemeCache = bentoUi.invalidateComputedThemeCache;
    var detectLightDarkMode = bentoUi.detectLightDarkMode;
    var resolvePrismThemeProfile = bentoUi.resolvePrismThemeProfile;
    var miniKeycapColorsForZ = bentoUi.miniKeycapColorsForZ;
    var hudGemColorsForZ = bentoUi.hudGemColorsForZ;
    var selectHudIslandElements = bentoUi.selectHudIslandElements;
    var mountDeskmatTopoSvgIfAvailable = bentoUi.mountDeskmatTopoSvgIfAvailable;
    var buildDeskmatStage = bentoUi.buildDeskmatStage;
    var mountStudioFloorRig = bentoUi.mountStudioFloorRig;
    var buildHudResetViewSvg = bentoUi.buildHudResetViewSvg;
    var buildHudMuteSvg = bentoUi.buildHudMuteSvg;
    var buildHudCloseSvg = bentoUi.buildHudCloseSvg;
    var buildBentoTwinCards = bentoUi.buildBentoTwinCards;
    var readMutedPref = audioFx.readMutedPref;
    var writeMutedPref = audioFx.writeMutedPref;

    function resolveOledScreenModule(root) {
      var found = (root && root.PrismPeriodicOledScreen) || (typeof globalThis !== 'undefined' && globalThis && globalThis.PrismPeriodicOledScreen) || (typeof window !== 'undefined' && window && window.PrismPeriodicOledScreen) || null;
      if (found && typeof found.createOledScreenPainter === 'function') return found;
      if (typeof require === 'function') { try { var m = require('./oled-cyber-screen.js'); if (m && typeof m.createOledScreenPainter === 'function') return m; } catch (e) {} }
      return null;
    }

    function resolveGrainAssets(root) {
      var found = (root && root.PrismPeriodicGrainAssets) || (typeof globalThis !== 'undefined' && globalThis && globalThis.PrismPeriodicGrainAssets) || (typeof window !== 'undefined' && window && window.PrismPeriodicGrainAssets) || null;
      if (found && typeof found === 'object') return found;
      if (typeof require === 'function') { try { var m = require('./pbr-grain-assets.js'); if (m && typeof m === 'object') return m; } catch (e) {} }
      return null;
    }

    function isNodeConnectedToDoc(docRef, node) {
      if (!node || typeof node !== 'object') return false;
      if (typeof node.isConnected === 'boolean') return node.isConnected;
      var cur = node;
      while (cur) {
        if (cur === docRef || (docRef && (cur === docRef.documentElement || cur === docRef.body))) return true;
        cur = cur.parentNode || cur.parentElement || null;
      }
      return false;
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
        available: true,
        usedTokens: usedTokens,
        pct: pct,
        kvCacheRate: cacheRate,
        pulsePoints: pulse,
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

      var requestedPerfMode = normalizePerformanceMode(opts.performanceMode);
      if (initialMode === 'off') {
        cleanupResiduals(doc);
        var offStageMode = requestedStageMode;
        var offPerfMode = requestedPerfMode;
        var offController = {
          destroy: function () {
            cleanupResiduals(doc);
          },
          getStatus: function () {
            return { status: 'off', mode: 'off', stageMode: offStageMode, performanceMode: offPerfMode, orchLatched: false };
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
              reOpts.performanceMode = offPerfMode;
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
          setPerformanceMode: function (m) {
            offPerfMode = normalizePerformanceMode(m);
            return offPerfMode;
          },
          getPerformanceMode: function () {
            return offPerfMode;
          },
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
      var performanceMode = requestedPerfMode;
      var audioEngine = audioFx.createAudioFxEngine({ root: root, doc: doc });
      var muted = audioEngine.isMuted();
      if (doc && doc.documentElement && typeof doc.documentElement.setAttribute === 'function') {
        doc.documentElement.setAttribute('data-prism-perf-mode', performanceMode);
      }
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
      var floorShadowEl = null;
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
      var cachedOverlayWidth = 1280;
      var cachedComposerHeight = 0;
      var lastStageRectFn = null;
      var rCache = { t: 0, el: null, fn: null, m: '' };
      var rimGlowWasActive = false, rimDockWasActive = false, rimCardWasActive = false, rimRightWasActive = false;
      var rimP = { x: NaN, y: NaN, d: Infinity, cT: 0, rT: 0 };
      var bCache = { k: '', p: null };
      var lastDockCompactSig = '', lastShadowPxStr = '', lastShadowPyStr = '', lastStageCursor = '';
      var lastBentoDomSig = '';
      var drawerTrans = false, drawerLockW = 0, drawerEstStageW = 760, drawerEstStageH = 314, a11yKeysOk = false;
      var dockResizeRafId = 0, drawerTransTmr = 0;
      function resetUltraPerfCaches() {
        rCache.t = 0; rCache.el = null; rCache.fn = null; rCache.m = '';
        rimP.x = NaN; rimP.y = NaN; rimP.d = Infinity; rimP.cT = 0; rimP.rT = 0;
        bCache.k = ''; bCache.p = null;
        lastDockCompactSig = ''; lastShadowPxStr = ''; lastShadowPyStr = ''; lastStageCursor = '';
        rimGlowWasActive = false; rimDockWasActive = false; rimCardWasActive = false; rimRightWasActive = false;
        a11yKeysOk = false;
      }
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
        var kbMod = resolveKeyboard3DFactory(root);
        if (kbMod && typeof kbMod.evictLegendAtlasCache === 'function') {
          try {
            kbMod.evictLegendAtlasCache();
          } catch (eKb) {}
        }
        if (audioEngine && typeof audioEngine.suspend === 'function') {
          try {
            audioEngine.suspend();
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

      function clrDrawerTrans() {
        if (drawerTransTmr) { clearTimer(drawerTransTmr); pendingTimers.delete(drawerTransTmr); drawerTransTmr = 0; }
        drawerTrans = false; drawerLockW = 0;
        if (canvasEl) setStyleVar(canvasEl, 'height', null);
      }
      function lockDrawerTransCanvasH() {
        var cur = cachedStageBounds.valid ? cachedStageBounds.height : 0;
        var th = cur >= drawerEstStageH * 0.85 ? cur : drawerEstStageH;
        if (canvasEl && th > 60) setStyleVar(canvasEl, 'height', Math.round(th) + 'px');
        return th;
      }
      function endDrawerTrans() {
        var was = drawerTrans; clrDrawerTrans();
        if (!was || !overlayEl || isDestroyed || isConfirmClosing || isDrawerClosing) return;
        if (dockResizeRafId && cancelRaf) cancelRaf(dockResizeRafId);
        dockResizeRafId = 0; lastBoundsSyncMs = readClockMs();
        refreshCachedDockBounds(true);
        resizeCanvasToStage(!syncDockCompactState(), true);
        if (!isOrbitDragging) syncHitLayerRects(true);
        syncSceneAndDom(true);
      }
      function clearTransientAsync() {
        if (dockResizeRafId && cancelRaf) cancelRaf(dockResizeRafId);
        dockResizeRafId = 0;
        clrDrawerTrans();
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

      /* Delegate 5-layer procedural Web Audio synthesis to PrismPeriodicAudioFx */
      function playSound(kind, stepIndex) {
        if (isDestroyed || !audioEngine) return false;
        return audioEngine.playSound(kind, stepIndex);
      }

      function closeAudioContext() {
        if (audioEngine && typeof audioEngine.closeAudioContext === 'function') {
          audioEngine.closeAudioContext();
        }
      }
      function ensureStyles() {
        return bentoUi.ensureStyles(doc);
      }

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
      function spawnHoldRing(btn) {
        return bentoUi.spawnHoldRing(doc, root, btn, reqRaf, HOLD_OPEN_DELAY_MS, HOLD_RING_DELAY_MS);
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

      function formatEffortTierNote(activeEffortCode, isAvailable, isAuxSingle, zh, isOrchActive) {
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
                : formatEffortTierNote(activeAuxEff, inspectAuxSlot.available, auxSingle, zh, isOrchAuxPlanner),
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
              tierNote: formatEffortTierNote(activeEff, true, levelsOut.length <= 1, zh, isOrchElemPlanner),
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
            tierNote: formatEffortTierNote('', false, false, zh, false),
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
        if (!bentoRefs || !bSpec) return;
        var committed = resolveCommittedTelemetrySpec(zh);
        var tele = readConsoleTelemetry(doc, root, committed.telemetrySeed, activeTelemetrySource);
        var langCode = (doc && doc.documentElement && doc.documentElement.getAttribute('data-prism-lang')) || (zh ? 'zh-CN' : 'en');
        bentoUi.syncBentoTwinCardsDom(bentoRefs, {
          doc: doc,
          root: root,
          overlayEl: overlayEl,
          bSpec: bSpec,
          committed: committed,
          telemetry: tele,
          lang: langCode,
          zh: zh,
          profile: profile,
          stageMode: stageMode,
          muted: muted,
          cardFlipped: cardFlipped,
          compactExpanded: compactExpanded,
          orchLatched: orchLatched,
          auxPage: 0,
          auxPageCount: 1,
          handlers: bentoRefs._handlers,
        });
      }
      function applyBoxRect(el, rect) {
        if (!el || !rect) return;
        var l = Math.round(rect.left);
        var t = Math.round(rect.top);
        var w = Math.max(1, Math.round(rect.width));
        var h = Math.max(1, Math.round(rect.height));
        var rKey = l + ',' + t + ',' + w + ',' + h;
        if (el._ppRectKey === rKey) return;
        el._ppRectKey = rKey;
        setStyleVar(el, 'left', l + 'px');
        setStyleVar(el, 'top', t + 'px');
        setStyleVar(el, 'width', w + 'px');
        setStyleVar(el, 'height', h + 'px');
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

      function readBoxRect(el, minW, minH, defW, defH) {
        if (!el || typeof el.getBoundingClientRect !== 'function') return null;
        var r = el.getBoundingClientRect();
        if (!r || r.width <= minW || r.height <= minH) return null;
        return { left: Number(r.left) || 0, top: Number(r.top) || 0, width: Number(r.width) || defW, height: Number(r.height) || defH };
      }

      function commitStageRect(r, allowSmallH) {
        if (r && r.width > 80 && (r.height > 60 || allowSmallH)) {
          cachedStageBounds = {
            left: Number(r.left) || 0,
            top: Number(r.top) || 0,
            width: Number(r.width) || 1280,
            height: r.height > 60 ? Number(r.height) : drawerEstStageH,
            valid: true,
          };
          if (activeRenderer && typeof activeRenderer.syncCanvasBounds === 'function') {
            activeRenderer.syncCanvasBounds(cachedStageBounds);
          }
          return true;
        }
        cachedStageBounds.valid = false;
        return false;
      }

      /* Zero synchronous getBoundingClientRect() — reads cached measurements only! */
      function syncDockCompactState() {
        if (!overlayEl) return false;
        if (stageMode !== 'drawer') {
          if (lastDockCompactSig === 'fullscreen') return false;
          lastDockCompactSig = 'fullscreen';
          overlayEl.setAttribute('data-dock-tier', 'wide');
          overlayEl.setAttribute('data-dock-compact', '0');
          overlayEl.setAttribute('data-spec-compact', '0');
          overlayEl.setAttribute('data-source-short', '0');
          overlayEl.setAttribute('data-compact-expanded', '0');
          overlayEl.removeAttribute('data-short-viewport');
          setStyleVar(overlayEl, '--pp-short-dock-h', null);
          return true;
        }
        var winH = Number(root && root.innerHeight) || 800;
        var isShortVp = winH > 0 && winH < SHORT_VIEWPORT_HEIGHT_PX;
        var clampedShortH = 0;
        if (isShortVp) {
          var availShortH = winH - 180;
          if (cachedComposerHeight > 28 && cachedComposerHeight < winH * 0.7) {
            availShortH = Math.min(availShortH, winH - cachedComposerHeight - 84);
          }
          var minShortH = winH < 420 ? 172 : 196;
          clampedShortH = Math.max(minShortH, Math.min(268, Math.round(availShortH)));
        }
        var measuredW = cachedOverlayWidth > 160 ? cachedOverlayWidth : cachedDockBounds.width;
        if (measuredW <= 160 && root && Number(root.innerWidth) > 160) measuredW = Number(root.innerWidth);
        if (measuredW <= 160) measuredW = 1280;
        var tier = measuredW >= DOCK_WIDE_BREAKPOINT_PX ? 'wide' : measuredW >= DOCK_MEDIUM_BREAKPOINT_PX ? 'medium' : 'narrow';
        var isCompact = tier !== 'wide';
        var isSpecCompact = tier === 'medium' || (tier === 'wide' && measuredW < 1300);
        var useShortSource = tier !== 'wide' || measuredW < 1260;
        if (tier !== 'narrow' && compactExpanded) compactExpanded = false;
        var compExpFlag = tier === 'narrow' && compactExpanded ? '1' : '0';
        var clm = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
        drawerEstStageH = Math.max(120, Math.round(Math.min(Math.max(120, winH - 176), isShortVp ? clampedShortH : tier === 'medium' ? clm(winH * 0.43, 368, 422) : clm(winH * 0.38, 336, 392)) - (isShortVp ? 13 : tier === 'medium' ? 64 : tier === 'narrow' ? 59 : 22)));
        drawerEstStageW = Math.max(160, Math.round(tier === 'wide' ? measuredW - clm(measuredW * 0.248, 284, 338) - clm(measuredW * 0.192, 218, 268) - (isShortVp ? 36 : 52) : tier === 'medium' ? measuredW - clm(measuredW * 0.275, 278, 328) - (isShortVp ? 28 : 34) : measuredW - 20));
        var nextSig = 'drawer|' + tier + '|' + (isCompact ? '1' : '0') + '|' + (isSpecCompact ? '1' : '0') + '|' + (useShortSource ? '1' : '0') + '|' + compExpFlag + '|' + (isShortVp ? clampedShortH : '0');
        if (lastDockCompactSig === nextSig) return false;
        lastDockCompactSig = nextSig;
        if (isShortVp) {
          overlayEl.setAttribute('data-short-viewport', '1');
          setStyleVar(overlayEl, '--pp-short-dock-h', clampedShortH + 'px');
        } else {
          overlayEl.removeAttribute('data-short-viewport');
          setStyleVar(overlayEl, '--pp-short-dock-h', null);
        }
        overlayEl.setAttribute('data-dock-tier', tier);
        overlayEl.setAttribute('data-dock-compact', isCompact ? '1' : '0');
        overlayEl.setAttribute('data-spec-compact', isSpecCompact ? '1' : '0');
        overlayEl.setAttribute('data-source-short', useShortSource ? '1' : '0');
        overlayEl.setAttribute('data-compact-expanded', compExpFlag);
        return true;
      }

      function refreshCachedDockBounds(force) {
        scrollBoundsDirty = false;
        if (!overlayEl) return;
        var nowMs = readClockMs();
        var sFn = stageEl && typeof stageEl.getBoundingClientRect === 'function' ? stageEl.getBoundingClientRect : null;
        var oFn = typeof overlayEl.getBoundingClientRect === 'function' ? overlayEl.getBoundingClientRect : null;
        if (!force && cachedStageBounds.valid && rCache.el === overlayEl && lastStageRectFn === sFn && rCache.fn === oFn && rCache.m === stageMode && rCache.t > 0 && nowMs >= rCache.t && nowMs - rCache.t <= 16) {
          return;
        }
        try {
          if (oFn) {
            var or = overlayEl.getBoundingClientRect();
            if (or && or.width > 160) cachedOverlayWidth = Number(or.width) || 0;
          }
          var dr = readBoxRect(spatialDockEl || stageEl || overlayEl, 40, 40, 1280, 340);
          if (dr) {
            cachedDockBounds = dr;
            if (cachedOverlayWidth <= 160 && dr.width > 160) cachedOverlayWidth = dr.width;
          }
          if (cachedOverlayWidth <= 160 && overlayEl.parentElement) {
            var pw = Number(overlayEl.parentElement.clientWidth) || 0;
            if (pw > 160) cachedOverlayWidth = pw;
            else if (typeof overlayEl.parentElement.getBoundingClientRect === 'function') {
              var pr = overlayEl.parentElement.getBoundingClientRect();
              if (pr && pr.width > 160) cachedOverlayWidth = Number(pr.width) || 0;
            }
          }
          var hostBox = overlayEl.parentElement;
          var composerBox = resolveTargetElement(doc, configuredComposerOpt) || (hostBox && typeof hostBox.querySelector === 'function' && hostBox.querySelector('[data-prism-composer]')) || (doc && typeof doc.querySelector === 'function' ? doc.querySelector('[data-prism-composer]') : null);
          var compR = composerBox && typeof composerBox.getBoundingClientRect === 'function' ? composerBox.getBoundingClientRect() : null;
          cachedComposerHeight = compR && compR.height > 28 ? Number(compR.height) : 0;
          var cr = bentoRefs ? readBoxRect(bentoRefs.grid, 20, 20, 300, 316) : null;
          if (cr) cachedCardBounds = cr;
          var rr = bentoRefs ? readBoxRect(bentoRefs.rightWing, 20, 20, 246, 316) : null;
          if (rr) cachedRightCardBounds = rr;
          if (sFn) {
            lastStageRectFn = sFn;
            commitStageRect(stageEl.getBoundingClientRect(), stageMode === 'drawer');
          }
          rCache.t = nowMs; rCache.el = overlayEl; rCache.fn = oFn; rCache.m = stageMode;
        } catch (e) {}
      }

      var lastBoundsSyncMs = 0;
      var scrollBoundsDirty = false;

      function writeCardRim(el, was, near, a, x, y, now, tk, pfx) {
        if (!el) return was;
        if (near) {
          if (!was || now - rimP[tk] >= 16) {
            rimP[tk] = now;
            setStyleVar(el, '--pp-' + pfx + '-rim-alpha', a.toFixed(3));
            setStyleVar(el, '--pp-' + pfx + '-px', Math.round(x) + 'px');
            setStyleVar(el, '--pp-' + pfx + '-py', Math.round(y) + 'px');
          }
          return true;
        }
        if (was) {
          rimP[tk] = 0;
          setStyleVar(el, '--pp-' + pfx + '-rim-alpha', '0');
          setStyleVar(el, '--pp-' + pfx + '-px', '-999px');
          setStyleVar(el, '--pp-' + pfx + '-py', '-999px');
        }
        return false;
      }

      function clearCardRimGlows() {
        rimCardWasActive = writeCardRim(bentoRefs && bentoRefs.specCardRim, rimCardWasActive, false, 0, 0, 0, 0, 'cT', 'card');
        rimRightWasActive = writeCardRim(bentoRefs && bentoRefs.telePodRim, rimRightWasActive, false, 0, 0, 0, 0, 'rT', 'right');
      }

      function clearLocalRimGlow() {
        if (!overlayEl) return;
        rimP.x = NaN; rimP.y = NaN; rimP.d = Infinity;
        if (rimGlowWasActive) { rimGlowWasActive = false; overlayEl.setAttribute('data-pointer-near', '0'); }
        if (rimDockWasActive && dockTopRimEl) {
          rimDockWasActive = false;
          setStyleVar(dockTopRimEl, '--pp-dock-rim-alpha', '0');
          setStyleVar(dockTopRimEl, '--pp-px', '-999px');
        }
        clearCardRimGlows();
      }

      function smoothRimWeight(distPx, maxDistPx) {
        if (distPx <= 0) return 1;
        if (distPx >= maxDistPx) return 0;
        var u = 1 - distPx / maxDistPx;
        return u * u * (3 - 2 * u);
      }

      function updateDynamicPrismCssVars(clientX, clientY, inOv) {
        if (!overlayEl) return { nearAny: false, extDockDist: Infinity };
        if (isOrbitDragging || (gestureState && (gestureState.isOrbitDragging || gestureState.scrubbing))) {
          if (rimCardWasActive || rimRightWasActive) clearCardRimGlows();
          return { nearAny: false, extDockDist: Infinity };
        }
        var cx = Number(clientX) || 0, cy = Number(clientY) || 0;
        if (Number.isFinite(rimP.x)) {
          var rdx = cx - rimP.x, rdy = cy - rimP.y;
          if (rdx * rdx + rdy * rdy < 4) return { nearAny: rimGlowWasActive, extDockDist: rimP.d };
        }
        var b = cachedDockBounds, cb = cachedCardBounds, rb = cachedRightCardBounds;
        var lx = cx - b.left, ly = cy - b.top, cardX = cx - cb.left, cardY = cy - cb.top, rx = cx - rb.left, ry = cy - rb.top;
        var dxD = Math.max(0, -lx, lx - b.width), extDockDist = Math.hypot(dxD, Math.max(0, -ly, ly - b.height));
        rimP.x = cx; rimP.y = cy; rimP.d = extDockDist;
        var dockA = smoothRimWeight(Math.hypot(dxD, ly < 0 ? -ly : ly * 0.78), EXT_RIM_PROXIMITY_PX);
        var cD = Math.hypot(Math.max(0, -cardX, cardX - cb.width), Math.max(0, -cardY, cardY - cb.height));
        var rD = Math.hypot(Math.max(0, -rx, rx - rb.width), Math.max(0, -ry, ry - rb.height));
        var cardA = (inOv !== true || cD <= 6) ? smoothRimWeight(cD, EXT_RIM_PROXIMITY_PX) : 0;
        var rightA = (inOv !== true || rD <= 6) ? smoothRimWeight(rD, EXT_RIM_PROXIMITY_PX) : 0;
        var dNear = dockA > 0.008, cNear = cardA > 0.008, rNear = rightA > 0.008, nearAny = dNear || cNear || rNear;
        if (!nearAny) { if (rimGlowWasActive) clearLocalRimGlow(); return { nearAny: false, extDockDist: extDockDist }; }
        if (!rimGlowWasActive) { rimGlowWasActive = true; overlayEl.setAttribute('data-pointer-near', '1'); }
        var now = readClockMs();
        if (dockTopRimEl) {
          if (dNear) { rimDockWasActive = true; setStyleVar(dockTopRimEl, '--pp-dock-rim-alpha', dockA.toFixed(3)); setStyleVar(dockTopRimEl, '--pp-px', Math.round(lx) + 'px'); }
          else if (rimDockWasActive) { rimDockWasActive = false; setStyleVar(dockTopRimEl, '--pp-dock-rim-alpha', '0'); setStyleVar(dockTopRimEl, '--pp-px', '-999px'); }
        }
        rimCardWasActive = writeCardRim(bentoRefs && bentoRefs.specCardRim, rimCardWasActive, cNear, cardA, cardX, cardY, now, 'cT', 'card');
        rimRightWasActive = writeCardRim(bentoRefs && bentoRefs.telePodRim, rimRightWasActive, rNear, rightA, rx, ry, now, 'rT', 'right');
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
        var nextShadowPx = (reduced ? 0 : orbit.yaw * 18).toFixed(2) + 'px';
        var nextShadowPy = (reduced ? 0 : orbit.pitch * 14).toFixed(2) + 'px';
        if (floorShadowEl && (nextShadowPx !== lastShadowPxStr || nextShadowPy !== lastShadowPyStr)) {
          lastShadowPxStr = nextShadowPx;
          lastShadowPyStr = nextShadowPy;
          setStyleVar(floorShadowEl, '--pp-shadow-px', nextShadowPx);
          setStyleVar(floorShadowEl, '--pp-shadow-py', nextShadowPy);
        }
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
        var lastPitch = NaN, lastYaw = NaN, unchangedFrames = 0, stepCount = 0;
        function tick() {
          orbitSyncRafId = 0;
          if (!overlayEl || isDestroyed || !activeRenderer) return;
          if (typeof activeRenderer.getChassisOrbit === 'function') {
            try {
              var rawO = activeRenderer.getChassisOrbit();
              if (rawO && (Boolean(rawO.isRotated) || Math.hypot(Number(rawO.pitch) || 0, Number(rawO.yaw) || 0) > 0.008)) {
                pendingServoOrbit = null;
              }
            } catch (e) {}
          }
          var hasIdleApi = typeof activeRenderer.isIdle === 'function';
          var idleDone = hasIdleApi ? Boolean(activeRenderer.isIdle()) : false;
          if (idleDone && !isOrbitDragging) pendingServoOrbit = null;
          syncOrbitParallaxAndHud();
          var o = getChassisOrbitSafe();
          if (Math.abs(o.pitch - lastPitch) < 1e-5 && Math.abs(o.yaw - lastYaw) < 1e-5) unchangedFrames += 1;
          else { unchangedFrames = 0; lastPitch = o.pitch; lastYaw = o.yaw; }
          stepCount += 1;
          if (stepCount >= 240) {
            pendingServoOrbit = null;
            if (!isOrbitDragging) syncHitLayerRects();
            return;
          }
          if (hasIdleApi ? (idleDone && !isOrbitDragging) : (!isOrbitDragging && unchangedFrames >= 2)) {
            syncHitLayerRects();
            return;
          }
          orbitSyncRafId = reqRaf(tick);
        }
        orbitSyncRafId = reqRaf(tick);
      }

      function syncHitLayerRects(skipBoundsMeasure, hitOpts) {
        if (!overlayEl || !stageEl || !uiRefs || isOrbitDragging) return;
        syncOrbitParallaxAndHud();
        if (!skipBoundsMeasure) refreshCachedDockBounds();
        var stageRect = readStageBoundsZeroReflow();
        var stageW = stageRect && stageRect.valid && stageRect.width > 80 ? stageRect.width : 1280;
        var stageH = stageRect && stageRect.valid && stageRect.height > 60 ? stageRect.height : 680;
        var isGl = overlayEl.getAttribute('data-gl-stage') === '1';
        var wantKeys = !isGl || Boolean(hitOpts && hitOpts.includeKeys === true);
        var proj = null;
        if (activeRenderer && typeof activeRenderer.getInteractiveProjectedRects === 'function') {
          try { proj = activeRenderer.getInteractiveProjectedRects(wantKeys ? undefined : { includeKeys: false }); } catch (e) { proj = null; }
        }
        if (wantKeys) {
          if (isGl) a11yKeysOk = true;
          var keyRectMap = new Map();
          if (proj && Array.isArray(proj.availableKeys)) {
            for (var i = 0; i < proj.availableKeys.length; i += 1) {
              var pk = proj.availableKeys[i];
              keyRectMap.set(pk.slotZ || pk.z, { left: pk.left, top: pk.top, width: pk.width, height: pk.height });
            }
          } else if (proj && Array.isArray(proj.keys)) {
            for (var k = 0; k < proj.keys.length; k += 1) {
              var item = proj.keys[k];
              if (item.available) keyRectMap.set(item.slotZ || item.z, { left: item.left, top: item.top, width: item.width, height: item.height });
            }
          } else {
            availableByZ.forEach(function (_, z) { var slot = SLOT_BY_Z.get(z); if (slot) keyRectMap.set(z, fallbackKeyRect(slot, stageW, stageH)); });
          }
          keyRectMap.forEach(function (rUpper, zUpper) {
            if (zUpper === selectedZ) return;
            var sUpper = SLOT_BY_Z.get(zUpper); if (!sUpper) return;
            keyRectMap.forEach(function (rLower, zLower) {
              if (zUpper === zLower || zLower === selectedZ) return;
              var sLower = SLOT_BY_Z.get(zLower);
              if (!sLower || sLower.col !== sUpper.col || sLower.row <= sUpper.row) return;
              if (rUpper.top + rUpper.height > rLower.top - 1) rUpper.height = Math.max(12, rLower.top - rUpper.top - 1);
            });
          });
          keyRectMap.forEach(function (rectVal, zKey) { var btn = keyNodesByZ.get(zKey); if (btn) applyBoxRect(btn, rectVal); });
          if (auxKeyNodes.length > 0) {
            var projAux = proj && Array.isArray(proj.auxKeys) ? proj.auxKeys : null;
            for (var ai = 0; ai < auxKeyNodes.length; ai += 1) {
              var ab = auxKeyNodes[ai], aSlot = auxSlots[ai];
              if (!ab || !aSlot || !aSlot.available) continue;
              var matchedAuxRect = null;
              if (projAux) {
                for (var pa = 0; pa < projAux.length; pa += 1) {
                  var cand = projAux[pa];
                  if (cand && (cand.auxIndex === ai || cand.slotIndex === ai)) { matchedAuxRect = cand; break; }
                }
              }
              applyBoxRect(ab, matchedAuxRect || fallbackAuxKeyRect(ai, stageW, stageH));
            }
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
                if (projEfforts[pe].effort === effCode) { matchedRect = projEfforts[pe]; break; }
              }
            }
            applyBoxRect(eb, matchedRect || { left: stageW * 0.42 + ei * 58, top: stageH * 0.34, width: 52, height: 24 });
          }
        }
      }

      function readStageBoundsZeroReflow() {
        if (scrollBoundsDirty) {
          refreshCachedDockBounds(true);
        } else if (stageEl && stageEl.getBoundingClientRect !== lastStageRectFn && typeof stageEl.getBoundingClientRect === 'function') {
          try {
            var sr = stageEl.getBoundingClientRect();
            lastStageRectFn = stageEl.getBoundingClientRect;
            if (sr && sr.width > 80 && sr.height > 60) commitStageRect(sr, false);
          } catch (e) {}
        }
        return cachedStageBounds;
      }

      function resizeCanvasToStage(skipRectRefresh, deferRender, overrideH) {
        if (!stageEl || !canvasEl) return;
        if (!skipRectRefresh || !cachedStageBounds.valid) refreshCachedDockBounds();
        var sBounds = readStageBoundsZeroReflow(), isDr = stageMode === 'drawer';
        var cssW = sBounds.valid ? sBounds.width : (isDr ? drawerEstStageW : 1280);
        var cssH = overrideH > 60 ? overrideH : (sBounds.valid ? sBounds.height : (isDr ? drawerEstStageH : 680));
        var bArg = (overrideH > 60 || (!sBounds.valid && isDr)) ? { left: sBounds.valid ? sBounds.left : 0, top: sBounds.valid ? sBounds.top : 0, width: cssW, height: cssH, valid: true } : (sBounds.valid ? sBounds : null);
        var dpr = Math.min(2, Math.max(1, Number(root && root.devicePixelRatio) || 1));
        if (activeRenderer && typeof activeRenderer.resize === 'function') {
          try { activeRenderer.resize(cssW, cssH, dpr, bArg, deferRender ? { deferRender: true } : undefined); } catch (e) {}
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
          var proj = activeRenderer.getInteractiveProjectedRects({ includeKeys: false });
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

      function syncSceneAndDom(skipRectSync, syncOpts) {
        if (!overlayEl || !uiRefs) return;
        var optsObj = syncOpts && typeof syncOpts === 'object' ? syncOpts : null;
        var hoverOnly = Boolean(optsObj && optsObj.hoverOnly);
        var deferRender = Boolean(optsObj && optsObj.deferRender);
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

        /* Beta.4 bCache: deduplicate blind-key hover sweeps & skip redundant Bento DOM work */
        var eHA = hoveredAuxIndex !== null && hoveredAuxIndex === 0 && orchLatched ? null : hoveredAuxIndex;
        var dk = (eHA !== null && auxSlots[eHA]) ? 'a' + eHA + ':' + (auxSlots[eHA].available ? 1 : 0)
          : (hoveredZ !== null && availableByZ.has(hoveredZ)) ? 'e' + hoveredZ
          : inspectedBlindZ !== null ? 'be' + inspectedBlindZ
          : (inspectedBlindAuxIndex !== null && auxSlots[inspectedBlindAuxIndex]) ? 'ba' + inspectedBlindAuxIndex
          : (blindFlashZ !== null && !availableByZ.has(blindFlashZ)) ? 'f' + blindFlashZ
          : (selectedAuxIndex !== null && auxSlots[selectedAuxIndex]) ? 'sa' + selectedAuxIndex
          : 'z' + resolveInspectedElementZ() + (hoveredAuxIndex === 0 && orchLatched ? 'o' : '');
        var bk = dk + '|' + selectedZ + '|' + selectedAuxIndex + '|' + (orchLatched ? 1 : 0) + '|' + (zh ? 1 : 0) + '|' + blindFlashZ + '|' + profile.id + '|' + profile.accent + '|' + stageMode + '|' + (muted ? 1 : 0) + '|' + (cardFlipped ? 1 : 0) + '|' + (compactExpanded ? 1 : 0) + '|' + (hoveredEffort || '') + '|' + lastBentoDomSig;
        var skipBento = Boolean(hoverOnly && bCache.p && bCache.k === bk);
        var payload = skipBento ? bCache.p : (bCache.k = bk, bCache.p = buildCurrentDeckPayload(zh));
        var dInfo = payload.deckInfo;
        if (skipBento && dInfo) {
          dInfo.hoveredEffort = hoveredEffort;
          dInfo.pressedEffort = pressedEffort;
          dInfo.dragEffortProgress = dragEffortProgress;
        } else {
          syncBentoTwinCardsDom(payload.bentoSpec, zh, profile);
        }

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
          var deferHw = Boolean(deferRender || typeof activeRenderer.setState === 'function');
          try {
            activeRenderer.setHardwareState(hardwareStatePayload, deferHw ? { deferRender: true } : undefined);
          } catch (e) {}
        }
        if (activeRenderer && typeof activeRenderer.setState === 'function') {
          try {
            var nextRendererState = {
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
            };
            if (deferRender) activeRenderer.setState(nextRendererState, { deferRender: true });
            else activeRenderer.setState(nextRendererState);
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
        muted = audioEngine ? audioEngine.toggleMuted(true) : !muted;
        if (!muted) playSound('step', 2);
        syncSceneAndDom(true);
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
        resetUltraPerfCaches();

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
          onEffortSelect: handleEffortSelect,
          onAuxEffortSelect: handleAuxEffortSelect,
        });

        /* Frameless 3D Hardware Stage (.pp-stage + .pp-modal alias for test harness compatibility) */
        stageEl = mkEl(doc, 'div', 'pp-stage pp-modal');
        var floorRig = mountStudioFloorRig(doc, stageEl);
        floorShadowEl = floorRig && floorRig.shadowEl ? floorRig.shadowEl : null;
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
        hitLayerEl.addEventListener('focusin', function () {
          if (!overlayEl || isDestroyed || isDrawerClosing || a11yKeysOk) return;
          if (overlayEl.getAttribute('data-gl-stage') === '1') syncHitLayerRects(true, { includeKeys: true });
        });

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

        /* Beta.4 rAF-batched ResizeObserver with drawer transition width lock */
        var ResizeObsCtor =
          (root && root.ResizeObserver) || (typeof ResizeObserver === 'function' ? ResizeObserver : null);
        if (ResizeObsCtor && overlayEl) {
          try {
            dockResizeObserver = new ResizeObsCtor(function (entries) {
              if (!overlayEl || isDestroyed || isDrawerClosing) return;
              if (drawerTrans && stageMode === 'drawer') {
                var wChg = false;
                if (entries && entries.length && drawerLockW > 0) {
                  for (var ei = 0; ei < entries.length; ei += 1) {
                    var ent = entries[ei];
                    if (ent && ent.target === overlayEl && ent.contentRect && ent.contentRect.width > 80 && Math.abs(ent.contentRect.width - drawerLockW) > 2) { wChg = true; break; }
                  }
                }
                if (!wChg) return;
                clrDrawerTrans();
              }
              if (dockResizeRafId) return;
              var flushRo = function () {
                dockResizeRafId = 0;
                if (!overlayEl || isDestroyed || isDrawerClosing || (drawerTrans && stageMode === 'drawer')) return;
                refreshCachedDockBounds(true);
                resizeCanvasToStage(!syncDockCompactState(), !isConfirmClosing);
                if (!isOrbitDragging) syncHitLayerRects(true);
                if (!isConfirmClosing) syncSceneAndDom(true);
              };
              if (reqRaf) dockResizeRafId = reqRaf(flushRo); else flushRo();
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
              performanceMode: performanceMode,
            });
          } catch (e) {
            activeRenderer = null;
          }
        }

        var useGlStagePick = Boolean(activeRenderer && typeof activeRenderer.pick === 'function');
        overlayEl.setAttribute('data-gl-stage', useGlStagePick ? '1' : '0');

        refreshCachedDockBounds(true);
        if (syncDockCompactState() && stageMode === 'drawer' && stageEl && typeof stageEl.getBoundingClientRect === 'function') {
          try { commitStageRect(stageEl.getBoundingClientRect(), true); } catch (ePost) {}
        }
        drawerTrans = Boolean(stageMode === 'drawer' && reqRaf && !isReducedMotion(doc, root));
        drawerLockW = drawerTrans ? (cachedOverlayWidth || cachedDockBounds.width || 0) : 0;
        resizeCanvasToStage(true, true, drawerTrans ? lockDrawerTransCanvasH() : 0);
        syncSceneAndDom(true);

        /* V8 Intro Wake: 340ms weightless levitation lift & left-to-right prismatic sweep */
        if (activeRenderer && !isReducedMotion(doc, root) && typeof activeRenderer.triggerIntroWake === 'function') {
          try {
            activeRenderer.triggerIntroWake();
            scheduleSettledRectSync();
          } catch (e) {}
        }
        if (!useGlStagePick || !reqRaf) {
          syncHitLayerRects(true);
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

        function applyStageCursor(c) {
          if (lastStageCursor === c) return;
          lastStageCursor = c;
          if (canvasEl) setStyleVar(canvasEl, 'cursor', c);
        }

        function clearStageHoverAndPress() {
          if (isConfirmClosing || isDrawerClosing) return;
          cancelBlindDwellTimer();
          applyStageCursor('default');
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
          if (hadHoverOrPress) syncSceneAndDom(true, { hoverOnly: true, deferRender: true });
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
            applyStageCursor(cursorVal);

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

              syncSceneAndDom(true, { hoverOnly: true, deferRender: true });
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
              /* Single-frame Read-then-Write: batch layout reads (16ms rCache), then write data-open / canvas / scrollTop */
              refreshCachedDockBounds();
              var pinnedScrollH = 0;
              if (pinnedScrollEl) {
                try { pinnedScrollH = pinnedScrollEl.scrollHeight; } catch (e0) {}
              }
              overlayEl.setAttribute('data-open', '1');
              if (drawerTrans) {
                if (drawerTransTmr) { clearTimer(drawerTransTmr); pendingTimers.delete(drawerTransTmr); }
                drawerTransTmr = scheduleTrackedTimer(endDrawerTrans, DOCK_OPEN_TRANSITION_MS + 32);
              }
              var rafTierChanged = syncDockCompactState();
              var rafW = cachedOverlayWidth || cachedDockBounds.width || 0;
              if (!drawerTrans || rafTierChanged || (drawerLockW > 0 && Math.abs(rafW - drawerLockW) > 2)) {
                if (drawerTrans) drawerLockW = rafW;
                if (rafTierChanged) refreshCachedDockBounds(true);
                resizeCanvasToStage(true, true, drawerTrans ? lockDrawerTransCanvasH() : 0);
              }
              syncHitLayerRects(true);
              if (pinnedScrollEl) {
                try { pinnedScrollEl.scrollTop = pinnedScrollH; } catch (e) {}
                scheduleTrackedTimer(function () {
                  if (overlayEl && !isDrawerClosing && pinnedScrollEl) {
                    try { pinnedScrollEl.scrollTop = pinnedScrollEl.scrollHeight; } catch (e2) {}
                  }
                }, DOCK_OPEN_TRANSITION_MS + 16);
              }
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
        floorShadowEl = null;
        canvasEl = null;
        hitLayerEl = null;
        hudPillEl = null;
        uiRefs = null;
        lastStageRectFn = null;
        cachedStageBounds.valid = false;
        resetUltraPerfCaches();
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
        var kbModDeact = resolveKeyboard3DFactory(root);
        if (kbModDeact && typeof kbModDeact.evictLegendAtlasCache === 'function') {
          try { kbModDeact.evictLegendAtlasCache(); } catch (eKbD) {}
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
            audioState: audioEngine && typeof audioEngine.getAudioState === 'function' ? audioEngine.getAudioState() : 'none',
            performanceMode: performanceMode,
            shadowMapSize:
              activeRenderer && typeof activeRenderer.getPerfStats === 'function'
                ? activeRenderer.getPerfStats().shadowMapSize
                : (performanceMode === 'performance' ? 512 : 1024),
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
          bCache.k = ''; bCache.p = null;
          if (overlayEl && !isDrawerClosing) {
            overlayEl.setAttribute('aria-label', normalizedLang === 'zh-CN' ? 'PRISM-118 元素周期表 3D 模型控制台' : 'PRISM-118 Periodic 3D Model Console');
            syncDockCompactState();
            syncSceneAndDom(true);
          }
        },
        setTelemetry: function (nextTele) {
          activeTelemetrySource = nextTele;
          lastBentoDomSig = '';
          bCache.k = ''; bCache.p = null;
          if (overlayEl && !isDrawerClosing) syncSceneAndDom(true);
        },
        setPerformanceMode: function (nextMode) {
          if (isDestroyed) return performanceMode;
          performanceMode = normalizePerformanceMode(nextMode);
          if (doc && doc.documentElement && typeof doc.documentElement.setAttribute === 'function') {
            doc.documentElement.setAttribute('data-prism-perf-mode', performanceMode);
          }
          if (activeRenderer && typeof activeRenderer.setPerformanceMode === 'function') {
            try { activeRenderer.setPerformanceMode(performanceMode); } catch (ePm) {}
          }
          return performanceMode;
        },
        getPerformanceMode: function () {
          return performanceMode;
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
