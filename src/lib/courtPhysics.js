const COLORS = {
  floor: '#1B35A6',
  line: 'rgba(253, 253, 255, 0.85)',
  lineSoft: 'rgba(253, 253, 255, 0.28)',
  pill: '#FDFDFF',
  pillAlt: '#FFC93C',
  pillText: '#11142A',
  ball: '#FFC93C',
  ballPanel: '#2343C9',
  ballEdge: '#11142A'
};

const FONT_FAMILY = "'Geist Variable', ui-sans-serif, system-ui, sans-serif";
const MAX_SPEED = 38;

/**
 * Builds a side-view volleyball court inside `canvas`. Skill labels fall in as
 * pill-shaped bodies; the ball can be dragged and flung, and tapping empty
 * court spikes the ball toward the tap.
 */
export function createCourt(Matter, canvas, { skills, reduceMotion = false }) {
  const { Engine, Bodies, Body, Composite, Constraint, Query, Sleeping, Events, Vector } = Matter;
  const ctx = canvas.getContext('2d');
  const engine = Engine.create({
    gravity: { x: 0, y: 1.15 },
    enableSleeping: true,
    positionIterations: 10,
    velocityIterations: 8
  });
  const world = engine.world;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let statics = [];
  let pills = [];
  let ball = null;
  let drag = null;
  let down = null;
  let rafId = 0;
  let visible = true;
  let destroyed = false;
  const timers = [];

  const geometry = () => {
    const floorTop = H - Math.max(26, H * 0.09);
    const netHeight = H * 0.44;
    return { floorTop, netHeight, netTop: floorTop - netHeight, netX: W / 2 };
  };

  // Layout size, not getBoundingClientRect: the panel animates in with scale and rotate.
  const measure = () => {
    W = Math.max(canvas.clientWidth, 200);
    H = Math.max(canvas.clientHeight, 200);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  };

  const buildStatics = () => {
    if (statics.length) Composite.remove(world, statics);
    const { floorTop, netHeight, netX } = geometry();
    const opts = { isStatic: true, restitution: 0.4, friction: 0.6, label: 'static' };
    statics = [
      Bodies.rectangle(W / 2, floorTop + 200, W * 3, 400, opts),
      Bodies.rectangle(-100, H / 2 - 300, 200, H + 1600, opts),
      Bodies.rectangle(W + 100, H / 2 - 300, 200, H + 1600, opts),
      Bodies.rectangle(W / 2, -900, W * 3, 200, opts),
      Bodies.rectangle(netX, floorTop - netHeight / 2, 14, netHeight, { ...opts, restitution: 0.2, label: 'net' })
    ];
    Composite.add(world, statics);
  };

  const fontSize = () => (W < 480 || H < 380 ? 13 : 15);

  const makePill = (text, i, x, y) => {
    const fs = fontSize();
    ctx.font = `600 ${fs * dpr}px ${FONT_FAMILY}`;
    const textW = ctx.measureText(text).width / dpr;
    const h = Math.round(fs * 2.4);
    const w = Math.round(textW + fs * 2);
    const body = Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: h / 2 - 1 },
      restitution: 0.3,
      friction: 0.35,
      frictionAir: 0.012,
      density: 0.0016,
      angle: (Math.random() - 0.5) * 0.9,
      label: 'pill'
    });
    body.plugin = { text, w, h, fs, alt: i % 4 === 1 };
    return body;
  };

  const randomX = (halfW) => {
    const { netX } = geometry();
    const side = Math.random() < 0.5 ? -1 : 1;
    const min = side < 0 ? halfW + 12 : netX + 20 + halfW;
    const max = side < 0 ? netX - 20 - halfW : W - halfW - 12;
    return max > min ? min + Math.random() * (max - min) : W / 2 + side * (W / 4);
  };

  const addPill = (text, i, y) => {
    const fs = fontSize();
    const approxHalf = (text.length * fs * 0.55 + fs * 2) / 2;
    const pill = makePill(text, i, randomX(approxHalf), y);
    pills.push(pill);
    Composite.add(world, pill);
    return pill;
  };

  const addBall = (x, y) => {
    const r = Math.min(Math.max(W * 0.042, 18), 30);
    ball = Bodies.circle(x, y, r, {
      restitution: 0.82,
      friction: 0.02,
      frictionAir: 0.004,
      density: 0.0024,
      label: 'ball'
    });
    ball.plugin = { r };
    Composite.add(world, ball);
    Body.setVelocity(ball, { x: 6, y: 2 });
    Body.setAngularVelocity(ball, 0.15);
  };

  const dynamicBodies = () => (ball ? [ball, ...pills] : pills);

  const wakeAll = () => dynamicBodies().forEach((b) => Sleeping.set(b, false));

  // Keep fast throws from tunnelling and bring escaped bodies back on court.
  Events.on(engine, 'beforeUpdate', () => {
    for (const b of dynamicBodies()) {
      const speed = Vector.magnitude(b.velocity);
      if (speed > MAX_SPEED) {
        Body.setVelocity(b, Vector.mult(b.velocity, MAX_SPEED / speed));
      }
      if (b.position.y > H + 150 || b.position.x < -150 || b.position.x > W + 150) {
        Body.setPosition(b, { x: W * (0.2 + Math.random() * 0.6), y: -60 });
        Body.setVelocity(b, { x: 0, y: 0 });
      }
    }
  });

  /* ---------------------------------------------------------------- drawing */
  const drawCourt = () => {
    const { floorTop, netTop, netX } = geometry();
    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(0, floorTop, W, H - floorTop);

    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, floorTop);
    ctx.lineTo(W, floorTop);
    ctx.stroke();

    // Attack lines, three meters out on each side
    ctx.strokeStyle = COLORS.lineSoft;
    ctx.lineWidth = 2;
    for (const x of [netX - W * 0.22, netX + W * 0.22]) {
      ctx.beginPath();
      ctx.moveTo(x, floorTop + 6);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Post
    ctx.fillStyle = COLORS.lineSoft;
    ctx.fillRect(netX - 2, netTop, 4, floorTop - netTop);

    // Net mesh on the upper portion of the post
    const meshH = (floorTop - netTop) * 0.48;
    ctx.save();
    ctx.strokeStyle = COLORS.lineSoft;
    ctx.lineWidth = 1;
    for (let y = netTop; y <= netTop + meshH; y += 7) {
      ctx.beginPath();
      ctx.moveTo(netX - 7, y);
      ctx.lineTo(netX + 7, y);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = COLORS.line;
    ctx.fillRect(netX - 8, netTop - 4, 16, 6);
  };

  const drawPill = (b) => {
    const { text, w, h, fs, alt } = b.plugin;
    ctx.save();
    ctx.translate(b.position.x, b.position.y);
    ctx.rotate(b.angle);
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
    ctx.fillStyle = alt ? COLORS.pillAlt : COLORS.pill;
    ctx.fill();
    ctx.fillStyle = COLORS.pillText;
    ctx.font = `600 ${fs}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 1);
    ctx.restore();
  };

  const drawBall = () => {
    if (!ball) return;
    const { r } = ball.plugin;
    ctx.save();
    ctx.translate(ball.position.x, ball.position.y);
    ctx.rotate(ball.angle);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.ball;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // Three swirled panels, like a match ball
    ctx.fillStyle = COLORS.ballPanel;
    for (let k = 0; k < 3; k++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(r * 0.45, -r * 0.1, r * 0.75, -r * 0.55, r * 0.55, -r * 1.2);
      ctx.lineTo(r * 1.2, -r * 1.2);
      ctx.lineTo(r * 1.2, -r * 0.2);
      ctx.bezierCurveTo(r * 0.9, -r * 0.05, r * 0.5, r * 0.15, 0, 0);
      ctx.fill();
    }
    ctx.strokeStyle = COLORS.ballEdge;
    ctx.lineWidth = 1.2;
    for (let k = 0; k < 3; k++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(r * 0.45, -r * 0.1, r * 0.75, -r * 0.55, r * 0.55, -r * 1.2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLORS.ballEdge;
    ctx.stroke();
    ctx.restore();
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawCourt();
    pills.forEach(drawPill);
    drawBall();
  };

  /* ------------------------------------------------------------------ loop */
  const tick = () => {
    rafId = requestAnimationFrame(tick);
    if (!visible) return;
    const settled = !drag && dynamicBodies().every((b) => b.isSleeping);
    if (settled) return;
    Engine.update(engine, 1000 / 60);
    draw();
  };

  /* ----------------------------------------------------------- interaction */
  const local = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H
    };
  };

  const onPointerDown = (e) => {
    const p = local(e);
    down = { ...p, t: performance.now() };
    const hit = Query.point(dynamicBodies(), p)[0];
    if (!hit) return;
    wakeAll();
    drag = Constraint.create({
      pointA: p,
      bodyB: hit,
      pointB: { x: p.x - hit.position.x, y: p.y - hit.position.y },
      stiffness: 0.16,
      damping: 0.08,
      length: 0
    });
    Composite.add(world, drag);
    canvas.setPointerCapture?.(e.pointerId);
    canvas.style.cursor = 'grabbing';
  };

  const onPointerMove = (e) => {
    const p = local(e);
    if (drag) {
      drag.pointA = p;
      return;
    }
    if (e.pointerType === 'mouse') {
      const over = Query.point(dynamicBodies(), p)[0];
      canvas.style.cursor = over ? 'grab' : 'pointer';
    }
  };

  const release = () => {
    if (drag) {
      Composite.remove(world, drag);
      drag = null;
      canvas.style.cursor = 'grab';
    }
  };

  const onPointerUp = (e) => {
    const p = local(e);
    const wasDrag = Boolean(drag);
    release();
    if (!down || wasDrag || !ball) return;
    const moved = Math.hypot(p.x - down.x, p.y - down.y);
    if (moved > 10) return;
    // Spike: launch the ball at the tapped point.
    const dir = Vector.normalise(Vector.sub(p, ball.position));
    const dist = Vector.magnitude(Vector.sub(p, ball.position));
    const speed = Math.min(14 + dist * 0.05, 30);
    wakeAll();
    const launch = Vector.mult(dir, speed);
    Body.setVelocity(ball, { x: launch.x, y: launch.y - 5 });
    Body.setAngularVelocity(ball, dir.x * 0.35);
    down = null;
  };

  /* ------------------------------------------------------------- lifecycle */
  const onResize = () => {
    const prevW = W;
    const prevH = H;
    measure();
    buildStatics();
    if (prevW && prevH) {
      const { floorTop } = geometry();
      for (const b of dynamicBodies()) {
        const hw = (b.bounds.max.x - b.bounds.min.x) / 2 + 2;
        const hh = (b.bounds.max.y - b.bounds.min.y) / 2 + 2;
        Body.setPosition(b, {
          x: Math.min(Math.max(b.position.x * (W / prevW), hw), Math.max(W - hw, hw)),
          y: Math.min(b.position.y * (H / prevH), floorTop - hh)
        });
      }
    }
    wakeAll();
    draw();
  };

  const onVisibility = () => {
    visible = !document.hidden && inView;
  };

  let inView = true;
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    onVisibility();
  });

  measure();
  buildStatics();
  // Small courts (phones, landscape) get fewer pills so the pile stays below the net.
  skills = skills.slice(0, Math.max(8, Math.round((W * H) / 11000)));

  if (reduceMotion) {
    skills.forEach((s, i) => addPill(s, i, geometry().floorTop - 40 - (i % 6) * 46));
    addBall(W * 0.25, 80);
    for (let i = 0; i < 700; i++) Engine.update(engine, 1000 / 60);
    draw();
  } else {
    draw();
    skills.forEach((s, i) => {
      timers.push(setTimeout(() => !destroyed && addPill(s, i, -60), 90 * i));
    });
    timers.push(setTimeout(() => !destroyed && addBall(W * 0.22, -80), 90 * skills.length + 350));
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', release);
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    rafId = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(() => onResize());
  ro.observe(canvas);

  return {
    destroy() {
      destroyed = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', release);
      Events.off(engine);
      Composite.clear(world, false);
      Engine.clear(engine);
    }
  };
}
