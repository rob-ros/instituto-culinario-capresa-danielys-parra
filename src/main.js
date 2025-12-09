/**
 * Instituto Culinario Aurora - JavaScript
 * Interactividad: menú móvil, tabs, carrusel, formulario
 */

document.addEventListener('DOMContentLoaded', function() {
  // =========================================================================
  // Toggle del menú móvil
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
      mainNav.classList.toggle('active');
      
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
    });
  }

  // =========================================================================
  // Tabs de cursos
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('aria-controls');
      
      // Actualizar estados de los tabs
      tabButtons.forEach(function(btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      this.setAttribute('tabindex', '0');
      
      // Mostrar/ocultar paneles
      tabPanels.forEach(function(panel) {
        if (panel.id === targetId) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });

    // Navegación con teclado
    button.addEventListener('keydown', function(e) {
      const currentIndex = Array.from(tabButtons).indexOf(this);
      let newIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabButtons.length - 1;
      }

      if (newIndex !== undefined) {
        tabButtons[newIndex].click();
        tabButtons[newIndex].focus();
      }
    });
  });

  // =========================================================================
  // Carrusel de galería
  // =========================================================================
  const carousel = document.querySelector('.carousel');
  
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
      // Mover el track
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      
      // Actualizar indicadores
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === currentIndex);
        indicator.setAttribute('aria-selected', index === currentIndex);
      });
      
      // Actualizar aria-labels de los slides
      slides.forEach(function(slide, index) {
        slide.setAttribute('aria-label', (index + 1) + ' de ' + totalSlides);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      updateCarousel();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    indicators.forEach(function(indicator, index) {
      indicator.addEventListener('click', function() {
        goToSlide(index);
      });
    });

    // Navegación con teclado
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });

    // Auto-play opcional (cada 5 segundos)
    let autoPlayInterval;
    
    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    // Pausar al hover o focus
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('focusin', stopAutoPlay);
    carousel.addEventListener('focusout', startAutoPlay);

    // Iniciar autoplay
    startAutoPlay();
  }

  // =========================================================================
  // Botón "Volver arriba"
  // =========================================================================
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // Formulario de contacto (simulación de envío)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validación básica
      const nombre = document.getElementById('nombre');
      const correo = document.getElementById('correo');
      const mensaje = document.getElementById('mensaje');
      
      let isValid = true;

      // Validar nombre
      if (!nombre.value.trim() || nombre.value.trim().length < 2) {
        setError(nombre, 'Por favor, ingresa tu nombre completo.');
        isValid = false;
      } else {
        clearError(nombre);
      }

      // Validar correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correo.value.trim() || !emailRegex.test(correo.value.trim())) {
        setError(correo, 'Por favor, ingresa un correo electrónico válido.');
        isValid = false;
      } else {
        clearError(correo);
      }

      // Validar mensaje
      if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
        setError(mensaje, 'El mensaje debe tener al menos 10 caracteres.');
        isValid = false;
      } else {
        clearError(mensaje);
      }

      if (!isValid) {
        return;
      }

      // Simular envío
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      // Simulación de espera (1.2 segundos)
      setTimeout(function() {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Enviar mensaje';
        
        // Mostrar mensaje de éxito
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Mensaje enviado correctamente. Te contactaremos pronto.';
        
        // Resetear formulario
        contactForm.reset();
        
        // Anunciar para lectores de pantalla
        formStatus.setAttribute('role', 'alert');
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(function() {
          formStatus.className = 'form-status';
          formStatus.removeAttribute('role');
        }, 5000);
        
      }, 1200);
    });

    function setError(input, message) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.form-error');
      input.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
      }
    }

    function clearError(input) {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup.querySelector('.form-error');
      input.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }

    // Limpiar errores al escribir
    const formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach(function(input) {
      input.addEventListener('input', function() {
        clearError(this);
      });
    });
  }

  // =========================================================================
  // Smooth scroll para enlaces internos
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Mover foco al elemento para accesibilidad
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });

  // =========================================================================
  // Header scroll effect
  // =========================================================================
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
  
  // =========================================================================
  // Videos (carrusel simple a partir de la lista .video-data)
  // =========================================================================
  (function() {
    const dataItems = document.querySelectorAll('.video-data li');
    const videoPlayer = document.getElementById('videoPlayer');
    const captionEl = document.getElementById('videoCaption');
    const dotsContainer = document.querySelector('.video-dots');
    const prevBtn = document.querySelector('.video-prev');
    const nextBtn = document.querySelector('.video-next');
    const thumbsContainer = document.querySelector('.video-thumbs');

    if (!videoPlayer || !dataItems.length) return;

    const videos = Array.from(dataItems).map(function(li) {
      return { src: li.dataset.src, text: li.dataset.text };
    });

    let current = 0;

    function updateUI() {
      if (captionEl) captionEl.textContent = videos[current].text || '';
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.video-dot');
        dots.forEach(function(d,i){ d.classList.toggle('active', i===current); d.setAttribute('aria-selected', i===current); });
      }
      if (thumbsContainer) {
        var thumbs = thumbsContainer.querySelectorAll('.video-thumb');
        thumbs.forEach(function(t,i){ t.classList.toggle('active', i===current); });
      }
    }

    function load(index) {
      current = (index + videos.length) % videos.length;
      try { videoPlayer.pause(); } catch(e) {}
      videoPlayer.src = videos[current].src;
      try { videoPlayer.load(); } catch(e) {}
      updateUI();
    }

    // Create state overlay (play/pause button + badge)
    const stage = document.querySelector('.video-stage');
    if (stage) {
      const overlay = document.createElement('div');
      overlay.className = 'state-overlay';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-state';
      btn.setAttribute('aria-label', 'Reproducir video');
      btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';

      const badge = document.createElement('div');
      badge.className = 'state-badge';
      badge.textContent = 'Pausado';
      badge.style.opacity = '1';

      overlay.appendChild(btn);
      overlay.appendChild(badge);
      stage.appendChild(overlay);

      // Toggle play/pause when clicking overlay button
      btn.addEventListener('click', function() {
        if (videoPlayer.paused) {
          videoPlayer.play();
        } else {
          videoPlayer.pause();
        }
      });

      // Allow clicking on the stage or video to toggle play/pause.
      // Ignore clicks on controls (progress, dots, thumbs, buttons).
      function togglePlay() {
        if (videoPlayer.paused) {
          videoPlayer.play();
        } else {
          videoPlayer.pause();
        }
      }

      stage.addEventListener('click', function(e) {
        // if click happened inside an interactive control, ignore
        if (e.target.closest('.btn-state') || e.target.closest('.video-controls') || e.target.closest('.video-dot') || e.target.closest('.video-thumb') || e.target.closest('.progress-range')) {
          return;
        }
        // toggle when clicking anywhere on the stage (including the video)
        togglePlay();
      });

      // Also allow direct clicks on the video element (in case event propagation differs)
      videoPlayer.addEventListener('click', function(e) {
        if (e.target.closest('.video-controls') || e.target.closest('.progress-range')) return;
        togglePlay();
      });

      // Track if user has explicitly started playback at least once.
      let hasBeenPlayed = false;
      // Track if we auto-paused due to leaving viewport
      let wasAutoPaused = false;

      videoPlayer.addEventListener('play', function() {
        hasBeenPlayed = true;
        wasAutoPaused = false;
        stage.classList.add('playing');
        btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        btn.setAttribute('aria-label', 'Pausar video');
        badge.textContent = 'Reproduciendo';
      });

      videoPlayer.addEventListener('pause', function() {
        stage.classList.remove('playing');
        btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        btn.setAttribute('aria-label', 'Reproducir video');
        badge.textContent = 'Pausado';
      });

      videoPlayer.addEventListener('ended', function() {
        stage.classList.remove('playing');
        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"></path><polyline points="9 6 15 12 9 18"></polyline></svg>';
        btn.setAttribute('aria-label', 'Reproducir de nuevo');
        badge.textContent = 'Finalizado';
      });

      // When metadata loads, detect orientation for responsive styling
      videoPlayer.addEventListener('loadedmetadata', function() {
        try {
          const isPortrait = videoPlayer.videoHeight > videoPlayer.videoWidth;
          if (isPortrait) {
            stage.classList.add('is-portrait');
          } else {
            stage.classList.remove('is-portrait');
          }
        } catch (e) {}
      }, { once: false });

      // IntersectionObserver: pause when leaving viewport, resume when returning
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (!hasBeenPlayed) return; // only apply auto pause/resume after user played once

            if (entry.intersectionRatio < 0.5) {
              // left view: if playing, pause and mark as auto-paused
              if (!videoPlayer.paused) {
                try { videoPlayer.pause(); wasAutoPaused = true; } catch(e) {}
              }
            } else {
              // back in view: if we auto-paused earlier, resume
              if (wasAutoPaused) {
                try { videoPlayer.play(); wasAutoPaused = false; } catch(e) {}
              }
            }
          });
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

        try { io.observe(stage); } catch(e) {}
      }
    }

    // construir dots
    if (dotsContainer) {
      videos.forEach(function(v,i){
        var btn = document.createElement('button');
        btn.className = 'video-dot';
        btn.setAttribute('aria-label','Ir a video ' + (i+1));
        btn.setAttribute('aria-selected', i===0 ? 'true':'false');
        btn.addEventListener('click', function(){ load(i); });
        dotsContainer.appendChild(btn);
      });
    }

    // construir miniaturas
    if (thumbsContainer) {
      videos.forEach(function(v,i){
        var div = document.createElement('div');
        div.className = 'video-thumb';
        div.tabIndex = 0;
        var thumb = document.createElement('video');
        thumb.src = v.src;
        thumb.muted = true;
        thumb.preload = 'metadata';
        thumb.setAttribute('aria-hidden','true');
        div.appendChild(thumb);
        var label = document.createElement('div');
        label.className = 'thumb-label';
        label.textContent = v.text || '';
        div.appendChild(label);
        div.addEventListener('click', function(){ load(i); });
        div.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(i); }});
        // autoplay muted preview on hover/focus
        div.addEventListener('mouseenter', function() {
          try { thumb.currentTime = 0; thumb.muted = true; thumb.play(); } catch(e) {}
        });
        div.addEventListener('mouseleave', function() {
          try { thumb.pause(); thumb.currentTime = 0; } catch(e) {}
        });
        div.addEventListener('focus', function() { try { thumb.currentTime = 0; thumb.muted = true; thumb.play(); } catch(e) {} });
        div.addEventListener('blur', function() { try { thumb.pause(); thumb.currentTime = 0; } catch(e) {} });

        thumbsContainer.appendChild(div);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function(){ load(current-1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ load(current+1); });

    // cargar inicial
    load(0);

    // --- CUSTOM PROGRESS BAR (desktop) ---
    const progressWrap = document.createElement('div');
    progressWrap.className = 'video-progress';
    const range = document.createElement('input');
    range.type = 'range';
    range.min = 0;
    range.max = 1000;
    range.value = 0;
    range.className = 'progress-range';
    const timeLabels = document.createElement('div');
    timeLabels.className = 'time-labels';
    const currentLabel = document.createElement('span'); currentLabel.textContent = '0:00';
    const totalLabel = document.createElement('span'); totalLabel.textContent = '0:00';
    timeLabels.appendChild(currentLabel); timeLabels.appendChild(totalLabel);
    progressWrap.appendChild(range); progressWrap.appendChild(timeLabels);
    if (stage && stage.parentNode) {
      stage.parentNode.insertBefore(progressWrap, stage.nextSibling);
    }

    function formatTime(s){
      if (!isFinite(s)) return '0:00';
      const m = Math.floor(s/60); const sec = Math.floor(s%60); return m + ':' + (sec<10?('0'+sec):sec);
    }

    // sync progress with videoPlayer
    videoPlayer.addEventListener('timeupdate', function(){
      if (!isFinite(videoPlayer.duration)) return;
      const pct = (videoPlayer.currentTime / videoPlayer.duration) * 1000;
      range.value = Math.round(pct);
      currentLabel.textContent = formatTime(videoPlayer.currentTime);
    });

    videoPlayer.addEventListener('loadedmetadata', function(){
      totalLabel.textContent = formatTime(videoPlayer.duration);
      // initial detection for portrait handled earlier; also set native controls depending on viewport
      handleControlsMode();
    });

    range.addEventListener('input', function(){
      if (!isFinite(videoPlayer.duration)) return;
      const t = (range.value/1000) * videoPlayer.duration;
      currentLabel.textContent = formatTime(t);
    });

    range.addEventListener('change', function(){
      if (!isFinite(videoPlayer.duration)) return;
      const t = (range.value/1000) * videoPlayer.duration;
      videoPlayer.currentTime = t;
    });

    // toggle between native controls (mobile) and custom (desktop)
    const mq = window.matchMedia('(min-width: 768px)');
    function handleControlsMode(){
      if (mq.matches) {
        // desktop: hide native controls and show custom progress
        videoPlayer.controls = false;
        if (progressWrap) progressWrap.style.display = 'flex';
      } else {
        videoPlayer.controls = true;
        if (progressWrap) progressWrap.style.display = 'none';
      }
    }
    mq.addEventListener ? mq.addEventListener('change', handleControlsMode) : mq.addListener(handleControlsMode);
    handleControlsMode();
  })();

});
