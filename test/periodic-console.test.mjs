/*!
 * PRISM-118 · Periodic Console — Standalone Functional & De-Sensitization Test Suite
 * Copyright (c) 2026 RMvdesi (https://github.com/RMvdesi). All Rights Reserved.
 * Original Design for Obsidian Prism (https://github.com/RMvdesi/obsidian-prism)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const GRAIN_FILE = path.join(SRC_DIR, 'pbr-grain-assets.js');
const OLED_FILE = path.join(SRC_DIR, 'oled-cyber-screen.js');
const KB3D_FILE = path.join(SRC_DIR, 'keyboard-3d-gl.js');
const CONSOLE_FILE = path.join(SRC_DIR, 'periodic-console.js');

const require = createRequire(import.meta.url);

/* ============================================================================
 * Minimal Zero-Dependency DOM, WebGL2 & Fake-Clock Test Harness
 * ============================================================================ */

function createMock2DContext() {
  const drawnTexts = [];
  return {
    _drawnTexts: drawnTexts,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    font: '12px sans-serif',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    shadowBlur: 0,
    shadowColor: '',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    filter: 'none',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    scale() {},
    clip() {},
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    fillText(txt) {
      drawnTexts.push(String(txt ?? ''));
    },
    strokeText(txt) {
      drawnTexts.push(String(txt ?? ''));
    },
    setLineDash() {},
    measureText(s) {
      return { width: String(s || '').length * 8 };
    },
    createLinearGradient() {
      return { addColorStop() {} };
    },
    createRadialGradient() {
      return { addColorStop() {} };
    },
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    bezierCurveTo() {},
    rect() {},
    roundRect() {},
    ellipse() {},
    arc() {},
    arcTo() {},
    fill() {},
    stroke() {},
    drawImage() {},
  };
}

function createMockWebGL2Context({ failFbo = false } = {}) {
  let nextId = 1;
  const created = {
    programs: new Set(),
    shaders: new Set(),
    buffers: new Set(),
    vaos: new Set(),
    textures: new Set(),
    framebuffers: new Set(),
  };
  const deleted = {
    programs: new Set(),
    shaders: new Set(),
    buffers: new Set(),
    vaos: new Set(),
    textures: new Set(),
    framebuffers: new Set(),
  };
  let loseContextCalls = 0;
  let drawCalls = 0;
  const shadowTexAllocations = [];
  const rg8TexAllocations = [];
  const rgb8TexAllocations = [];

  return {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    STATIC_DRAW: 0x88e4,
    DYNAMIC_DRAW: 0x88e8,
    FLOAT: 0x1406,
    UNSIGNED_SHORT: 0x1403,
    UNSIGNED_INT: 0x1405,
    TEXTURE_2D: 0x0de1,
    RGBA: 0x1908,
    RGB: 0x1907,
    RGB8: 0x8051,
    RG: 0x8227,
    RG8: 0x822b,
    DEPTH_COMPONENT: 0x1902,
    DEPTH_COMPONENT24: 0x81a6,
    DEPTH_COMPONENT16: 0x81a5,
    UNSIGNED_BYTE: 0x1401,
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    CLAMP_TO_EDGE: 0x812f,
    REPEAT: 0x2901,
    UNPACK_ALIGNMENT: 0x0cf5,
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    FRAMEBUFFER: 0x8d40,
    DEPTH_ATTACHMENT: 0x8d00,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    NONE: 0,
    POLYGON_OFFSET_FILL: 0x8037,
    COLOR_BUFFER_BIT: 0x4000,
    DEPTH_BUFFER_BIT: 0x0100,
    DEPTH_TEST: 0x0b71,
    LEQUAL: 0x0203,
    CULL_FACE: 0x0b44,
    BACK: 0x0405,
    BLEND: 0x0be2,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    ONE: 1,
    TEXTURE0: 0x84c0,
    TRIANGLES: 0x0004,
    createShader(type) {
      const sh = { id: nextId++, type };
      created.shaders.add(sh);
      return sh;
    },
    shaderSource() {},
    compileShader() {},
    getShaderParameter: () => true,
    deleteShader(sh) {
      if (sh) deleted.shaders.add(sh);
    },
    createProgram() {
      const p = { id: nextId++ };
      created.programs.add(p);
      return p;
    },
    attachShader() {},
    linkProgram() {},
    getProgramParameter: () => true,
    deleteProgram(p) {
      if (p) deleted.programs.add(p);
    },
    createBuffer() {
      const b = { id: nextId++ };
      created.buffers.add(b);
      return b;
    },
    bindBuffer() {},
    bufferData() {},
    bufferSubData() {},
    deleteBuffer(b) {
      if (b) deleted.buffers.add(b);
    },
    createVertexArray() {
      const v = { id: nextId++ };
      created.vaos.add(v);
      return v;
    },
    bindVertexArray() {},
    enableVertexAttribArray() {},
    vertexAttribPointer() {},
    vertexAttribDivisor() {},
    deleteVertexArray(v) {
      if (v) deleted.vaos.add(v);
    },
    createTexture() {
      const t = { id: nextId++ };
      created.textures.add(t);
      return t;
    },
    bindTexture() {},
    pixelStorei() {},
    texImage2D(_target, _level, internalformat, width, height, _border, format, _type, pixels) {
      if (internalformat === 0x81a6 || internalformat === 0x81a5 || (width === 2048 && height === 2048)) {
        shadowTexAllocations.push({ internalformat, width, height });
      }
      if (internalformat === 0x822b || format === 0x8227) {
        rg8TexAllocations.push({ width, height, byteLength: pixels ? pixels.byteLength || pixels.length || 0 : 0 });
      }
      if (internalformat === 0x8051 || format === 0x1907) {
        rgb8TexAllocations.push({ width, height, byteLength: pixels ? pixels.byteLength || pixels.length || 0 : 0 });
      }
    },
    generateMipmap() {},
    texParameteri() {},
    texParameterf() {},
    deleteTexture(t) {
      if (t) deleted.textures.add(t);
    },
    createFramebuffer() {
      const fb = { id: nextId++ };
      created.framebuffers.add(fb);
      return fb;
    },
    bindFramebuffer() {},
    framebufferTexture2D() {},
    checkFramebufferStatus: () => (failFbo ? 0x8cd6 : 0x8cd5),
    drawBuffers() {},
    readBuffer() {},
    deleteFramebuffer(fb) {
      if (fb) deleted.framebuffers.add(fb);
    },
    getExtension(name) {
      if (name === 'EXT_texture_filter_anisotropic' || name === 'WEBKIT_EXT_texture_filter_anisotropic') {
        return { MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff, TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe };
      }
      if (name === 'WEBGL_lose_context') {
        return {
          loseContext() {
            loseContextCalls += 1;
          },
        };
      }
      return null;
    },
    getParameter: () => 4,
    getUniformLocation: (_p, name) => ({ name }),
    viewport() {},
    clearColor() {},
    clear() {},
    enable() {},
    disable() {},
    polygonOffset() {},
    depthFunc() {},
    cullFace() {},
    blendFuncSeparate() {},
    useProgram() {},
    activeTexture() {},
    uniform1i() {},
    uniform3f() {},
    uniform3fv() {},
    uniform4f() {},
    uniform4fv() {},
    uniformMatrix4fv() {},
    drawElements() {
      drawCalls += 1;
    },
    drawElementsInstanced() {
      drawCalls += 1;
    },
    _stats() {
      return { created, deleted, loseContextCalls, drawCalls, shadowTexAllocations, rg8TexAllocations, rgb8TexAllocations };
    },
  };
}

function createExhibitionSandbox({
  href = 'https://rmvdesi.github.io/prism-periodic-console/',
  theme = 'dark',
  lang = 'zh-CN',
  mock2d = false,
  mockWebGL2 = false,
  failFbo = false,
} = {}) {
  let nowMs = 10000;
  let nextTimerId = 1;
  let nextRafId = 1;
  const timers = new Map();
  const rafs = new Map();
  const observers = new Set();
  const resizeObservers = new Set();

  function splitSelectorList(sel) {
    return String(sel || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function matchesCompound(el, part) {
    if (!el || el.nodeType !== 1 || !part) return false;
    let rest = part;
    const tagM = /^[a-zA-Z0-9_-]+/.exec(rest);
    if (tagM) {
      if (el.tagName !== tagM[0].toUpperCase()) return false;
      rest = rest.slice(tagM[0].length);
    }
    const tokens = rest.match(/#[a-zA-Z0-9_-]+|\.[a-zA-Z0-9_-]+|\[[^\]]+\]/g) || [];
    if (tokens.join('') !== rest) return false;
    for (const tok of tokens) {
      if (tok.startsWith('#')) {
        if (el.id !== tok.slice(1)) return false;
      } else if (tok.startsWith('.')) {
        if (!el.classList.contains(tok.slice(1))) return false;
      } else if (tok.startsWith('[')) {
        const inner = tok.slice(1, -1);
        const eqIdx = inner.indexOf('=');
        if (eqIdx === -1) {
          if (!el.hasAttribute(inner.trim())) return false;
        } else {
          let attrName = inner.slice(0, eqIdx).trim();
          const want = inner.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (attrName.endsWith('*')) {
            attrName = attrName.slice(0, -1);
            if (!(el.getAttribute(attrName) || '').includes(want)) return false;
          } else if (el.getAttribute(attrName) !== want) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function matchesSimple(el, sel) {
    if (!el || el.nodeType !== 1) return false;
    const trimmed = String(sel || '').trim();
    if (!trimmed) return false;
    const parts = trimmed.split(/\s+/);
    if (parts.length > 1) {
      if (!matchesCompound(el, parts[parts.length - 1])) return false;
      let cur = el.parentElement;
      for (let i = parts.length - 2; i >= 0; i -= 1) {
        while (cur && !matchesCompound(cur, parts[i])) cur = cur.parentElement;
        if (!cur) return false;
        cur = cur.parentElement;
      }
      return true;
    }
    return matchesCompound(el, trimmed);
  }

  function matchesSelector(el, sel) {
    return splitSelectorList(sel).some((s) => matchesSimple(el, s));
  }

  function createEventObj(type, init = {}, target = null) {
    return {
      type,
      target,
      currentTarget: null,
      button: init.button ?? 0,
      clientX: init.clientX ?? 0,
      clientY: init.clientY ?? 0,
      deltaY: init.deltaY ?? 0,
      key: init.key ?? '',
      code: init.code ?? '',
      keyCode: init.keyCode ?? 0,
      ctrlKey: Boolean(init.ctrlKey),
      metaKey: Boolean(init.metaKey),
      altKey: Boolean(init.altKey),
      shiftKey: Boolean(init.shiftKey),
      bubbles: init.bubbles !== false,
      cancelable: init.cancelable !== false,
      defaultPrevented: false,
      propagationStopped: false,
      immediatePropagationStopped: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        this.propagationStopped = true;
      },
      stopImmediatePropagation() {
        this.propagationStopped = true;
        this.immediatePropagationStopped = true;
      },
    };
  }

  function createTextNode(text) {
    return {
      nodeType: 3,
      nodeValue: String(text ?? ''),
      parentNode: null,
      parentElement: null,
      get textContent() {
        return this.nodeValue;
      },
      set textContent(v) {
        this.nodeValue = String(v ?? '');
      },
    };
  }

  function makeElement(tag, { id = '', className = '', attrs = {}, text = '', useChildNodes = false } = {}) {
    const attrMap = new Map(Object.entries(attrs));
    const classSet = new Set(String(className).split(/\s+/).filter(Boolean));
    const listeners = { capture: new Map(), bubble: new Map() };
    const children = [];
    const childNodesList = useChildNodes ? [] : null;
    const styleProps = {};
    const upperTag = String(tag).toUpperCase();
    const glCtx = upperTag === 'CANVAS' && mockWebGL2 ? createMockWebGL2Context({ failFbo }) : null;
    const ctx2d = upperTag === 'CANVAS' && mock2d ? createMock2DContext() : null;

    const node = {
      nodeType: 1,
      tagName: upperTag,
      id,
      type: '',
      title: '',
      value: '',
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0,
      clientWidth: 1280,
      width: upperTag === 'CANVAS' ? 960 : 0,
      height: upperTag === 'CANVAS' ? 552 : 0,
      children,
      ...(childNodesList ? { childNodes: childNodesList } : {}),
      parentElement: null,
      parentNode: null,
      _text: text,
      get isContentEditable() {
        return attrMap.get('contenteditable') === 'true';
      },
      focus() {
        documentObj.activeElement = this;
      },
      blur() {
        if (documentObj.activeElement === this) documentObj.activeElement = body;
      },
      ...(upperTag === 'CANVAS' && (mock2d || mockWebGL2)
        ? {
            getContext(kind) {
              if (kind === 'webgl2') return glCtx;
              if (kind === '2d') return ctx2d;
              return null;
            },
            _gl: glCtx,
            _ctx2d: ctx2d,
          }
        : {}),
      style: {
        setProperty(k, v) {
          styleProps[k] = String(v);
        },
        getPropertyValue(k) {
          return styleProps[k] || '';
        },
        removeProperty(k) {
          delete styleProps[k];
        },
      },
      classList: {
        add: (...cs) => cs.forEach((c) => c && classSet.add(c)),
        remove: (...cs) => cs.forEach((c) => classSet.delete(c)),
        contains: (c) => classSet.has(c),
        toggle(c, force) {
          const want = force !== undefined ? Boolean(force) : !classSet.has(c);
          if (want) classSet.add(c);
          else classSet.delete(c);
          return want;
        },
      },
      get className() {
        return Array.from(classSet).join(' ');
      },
      set className(v) {
        classSet.clear();
        String(v || '')
          .split(/\s+/)
          .filter(Boolean)
          .forEach((c) => classSet.add(c));
      },
      get textContent() {
        if (this.childNodes && this.childNodes.length) {
          return this.childNodes.map((c) => (c.nodeType === 3 ? c.nodeValue : c.textContent)).join('');
        }
        return children.length ? children.map((c) => c.textContent).join('') : this._text;
      },
      set textContent(v) {
        children.length = 0;
        if (this.childNodes) this.childNodes.length = 0;
        this._text = String(v ?? '');
      },
      get firstChild() {
        return (this.childNodes ? this.childNodes[0] : children[0]) || null;
      },
      get lastElementChild() {
        return children.length ? children[children.length - 1] : null;
      },
      get nextSibling() {
        if (!this.parentNode) return null;
        const list = this.parentNode.childNodes || this.parentNode.children || [];
        const idx = list.indexOf(this);
        return idx >= 0 && idx + 1 < list.length ? list[idx + 1] : null;
      },
      appendChild(ch) {
        if (ch.parentNode && typeof ch.parentNode.removeChild === 'function') ch.parentNode.removeChild(ch);
        ch.parentElement = this;
        ch.parentNode = this;
        if (ch.nodeType === 3 && !this.childNodes) this.childNodes = [...children];
        if (this.childNodes) this.childNodes.push(ch);
        if (ch.nodeType === 1) children.push(ch);
        return ch;
      },
      insertBefore(ch, refNode) {
        if (!refNode) return this.appendChild(ch);
        if (ch.parentNode && typeof ch.parentNode.removeChild === 'function') ch.parentNode.removeChild(ch);
        ch.parentElement = this;
        ch.parentNode = this;
        if (this.childNodes) {
          const idx = this.childNodes.indexOf(refNode);
          if (idx >= 0) this.childNodes.splice(idx, 0, ch);
          else this.childNodes.push(ch);
        }
        if (ch.nodeType === 1) {
          const elIdx = children.indexOf(refNode);
          if (elIdx >= 0) children.splice(elIdx, 0, ch);
          else children.push(ch);
        }
        return ch;
      },
      removeChild(ch) {
        const idx = children.indexOf(ch);
        if (idx >= 0) children.splice(idx, 1);
        if (this.childNodes) {
          const cIdx = this.childNodes.indexOf(ch);
          if (cIdx >= 0) this.childNodes.splice(cIdx, 1);
        }
        ch.parentElement = null;
        ch.parentNode = null;
        return ch;
      },
      remove() {
        if (this.parentNode && typeof this.parentNode.removeChild === 'function') {
          this.parentNode.removeChild(this);
        }
      },
      setAttribute(k, v) {
        const val = String(v);
        attrMap.set(k, val);
        if (k === 'id') this.id = val;
        if (k === 'class') this.className = val;
      },
      getAttribute(k) {
        if (k === 'id' && this.id) return this.id;
        return attrMap.has(k) ? attrMap.get(k) : null;
      },
      hasAttribute(k) {
        if (k === 'id' && this.id) return true;
        return attrMap.has(k);
      },
      removeAttribute(k) {
        attrMap.delete(k);
        if (k === 'id') this.id = '';
      },
      contains(other) {
        let cur = other;
        while (cur) {
          if (cur === this) return true;
          cur = cur.parentElement || cur.parentNode;
        }
        return false;
      },
      matches: (sel) => matchesSelector(node, sel),
      closest(sel) {
        let cur = this;
        while (cur && cur.nodeType === 1) {
          if (matchesSelector(cur, sel)) return cur;
          cur = cur.parentElement;
        }
        return null;
      },
      querySelector(sel) {
        return this.querySelectorAll(sel)[0] || null;
      },
      querySelectorAll(sel) {
        const out = [];
        const walk = (rootNode) => {
          for (const ch of rootNode.children) {
            if (matchesSelector(ch, sel)) out.push(ch);
            walk(ch);
          }
        };
        walk(this);
        return out;
      },
      getBoundingClientRect() {
        if (this.classList.contains('pp-stage')) {
          return { left: 280, top: 180, right: 1060, bottom: 520, width: 780, height: 340 };
        }
        if (this.classList.contains('pp-spatial-dock') || this.id === 'prism-periodic-console-root') {
          return { left: 40, top: 180, right: 1320, bottom: 540, width: 1280, height: 360 };
        }
        return { left: 100, top: 100, right: 220, bottom: 132, width: 120, height: 32 };
      },
      addEventListener(type, fn, opts) {
        const cap = typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture);
        const bucket = cap ? listeners.capture : listeners.bubble;
        if (!bucket.has(type)) bucket.set(type, new Set());
        bucket.get(type).add(fn);
      },
      removeEventListener(type, fn, opts) {
        const cap = typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture);
        const bucket = cap ? listeners.capture : listeners.bubble;
        bucket.get(type)?.delete(fn);
      },
      _getListeners(type, cap) {
        const bucket = cap ? listeners.capture : listeners.bubble;
        return Array.from(bucket.get(type) || []);
      },
      click() {
        return this.dispatchEvent(createEventObj('click', { button: 0, bubbles: true, cancelable: true }, this));
      },
      dispatchEvent(evObj) {
        const ev = evObj && evObj.type ? evObj : createEventObj('click', {}, this);
        ev.target = this;
        const chain = [];
        let cur = this;
        while (cur) {
          chain.unshift(cur);
          cur = cur.parentNode || null;
        }
        for (const el of chain) {
          ev.currentTarget = el;
          for (const fn of el._getListeners(ev.type, true)) {
            fn.call(el, ev);
            if (ev.immediatePropagationStopped) return !ev.defaultPrevented;
          }
          if (ev.propagationStopped) return !ev.defaultPrevented;
        }
        for (let i = chain.length - 1; i >= 0; i -= 1) {
          const el = chain[i];
          ev.currentTarget = el;
          for (const fn of el._getListeners(ev.type, false)) {
            fn.call(el, ev);
            if (ev.immediatePropagationStopped) return !ev.defaultPrevented;
          }
          if (ev.propagationStopped || !ev.bubbles) break;
        }
        return !ev.defaultPrevented;
      },
    };
    return node;
  }

  const docCaptureListeners = new Map();
  const docBubbleListeners = new Map();
  const winCaptureListeners = new Map();
  const winBubbleListeners = new Map();

  const html = makeElement('html', { attrs: { 'data-prism-theme': theme, 'data-prism-lang': lang } });
  const head = makeElement('head');
  const body = makeElement('body');
  html.appendChild(head);
  html.appendChild(body);

  const documentObj = {
    nodeType: 9,
    documentElement: html,
    head,
    body,
    readyState: 'complete',
    title: 'PRISM-118 Exhibition',
    activeElement: body,
    createElement: (tag) => makeElement(tag),
    createElementNS: (_ns, tag) => makeElement(tag),
    getElementById: (id) => (html.id === id ? html : html.querySelector('#' + id)),
    querySelector: (sel) => html.querySelector(sel),
    querySelectorAll: (sel) => html.querySelectorAll(sel),
    addEventListener(type, fn, opts) {
      const cap = typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture);
      const bucket = cap ? docCaptureListeners : docBubbleListeners;
      if (!bucket.has(type)) bucket.set(type, new Set());
      bucket.get(type).add(fn);
    },
    removeEventListener(type, fn, opts) {
      const cap = typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture);
      const bucket = cap ? docCaptureListeners : docBubbleListeners;
      bucket.get(type)?.delete(fn);
    },
    _getListeners(type, cap) {
      const bucket = cap ? docCaptureListeners : docBubbleListeners;
      return Array.from(bucket.get(type) || []);
    },
    dispatchEvent(evObj) {
      const ev = evObj && evObj.type ? evObj : createEventObj('keydown', {}, html);
      ev.target = ev.target || html;
      for (const fn of this._getListeners(ev.type, true)) {
        fn.call(this, ev);
        if (ev.immediatePropagationStopped) return !ev.defaultPrevented;
      }
      if (!ev.propagationStopped) {
        for (const fn of this._getListeners(ev.type, false)) {
          fn.call(this, ev);
          if (ev.immediatePropagationStopped) return !ev.defaultPrevented;
        }
      }
      return !ev.defaultPrevented;
    },
  };
  html.parentNode = documentObj;

  function countListeners(map) {
    let n = 0;
    for (const s of map.values()) n += s.size;
    return n;
  }

  const fakeDate = Object.assign(
    function DateMock(...args) {
      return new Date(...args);
    },
    { now: () => nowMs }
  );

  const fakeSetTimeout = (fn, ms = 0) => {
    const id = nextTimerId++;
    timers.set(id, { id, fn, runAt: nowMs + Math.max(0, Number(ms) || 0) });
    return id;
  };
  const fakeClearTimeout = (id) => timers.delete(id);
  const fakeRaf = (fn) => {
    const id = nextRafId++;
    rafs.set(id, fn);
    return id;
  };
  const fakeCancelRaf = (id) => rafs.delete(id);

  function advanceTime(ms) {
    const target = nowMs + ms;
    while (true) {
      let earliest = null;
      for (const t of timers.values()) {
        if (t.runAt <= target && (!earliest || t.runAt < earliest.runAt)) earliest = t;
      }
      if (!earliest) break;
      timers.delete(earliest.id);
      nowMs = earliest.runAt;
      earliest.fn();
    }
    nowMs = target;
  }

  function flushRaf() {
    const pending = Array.from(rafs.entries());
    rafs.clear();
    for (const [, fn] of pending) fn(nowMs);
  }

  class MockMutationObserver {
    constructor(cb) {
      this._cb = cb;
      this._observed = [];
    }
    observe(target, opts) {
      this._observed.push({ target, opts: opts || {} });
      observers.add(this);
    }
    disconnect() {
      this._observed.length = 0;
      observers.delete(this);
    }
  }

  class MockResizeObserver {
    constructor(cb) {
      this._cb = cb;
      this._observed = new Set();
    }
    observe(target) {
      if (target) this._observed.add(target);
      resizeObservers.add(this);
    }
    unobserve(target) {
      this._observed.delete(target);
      if (this._observed.size === 0) resizeObservers.delete(this);
    }
    disconnect() {
      this._observed.clear();
      resizeObservers.delete(this);
    }
  }

  const storageMap = new Map();
  const windowObj = {
    document: documentObj,
    location: { href },
    navigator: { language: lang },
    performance: { now: () => nowMs },
    devicePixelRatio: 1,
    innerWidth: 1360,
    innerHeight: 860,
    localStorage: {
      getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
      setItem: (k, v) => storageMap.set(k, String(v)),
    },
    getComputedStyle: () => ({ borderRadius: '8px', display: 'flex', flexDirection: 'column' }),
    matchMedia: () => ({ matches: false }),
    MutationObserver: MockMutationObserver,
    ResizeObserver: MockResizeObserver,
    setTimeout: fakeSetTimeout,
    clearTimeout: fakeClearTimeout,
    requestAnimationFrame: fakeRaf,
    cancelAnimationFrame: fakeCancelRaf,
    addEventListener(type, fn, opts) {
      const cap = typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture);
      const bucket = cap ? winCaptureListeners : winBubbleListeners;
      if (!bucket.has(type)) bucket.set(type, new Set());
      bucket.get(type).add(fn);
    },
    removeEventListener(type, fn, opts) {
      const cap = typeof opts === 'boolean' ? opts : Boolean(opts && opts.capture);
      const bucket = cap ? winCaptureListeners : winBubbleListeners;
      bucket.get(type)?.delete(fn);
    },
    dispatchEvent(evObj) {
      const ev = evObj && evObj.type ? evObj : createEventObj('resize', {}, windowObj);
      ev.target = ev.target || windowObj;
      for (const fn of Array.from(winCaptureListeners.get(ev.type) || [])) fn.call(windowObj, ev);
      for (const fn of Array.from(winBubbleListeners.get(ev.type) || [])) fn.call(windowObj, ev);
      return !ev.defaultPrevented;
    },
  };
  windowObj.window = windowObj;
  windowObj.self = windowObj;
  windowObj.top = windowObj;

  const sandbox = {
    window: windowObj,
    self: windowObj,
    top: windowObj,
    document: documentObj,
    MutationObserver: MockMutationObserver,
    ResizeObserver: MockResizeObserver,
    Date: fakeDate,
    setTimeout: fakeSetTimeout,
    clearTimeout: fakeClearTimeout,
    requestAnimationFrame: fakeRaf,
    cancelAnimationFrame: fakeCancelRaf,
    Float32Array,
    Uint16Array,
    Uint8Array,
    Map,
    Set,
    Array,
    Object,
    String,
    Number,
    Boolean,
    Math,
    JSON,
    RegExp,
    Error,
    Promise,
    WeakMap,
    parseFloat,
    parseInt,
    atob: (b64) => Buffer.from(String(b64), 'base64').toString('binary'),
    console,
  };
  sandbox.globalThis = sandbox;
  windowObj.globalThis = sandbox;
  vm.createContext(sandbox);

  return {
    sandbox,
    window: windowObj,
    document: documentObj,
    body,
    html,
    head,
    makeElement,
    createTextNode,
    createEventObj,
    advanceTime,
    flushRaf,
    now: () => nowMs,
    getCounts: () => ({
      docListeners: countListeners(docCaptureListeners) + countListeners(docBubbleListeners),
      winListeners: countListeners(winCaptureListeners) + countListeners(winBubbleListeners),
      activeTimers: timers.size,
      activeRafs: rafs.size,
      activeObservers: observers.size + resizeObservers.size,
    }),
  };
}

function loadAllModulesInSandbox(env) {
  vm.runInContext(fs.readFileSync(GRAIN_FILE, 'utf8'), env.sandbox);
  vm.runInContext(fs.readFileSync(OLED_FILE, 'utf8'), env.sandbox);
  vm.runInContext(fs.readFileSync(KB3D_FILE, 'utf8'), env.sandbox);
  vm.runInContext(fs.readFileSync(CONSOLE_FILE, 'utf8'), env.sandbox);
  return {
    grain: env.sandbox.PrismPeriodicGrainAssets,
    oled: env.sandbox.PrismPeriodicOledScreen,
    kb3d: env.sandbox.PrismPeriodicKeyboard3D,
    consoleSdk: env.sandbox.PrismPeriodicConsole,
  };
}

function walkRepoFiles(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === '.git' || ent.name === 'node_modules' || ent.name === '.qa-screenshots') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkRepoFiles(full, list);
    else list.push(full);
  }
  return list;
}

/* ============================================================================
 * 1. Repository-Wide De-Sensitization, Copyright Header, Pure LF & Binary Gate
 * ============================================================================ */

test('1. Repository-wide de-sensitization audit (ALL files), proprietary copyright headers, pure LF, and clean binary assets', () => {
  const allFiles = walkRepoFiles(ROOT_DIR);
  assert.ok(allFiles.length >= 25, `Expected complete repository file tree, found ${allFiles.length} files`);

  // Construct forbidden identifier tokens via array joins so this test file itself contains zero literal hits
  const forbiddenLiteralTokens = [
    ['_rd', 'Ag', 'Fiber'].join(''),
    ['__react', 'Fiber'].join(''),
    ['__react', 'Props'].join(''),
    ['__reactInternal', 'Instance'].join(''),
    ['setPref', 'Value'].join(''),
    ['unwrapped', 'SetSelectedModel'].join(''),
    ['setModelConfig', 'ByLabel'].join(''),
    ['setCurrent', 'ModelConfig'].join(''),
    ['visibleModel', 'Configs'].join(''),
    ['conversation', '-view'].join(''),
    ['agent-input', '-box'].join(''),
    ['radix', '-popper'].join(''),
    ['Admin', 'istrator'].join(''),
    ['workspace', '_program'].join(''),
    ['config', '.json'].join(''),
    ['model-hub', '.config'].join(''),
    ['obsidian-prism', '-thought'].join(''),
    ['Anti', 'gravity'].join(''),
    ['prism-rim', '-canvas'].join(''),
    ['conv-', 'aura'].join(''),
    ['__ag', 'Prism'].join(''),
  ];

  const winDrivePathRe = new RegExp('(?:^|[^A-Za-z0-9_])[A-Za-z]:\\\\(?!s\\*)');
  const unixHomePathRe = new RegExp('\\/(?:Users|home)\\/[A-Za-z0-9._-]+');
  const uuidRe = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
  const apiKeyRe = /\b(?:AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{32,}|ghp_[A-Za-z0-9]{36})\b/;

  const binaryExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff2']);

  for (const fp of allFiles) {
    const rel = path.relative(ROOT_DIR, fp).replace(/\\/g, '/');
    const ext = path.extname(fp).toLowerCase();

    if (binaryExts.has(ext)) {
      const buf = fs.readFileSync(fp);
      assert.ok(buf.length > 1024, `Binary asset ${rel} should be non-empty`);
      if (ext === '.woff2') {
        assert.equal(
          buf.subarray(0, 4).toString('ascii'),
          'wOF2',
          `Font asset ${rel} must carry valid WOFF2 header signature`
        );
      } else if (ext === '.png') {
        assert.equal(
          buf.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
          true,
          `PNG asset ${rel} must carry valid 8-byte PNG signature`
        );
        let off = 8;
        let sawIhdr = false;
        let sawIend = false;
        let pngW = 0;
        let pngH = 0;
        while (off + 12 <= buf.length) {
          const len = buf.readUInt32BE(off);
          const chunkType = buf.subarray(off + 4, off + 8).toString('ascii');
          assert.equal(
            /^(?:tEXt|iTXt|zTXt|eXIf|caBX)$/i.test(chunkType),
            false,
            `PNG asset ${rel} must strip metadata chunk "${chunkType}"`
          );
          if (chunkType === 'IHDR') {
            sawIhdr = true;
            pngW = buf.readUInt32BE(off + 8);
            pngH = buf.readUInt32BE(off + 12);
          }
          off += 12 + len;
          if (chunkType === 'IEND') {
            sawIend = true;
            break;
          }
        }
        assert.equal(sawIhdr && sawIend, true, `PNG asset ${rel} must have complete IHDR and IEND chunks`);
        if (
          rel === 'assets/renders/render-13-exhibition-hero-obsidian.png' ||
          rel === 'assets/renders/render-14-exhibition-hero-alabaster.png'
        ) {
          assert.equal(
            pngW === 2880 && pngH === 1800,
            true,
            `Exhibition hero render ${rel} must be a 2x Retina 2880x1800 capture, got ${pngW}x${pngH}`
          );
        }
      } else if (ext === '.jpg' || ext === '.jpeg') {
        const ascii = buf.toString('latin1');
        assert.equal(
          ascii.includes('Exif\0') || ascii.includes('http://ns.adobe.com/xap') || ascii.includes('c2pa'),
          false,
          `JPEG asset ${rel} must contain zero EXIF/XMP/C2PA metadata`
        );
      }
      continue;
    }

    const text = fs.readFileSync(fp, 'utf8');
    assert.equal(text.includes('\r'), false, `${rel} must use pure LF line endings (CR === 0)`);

    for (const tok of forbiddenLiteralTokens) {
      assert.equal(text.includes(tok), false, `${rel} must contain zero private token "${tok}"`);
    }
    assert.equal(winDrivePathRe.test(text), false, `${rel} must contain zero local Windows drive paths`);
    assert.equal(unixHomePathRe.test(text), false, `${rel} must contain zero local Unix home paths`);
    assert.equal(uuidRe.test(text), false, `${rel} must contain zero non-synthetic UUIDs`);
    assert.equal(apiKeyRe.test(text), false, `${rel} must contain zero API keys or tokens`);
  }

  // Verify every src/*.js file carries proprietary copyright header + zero unsafe DOM/eval sinks
  const unsafeSinkRe = new RegExp(
    '\\b(?:' +
      ['inner', 'HTML'].join('') +
      '|' +
      ['outer', 'HTML'].join('') +
      '|' +
      ['insertAdjacent', 'HTML'].join('') +
      '|document\\.write|eval\\s*\\(|new\\s+Function)\\b'
  );

  for (const srcName of ['pbr-grain-assets.js', 'oled-cyber-screen.js', 'keyboard-3d-gl.js', 'periodic-console.js']) {
    const raw = fs.readFileSync(path.join(SRC_DIR, srcName), 'utf8');
    const headSlice = raw.slice(0, 800);
    assert.ok(headSlice.includes('RMvdesi'), `src/${srcName} header must credit RMvdesi`);
    assert.ok(headSlice.includes('All Rights Reserved'), `src/${srcName} header must state All Rights Reserved`);
    assert.ok(headSlice.includes('Obsidian Prism'), `src/${srcName} header must credit Obsidian Prism`);
    assert.equal(unsafeSinkRe.test(raw), false, `src/${srcName} must contain zero unsafe HTML/eval sinks`);
  }

  const showcaseRaw = fs.readFileSync(path.join(ROOT_DIR, 'showcase', 'showcase.js'), 'utf8');
  assert.ok(showcaseRaw.slice(0, 600).includes('RMvdesi'), 'showcase/showcase.js header must credit RMvdesi');
  assert.equal(unsafeSinkRe.test(showcaseRaw), false, 'showcase/showcase.js must contain zero unsafe HTML/eval sinks');

  // Verify 3D CNC hardware laser engraving remains strictly pure
  const kb3dSrc = fs.readFileSync(KB3D_FILE, 'utf8');
  assert.ok(kb3dSrc.includes('PRISM-118 // CNC-6063'), '3D chassis laser engraving must remain PRISM-118 // CNC-6063');
  assert.ok(kb3dSrc.includes('AUX-06'), '3D macro pad engraving must remain AUX-06');

  // Verify embedded 18 WebP data URIs in pbr-grain-assets.js contain zero C2PA/EXIF/XMP RIFF chunks
  const grainMod = require(GRAIN_FILE);
  for (const [poolName, pool] of [
    ['dark', grainMod.OLED_WALLPAPERS],
    ['light', grainMod.OLED_WALLPAPERS_LIGHT],
  ]) {
    const keys = Object.keys(pool);
    assert.equal(keys.length, 9, `Expected 9 ${poolName} baked banners (8 active + 1 standby), got ${keys.length}`);
    for (const k of keys) {
      const uri = pool[k];
      assert.ok(uri.startsWith('data:image/webp;base64,'), `Expected WebP data URI for ${poolName}:${k}`);
      const buf = Buffer.from(uri.slice('data:image/webp;base64,'.length), 'base64');
      let pos = 12;
      while (pos + 8 <= buf.length) {
        const fourcc = buf.subarray(pos, pos + 4).toString('ascii');
        const sz = buf.readUInt32LE(pos + 4);
        assert.equal(/^(?:JUMB|C2PA|XMP |EXIF)$/i.test(fourcc), false, `Embedded WebP ${poolName}:${k} must have 0 ${fourcc}`);
        pos += 8 + sz + (sz % 2);
      }
    }
  }
});

/* ============================================================================
 * 2. Periodic Table 90-Slot Matrix & Model Matching
 * ============================================================================ */

test('2. ELEMENTS_90 periodic coordinates and strict Google element vs. AUX-06 model matching', () => {
  const sdk = require(CONSOLE_FILE);
  assert.equal(sdk.ELEMENTS_90.length, 90);

  const coords = new Set();
  for (const slot of sdk.ELEMENTS_90) {
    const key = `${slot.row}:${slot.col}`;
    assert.equal(coords.has(key), false, `Duplicate periodic coordinate ${key}`);
    coords.add(key);
  }

  const matchedElements = sdk.matchGoogleElementModels(sdk.DEFAULT_MODELS);
  assert.deepEqual(
    matchedElements.map((e) => e.slotZ),
    [1, 6, 10, 18],
    'Must match 1H Hydrogen, 6C Carbon, 10Ne Neon, and 18Ar Argon'
  );

  const auxSlots = sdk.matchAuxModels(sdk.DEFAULT_MODELS, null, sdk.DEFAULT_ORCHESTRATOR_PLANNERS);
  assert.equal(auxSlots.length, 6, 'AUX-06 macro pad must expose 6 physical slots');
  assert.equal(auxSlots[0].id, 'orchestrator');
  assert.equal(auxSlots[0].available, true);
  assert.equal(auxSlots[1].id, 'flash');
  assert.equal(auxSlots[2].id, 'claude-opus');
  assert.equal(auxSlots[3].id, 'claude-sonnet');
  assert.equal(auxSlots[4].id, 'gpt-oss');
  assert.equal(auxSlots[5].available, false, '6th AUX slot remains reserved matte blind key');
});

/* ============================================================================
 * 3. Declarative SDK Mount, Triptych Structure & Typing Guard
 * ============================================================================ */

test('3. Standalone PrismPeriodicConsole.mount(): fail-closed off mode, triptych DOM, 512K telemetry & typing guard', () => {
  const env = createExhibitionSandbox({ mock2d: true, mockWebGL2: true });
  const { consoleSdk } = loadAllModulesInSandbox(env);

  // Off mode is strictly fail-closed
  const offInst = consoleSdk.mount({ root: env.window, doc: env.document, mode: 'off' });
  assert.equal(offInst.getStatus().status, 'off');
  assert.equal(offInst.open(), false);
  offInst.destroy();
  assert.equal(env.getCounts().docListeners, 0);

  // Mount standard declarative console into [data-prism-dock-host]
  const dockHost = env.makeElement('div', { className: 'flex-col', attrs: { 'data-prism-dock-host': '1' } });
  const composer = env.makeElement('div', { attrs: { 'data-prism-composer': '1' } });
  const textInput = env.makeElement('input', { attrs: { type: 'text' } });
  const triggerBtn = env.makeElement('button', {
    attrs: { 'data-prism-trigger': '1' },
    text: 'Gemini 4 Carbon (High)',
  });
  composer.appendChild(textInput);
  composer.appendChild(triggerBtn);
  env.body.appendChild(composer);
  env.body.appendChild(dockHost);

  const inst = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    trigger: triggerBtn,
    mountContainer: dockHost,
    composerEl: composer,
    telemetry: { usedTokens: 142336, maxTokens: 524288, cacheHitRate: 0.94, tps: 148 },
    autoOpen: true,
  });

  assert.equal(inst.isOpen(), true);
  const rootEl = env.document.getElementById('prism-periodic-console-root');
  assert.ok(rootEl, 'Console root must mount when autoOpen is true');
  assert.equal(rootEl.parentElement, dockHost, 'Drawer mode must mount inside [data-prism-dock-host]');
  assert.equal(rootEl.getAttribute('data-in-flow'), '1');

  // Verify Triptych wings + 90 element hit keys + 6 aux hit keys + zero 256K legacy text
  const specCard = rootEl.querySelector('[data-testid="pp-bento-spec-card"]');
  const telePod = rootEl.querySelector('[data-testid="pp-bento-telemetry-pod"]');
  assert.ok(specCard && telePod, 'Both MOD-01 spec card and MOD-02 telemetry pod must exist');
  assert.equal(rootEl.querySelectorAll('.pp-key').length, 90);
  assert.equal(rootEl.querySelectorAll('.pp-aux-key').length, 6);
  assert.ok(telePod.textContent.includes('512K'), 'MOD-02 must display 512K context window');
  assert.equal(/256k/i.test(telePod.textContent), false, 'MOD-02 must contain zero 256K hardcode');

  // Typing f, r, Space inside focused input MUST NOT trigger fullscreen/reset/confirm shortcuts
  textInput.focus();
  for (const key of ['f', 'F', 'r', ' ', 'Enter']) {
    const allowed = textInput.dispatchEvent(env.createEventObj('keydown', { key, bubbles: true, cancelable: true }, textInput));
    if (key !== 'Enter') {
      assert.equal(allowed, true, `Key "${key}" inside input must not be intercepted`);
    }
  }
  assert.equal(inst.getStageMode(), 'drawer', 'Typing "f" in input must not flip stageMode to fullscreen');
  assert.equal(inst.isOpen(), true, 'Typing in input must keep console open');

  inst.destroy();
  assert.equal(env.document.getElementById('prism-periodic-console-root'), null);
  assert.deepEqual(env.getCounts(), {
    docListeners: 0,
    winListeners: 0,
    activeTimers: 0,
    activeRafs: 0,
    activeObservers: 0,
  });
});

/* ============================================================================
 * 4. Theme-Native 1px Hairline Mini-Badge & Dual Invocation
 * ============================================================================ */

test('4. 1px hairline mini-badge (.pp-mini-keycap): 4 themes × 5 accents, smart codes, badge-click toggle & 420ms hold', () => {
  const env = createExhibitionSandbox();
  const { consoleSdk } = loadAllModulesInSandbox(env);

  const labelNode = env.createTextNode('Gemini 4 Carbon (High)');
  const triggerBtn = env.makeElement('button', {
    attrs: { 'data-prism-trigger': '1' },
    useChildNodes: true,
  });
  triggerBtn.appendChild(labelNode);
  env.body.appendChild(triggerBtn);

  let menuDismissCount = 0;
  const inst = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    trigger: triggerBtn,
    onDismissMenu: () => {
      menuDismissCount += 1;
    },
  });

  // Sweep 4 themes × 5 accents
  for (const kit of ['obsidian', 'warm', 'crystal', 'alabaster']) {
    for (const acc of ['follow', 'cobalt', 'iris', 'amber', 'mono']) {
      const profile = inst.setTheme(kit, acc);
      assert.ok(profile);
      const badge = triggerBtn.querySelector('.pp-mini-keycap');
      assert.ok(badge, `Expected .pp-mini-keycap for ${kit}/${acc}`);
      const bg = badge.style.getPropertyValue('--mk-bg');
      const alphaMatch = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/.exec(bg);
      assert.ok(alphaMatch && parseFloat(alphaMatch[1]) <= 0.12, `Expected subtle <=0.12 alpha surface, got ${bg}`);
      assert.equal(badge.style.getPropertyValue('--mk-skirt'), '');
    }
  }

  // Verify smart non-redundant badge codes
  inst.setTheme('obsidian', 'follow');
  for (const [modelId, expectedCode] of [
    ['gemini-4-hydrogen-high', '1H'],
    ['gemini-4-carbon-high', '6C'],
    ['gemini-4-neon-high', '10Ne'],
    ['gemini-4-argon-high', '18Ar'],
    ['claude-opus-5-5-high', 'OP'],
    ['claude-sonnet-5-5-high', 'SN'],
    ['gemini-3.8-flash-high', 'FL'],
    ['gpt-oss-120b-high', 'GP'],
    ['prism-orchestrator', '0·6C'],
  ]) {
    assert.equal(inst.selectModel(modelId), true);
    labelNode.nodeValue = inst.getSelectedModel().label;
    inst.syncBadges();
    const badge = triggerBtn.querySelector('.pp-mini-keycap');
    assert.ok(badge);
    assert.equal(badge.textContent, expectedCode, `Expected badge "${expectedCode}" for ${modelId}`);
    assert.equal(triggerBtn.childNodes[0], labelNode, 'Original text node reference must stay intact');
  }

  // Short <110ms press on button label leaves native click untouched
  inst.selectModel('gemini-4-carbon-high');
  labelNode.nodeValue = 'Gemini 4 Carbon (High)';
  inst.syncBadges();
  let nativeClicks = 0;
  triggerBtn.addEventListener('click', () => {
    nativeClicks += 1;
  });
  triggerBtn.dispatchEvent(env.createEventObj('pointerdown', { button: 0, clientX: 110, clientY: 110 }, triggerBtn));
  env.advanceTime(60);
  env.document.dispatchEvent(env.createEventObj('pointerup', { button: 0 }, triggerBtn));
  triggerBtn.click();
  assert.equal(nativeClicks, 1, '<110ms short click on label must pass through untouched');
  assert.equal(inst.isOpen(), false);

  // Clicking the 1px .pp-mini-keycap directly toggles the console open & closed
  const miniBadge = triggerBtn.querySelector('.pp-mini-keycap');
  miniBadge.click();
  assert.equal(inst.isOpen(), true, 'Clicking .pp-mini-keycap while closed must open console');
  assert.equal(nativeClicks, 1, 'Clicking .pp-mini-keycap must not trigger external dropdown click');

  miniBadge.dispatchEvent(env.createEventObj('pointerdown', { button: 0 }, miniBadge));
  assert.equal(inst.isOpen(), false, 'Clicking .pp-mini-keycap while open must close console');

  // 420ms press-and-hold spawns radial hold ring at 110ms and opens console at 420ms
  triggerBtn.dispatchEvent(env.createEventObj('pointerdown', { button: 0, clientX: 110, clientY: 110 }, triggerBtn));
  env.advanceTime(115);
  assert.ok(env.document.querySelector('.pp-hold-ring'), 'Radial hold ring must appear after 110ms');
  env.advanceTime(320);
  assert.equal(inst.isOpen(), true, 'Holding 420ms must open console');
  assert.equal(env.document.querySelector('.pp-hold-ring'), null, 'Hold ring must clean up upon open');
  assert.ok(menuDismissCount >= 1);

  inst.destroy();
});

/* ============================================================================
 * 5. Selection Callbacks, #0 Orch Dual-Core Latch, Hover Dual-Radar & Rollback
 * ============================================================================ */

test('5. #0 Orch mechanical latch, orchestratorPlanners whitelist, hover dual-radar compare, 115ms slam & Escape rollback', () => {
  const env = createExhibitionSandbox({ mock2d: true, mockWebGL2: true });
  const { consoleSdk } = loadAllModulesInSandbox(env);

  const selectedEvents = [];
  const effortEvents = [];
  const orchEvents = [];

  const inst = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    selectedModel: 'gemini-4-carbon-high',
    confirmSlamMs: 115,
    autoOpen: true,
    onSelectModel: (m, meta) => selectedEvents.push({ label: m.label, meta }),
    onSelectEffort: (eff, m) => effortEvents.push({ eff, label: m.label }),
    onToggleOrchestrator: (latched, planner) => orchEvents.push({ latched, planner: planner && planner.label }),
  });

  const rootEl = env.document.getElementById('prism-periodic-console-root');

  // Hover 10Ne key via 3D stage pointermove -> verify MOD-01 Ghost Dual-Radar comparison & signed delta tags
  for (let i = 0; i < 160 && env.getCounts().activeRafs > 0; i += 1) {
    env.advanceTime(16);
    env.flushRaf();
  }
  const stageEl = rootEl.querySelector('.pp-stage');
  const stageRect = stageEl.getBoundingClientRect();
  const neKeyProj = inst.getProjectedRects().availableKeys.find((k) => k.z === 10);
  assert.ok(neKeyProj, 'Expected projected 10Ne key rect');
  const specCard = rootEl.querySelector('[data-testid="pp-bento-spec-card"]');
  rootEl.dispatchEvent(
    env.createEventObj('pointermove', {
      clientX: stageRect.left + neKeyProj.cx,
      clientY: stageRect.top + neKeyProj.cy,
      bubbles: true,
    })
  );
  assert.equal(specCard.getAttribute('data-comparing'), '1', 'Hovering 10Ne must activate dual-radar compare');
  assert.ok(specCard.querySelector('polygon[data-radar-role="compare"]'), 'Hover compare must overlay dashed compare polygon');
  const nonEmptyDeltas = Array.from(specCard.querySelectorAll('.pp-delta-tag')).filter((d) => d.textContent.trim().length > 0);
  assert.ok(nonEmptyDeltas.length >= 2, 'Hover compare must render signed delta tags');
  rootEl.dispatchEvent(env.createEventObj('pointerleave', { clientX: 0, clientY: 0, bubbles: false }));
  assert.equal(specCard.querySelector('polygon[data-radar-role="compare"]'), null);

  const key10 = rootEl.querySelector('button.pp-key[data-z="10"]');

  // Click 10Ne -> levitates 10Ne & fires onSelectModel; step effort to 'xhigh' -> fires onSelectEffort
  key10.click();
  assert.equal(inst.getStatus().selectedZ, 10);
  assert.equal(selectedEvents[selectedEvents.length - 1].label, 'Gemini 4 Neon (High)');

  const extraEffortBtn = rootEl.querySelector('button[data-bento-effort="xhigh"]');
  assert.ok(extraEffortBtn);
  extraEffortBtn.click();
  assert.equal(effortEvents.length, 1);
  assert.equal(effortEvents[0].eff, 'xhigh');

  // Engage #0 Orch mechanical latching switch (AUX index 0)
  const aux0 = rootEl.querySelector('button.pp-aux-key[data-aux-index="0"]');
  const key1H = rootEl.querySelector('button.pp-key[data-z="1"]');
  assert.equal(key1H.getAttribute('data-available'), '1', '1H is available before #0 Orch latch');

  aux0.click();
  assert.equal(inst.getStatus().orchLatched, true);
  assert.equal(rootEl.getAttribute('data-orch-latched'), '1');
  assert.equal(key1H.getAttribute('data-available'), '0', 'Non-planner 1H must lock when #0 Orch is latched');
  const topo = rootEl.querySelector('[data-testid="pp-dualcore-topology"]');
  assert.ok(topo && topo.textContent.includes('1H'), 'MOD-02 must display Dual-Core planner + 1H executor topology');
  assert.equal(orchEvents[orchEvents.length - 1].latched, true);

  // Escape rolls back session to initial Gemini 4 Carbon (High) standalone state
  env.document.dispatchEvent(env.createEventObj('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  assert.equal(inst.isOpen(), false);
  assert.equal(inst.getSelectedModel().modelId, 'gemini-4-carbon-high', 'Escape must rollback uncommitted selection');

  // Re-open and verify second click on active 6C triggers 115ms bottom-out slam then closes
  inst.open();
  const rootEl2 = env.document.getElementById('prism-periodic-console-root');
  const key6 = rootEl2.querySelector('button.pp-key[data-z="6"]');
  key6.click();
  assert.equal(inst.getStatus().confirmClosing, true);
  assert.equal(inst.getStatus().confirmSlamZ, 6);
  env.advanceTime(120);
  assert.equal(inst.isOpen(), false);

  inst.destroy();
});

/* ============================================================================
 * 6. 79 Au Raw-Quartz Standby Banners & 16px Frosted Ice-Fog Diffusion
 * ============================================================================ */

test('6. Dedicated 79 Au raw-quartz standby banners (zero 6C fallback) & 16px ice-fog non-planner diffusion', () => {
  const env = createExhibitionSandbox({ mock2d: true });
  const drawn = [];

  class SyncImg {
    constructor() {
      this._src = '';
      this.complete = false;
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      this.width = 0;
      this.height = 0;
      this.onload = null;
    }
    set src(v) {
      this._src = String(v || '');
      this.complete = Boolean(this._src);
      this.naturalWidth = this._src ? 960 : 0;
      this.naturalHeight = this._src ? 288 : 0;
      this.width = this.naturalWidth;
      this.height = this.naturalHeight;
      if (this._src && typeof this.onload === 'function') this.onload();
    }
    get src() {
      return this._src;
    }
  }
  env.window.Image = SyncImg;
  env.sandbox.Image = SyncImg;

  const { grain, oled } = loadAllModulesInSandbox(env);
  assert.notEqual(grain.OLED_WALLPAPERS.standby, grain.OLED_WALLPAPERS['6']);
  assert.notEqual(grain.OLED_WALLPAPERS_LIGHT.standby, grain.OLED_WALLPAPERS_LIGHT['6']);

  const painter = oled.createOledScreenPainter({
    width: 1600,
    height: 480,
    doc: env.document,
    root: env.window,
    lazyWallpapers: true,
  });
  const ctx = painter.getCanvas()._ctx2d;
  const origDraw = ctx.drawImage;
  ctx.drawImage = function (img, dx, dy, dw, dh) {
    drawn.push({ src: img && img.src ? img.src : 'offscreen', filter: this.filter, dx, dy, dw, dh });
    return origDraw.call(this, img, dx, dy, dw, dh);
  };

  // 79 Au standby dark & light
  const goldDeck = { z: 79, numLabel: '79', symbol: 'Au', elementEn: 'Gold', title: '79 Au · Gold', isAvailable: false, blindFlash: true, levels: [] };
  painter.render(goldDeck, { id: 'obsidian-dark', isLight: false, isMono: false, reducedMotion: true }, { now: 100 });
  assert.equal(drawn[0].src, grain.OLED_WALLPAPERS.standby);
  assert.equal(drawn[0].filter, 'none');

  drawn.length = 0;
  painter.render(goldDeck, { id: 'alabaster-light', isLight: true, isMono: false, reducedMotion: true }, { now: 200 });
  assert.equal(drawn[0].src, grain.OLED_WALLPAPERS_LIGHT.standby);

  // #0 Orch locked 1H Hydrogen -> 16px Gaussian blur + 92% desaturation + 4-edge overscan bleed
  drawn.length = 0;
  const locked1H = { z: 1, numLabel: '1', symbol: 'H', title: 'Gemini 4 Hydrogen', isAvailable: false, orchLatched: true, orchUnsupported: true, levels: [] };
  painter.render(locked1H, { id: 'obsidian-dark', isLight: false, isMono: false, reducedMotion: true }, { now: 300 });
  assert.ok(drawn[0].filter.includes('blur(16px)') && drawn[0].filter.includes('saturate(0.08)'));
  assert.ok(drawn[0].dx <= -80 && drawn[0].dy <= -40 && drawn[0].dh >= 560);

  painter.dispose();
  oled.evictIdleOledWallpapers(env.window);
});

/* ============================================================================
 * 7. WebGL2 5-10-4-5-1 Budget, 360° Orbit, Raycast Pick & 0fps Convergence
 * ============================================================================ */

test('7. WebGL2 renderer: strict 5-10-4-5-1 GPU budget, 90+6 raycast pick(), 360° orbit, <180-frame 0fps & 100% dispose()', () => {
  const env = createExhibitionSandbox({ mock2d: true, mockWebGL2: true });
  const { kb3d, consoleSdk } = loadAllModulesInSandbox(env);

  const canvas = env.document.createElement('canvas');
  env.body.appendChild(canvas);

  const renderer = kb3d.createKeyboard3DRenderer({
    canvas,
    doc: env.document,
    root: env.window,
    slots: consoleSdk.ELEMENTS_90,
  });

  assert.equal(renderer.getRendererMode(), 'webgl2');
  renderer.resize(1200, 620, 2, { left: 0, top: 0, width: 1200, height: 620 });
  renderer.setState({
    stageMode: 'fullscreen',
    themeProfile: { id: 'obsidian-dark', theme: 'dark', isLight: false, accent: 'follow', rimTone: 'default', isMono: false },
    availableZSet: new Set([1, 6, 10, 18]),
    selectedZ: 6,
    orchLatched: true,
    deck: { z: 6, symbol: 'C', title: 'Gemini 4 Carbon', activeEffort: 'high', levels: [{ effort: 'low' }, { effort: 'medium' }, { effort: 'high' }] },
    auxSlots: consoleSdk.matchAuxModels(consoleSdk.DEFAULT_MODELS, null, consoleSdk.DEFAULT_ORCHESTRATOR_PLANNERS),
  });

  renderer.step(env.now());
  const glStats = canvas._gl._stats();
  assert.equal(glStats.created.programs.size, 5, 'Must cap at 5 WebGLPrograms');
  assert.equal(glStats.created.shaders.size, 10, 'Must cap at 10 WebGLShaders');
  assert.equal(glStats.created.vaos.size, 4, 'Must cap at 4 VAOs');
  assert.equal(glStats.created.textures.size, 5, 'Must cap at 5 VRAM Textures');
  assert.equal(glStats.created.framebuffers.size, 1, 'Must cap at 1 Shadow FBO');
  assert.equal(glStats.shadowTexAllocations[0].width, 2048);

  // Verify projected hit rects & raycast pick()
  const rects = renderer.getInteractiveProjectedRects();
  assert.equal(rects.keys.length, 90);
  assert.equal(rects.auxKeys.length, 6);
  const c6Rect = rects.keys.find((k) => k.z === 6);
  const picked6 = renderer.pick(c6Rect.left + c6Rect.width * 0.5, c6Rect.top + c6Rect.height * 0.5);
  assert.ok(picked6 && picked6.kind === 'key' && picked6.z === 6);

  // Verify 360° orbit drag & <180-frame convergence to 0fps idle sleep
  renderer.dragChassisOrbitDelta(120, -60, 0.0046, 0.0046);
  renderer.endChassisOrbitDrag(0, 0);
  assert.equal(renderer.getChassisOrbit().isRotated, true);
  renderer.resetChassisOrbit();

  let settled = false;
  for (let frame = 0; frame < 180; frame += 1) {
    if (renderer.step(0.016)) {
      settled = true;
      break;
    }
  }
  assert.equal(settled, true, 'WebGL2 renderer must converge to 0fps idle within <180 frames');
  assert.equal(renderer.isIdle(), true);
  assert.equal(env.getCounts().activeRafs, 0, '0fps idle must leave 0 active requestAnimationFrame callbacks');

  // Verify 100% GPU resource deletion on dispose()
  renderer.dispose();
  const glStatsAfter = canvas._gl._stats();
  assert.equal(glStatsAfter.deleted.programs.size, 5);
  assert.equal(glStatsAfter.deleted.shaders.size, 10);
  assert.equal(glStatsAfter.deleted.vaos.size, 4);
  assert.equal(glStatsAfter.deleted.textures.size, 5);
  assert.equal(glStatsAfter.deleted.framebuffers.size, 1);
  assert.equal(glStatsAfter.loseContextCalls, 1);
});

/* ============================================================================
 * 8. Cold-Start Zero Overhead, 120ms Pre-Warm, 90s Eviction & Edge Cases
 * ============================================================================ */

test('8. Cold-start 0 decode, 120ms hold pre-warm, 90s dual cache eviction, short-viewport clamp & idempotent destroy()', () => {
  let glCount = 0;
  let imgCount = 0;
  let audioSuspendCount = 0;

  const env = createExhibitionSandbox({ mock2d: true, mockWebGL2: true });
  const baseCreate = env.document.createElement.bind(env.document);
  env.document.createElement = function (tag) {
    const el = baseCreate(tag);
    if (String(tag).toLowerCase() === 'canvas') {
      const origGc = el.getContext.bind(el);
      el.getContext = function (k, o) {
        if (k === 'webgl2') glCount += 1;
        return origGc(k, o);
      };
    }
    return el;
  };

  class TrackedImg {
    constructor() {
      imgCount += 1;
      this._src = '';
      this.complete = false;
      this.naturalWidth = 0;
      this.naturalHeight = 0;
    }
    set src(v) {
      this._src = String(v || '');
      this.complete = Boolean(this._src);
      this.naturalWidth = this._src ? 960 : 0;
      this.naturalHeight = this._src ? 288 : 0;
    }
    get src() {
      return this._src;
    }
  }
  class TrackedAudio {
    constructor() {
      this.state = 'running';
      this.sampleRate = 44100;
      this.currentTime = 0;
      this.destination = {};
    }
    suspend() {
      audioSuspendCount += 1;
      this.state = 'suspended';
    }
    resume() {
      this.state = 'running';
    }
    close() {
      this.state = 'closed';
    }
    createBuffer(_c, len, sr) {
      return { sampleRate: sr, getChannelData: () => new Float32Array(len) };
    }
    createBufferSource() {
      return { buffer: null, connect() {}, start() {}, stop() {} };
    }
    createOscillator() {
      return { type: 'sine', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} };
    }
    createBiquadFilter() {
      return { type: 'lowpass', frequency: { setValueAtTime() {}, value: 1000 }, Q: { setValueAtTime() {}, value: 1 }, connect() {} };
    }
    createGain() {
      return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} };
    }
  }
  env.window.Image = TrackedImg;
  env.sandbox.Image = TrackedImg;
  env.window.AudioContext = TrackedAudio;
  env.sandbox.AudioContext = TrackedAudio;

  const { grain, consoleSdk } = loadAllModulesInSandbox(env);
  grain.evictGrainTextures();

  const triggerBtn = env.makeElement('button', {
    attrs: { 'data-prism-trigger': '1' },
    text: 'Gemini 4 Carbon (High)',
  });
  env.body.appendChild(triggerBtn);

  // Edge case: empty models array gracefully falls back to DEFAULT_MODELS, invalid theme falls back to obsidian
  const inst = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    trigger: triggerBtn,
    models: [],
    theme: 'unknown-theme-name',
    idleEvictMs: 90000,
  });

  // Cold start: 0 decodes
  assert.equal(glCount, 0);
  assert.equal(imgCount, 0);
  assert.equal(inst.getStatus().grainDecoded, false);
  assert.equal(inst.getStatus().cachedWallpapers, 0);

  // Hold 125ms -> pre-warms grain + active wallpaper, then cancel hold at 200ms -> evicts after 90s!
  triggerBtn.dispatchEvent(env.createEventObj('pointerdown', { button: 0, clientX: 110, clientY: 110 }, triggerBtn));
  env.advanceTime(125);
  assert.equal(inst.getStatus().grainDecoded, true, '120ms hold must pre-warm PBR grain');
  assert.equal(inst.getStatus().cachedWallpapers, 1, '120ms hold must pre-warm active model wallpaper');

  env.document.dispatchEvent(env.createEventObj('pointerup', { button: 0 }, triggerBtn));
  env.advanceTime(90050);
  assert.equal(inst.getStatus().grainDecoded, false, '90s idle after cancelled hold must evict PBR grain');
  assert.equal(inst.getStatus().cachedWallpapers, 0, '90s idle after cancelled hold must evict cached wallpapers');

  // Short viewport (<560px) height clamp test
  env.window.innerHeight = 460;
  inst.open();
  const rootEl = env.document.getElementById('prism-periodic-console-root');
  assert.equal(rootEl.getAttribute('data-short-viewport'), '1');
  const key6 = rootEl.querySelector('button.pp-key[data-z="6"]');
  const key10 = rootEl.querySelector('button.pp-key[data-z="10"]');
  key10.click(); // triggers AudioContext creation
  assert.ok(key6);

  inst.close();
  env.advanceTime(90050);
  assert.equal(inst.getStatus().grainDecoded, false);
  assert.equal(inst.getStatus().cachedWallpapers, 0);
  assert.ok(audioSuspendCount >= 1, '90s eviction must suspend running AudioContext');

  // Idempotent double destroy()
  inst.destroy();
  inst.destroy();
  assert.deepEqual(env.getCounts(), {
    docListeners: 0,
    winListeners: 0,
    activeTimers: 0,
    activeRafs: 0,
    activeObservers: 0,
  });
});

/* ============================================================================
 * 9. Exhibition HTML, Bilingual Docs & Local Asset Link Integrity
 * ============================================================================ */

test('9. index.html, bilingual READMEs, whitepapers, LICENSE & CITATION.cff local link and attribution integrity', () => {
  for (const requiredRel of [
    'index.html',
    'LICENSE',
    'CITATION.cff',
    'package.json',
    'README.md',
    'README.zh-CN.md',
    'docs/DESIGN-WHITEPAPER.md',
    'docs/DESIGN-WHITEPAPER.zh-CN.md',
    'showcase/showcase.css',
    'showcase/showcase.js',
    '.github/workflows/pages.yml',
  ]) {
    const full = path.join(ROOT_DIR, requiredRel);
    assert.equal(fs.existsSync(full), true, `Missing required repository file: ${requiredRel}`);
  }

  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert.ok(html.includes('RMvdesi') && html.includes('https://github.com/RMvdesi/obsidian-prism'));

  // Every local src="..." and href="./..." in index.html must resolve on disk
  const assetRefs = [...html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)].map((m) => m[1]);
  assert.ok(assetRefs.length >= 12, 'Expected local script, CSS, render, concept & whitepaper links in index.html');
  for (const ref of assetRefs) {
    const resolved = path.resolve(ROOT_DIR, ref);
    assert.equal(fs.existsSync(resolved), true, `Broken local reference in index.html: ${ref}`);
  }

  // Every relative local url(...) asset in showcase/showcase.css (e.g. bundled WOFF2 fonts) must resolve on disk
  const cssPath = path.join(ROOT_DIR, 'showcase', 'showcase.css');
  const cssRaw = fs.readFileSync(cssPath, 'utf8');
  const cssUrls = [...cssRaw.matchAll(/url\(["']?(\.\.?\/[^"')]+)["']?\)/g)].map((m) => m[1]);
  assert.ok(cssUrls.length >= 4, 'Expected local bundled WOFF2 editorial serif font declarations in showcase.css');
  for (const relUrl of cssUrls) {
    const resolved = path.resolve(path.dirname(cssPath), relUrl);
    assert.equal(fs.existsSync(resolved), true, `Broken local CSS url() reference: ${relUrl}`);
  }

  // Curatorial Monograph architecture gates (minimalist header, Atelier Light dimmer, 4 plates, static diptych, collapsed SDK colophon)
  assert.ok(html.includes('class="sc-book-header"'), 'Expected minimalist 1px hairline book-header');
  assert.ok(html.includes('id="sc-atelier-dock"'), 'Expected floating Atelier Light optical dimmer disc');
  assert.ok(html.includes('id="plate-concept-silicon"'), 'Expected Plate I Concept & Silicon');
  assert.ok(html.includes('id="plate-chromatic-optics"'), 'Expected Plate II Chromatic Optics');
  assert.ok(html.includes('id="plate-acoustics-engineering"'), 'Expected Plate III Acoustics & Engineering');
  assert.ok(html.includes('id="plate-ergonomics-sandbox"'), 'Expected Plate IV In-Flow Ergonomics Sandbox');
  assert.ok(html.includes('id="sc-sdk-panel" hidden'), 'Colophon SDK drawer must be collapsed by default');
  assert.equal(html.includes('type="range"'), false, 'Plate I must use static 1:1 Swiss diptych with zero drag slider');
  assert.equal((html.match(/data-prism-dock-host="1"/g) || []).length, 1, 'Page must mount exactly ONE WebGL2 console host');
  assert.ok(html.includes('All Rights Reserved'), 'index.html must preserve All Rights Reserved attribution');
  assert.equal(/\son[a-z]+\s*=/i.test(html), false, 'index.html must contain zero inline event handlers for strict CSP');
  assert.equal(html.includes('fonts.googleapis.com'), false, 'index.html must not hardcode external font links so file:// stays 100% offline-clean');

  // Verify every local Markdown file/image link & attribution across bilingual READMEs, whitepapers, LICENSE & CITATION.cff
  for (const docRel of ['README.md', 'README.zh-CN.md', 'docs/DESIGN-WHITEPAPER.md', 'docs/DESIGN-WHITEPAPER.zh-CN.md']) {
    const docPath = path.join(ROOT_DIR, docRel);
    const docRaw = fs.readFileSync(docPath, 'utf8');
    assert.ok(docRaw.includes('RMvdesi'), `${docRel} must preserve RMvdesi attribution`);
    assert.ok(docRaw.includes('Obsidian Prism'), `${docRel} must preserve Obsidian Prism attribution`);
    assert.ok(docRaw.includes('All Rights Reserved'), `${docRel} must preserve All Rights Reserved notice`);

    const mdTargets = [...docRaw.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1].trim());
    assert.ok(mdTargets.length >= 10, `${docRel} should contain local documentation and asset links`);
    for (const target of mdTargets) {
      if (/^https?:\/\//i.test(target) || target.startsWith('#')) continue;
      const cleanPath = target.split('#')[0].split('?')[0];
      const resolved = path.resolve(path.dirname(docPath), cleanPath);
      assert.equal(fs.existsSync(resolved), true, `Broken local Markdown reference in ${docRel}: ${target}`);
    }
  }

  const licenseRaw = fs.readFileSync(path.join(ROOT_DIR, 'LICENSE'), 'utf8');
  assert.ok(
    licenseRaw.includes('RMvdesi') && licenseRaw.includes('Obsidian Prism') && licenseRaw.includes('All Rights Reserved'),
    'LICENSE must preserve RMvdesi, Obsidian Prism, and All Rights Reserved attribution'
  );
  const citationRaw = fs.readFileSync(path.join(ROOT_DIR, 'CITATION.cff'), 'utf8');
  assert.ok(
    citationRaw.includes('RMvdesi') && citationRaw.includes('Obsidian Prism') && citationRaw.includes('LICENSE'),
    'CITATION.cff must preserve RMvdesi, Obsidian Prism, and LICENSE metadata'
  );

  // Bilingual README design-study accuracy & legacy/promotional text guard
  const staleReadmePatterns = [
    new RegExp(['apple', '\\s+launch'].join(''), 'i'),
    new RegExp(['6-', 'chapter'].join(''), 'i'),
    new RegExp(['six-', 'chapter'].join(''), 'i'),
    new RegExp(['hero\\s+', 'composer'].join(''), 'i'),
    new RegExp(['16-', 'pill'].join(''), 'i'),
    new RegExp(['分屏', '滑块'].join('')),
    new RegExp(['首屏', '输入框'].join('')),
    new RegExp(['Apple\\s*', '新品'].join(''), 'i'),
    new RegExp(['flag', 'ship'].join(''), 'i'),
    new RegExp(['旗舰', '产品'].join('')),
    new RegExp(['旗舰', '主仓'].join('')),
    new RegExp(['点亮\\s*★'].join('')),
  ];
  const requiredReadmeTokens = [
    './assets/renders/render-13-exhibition-hero-obsidian.png',
    './assets/renders/render-14-exhibition-hero-alabaster.png',
    'Gallery Noir',
    'Paper Monograph',
    'Instrument Serif',
    'Noto Serif SC',
    'Atelier Light',
    'Prologue',
    'Plate I',
    'Plate II',
    'Plate III',
    'Plate IV',
    'Colophon',
    'file://',
    '90',
  ];
  for (const readmeRel of ['README.md', 'README.zh-CN.md']) {
    const readmeRaw = fs.readFileSync(path.join(ROOT_DIR, readmeRel), 'utf8');
    for (const token of requiredReadmeTokens) {
      assert.ok(readmeRaw.includes(token), `${readmeRel} must document curatorial token "${token}"`);
    }
    for (const staleRe of staleReadmePatterns) {
      assert.equal(staleRe.test(readmeRaw), false, `${readmeRel} must not contain legacy pre-redesign phrasing (${staleRe})`);
    }
  }
});

/* ============================================================================
 * 10. End-to-End 79 Au Blind-Key Chemistry Flash, Live Locale & Telemetry API
 * ============================================================================ */

test('10. End-to-end 79 Au blind-key 1000ms chemistry flash, live setLocale("en"/"zh-CN") & setTelemetry()', () => {
  const env = createExhibitionSandbox({ mock2d: true, mockWebGL2: true });
  const { consoleSdk } = loadAllModulesInSandbox(env);

  const inst = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    autoOpen: true,
  });

  const rootEl = env.document.getElementById('prism-periodic-console-root');
  const specCard = rootEl.querySelector('[data-testid="pp-bento-spec-card"]');
  const telePod = rootEl.querySelector('[data-testid="pp-bento-telemetry-pod"]');
  const srDeck = rootEl.querySelector('[data-testid="pp-inspector-deck"]');

  // Click blind key 79 Au semantic button -> flashes 79 Au · Gold · STANDBY for 1000ms without changing selectedZ (6)
  for (let i = 0; i < 160 && env.getCounts().activeRafs > 0; i += 1) {
    env.advanceTime(16);
    env.flushRaf();
  }
  const auBtn = rootEl.querySelector('button.pp-key[data-z="79"]');
  assert.ok(auBtn, 'Expected semantic button for 79 Au standby key');
  auBtn.click();
  assert.equal(inst.getStatus().selectedZ, 6, 'Clicking 79 Au blind key must preserve active 6C selection');
  assert.ok(
    srDeck.textContent.includes('79 Au') && srDeck.textContent.includes('Gold') && srDeck.textContent.includes('STANDBY'),
    `Expected 79 Au chemistry flash in inspector deck, got: ${srDeck.textContent}`
  );
  env.advanceTime(1050);
  assert.ok(srDeck.textContent.includes('Carbon'), 'After 1000ms flash, inspector deck returns to active Carbon');

  // Live bilingual toggle & live telemetry update
  inst.setLocale('en');
  assert.equal(env.html.getAttribute('data-prism-lang'), 'en');
  assert.ok(specCard.textContent.includes('Speed') || specCard.textContent.includes('Velocity'));

  inst.setTelemetry({ usedTokens: 440402, maxTokens: 524288, cacheHitRate: 0.87, tps: 108 });
  assert.ok(telePod.textContent.includes('430K') && telePod.textContent.includes('84.0%'));

  inst.destroy();
  assert.equal(env.getCounts().activeTimers, 0);
});

/* ============================================================================
 * 11. Non-Modal External Enter Guard, Open-State 420ms Hold Toggle & Off-Mode API
 * ============================================================================ */

test('11. External interactive controls Enter/F guard, open-state 420ms radial-ring toggle, synthetic badge.click() & off-mode options forwarding', () => {
  const env = createExhibitionSandbox({ mock2d: true, mockWebGL2: true });
  const { consoleSdk } = loadAllModulesInSandbox(env);

  const dockHost = env.makeElement('div', { className: 'flex-col', attrs: { 'data-prism-dock-host': '1' } });
  const composer = env.makeElement('div', { attrs: { 'data-prism-composer': '1' } });
  const triggerBtn = env.makeElement('button', {
    attrs: { 'data-prism-trigger': '1' },
    useChildNodes: true,
  });
  triggerBtn.appendChild(env.createTextNode('Gemini 4 Carbon (High)'));
  const externalBtn = env.makeElement('button', { text: 'Switch Theme' });
  const externalSwatch = env.makeElement('div', { attrs: { role: 'button', tabindex: '0' }, text: '10Ne Swatch' });
  composer.appendChild(triggerBtn);
  env.body.appendChild(externalBtn);
  env.body.appendChild(externalSwatch);
  env.body.appendChild(composer);
  env.body.appendChild(dockHost);

  // Verify off-mode controller exposes full standard API and forwards options on setMode('on')
  const selectedLog = [];
  const offCtrl = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    mode: 'off',
    trigger: triggerBtn,
    mountContainer: dockHost,
    composerEl: composer,
    selectedModel: 'gemini-4-neon-high',
    onSelectModel: (m) => selectedLog.push(m.modelId),
  });
  assert.equal(typeof offCtrl.toggle, 'function');
  assert.equal(typeof offCtrl.toggleCardFlip, 'function');
  assert.equal(typeof offCtrl.setTheme, 'function');
  assert.equal(typeof offCtrl.setLocale, 'function');
  assert.equal(typeof offCtrl.setTelemetry, 'function');
  assert.equal(typeof offCtrl.selectModel, 'function');
  assert.equal(typeof offCtrl.toggleOrchestrator, 'function');
  assert.equal(typeof offCtrl.getSelectedModel, 'function');

  const inst = offCtrl.setMode('on');
  assert.equal(inst.getSelectedModel().modelId, 'gemini-4-neon-high', 'setMode("on") must preserve initial options');

  // Closed-state toggleOrchestrator(true) must update badge & persist into subsequent open()
  assert.equal(inst.toggleOrchestrator(true), true);
  assert.equal(inst.getStatus().orchLatched, true);
  const badgeClosed = triggerBtn.querySelector('.pp-mini-keycap');
  assert.ok(badgeClosed && badgeClosed.textContent.startsWith('0·'), 'Closed-state toggleOrchestrator must update badge');

  inst.open(triggerBtn);
  assert.equal(inst.isOpen(), true);
  assert.equal(inst.getStatus().orchLatched, true, 'Reopening must preserve closed-state orchLatched=true');

  // Focused external button & role="button" swatch MUST NOT be hijacked by Enter or F while docked
  for (const extTarget of [externalBtn, externalSwatch]) {
    extTarget.focus();
    const enterAllowed = extTarget.dispatchEvent(
      env.createEventObj('keydown', { key: 'Enter', bubbles: true, cancelable: true }, extTarget)
    );
    const fAllowed = extTarget.dispatchEvent(
      env.createEventObj('keydown', { key: 'f', bubbles: true, cancelable: true }, extTarget)
    );
    assert.equal(enterAllowed, true, 'Enter on external interactive control must not be prevented');
    assert.equal(fAllowed, true, '"f" on external interactive control must not flip stageMode');
    assert.equal(inst.isOpen(), true, 'Enter on external interactive control must not close docked console');
    assert.equal(inst.getStageMode(), 'drawer');
  }

  // Open-state 420ms hold on triggerBtn must spawn radial ring at 110ms and collapse dock at 420ms
  triggerBtn.dispatchEvent(
    env.createEventObj('pointerdown', { button: 0, clientX: 120, clientY: 80, bubbles: true, cancelable: true }, triggerBtn)
  );
  env.advanceTime(130);
  assert.ok(env.document.querySelector('.pp-hold-ring'), 'Holding trigger while open must spawn radial ring');
  env.advanceTime(310);
  triggerBtn.dispatchEvent(env.createEventObj('pointerup', { button: 0, bubbles: true }, triggerBtn));
  // Trailing click from pointer release must be suppressed cleanly without reopening
  let quickMenuOpenedOnRelease = false;
  triggerBtn.addEventListener('click', () => {
    quickMenuOpenedOnRelease = true;
  });
  triggerBtn.click();
  assert.equal(quickMenuOpenedOnRelease, false, 'Trailing click after 420ms hold must be suppressed');
  env.advanceTime(850);
  assert.equal(inst.isOpen(), false, 'Holding trigger 420ms while open must collapse dock');

  // Reopen via synthetic badge.click(), then collapse via synthetic badge.click()
  const badge = triggerBtn.querySelector('.pp-mini-keycap');
  badge.click();
  assert.equal(inst.isOpen(), true, 'Synthetic badge.click() when closed must open dock');
  badge.click();
  env.advanceTime(850);
  assert.equal(inst.isOpen(), false, 'Synthetic badge.click() when open must collapse dock');

  // Verify clickMiniBadgeToToggle: false strictly disables badge click toggling in both states
  inst.destroy();
  const instNoBadgeClick = consoleSdk.mount({
    root: env.window,
    doc: env.document,
    trigger: triggerBtn,
    mountContainer: dockHost,
    composerEl: composer,
    clickMiniBadgeToToggle: false,
    autoOpen: true,
  });
  const badgeNoToggle = triggerBtn.querySelector('.pp-mini-keycap');
  badgeNoToggle.dispatchEvent(
    env.createEventObj('pointerdown', { button: 0, bubbles: true, cancelable: true }, badgeNoToggle)
  );
  badgeNoToggle.click();
  env.advanceTime(350);
  assert.equal(instNoBadgeClick.isOpen(), true, 'clickMiniBadgeToToggle:false must keep dock open on badge click');
  instNoBadgeClick.destroy();

  assert.deepEqual(env.getCounts(), {
    docListeners: 0,
    winListeners: 0,
    activeTimers: 0,
    activeRafs: 0,
    activeObservers: 0,
  });
});
