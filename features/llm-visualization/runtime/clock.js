export function createBrowserClock() {
  return {
    now: () => (typeof performance !== "undefined" ? performance.now() : Date.now()),
    requestFrame: (cb) => requestAnimationFrame(cb),
    cancelFrame: (id) => cancelAnimationFrame(id),
  };
}

export function createFakeClock() {
  let t = 0;
  let nextId = 1;
  const frames = new Map();
  return {
    now: () => t,
    requestFrame(cb) {
      const id = nextId++;
      frames.set(id, cb);
      return id;
    },
    cancelFrame(id) {
      frames.delete(id);
    },
    advance(ms) {
      t += ms;
      const pending = [...frames.entries()];
      frames.clear();
      for (const [, cb] of pending) cb(t);
    },
    set(ms) {
      t = ms;
    },
  };
}
