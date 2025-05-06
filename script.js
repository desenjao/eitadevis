  // Inicialização do AOS (animações)
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true
});

// === Gerenciamento de Modais ===
const modals = {
    info: document.getElementById('info-modal'),
    form: document.getElementById('form-modal')
};

const modalElements = {
    info: {
        title: document.getElementById('modal-title'),
        description: document.getElementById('modal-description'),
        whatsapp: document.getElementById('modal-whatsapp')
    },
    form: {
        form: document.getElementById('diagnostic-form')
    }
};

// Função para abrir modal
function openModal(modalId, data = {}) {
    const modal = modals[modalId];
    if (!modal) return;

    if (modalId === 'info' && data) {
        modalElements.info.title.textContent = data.title || '';
        modalElements.info.description.textContent = data.desc || '';
        modalElements.info.whatsapp.href = `https://wa.me/5589981202147?text=${encodeURIComponent(data.whatsapp || '')}`;
    }

    modal.classList.add('show');
    modal.style.display = 'flex';
}

// Função para fechar modal
function closeModal(modalId) {
    const modal = modals[modalId];
    if (!modal) return;

    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

// Event listeners para botões de fechar
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.closest('.modal').id.split('-')[0];
        closeModal(modalId);
    });
});

// Event listeners para botões com data-modal
document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.dataset.modal;
        const modalData = {
            title: btn.dataset.title,
            desc: btn.dataset.desc,
            whatsapp: btn.dataset.whatsapp
        };
        openModal(modalId, modalData);
    });
});

// Envio do formulário
modalElements.form.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(modalElements.form.form);
    const message = `Diagnóstico Gratuito:\nNome: ${formData.get('name')}\nTelefone: ${formData.get('phone')}\nNegócio: ${formData.get('business')}\nDesafio: ${formData.get('challenge')}`;
    window.location.href = `https://wa.me/5589981202147?text=${encodeURIComponent(message)}`;
    closeModal('form');
    modalElements.form.form.reset();
});

// === Animação do Canvas (Matrix) ===
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 12;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(0);
const isMobile = window.innerWidth <= 768;
const maxDrops = isMobile ? Math.floor(columns * 0.4) : columns;

let scrollSpeedFactor = 0;

function draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#007bff';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < Math.min(drops.length, maxDrops); i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
            drops[i] = 0;
        }

        drops[i] += 0.5 + scrollSpeedFactor;
    }

    requestAnimationFrame(draw);
}

let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollDelta = Math.abs(scrollY - lastScrollY);
    scrollSpeedFactor = Math.min(scrollDelta / 150, 1.5);
    lastScrollY = scrollY;
});

draw();