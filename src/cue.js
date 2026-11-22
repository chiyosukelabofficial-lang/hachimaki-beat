/* ---------- cue-type (合図型) games ---------- */
const lerp = (a, b, t) => a + (b - a) * t;
function cueSound(snd, w, e) {
  switch (snd) {
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
function sfxK(k, midi) {
  if (!actx) return; const w = actx.currentTime;
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
const CUELBL = {kakon: 'カコン', buzz: 'ブン', buzz2: 'ブッ', poko: 'ポコ', oink: 'ブー', suu: 'スッ', noo: 'の〜〜', ha: 'ハッ！', ta: 'タッ', pi: 'ピッ', hk1: 'ハッ', hk2: 'ケ', hk3: 'ヨイ', hey: 'ヘイ！'};
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
  capy: {char: 'capybara', title: 'おけキャッチ', guide: '「カコン」の2拍あとにタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'kakon']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'kakon'], [.5, 'kakon']], h: [[2], [2.5]]}, {lvl: 2, len: 4, c: [[0, 'kakon'], [1, 'kakon']], h: [[2], [3]]}, {lvl: 2, len: 4, c: [[0, 'kakon'], [.5, 'kakon'], [1, 'kakon']], h: [[2], [2.5], [3]]}],
    L() { const wy = H * .64, h = Math.min(H * .36, 300), cx = W * .58; return {wy, h, cx, hy: wy + h * .3 - h * .93}; },
    pos() { const l = this.L(); return [l.cx, l.hy - 40]; }, cuePos() { return [W * .18, H * .5]; }, hitSfx() { sfxK('suzu'); },
    bucket(x, y, a) { ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(x - 24, y - 24); ctx.lineTo(x + 24, y - 24); ctx.lineTo(x + 19, y); ctx.lineTo(x - 19, y); ctx.closePath(); ctx.fillStyle = '#d39a5c'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = INK; ctx.fillRect(x - 22, y - 17, 44, 3); ctx.fillRect(x - 20, y - 8, 40, 3); ctx.restore(); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#f6e3c4', '#f2d6b0');
      ctx.fillStyle = '#c9b9a0'; ctx.beginPath(); ctx.moveTo(0, l.wy); ctx.quadraticCurveTo(W * .3, l.wy - H * .2, W * .6, l.wy); ctx.fill();
      actor('capybara', l.cx, l.wy + l.h * .3, l.h, now, {lift: 28});
      for (const n of G.byG.capy || []) {
        if (now < n.cueT - .02) continue;
        if (!n.res) { const q = clamp((now - n.cueT) / (n.t - n.cueT), 0, 1.1); this.bucket(lerp(-30, l.cx - 10, q), l.wy - 2 + Math.sin(now * 7 + n.t) * 3, 1); }
        else if (n.res === 'MISS') { const d = now - n.hitT; if (d < 1.4) this.bucket(l.cx + d * 170, l.wy - 2, 1 - d / 1.4); }
        else { const d = now - n.hitT; if (d < .9) this.bucket(l.cx, l.hy + 4 - (n.k || 0) * 20 - 28 * Math.max(0, spring(tapAge(now))) - 30 * Math.max(0, spring(d) * (d < .1 ? 1 : .4)), 1 - Math.max(0, d - .6) / .3); }
      }
      ctx.fillStyle = 'rgba(150,205,210,.88)'; ctx.fillRect(0, l.wy, W, H - l.wy); ctx.fillStyle = INK; ctx.fillRect(0, l.wy - 1.5, W, 3);
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) { const x = W * (.15 + i * .25) + Math.sin(now + i) * 20, y = l.wy - 50 - ((now * 30 + i * 40) % 120); ctx.globalAlpha = .5; ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.bezierCurveTo(x - 12, y + 15, x + 12, y + 10, x, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }},
  frog: {char: 'frog', title: 'ハエとり', guide: '「ブン、ブン」の次の拍でタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'buzz'], [1, 'buzz']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'buzz2'], [.5, 'buzz2']], h: [[1]]}, {lvl: 2, len: 4, c: [[0, 'buzz'], [1, 'buzz'], [2.5, 'buzz2'], [3, 'buzz2']], h: [[2, 0, 0], [3.5, 0, 2]]}, {lvl: 2, len: 4, c: [[0, 'buzz2'], [.5, 'buzz2'], [2, 'buzz2'], [2.5, 'buzz2']], h: [[1, 0, 0], [3, 0, 2]]}],
    L() { const h = Math.min(H * .26, 220), fx = W * .3, fy = H * .72; return {h, fx, fy, mx: fx + h * .08, my: fy - h * .55}; },
    A: [{k: 'pose_frog_act', w: 260 / 300, tip: [.97, .41], bx: .34}, {k: 'frog_act2', w: 1.393, tip: [.889, .127], bx: .31}],
    tip(l, n) { const a = this.A[Math.round(n.t * 8) % 2]; return [l.fx + (a.tip[0] - a.bx) * a.w * l.h, l.fy + 8 - l.h + a.tip[1] * l.h]; },
    pos() { const l = this.L(); return [l.mx + 30, l.my - 60]; }, cuePos() { return [W * .8, H * .3]; }, hitSfx() { sfxK('gulp'); },
    fly(x, y) { ellipse(x - 5, y - 8, 9, 5, 'rgba(255,255,255,.8)', INK, 1.5); ellipse(x + 5, y - 8, 9, 5, 'rgba(255,255,255,.8)', INK, 1.5); circle(x, y, 7, '#333', INK, 2); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#d7eef2', '#bfe0c9');
      ctx.fillStyle = '#8fc2b8'; ctx.fillRect(0, H * .62, W, H); ctx.fillStyle = INK; ctx.fillRect(0, H * .62 - 1.5, W, 3);
      for (let i = 0; i < 6; i++) { ctx.strokeStyle = '#6d8f4e'; ctx.lineWidth = 4; const x = W * .62 + i * W * .07; ctx.beginPath(); ctx.moveTo(x, H * .64); ctx.quadraticCurveTo(x + 10, H * .5, x + Math.sin(now * 2 + i) * 6, H * .4 - i % 2 * 20); ctx.stroke(); }
      ellipse(l.fx, l.fy + 6, l.h * .55, l.h * .12, '#7cb35a', INK);
      const act = (G.byG.frog || []).find(n => n.res && n.res !== 'MISS' && now - n.hitT < .26);
      if (act) { const d = now - act.hitT, s = Math.max(0, spring(d)), a = this.A[Math.round(act.t * 8) % 2], tp = this.tip(l, act); spr(a.k, l.fx + (.5 - a.bx) * a.w * l.h, l.fy + 8, l.h, {sx: 1 + .06 * s, sy: 1 - .05 * s}); this.fly(tp[0], tp[1] - 4); }
      else actor('frog', l.fx, l.fy + 8, l.h, now, {lift: l.h * .14, tilt: -.12, dx: 10});
      for (const n of G.byG.frog || []) {
        if (now < n.cueT - .02) continue;
        const tp = this.tip(l, n), path = q => [lerp(W + 30, tp[0], q), lerp(H * .22, tp[1], q) + Math.sin(q * 14) * 22 * (1 - q)];
        if (!n.res) { const q = clamp((now - n.cueT) / (n.t - n.cueT), 0, 1.15); const [x, y] = path(q); this.fly(x, y); }
        else if (n.res === 'MISS') { const d = now - n.hitT; if (d < 1) this.fly(l.mx - d * 300, l.my - d * 80 + Math.sin(d * 30) * 8); }
        else if (now - n.hitT < .32) { const d = now - n.hitT; if (d > .26) { const k = (d - .26) / .06; this.fly(lerp(tp[0], l.mx, k), lerp(tp[1], l.my, k)); } }
      }
      if (ta >= 0 && ta < .18 && !missing() && !(G.byG.frog || []).some(n => n.res && n.res !== 'MISS' && now - n.hitT < .26)) { const k = Math.sin(Math.PI * ta / .18), my = l.my - l.h * .14 * Math.max(0, spring(ta)); ctx.strokeStyle = '#e57a8a'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(l.mx, my); ctx.lineTo(l.mx + 90 * k, my - 70 * k); ctx.stroke(); ctx.lineCap = 'butt'; }
    }},
  mole: {char: 'mole', title: 'ポコポコたたき', guide: '「ポコ、ポコ」のリズムの続きでタップ',
    pats: [{lvl: 0, len: 4, c: [[0, 'poko'], [1, 'poko']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'poko'], [.5, 'poko']], h: [[1]]}, {lvl: 1, len: 4, c: [[0, 'poko'], [1, 'poko'], [2, 'poko']], h: [[3]]}, {lvl: 2, len: 4, c: [[0, 'poko'], [.5, 'poko'], [2, 'poko'], [2.5, 'poko']], h: [[1, 0, 0], [3, 0, 2]]}],
    L() { return {y: H * .64, xs: [W * .2, W * .5, W * .8], rx: Math.min(W * .13, 70), mh: Math.min(H * .2, 160)}; },
    pos(n) { const l = this.L(); return [l.xs[n.hole], l.y - l.mh - 10]; }, cuePos() { return [W / 2, H * .3]; }, hitSfx() { sfxK('bonk'); },
    draw(now) {
      const l = this.L(), ta = tapAge(now);
      bgSky('#e9f2d9', '#cfe3a8');
      ctx.fillStyle = '#b48a5a'; ctx.fillRect(0, H * .58, W, H); ctx.fillStyle = INK; ctx.fillRect(0, H * .58 - 1.5, W, 3);
      for (let i = 0; i < 3; i++) ellipse(l.xs[i], l.y, l.rx, l.rx * .32, '#4a3a30', INK);
      for (const q of G.cuesByG.mole || []) { const d = now - q.t; if (d < 0 || d > .3) continue; for (let k = 0; k < 5; k++) circle(l.xs[q.hole] + Math.cos(k * 1.3) * d * 140, l.y - 10 - Math.sin(k * .7 + .3) * d * 160, 6, '#8a6a4a', INK, 2); }
      let active = 1;
      for (const n of G.byG.mole || []) {
        if (n.t - now > 1.5) break; if (now > n.cueT - .1) active = n.hole;
        let q;
        if (!n.res) q = clamp(1 - (n.t - now) / .3, 0, 1);
        else { const d = now - n.hitT; if (d > .4) continue; q = 1; }
        const hitOk = n.res && n.res !== 'MISS';
        ctx.save(); ctx.beginPath(); ctx.rect(l.xs[n.hole] - l.rx * 1.3, 0, l.rx * 2.6, l.y); ctx.clip();
        const sq = hitOk ? 1 : 0, wob = !n.res ? spring(now - n.t + .3) * .05 : 0;
        if (n.res) { ctx.restore(); const d = now - n.hitT; spr(sq ? 'mole_dig' : 'mole_sun', l.xs[n.hole], l.y + l.mh * .2, l.mh * (sq ? .75 : .9), {sx: 1 + .1 * Math.max(0, spring(d)), sy: 1 - .1 * Math.max(0, spring(d))}); continue; }
        spr('mole', l.xs[n.hole], l.y + l.mh * (1 - q) + l.mh * .1, l.mh, {sy: 1 - wob, sx: 1 + wob});
        ctx.restore();
        if (hitOk) text('★', l.xs[n.hole] + 30, l.y - l.mh, 30, '#f2c12e', {stroke: 4});
      }
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(l.xs[i], l.y, l.rx * 1.06, l.rx * .38, 0, 0, Math.PI); ctx.fillStyle = '#8a6a4a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); }
      const ang = ta < 0 || ta > .4 ? -.6 : ta < .04 ? -.6 - ta / .04 * .35 : ta < .09 ? lerp(-.95, .75, (ta - .04) / .05) : lerp(.75, -.6, Math.min(1, (ta - .09) / .3)), hx = l.xs[active] + 60, hy = l.y - l.mh - 40;
      if (ta > .08 && ta < .3) { const k = (ta - .08) / .22; ctx.globalAlpha = 1 - k; ellipse(l.xs[active], l.y - 4, l.rx * (1 + k), l.rx * .3 * (1 + k), null, '#fff', 4); ctx.globalAlpha = 1; }
      ctx.save(); ctx.translate(hx + 30, hy + 60); ctx.rotate(ang); ctx.fillStyle = '#c98b4f'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.fillRect(-4, -70, 8, 70); ctx.strokeRect(-4, -70, 8, 70); rr(-30, -92, 60, 30, 8); ctx.fillStyle = '#e8554e'; ctx.fill(); ctx.stroke(); ctx.restore();
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
      spr('pig', l.px, l.y + 6, l.h, {sx: p.sx * (1 + .1 * ps), sy: p.sy * (1 - .14 * ps)});
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
      if (lastRes && !good && d < .7) spr('pose_puffer', l.cx, l.cy + l.h * .2, l.h * 1.15, {rot: Math.sin(d * 25) * .06});
      else spr('puffer', l.cx - (good ? 40 * Math.max(0, spring(d)) : 0), l.cy + l.h * .15 * s, l.h * s, {sx: p.sx * (1 + .06 * Math.max(0, spring(tapAge(now)))), sy: p.sy});
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
      spr('sloth', l.ax, l.y + 6, l.h, {sx: p.sx, sy: 1 + .35 * a});
      if (missing()) spr('pose_sloth', l.bx, l.y + 6, l.h * .85, {flip: true}); else spr('sloth', l.bx, l.y + 6, l.h, {flip: true, sx: p.sx * (1 - .1 * b) * (1 + .08 * spring(reactAge())), sy: (1 + .35 * b) * (1 - .1 * spring(reactAge())), rot: p.rot + Math.sin(now * 20) * .02 * b});
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
      if (missing()) spr('pose_bulldog', l.bx, l.y + 6, l.h * .85, {rot: Math.sin(reactAge() * 20) * .05});
      else spr('bulldog', l.bx + push * W * .1, l.y + 6, l.h, {sx: p.sx * (1 + .08 * push), sy: p.sy * (1 - .08 * push), rot: push * .3 + p.rot});
      if (push > .3 && (G.byG.bulldog || []).some(n => n.res && n.res !== 'MISS' && now - n.hitT < .2)) text('バチン！', l.px - 20, l.y - l.h * 1.1, 26, '#fff', {stroke: 6, sc: '#e8554e'});
    }},

  hurdle: {char: 'pug', title: 'ハードル走', guide: '「タッ、タッ」の次の拍でジャンプ',
    pats: [{lvl: 0, len: 4, c: [[0, 'ta'], [1, 'ta']], h: [[2]]}, {lvl: 1, len: 4, c: [[0, 'ta'], [.5, 'ta']], h: [[1]]}, {lvl: 2, len: 4, c: [[0, 'ta'], [1, 'ta'], [2.5, 'ta'], [3, 'ta']], h: [[2, 0, 0], [3.5, 0, 2]]}],
    L() { return {gy: H * .72, px: W * .3, h: Math.min(H * .19, 160)}; },
    pos() { const l = this.L(); return [l.px, l.gy - l.h * 1.6]; }, cuePos() { return [W * .72, H * .34]; }, hitSfx() { sfxK('hop'); },
    hd(x, y, rot, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.fillStyle = '#c98b4f'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.fillRect(-28, -40, 8, 40); ctx.strokeRect(-28, -40, 8, 40); ctx.fillRect(20, -40, 8, 40); ctx.strokeRect(20, -40, 8, 40); rr(-36, -50, 72, 13, 6); ctx.fill(); ctx.stroke(); ctx.restore(); },
    draw(now) {
      const l = this.L(), p = charPose(now), ta = tapAge(now);
      bgSky('#dff0f7', '#f4ecda');
      ctx.fillStyle = '#9fcd8f'; ctx.fillRect(0, l.gy - 60, W, 60);
      ctx.fillStyle = '#d9a06a'; ctx.fillRect(0, l.gy, W, H); ctx.fillStyle = INK; ctx.fillRect(0, l.gy - 1.5, W, 3);
      ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) { const x = ((i * 90 - now * 300) % (W + 90) + W + 90) % (W + 90) - 45; ctx.beginPath(); ctx.moveTo(x, l.gy + 40); ctx.lineTo(x + 44, l.gy + 40); ctx.stroke(); }
      let jump = null, trip = null;
      for (const n of G.byG.hurdle || []) {
        if (now < n.cueT - .05) continue;
        const span = Math.max(.3, n.t - n.cueT); let x = l.px + (n.t - now) / span * W * .6, rot = 0, a = 1;
        if (n.res === 'MISS') { const d = now - n.hitT; if (d > .8) continue; x = l.px + 30; rot = Math.min(1.4, d * 7); a = 1 - d / .8; if (d < .65) { trip = d; jump = null; } }
        else if (n.res) { const d = now - n.hitT; if (d < .45 && d >= 0) { jump = d; trip = null; } if (x < -60) continue; }
        if (x > W + 60) continue;
        this.hd(x, l.gy, rot, a);
      }
      if (trip != null) spr('pug_trip', l.px, l.gy + 8, l.h * .85, {rot: Math.sin(trip * 30) * .05});
      else if (jump != null) { const y = Math.sin(Math.PI * clamp(jump / .45, 0, 1)) * l.h * 1.0; spr('pug_jump', l.px, l.gy + 4 - y, l.h, {rot: -.12 + jump * .3}); }
      else { const hop = ta >= 0 && ta < .3 ? Math.sin(Math.PI * ta / .3) * l.h * .3 : 0, ph = ((now / G.song.spb) % 1 + 1) % 1; spr('pug_dash', l.px, l.gy + 4 - hop - Math.abs(Math.sin(ph * Math.PI * 2)) * 8, l.h, {sx: p.sx, sy: p.sy}); }
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
      if (fail != null) spr('peng_split', l.px, l.gy + 6, l.h * .8, {rot: Math.sin(fail * 30) * .04});
      else if (slide != null) {
        const k = Math.sin(Math.PI * clamp(slide / .6, 0, 1)), x = l.px + k * W * .4;
        spr('peng_slide', x, l.gy + 10, l.h * .7);
        for (let i = 0; i < 6; i++) circle(x - l.h * .5 - i * 14, l.gy - 6 - Math.sin(i + slide * 20) * 10, 4, 'rgba(140,195,223,.8)', INK, 1.5);
      } else {
        const ph = ((now / G.song.spb) % 1 + 1) % 1, s = Math.max(0, spring(ta));
        spr('peng_walk', l.px + s * 20, l.gy + 6, l.h, {rot: Math.sin(ph * Math.PI * 2) * .07, sx: p.sx * (1 + .08 * s), sy: p.sy * (1 - .1 * s)});
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
      if (missing()) spr('pose_bulldog', l.bx, l.gy + 6, l.h * 1.1, {rot: Math.sin(reactAge() * 20) * .05});
      else if (push > .15) spr('bull_charge', l.bx + push * (l.tx - l.bx - l.h * .9), l.gy + 6, l.h);
      else { const ph = ((now / G.song.spb) % 1 + 1) % 1; spr('bull_crouch', l.bx, l.gy + 6, l.h * .85, {sy: 1 - .03 * Math.exp(-ph * 5)}); }
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
      const ds = spring(now - lc);
      spr('dog_dance', l.dx, l.y + 6, l.h, {flip: cn % 2 === 1, sx: 1 + .1 * ds, sy: 1 - .12 * ds});
      const us = spring(ta);
      if (missing()) spr('pug_trip', l.ux, l.y + 6, l.h * .7, {rot: Math.sin(reactAge() * 25) * .05});
      else spr('pug_dance', l.ux, l.y + 6 - 12 * Math.max(0, us), l.h, {flip: (G.tapN || 0) % 2 === 0, sx: 1 + .1 * us, sy: 1 - .12 * us});
      if (ta >= 0 && ta < .3) text('ヘイ！', l.ux, l.y - l.h - 6 - ta * 40, 24 * (1 + .4 * Math.max(0, spring(ta))), '#fff', {stroke: 5, sc: '#4fb3a9', a: 1 - ta / .3});
    }},
};
const SCN_KEYS = Object.keys(SCENES);

function buildCue(st, spb) {
  const rng = RNG(hash(st.id) + 5), segs = [], cues = [], notes = []; let b = 8;
  const put = (g, lvl, practice) => {
    const P = SCENES[g].pats, ok = P.filter(p => p.lvl <= lvl), top = ok.filter(p => p.lvl === Math.max(...ok.map(x => x.lvl)));
    const p = practice ? P[0] : (rng() < .6 ? pick(rng, top) : pick(rng, ok));
    const hole = Math.floor(rng() * 3), grp = cues.length;
    const pc = p.c.map(([x, snd, d]) => ({t: (b + x) * spb, g, snd, dur: (d || 0) * spb, hole, grp, midi: g === 'pig' ? pick(rng, [64, 67, 69, 72, 74]) : 0}));
    p.h.forEach(([x, d, ci], k) => { if (ci == null) ci = p.c.length === p.h.length ? k : 0; notes.push({t: (b + x) * spb, dur: (d || 0) * spb, g, practice, hole, k, cueT: pc[ci].t, midi: pc[ci].midi}); });
    cues.push(...pc); b += p.len;
  };
  if (!st.remix) {
    const gs = st.games, one = gs.length === 1;
    gs.forEach((g, i) => { segs.push({b0: i ? b : 0, g, label: 'れんしゅう'}); put(g, 0, true); if (one) put(g, 0, true); });
    let last = null;
    const N = SCENES[gs[0]].pats[0].len === 8 ? 9 : 14;
    for (let i = 0; i < N; i++) {
      const g = gs[Math.floor(i / 2) % gs.length], r = i / N;
      if (i === 0) { segs.push({b0: b, g, label: 'ほんばん！'}); b += 4; } else if (g !== last) segs.push({b0: b, g, label: ''});
      last = g; put(g, r < .3 ? 0 : r < .65 ? 1 : 2, false); if (i === Math.floor(N / 2)) b += 4;
    }
  } else {
    const rounds = st.games.length > 5 ? 1 : 2, tot = rounds * st.games.length; let k = 0;
    for (let r = 0; r < rounds; r++) for (const g of st.games) { const lv = k++ / tot < .5 ? 1 : 2; segs.push({b0: segs.length ? b : 0, g, label: SCENES[g].title}); put(g, lv, false); put(g, lv, false); }
  }
  b += 4;
  notes.sort((x, y) => x.t - y.t);
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
    const n = findNote(() => true, t), g = n ? n.g : this.seg(now).g, TAP = {capy: 'don', frog: 'lick', mole: 'woosh', puffer: 'psh', bulldog: 'woosh', hurdle: 'woosh', penguin: 'woosh', sumo: 'woosh', dance: 'heyp'}; G.tapN = (G.tapN || 0) + 1;
    if (TAP[g]) sfxK(TAP[g]);
    if (n) { const p = this.pos(n); hit(n, t, p[0], p[1]); SCENES[n.g].hitSfx(n); if (n.dur) { n.holding = id; voiceStart(); } }
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
  draw(now) {
    const s = this.seg(now), sc = SCENES[s.g];
    sc.draw(now);
    const top = SAT + 54;
    for (const q of G.cuesByG[s.g] || []) { const d = now - q.t; if (d < 0 || d > .45) continue; const [x, y] = sc.cuePos(q); text(CUELBL[q.snd], x, y - d * 30, 30, '#fff', {stroke: 6, a: 1 - d / .45}); }
    const lb = s.label, la = now / G.song.spb - s.b0;
    if (lb === 'れんしゅう' || lb === 'ほんばん！') text(lb, W / 2, top + 6, 22, lb === 'ほんばん！' ? '#e8554e' : INK, {stroke: 5, sc: '#fff', a: lb === 'ほんばん！' ? clamp(2 - la / 2, 0, 1) : 1});
    else if (lb && la < 4) { text(lb, W / 2, H * .42, 36, '#fff', {stroke: 7, a: clamp(1 - (la - 2) / 2, 0, 1)}); }
    if (lb === 'れんしゅう') {
      text(sc.guide, W / 2, top + 36, 15, INK, {stroke: 4, sc: '#fff', w: 700});
      for (const n of G.notes) if (n.practice && now > n.t - .12 && now < n.t + .25) text('いま！', W / 2, H * .45, 52, '#e8554e', {stroke: 7, sc: '#fff'});
    }
    const ra = (performance.now() - G.react.t) / 1000;
    const ex = ra < .7 && G.react.res ? (G.react.res === 'MISS' ? 'cry' : 'smile') : (lb === 'ほんばん！' && la < 2 ? 'surprise' : 'angry');
    drawFace(sc.char, ex, 46, H - 46 - SAT * 0, 34);
    drawFx();
  }
};

/* ---------- story ---------- */
const STAGES = [
  {id: 's0', kind: 'cue', games: ['hurdle'], char: 'pug', name: 'パグ太の朝練', noJoin: true, bpm: 120, scale: 'major', root: 62, wave: 'square', bg: '#f7e2bd',
    talk: [['pug', 'angry', 'バンドを組む前に、まずは朝練だ！'], ['pug', 'smile', '「タッ、タッ」の次の拍で、ハードルをジャンプ！']]},
  {id: 's1', kind: 'cue', games: ['capy'], char: 'capybara', part: '鈴', bpm: 112, scale: 'major', root: 60, wave: 'triangle', bg: '#d9e8d0',
    talk: [['pug', 'smile', 'よし！ 今日から「はちまきバンド」結成だ！'], ['pug', 'angry', 'まずはメンバー集め。温泉でのんびりしてるあいつに声をかけよう。'], ['capybara', 'surprise', '…え、ぼく？'], ['pug', 'smile', '「カコン」の2拍あとに、流れてきた桶を頭でキャッチできたら合格な！']]},
  {id: 's2', kind: 'cue', games: ['frog'], char: 'frog', part: 'カスタネット', bpm: 124, scale: 'major', root: 64, wave: 'square', bg: '#dff0c8',
    talk: [['frog', 'angry', 'ケロ。バンドだと？ ならオレの舌さばきを見てもらおう。'], ['frog', 'smile', 'ハエの「ブン、ブン」を聞いて、次の拍でパクッといけ！']]},
  {id: 's3', kind: 'cue', games: ['mole'], char: 'mole', part: 'ウッドブロック', bpm: 120, scale: 'major', root: 59, wave: 'square', bg: '#e9dcc0',
    talk: [['mole', 'surprise', 'モグッ!? 音楽隊？'], ['pug', 'smile', '「ポコ、ポコ」のリズムの続きで、顔を出したところを叩くんだ！'], ['mole', 'cry', 'ぼくが叩かれるの…!?']]},
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
function startStage(st) {
  playStage = st; initAudio();
  if (st.kind === 'note') { const c = Object.assign({}, CH(st.char), {stage: st}); current = CH(st.char); return startGame(c); }
  const c = {id: st.char, name: stageName(st), mode: 'cue', cue: true, bpm: st.bpm, scale: st.scale, root: st.root, wave: st.wave, density: 1, bg: st.bg, lenient: 1.15, leadVol: .35, stage: st};
  startGame(c);
}
function storyFinish() {
  const st = G.c.stage, sc = G.score, i = STAGES.indexOf(st);
  const v = sc >= 850000 ? 'high' : sc >= 600000 ? 'pass' : null;
  const free = !!st.free, firstClear = !free && v && prog() === i;
  if (free) { if (v) { const old = store.get('hb_medal_' + st.id, null); if (old !== 'high') store.set('hb_medal_' + st.id, v); } }
  else if (v) { const old = store.get('hb_medal_' + st.id, null); if (old !== 'high') store.set('hb_medal_' + st.id, v); if (prog() <= i) store.set('hb_prog', i + 1); }
  const who = st.remix ? 'pug' : st.char;
  $('#rImg').src = v ? (who === 'pug' ? POSES.pug : SPRITES[who]) : (ACTS[MISSPOSE[who]] || POSES[who]);
  $('#rQuote').textContent = `${CH(who).name}「${v ? CH(who).say[0] : CH(who).say[1]}」`;
  $('#rRank').innerHTML = `<div class="verdict">${v === 'high' ? 'ハイレベル！' : v ? 'へいぼん' : 'もういっかい…'}</div>`;
  $('#rScore').textContent = '';
  $('#rFc').innerHTML = G.cnt.MISS === 0 ? '<span class="fc">ノーミス！</span>' : `ミス ${G.cnt.MISS}回`;
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
