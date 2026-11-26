/**
 * neural-bg.js - Interactive Neural Network Particle & Synaptic Web
 * Smooth 60fps canvas animation reacting to mouse movements and clicks.
 */

class NeuralCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.pulses = [];
    this.mouse = { x: -1000, y: -1000, radius: 180, isDown: false };
    this.numNodes = 75;
    this.maxDistance = 150;
    this.animId = null;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseleave', this.onMouseLeave);

    this.createNodes();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // Scale nodes based on screen size
    if (this.width < 768) {
      this.numNodes = 40;
      this.maxDistance = 100;
    } else {
      this.numNodes = 85;
      this.maxDistance = 150;
    }
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.numNodes; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        glowColor: Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(99, 102, 241,',
        isTriggered: 0
      });
    }
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  onMouseDown(e) {
    this.mouse.isDown = true;
    this.pulses.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 280,
      alpha: 0.8
    });
    if (window.soundFX) {
      window.soundFX.playSynapse();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw ripple pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.radius += 7;
      p.alpha *= 0.94;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 240, 255, ${p.alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Trigger nearby nodes
      for (const node of this.nodes) {
        const dx = node.x - p.x;
        const dy = node.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - p.radius) < 15) {
          node.isTriggered = 1.0;
        }
      }
      this.ctx.restore();

      if (p.alpha <= 0.02 || p.radius >= p.maxRadius) {
        this.pulses.splice(i, 1);
      }
    }

    // Update and draw connections
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];

      // Move nodes
      a.x += a.vx;
      a.y += a.vy;

      // Bounce off screen boundaries
      if (a.x < 0 || a.x > this.width) a.vx *= -1;
      if (a.y < 0 || a.y > this.height) a.vy *= -1;

      // Mouse interaction (gentle repulsion/attraction)
      const dxm = this.mouse.x - a.x;
      const dym = this.mouse.y - a.y;
      const distM = Math.sqrt(dxm * dxm + dym * dym);
      if (distM < this.mouse.radius && distM > 0) {
        const force = (this.mouse.radius - distM) / this.mouse.radius;
        a.x -= (dxm / distM) * force * 1.5;
        a.y -= (dym / distM) * force * 1.5;
        a.isTriggered = Math.max(a.isTriggered, force);
      }

      // Connect nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const proximity = 1 - dist / this.maxDistance;
          const alpha = proximity * 0.22 + (a.isTriggered + b.isTriggered) * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${Math.min(alpha, 0.75)})`;
          this.ctx.lineWidth = proximity * 1.2;
          this.ctx.stroke();
        }
      }

      // Decay trigger
      if (a.isTriggered > 0) {
        a.isTriggered *= 0.94;
        if (a.isTriggered < 0.01) a.isTriggered = 0;
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(a.x, a.y, a.radius + a.isTriggered * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `${a.glowColor}${Math.min(a.baseAlpha + a.isTriggered * 0.6, 1)})`;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.shadowBlur = a.isTriggered > 0.1 ? 12 : 4;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.animId = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseleave', this.onMouseLeave);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.neuralCanvas = new NeuralCanvas('neural-canvas');
});
