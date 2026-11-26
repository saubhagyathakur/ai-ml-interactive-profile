/**
 * neural-playground.js - Interactive In-Browser 2D Neural Network Classifier
 * Simulates a multi-layer perceptron training on 2D non-linear datasets with live decision boundary.
 */

class NeuralPlayground {
  constructor() {
    this.canvas = document.getElementById('nn-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.lossCanvas = document.getElementById('loss-canvas');
    this.lossCtx = this.lossCanvas ? this.lossCanvas.getContext('2d') : null;

    this.datasetType = 'circle'; // circle, spiral, xor, moons
    this.points = [];
    this.hiddenNeurons = 8;
    this.learningRate = 0.03;
    this.activation = 'relu';
    this.epoch = 0;
    this.lossHistory = [];
    this.isRunning = false;
    this.weights1 = []; // Input (2) -> Hidden (H)
    this.bias1 = [];
    this.weights2 = []; // Hidden (H) -> Output (1)
    this.bias2 = 0;

    this.init();
  }

  init() {
    this.setupDataset();
    this.resetWeights();
    this.bindControls();
    this.render();
  }

  setupDataset() {
    this.points = [];
    const count = 120;

    if (this.datasetType === 'circle') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Class 0: inner circle
        if (i < count / 2) {
          const r = Math.random() * 0.38 + 0.05;
          this.points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, label: 0 });
        } else {
          // Class 1: outer ring
          const r = Math.random() * 0.35 + 0.55;
          this.points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, label: 1 });
        }
      }
    } else if (this.datasetType === 'xor') {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 1.6;
        const y = (Math.random() - 0.5) * 1.6;
        const label = (x > 0 && y > 0) || (x < 0 && y < 0) ? 1 : 0;
        this.points.push({ x, y, label });
      }
    } else if (this.datasetType === 'moons') {
      for (let i = 0; i < count / 2; i++) {
        const angle = Math.random() * Math.PI;
        this.points.push({
          x: Math.cos(angle) * 0.6 - 0.3,
          y: Math.sin(angle) * 0.6 - 0.1,
          label: 0
        });
        this.points.push({
          x: 0.3 - Math.cos(angle) * 0.6,
          y: -Math.sin(angle) * 0.6 + 0.1,
          label: 1
        });
      }
    } else if (this.datasetType === 'spiral') {
      for (let i = 0; i < count / 2; i++) {
        const r = (i / (count / 2)) * 0.8 + 0.1;
        const t = (1.5 * i / (count / 2)) * Math.PI * 2;
        this.points.push({
          x: r * Math.sin(t) + (Math.random() - 0.5) * 0.05,
          y: r * Math.cos(t) + (Math.random() - 0.5) * 0.05,
          label: 0
        });
        this.points.push({
          x: -r * Math.sin(t) + (Math.random() - 0.5) * 0.05,
          y: -r * Math.cos(t) + (Math.random() - 0.5) * 0.05,
          label: 1
        });
      }
    }
  }

  resetWeights() {
    this.epoch = 0;
    this.lossHistory = [];
    this.weights1 = [];
    this.bias1 = [];
    for (let i = 0; i < this.hiddenNeurons; i++) {
      this.weights1.push([
        (Math.random() - 0.5) * 2.0,
        (Math.random() - 0.5) * 2.0
      ]);
      this.bias1.push((Math.random() - 0.5) * 0.5);
    }
    this.weights2 = [];
    for (let i = 0; i < this.hiddenNeurons; i++) {
      this.weights2.push((Math.random() - 0.5) * 2.0);
    }
    this.bias2 = (Math.random() - 0.5) * 0.5;
  }

  act(z) {
    if (this.activation === 'relu') return Math.max(0, z);
    if (this.activation === 'tanh') return Math.tanh(z);
    if (this.activation === 'sigmoid') return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));
    // GELU approximation
    return 0.5 * z * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
  }

  actDeriv(z, a) {
    if (this.activation === 'relu') return z > 0 ? 1 : 0;
    if (this.activation === 'tanh') return 1 - a * a;
    if (this.activation === 'sigmoid') return a * (1 - a);
    return z > 0 ? 1 : 0.05; // GELU approx derivative
  }

  sigmoid(z) {
    return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));
  }

  forward(x, y) {
    const hiddenA = [];
    const hiddenZ = [];
    for (let i = 0; i < this.hiddenNeurons; i++) {
      const z = x * this.weights1[i][0] + y * this.weights1[i][1] + this.bias1[i];
      hiddenZ.push(z);
      hiddenA.push(this.act(z));
    }
    let outZ = this.bias2;
    for (let i = 0; i < this.hiddenNeurons; i++) {
      outZ += hiddenA[i] * this.weights2[i];
    }
    const outA = this.sigmoid(outZ);
    return { hiddenZ, hiddenA, outZ, outA };
  }

  trainStep() {
    let totalLoss = 0;
    const lr = this.learningRate;

    for (const pt of this.points) {
      const { hiddenZ, hiddenA, outA } = this.forward(pt.x, pt.y);
      const target = pt.label;
      const error = outA - target;

      // Binary cross-entropy loss
      const eps = 1e-7;
      totalLoss += -(target * Math.log(outA + eps) + (1 - target) * Math.log(1 - outA + eps));

      // Gradient at output layer (sigmoid + cross-entropy derivative = outA - target)
      const dOutZ = error;

      // Gradients for weights2 & bias2
      for (let i = 0; i < this.hiddenNeurons; i++) {
        const dW2 = dOutZ * hiddenA[i];
        this.weights2[i] -= lr * dW2;

        // Backprop to hidden layer
        const dHiddenA = dOutZ * this.weights2[i];
        const dHiddenZ = dHiddenA * this.actDeriv(hiddenZ[i], hiddenA[i]);

        this.weights1[i][0] -= lr * dHiddenZ * pt.x;
        this.weights1[i][1] -= lr * dHiddenZ * pt.y;
        this.bias1[i] -= lr * dHiddenZ;
      }
      this.bias2 -= lr * dOutZ;
    }

    this.epoch++;
    const avgLoss = totalLoss / this.points.length;
    this.lossHistory.push(avgLoss);
    if (this.lossHistory.length > 50) this.lossHistory.shift();

    // Update telemetry UI
    const epochEl = document.getElementById('nn-epoch');
    const lossEl = document.getElementById('nn-loss');
    if (epochEl) epochEl.textContent = this.epoch;
    if (lossEl) lossEl.textContent = avgLoss.toFixed(4);
  }

  bindControls() {
    const playBtn = document.getElementById('nn-btn-toggle');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isRunning = !this.isRunning;
        playBtn.innerHTML = this.isRunning
          ? '<i class="fas fa-pause mr-1"></i> Pause'
          : '<i class="fas fa-play mr-1"></i> Train Model';
        if (this.isRunning) {
          if (window.soundFX) window.soundFX.playActivate();
          this.loop();
        }
      });
    }

    const resetBtn = document.getElementById('nn-btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.isRunning = false;
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play mr-1"></i> Train Model';
        this.resetWeights();
        this.render();
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    const datasetSel = document.getElementById('nn-dataset');
    if (datasetSel) {
      datasetSel.addEventListener('change', (e) => {
        this.datasetType = e.target.value;
        this.setupDataset();
        this.resetWeights();
        this.render();
      });
    }

    const neuronsSel = document.getElementById('nn-neurons');
    if (neuronsSel) {
      neuronsSel.addEventListener('change', (e) => {
        this.hiddenNeurons = parseInt(e.target.value, 10);
        this.resetWeights();
        this.render();
      });
    }

    const actSel = document.getElementById('nn-activation');
    if (actSel) {
      actSel.addEventListener('change', (e) => {
        this.activation = e.target.value;
        this.resetWeights();
        this.render();
      });
    }

    const lrSlider = document.getElementById('nn-lr');
    if (lrSlider) {
      lrSlider.addEventListener('input', (e) => {
        this.learningRate = parseFloat(e.target.value);
        const lrVal = document.getElementById('nn-lr-val');
        if (lrVal) lrVal.textContent = this.learningRate.toFixed(3);
      });
    }
  }

  loop() {
    if (!this.isRunning) return;
    for (let k = 0; k < 5; k++) {
      this.trainStep();
    }
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Draw decision boundary grid
    const resolution = 28;
    const cellW = w / resolution;
    const cellH = h / resolution;

    for (let r = 0; r < resolution; r++) {
      for (let c = 0; c < resolution; c++) {
        // Map grid cell to normalized space [-1, 1]
        const nx = (c / resolution) * 2 - 1;
        const ny = (r / resolution) * 2 - 1;

        const { outA } = this.forward(nx, ny);

        // Interpolate color: Cyan (Class 1) vs Purple (Class 0)
        const alpha = Math.abs(outA - 0.5) * 1.5;
        if (outA > 0.5) {
          ctx.fillStyle = `rgba(0, 240, 255, ${Math.min(alpha * 0.45, 0.5)})`;
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${Math.min(alpha * 0.45, 0.5)})`;
        }
        ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
      }
    }

    // Draw coordinate axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Draw training points
    for (const pt of this.points) {
      const px = ((pt.x + 1) / 2) * w;
      const py = ((pt.y + 1) / 2) * h;

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.label === 1 ? '#00f0ff' : '#a855f7';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = pt.label === 1 ? '#00f0ff' : '#a855f7';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Render loss sparkline
    if (this.lossCtx && this.lossHistory.length > 1) {
      const lCtx = this.lossCtx;
      const lw = this.lossCanvas.width;
      const lh = this.lossCanvas.height;
      lCtx.clearRect(0, 0, lw, lh);

      lCtx.strokeStyle = '#00f0ff';
      lCtx.lineWidth = 2;
      lCtx.beginPath();

      const maxLoss = 1.2;
      for (let i = 0; i < this.lossHistory.length; i++) {
        const lx = (i / (this.lossHistory.length - 1)) * lw;
        const ly = lh - Math.min(1, this.lossHistory[i] / maxLoss) * lh;
        if (i === 0) lCtx.moveTo(lx, ly);
        else lCtx.lineTo(lx, ly);
      }
      lCtx.stroke();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.neuralPlayground = new NeuralPlayground();
});
