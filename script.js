/**
 * JSON data for events
 */
const kimbiaEvents = [
    {
        id: 1,
        date: "2026-03-14", // Past Event
        title: "World Kidney Day",
        description: "A community awareness run promoting kidney health and wellness.",
        location: "Eldoret Sports Club",
        sponsors: ["hospital-logo.png"],
        isFeatured: false
    },
    {
        id: 2,
        date: "2026-03-28", // Future Event - Next Saturday
        title: "Eldoret Morning Run",
        description: "Join us for a refreshing morning run through Eldoret's scenic routes. All paces welcome!",
        location: "Rupa's Mall, Eldoret",
        sponsors: ["sponsor1.png", "sponsor2.png"],
        isFeatured: false
    },
    {
        id: 3,
        date: "2026-04-04", // Future Event
        title: "Fauna and Kimmy Run",
        description: "Come cheer for our talented runners! Fauna will be running the 10K, while Kimmy takes on the half marathon. Let's show our support!",
        location: "Naiorbi city",
        sponsors: ["trail-logo.png", "sports-brand.png"],
        isFeatured: false
    }
];

/**
 * Kimbia Eldoret - Final JavaScript File
 * Professional running club website with performance optimizations
 */

// ============================================
// GLOBAL VARIABLES
// ============================================
let totalRunners = 200; // Starting value for runners counter

// ============================================
// WAIT FOR DOM TO LOAD COMPLETELY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollReveal();
    initStatsCounter();
    initScrollToTop();
    initImageCarousel();
    initCalendarMobileView();
    initFaqAccordion();
    initEventRendering(); // NEW: Render events from JSON
    initSponsorLoop(); // Initialize sponsor infinite loop
    updateWeeksCounter(); // Calculate weeks from Jan 10, 2026
});

// ============================================
// EVENT RENDERING FUNCTION - Filters only future events
// ============================================
function initEventRendering() {
    const featuredHook = document.getElementById('featured-event-hook');
    const eventsSection = document.getElementById('events');

    if (!featuredHook) return;

    // Clear existing content
    featuredHook.innerHTML = '';

    // Get today's date (set to start of day for accurate comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort events by date (upcoming first)
    const sortedEvents = [...kimbiaEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Loop through events and render ONLY future events
    sortedEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const isPast = eventDate < today;

        // Skip past events - only show future events
        if (isPast) return;

        const formattedDate = formatEventDate(event.date);

        // All events go to featured hook (single container)
        const eventCard = createEventCard(event, formattedDate, false);
        featuredHook.appendChild(eventCard);
    });

    // If no future events found, hide the entire events section
    if (featuredHook.children.length === 0) {
        if (eventsSection) {
            eventsSection.style.display = 'none';
        }
    } else {
        // Ensure section is visible if there are events
        if (eventsSection) {
            eventsSection.style.display = 'block';
        }
    }
}

// Helper function to format date
function formatEventDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to create event card
function createEventCard(event, formattedDate, isPast) {
    const card = document.createElement('div');
    card.className = 'event-card';
    if (isPast) card.classList.add('past-event');

    const title = document.createElement('h3');
    title.textContent = event.title;

    const dateElem = document.createElement('div');
    dateElem.className = 'event-date';
    dateElem.textContent = formattedDate;

    const description = document.createElement('p');
    description.className = 'event-description';
    description.textContent = event.description || 'Join us for this exciting community event!';

    const location = document.createElement('div');
    location.className = 'event-location';
    location.innerHTML = `<span>📍</span> ${event.location || 'Eldoret, Kenya'}`;

    card.appendChild(title);
    card.appendChild(dateElem);
    card.appendChild(description);
    card.appendChild(location);

    return card;
}

// ============================================
// SPONSOR LOOP CLONING - Seamless infinite scroll
// ============================================
function initSponsorLoop() {
    const sponsorContainer = document.querySelector('.sponsor-loop-container');
    const sponsorTrack = document.querySelector('.sponsor-track');

    if (!sponsorContainer || !sponsorTrack) return;

    // Get all sponsor logo images
    const logos = Array.from(sponsorTrack.children);
    const logoCount = logos.length;

    if (logoCount === 0) return;

    // Clone logos to create seamless infinite loop
    // Clone first few logos and append to end
    for (let i = 0; i < Math.min(4, logoCount); i++) {
        const clone = logos[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        sponsorTrack.appendChild(clone);
    }

    // Clone last few logos and prepend to beginning for smooth reverse transition
    for (let i = logoCount - 1; i >= Math.max(0, logoCount - 4); i--) {
        const clone = logos[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        sponsorTrack.insertBefore(clone, sponsorTrack.firstChild);
    }

    // Calculate total number of logos after cloning
    const totalLogos = sponsorTrack.children.length;

    // Adjust animation duration based on number of logos
    const baseDuration = 25; // seconds for 5 logos
    const duration = (totalLogos / 5) * baseDuration;

    // Calculate scroll distance based on logo width
    const firstLogo = sponsorTrack.children[0];
    const logoWidth = firstLogo ? firstLogo.offsetWidth : 120;
    const gap = 40; // gap between logos from CSS
    const scrollDistance = (logoWidth + gap) * (totalLogos / 2);

    // Create dynamic keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes sponsorScrollDynamic {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-${scrollDistance}px);
            }
        }
        .sponsor-track {
            animation: sponsorScrollDynamic ${duration}s linear infinite !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Apply the animation to the track
    sponsorTrack.style.animation = `sponsorScrollDynamic ${duration}s linear infinite`;

    // Pause animation when not visible to save performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sponsorTrack.style.animationPlayState = 'running';
            } else {
                sponsorTrack.style.animationPlayState = 'paused';
            }
        });
    }, { threshold: 0.1 });

    observer.observe(sponsorContainer);
}

// ============================================
// MOBILE MENU LOGIC - Updated for dropdown toggle
// ============================================
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Only run if elements exist
    if (!mobileToggle || !navMenu) return;

    // Function to close mobile menu
    const closeMobileMenu = () => {
        navMenu.classList.remove('active');
        mobileToggle.textContent = '☰';
        document.body.style.overflow = ''; // Restore scroll

        // Also close any open dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    };

    // Toggle menu when hamburger icon is clicked
    mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');

        // Change hamburger icon text based on menu state
        mobileToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when any regular nav link is clicked (not dropdown parents on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Check if the clicked link is a main category with a dropdown (e.g., "Our Tribe")
            const isDropdownParent = this.parentElement.classList.contains('dropdown');

            // On mobile (968px or less), if clicking a parent category, 
            // toggle the dropdown instead of closing the menu
            if (isDropdownParent && window.innerWidth <= 968) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
                return; // Don't close the menu
            }

            // For regular links (Home, Shop, Contact) OR sub-links (About Us, Rules),
            // close the menu and navigate to the section.
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // Handle dropdown toggles on mobile (alternative method)
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS - Fixed for dropdowns with 90px offset
// ============================================
function initSmoothScrolling() {
    // Select all links that point to sections on the same page
    // This includes dropdown links, nav links, and footer links
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // Check if this is a dropdown parent link on mobile (shouldn't scroll)
            const isDropdownParent = this.parentElement?.classList.contains('dropdown');
            if (isDropdownParent && window.innerWidth <= 968) {
                // On mobile, dropdown parent links should only toggle the dropdown, not scroll
                return;
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Fixed offset for sticky nav - 90px to account for nav height + spacing
                const navOffset = 90;

                // Calculate target position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navOffset;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);

                // Close mobile menu if open (ensuring dropdown links work)
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.querySelector('.mobile-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileToggle) mobileToggle.textContent = '☰';
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ============================================
// FAQ ACCORDION LOGIC - Robust toggle with proper class management
// ============================================
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent any default button behavior

            // Get the current answer element (next sibling)
            const answer = this.nextElementSibling;

            // Check if this FAQ is currently expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle the current FAQ
            if (!isExpanded) {
                // Open this FAQ
                this.setAttribute('aria-expanded', 'true');
                this.classList.add('active');
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';

                // Update icon to minus
                const icon = this.querySelector('.faq-icon');
                if (icon) {
                    icon.textContent = '−';
                    icon.style.transform = 'rotate(0deg)';
                }
            } else {
                // Close this FAQ
                this.setAttribute('aria-expanded', 'false');
                this.classList.remove('active');
                answer.classList.remove('active');
                answer.style.maxHeight = null;

                // Update icon to plus
                const icon = this.querySelector('.faq-icon');
                if (icon) {
                    icon.textContent = '+';
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Set initial ARIA attributes and ensure answers are closed
    faqQuestions.forEach(question => {
        question.setAttribute('aria-expanded', 'false');
        question.classList.remove('active');
        const answer = question.nextElementSibling;
        if (answer) {
            answer.classList.remove('active');
            answer.style.maxHeight = null;
        }
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollReveal() {
    // Select all elements that should have reveal animation
    const revealElements = document.querySelectorAll('.reveal');

    // If no elements found, add reveal class to common sections
    if (revealElements.length === 0) {
        document.querySelectorAll('section, .stat-box, .mission-card, .vision-card, .faq-item, .event-card, .inclusivity-banner').forEach(el => {
            el.classList.add('reveal');
        });
    }

    // Get updated list of reveal elements
    const elementsToReveal = document.querySelectorAll('.reveal');

    // Create Intersection Observer with optimized thresholds
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe each element
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// AUTOMATIC WEEKS COUNTER (Calculates from Jan 10, 2026)
// ============================================
function updateWeeksCounter() {
    const weeksCounter = document.getElementById('weeks-counter');
    if (!weeksCounter) return;

    // Set start date: January 10th, 2026 (Month is 0-indexed, so 0 = January)
    const startDate = new Date(2026, 0, 10);
    const currentDate = new Date();

    // Calculate difference in milliseconds
    const timeDifference = currentDate - startDate;

    // Convert to weeks (milliseconds * seconds * minutes * hours * days)
    const weeksPassed = Math.max(0, Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7)));

    // Display with plus sign (e.g., "12+")
    weeksCounter.textContent = weeksPassed + '+';

    // Add a little animation to show it's live
    weeksCounter.style.transform = 'scale(1.1)';
    setTimeout(() => {
        weeksCounter.style.transform = 'scale(1)';
    }, 300);
}

// ============================================
// TOTAL RUNNERS COUNTER (Animates on scroll)
// ============================================
function initStatsCounter() {
    const statsSection = document.getElementById('stats');
    const runnersCounter = document.getElementById('runners-counter');

    // Exit if elements don't exist
    if (!statsSection || !runnersCounter) return;

    let hasCounted = false;

    // Create observer for stats section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                animateRunnersCounter();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of section is visible
    });

    observer.observe(statsSection);

    // Animate runners counter from 0 to totalRunners
    function animateRunnersCounter() {
        const startValue = 0;
        const endValue = totalRunners;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation (easeOutQuart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

            // Display with plus sign
            runnersCounter.textContent = currentValue + '+';

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                runnersCounter.textContent = endValue + '+';

                // Add energetic pop at the end
                runnersCounter.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    runnersCounter.style.transform = 'scale(1)';
                }, 200);

                // Second little bounce for energy
                setTimeout(() => {
                    runnersCounter.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        runnersCounter.style.transform = 'scale(1)';
                    }, 100);
                }, 250);
            }
        }

        requestAnimationFrame(updateCounter);
    }
}

// ============================================
// IMAGE CAROUSEL - Seamless infinite loop
// ============================================
function initImageCarousel() {
    const carousel = document.querySelector('.image-carousel');
    const track = document.querySelector('.carousel-track');

    if (!carousel || !track) return;

    // Clone images for seamless loop
    const images = Array.from(track.children);
    const imageCount = images.length;

    // Clone first few images and append to end
    for (let i = 0; i < Math.min(3, imageCount); i++) {
        const clone = images[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // Hide from screen readers
        track.appendChild(clone);
    }

    // Clone last few images and prepend to beginning
    for (let i = imageCount - 1; i >= Math.max(0, imageCount - 3); i--) {
        const clone = images[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.insertBefore(clone, track.firstChild);
    }

    // Adjust animation duration based on number of images
    const totalImages = track.children.length;
    const baseDuration = 30; // seconds for 6 images
    const duration = (totalImages / 6) * baseDuration;

    track.style.animation = `scroll ${duration}s linear infinite`;

    // Pause animation when not visible to save performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                track.style.animationPlayState = 'running';
            } else {
                track.style.animationPlayState = 'paused';
            }
        });
    }, { threshold: 0.1 });

    observer.observe(carousel);
}

// ============================================
// CALENDAR MOBILE VIEW - Optimize for small screens
// ============================================
function initCalendarMobileView() {
    const calendarContainer = document.querySelector('.calendar-container');
    const calendarIframe = calendarContainer ? calendarContainer.querySelector('iframe') : null;

    if (!calendarIframe) return;

    // Check if on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    if (isMobile) {
        // Get current src
        let src = calendarIframe.src;

        // Switch to agenda view for better mobile readability
        if (src.includes('calendar.google.com')) {
            // Remove any existing view parameter and add agenda view
            src = src.replace(/&mode=[^&]*/g, '');
            src += '&mode=AGENDA';

            // Reduce height for mobile
            calendarIframe.style.height = '400px';

            // Update iframe src
            calendarIframe.src = src;
        }
    }

    // Add resize listener to switch views dynamically
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const isMobileNow = window.innerWidth <= 768;
            let src = calendarIframe.src;

            if (isMobileNow && src.includes('mode=AGENDA') === false) {
                // Switch to agenda on mobile
                src = src.replace(/&mode=[^&]*/g, '');
                src += '&mode=AGENDA';
                calendarIframe.src = src;
                calendarIframe.style.height = '400px';
            } else if (!isMobileNow && src.includes('mode=AGENDA')) {
                // Switch back to default on desktop
                src = src.replace(/&mode=AGENDA/g, '');
                calendarIframe.src = src;
                calendarIframe.style.height = '600px';
            }
        }, 250);
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-top-btn')) {
        createScrollToTopButton();
    }

    const scrollTopBtn = document.querySelector('.scroll-top-btn');

    if (!scrollTopBtn) return;

    // Show/hide button based on scroll position with throttle for performance
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.scrollY > 400) {
                    scrollTopBtn.classList.add('show');
                } else {
                    scrollTopBtn.classList.remove('show');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Helper function to create scroll to top button
function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Scroll to top');

    // Style the button
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #e65100;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1999;
        box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
    `;

    // Add hover effect
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.backgroundColor = '#e65100';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.backgroundColor = '#e65100';
    });

    document.body.appendChild(btn);
}

// ============================================
// ADD REVEAL CLASS TO ELEMENTS (if missing)
// ============================================
// This runs after page load to ensure all elements can animate
window.addEventListener('load', function () {
    // Add reveal class to stat boxes if they don't have it
    document.querySelectorAll('.stat-box').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Add reveal class to mission and vision cards
    document.querySelectorAll('.mission-card, .vision-card').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Add reveal class to FAQ items
    document.querySelectorAll('.faq-item').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Add reveal class to sections
    document.querySelectorAll('section').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Add reveal class to carousel images
    document.querySelectorAll('.carousel-track img').forEach(el => {
        el.classList.add('reveal');
    });

    // Add reveal class to inclusivity banner
    const inclusivityBanner = document.querySelector('.inclusivity-banner');
    if (inclusivityBanner && !inclusivityBanner.classList.contains('reveal')) {
        inclusivityBanner.classList.add('reveal');
    }

    // Add reveal class to event cards
    document.querySelectorAll('.event-card').forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Re-initialize scroll reveal to catch new elements
    initScrollReveal();

    // Update weeks counter again on load to ensure it's fresh
    updateWeeksCounter();
});

// ============================================
// HANDLE WINDOW RESIZE
// ============================================
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        // Close mobile menu on resize if screen becomes large
        if (window.innerWidth > 968) {
            const navMenu = document.querySelector('.nav-menu');
            const mobileToggle = document.querySelector('.mobile-toggle');
            if (navMenu && mobileToggle) {
                navMenu.classList.remove('active');
                mobileToggle.textContent = '☰';
                document.body.style.overflow = ''; // Restore scroll

                // Close any open dropdowns
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    }, 250);
});

// ============================================
// UPDATE WEEKS COUNTER DAILY (Optional)
// ============================================
// Check once per day to update weeks counter
setInterval(updateWeeksCounter, 86400000); // 24 hours in milliseconds

// ============================================
// ADD CSS FOR SCROLL-TO-TOP BUTTON
// ============================================
const style = document.createElement('style');
style.textContent = `
    .scroll-top-btn.show {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    @media (max-width: 768px) {
        .scroll-top-btn {
            bottom: 90px;
            right: 20px;
            width: 40px;
            height: 40px;
            font-size: 20px;
        }
    }
`;
document.head.appendChild(style);