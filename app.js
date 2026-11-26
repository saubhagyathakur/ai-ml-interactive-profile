/**
 * app.js - Main Application Orchestrator
 * Navigation, filter tabs, stats counting, contact validation, toast notices, and modal controllers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Toggle
  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.soundFX.toggle();
      audioBtn.innerHTML = isEnabled
        ? '<i class="fas fa-volume-up text-cyan-400"></i>'
        : '<i class="fas fa-volume-mute text-gray-500"></i>';
      showToast(isEnabled ? 'Audio Feedback Enabled' : 'Audio Muted');
    });
  }

  // 2. Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }

  // 3. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      if (window.soundFX) window.soundFX.playClick();
    });
  });

  // 4. Lab Tab Switching (Neural Playground / LLM Tokenizer / Vision Simulator / MLOps Drift)
  const labTabs = document.querySelectorAll('.lab-tab-btn');
  const labPanels = document.querySelectorAll('.lab-panel');

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      labTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target');
      labPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });

      if (window.soundFX) window.soundFX.playClick();
    });
  });

  // 5. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-message').value.trim();

      if (!name || !email || !msg) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Simulated success
      if (window.soundFX) window.soundFX.playSuccess();
      showToast(`Thank you, ${name}! Your transmission has been queued for Dr. Vance.`);
      contactForm.reset();
    });
  }

  // 6. Resume Modal Controller
  const cvBtn = document.getElementById('btn-download-cv');
  const cvModal = document.getElementById('cv-modal');
  const closeCvBtn = document.getElementById('close-cv-modal');

  if (cvBtn && cvModal) {
    cvBtn.addEventListener('click', () => {
      cvModal.classList.remove('hidden');
      if (window.soundFX) window.soundFX.playActivate();
    });
  }

  if (closeCvBtn && cvModal) {
    closeCvBtn.addEventListener('click', () => {
      cvModal.classList.add('hidden');
    });
  }

  // 7. Stats Counter Observer
  const statsElements = document.querySelectorAll('.counter-val');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statsElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('system-metrics');
  if (statsSection) statsObserver.observe(statsSection);

  // 8. Hover Sound Effects for all interactive buttons
  document.querySelectorAll('button, .btn, .nav-link, .interactive-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.soundFX) window.soundFX.playHover();
    });
  });
});

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-exclamation-triangle text-red-400' : 'fa-check-circle text-cyan-400'} mr-2"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global resume printer/exporter
function exportResumePDF() {
  window.print();
}

function exportResumeJSON() {
  const resumeData = {
    name: "Dr. Alex Vance",
    title: "Principal AI/ML Architect & Senior Staff Engineer",
    experience: "10+ Years",
    patents: [
      "US Patent 11,842,910: Distributed Key-Value Cache Eviction for Paged Transformer Attention",
      "US Patent 11,490,211: Ultra-Low Power Temporal Graph Convolutional Anomaly Detectors"
    ],
    topSkills: ["vLLM", "TensorRT-LLM", "PyTorch", "Ray", "Triton", "Kubernetes", "MONAI", "YOLOv10"],
    publications: [
      "NeurIPS 2024: Speculative Verification via Latent Draft Trees in Edge Transformers",
      "ICLR 2023: Zero-Shot Counterfactual Alignment for Multi-Modal Medical RAG"
    ],
    contact: {
      email: "alex.vance.ai@nexus-intel.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  };

  const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Alex_Vance_Principal_AI_Architect_Profile.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('JSON-LD AI Profile downloaded successfully');
}
