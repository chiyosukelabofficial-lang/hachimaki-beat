/* ---------- cue-type (合図型) games ---------- */
const lerp = (a, b, t) => a + (b - a) * t;
function cueSound(snd, w, e) {
  switch (snd) {
    case 'pon': { const m = chordAt(e.t); tone('sine', mtof(m[0] + 24), w, .1, .5, {to: mtof(m[0] + 36), toT: .05, perc: 1}); } noiseHit(w, .03, .15, 2000); break;
    case 'goro': tone('triangle', 110, w, .25, .6, {to: 70, perc: 1}); noiseHit(w, .18, .35, 200); noiseHit(w + .09, .14, .25, 200); break;
    case 'kira': { const m = chordAt(e.t); tone('sine', mtof(m[2] + 36), w, .08, .3, {perc: 1}); tone('sine', mtof(m[1] + 48), w + .04, .12, .22, {perc: 1}); } break;
    case 'suika': { const m = chordAt(e.t); tone('sine', mtof(m[0] + 12), w, .3, .6, {to: mtof(m[0] + 19), toT: .12, perc: 1}); noiseHit(w, .04, .2, 800); } break;
    case 'gon': tone('square', 90, w, .18, .4, {to: 60, lp: 600, perc: 1}); noiseHit(w, .08, .4, 300); break;
    case 'wan': tone('sawtooth', 620, w, .14, .3, {to: 380, toT: .1, lp: 1800}); tone('square', 310, w, .14, .12, {to: 190, toT: .1, lp: 1200}); break;
    case 'kakon': tone('triangle', 1500, w, .07, .45, {perc: 1}); tone('sine', 760, w + .01, .12, .4, {perc: 1}); break;
    case 'buzz': case 'buzz2': { const d = snd === 'buzz' ? .22 : .13; const o = actx.createOscillator(), l = actx.createOscillator(), lg = actx.createGain(), g = actx.createGain(), f = actx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = snd === 'buzz' ? 190 : 260; l.frequency.value = 38; lg.gain.value = 25; l.connect(lg); lg.connect(o.frequency);
      f.type = 'bandpass'; f.frequency.value = 900; o.connect(f); f.connect(g); g.connect(OUT);
      g.gain.setValueAtTime(0, w); g.gain.linearRampToValueAtTime(.35, w + .02); g.gain.linearRampToValueAtTime(0, w + d);
      o.start(w); l.start(w); o.stop(w + d + .02); l.stop(w + d + .02); break; }
    case 'poko': tone('sine', 420, w, .12, .6, {to: 230, toT: .1, perc: 1}); noiseHit(w, .05, .15, 600); break;
    case 'oink': tone('square', mtof(e.midi || 67), w, .2, .12, {to: mtof((e.midi || 67) - 5), toT: .18, lp: 1400}); break;
    case 'suu': { const s = actx.createBufferSource(); s.buffer = NB; const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2;
      f.frequency.setValueAtTime(800, w); f.frequency.exponentialRampToValueAtTime(3000, w + .2); const g = actx.createGain();
      g.gain.setValueAtTime(0, w); g.gain.linearRampToValueAtTime(.5, w + .15); g.gain.linearRampToValueAtTime(0, w + .22);
      s.connect(f); f.connect(g); g.connect(OUT); s.start(w); s.stop(w + .25); break; }
    case 'noo': voiceAt(w, e.dur, 300, .16); break;
    case 'ha': tone('square', 330, w, .13, .14, {to: 220, lp: 1800}); noiseHit(w, .08, .2, 1200); break;
    case 'ta': noiseHit(w, .07, .55, 1600); tone('triangle', 320, w, .05, .3, {perc: 1}); break;
    case 'pi': tone('sine', 2300, w, .11, .3, {to: 2100}); break;
    case 'hk1': case 'hk2': case 'hk3': { const f = {hk1: 300, hk2: 270, hk3: 360}[snd]; tone('square', f, w, .15, .15, {to: f * .8, lp: 1500}); noiseHit(w, .05, .15, 1500); break; }
    case 'hey': tone('sawtooth', 440, w, .17, .16, {to: 640, toT: .07, lp: 1900}); noiseHit(w, .04, .15, 2500); break;
  }
}
let voiceNode = null;
function voiceAt(w, dur, f, vol) {
  const o = actx.createOscillator(), l = actx.createOscillator(), lg = actx.createGain(), g = actx.createGain(), fl = actx.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(f, w); l.frequency.value = 5.5; lg.gain.value = 6; l.connect(lg); lg.connect(o.frequency);
  fl.type = 'lowpass'; fl.frequency.value = 900; o.connect(fl); fl.connect(g); g.connect(OUT);
  g.gain.setValueAtTime(0, w); g.gain.linearRampToValueAtTime(vol, w + .05);
  o.start(w); l.start(w);
  if (dur) { g.gain.setValueAtTime(vol, w + Math.max(.06, dur - .05)); g.gain.linearRampToValueAtTime(0, w + dur); o.stop(w + dur + .05); l.stop(w + dur + .05); }
  return {o, l, g};
}
function voiceStart() { voiceStop(); voiceNode = voiceAt(actx.currentTime, 0, 260, .3); }
function voiceStop() { if (voiceNode && actx) { const t = actx.currentTime; try { voiceNode.g.gain.cancelScheduledValues(t); voiceNode.g.gain.setValueAtTime(voiceNode.g.gain.value, t); voiceNode.g.gain.linearRampToValueAtTime(0, t + .05); voiceNode.o.stop(t + .08); voiceNode.l.stop(t + .08); } catch (e) {} } voiceNode = null; }
function chordAt(t) { let m = null; if (G && G.ev) for (const e of G.ev) { if (e.t > t + .02) break; if (e.type === 'chord') m = e.midis; } return m || [48, 52, 55]; }
function sfxK(k, midi) {
  if (!actx) return; const w = actx.currentTime;
  if (k === 'bell') { tone('sine', mtof(midi), w, .45, .45, {perc: 1}); tone('sine', mtof(midi + 12), w, .3, .18, {perc: 1}); tone('triangle', mtof(midi + 19), w, .15, .08, {perc: 1}); return; }
  if (k === 'wood') { tone('triangle', mtof(midi), w, .07, .6, {perc: 1}); tone('sine', mtof(midi) * 2.4, w, .04, .25, {perc: 1}); return; }
  if (k === 'suzu') { tone('sine', 2100, w, .5, .4, {perc: 1}); tone('sine', 2900, w, .35, .25, {perc: 1}); tone('sine', 4200, w, .2, .1, {perc: 1}); }
  else if (k === 'gulp') { tone('sine', 260, w + .05, .12, .7, {to: 120, perc: 1}); noiseHit(w + .05, .04, .4, 2000); }
  else if (k === 'bonk') { tone('sine', 220, w, .18, 1, {to: 90, perc: 1}); tone('square', 880, w, .04, .15, {perc: 1}); noiseHit(w, .07, .5, 900); }
  else if (k === 'blow') { noiseHit(w, .4, .6, 400); tone('sine', 700, w, .3, .3, {to: 220, perc: 1}); for (let i = 0; i < 3; i++) tone('sine', 900 + i * 300, w + .08 + i * .06, .05, .2, {to: 1800, perc: 1}); }
  else if (k === 'slap') { noiseHit(w, .1, 1, 600); tone('sine', 150, w, .16, 1, {to: 60, perc: 1}); }
  else if (k === 'oink') tone('square', mtof(midi || 67), w, .2, .3, {to: mtof((midi || 67) - 5), toT: .18, lp: 1400});
  else if (k === 'boo') tone('square', 150, w, .25, .07, {to: 90, lp: 600});
  else if (k === 'whiff') { noiseHit(w, .09, .25, 1800); tone('sine', 520, w, .07, .2, {to: 260, perc: 1}); }
  else if (k === 'kira') { tone('triangle', 1568, w, .14, .16, {perc: 1}); tone('triangle', 2093, w + .03, .18, .13, {perc: 1}); tone('sine', 3136, w + .05, .2, .06, {perc: 1}); }
  else if (k === 'tok') { tone('triangle', 1200, w, .05, .35, {perc: 1}); tone('sine', 600, w, .08, .3, {perc: 1}); }
  else if (k === 'woosh') { const s = actx.createBufferSource(); s.buffer = NB; const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.5; f.frequency.setValueAtTime(600, w); f.frequency.exponentialRampToValueAtTime(2500, w + .1); const g = actx.createGain(); g.gain.setValueAtTime(.45, w); g.gain.exponentialRampToValueAtTime(.001, w + .12); s.connect(f); f.connect(g); g.connect(OUT); s.start(w); s.stop(w + .14); }
  else if (k === 'lick') { tone('sine', 500, w, .1, .45, {to: 1400, toT: .07, perc: 1}); }
  else if (k === 'psh') { noiseHit(w, .12, .45, 900); }
  else if (k === 'hop') { tone('sine', 300, w, .14, .5, {to: 1000, perc: 1}); }
  else if (k === 'splash') { noiseHit(w, .3, .5, 1400); noiseHit(w + .05, .15, .3, 3500); }
  else if (k === 'dosun') { tone('sine', 110, w, .3, 1, {to: 45, perc: 1}); noiseHit(w, .15, .6, 300); }
  else if (k === 'heyp') { tone('sawtooth', 520, w, .15, .18, {to: 720, toT: .06, lp: 2000}); }
  else if (k === 'don') { tone('sine', 120, w, .2, .9, {to: 60, perc: 1}); noiseHit(w, .05, .3, 500); }
}
const CUELBL = {suika: 'ポーン', pon: 'ポン', goro: 'ゴロッ', kira: 'キラッ', gon: 'ゴンッ', wan: 'ワン！', kakon: 'カコン', buzz: 'ブン', buzz2: 'ブッ', poko: 'ポコ', oink: 'ブー', suu: 'スッ', noo: 'の〜〜', ha: 'ハッ！', ta: 'タン', pi: 'ピッ', hk1: 'ハッ', hk2: 'ケ', hk3: 'ヨイ', hey: 'ヘイ！'};
const SEQ = __SEQ__;
function sfDraw(f, x, yb, h, o = {}) {
  const im = IM[f.k]; if (!im || !im.complete || !im.naturalWidth) return;
  const hh = h * f.hr, w = hh * f.ar;
  ctx.save(); ctx.translate(x, yb); if (o.rot) ctx.rotate(o.rot);
  ctx.scale((o.sx || 1) * (o.flip ? -1 : 1), o.sy || 1); ctx.globalAlpha = o.a == null ? 1 : o.a;
  ctx.drawImage(im, -f.ax * w, -hh, w, hh); ctx.restore();
}
const sfPt = (f, p, x, yb, h, flip) => { const hh = h * f.hr, w = hh * f.ar; return [x + (flip ? -1 : 1) * (p[0] - f.ax) * w, yb - hh + p[1] * hh]; };
function seqPlay(fr, steps, t, x, yb, h, o = {}) {
  let c = 0; for (let k = 0; k < steps.length; k++) if (t >= steps[k][1]) c = k;
  const fa = c > 0 ? clamp((t - steps[c][1]) / (o.fade || .05), 0, 1) : 1, a0 = o.a == null ? 1 : o.a;
  if (fa < 1) sfDraw(fr[steps[c - 1][0]], x, yb, h, {...o, a: a0});
  sfDraw(fr[steps[c][0]], x, yb, h, {...o, a: a0 * fa});
}
const MISSPOSE = {pig: 'pig_mud', frog: 'frog_flop', penguin: 'peng_split', mole: 'mole_sun', pug: 'pug_trip'};
function bgSky(top, bot) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
const tapAge = now => now - G.lastTap;
const spring = a => a < 0 || a > .7 ? 0 : Math.exp(-a * 8) * Math.cos(a * 28);
const reactAge = () => (performance.now() - G.react.t) / 1000;
const missing = () => G.react.res === 'MISS' && reactAge() < .75;
function actor(id, x, yb, h, now, o = {}) {
  const s = spring(tapAge(now)), ra = reactAge(), p = charPose(now);
  if (missing() && !o.noPose) { const k = 1 - ra / .75; spr(MISSPOSE[id] || 'pose_' + id, x, yb + 4, h * (o.ps || .9), {rot: Math.sin(ra * 22) * .06 * k, flip: o.flip, sx: 1 + .08 * k, sy: 1 - .08 * k}); return; }
  const g = G.react.res && G.react.res !== 'MISS' && ra < .5 ? spring(ra) : 0, up = Math.max(0, s);
  spr(id, x + (o.dx || 0) * up, yb - (o.lift || 0) * up - 12 * Math.max(0, g), h, {flip: o.flip, sx: p.sx * (1 + .1 * s + .05 * g), sy: p.sy * (1 - .13 * s + .09 * g), rot: p.rot + (o.tilt || 0) * up});
}
function ellipse(x, y, rx, ry, fill, stroke, lw = 3) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
const mkCall = (arr, lvl, snd = 'oink') => ({lvl, len: 8, c: arr.map(x => [x, snd]), h: arr.map(x => [x + 4])});

const SCENES = {
  capy: {char: 'capybara', title: 'みかん乗せ温泉', guide: '「ポン」の次の拍で頭キャッチ！ 石の「ゴロッ」はよけて',
    pats: [{lvl: 0, len: 4, c: [[0, 'pon'], [2, 'pon']], h: [[1, 0, 0], [3, 0, 1]]},
      {lvl: 1, len: 4, c: [[0, 'pon'], [2, 'goro']], h: [[1, 0, 0], [3, 0, 1, 1]]},
      {lvl: 1, len: 4, c: [[0, 'pon'], [1, 'pon'], [2, 'pon']], h: [[1, 0, 0], [2, 0, 1], [3, 0, 2]]},
      {lvl: 1, len: 4, c: [[0, 'suika'], [2, 'pon']], h: [[2, 0, 0], [3, 0, 1]]},
      {lvl: 2, len: 4, c: [[0, 'pon'], [1, 'suika'], [2.5, 'pon']], h: [[1, 0, 0], [3, 0, 1], [3.5, 0, 2]]},
      {lvl: 2, len: 4, c: [[0, 'goro'], [1, 'pon'], [1.5, 'pon'], [2.5, 'pon']], h: [[1, 0, 0, 1], [2, 0, 1], [2.5, 0, 2], [3.5, 0, 3]]},
      {lvl: 2, len: 4, c: [[0, 'pon'], [.5, 'pon'], [2, 'goro'], [2.5, 'pon']], h: [[1, 0, 0], [1.5, 0, 1], [3, 0, 2, 1], [3.5, 0, 3]]}],
    L() { const gy = H * .8, h = Math.min(H * .3, W * .8 / 1.33), cx = W * .58; return {gy, h, cx, wy: gy - h * .38}; },
    head(l, bob) { return sfPt(SEQ.tub[0], [.48, .1], l.cx, l.gy - bob, l.h); },
    pos() { const l = this.L(), hd = this.head(l, 0); return [hd[0], hd[1] - 70]; }, cuePos() { return [W * .2, H * .26]; }, hitSfx(n) { sfxK('bell', chordAt(n.t)[n.snd === 'suika' ? 0 : 2] + 24); if (n.snd === 'suika') sfxK('don'); },
    suika(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); circle(0, 0, r, '#5fa04a', INK, 3); ctx.strokeStyle = '#2f5e2a'; ctx.lineWidth = 4; for (const k of [-.5, 0, .5]) { ctx.beginPath(); ctx.ellipse(k * r, 0, r * .18, r * .92, 0, 0, 7); ctx.stroke(); } circle(-r * .35, -r * .4, r * .18, 'rgba(255,255,255,.45)'); ctx.restore(); },
    mikan(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); circle(0, 0, r, '#f39a2b', INK, 2.5); ctx.fillStyle = '#5c9a3a'; ctx.beginPath(); ctx.ellipse(r * .35, -r * .9, r * .45, r * .2, -.5, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); circle(-r * .35, -r * .3, r * .2, 'rgba(255,255,255,.55)'); ctx.restore(); },
    rock(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath(); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283, q = r * (.8 + .2 * Math.sin(k * 2.3)); ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); } ctx.closePath(); ctx.fillStyle = '#9a9a92'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore(); },
    draw(now) {
      const l = this.L(), ta = tapAge(now), ns = G.byG.capy || [];
      bgSky('#f6e3c4', '#f2d6b0');
      ctx.fillStyle = '#c9b9a0'; ctx.beginPath(); ctx.moveTo(0, l.gy); ctx.quadraticCurveTo(W * .3, l.gy - H * .25, W * .65, l.gy); ctx.fill();
      ctx.fillStyle = '#b9c99c'; ctx.fillRect(0, l.gy, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.gy - 1.5, W, 3);
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) { const k = (now * 30 + i * 40) % 120, x = l.cx + (i - 1.5) * l.h * .35 + Math.sin(now + i) * 12, y = l.wy - 30 - k; ctx.globalAlpha = .55 * (1 - k / 120); ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.bezierCurveTo(x - 12, y + 15, x + 12, y + 10, x, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      let st = 0, lastOk = null;
      for (const n of ns) { if (!n.res || n.hitT > now) continue; if (n.res === 'MISS' && (!n.trap || n.bonk)) st = 0; else if (!n.trap && n.res !== 'MISS') { if (n.snd !== 'suika') st++; lastOk = n; } }
      const bonk = ns.find(n => n.bonk && now - n.hitT < .8), drop = ns.find(n => n.res === 'MISS' && !n.trap && now - n.hitT < .8);
      const sp = Math.max(0, spring(ta)), bob = ta >= 0 && ta < .28 ? Math.sin(Math.PI * ta / .28) * l.h * .08 : 0, T = SEQ.tub;
      if (bonk) seqPlay(T, [[2, 0]], 0, l.cx + Math.sin(now * 60) * 4 * (1 - (now - bonk.hitT) / .8), l.gy, l.h);
      else if (drop) seqPlay(T, [[1, 0]], 0, l.cx, l.gy, l.h);
      else seqPlay(T, [[0, 0]], 0, l.cx, l.gy - bob, l.h, {sx: 1 + .05 * sp, sy: 1 - .05 * sp});
      const hd = this.head(l, bob), r = l.h * .075;
      if (!bonk && !drop) for (let i = 0; i < Math.min(st, 7); i++) { const w = Math.sin(now * 3 + i) * i * 1.3; this.mikan(hd[0] + w, hd[1] - r * .6 - i * r * 1.75, r, Math.sin(now * 2 + i) * .1); }
      const x0 = -30, y0 = H * .34;
      for (const n of ns) {
        if (now < n.cueT - .02) continue;
        const tx = n.trap ? hd[0] + r * 2.5 : hd[0], ty = n.trap ? hd[1] - l.h * .14 : hd[1] - r * .6 - st * r * 1.75, span = Math.max(.2, n.t - n.cueT), q = (now - n.cueT) / span;
        if (n.bonk) { const d = now - n.hitT; if (d < 1) this.rock(hd[0] - d * 240, hd[1] - d * 420 + d * d * 1100, r * 1.15, d * 12); continue; }
        if (n.res && n.res !== 'MISS' && !n.trap) { const d = now - n.hitT; if (n.snd === 'suika' && d < .7) { const R = r * 1.8; for (const s of [-1, 1]) { ctx.save(); ctx.translate(hd[0] + s * d * 160, hd[1] - R * .6 - d * 200 + d * d * 900); ctx.rotate(s * d * 6); ctx.beginPath(); ctx.arc(0, 0, R, s > 0 ? -1.57 : 1.57, s > 0 ? 1.57 : 4.71); ctx.closePath(); ctx.fillStyle = '#e85a5a'; ctx.fill(); ctx.strokeStyle = '#5fa04a'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); } if (d < .45) text('パカッ！', hd[0], hd[1] - R * 2.2, 30, '#fff', {stroke: 6, sc: '#e85a5a', a: 1 - d / .45}); } continue; }
        const A = H * .1 + span * 90, px = lerp(x0, tx, q), py0 = lerp(y0, ty, q) - Math.sin(Math.PI * Math.min(q, 1)) * A + (q > 1 ? (q - 1) * (q - 1) * H * 3 : 0);
        if (q > 1) { const d = (q - 1) * span; if (d > 1) continue; 
          const lim = l.gy - r * 1.1, py = Math.min(py0, lim); if (n.trap && py >= lim && d < .5) text('ゴロン', px, lim - 40, 20, '#fff', {stroke: 5, sc: '#8a8a80', a: 1 - d * 2});
          ctx.globalAlpha = clamp(1 - d, 0, 1); n.trap ? this.rock(px + d * 80, py, r * 1.15, q * 6) : n.snd === 'suika' ? this.suika(px + d * 120, Math.min(py, l.gy - r * 1.8), r * 1.8, q * 3) : this.mikan(px + d * 120, py, r, q * 5); ctx.globalAlpha = 1; continue; }
        n.trap ? this.rock(px, py0, r * 1.15, q * 6) : n.snd === 'suika' ? this.suika(px, py0, r * 1.8, q * 3) : this.mikan(px, py0, r, q * 5);
      }
      if (bonk) { const d = now - bonk.hitT; for (let k = 0; k < 3; k++) text('★', hd[0] + Math.cos(now * 6 + k * 2.1) * 40, hd[1] + Math.sin(now * 6 + k * 2.1) * 12, 20, '#f2c12e', {stroke: 3}); text('ゴツン！', hd[0] + 50, hd[1] - 60, 26, '#fff', {stroke: 6, sc: '#8a6a4a', a: 1 - d / .8}); }
      if (drop) text('zzz', hd[0] + 40, hd[1] - 30 - (now - drop.hitT) * 30, 22, '#fff', {stroke: 5, sc: '#6aa3b5'});
      if (lastOk && now - lastOk.hitT < .45 && st >= 3) text(st + 'こ！', hd[0] + 60, hd[1] - st * r * 1.75, 24, '#fff', {stroke: 6, sc: '#f39a2b', a: 1 - (now - lastOk.hitT) / .45});
    }},
  frog: {char: 'frog', title: 'ハエとり', guide: '「ブン、ブン」の次の拍でタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'buzz'], [1, 'buzz']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'buzz2'], [.5, 'buzz2']], h: [[1]]}, {lvl: 2, len: 4, c: [[0, 'buzz'], [1, 'buzz'], [2.5, 'buzz2'], [3, 'buzz2']], h: [[2, 0, 0], [3.5, 0, 2]]}, {lvl: 2, len: 4, c: [[0, 'buzz2'], [.5, 'buzz2'], [2, 'buzz2'], [2.5, 'buzz2']], h: [[1, 0, 0], [3, 0, 2]]}],
    L() { const h = Math.min(H * .26, 220), fx = W * .3, fy = H * .72; return {h, fx, fy, mx: fx + h * .08, my: fy - h * .55}; },
    tip(l) { const f = SEQ.frogf[2]; return sfPt(f, f.tip, l.fx, l.fy + 8, l.h); },
    pos() { const l = this.L(); return [l.mx + 30, l.my - 60]; }, cuePos() { return [W * .8, H * .3]; }, hitSfx() { sfxK('gulp'); },
    fly(x, y) { ellipse(x - 5, y - 8, 9, 5, 'rgba(255,255,255,.8)', INK, 1.5); ellipse(x + 5, y - 8, 9, 5, 'rgba(255,255,255,.8)', INK, 1.5); circle(x, y, 7, '#333', INK, 2); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#d7eef2', '#bfe0c9');
      ctx.fillStyle = '#8fc2b8'; ctx.fillRect(0, H * .62, W, H); ctx.fillStyle = INK; ctx.fillRect(0, H * .62 - 1.5, W, 3);
      for (let i = 0; i < 6; i++) { ctx.strokeStyle = '#6d8f4e'; ctx.lineWidth = 4; const x = W * .62 + i * W * .07; ctx.beginPath(); ctx.moveTo(x, H * .64); ctx.quadraticCurveTo(x + 10, H * .5, x + Math.sin(now * 2 + i) * 6, H * .4 - i % 2 * 20); ctx.stroke(); }
      ellipse(l.fx, l.fy + 6, l.h * .55, l.h * .12, '#7cb35a', INK);
      const acts = (G.byG.frog || []).filter(n => n.res && n.res !== 'MISS' && now - n.hitT < .5), act = acts[acts.length - 1];
      const FS = SEQ.frogf;
      if (missing()) seqPlay(FS, [[6, 0], [7, .26]], reactAge(), l.fx, l.fy + 8, l.h, {fade: .06});
      else if (act) { const d = now - act.hitT, tp = this.tip(l), lf = d > .12 && d < .3 ? Math.sin(Math.PI * (d - .12) / .18) * l.h * .1 : 0; seqPlay(FS, [[1, 0], [2, .035], [4, .12], [5, .3], [3, .42]], d, l.fx, l.fy + 8 - lf, l.h, {fade: .045}); if (d < .05) this.fly(tp[0], tp[1] - 2); }
      else if (ta >= 0 && ta < .22) seqPlay(FS, [[1, 0], [0, .16]], ta, l.fx, l.fy + 8, l.h, {fade: .04});
      else actor('frog', l.fx, l.fy + 8, l.h, now, {lift: l.h * .14, tilt: -.12, dx: 10});
      for (const n of G.byG.frog || []) {
        if (now < n.cueT - .02) continue;
        const tp = this.tip(l), path = q => [lerp(W + 30, tp[0], q), lerp(H * .22, tp[1], q) + Math.sin(q * 14) * 22 * (1 - q)];
        if (!n.res) { const q = clamp((now - n.cueT) / (n.t - n.cueT), 0, 1.15); const [x, y] = path(q); this.fly(x, y); }
        else if (n.res === 'MISS') { const d = now - n.hitT; if (d < 1) this.fly(l.mx - d * 300, l.my - d * 80 + Math.sin(d * 30) * 8); }
      }
    }},
  mole: {char: 'mole', title: 'お宝さがし', guide: '「キラッ、キラッ」の次で顔を出す！ 「ゴンッ」のときは出ないで',
    pats: [{lvl: 0, len: 4, c: [[0, 'kira'], [.5, 'kira'], [2, 'kira'], [2.5, 'kira']], h: [[1, 0, 0], [3, 0, 2]]},
      {lvl: 1, len: 4, c: [[0, 'kira'], [.5, 'kira'], [2, 'gon'], [2.5, 'gon']], h: [[1, 0, 0], [3, 0, 2, 1]]},
      {lvl: 1, len: 4, c: [[0, 'gon'], [.5, 'gon'], [2, 'kira'], [2.5, 'kira']], h: [[1, 0, 0, 1], [3, 0, 2]]},
      {lvl: 2, len: 4, c: [[0, 'kira'], [1, 'kira'], [2, 'kira'], [2.5, 'kira']], h: [[2, 0, 0], [3, 0, 2]]},
      {lvl: 2, len: 4, c: [[0, 'gon'], [.5, 'gon'], [1.5, 'kira'], [2, 'kira']], h: [[1, 0, 0, 1], [2.5, 0, 2]]},
      {lvl: 2, len: 4, c: [[0, 'kira'], [.5, 'kira'], [1.5, 'gon'], [2, 'gon']], h: [[1, 0, 0], [2.5, 0, 2, 1]]}],
    L() { return {gy: H * .72, x: W * .46, h: Math.min(H * .3, W * .62)}; },
    pos() { const l = this.L(); return [l.x, l.gy - l.h - 10]; }, cuePos() { return [W * .5, H * .2]; }, hitSfx(n) { sfxK('wood', chordAt(n.t)[0] + 36); },
    cap(x, y, r, rot, gold) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath(); for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283, q = r * (k % 2 ? 1 : .86); ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q * .5); } ctx.closePath(); ctx.fillStyle = gold ? '#f2c12e' : '#d9dde2'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke(); ellipse(0, -r * .06, r * .62, r * .24, gold ? '#ffe27a' : '#f4f7fa', INK, 1.5); ctx.restore(); },
    draw(now) {
      const l = this.L(), ta = tapAge(now), ns = G.byG.mole || [], qs = G.cuesByG.mole || [], ph = ((now / G.song.spb) % 1 + 1) % 1;
      bgSky('#e9f2d9', '#cfe3a8');
      ctx.fillStyle = '#b48a5a'; ctx.fillRect(0, l.gy, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.gy - 1.5, W, 3);
      ctx.strokeStyle = '#6d8f4e'; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { const x = (i * 97 + 30) % W; ctx.beginPath(); ctx.moveTo(x, l.gy); ctx.lineTo(x - 6, l.gy - 14); ctx.moveTo(x, l.gy); ctx.lineTo(x + 5, l.gy - 16); ctx.stroke(); }
      const M2 = SEQ.mole2, MP = SEQ.moleP;
      const okN = ns.filter(n => !n.trap && n.res && n.res !== 'MISS' && now - n.hitT < .5).pop(), bonk = ns.find(n => n.bonk && now - n.hitT < .9);
      const missN = ns.find(n => !n.trap && n.res === 'MISS' && now - n.hitT < .6), dodge = ns.find(n => n.trap && !n.bonk && now >= n.t && now - n.t < .6);
      const peek = qs.some(q => q.snd === 'kira' && now >= q.t && now - q.t < .22), got = ns.filter(n => !n.trap && n.res && n.res !== 'MISS' && n.hitT <= now).length;
      const tr = ns.find(n => n.trap && now > n.cueT - .05 && now < n.t + .45);
      if (bonk) { const d = now - bonk.hitT; sfDraw(MP[2], l.x, l.gy + 8, l.h * .85, {rot: Math.sin(d * 30) * .05 * (1 - d)}); for (let k = 0; k < 3; k++) text('★', l.x + Math.cos(now * 6 + k * 2.1) * 44, l.gy - l.h * .75 + Math.sin(now * 6 + k * 2.1) * 12, 20, '#f2c12e', {stroke: 3}); }
      else if (okN) { const d = now - okN.hitT, up = clamp(d / .07, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, l.gy + 14); ctx.clip(); seqPlay(MP, [[1, 0], [0, .28]], d, l.x, l.gy + 10 + (1 - up) * l.h * .6, l.h, {fade: .05}); ctx.restore(); }
      else if (missN || (ta >= 0 && ta < .2)) seqPlay(M2, [[3, 0]], 0, l.x, l.gy + 12 - (missN ? 0 : 10 * Math.sin(Math.PI * ta / .2)), l.h * .9);
      else if (peek) seqPlay(M2, [[2, 0]], 0, l.x, l.gy + 12, l.h * .9, {sx: 1.05, sy: .95});
      else seqPlay(M2, [[1, 0]], 0, l.x, l.gy + 12, l.h * .9, {sy: 1 - .04 * Math.exp(-ph * 5)});
      const r = l.h * .14;
      for (const n of ns) {
        if (n.trap || now < n.cueT - .02) continue;
        if (!n.res) { const q = clamp((now - n.cueT) / Math.max(.2, n.t - n.cueT), 0, 1.2), y = lerp(H * .16, l.gy - l.h * .8, q); this.cap(l.x, y, r * (n.fin ? 1.3 : 1), Math.sin(now * 10) * .2, n.fin); if (Math.sin(now * 20) > 0) text('✦', l.x + r * 1.1, y - r * .6, 18, '#fff', {stroke: 3, sc: '#f2c12e'}); }
        else if (n.res === 'MISS') { const d = now - n.hitT; if (d < .8) this.cap(l.x + d * 300, l.gy - l.h * .5 - d * 260 + d * d * 700, r, d * 14); }
      }
      if (tr) { const dt = now - tr.t, th = dt < -.09 ? 1.15 + Math.sin(now * 8) * .06 : dt < 0 ? lerp(1.15, -.78, (dt + .09) / .09) : dt < .18 ? -.78 : lerp(-.78, 1.15, Math.min(1, (dt - .18) / .25)), Lh = l.h * .85, px = l.x + l.h * .78, py = l.gy - l.h * 1.05;
        ctx.save(); ctx.translate(px, py); ctx.rotate(-th); ctx.fillStyle = '#c98b4f'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.fillRect(-Lh, -7, Lh, 14); ctx.strokeRect(-Lh, -7, Lh, 14); rr(-Lh - 34, -42, 68, 84, 12); ctx.fillStyle = '#e8554e'; ctx.fill(); ctx.stroke(); ctx.restore();
        if (dt >= 0 && dt < .35) { const a = 1 - dt / .35; if (!tr.bonk) text('スカッ！', l.x - 60, l.gy - l.h * .7, 28, '#fff', {stroke: 6, sc: '#4fb3a9', a}); else text('ゴンッ！', l.x - 60, l.gy - l.h * .8, 30, '#fff', {stroke: 6, sc: '#e8554e', a}); for (let k = 0; k < 5; k++) circle(l.x + Math.cos(k * 1.3) * dt * 200, l.gy - 10 - Math.sin(k * .7 + .3) * dt * 150, 6, '#8a6a4a', INK, 2); }
      }
      if (dodge && !tr) seqPlay(M2, [[2, 0]], 0, l.x, l.gy + 12, l.h * .9);
      this.cap(W - 70, SAT + 96, 16, 0); text('×' + got, W - 30, SAT + 104, 22, '#fff', {stroke: 5, sc: '#8a6a4a'});
      if (okN && now - okN.hitT < .35) text('ゲット！', l.x + l.h * .55, l.gy - l.h * 1.05, 26, '#fff', {stroke: 6, sc: '#f2c12e', a: 1 - (now - okN.hitT) / .35});
    }},
  pig: {char: 'pig', title: 'まねっこコーラス', guide: 'ぶたまるの「ブー」を次の小節でマネしてタップ',
    pats: [mkCall([0, 1, 2], 0), mkCall([0, 2, 3], 0), mkCall([0, 1, 1.5, 2], 1), mkCall([0, .5, 1, 3], 1), mkCall([0, .5, 1.5, 2, 3], 2), mkCall([0, .75, 1.5, 2, 3], 2)],
    L() { return {h: Math.min(H * .28, 230), y: H * .7, px: W * .3, ux: W * .72}; },
    pos() { const l = this.L(); return [l.ux, l.y - l.h - 20]; }, cuePos() { const l = this.L(); return [l.px, l.y - l.h - 30]; }, hitSfx(n) { sfxK('oink', n.midi); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#3b2f4a', '#6b4a5a');
      ctx.fillStyle = '#b8323a'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(i * W / 8, 0, W / 14, H * .12, 0, 0, Math.PI); ctx.fill(); }
      ctx.fillStyle = '#c99a62'; ctx.fillRect(0, l.y, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.y - 1.5, W, 3);
      for (const x of [l.px, l.ux]) { ctx.fillStyle = 'rgba(255,240,200,.18)'; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + l.h * .6, l.y + 10); ctx.lineTo(x - l.h * .6, l.y + 10); ctx.fill(); ellipse(x, l.y + 6, l.h * .45, 12, 'rgba(255,240,200,.35)'); }
      let lc = -9; for (const q of G.cuesByG.pig || []) if (q.t <= now) lc = q.t;
      const ps = spring(now - lc);
      seqPlay(SEQ.pigs, [[1, 0], [0, .16]], now - lc, l.px, l.y + 6 - 14 * Math.max(0, ps), l.h * .95, {flip: true, sx: p.sx * (1 + .06 * ps), sy: p.sy * (1 - .08 * ps), fade: .05});
      actor('pug', l.ux, l.y + 6, l.h, now, {flip: true, noPose: true, lift: 14});
      if (ta >= 0 && ta < .3) text('ブー', l.ux - 30, l.y - l.h - 6 - ta * 40, 22 * (1 + .5 * Math.max(0, spring(ta))), '#fff', {stroke: 5, sc: '#e8557a', a: 1 - ta / .3});
    }},
  puffer: {char: 'puffer', title: 'ぷくぷく深呼吸', guide: '「スッ、スッ、スッ」の次の拍でタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'suu'], [1, 'suu'], [2, 'suu']], h: [[3]]}, {lvl: 1, len: 4, c: [[0, 'suu'], [.5, 'suu'], [1, 'suu']], h: [[1.5]]}, {lvl: 2, len: 4, c: [[0, 'suu'], [.5, 'suu'], [1, 'suu'], [2, 'suu'], [2.5, 'suu'], [3, 'suu']], h: [[1.5, 0, 0], [3.5, 0, 3]]}],
    L() { return {cx: W * .45, cy: H * .66, h: Math.min(H * .3, 250)}; },
    pos() { const l = this.L(); return [l.cx, l.cy - l.h * 1.3]; }, cuePos() { return [W * .8, H * .32]; }, hitSfx() { sfxK('blow'); },
    draw(now) {
      const l = this.L(), p = charPose(now);
      bgSky('#bfe3ef', '#6fb0c8');
      for (let i = 0; i < 14; i++) circle((i * 71) % W, ((i * 137 - now * 40) % H + H) % H, 4 + i % 4 * 3, null, 'rgba(255,255,255,.7)', 2);
      ctx.fillStyle = '#e8d8b0'; ctx.fillRect(0, H * .86, W, H); ctx.fillStyle = INK; ctx.fillRect(0, H * .86 - 1.5, W, 3);
      const ns = G.byG.puffer || [], qs = G.cuesByG.puffer || [];
      let lastBlow = -99, lastRes = null; for (const n of ns) if (n.res && n.hitT <= now) { if (n.t > lastBlow) { lastBlow = n.t; lastRes = n; } }
      const cnt = qs.filter(q => q.t <= now && q.t > lastBlow + .05).length;
      const d = lastRes ? now - lastRes.hitT : 9, good = lastRes && lastRes.res !== 'MISS';
      let s = 1 + .12 * Math.min(cnt, 3);
      if (d < .4) s = good ? lerp(1.36, 1, d / .4) : 1.36 - .1 * Math.sin(d * 40);
      const PF = SEQ.puff2, gy = H * .86 + 8, hh = l.h * .95; this._pv = (this._pv || 0) + (Math.min(cnt, 3) - (this._pv || 0)) * .25;
      if (lastRes && !good && d < .7) seqPlay(PF, [[8, 0], [7, .35]], d, l.cx, gy, hh, {fade: .06});
      else if (good && d < .5) seqPlay(PF, [[6, 0], [0, .38]], d, l.cx - 30 * Math.max(0, spring(d)), gy, hh, {fade: .1});
      else seqPlay(PF, [[0, 0], [1, .9], [3, 1.9], [5, 2.9]], this._pv, l.cx, gy, hh, {sx: p.sx * (1 + .05 * Math.max(0, spring(tapAge(now)))), sy: p.sy, fade: .6});
      if (good && d < .6) for (let k = 0; k < 7; k++) circle(l.cx + l.h * .4 + d * 400 + k * 18, l.cy - l.h * .4 + Math.sin(k * 2 + d * 10) * 14, 6 + k % 3 * 3, 'rgba(255,255,255,.6)', INK, 2);
    }},
  sloth: {char: 'sloth', title: 'の〜び合わせ', guide: '「の〜〜」と同じ長さだけ押しっぱなし',
    pats: [{lvl: 0, len: 8, c: [[0, 'noo', 2]], h: [[4, 2]]}, {lvl: 1, len: 8, c: [[0, 'noo', 1], [2, 'noo', 1]], h: [[4, 1], [6, 1]]}, {lvl: 2, len: 8, c: [[0, 'noo', 3]], h: [[4, 3]]}, {lvl: 2, len: 8, c: [[0, 'noo', .5], [1, 'noo', 2]], h: [[4, .5], [5, 2]]}],
    L() { return {h: Math.min(H * .27, 220), y: H * .74, ax: W * .28, bx: W * .72}; },
    pos(n) { const l = this.L(); return [l.bx, l.y - l.h * 1.3]; }, cuePos() { const l = this.L(); return [l.ax, l.y - l.h * 1.35]; }, hitSfx() {},
    draw(now) {
      const l = this.L(), p = charPose(now);
      bgSky('#e4efd6', '#c7dcae');
      ctx.fillStyle = '#7a9c5a'; ctx.fillRect(0, l.y, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.y - 1.5, W, 3);
      ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, H * .2, W, 14); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-4, H * .2, W + 8, 14);
      let a = 0; for (const q of G.cuesByG.sloth || []) { if (now >= q.t && now < q.t + q.dur + .25) a = now < q.t + q.dur ? clamp((now - q.t) / q.dur, 0, 1) : 1 - (now - q.t - q.dur) / .25; }
      let b = 0; for (const n of G.byG.sloth || []) { if (n.holding != null) b = clamp((now - n.t) / n.dur, 0, 1.2); }
      const SL = SEQ.sloth, hg = SL[1], sy1 = 1 + .3 * a;
      sfDraw(hg, l.ax, H * .2 - 4 + l.h * hg.hr * sy1, l.h, {sy: sy1, sx: p.sx});
      const SC = SEQ.slothc, ra = reactAge();
      if (missing()) seqPlay(SC, [[5, 0]], 0, l.bx, l.y + 6, l.h, {flip: true, rot: Math.sin(ra * 20) * .03});
      else if (b > 0) seqPlay(SC, [[1, 0], [2, 1], [3, 2], [4, 3]], (now * 4) % 4, l.bx, l.y + 6, l.h, {flip: true, rot: Math.sin(now * 20) * .015, fade: .3});
      else if (G.react.res && G.react.res !== 'MISS' && ra < .9) sfDraw(SEQ.slothT[0], l.bx, l.y + 6 - Math.max(0, spring(ra)) * 10, l.h, {flip: true});
      else seqPlay(SC, [[0, 0]], 0, l.bx, l.y + 6, l.h, {flip: true, sx: p.sx, sy: p.sy, rot: p.rot});
      if (b > 0) text('の〜〜', l.bx, l.y - l.h * (1 + .35 * b) - 20, 22, '#fff', {stroke: 5, sc: '#8a6a4a'});
    }},
  bulldog: {char: 'bulldog', title: 'どすこい張り手', guide: '弟子の「ハッ！」の2拍あとにタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'ha']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'ha'], [.5, 'ha']], h: [[2], [2.5]]}, {lvl: 2, len: 4, c: [[0, 'ha'], [1, 'ha'], [1.5, 'ha']], h: [[2], [3], [3.5]]}, {lvl: 2, len: 4, c: [[0, 'ha'], [.5, 'ha'], [1, 'ha']], h: [[2], [2.5], [3]]}],
    L() { return {h: Math.min(H * .3, 250), y: H * .74, bx: W * .5, px: W * .84, ax: W * .14}; },
    pos() { const l = this.L(); return [l.px, l.y - l.h - 20]; }, cuePos() { const l = this.L(); return [l.ax + 10, l.y - l.h * .7]; }, hitSfx() { sfxK('slap'); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#f1e2c6', '#e6cfa6');
      ctx.strokeStyle = 'rgba(59,47,42,.25)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, l.y); ctx.stroke(); }
      ctx.fillStyle = '#c9a26b'; ctx.fillRect(0, l.y, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.y - 1.5, W, 3);
      const sh = (G.byG.bulldog || []).some(n => n.res && n.res !== 'MISS' && now - n.hitT < .2) ? Math.sin(now * 80) * 4 : 0;
      ctx.fillStyle = '#a8784a'; ctx.fillRect(l.px - 18 + sh, l.y - l.h * 1.4, 36, l.h * 1.4); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(l.px - 18 + sh, l.y - l.h * 1.4, 36, l.h * 1.4);
      const shout = (G.cuesByG.bulldog || []).some(q => now >= q.t && now < q.t + .15);
      spr('pug', l.ax, l.y + 6, l.h * .55, {sx: shout ? 1.1 : 1, sy: shout ? .9 : 1});
      const push = ta < 0 ? 0 : ta < .06 ? ta / .06 : Math.max(0, Math.exp(-(ta - .06) * 10) * Math.cos((ta - .06) * 22));
      if (push > .5) { ctx.strokeStyle = 'rgba(59,47,42,.5)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { const y = l.y - l.h * (.3 + k * .2); ctx.beginPath(); ctx.moveTo(l.bx - l.h * .5, y); ctx.lineTo(l.bx - l.h * .2, y); ctx.stroke(); } }
      if (missing()) seqPlay(SEQ.bulls, [[3, 0]], 0, l.bx, l.y + 6, l.h * .95, {rot: Math.sin(reactAge() * 20) * .05});
      else if (ta >= 0 && ta < .3) seqPlay(SEQ.bulls, [[1, 0], [2, .06], [0, .24]], ta, l.bx + push * W * .08, l.y + 6, l.h * .95, {fade: .035});
      else seqPlay(SEQ.bulls, [[0, 0]], 0, l.bx, l.y + 6, l.h * .95, {sx: p.sx, sy: p.sy, rot: p.rot});
      if (push > .3 && (G.byG.bulldog || []).some(n => n.res && n.res !== 'MISS' && now - n.hitT < .2)) text('バチン！', l.px - 20, l.y - l.h * 1.1, 26, '#fff', {stroke: 6, sc: '#e8554e'});
    }},

  hurdle: {char: 'pug', title: 'パグ太ダッシュ', guide: '「タン、タン」と助走したら次でジャンプ！ 「ワン！」は跳ばずにホネをパクッ',
    pats: [{lvl: 0, len: 4, c: [[0, 'ta'], [.5, 'ta'], [2, 'ta'], [2.5, 'ta']], h: [[1, 0, 0], [3, 0, 2]]},
      {lvl: 1, len: 4, c: [[0, 'ta'], [.5, 'ta'], [2, 'wan']], h: [[1, 0, 0], [3, 0, 2, 1]]},
      {lvl: 1, len: 4, c: [[0, 'ta'], [1, 'ta'], [2.5, 'ta'], [3, 'ta']], h: [[2, 0, 0], [3.5, 0, 2]]},
      {lvl: 2, len: 4, c: [[0, 'ta'], [.5, 'ta'], [2.5, 'ta'], [3, 'ta']], h: [[1, 0, 0], [1.5, 0, 1], [3.5, 0, 3]]},
      {lvl: 2, len: 4, c: [[0, 'wan'], [1, 'ta'], [1.5, 'ta'], [2.5, 'ta'], [3, 'ta']], h: [[1, 0, 0, 1], [2, 0, 1], [3.5, 0, 3]]},
      {lvl: 2, len: 4, c: [[0, 'ta'], [.5, 'ta'], [1.5, 'ta'], [2, 'ta'], [3, 'wan']], h: [[1, 0, 0], [2.5, 0, 2], [4, 0, 4, 1]]}],
    L() { return {gy: H * .72, px: W * .3, h: Math.min(H * .19, 160)}; },
    pos() { const l = this.L(); return [l.px, l.gy - l.h * 1.6]; }, cuePos() { return [W * .72, H * .3]; }, hitSfx() { sfxK('hop'); },
    hd(x, y, rot, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = '#c98b4f'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.fillRect(-28, -40, 8, 40); ctx.strokeRect(-28, -40, 8, 40); ctx.fillRect(20, -40, 8, 40); ctx.strokeRect(20, -40, 8, 40); rr(-36, -50, 72, 13, 6); ctx.fillStyle = '#e8554e'; ctx.fill(); ctx.stroke(); ctx.restore(); },
    bone(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.fillStyle = '#fbf3e0'; ctx.strokeStyle = INK; ctx.lineWidth = 2.5; rr(-s, -s * .22, s * 2, s * .44, 4); ctx.fill(); ctx.stroke(); for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) circle(a * s, b * s * .28, s * .3, '#fbf3e0', INK, 2.5); rr(-s * .9, -s * .2, s * 1.8, s * .4, 3); ctx.fill(); ctx.restore(); },
    draw(now) {
      const l = this.L(), ta = tapAge(now), spb = G.song.spb, V = W * .45 / spb, ns = G.byG.hurdle || [], ph = ((now / spb) % 1 + 1) % 1;
      bgSky('#dff0f7', '#f4ecda');
      ctx.fillStyle = '#cfe3c0'; for (let i = 0; i < 4; i++) { const x = ((i * W * .55 - now * V * .12) % (W * 2.2) + W * 2.2) % (W * 2.2) - W * .4; ctx.beginPath(); ctx.ellipse(x, l.gy - 60, W * .33, 80, 0, Math.PI, 0); ctx.fill(); }
      ctx.fillStyle = '#9fcd8f'; ctx.fillRect(0, l.gy - 60, W, 60);
      ctx.strokeStyle = 'rgba(140,100,60,.55)'; ctx.lineWidth = 4; for (let i = 0; i < 9; i++) { const x = ((i * 60 - now * V * .5) % 540 + 540) % 540 - 30; ctx.beginPath(); ctx.moveTo(x, l.gy - 52); ctx.lineTo(x, l.gy - 12); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(0, l.gy - 42); ctx.lineTo(W, l.gy - 42); ctx.stroke();
      ctx.fillStyle = '#d9a06a'; ctx.fillRect(0, l.gy, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.gy - 1.5, W, 3);
      ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { const x = ((i * 90 - now * V) % 720 + 720) % 720 - 45; ctx.beginPath(); ctx.moveTo(x, l.gy + 40); ctx.lineTo(x + 44, l.gy + 40); ctx.stroke(); }
      let jump = null, trip = null, munch = null, jy = 0; const arc = d => Math.sin(Math.PI * clamp(d / .45, 0, 1));
      const TO = l.px + l.h * .62, qs = G.cuesByG.hurdle || [];
      for (const n of ns) {
        const x = (n.trap ? l.px + l.h * .45 : TO) + (n.t - now) * V;
        if (n.trap) {
          const by = l.gy - l.h * .42;
          if (n.bonk) { const d = now - n.hitT; if (d >= 0 && d < .45) { jump = d; trip = null; jy = Math.max(jy, arc(d)); } if (x > -40 && x < W + 40) this.bone(x, by, 20, now * 8); if (now > n.t && now - n.t < .5) text('あっ…', l.px - 20, l.gy - l.h * 1.5, 22, '#fff', {stroke: 5, sc: '#8a6a4a', a: 1 - (now - n.t) * 2}); continue; }
          if (now < n.t) { if (x < W + 40 && now > n.cueT - .1) this.bone(x, by - Math.abs(Math.sin(now * 9)) * 16, 20, now * 8); }
          else if (now - n.t < .5) { munch = n; }
          continue;
        }
        if (now < n.cueT - .05 && x > W + 60) continue;
        let rot = 0, a = 1, hx = x;
        if (n.res === 'MISS') { const d = now - n.hitT; if (d > .8) continue; hx = l.px + l.h * .35 - d * V * .5; rot = Math.min(1.4, d * 7); a = 1 - d / .8; if (d < .6) { trip = d; jump = null; } }
        else if (n.res) { const d = now - n.hitT; if (d < .45 && d >= 0) { jump = d; trip = null; jy = Math.max(jy, arc(d)); } }
        if (hx < -60 || hx > W + 60) continue;
        this.hd(hx, l.gy, rot, a);
      }
      if (trip != null) { spr('pug_trip', l.px, l.gy + 8, l.h * .85, {rot: Math.sin(trip * 30) * .05}); }
      else if (jump != null) { const k = clamp(jump / .45, 0, 1), y = jy * l.h * 1.05; if (k < .5) spr('pug_jump', l.px, l.gy + 4 - y, l.h, {rot: -.15 + k * .3}); else sfDraw(SEQ.pugs[2], l.px, l.gy + 4 - y, l.h, {flip: true, rot: .05 + (k - .5) * .2}); }
      else {
        let step = null; for (const q of qs) if (q.snd === 'ta' && now >= q.t && now - q.t < .16) step = now - q.t;
        const hop = ta >= 0 && ta < .25 ? Math.sin(Math.PI * ta / .25) * l.h * .3 : 0, h2 = step != null ? .25 + step / .16 * .5 : ((now / spb * 2) % 1 + 1) % 1, b = Math.abs(Math.sin(h2 * Math.PI)) * (step != null ? 18 : 10);
        if (step != null) { for (let k = 0; k < 4; k++) circle(l.px - 10 - k * 14 - step * 120, l.gy - 4 - Math.sin(k + 1) * step * 60, 9 * (1 - step / .16) + 2, 'rgba(200,170,130,.8)', INK, 1.5); text('タン', l.px - 40, l.gy + 30, 18, '#fff', {stroke: 4, sc: '#8a6a4a', a: 1 - step / .16}); }
        if (h2 < .5) spr('pug_dash', l.px, l.gy + 4 - hop - b, l.h); else sfDraw(SEQ.pugs[1], l.px, l.gy + 4 - hop - b, l.h * .95, {flip: true});
        ctx.strokeStyle = 'rgba(59,47,42,.35)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { const y = l.gy - l.h * (.25 + k * .22), o = ((now * 6 + k * .3) % 1) * 30; ctx.beginPath(); ctx.moveTo(l.px - l.h * .55 - o, y); ctx.lineTo(l.px - l.h * .9 - o, y); ctx.stroke(); }
        for (let k = 0; k < 3; k++) { const d = (now * 3 + k / 3) % 1; circle(l.px - l.h * .4 - d * 60, l.gy - 6 - d * 14, 6 * (1 - d), 'rgba(220,200,170,.8)'); }
      }
      if (munch) { const d = now - munch.t; this.bone(l.px + l.h * .45, l.gy - l.h * .62, 16, .2); text('パクッ！', l.px + 40, l.gy - l.h * 1.3 - d * 30, 26, '#fff', {stroke: 6, sc: '#e8a33e', a: 1 - d * 2}); }
      const got = ns.filter(n => n.trap && !n.bonk && now > n.t).length;
      if (got) { this.bone(W - 74, SAT + 100, 14, 0); text('×' + got, W - 30, SAT + 106, 22, '#fff', {stroke: 5, sc: '#8a6a4a'}); }
    }},
  penguin: {char: 'penguin', title: 'はらすべり', guide: '笛の「ピッ、ピッ」の次の拍でタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'pi'], [1, 'pi']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'pi'], [.5, 'pi']], h: [[1]]}, {lvl: 2, len: 4, c: [[0, 'pi'], [.5, 'pi'], [1, 'pi']], h: [[1.5]]}],
    L() { return {gy: H * .7, px: W * .28, h: Math.min(H * .22, 180)}; },
    pos() { const l = this.L(); return [W * .6, l.gy - l.h * 1.3]; }, cuePos() { return [W * .7, H * .3]; }, hitSfx() { sfxK('splash'); },
    fish(x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.ellipse(0, 0, 22, 10, 0, 0, 7); ctx.fillStyle = '#8fb3cf'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(32, -9); ctx.lineTo(32, 9); ctx.closePath(); ctx.fill(); ctx.stroke(); circle(-12, -2, 2.2, INK); ctx.restore(); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#dcecf7', '#f6fbff');
      ctx.fillStyle = '#eef6fb'; ctx.fillRect(0, l.gy, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.gy - 1.5, W, 3);
      ctx.fillStyle = '#8cc3df'; ctx.fillRect(0, H * .88, W, H); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const x = ((i * 80 + now * 40) % (W + 80)) - 40; ctx.beginPath(); ctx.moveTo(x, H * .9 + i % 2 * 12); ctx.lineTo(x + 30, H * .9 + i % 2 * 12); ctx.stroke(); }
      let slide = null, fail = null;
      for (const n of G.byG.penguin || []) {
        if (now < n.cueT - .05) continue;
        if (!n.res) this.fish(W * .78, l.gy - 10 - Math.abs(Math.sin(now * 12 + n.t)) * 10, Math.sin(now * 14 + n.t) * .3);
        else if (n.res === 'MISS') { const d = now - n.hitT; if (d < .65) { fail = d; slide = null; this.fish(W * .78 + d * 300, l.gy - 10 - d * 200, d * 8); } }
        else { const d = now - n.hitT; if (d < .6) { slide = d; fail = null; } }
      }
      const PG = SEQ.pengn, PQ = SEQ.pengP;
      if (fail != null) seqPlay(PQ, [[3, 0], [1, .24]], fail, l.px, l.gy + 6, l.h * .95, {rot: Math.sin(fail * 30) * .03, fade: .07});
      else if (slide != null) {
        const k = Math.sin(Math.PI * clamp(slide / .6, 0, 1)), x = l.px + k * W * .4;
        seqPlay(PG, [[2, 0], [3, .07], [4, .2], [5, .3], [6, .4], [0, .52]], slide, x, l.gy + 8, l.h * .95, {fade: .06});
        for (let i = 0; i < 6; i++) circle(x - l.h * .5 - i * 14, l.gy - 6 - Math.sin(i + slide * 20) * 10, 4, 'rgba(140,195,223,.8)', INK, 1.5);
      } else {
        const ph = ((now / G.song.spb) % 1 + 1) % 1, s = Math.max(0, spring(ta));
        seqPlay(PG, [[0, 0], [1, .5]], ph, l.px + s * 20, l.gy + 6 - Math.abs(Math.sin(ph * Math.PI)) * 5, l.h, {rot: Math.sin(ph * Math.PI * 2) * .05, sx: p.sx * (1 + .08 * s), sy: p.sy * (1 - .1 * s), fade: .1});
      }
    }},
  sumo: {char: 'bulldog', title: 'ぶつかり稽古', guide: '「ハッ・ケ・ヨイ」の次の拍でタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'hk1'], [1, 'hk2'], [2, 'hk3']], h: [[3]]}, {lvl: 1, len: 4, c: [[0, 'hk1'], [.5, 'hk2'], [1, 'hk3']], h: [[1.5]]}, {lvl: 2, len: 4, c: [[0, 'hk1'], [.5, 'hk2'], [1, 'hk3'], [2, 'hk1'], [2.5, 'hk2'], [3, 'hk3']], h: [[1.5, 0, 0], [3.5, 0, 3]]}],
    L() { return {gy: H * .72, bx: W * .3, h: Math.min(H * .19, 160), tx: W * .8}; },
    pos() { const l = this.L(); return [l.tx, l.gy - 170]; }, cuePos() { return [W * .5, H * .3]; }, hitSfx() { sfxK('dosun'); },
    draw(now) {
      const l = this.L(), ta = tapAge(now);
      bgSky('#f3e6cc', '#e8d3ad');
      ctx.fillStyle = '#c9a26b'; ctx.fillRect(0, l.gy, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.gy - 1.5, W, 3);
      ellipse(W / 2, l.gy + 30, W * .48, 26, null, '#f6efe0', 6);
      const hitN = (G.byG.sumo || []).find(n => n.res && n.res !== 'MISS' && now - n.hitT < .5), wob = hitN ? Math.sin((now - hitN.hitT) * 40) * .25 * (1 - (now - hitN.hitT) / .5) : 0;
      ctx.save(); ctx.translate(l.tx, l.gy); ctx.rotate(wob); ctx.fillStyle = '#dcc37c'; ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(-34, -130, 68, 130, 20); ctx.fill(); ctx.stroke();
      for (const y of [-100, -65, -30]) { ctx.beginPath(); ctx.moveTo(-34, y); ctx.lineTo(34, y); ctx.stroke(); } ctx.restore();
      if (hitN && now - hitN.hitT < .3) text('ドスン！', l.tx, l.gy - 160, 28, '#fff', {stroke: 6, sc: '#e8554e'});
      const push = ta < 0 ? 0 : ta < .07 ? ta / .07 : Math.max(0, Math.exp(-(ta - .07) * 7) * Math.cos((ta - .07) * 14));
      const BU = SEQ.bulls;
      if (missing()) seqPlay(BU, [[3, 0]], 0, l.bx, l.gy + 6, l.h, {rot: Math.sin(reactAge() * 20) * .05});
      else if (push > .15) seqPlay(BU, [[1, 0], [2, .09]], ta, l.bx + push * (l.tx - l.bx - l.h * .9), l.gy + 6, l.h, {fade: .05});
      else { const ph = ((now / G.song.spb) % 1 + 1) % 1; seqPlay(BU, [[0, 0]], 0, l.bx, l.gy + 6, l.h * .9, {sy: 1 - .03 * Math.exp(-ph * 5)}); }
    }},
  dance: {char: 'dog', title: 'ダンスバトル', guide: 'シワ丸の「ヘイ！」を次の小節でマネしてタップ',
    pats: [mkCall([0, 1, 2, 3], 0, 'hey'), mkCall([0, 1, 2], 0, 'hey'), mkCall([0, 1.5, 2, 3], 1, 'hey'), mkCall([0, .5, 1, 2.5], 1, 'hey'), mkCall([.5, 1.5, 2.5, 3], 2, 'hey'), mkCall([0, .75, 1.5, 2.5, 3], 2, 'hey')],
    L() { return {h: Math.min(H * .28, 230), y: H * .72, dx: W * .28, ux: W * .72}; },
    pos() { const l = this.L(); return [l.ux, l.y - l.h - 20]; }, cuePos() { const l = this.L(); return [l.dx, l.y - l.h - 30]; }, hitSfx() {},
    draw(now) {
      const l = this.L(), ta = tapAge(now);
      bgSky('#2d2340', '#4a2d4f');
      for (let i = 0; i < 5; i++) { const a = now * 1.5 + i * 1.3; ctx.fillStyle = ['rgba(232,85,78,.25)', 'rgba(79,179,169,.25)', 'rgba(242,193,46,.25)'][i % 3]; circle(W / 2 + Math.cos(a) * W * .4, H * .3 + Math.sin(a * 1.3) * H * .15, 50 + i * 8, ctx.fillStyle); }
      for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? '#e8d5b0' : '#c9a26b'; ctx.fillRect(i * W / 8, l.y, W / 8 + 1, H); } ctx.fillStyle = INK; ctx.fillRect(0, l.y - 1.5, W, 3);
      let lc = -9, cn = 0; for (const q of G.cuesByG.dance || []) if (q.t <= now) { lc = q.t; cn++; }
      const ds = spring(now - lc), bph = ((now / G.song.spb) % 1 + 1) % 1, bb = Math.exp(-bph * 5), DN = SEQ.dn;
      [['bull', .12], ['pig', .38], ['capy', .62], ['sloth', .88]].forEach(([k, fx], i) => { const j = Math.max(0, bb) * (i % 2 ? 1 : .7) + Math.max(0, spring(now - lc)) * .6, up = ((i + cn) % 2 ? 1 : -1); sfDraw(DN[k], W * fx, l.y - 44 - 16 * j, l.h * .46, {flip: up < 0, sx: 1 + .05 * j, sy: 1 - .06 * j, a: .92}); });
      spr('dog_dance', l.dx, l.y + 6, l.h, {flip: cn % 2 === 1, sx: 1 + .1 * ds, sy: 1 - .12 * ds});
      const us = spring(ta);
      if (missing()) spr('pug_trip', l.ux, l.y + 6, l.h * .7, {rot: Math.sin(reactAge() * 25) * .05});
      else spr('pug_dance', l.ux, l.y + 6 - 12 * Math.max(0, us), l.h, {flip: (G.tapN || 0) % 2 === 0, sx: 1 + .1 * us, sy: 1 - .12 * us});
      if (ta >= 0 && ta < .3) text('ヘイ！', l.ux, l.y - l.h - 6 - ta * 40, 24 * (1 + .4 * Math.max(0, spring(ta))), '#fff', {stroke: 5, sc: '#4fb3a9', a: 1 - ta / .3});
    }},
};
const SCN_KEYS = Object.keys(SCENES);

function buildCue(st, spb, phase) {
  const rng = RNG(hash(st.id) + 5), segs = [], cues = [], notes = []; let b = 8;
  const put = (g, lvl, practice, pi = 0) => {
    const P = SCENES[g].pats, ok = P.filter(p => p.lvl <= lvl), top = ok.filter(p => p.lvl === Math.max(...ok.map(x => x.lvl)));
    const p = practice ? P[pi] : (rng() < .6 ? pick(rng, top) : pick(rng, ok));
    const hole = Math.floor(rng() * 3), grp = cues.length;
    const pc = p.c.map(([x, snd, d]) => ({t: (b + x) * spb, g, snd, dur: (d || 0) * spb, hole, grp, midi: g === 'pig' ? pick(rng, [64, 67, 69, 72, 74]) : 0}));
    p.h.forEach(([x, d, ci, tr], k) => { if (ci == null) ci = p.c.length === p.h.length ? k : 0; notes.push({t: (b + x) * spb, dur: (d || 0) * spb, g, practice, hole, k, cueT: pc[ci].t, midi: pc[ci].midi, trap: !!tr, grp, snd: pc[ci].snd}); });
    cues.push(...pc); b += p.len;
  };
  if (phase === 'practice') {
    const g = st.games[0], P = SCENES[g].pats, tp = P.findIndex(p => p.h.some(h => h[3]));
    segs.push({b0: 0, g, label: 'れんしゅう'});
    for (const k of [0, 0, 1, 1, 0, 1, 0, 1, 0, 1]) put(g, 0, true, k && tp > 0 ? tp : 0);
  } else if (!st.remix) {
    const gs = st.games, one = gs.length === 1, solo = one && phase === 'main';
    if (!solo) gs.forEach((g, i) => { segs.push({b0: i ? b : 0, g, label: 'れんしゅう'}); const P = SCENES[g].pats, tp = P.findIndex(p => p.h.some(h => h[3])); put(g, 0, true, 0); if (one) put(g, 0, true, tp > 0 ? tp : 0); });
    let last = null;
    const N = SCENES[gs[0]].pats[0].len === 8 ? 6 : 12;
    for (let i = 0; i < N; i++) {
      const g = gs[Math.floor(i / 2) % gs.length], r = i / N;
      if (i === 0) { if (solo) segs.push({b0: 0, g, label: ''}); segs.push({b0: solo ? 8 : b, g, label: 'ほんばん！'}); if (!solo) b += 4; } else if (g !== last) segs.push({b0: b, g, label: ''});
      last = g; put(g, r < .3 ? 0 : r < .65 ? 1 : 2, false);
    }
  } else {
    const rounds = st.games.length > 5 ? 1 : 2, tot = rounds * st.games.length; let k = 0;
    for (let r = 0; r < rounds; r++) for (const g of st.games) { const lv = k++ / tot < .5 ? 1 : 2; segs.push({b0: segs.length ? b : 0, g, label: SCENES[g].title}); put(g, lv, false); put(g, lv, false); }
  }
  b += 4;
  notes.sort((x, y) => x.t - y.t);
  if (phase !== 'practice') { const fn = notes.filter(n => !n.practice && !n.trap).pop(); if (fn) fn.fin = true; }
  return {segs, cues, notes, mainBars: Math.ceil((b - 8) / 4)};
}

function drawFace(id, ex, x, y, r) {
  const im = FIMG[id + '_' + ex]; if (!im || !im.complete) return;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.clip(); ctx.drawImage(im, x - r, y - r, r * 2, r * 2); ctx.restore();
  circle(x, y, r, null, INK, 4);
}
MODES.cue = {
  layout() {},
  seg(now) { const b = now / G.song.spb; let s = G.segs[0]; for (const x of G.segs) if (b >= x.b0) s = x; return s; },
  pos(n) { return SCENES[n.g].pos(n); },
  down(x, y, t, id) {
    const now = songNow(); G.lastTap = now;
    const n = findNote(() => true, t), g = n ? n.g : this.seg(now).g, TAP = {capy: 'woosh', frog: 'lick', mole: 'woosh', puffer: 'psh', bulldog: 'woosh', hurdle: 'woosh', penguin: 'woosh', sumo: 'woosh', dance: 'heyp'}; G.tapN = (G.tapN || 0) + 1;
    if (TAP[g]) sfxK(TAP[g]);
    if (n && n.trap) { n.res = 'MISS'; n.bonk = true; n.hitT = now; const p = this.pos(n); record('MISS', p[0], p[1], null, n.practice); sfxK('bonk'); G.shake = performance.now(); return; }
    if (n) { const p = this.pos(n); hit(n, t, p[0], p[1]); SCENES[n.g].hitSfx(n); if (n.fin) { G.finT = performance.now(); G.shake = G.finT; sfxK('kira'); } if (n.dur) { n.holding = id; voiceStart(); } }
    else { if (g === 'pig') sfxK('oink', 67); else if (g === 'sloth') { voiceStart(); this.fake = id; } }
  },
  up(id, e) {
    if (this.fake === id) { voiceStop(); this.fake = null; }
    for (const n of G.notes) if (n.holding === id && !n.tailDone) {
      const t = e ? inputTime(e) : songNow(), dt = t - (n.t + n.dur);
      n.holding = null; n.tailDone = true; voiceStop();
      const p = this.pos(n); record(jres(dt) || 'MISS', p[0], p[1], dt, n.practice);
    }
  },
  practice(now, top) {
    if (!G.pClear) {
      G.pEval = G.pEval || {}; const by = {};
      for (const n of G.notes) (by[n.grp] = by[n.grp] || []).push(n);
      for (const k of Object.keys(by).map(Number).sort((a, b) => a - b)) {
        if (G.pEval[k]) continue; const ns = by[k]; if (!ns.every(n => n.res && now - n.hitT > .2)) break;
        G.pEval[k] = 1; const ok = ns.every(n => n.res !== 'MISS'); G.pStreak = ok ? (G.pStreak || 0) + 1 : 0; if (ok && ns.some(n => n.trap)) G.pTrap = 1; G.pMsg = {ok, t: now};
      }
      const needT = SCENES[G.c.stage.games[0]].pats.some(p => p.h.some(h => h[3]));
      if ((G.pStreak || 0) >= 2 && (!needT || G.pTrap)) { G.pClear = now; sfxK('kira'); const st = G.c.stage, me = G; setTimeout(() => { if (G === me && !G.over) { G.over = true; startStage(st, {phase: 'main'}); } }, 1500); }
    }
    const m = G.pMsg; if (m && now - m.t < .8 && !G.pClear) text(m.ok ? 'いいね！' : 'もういっかい！', W / 2, H * .3, 30, '#fff', {stroke: 6, sc: m.ok ? '#4fb3a9' : '#e8554e', a: 1 - (now - m.t) / .8});
    for (let i = 0; i < 2; i++) circle(W / 2 - 14 + i * 28, top + 80, 9, i < (G.pStreak || 0) ? '#4fb3a9' : '#fff', INK, 2.5);
    if (G.pClear) text('OK！ ほんばんいくよ！', W / 2, H * .3, 30, '#fff', {stroke: 7, sc: '#4fb3a9'});
  },
  draw(now) {
    const s = this.seg(now), sc = SCENES[s.g];
    sc.draw(now);
    const top = SAT + 54;
    for (const q of G.cuesByG[s.g] || []) { const d = now - q.t; if (d < 0 || d > .45) continue; const [x, y] = sc.cuePos(q); text(CUELBL[q.snd], x, y - d * 30, 30, '#fff', {stroke: 6, a: 1 - d / .45}); }
    const lb = s.label, la = now / G.song.spb - s.b0;
    if (lb === 'れんしゅう' || lb === 'ほんばん！') text(lb, W / 2, top + 6, 22, lb === 'ほんばん！' ? '#e8554e' : INK, {stroke: 5, sc: '#fff', a: lb === 'ほんばん！' ? clamp(2 - la / 2, 0, 1) : 1});
    else if (lb && la < 4) { text(lb, W / 2, H * .42, 36, '#fff', {stroke: 7, a: clamp(1 - (la - 2) / 2, 0, 1)}); }
    if (lb === 'れんしゅう') {
      sc.guide.split('！ ').forEach((s, i, A) => text(s + (i < A.length - 1 ? '！' : ''), W / 2, top + 34 + i * 20, 15, INK, {stroke: 4, sc: '#fff', w: 700}));
      for (const n of G.notes) if (n.practice && now > n.t - .12 && now < n.t + .25) text(n.trap ? 'まって！' : 'いま！', W / 2, H * .45, 52, '#e8554e', {stroke: 7, sc: '#fff'});
    }
    const ra = (performance.now() - G.react.t) / 1000;
    const ex = ra < .7 && G.react.res ? (G.react.res === 'MISS' ? 'cry' : 'smile') : (lb === 'ほんばん！' && la < 2 ? 'surprise' : 'angry');
    drawFace(sc.char, ex, 46, H - 46 - SAT * 0, 34);
    if (G.finT) { const fa = (performance.now() - G.finT) / 1000; if (fa < 1.4) { ctx.globalAlpha = Math.max(0, .5 - fa); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; text('キマった！', W / 2, H * .36, 44 * (1 + .3 * Math.max(0, spring(fa))), '#fff', {stroke: 8, sc: '#e8554e', a: clamp(1.4 - fa, 0, 1)}); } }
    if (G.c.phase === 'practice') this.practice(now, top);
    drawFx();
  }
};

/* ---------- story ---------- */
const STAGES = [
  {id: 's0', kind: 'cue', games: ['hurdle'], char: 'pug', name: 'パグ太の朝練', noJoin: true, bpm: 132, scale: 'major', root: 62, wave: 'square', bg: '#f7e2bd',
    talk: [['pug', 'angry', 'バンドを組む前に、まずは朝練だ！'], ['pug', 'smile', '「タッ、タッ」の次の拍でハードルをジャンプ！ 「ワン！」のときは跳ばずにホネをパクッだ！']]},
  {id: 's1', kind: 'cue', games: ['capy'], char: 'capybara', part: '鈴', bpm: 124, scale: 'major', root: 60, wave: 'triangle', bg: '#d9e8d0',
    talk: [['pug', 'smile', 'よし！ 今日から「はちまきバンド」結成だ！'], ['pug', 'angry', 'まずはメンバー集め。温泉でのんびりしてるあいつに声をかけよう。'], ['capybara', 'surprise', '…え、ぼく？'], ['pug', 'smile', '「ポン」と飛んでくるみかんを、次の拍で頭でキャッチ！ 石の「ゴロッ」はよけろよ！'], ['capybara', 'smile', '…みかん、いっぱい乗せたい。']]},
  {id: 's2', kind: 'cue', games: ['frog'], char: 'frog', part: 'カスタネット', bpm: 124, scale: 'major', root: 64, wave: 'square', bg: '#dff0c8',
    talk: [['frog', 'angry', 'ケロ。バンドだと？ ならオレの舌さばきを見てもらおう。'], ['frog', 'smile', 'ハエの「ブン、ブン」を聞いて、次の拍でパクッといけ！']]},
  {id: 's3', kind: 'cue', games: ['mole'], char: 'mole', part: 'ウッドブロック', bpm: 128, scale: 'major', root: 59, wave: 'square', bg: '#e9dcc0',
    talk: [['mole', 'surprise', 'モグッ!? 音楽隊？'], ['pug', 'smile', '「キラッ、キラッ」の次で顔を出して、お宝の王冠をゲットだ！'], ['mole', 'cry', 'でも「ゴンッ」ってハンマーの音がしたら、もぐってないと…!?']]},
  {id: 'r1', kind: 'cue', games: ['capy', 'frog', 'mole'], char: 'pug', remix: true, name: 'リハーサル1', bpm: 124, scale: 'major', root: 62, wave: 'square', bg: '#f7e2bd',
    talk: [['pug', 'smile', 'メンバーが3人増えた！ 初リハーサルだ！'], ['capybara', 'smile', '…ゲームが次々に切り替わるから、よく聞いてね。']]},
  {id: 's4', kind: 'cue', games: ['pig'], char: 'pig', part: 'コーラス', bpm: 116, scale: 'major', root: 60, wave: 'square', bg: '#fbd9dc',
    talk: [['pig', 'angry', 'ブッ！ コーラス志望なら、ぼくのマネをしてみるブー。'], ['pig', 'smile', 'ぼくの「ブー」を、次の小節でそっくり返すブー！']]},
  {id: 's5', kind: 'cue', games: ['sloth'], char: 'sloth', part: 'ベース', bpm: 100, scale: 'major', root: 58, wave: 'sine', bg: '#e4dccb',
    talk: [['sloth', 'smile', 'の〜〜… ベース？ いいよ〜'], ['sloth', 'angry', 'ぼくの「の〜〜」と同じ長さだけ、押しっぱなしにしてね〜']]},
  {id: 's6', kind: 'cue', games: ['puffer'], char: 'puffer', part: '管楽器', bpm: 128, scale: 'minor', root: 62, wave: 'triangle', bg: '#cfe6f0',
    talk: [['puffer', 'angry', 'ぷく。肺活量なら誰にも負けない。'], ['puffer', 'smile', '「スッ、スッ、スッ」と3回吸ったら、次の拍でプシュー！']]},
  {id: 'r2', kind: 'cue', games: ['pig', 'sloth', 'puffer', 'mole'], char: 'pug', remix: true, name: 'リハーサル2', bpm: 120, scale: 'minor', root: 60, wave: 'square', bg: '#f7e2bd',
    talk: [['pug', 'smile', '7人そろった！ 2回目のリハーサルだ！'], ['puffer', 'surprise', 'ぷく、もう本番みたい…']]},
  {id: 's7', kind: 'cue', games: ['penguin'], char: 'penguin', part: 'ギター', bpm: 120, scale: 'minor', root: 60, wave: 'triangle', bg: '#dcecf7',
    talk: [['penguin', 'smile', 'ギターならまかせて。'], ['penguin', 'angry', '笛の「ピッ、ピッ」の次の拍で、お腹ですべり込んでね！']]},
  {id: 's8', kind: 'cue', games: ['bulldog', 'sumo'], char: 'bulldog', part: '太鼓', bpm: 128, scale: 'minor', root: 57, wave: 'sawtooth', bg: '#f3cdbf',
    talk: [['bulldog', 'angry', 'どすこい！ 太鼓は張り手が命じゃ。'], ['bulldog', 'smile', '弟子の「ハッ！」の2拍あとに張り手じゃ！'], ['bulldog', 'angry', '「ハッ・ケ・ヨイ」の次で、ぶつかり稽古もあるぞ！']]},
  {id: 's9', kind: 'cue', games: ['dance'], char: 'dog', part: 'DJ', bpm: 132, scale: 'minor', root: 61, wave: 'sawtooth', bg: '#ecd2c4',
    talk: [['dog', 'angry', 'DJ志望だと？ オレのステップについてこられるか？'], ['pug', 'angry', 'シワ丸の「ヘイ！」を、次の小節でマネすればいいんだな！']]},
  {id: 'fin', kind: 'cue', games: SCN_KEYS, char: 'pug', remix: true, name: 'ファイナルライブ', bpm: 132, scale: 'major', root: 62, wave: 'square', bg: '#f7e2bd',
    talk: [['pug', 'smile', 'ついに10人そろった！'], ['pug', 'angry', '大舞台のライブだ。全部のゲームが入ったメドレーでいくぞ！'], ['bulldog', 'smile', 'いくぞ、はちまきバンド！']]},
];
const CH = id => CHARS.find(c => c.id === id);
let playStage = null;
const prog = () => store.get('hb_prog', 0);
function stageName(st) { return st.name || CH(st.char).name; }
function stageTitle(st) { return st.remix ? 'リミックス' : st.games.map(g => SCENES[g].title).join('+'); }
function renderStory() {
  const p = prog();
  const joined = ['pug'].concat(STAGES.slice(0, p).filter(s => s.part).map(s => s.char));
  $('#band').innerHTML = `<span class="lbl">メンバー ${joined.length}/10</span>` + joined.map(id => `<img src="${POSES[id]}" alt="">`).join('');
  let no = 0;
  $('#slist').innerHTML = STAGES.map((st, i) => {
    const lock = i > p, m = store.get('hb_medal_' + st.id, null);
    const lbl = st.remix ? (st.id === 'fin' ? 'FINAL' : 'REMIX') : st.noJoin ? 'PROLOGUE' : 'STAGE ' + (++no);
    const face = st.remix || st.noJoin ? FACES['pug_smile'] : FACES[st.char + '_angry'];
    return `<div class="stg${lock ? ' lock' : ''}${st.remix ? ' rx' : ''}" data-i="${i}"><img src="${face}" alt=""><div><div class="no">${lbl}</div><div class="t1">${lock ? '？？？' : stageName(st)}</div><div class="t2">${lock ? 'まだひみつ' : stageTitle(st) + (st.part ? ' ・ ' + st.part + '担当' : '')}</div></div><div class="md">${m === 'high' ? '★ハイレベル' : m ? '合格' : ''}</div></div>`;
  }).join('');
}
$('#slist').addEventListener('click', e => {
  const el = e.target.closest('.stg'); if (!el || el.classList.contains('lock')) return;
  const st = STAGES[+el.dataset.i]; talk(st.talk, () => startStage(st));
});
let talkQ = null, talkDone = null;
function talk(lines, done) { talkQ = lines.slice(); talkDone = done; $('#talk').classList.add('on'); nextTalk(); }
function nextTalk() {
  if (!talkQ.length) { $('#talk').classList.remove('on'); const d = talkDone; talkDone = null; d && d(); return; }
  const [id, ex, tx] = talkQ.shift();
  $('#tFace').src = FACES[id + '_' + ex]; $('#tName').textContent = CH(id).name; $('#tText').textContent = tx;
}
$('#talk').addEventListener('click', nextTalk);
function startStage(st, o = {}) {
  playStage = st; initAudio(); $('#skipBtn').style.display = 'none';
  if (st.kind === 'note') { const c = Object.assign({}, CH(st.char), {stage: st}); current = CH(st.char); return startGame(c); }
  const c = {id: st.char, name: stageName(st), mode: 'cue', cue: true, bpm: st.bpm, scale: st.scale, root: st.root, wave: st.wave, density: 1, bg: st.bg, lenient: 1.15, leadVol: .35, stage: st, phase: o.phase || (st.games.length === 1 && !st.remix ? 'practice' : 'main')};
  if (G && !G.over) G.over = true;
  startGame(c);
  if (c.phase === 'practice') { const b = $('#skipBtn'); b.style.display = 'block'; b.onclick = () => { G.over = true; startStage(st, {phase: 'main'}); }; }
}
function judgeLines() {
  const R = G.notes.filter(n => !n.practice), traps = R.filter(n => n.trap), bonk = traps.filter(n => n.bonk).length, half = R.length / 2;
  const m1 = R.slice(0, half).filter(n => n.res === 'MISS').length, m2 = R.slice(half).filter(n => n.res === 'MISS').length, L = [];
  if (G.cnt.MISS === 0) L.push('ノーミス！ リズム感バツグンだ'); 
  if (bonk) L.push(`引っかけに${bonk}回つられたね`); else if (traps.length) L.push('引っかけはカンペキ！');
  if (G.fast >= 3 && G.fast > G.slow * 2) L.push('ちょっと走りぎみ。もう少しガマン'); else if (G.slow >= 3 && G.slow > G.fast * 2) L.push('ちょっともたついてる。半歩はやく');
  if (m2 >= m1 + 2) L.push('後半ちょっとバテた？'); else if (m1 >= m2 + 2) L.push('後半は持ち直した！');
  if (R.find(n => n.fin && n.res && n.res !== 'MISS')) L.push('ラストもキメた！');
  return L.slice(0, 2);
}
function storyFinish() {
  const st = G.c.stage, sc = G.score, i = STAGES.indexOf(st);
  if (G.c.phase === 'practice') return startStage(st, {phase: 'practice'});
  const v = sc >= 850000 ? 'high' : sc >= 600000 ? 'pass' : null;
  const free = !!st.free, firstClear = !free && v && prog() === i;
  if (free) { if (v) { const old = store.get('hb_medal_' + st.id, null); if (old !== 'high') store.set('hb_medal_' + st.id, v); } }
  else if (v) { const old = store.get('hb_medal_' + st.id, null); if (old !== 'high') store.set('hb_medal_' + st.id, v); if (prog() <= i) store.set('hb_prog', i + 1); }
  const who = st.remix ? 'pug' : st.char;
  $('#rImg').src = v ? (who === 'pug' ? POSES.pug : SPRITES[who]) : (ACTS[MISSPOSE[who]] || POSES[who]);
  $('#rQuote').textContent = `${CH(who).name}「${v ? CH(who).say[0] : CH(who).say[1]}」`;
  $('#rRank').innerHTML = `<div class="verdict">${v === 'high' ? 'ハイレベル！' : v ? 'へいぼん' : 'もういっかい…'}</div>`;
  $('#rScore').textContent = '';
  $('#rFc').innerHTML = (G.cnt.MISS === 0 ? '<span class="fc">ノーミス！</span>' : `ミス ${G.cnt.MISS}回`) + `<div style="margin-top:8px;padding:8px 12px;background:#fff;border:3px solid #3b2f2a;border-radius:12px;font-size:14px;text-align:left"><b>審査員パグ太</b><br>${judgeLines().join('<br>') || 'まずまずのデキ！'}</div>`;
  $('#rStats').innerHTML = ['PERFECT', 'GREAT', 'GOOD', 'MISS'].map(k => `<div style="color:${JCOL[k]}">${k}<b>${G.cnt[k]}</b></div>`).join('');
  $('#rBest').textContent = v ? '' : '6割以上でクリア';
  $('#rJoin').innerHTML = firstClear && st.part ? `<div class="jt">🎉 ${CH(st.char).name}が${st.part}担当で加入！</div>` : v && st.id === 'fin' ? `<img src="${ACTS.lineup}" style="width:100%;max-width:420px;height:auto" alt=""><div class="jt">🎉 はちまきバンド、ライブ大成功！</div>` : '';
  $('#rBack').textContent = free ? 'えらびなおす' : 'ステージへ'; $('#rRetry').textContent = 'もういちど';
  const nx = STAGES[i + 1]; $('#rNext').style.display = !free && v && nx ? '' : 'none';
  $('#rNext').onclick = () => { renderStory(); show('story'); talk(nx.talk, () => startStage(nx)); };
  setTimeout(() => show('result'), 300);
}
const FIMG = {};
for (const k in FACES) { const im = new Image(); im.src = FACES[k]; FIMG[k] = im; }
for (const k in POSES) { const im = new Image(); im.src = POSES[k]; IM['pose_' + k] = im; }
for (const k in ACTS) { const im = new Image(); im.src = ACTS[k]; IM[k] = im; }
/* free-play cue games */
const FREECUE = SCN_KEYS.map(g => { const st = STAGES.find(s => !s.remix && s.games.includes(g)); return Object.assign({}, st, {id: 'free_' + g, games: [g], free: true, remix: false, name: SCENES[g].title, part: null, noJoin: true}); });
FREECUE.push({id: 'free_mix', games: SCN_KEYS, free: true, remix: true, char: 'pug', name: 'ぜんぶリミックス', bpm: 128, scale: 'major', root: 62, wave: 'square', bg: '#f7e2bd'});
