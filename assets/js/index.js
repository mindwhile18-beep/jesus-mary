document.addEventListener('DOMContentLoaded', () => {
    // 0. Hero Image Automatic & Interactive Slider
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.slide');
        const prevBtn = document.getElementById('sliderPrev');
        const nextBtn = document.getElementById('sliderNext');
        const dotsContainer = document.getElementById('sliderDots');
        let currentSlide = 0;
        let slideInterval;

        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => { goToSlide(idx); resetTimer(); });
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

        const goToSlide = (n) => {
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        const startTimer = () => {
            slideInterval = setInterval(nextSlide, 3500);
        };

        const resetTimer = () => {
            clearInterval(slideInterval);
            startTimer();
        };

        startTimer();
    }

    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // 2. Header Scroll Styling & Active Link Highlighting
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(lnk => lnk.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    // 3. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const text = stat.innerText;
            const isPercent = text.includes('%');
            const isPlus = text.includes('+');
            
            let count = 0;
            const speed = target / 50; // increment rate

            const updateCount = () => {
                if (count < target) {
                    count += Math.ceil(speed);
                    if (count > target) count = target;
                    stat.innerText = count + (isPercent ? '%' : '') + (isPlus ? '+' : '');
                    setTimeout(updateCount, 30);
                } else {
                    stat.innerText = target + (isPercent ? '%' : '') + (isPlus ? '+' : '');
                }
            };
            updateCount();
        });
    };

    const handleScrollForStats = () => {
        const statsSection = document.querySelector('.quick-stats');
        if (!statsSection) return;
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight - 50;

        if (sectionPos < screenPos && !animated) {
            animateStats();
            animated = true;
            window.removeEventListener('scroll', handleScrollForStats);
        }
    };

    window.addEventListener('scroll', handleScrollForStats);
    // Call once in case stats section is already in view on load
    handleScrollForStats();

    // 4. Gallery Lightbox Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (lightbox && galleryItems.length > 0 && lightboxImg && lightboxClose) {
        let currentIndex = 0;
        const galleryData = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            title: item.getAttribute('data-title'),
            desc: item.getAttribute('data-desc')
        }));

        const showLightbox = (index) => {
            if (index < 0) index = galleryData.length - 1;
            if (index >= galleryData.length) index = 0;
            
            currentIndex = index;
            lightboxImg.src = galleryData[currentIndex].src;
            lightboxTitle.innerText = galleryData[currentIndex].title;
            lightboxDesc.innerText = galleryData[currentIndex].desc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent scrolling
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                showLightbox(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        const lightboxCardClose = document.getElementById('lightboxCardClose');
        const lightboxBottomClose = document.getElementById('lightboxBottomClose');
        if (lightboxCardClose) lightboxCardClose.addEventListener('click', closeLightbox);
        if (lightboxBottomClose) lightboxBottomClose.addEventListener('click', closeLightbox);
        
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(currentIndex - 1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => showLightbox(currentIndex + 1));

        // Close lightbox on click outside the image container
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Keyboard support for Lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
            if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
        });
    }

    // 5. Inquiry Form Submission handling
    const inquiryForm = document.getElementById('inquiryForm');
    const formSuccess = document.getElementById('formSuccess');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather values (can be used for further integration, e.g. EmailJS or a database)
            const parentName = document.getElementById('parentName').value;
            const studentName = document.getElementById('studentName').value;
            const grade = document.getElementById('grade').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            console.log('Admission Inquiry Submitted:', {
                parentName,
                studentName,
                grade,
                phone,
                message,
                submittedAt: new Date().toISOString()
            });

            // Show success message
            inquiryForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');

            // Reset form
            inquiryForm.reset();

            // Bring back the form after 5 seconds (just in case they want to submit another inquiry)
            setTimeout(() => {
                formSuccess.classList.add('hidden');
                inquiryForm.classList.remove('hidden');
            }, 5000);
        });
    }
});

// 6. YouTube IFrame API Autoplay & Mute/Unmute Handler
window.ytPlayers = {};

window.onYouTubeIframeAPIReady = function() {
    document.querySelectorAll('.video-responsive iframe').forEach(function(iframe, idx) {
        var playerId = iframe.id || ('ytPlayer_' + (idx + 1));
        iframe.id = playerId;
        if (typeof YT !== 'undefined' && YT.Player) {
            window.ytPlayers[playerId] = new YT.Player(playerId, {
                events: {
                    'onReady': function(event) {
                        try {
                            event.target.mute();
                            event.target.playVideo();
                        } catch (err) {
                            console.log('YouTube autoplay init:', err);
                        }
                    }
                }
            });
        }
    });
};

// Toggle Unmute / Mute for YouTube Players directly on website
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.unmute-btn');
    if (!btn) return;
    
    const playerId = btn.getAttribute('data-player-id');
    const player = window.ytPlayers[playerId];
    
    if (player && typeof player.isMuted === 'function') {
        if (player.isMuted()) {
            player.unMute();
            player.playVideo();
            btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Sound On (Playing with Audio)';
            btn.classList.add('sound-on');
        } else {
            player.mute();
            btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Muted - Click for Sound';
            btn.classList.remove('sound-on');
        }
    } else {
        // Fallback if API hasn't ready event bound yet: swap mute parameter in iframe URL
        const iframe = document.getElementById(playerId);
        if (iframe) {
            const currentSrc = iframe.src;
            if (currentSrc.includes('mute=1')) {
                iframe.src = currentSrc.replace('mute=1', 'mute=0');
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Sound On (Playing with Audio)';
                btn.classList.add('sound-on');
            } else if (currentSrc.includes('mute=0')) {
                iframe.src = currentSrc.replace('mute=0', 'mute=1');
                btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Muted - Click for Sound';
                btn.classList.remove('sound-on');
            } else {
                iframe.src += '&mute=0';
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Sound On (Playing with Audio)';
                btn.classList.add('sound-on');
            }
        }
    }
});

// 7. Mobile App UI Interactive Handlers (Drawer, Bottom Nav, Portal Sheet & PWA Install)

// Global Mobile App Portal helper
window.openMobileAppPortal = function(tabName) {
    const portalModal = document.getElementById('portalModal');
    const portalOverlay = document.getElementById('portalModalOverlay');
    if (!portalModal || !portalOverlay) return;

    portalModal.classList.add('active');
    portalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (tabName && tabName !== 'all') {
        const tabBtn = document.querySelector(`.modal-tab-btn[data-tab="tab-${tabName}"]`);
        if (tabBtn) tabBtn.click();
    }
};

window.closeMobileAppPortal = function() {
    const portalModal = document.getElementById('portalModal');
    const portalOverlay = document.getElementById('portalModalOverlay');
    if (portalModal) portalModal.classList.remove('active');
    if (portalOverlay) portalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
};

document.addEventListener('DOMContentLoaded', () => {
    // A. Mobile Side Drawer
    const mobileAppDrawer = document.getElementById('mobileAppDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const mobileToggle = document.getElementById('mobileToggle');

    const openDrawer = () => {
        if (mobileAppDrawer && drawerOverlay) {
            mobileAppDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeDrawer = () => {
        if (mobileAppDrawer && drawerOverlay) {
            mobileAppDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when link clicked
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // B. Mobile Portal Modal & Tabs
    const portalModalClose = document.getElementById('portalModalClose');
    const portalOverlay = document.getElementById('portalModalOverlay');
    const openMobilePortalBtn = document.getElementById('openMobilePortalBtn');
    const bottomNavPortalBtn = document.getElementById('bottomNavPortalBtn');

    if (portalModalClose) portalModalClose.addEventListener('click', closeMobileAppPortal);
    if (portalOverlay) portalOverlay.addEventListener('click', closeMobileAppPortal);
    if (openMobilePortalBtn) openMobilePortalBtn.addEventListener('click', () => openMobileAppPortal('notices'));
    if (bottomNavPortalBtn) bottomNavPortalBtn.addEventListener('click', () => openMobileAppPortal('all'));

    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    const tabPanes = document.querySelectorAll('.modal-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const pane = document.getElementById(tabId);
            if (pane) pane.classList.add('active');
        });
    });

    // C. Bottom Navigation Scroll Sync & Active Highlight
    const bottomNavTabs = document.querySelectorAll('.mobile-bottom-nav .nav-tab:not(#bottomNavPortalBtn)');
    const pageSections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        pageSections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                bottomNavTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.getAttribute('data-target') === sectionId) {
                        tab.classList.add('active');
                    }
                });
            }
        });
    });

    // D. PWA Installation Event Listener
    let deferredPrompt;
    const pwaBanner = document.getElementById('pwaBanner');
    const pwaInstallBtn = document.getElementById('pwaInstallBtn');
    const pwaCloseBtn = document.getElementById('pwaCloseBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (pwaBanner) pwaBanner.style.display = 'flex';
    });

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                deferredPrompt = null;
                if (pwaBanner) pwaBanner.style.display = 'none';
            } else {
                alert('To install the JMJ Mobile App, tap your browser menu (⋮ or share button) and select "Add to Home Screen".');
            }
        });
    }

    if (pwaCloseBtn) {
        pwaCloseBtn.addEventListener('click', () => {
            if (pwaBanner) pwaBanner.style.display = 'none';
        });
    }

    // E. Touch Swipe Gesture Support for Stories & Hero Slider
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSliderElem = document.getElementById('heroSlider');

    if (heroSliderElem) {
        heroSliderElem.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSliderElem.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const nextBtn = document.getElementById('sliderNext');
            const prevBtn = document.getElementById('sliderPrev');
            if (touchEndX < touchStartX - 40 && nextBtn) nextBtn.click();
            if (touchEndX > touchStartX + 40 && prevBtn) prevBtn.click();
        };
    }
});

