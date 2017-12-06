class Timer {
  constructor(onTick) {
    this.tickHandler = onTick;
  }

  start() {
    const startTime = performance.now();
    const tick = (currentTime) => {
      const elapsed = (currentTime - startTime)/1000;
      this.tickHandler(elapsed);
      this.animationFrame = window.requestAnimationFrame(tick);
    };
    this.animationFrame = window.requestAnimationFrame(tick);
  }
  stop() {
    window.cancelAnimationFrame(this.animationFrame);
  }
}

const makeTimer = (onTick) => new Timer(onTick);

export default makeTimer;
