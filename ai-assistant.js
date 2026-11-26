/**
 * ai-assistant.js - Interactive Conversational "AI Twin / Copilot"
 * Answers technical questions about architecture, 10+ years experience, MLOps, and career achievements.
 */

const KNOWLEDGE_BASE = [
  {
    keywords: ['experience', 'years', 'background', 'bio', 'who are you', 'tell me about yourself'],
    response: `I am **Dr. Alex Vance**, a **Principal AI/ML Architect & Senior Staff Engineer** with **10+ years of end-to-end production experience**. 

My core focus is designing distributed Deep Learning infrastructure, high-throughput LLM serving systems (vLLM / TensorRT-LLM), and mission-critical computer vision pipelines across Healthcare, FinTech, E-Commerce, and Industrial IoT. I have architected systems serving **250M+ daily inferences** with sub-10ms p95 latencies and hold 2 granted patents in distributed attention caching.`
  },
  {
    keywords: ['llm', 'generative ai', 'genai', 'vllm', 'rag', 'fine-tuning', 'qlora', 'pagedattention'],
    response: `In Generative AI, my production stack includes:
- **High-Throughput Serving:** Deployed vLLM with PagedAttention and continuous batching, achieving **10x throughput** over standard Hugging Face pipelines and cutting GPU memory fragmentation to <4%.
- **Speculative Decoding & Quantization:** Implemented Medusa speculative decoding and FP8 / AWQ 4-bit quantization, slashing per-token generation latency by 45%.
- **RAG & Agent Architectures:** Built hybrid dense-sparse RAG pipelines (BM25 + BGE embeddings) integrated with Milvus vector search, cross-encoder rerankers, and NeMo guardrails to eliminate hallucinations in regulated environments.`
  },
  {
    keywords: ['mlops', 'pipeline', 'infrastructure', 'triton', 'kubernetes', 'ray', 'feast'],
    response: `My production **MLOps & Infrastructure Blueprint** spans:
1. **Feature Store:** Feast with Redis for sub-5ms low-latency online inference and Delta Lake for offline time-travel training sets.
2. **Distributed Training:** PyTorch FSDP (Fully Sharded Data Parallel) + DeepSpeed ZeRO-3 on Ray clusters managing multi-node H100/A100 GPU clusters.
3. **Inference Fleet:** NVIDIA Triton Inference Server with dynamic batching, model ensembles, and TensorRT acceleration.
4. **Observability:** Prometheus, Grafana, and Evidently AI monitoring real-time KS-test distribution drift and embedding distance shift.`
  },
  {
    keywords: ['vision', 'computer vision', 'edge', 'yolo', 'jetson', 'tensorrt', 'defect'],
    response: `In Computer Vision & Edge AI:
- Deployed **quantized YOLOv10 and Swin-Transformer models** to NVIDIA Jetson AGX Orin modules for industrial assembly-line defect detection running at **240 FPS**.
- Leveraged **TensorRT INT8 calibration** with entropy minimizing criteria, retaining 99.8% of FP32 mAP while reducing device thermal dissipation to under 25W.
- In Healthcare, designed **3D Swin-UNETR** architectures for volumetric MRI tumor segmentation with 0.924 Dice coefficient across 42 partner clinical trial sites.`
  },
  {
    keywords: ['projects', 'featured', 'portfolio', 'built', 'work'],
    response: `Key highlight systems I have architected:
1. **OmniServe-LLM:** Ultra-low latency distributed LLM gateway serving 15,000 req/sec with dynamic KV-cache eviction.
2. **NeuroVision-Edge:** Industrial quality inspection system operating at 240 FPS on edge robotics.
3. **AuraHealth-RAG:** Multimodal clinical reasoning engine combining EHR time-series and radiologic imagery with HIPAA federated privacy.
4. **ChronoForecast-RL:** Reinforcement learning dynamic supply chain optimizer saving $8.6M in annual fuel & inventory costs.`
  },
  {
    keywords: ['hire', 'contact', 'consulting', 'interview', 'email', 'available'],
    response: `I am currently open to **Principal / Staff AI Architect roles, advisory consulting, and keynote speaking engagements**.

You can reach me directly via:
- 📧 **Email:** alex.vance.ai@nexus-intel.com
- 💼 **LinkedIn:** linkedin.com/in/alex-vance-ai
- 🐙 **GitHub:** github.com/alexvance-ai
- Or submit your inquiry directly in the **Contact Section / CLI Terminal** below!`
  }
];

class AIAssistant {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.input = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send-btn');
    this.isTyping = false;

    this.init();
  }

  init() {
    if (!this.input || !this.sendBtn) return;

    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    // Preset chips
    document.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.target.textContent.trim().replace(/^["']|["']$/g, '');
        if (this.input) {
          this.input.value = text;
          this.handleSend();
        }
      });
    });
  }

  handleSend() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;

    this.addMessage('user', text);
    this.input.value = '';
    if (window.soundFX) window.soundFX.playClick();

    this.isTyping = true;
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();
      const reply = this.generateResponse(text);
      this.addMessage('bot', reply);
      this.isTyping = false;
      if (window.soundFX) window.soundFX.playActivate();
    }, 650);
  }

  generateResponse(query) {
    const q = query.toLowerCase();
    for (const kb of KNOWLEDGE_BASE) {
      if (kb.keywords.some(k => q.includes(k))) {
        return kb.response;
      }
    }

    return `Thank you for asking about "${query}". As a Principal AI Architect with 10+ years of experience, my engineering philosophy revolves around **deterministic reliability, sub-millisecond efficiency, and measurable business ROI** rather than hype.

Feel free to ask me about:
- **LLM Serving & Quantization (vLLM / TensorRT-LLM / LoRA)**
- **Distributed Training Pipelines (PyTorch FSDP / Ray / DeepSpeed)**
- **Edge Computer Vision & Real-time Robotics**
- **Production MLOps (Feast / Triton / Evidently)**
- **My career journey and enterprise project case studies**`;
  }

  addMessage(sender, text) {
    if (!this.messagesContainer) return;
    const msgEl = document.createElement('div');
    msgEl.className = `chat-bubble chat-${sender}`;

    if (sender === 'bot') {
      // Parse markdown-like bold and bullet formatting
      const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br>• ')
        .replace(/\n\d+\. /g, '<br>✓ ')
        .replace(/\n/g, '<br>');
      msgEl.innerHTML = `
        <div class="chat-avatar bot-avatar"><i class="fas fa-brain"></i></div>
        <div class="chat-content">${formatted}</div>
      `;
    } else {
      msgEl.innerHTML = `
        <div class="chat-content">${this.escapeHtml(text)}</div>
        <div class="chat-avatar user-avatar"><i class="fas fa-user"></i></div>
      `;
    }

    this.messagesContainer.appendChild(msgEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    if (!this.messagesContainer) return;
    const ind = document.createElement('div');
    ind.id = 'chat-typing-indicator';
    ind.className = 'chat-bubble chat-bot';
    ind.innerHTML = `
      <div class="chat-avatar bot-avatar"><i class="fas fa-brain"></i></div>
      <div class="chat-content typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    this.messagesContainer.appendChild(ind);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const ind = document.getElementById('chat-typing-indicator');
    if (ind) ind.remove();
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.aiAssistant = new AIAssistant();
});
