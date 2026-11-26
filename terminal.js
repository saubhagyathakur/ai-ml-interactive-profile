/**
 * terminal.js - Interactive Developer CLI Terminal
 * Emulates a high-tech Unix/AI terminal with rich commands, history, and autocomplete.
 */

const COMMANDS = {
  help: () => `
Available system commands:
  <span class="text-cyan-400">help</span>        : Displays this command manual
  <span class="text-cyan-400">whoami</span>      : Identity, title & security clearance
  <span class="text-cyan-400">skills</span>      : Production tech stack & framework proficiency
  <span class="text-cyan-400">ecosystem</span>   : Overview of 7 vertical AI industry hubs
  <span class="text-cyan-400">projects</span>    : High-impact production systems portfolio
  <span class="text-cyan-400">metrics</span>     : Global model fleet telemetries & SLAs
  <span class="text-cyan-400">patents</span>     : Granted US patents & NeurIPS/ICLR publications
  <span class="text-cyan-400">download-cv</span> : Trigger curriculum vitae download
  <span class="text-cyan-400">contact</span>     : Display encrypted direct communication channels
  <span class="text-cyan-400">clear</span>       : Purge terminal display buffer
`,
  whoami: () => `
<span class="text-cyan-400 font-bold">DR. ALEX VANCE, Ph.D.</span>
Role: Principal AI/ML Architect & Senior Staff Engineer (10+ Yrs Exp)
Focus: Distributed Deep Learning, LLM High-Throughput Serving, Edge Vision
Clearance: Level-5 Production Root Access
Status: Active & Available for Advisory / Principal Consulting
`,
  skills: () => `
<span class="text-purple-400 font-bold">[CORE CAPABILITIES]</span>
  • Generative AI & LLMs   : vLLM, TensorRT-LLM, LangChain, Llama-3, QLoRA, RAG
  • Deep Learning & CV    : PyTorch, JAX, CUDA/C++, MONAI, YOLOv10, Swin-UNETR
  • MLOps & Serving       : NVIDIA Triton, Ray, Feast Feature Store, MLflow, Docker
  • Big Data & Streaming  : Apache Kafka, Apache Spark, Delta Lake, Milvus, Redis
  • Cloud & Kubernetes    : AWS SageMaker, GCP Vertex AI, K8s Operator, Terraform
`,
  ecosystem: () => `
<span class="text-cyan-400 font-bold">[7-PILLAR INDUSTRY ECOSYSTEM]</span>
  [1] Smart Retail & E-Commerce       : Real-time Multi-Armed Bandit RecSys (+34% Conv)
  [2] Predictive Growth & Analytics    : Temporal Fusion Transformers (96.8% Acc)
  [3] Talent Intelligence & AI Copilots: RAG Resume Knowledge Graphs (-62% Time-to-hire)
  [4] Fintech, Banking & Governance    : Sub-4ms GNN Anti-Fraud (99.85% Intercept)
  [5] Medical AI & Diagnostics        : 3D MRI Swin-UNETR (0.924 Dice Score)
  [6] Autonomous Logistics & Fleet     : Deep RL Vehicle Routing Problem Solver (-22% Fuel)
  [7] Smart Factory & Industrial IoT   : 240 FPS Edge Vision on Jetson Orin (<25W)
`,
  projects: () => `
<span class="text-emerald-400 font-bold">[FEATURED PRODUCTION PROJECTS]</span>
  • <span class="text-cyan-300">OmniServe-LLM</span>   : Distributed gateway handling 15,000 req/sec with PagedAttention
  • <span class="text-cyan-300">NeuroVision-Edge</span> : 240 FPS micro-defect detection on NVIDIA Jetson AGX Orin
  • <span class="text-cyan-300">AuraHealth-RAG</span>   : Multimodal clinical reasoning across 42 partner medical centers
  • <span class="text-cyan-300">ChronoForecast</span>  : RL dynamic dispatch & inventory saving $8.6M annually
  • <span class="text-cyan-300">CyberGuard-Net</span>  : 80,000 tx/sec GNN anti-money laundering engine
`,
  metrics: () => `
<span class="text-yellow-400 font-bold">[GLOBAL FLEET TELEMETRY]</span>
  • Total Production Inferences : 248,520,180
  • Global Average Latency      : 9.4ms p95 / 14.2ms p99
  • Quantization Savings        : 64.2% VRAM footprint (FP8 / AWQ)
  • Uptime SLA                  : 99.985% across 4 multi-region clusters
`,
  patents: () => `
<span class="text-purple-300 font-bold">[PATENTS & PUBLICATIONS]</span>
  • US Patent 11,842,910 : "Distributed Key-Value Cache Eviction for Paged Transformer Attention"
  • US Patent 11,490,211 : "Ultra-Low Power Temporal Graph Convolutional Anomaly Detectors"
  • NeurIPS 2024         : "Speculative Verification via Latent Draft Trees in Edge Transformers"
  • ICLR 2023            : "Zero-Shot Counterfactual Alignment for Multi-Modal Medical RAG"
`,
  'download-cv': () => {
    window.location.href = '#resume';
    const cvModal = document.getElementById('cv-modal');
    if (cvModal) cvModal.classList.remove('hidden');
    return '<span class="text-emerald-400">Initiating CV preview & export modal...</span>';
  },
  contact: () => `
Direct Encrypted Channels:
  Email    : <a href="mailto:alex.vance.ai@nexus-intel.com" class="text-cyan-400 underline">alex.vance.ai@nexus-intel.com</a>
  LinkedIn : <a href="https://linkedin.com" target="_blank" class="text-cyan-400 underline">linkedin.com/in/alex-vance-ai</a>
  GitHub   : <a href="https://github.com" target="_blank" class="text-cyan-400 underline">github.com/alexvance-ai</a>
  Office   : San Francisco, CA / Hybrid Remote Worldwide
`
};

class InteractiveTerminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.history = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    this.input.addEventListener('keydown', (e) => this.handleKey(e));
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      const line = this.input.value.trim();
      if (line) {
        this.history.push(line);
        this.historyIndex = this.history.length;
        this.executeCommand(line);
        this.input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autocomplete();
    }
  }

  autocomplete() {
    const val = this.input.value.trim().toLowerCase();
    if (!val) return;
    const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
    }
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase();

    // Echo input
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    lineEl.innerHTML = `<span class="text-cyan-400">guest@nexus-ai:~$</span> <span class="text-white">${this.escapeHtml(rawCmd)}</span>`;
    this.output.appendChild(lineEl);

    if (cmd === 'clear') {
      this.output.innerHTML = '';
      return;
    }

    const handler = COMMANDS[cmd];
    const respEl = document.createElement('div');
    respEl.className = 'terminal-response text-gray-300 font-mono text-xs my-1';

    if (handler) {
      respEl.innerHTML = handler();
      if (window.soundFX) window.soundFX.playClick();
    } else {
      respEl.innerHTML = `<span class="text-red-400">bash: command not found: ${this.escapeHtml(rawCmd)}. Type <span class="text-cyan-300 font-bold">help</span> for command list.</span>`;
    }

    this.output.appendChild(respEl);
    this.output.scrollTop = this.output.scrollHeight;
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.interactiveTerminal = new InteractiveTerminal();
});
