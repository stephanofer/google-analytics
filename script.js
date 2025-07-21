// JavaScript para Café Luna - Funcionalidades de navegación e interactividad

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initScrollEffects();
    initFormValidation();
    initSmoothScrolling();
    initLoadingAnimations();
    initImageLazyLoading();
});

// === NAVEGACIÓN MÓVIL ===
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            // Toggle clase active en menú hamburguesa
            mobileMenu.classList.toggle('active');
            // Toggle clase active en menú de navegación
            navMenu.classList.toggle('active');
            
            // Prevenir scroll cuando el menú está abierto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// === EFECTOS DE SCROLL ===
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    // Efecto de navbar al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Animaciones al aparecer elementos en viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Añadir animación específica basada en clase
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                } else if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animation = 'slideInLeft 0.8s ease-out';
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .contact-card, .about-content, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// === VALIDACIÓN DE FORMULARIO ===
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        // Validación en tiempo real
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remover mensajes de error mientras el usuario escribe
                clearFieldError(this);
            });
        });
        
        // Validación al enviar formulario
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Simular envío de formulario exitoso
                showSuccessMessage();
            } else {
                // Hacer scroll al primer campo con error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Limpiar errores previos
    clearFieldError(field);
    
    // Validar campos requeridos
    if (isRequired && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Validaciones específicas por tipo
    if (value) {
        switch (fieldType) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Por favor, ingresa un email válido');
                    return false;
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(field, 'Por favor, ingresa un teléfono válido');
                    return false;
                }
                break;
        }
        
        // Validación de nombre (solo letras y espacios)
        if (field.name === 'firstName' || field.name === 'lastName') {
            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!nameRegex.test(value)) {
                showFieldError(field, 'Solo se permiten letras y espacios');
                return false;
            }
        }
        
        // Validación de mensaje mínimo
        if (field.name === 'message' && value.length < 10) {
            showFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }
    }
    
    // Campo válido
    field.classList.add('valid');
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    
    // Crear o actualizar mensaje de error
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    
    // Añadir estilos CSS para error si no existen
    if (!document.querySelector('#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
            }
            .valid {
                border-color: #28a745 !important;
            }
            .error-message {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function showSuccessMessage() {
    // Crear overlay de éxito
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const successBox = document.createElement('div');
    successBox.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    successBox.innerHTML = `
        <div style="color: #28a745; font-size: 3rem; margin-bottom: 1rem;">✓</div>
        <h3 style="color: #8B4513; margin-bottom: 1rem;">¡Mensaje Enviado!</h3>
        <p style="margin-bottom: 1.5rem;">Gracias por contactarnos. Te responderemos pronto.</p>
        <button onclick="this.closest('.success-overlay').remove()" 
                style="background: #8B4513; color: white; border: none; padding: 0.75rem 1.5rem; 
                       border-radius: 8px; cursor: pointer; font-size: 1rem;">
            Cerrar
        </button>
    `;
    
    overlay.className = 'success-overlay';
    overlay.appendChild(successBox);
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        successBox.style.transform = 'scale(1)';
    }, 10);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
    
    // Resetear formulario
    const form = document.querySelector('.contact-form');
    if (form) {
        form.reset();
        // Limpiar clases de validación
        form.querySelectorAll('.valid, .error').forEach(field => {
            field.classList.remove('valid', 'error');
        });
        form.querySelectorAll('.error-message').forEach(msg => msg.remove());
    }
}

// === SCROLL SUAVE ===
function initSmoothScrolling() {
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compensar navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Botón "Volver arriba" (se crea dinámicamente)
    createBackToTopButton();
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: var(--primary-color, #8B4513);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Mostrar/ocultar según scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(backToTop);
}

// === ANIMACIONES DE CARGA ===
function initLoadingAnimations() {
    // Animación de contadores (si hay números)
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    // Animación de aparición progresiva para grids
    const grids = document.querySelectorAll('.features-grid, .services-grid, .contact-grid');
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 segundos
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// === LAZY LOADING DE IMÁGENES ===
function initImageLazyLoading() {
    // Implementación de lazy loading nativo con fallback
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Si el navegador no soporta lazy loading nativo
    if ('loading' in HTMLImageElement.prototype) {
        // El navegador soporta lazy loading nativo
        return;
    }
    
    // Fallback para navegadores que no soportan lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        // Mover src a data-src para lazy loading manual
        if (img.src && !img.dataset.src) {
            img.dataset.src = img.src;
            img.src = '';
        }
        imageObserver.observe(img);
    });
}

// === FUNCIONALIDADES ADICIONALES ===

// Mostrar/ocultar elementos según el scroll
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });
    
    // CSS para elementos revelados
    if (!document.querySelector('#reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'reveal-styles';
        style.textContent = `
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Manejo de eventos de teclado para accesibilidad
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Cerrar menú móvil con Escape
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            const navMenu = document.getElementById('nav-menu');
            if (mobileMenu && navMenu && navMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initKeyboardNavigation();
});

// === UTILIDADES ===

// Función para detectar si es dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para debounce (optimizar eventos de scroll/resize)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar eventos de scroll y resize
window.addEventListener('scroll', debounce(() => {
    // Eventos de scroll optimizados aquí
}, 10));

window.addEventListener('resize', debounce(() => {
    // Cerrar menú móvil si se cambia a desktop
    if (!isMobile()) {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        if (mobileMenu && navMenu) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}, 250));

// === ANALYTICS Y TRACKING (OPCIONAL) ===

// Función para trackear interacciones del usuario
function trackEvent(category, action, label) {
    // Aquí se puede integrar con Google Analytics, Facebook Pixel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Trackear clicks en botones CTA
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('CTA', 'click', buttonText);
    }
});

// === SERVICE WORKER PARA PWA (OPCIONAL) ===

// Registrar service worker si está disponible
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}