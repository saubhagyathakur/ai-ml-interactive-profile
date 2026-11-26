/**
 * vector-explorer.js - LLM Tokenizer & Semantic Vector Space Explorer
 * Real-time subword BPE token simulation, cosine similarity gauge, and 2D vector space projection.
 */

const SEMANTIC_BENCHMARKS = [
  { name: 'Generative AI & LLMs', vector: [0.88, 0.42, 0.76, 0.91], color: '#00f0ff', x: 0.8, y: 0.35 },
  { name: 'Computer Vision & Edge', vector: [0.35, 0.89, 0.41, 0.28], color: '#38bdf8', x: 0.3, y: 0.85 },
  { name: 'Distributed MLOps & Infra', vector: [0.55, 0.62, 0.85, 0.32], color: '#818cf8', x: 0.55, y: 0.65 },
  { name: 'Time Series & Forecasting', vector: [0.22, 0.45, 0.35, 0.78], color: '#10b981', x: 0.25, y: 0.35 },
  { name: 'Reinforcement Learning', vector: [0.65, 0.78, 0.38, 0.62], color: '#f59e0b', x: 0.65, y: 0.8 }
];

class VectorExplorer {
  constructor() {
    this.input = document.getElementById('token-input');
    this.tokensContainer = document.getElementById('tokens-output');
    this.tokenCountEl = document.getElementById('token-count');
    this.charCountEl = document.getElementById('char-count');
    this.flopsEl = document.getElementById('token-flops');
    this.canvas = document.getElementById('vector-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.similarityList = document.getElementById('similarity-list');

    this.init();
  }

  init() {
    if (!this.input) return;

    this.input.addEventListener('input', () => this.analyze());
    this.bindPresets();
    this.analyze();
  }

  bindPresets() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-text');
        if (text && this.input) {
          this.input.value = text;
          this.analyze();
          if (window.soundFX) window.soundFX.playClick();
        }
      });
    });
  }

  // BPE-style heuristic tokenizer
  tokenize(text) {
    if (!text.trim()) return [];
    // Split by punctuation and word boundaries
    const words = text.match(/\w+|[^\w\s]|\s+/g) || [];
    const tokens = [];

    words.forEach(chunk => {
      if (/^\s+$/.test(chunk)) {
        tokens.push({ text: '␣', type: 'space', id: 220, bytes: chunk.length });
      } else if (chunk.length <= 4) {
        tokens.push({
          text: chunk,
          type: 'word',
          id: Math.abs(this.hashCode(chunk)) % 32000,
          bytes: new TextEncoder().encode(chunk).length
        });
      } else {
        // Subword split
        const mid = Math.ceil(chunk.length / 2);
        const sub1 = chunk.substring(0, mid);
        const sub2 = chunk.substring(mid);
        tokens.push({
          text: sub1,
          type: 'subword-start',
          id: Math.abs(this.hashCode(sub1)) % 32000,
          bytes: new TextEncoder().encode(sub1).length
        });
        tokens.push({
          text: '##' + sub2,
          type: 'subword-end',
          id: Math.abs(this.hashCode(sub2)) % 32000,
          bytes: new TextEncoder().encode(sub2).length
        });
      }
    });

    return tokens;
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  // Generate pseudo-embedding vector from text based on semantic keywords
  embedText(text) {
    const lower = text.toLowerCase();
    let v0 = 0.1, v1 = 0.1, v2 = 0.1, v3 = 0.1;

    // Generative AI / LLM dimension
    if (lower.match(/llm|gpt|transformer|attention|generate|prompt|token|rag|vllm|langchain/)) v0 += 0.8;
    // Vision dimension
    if (lower.match(/vision|image|segmentation|defect|detection|yolo|resnet|camera|pixel/)) v1 += 0.8;
    // MLOps dimension
    if (lower.match(/triton|serving|kubernetes|pipeline|latency|throughput|docker|stream/)) v2 += 0.8;
    // Sequential / Time-series / RL dimension
    if (lower.match(/forecast|time|temporal|reinforcement|policy|agent|reward|sequence/)) v3 += 0.8;

    // Add character variation hash
    const h = Math.abs(this.hashCode(lower));
    v0 += (h % 30) / 100;
    v1 += ((h >> 2) % 30) / 100;
    v2 += ((h >> 4) % 30) / 100;
    v3 += ((h >> 6) % 30) / 100;

    // Normalize
    const mag = Math.sqrt(v0*v0 + v1*v1 + v2*v2 + v3*v3) || 1;
    return [v0/mag, v1/mag, v2/mag, v3/mag];
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  analyze() {
    const text = this.input.value || '';
    const tokens = this.tokenize(text);

    // Update Token Metrics
    if (this.tokenCountEl) this.tokenCountEl.textContent = tokens.length;
    if (this.charCountEl) this.charCountEl.textContent = text.length;

    // LLaMA-3-70B 2P FLOPs rule of thumb: ~140 GFLOPs per token
    const flopsEst = (tokens.length * 0.14).toFixed(2);
    if (this.flopsEl) this.flopsEl.textContent = `${flopsEst} TFLOPs`;

    // Render Token Pills
    if (this.tokensContainer) {
      if (tokens.length === 0) {
        this.tokensContainer.innerHTML = '<span class="text-gray-500 font-mono text-sm">Enter text to visualize subword tokenization...</span>';
      } else {
        const colors = ['#00f0ff', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
        this.tokensContainer.innerHTML = tokens.map((t, idx) => {
          const c = colors[idx % colors.length];
          return `
            <span class="token-pill" style="border-color: ${c}66; background: ${c}15;" title="Token ID: ${t.id} | Bytes: ${t.bytes}">
              <span class="token-text">${this.escapeHtml(t.text)}</span>
              <span class="token-id" style="color: ${c}">${t.id}</span>
            </span>
          `;
        }).join('');
      }
    }

    // Calculate Semantic Similarity
    const queryVec = this.embedText(text);
    const similarities = SEMANTIC_BENCHMARKS.map(bench => {
      const sim = this.cosineSimilarity(queryVec, bench.vector);
      return { ...bench, similarity: sim };
    }).sort((a, b) => b.similarity - a.similarity);

    if (this.similarityList) {
      this.similarityList.innerHTML = similarities.map(s => {
        const pct = Math.max(0, Math.min(100, Math.round(s.similarity * 100)));
        return `
          <div class="similarity-item">
            <div class="flex justify-between text-xs font-mono mb-1">
              <span style="color: ${s.color}">${s.name}</span>
              <span class="text-gray-300 font-bold">${pct}% Match</span>
            </div>
            <div class="sim-bar-bg">
              <div class="sim-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, ${s.color}66, ${s.color});"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render 2D Vector Space
    this.renderVectorSpace(queryVec, similarities);
  }

  renderVectorSpace(queryVec, similarities) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Grid lines & concentric distance rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    [0.2, 0.4, 0.6, 0.8].forEach(r => {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, (w / 2) * r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Query 2D projection
    const qx = (queryVec[0] - queryVec[1] + 1) * 0.45 * w + w * 0.05;
    const qy = (queryVec[2] - queryVec[3] + 1) * 0.45 * h + h * 0.05;

    // Render benchmark nodes & connection lines to query
    similarities.forEach(s => {
      const bx = s.x * w;
      const by = s.y * h;

      // Line
      ctx.beginPath();
      ctx.moveTo(qx, qy);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = `${s.color}${Math.max(15, Math.round(s.similarity * 80)).toString(16)}`;
      ctx.lineWidth = Math.max(1, s.similarity * 2.5);
      ctx.stroke();

      // Benchmark point
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = '10px "Fira Code", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(s.name, bx + 9, by + 4);
    });

    // Query point
    ctx.beginPath();
    ctx.arc(qx, qy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 11px "Fira Code", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('Your Prompt Vector', qx + 12, qy - 6);
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vectorExplorer = new VectorExplorer();
});
