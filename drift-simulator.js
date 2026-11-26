/**
 * drift-simulator.js - MLOps Streaming Drift & Anomaly Detector
 * Real-time metric streaming, Kolmogorov-Smirnov statistical shift simulation, and automated retraining triggers.
 */

class DriftSimulator {
  constructor() {
    this.canvas = document.getElementById('drift-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.bufferLength = 60;
    this.baselineValues = [];
    this.driftValues = [];
    this.threshold = 0.65;
    this.isDriftActive = false;
    this.driftTimer = 0;
    this.ksScore = 0.12;
    this.retrainingActive = false;

    this.init();
  }

  init() {
    // Fill initial history
    for (let i = 0; i < this.bufferLength; i++) {
      this.baselineValues.push(0.3 + (Math.random() - 0.5) * 0.1);
      this.driftValues.push(0.3 + (Math.random() - 0.5) * 0.1);
    }

    this.bindControls();
    setInterval(() => this.tick(), 150);
  }

  bindControls() {
    const driftBtn = document.getElementById('btn-inject-drift');
    if (driftBtn) {
      driftBtn.addEventListener('click', () => {
        this.isDriftActive = true;
        this.driftTimer = 35; // duration of injected drift
        if (window.soundFX) window.soundFX.playActivate();
        this.logEvent('⚠️ ALERT: Statistical distribution shift detected! KS-Statistic > 0.65');
      });
    }

    const outlierBtn = document.getElementById('btn-inject-outlier');
    if (outlierBtn) {
      outlierBtn.addEventListener('click', () => {
        this.driftValues[this.driftValues.length - 1] = 0.95;
        if (window.soundFX) window.soundFX.playClick();
        this.logEvent('⚠️ Outlier detected: 3.8-sigma anomaly in input vector embeddings');
      });
    }

    const retrainBtn = document.getElementById('btn-trigger-retrain');
    if (retrainBtn) {
      retrainBtn.addEventListener('click', () => {
        this.triggerRetraining();
      });
    }
  }

  triggerRetraining() {
    if (this.retrainingActive) return;
    this.retrainingActive = true;
    this.isDriftActive = false;
    if (window.soundFX) window.soundFX.playSuccess();
    this.logEvent('🚀 Pipeline: Firing Ray-Train fine-tuning job with LoRA (Rank=16, Alpha=32)...');

    setTimeout(() => {
      this.logEvent('⚙️ Model Registry: Validating shadow deployment against canary traffic...');
    }, 1200);

    setTimeout(() => {
      this.ksScore = 0.09;
      this.retrainingActive = false;
      this.logEvent('✅ Deployment: Shadow model promoted to production. Drift normalized (KS: 0.09).');
    }, 2800);
  }

  logEvent(msg) {
    const logBox = document.getElementById('drift-log-stream');
    if (!logBox) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'drift-log-entry';
    entry.innerHTML = `<span class="text-cyan-400 font-mono">[${time}]</span> ${msg}`;
    logBox.insertBefore(entry, logBox.firstChild);
    while (logBox.children.length > 8) {
      logBox.removeChild(logBox.lastChild);
    }
  }

  tick() {
    let nextVal = 0.3 + (Math.random() - 0.5) * 0.12;

    if (this.isDriftActive) {
      this.driftTimer--;
      nextVal = 0.72 + (Math.random() - 0.5) * 0.18;
      this.ksScore = Math.min(0.94, this.ksScore + 0.05);

      if (this.ksScore >= this.threshold && !this.retrainingActive) {
        // Auto trigger alert
        const alertBadge = document.getElementById('drift-alert-badge');
        if (alertBadge) {
          alertBadge.className = 'badge-pill bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse';
          alertBadge.textContent = 'DRIFT DETECTED: RETRAIN REQUIRED';
        }
      }

      if (this.driftTimer <= 0) {
        this.isDriftActive = false;
      }
    } else {
      this.ksScore = Math.max(0.11, this.ksScore * 0.96);
      const alertBadge = document.getElementById('drift-alert-badge');
      if (alertBadge && !this.retrainingActive) {
        alertBadge.className = 'badge-pill bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        alertBadge.textContent = 'MODEL HEALTH: NOMINAL';
      }
    }

    this.driftValues.shift();
    this.driftValues.push(Math.max(0.05, Math.min(0.98, nextVal)));

    // Update telemetry
    const ksEl = document.getElementById('drift-ks-val');
    const latEl = document.getElementById('drift-p99-val');
    if (ksEl) ksEl.textContent = this.ksScore.toFixed(3);
    if (latEl) latEl.textContent = `${(10.2 + this.ksScore * 8.5).toFixed(1)} ms`;

    this.render();
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Threshold line
    const threshY = h - this.threshold * h;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, threshY); ctx.lineTo(w, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '9px "Fira Code", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('CRITICAL DRIFT THRESHOLD (0.65)', 10, threshY - 5);

    // Baseline area
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    // Draw Drift Value Area & Line
    const stepX = w / (this.bufferLength - 1);
    ctx.beginPath();
    ctx.moveTo(0, h);

    for (let i = 0; i < this.bufferLength; i++) {
      const x = i * stepX;
      const y = h - this.driftValues[i] * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    const isHigh = this.ksScore >= this.threshold;
    ctx.strokeStyle = isHigh ? '#ef4444' : '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, isHigh ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.driftSimulator = new DriftSimulator();
});
