document.addEventListener('DOMContentLoaded', () => {
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
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(currentIndex - 1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => showLightbox(currentIndex + 1));

        // Close lightbox on click outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
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
