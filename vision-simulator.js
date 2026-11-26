/**
 * vision-simulator.js - Real-Time Edge Computer Vision & Defect Detection Inspector
 * Simulates high-speed industrial, clinical, and edge model inference with dynamic bounding boxes.
 */

const VISION_FEEDS = {
  factory: {
    name: 'Industrial PCB Solder QA',
    sub: 'YOLOv10-Nano (TensorRT FP16 @ 185 FPS)',
    bgStyle: 'pcb',
    detections: [
      { id: 1, label: 'Missing Capacitor C12', conf: 0.94, box: [40, 50, 95, 80], color: '#ef4444', status: 'CRITICAL DEFECT' },
      { id: 2, label: 'Solder Bridge J3', conf: 0.88, box: [160, 110, 80, 60], color: '#f59e0b', status: 'WARNING' },
      { id: 3, label: 'IC Microcontroller U1', conf: 0.99, box: [260, 40, 130, 120], color: '#10b981', status: 'NOMINAL' },
      { id: 4, label: 'Cold Solder Joint R4', conf: 0.72, box: [80, 160, 65, 55], color: '#f59e0b', status: 'WARNING' }
    ]
  },
  medical: {
    name: 'Clinical MRI Axial Brain Scan',
    sub: 'Swin-UNETR Multimodal Segmentation',
    bgStyle: 'mri',
    detections: [
      { id: 1, label: 'Hyperintensity Lesion FL-2', conf: 0.96, box: [130, 70, 75, 85], color: '#ec4899', status: 'ANOMALY DETECTED' },
      { id: 2, label: 'Lateral Ventricle Symmetric', conf: 0.98, box: [190, 110, 110, 90], color: '#38bdf8', status: 'NORMAL ANATOMY' },
      { id: 3, label: 'Cortical Gray Matter', conf: 0.82, box: [60, 40, 280, 180], color: '#10b981', status: 'NORMAL' }
    ]
  },
  retail: {
    name: 'Autonomous Retail Smart Checkout',
    sub: 'EfficientDet-D3 Multimodal Vision-Language',
    bgStyle: 'retail',
    detections: [
      { id: 1, label: 'Organic Almond Milk 1L', conf: 0.97, box: [50, 40, 85, 170], color: '#00f0ff', status: 'BARCODE MATCHED' },
      { id: 2, label: 'Artisan Sourdough Loaf', conf: 0.91, box: [160, 70, 120, 90], color: '#00f0ff', status: 'WEIGHT VERIFIED' },
      { id: 3, label: 'Dark Roast Coffee Beans', conf: 0.85, box: [285, 55, 90, 140], color: '#00f0ff', status: 'BARCODE MATCHED' }
    ]
  },
  fleet: {
    name: 'Autonomous Highway Telematics',
    sub: 'BEV-Transformer Multi-Camera 3D Detection',
    bgStyle: 'road',
    detections: [
      { id: 1, label: 'Semi-Truck Trailer (Dist: 28m)', conf: 0.96, box: [170, 60, 110, 120], color: '#3b82f6', status: 'SPEED: 92 km/h' },
      { id: 2, label: 'Sedan Lane-Cut (Dist: 14m)', conf: 0.89, box: [60, 110, 85, 75], color: '#f59e0b', status: 'WARNING: BRAKING' },
      { id: 3, label: 'Road Debris (Dist: 45m)', conf: 0.65, box: [290, 175, 45, 30], color: '#ef4444', status: 'AVOIDANCE PATH' }
    ]
  }
};

class VisionSimulator {
  constructor() {
    this.canvas = document.getElementById('vision-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.currentFeedKey = 'factory';
    this.confThreshold = 0.70;
    this.nmsIoU = 0.50;
    this.scanY = 0;
    this.scanDirection = 1;
    this.fps = 182;
    this.latency = 5.4;
    this.frameCounter = 0;

    this.init();
  }

  init() {
    this.bindControls();
    this.renderLoop();
  }

  bindControls() {
    const feedSelect = document.getElementById('vision-feed-select');
    if (feedSelect) {
      feedSelect.addEventListener('change', (e) => {
        this.currentFeedKey = e.target.value;
        const feed = VISION_FEEDS[this.currentFeedKey];
        const subEl = document.getElementById('vision-model-sub');
        if (subEl && feed) subEl.textContent = feed.sub;
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    const confSlider = document.getElementById('vision-conf-slider');
    if (confSlider) {
      confSlider.addEventListener('input', (e) => {
        this.confThreshold = parseFloat(e.target.value);
        const valEl = document.getElementById('vision-conf-val');
        if (valEl) valEl.textContent = `${Math.round(this.confThreshold * 100)}%`;
      });
    }

    const iouSlider = document.getElementById('vision-iou-slider');
    if (iouSlider) {
      iouSlider.addEventListener('input', (e) => {
        this.nmsIoU = parseFloat(e.target.value);
        const valEl = document.getElementById('vision-iou-val');
        if (valEl) valEl.textContent = this.nmsIoU.toFixed(2);
      });
    }
  }

  renderLoop() {
    this.render();
    requestAnimationFrame(() => this.renderLoop());
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;
    const feed = VISION_FEEDS[this.currentFeedKey];

    this.frameCounter++;
    // Jitter latency slightly for realism
    if (this.frameCounter % 20 === 0) {
      this.latency = (5.2 + (Math.random() - 0.5) * 0.8).toFixed(1);
      this.fps = Math.round(180 + (Math.random() - 0.5) * 10);
      const fpsEl = document.getElementById('vision-telemetry-fps');
      const latEl = document.getElementById('vision-telemetry-lat');
      if (fpsEl) fpsEl.textContent = `${this.fps} FPS`;
      if (latEl) latEl.textContent = `${this.latency} ms`;
    }

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw Simulated Background
    this.drawFeedBackground(ctx, w, h, feed.bgStyle);

    // Filter detections by confidence threshold
    const activeDetections = feed.detections.filter(d => d.conf >= this.confThreshold);

    // Draw Bounding Boxes and Labels
    activeDetections.forEach(d => {
      const [bx, by, bw, bh] = d.box;

      // Box border
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Corner markers
      const cLen = 10;
      ctx.lineWidth = 3;
      ctx.strokeStyle = d.color;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(bx, by + cLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cLen, by);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(bx + bw - cLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cLen);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - cLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cLen, by + bh);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(bx + bw - cLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cLen);
      ctx.stroke();

      // Label badge
      const confPct = Math.round(d.conf * 100);
      const text = `${d.label} [${confPct}%]`;
      ctx.font = '10px "Fira Code", monospace';
      const textWidth = ctx.measureText(text).width;

      ctx.fillStyle = `${d.color}dd`;
      ctx.fillRect(bx, Math.max(0, by - 18), textWidth + 12, 18);
      ctx.fillStyle = '#0f172a';
      ctx.fillText(text, bx + 6, Math.max(12, by - 5));

      // Status sub-badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(bx, by + bh + 2, ctx.measureText(d.status).width + 8, 14);
      ctx.fillStyle = d.color;
      ctx.font = '9px "Fira Code", monospace';
      ctx.fillText(d.status, bx + 4, by + bh + 12);
    });

    // Scanner beam line
    this.scanY += 2 * this.scanDirection;
    if (this.scanY > h) this.scanDirection = -1;
    if (this.scanY < 0) this.scanDirection = 1;

    const grad = ctx.createLinearGradient(0, this.scanY - 15, 0, this.scanY + 15);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.45)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, this.scanY - 15, w, 30);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, this.scanY);
    ctx.lineTo(w, this.scanY);
    ctx.stroke();

    // Render Detection Count
    const countEl = document.getElementById('vision-det-count');
    if (countEl) countEl.textContent = `${activeDetections.length} Detected`;
  }

  drawFeedBackground(ctx, w, h, style) {
    if (style === 'pcb') {
      ctx.fillStyle = '#051912';
      ctx.fillRect(0, 0, w, h);
      // Circuit lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.lineWidth = 1.5;
      for (let i = 20; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i + 20, h / 2); ctx.lineTo(i + 10, h);
        ctx.stroke();
      }
      // Microchips
      ctx.fillStyle = '#0f291e';
      ctx.fillRect(260, 40, 130, 120);
      ctx.fillStyle = '#10b98133';
      ctx.fillText('MCU-ARM64', 280, 105);
    } else if (style === 'mri') {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);
      // Cranial silhouette
      const rad = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, 140);
      rad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      rad.addColorStop(0.5, 'rgba(148, 163, 184, 0.2)');
      rad.addColorStop(0.9, 'rgba(30, 41, 59, 0.6)');
      rad.addColorStop(1, 'transparent');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(w/2, h/2, 140, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === 'retail') {
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, w, h);
      // Checkout conveyor
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, 180, w - 40, 50);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(50, 40, 85, 170);
      ctx.strokeRect(160, 70, 120, 90);
      ctx.strokeRect(285, 55, 90, 140);
    } else {
      // Road / Fleet
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, w, h);
      // Vanishing point perspective road
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w/2, 40); ctx.lineTo(40, h);
      ctx.moveTo(w/2, 40); ctx.lineTo(w - 40, h);
      ctx.stroke();
      // Dash lines
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(w/2, 40); ctx.lineTo(w/2, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.visionSimulator = new VisionSimulator();
});
