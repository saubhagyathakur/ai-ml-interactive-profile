/**
 * ecosystem-hub.js - Interactive AI/ML Industry Ecosystem Radar
 * Direct interactive realization of the AI/ML Multi-Industry Satellite Architecture.
 */

const ECOSYSTEM_DATA = {
  retail: {
    id: 'retail',
    title: 'Smart Retail & E-Commerce',
    icon: 'shopping-cart',
    color: '#00f0ff',
    domain: 'B2C & Omnichannel Commerce',
    headline: 'Real-Time Multi-Armed Bandit Personalization & Graph RecSys',
    summary: 'High-throughput recommendation pipelines handling 10M+ SKUs, sub-12ms inference latencies, and contextual vector search with multimodal CLIP models.',
    metrics: [
      { label: 'Conversion Lift', value: '+34.2%' },
      { label: 'p99 Inference SLA', value: '11.8 ms' },
      { label: 'Daily Query Vol', value: '45M+' },
      { label: 'Gross Margins Boost', value: '+$14.8M' }
    ],
    techStack: ['PyTorch', 'NVIDIA Triton', 'Faiss / Milvus', 'Redis Vector', 'vLLM', 'Ray Serve'],
    architecture: 'User Clickstream -> Apache Kafka -> Feature Store (Feast) -> Two-Tower Retrieval -> Cross-Encoder Reranker (Triton FP16) -> Dynamic Pricing Bandit -> Response Cache.',
    caseStudy: 'Engineered an end-to-end vector search and reranking engine for a global marketplace with 40M active users. Scaled horizontally on Kubernetes with Triton inference servers, dropping p95 latency from 85ms to 12ms while improving Click-Through-Rate by 28%.'
  },
  analytics: {
    id: 'analytics',
    title: 'Predictive Growth & Quantitative Analytics',
    icon: 'trending-up',
    color: '#10b981',
    domain: 'Enterprise Intelligence & Forecasting',
    headline: 'Temporal Fusion Transformers & Deep Time-Series Inference',
    summary: 'Probabilistic demand forecasting, automated customer churn intervention, and macroeconomic market regime detection with explainable attention maps.',
    metrics: [
      { label: 'Forecast Accuracy', value: '96.8%' },
      { label: 'Inventory Cost Cut', value: '-24.5%' },
      { label: 'Early Churn Catch', value: '88.3%' },
      { label: 'Horizon Range', value: '1 to 180 Days' }
    ],
    techStack: ['Temporal Fusion Transformers (TFT)', 'Dask', 'MLflow', 'Optuna', 'Prophet', 'XGBoost GPU'],
    architecture: 'Historical Telemetry -> BigQuery -> Spark Distributed Preprocessing -> TFT Multi-Horizon Model -> Quantile Loss Uncertainty Bounds -> Automated Executive Alerts.',
    caseStudy: 'Architected enterprise demand forecasting engine deployed across 2,400 retail hubs. Integrated self-attention mechanisms to quantify seasonal vs promotional impact, slashing stockouts by 37%.'
  },
  talent: {
    id: 'talent',
    title: 'Talent Intelligence & Conversational Agents',
    icon: 'users',
    color: '#8b5cf6',
    domain: 'Workforce & Human Capital AI',
    headline: 'Fine-Tuned LLM Copilots & Semantic Skill Graphs',
    summary: 'Autonomous interview assistants, zero-bias candidate resume graph embeddings, and employee skill-gap recommendation systems powered by RAG and LangChain.',
    metrics: [
      { label: 'Time-to-Hire Cut', value: '-62%' },
      { label: 'Semantic Match F1', value: '0.942' },
      { label: 'Bias Reduction', value: '99.4%' },
      { label: 'Internal Mobility', value: '+45%' }
    ],
    techStack: ['Llama-3-70B QLoRA', 'LangChain', 'Neo4j GraphDB', 'Weaviate', 'FastAPI', 'Hugging Face'],
    architecture: 'Resume & Job Corpus -> Tokenization & Embedding -> Knowledge Graph Nodes (Neo4j) -> Hybrid Dense-Sparse Retrieval -> LLM Synthesizer -> Human-in-the-Loop Review UI.',
    caseStudy: 'Built an enterprise recruiting copilot that screens 500k applications annually. Automated fairness audits using counterfactual evaluations to ensure zero demographic skew across gender and race.'
  },
  fintech: {
    id: 'fintech',
    title: 'Fintech, Banking & Governance',
    icon: 'landmark',
    color: '#f59e0b',
    domain: 'Financial Services & Compliance',
    headline: 'Graph Neural Networks for Anti-Fraud & Regulatory Guardrails',
    summary: 'Sub-4ms transactional anomaly detection, credit risk modeling with SHAP explainability, and automated SEC/GDPR compliance monitoring with strict LLM guardrails.',
    metrics: [
      { label: 'Fraud Intercept Rate', value: '99.85%' },
      { label: 'False Positive Cut', value: '-71%' },
      { label: 'Inference Latency', value: '< 3.8 ms' },
      { label: 'Regulatory Audit', value: '100% Pass' }
    ],
    techStack: ['Graph Neural Networks (PyG)', 'NeMo Guardrails', 'TensorRT', 'SHAP', 'Kafka Streams', 'Snowflake'],
    architecture: 'Card Swipes / Wire Stream -> Flink Complex Event Processing -> Heterogeneous GNN (PyG) -> TensorRT Engine -> Rule-Engine Arbiter -> Instant Block / Approve.',
    caseStudy: 'Engineered a GNN fraud-ring detection engine processing $60B+ in annual transactions. Cut illicit network rings by 84% while maintaining sub-4 millisecond wire approval latency.'
  },
  health: {
    id: 'health',
    title: 'Medical AI & Clinical Diagnostics',
    icon: 'cross',
    color: '#ec4899',
    domain: 'Life Sciences & MedTech',
    headline: 'Multimodal Pathology Transformers & HIPAA Federated Learning',
    summary: '3D volumetric MRI/CT segmentation, oncology tissue classification with Vision Transformers, and privacy-preserving federated clinical training.',
    metrics: [
      { label: 'Diagnostic Dice Score', value: '0.924' },
      { label: 'False Negative Rate', value: '< 0.8%' },
      { label: 'Hospital Nodes', value: '42 Active' },
      { label: 'HIPAA Compliance', value: 'Certified' }
    ],
    techStack: ['MONAI', 'PyTorch 3D', 'Vision Transformers (ViT)', 'NVFlare (Federated)', 'ONNX Runtime', 'Docker Med'],
    architecture: 'DICOM Hospital PACS -> De-identification Pipeline -> 3D Swin-UNETR -> Uncertainty Estimation -> Radiologist Overlay Workstation -> Federated Gradient Aggregation.',
    caseStudy: 'Spearheaded clinical trial AI tool across 42 hospitals. Delivered real-time tumor boundary delineation on multi-parametric MRI, achieving 98.2% inter-observer concordance with board-certified radiologists.'
  },
  logistics: {
    id: 'logistics',
    title: 'Autonomous Logistics & Supply Chain',
    icon: 'truck',
    color: '#3b82f6',
    domain: 'Autonomous Fleet & Telematics',
    headline: 'Deep Reinforcement Learning (PPO) Dynamic Dispatch & VRP',
    summary: 'Solving NP-hard Vehicle Routing Problems (VRP) in real time with graph attention networks, dynamic weather rerouting, and fleet telematics prediction.',
    metrics: [
      { label: 'Fuel Spend Cut', value: '-22.4%' },
      { label: 'On-Time Delivery', value: '98.9%' },
      { label: 'Reroute Compute Time', value: '220 ms' },
      { label: 'Fleet Managed', value: '14,000+' }
    ],
    techStack: ['Ray RLlib', 'PPO Algorithms', 'OpenStreetMap / OSRM', 'C++ Inference Engine', 'Kafka', 'TimescaleDB'],
    architecture: 'GPS Telematics & Traffic Feeds -> Streaming State Encoder -> Policy Network (RLlib PPO) -> Constrained Mixed-Integer Solver -> Driver Navigation App.',
    caseStudy: 'Deployed autonomous fleet dispatching optimizer managing 14,000 delivery vehicles. Recomputed optimal routes under sudden metropolitan road closures within 220ms, saving $8.6M in annual fuel expenses.'
  },
  factory: {
    id: 'factory',
    title: 'Smart Factory & Industrial IoT',
    icon: 'factory',
    color: '#06b6d4',
    domain: 'Industry 4.0 & Edge Robotics',
    headline: 'Sub-Millisecond Edge Vision & Acoustic Vibration Anomaly Detection',
    summary: 'High-speed assembly line QA with 8-bit quantized YOLOv10 running on NVIDIA Jetson, paired with autoencoders on ultrasonic accelerometer feeds for zero-downtime maintenance.',
    metrics: [
      { label: 'Defect Detection Rate', value: '99.94%' },
      { label: 'Inspection Speed', value: '240 FPS' },
      { label: 'Unscheduled Downtime', value: '-48%' },
      { label: 'Edge Wattage', value: '< 25 Watts' }
    ],
    techStack: ['YOLOv10 / TensorRT FP8', 'Jetson AGX Orin', 'C++ / CUDA', '1D-CNN Vibration Autoencoders', 'MQTT', 'InfluxDB'],
    architecture: 'Line Camera + Piezo Sensor -> GigE Vision Grabber -> TensorRT INT8 Engine -> PLC Signal (0.8ms) -> Robotic Ejection Actuator -> Cloud Telemetry Dashboard.',
    caseStudy: 'Engineered edge vision inspection units installed across 18 semiconductor and automotive manufacturing lines. Achieved 240 FPS real-time microscopic solder inspection with zero line halts.'
  }
};

class EcosystemHub {
  constructor() {
    this.container = document.getElementById('ecosystem-radar');
    this.activeNodeId = 'retail';
    this.isPaused = false;
    this.init();
  }

  init() {
    this.bindNodes();
    this.renderDetails('retail');

    // Controls
    const pauseBtn = document.getElementById('btn-pause-orbit');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        const ring = document.querySelector('.orbit-ring');
        if (ring) {
          ring.style.animationPlayState = this.isPaused ? 'paused' : 'running';
        }
        pauseBtn.innerHTML = this.isPaused
          ? '<i class="fas fa-play"></i> Resume Orbit'
          : '<i class="fas fa-pause"></i> Freeze Orbit';
      });
    }

    const modalClose = document.getElementById('close-ecosystem-modal');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        document.getElementById('ecosystem-modal').classList.add('hidden');
      });
    }

    const inspectBtn = document.getElementById('btn-inspect-node');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        this.openModal(this.activeNodeId);
      });
    }
  }

  bindNodes() {
    const nodes = document.querySelectorAll('.satellite-node');
    nodes.forEach(node => {
      node.addEventListener('click', (e) => {
        const id = node.dataset.id;
        if (id && ECOSYSTEM_DATA[id]) {
          this.setActiveNode(id);
          if (window.soundFX) window.soundFX.playClick();
        }
      });

      node.addEventListener('mouseenter', () => {
        if (window.soundFX) window.soundFX.playHover();
      });
    });

    const core = document.querySelector('.core-node');
    if (core) {
      core.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playActivate();
        this.openModal('overview');
      });
    }
  }

  setActiveNode(id) {
    this.activeNodeId = id;
    document.querySelectorAll('.satellite-node').forEach(n => {
      n.classList.toggle('active', n.dataset.id === id);
    });
    this.renderDetails(id);
  }

  renderDetails(id) {
    const data = ECOSYSTEM_DATA[id];
    if (!data) return;

    const panel = document.getElementById('ecosystem-inspector');
    if (!panel) return;

    panel.innerHTML = `
      <div class="panel-header" style="border-left: 4px solid ${data.color}">
        <div class="badge-pill" style="background: ${data.color}22; color: ${data.color}; border: 1px solid ${data.color}55;">
          ${data.domain}
        </div>
        <h3 class="panel-title">${data.title}</h3>
        <p class="panel-headline">${data.headline}</p>
      </div>

      <p class="panel-summary">${data.summary}</p>

      <div class="metrics-grid">
        ${data.metrics.map(m => `
          <div class="metric-card">
            <span class="metric-val" style="color: ${data.color}">${m.value}</span>
            <span class="metric-lbl">${m.label}</span>
          </div>
        `).join('')}
      </div>

      <div class="arch-box">
        <div class="arch-tag"><i class="fas fa-network-wired"></i> Production Pipeline</div>
        <p class="arch-text"><code>${data.architecture}</code></p>
      </div>

      <div class="tech-tags">
        ${data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
      </div>

      <div class="panel-actions">
        <button class="btn btn-sm btn-primary" onclick="window.ecosystemHub.openModal('${id}')">
          <i class="fas fa-microscope"></i> View Full Architecture Case Study
        </button>
      </div>
    `;
  }

  openModal(id) {
    const modal = document.getElementById('ecosystem-modal');
    const content = document.getElementById('ecosystem-modal-content');
    if (!modal || !content) return;

    if (id === 'overview') {
      content.innerHTML = `
        <div class="modal-case-study">
          <div class="badge-pill mb-2">Architectural Blueprint</div>
          <h2>AI/ML Multi-Domain Enterprise Architecture</h2>
          <p class="lead">Centralized high-performance Deep Learning core powering 7 mission-critical vertical industries with sub-second latencies and 99.99% availability.</p>
          <div class="mt-4 p-4 rounded bg-slate-900 border border-cyan-500/30 text-center">
            <img src="./assets/ai-ml-ecosystem.jpg" alt="AI/ML Architecture Hub" style="max-height: 380px; width: auto; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 25px rgba(0, 240, 255, 0.25);" />
            <p class="text-xs text-gray-400 mt-2 font-mono">Figure 1.0: End-to-End Artificial Intelligence & Machine Learning Ecosystem Architecture</p>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="p-3 bg-slate-800/60 rounded border border-slate-700">
              <h4 class="text-cyan-400 font-semibold mb-1">Central Inference Engine</h4>
              <p class="text-sm text-gray-300">Unified TensorRT-LLM and Triton cluster supporting mixed precision (FP8/FP16), continuous batching, and dynamic autoscaling across Kubernetes nodes.</p>
            </div>
            <div class="p-3 bg-slate-800/60 rounded border border-slate-700">
              <h4 class="text-purple-400 font-semibold mb-1">Unified Feature & Vector Store</h4>
              <p class="text-sm text-gray-300">Shared Milvus & Redis clusters maintaining real-time embeddings for 10M+ entities across e-commerce, banking, logistics, and medical knowledge bases.</p>
            </div>
          </div>
        </div>
      `;
    } else {
      const d = ECOSYSTEM_DATA[id];
      content.innerHTML = `
        <div class="modal-case-study">
          <div class="badge-pill mb-2" style="background: ${d.color}22; color: ${d.color}; border: 1px solid ${d.color}55;">
            ${d.domain}
          </div>
          <h2>${d.title}</h2>
          <p class="text-cyan-400 font-mono text-sm mb-4">${d.headline}</p>

          <div class="metrics-grid mb-4">
            ${d.metrics.map(m => `
              <div class="metric-card">
                <span class="metric-val" style="color: ${d.color}">${m.value}</span>
                <span class="metric-lbl">${m.label}</span>
              </div>
            `).join('')}
          </div>

          <h3 class="text-lg font-bold text-white mb-2"><i class="fas fa-file-alt text-cyan-400 mr-2"></i>Executive Case Study & Implementation</h3>
          <p class="text-gray-300 mb-4 leading-relaxed">${d.caseStudy}</p>

          <h3 class="text-lg font-bold text-white mb-2"><i class="fas fa-project-diagram text-cyan-400 mr-2"></i>Production Architecture Blueprint</h3>
          <div class="p-3 bg-slate-900 rounded border border-slate-700 font-mono text-sm text-cyan-300 mb-4">
            ${d.architecture}
          </div>

          <h3 class="text-lg font-bold text-white mb-2"><i class="fas fa-layer-group text-cyan-400 mr-2"></i>Production Tech Stack</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            ${d.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
          </div>
        </div>
      `;
    }

    modal.classList.remove('hidden');
    if (window.soundFX) window.soundFX.playActivate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ecosystemHub = new EcosystemHub();
});
