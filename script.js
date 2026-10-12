// Wait until the HTML has fully loaded before running any of this.
document.addEventListener('DOMContentLoaded', () => {

    // ====================================================
    // 1. Intro animation
    // ====================================================
    const intro = document.getElementById('intro')
    const introName = document.getElementById('introName')

    if (intro && introName) {
        document.body.classList.add('intro-active')

        setTimeout(() => {
            introName.classList.add('is-leaving')
        }, 2000)

        setTimeout(() => {
            intro.classList.add('is-open')
            document.body.classList.remove('intro-active')
        }, 2500)

        setTimeout(() => {
            intro.remove()
        }, 3600)
    }

    // ====================================================
    // 2. Time-aware greeting
    // ====================================================
    const greetingEl = document.getElementById('greeting')
    if (greetingEl) {
        const hour = new Date().getHours()
        let greeting = 'Hello'
        if (hour < 12) {
            greeting = 'Good morning'
        } else if (hour < 18) {
            greeting = 'Good afternoon'
        } else {
            greeting = 'Good evening'
        }
        greetingEl.textContent = greeting
    }

    // ====================================================
    // 3. Footer year
    // ====================================================
    const yearSpan = document.getElementById('year')
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear()
    }

    // ====================================================
    // 4. Hamburger menu
    // ====================================================
    const navToggle = document.getElementById('navToggle')
    const navDrawer = document.getElementById('navDrawer')

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navDrawer.classList.toggle('is-open')
            navToggle.classList.toggle('is-open', isOpen)
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
        })

        navDrawer.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navDrawer.classList.remove('is-open')
                navToggle.classList.remove('is-open')
                navToggle.setAttribute('aria-expanded', 'false')
            })
        })
    }

    // ====================================================
    // 5. Scroll reveal — replays every time
    // ====================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger')

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible')
            } else {
                entry.target.classList.remove('is-visible')
            }
        })
    }, {
        threshold: 0.15,
        rootMargin: '-10% 0px -10% 0px'
    })

    revealElements.forEach((el) => revealObserver.observe(el))

    // ====================================================
    // 6. Active nav link on scroll
    // ====================================================
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('.nav-links a')

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id)
                })
            }
        })
    }, {
        rootMargin: '-40% 0px -55% 0px'
    })

    sections.forEach((section) => navObserver.observe(section))

    // ====================================================
    // 7. Project flip cards
    // ====================================================
    let lastScrollTime = 0

    window.addEventListener('scroll', () => {
        lastScrollTime = Date.now()
        document.querySelectorAll('.project-flip.is-hovering').forEach((card) => {
            card.classList.remove('is-hovering')
        })
    }, { passive: true })

    const isTouch = window.matchMedia('(hover: none)').matches

    document.querySelectorAll('.project-flip').forEach((card) => {
        if (isTouch) {
            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped')
            })
            return
        }

        card.addEventListener('mousemove', () => {
            if (Date.now() - lastScrollTime < 150) return
            if (!card.classList.contains('is-hovering')) {
                card.classList.add('is-hovering')
            }
        })

        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-hovering')
        })
    })

    // ====================================================
    // 8. Contact form
    // ====================================================
    const contactForm = document.getElementById('contactForm')
    const formSubmit = document.getElementById('formSubmit')

    if (contactForm && formSubmit) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault()

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity()
                return
            }

            const original = formSubmit.textContent
            formSubmit.disabled = true
            formSubmit.textContent = 'Message ready to send ✅ (demo)'

            setTimeout(() => {
                formSubmit.disabled = false
                formSubmit.textContent = original
                contactForm.reset()
            }, 2600)
        })
    }

    // ====================================================
    // 9. Journey — pinned horizontal scroll
    // ====================================================
    const journeySection  = document.getElementById('journey')
    const journeyTrack    = document.getElementById('journeyTrack')
    const journeyProgress = document.getElementById('journeyProgress')

    if (journeySection && journeyTrack) {

        let journeyDistance = 0
        let journeyEnabled = false
        let journeyTicking = false

        function journeyMeasure() {
            const prefersReducedMotion =
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            const isMobile = window.innerWidth < 768

            if (prefersReducedMotion || isMobile) {
                journeyEnabled = false
                journeySection.style.height = ''
                journeyTrack.style.transform = ''
                if (journeyProgress) journeyProgress.style.width = '0%'
                return
            }

            journeyTrack.style.transform = ''
            void journeyTrack.offsetWidth

            const cards = journeyTrack.querySelectorAll('.journey-card')
            if (cards.length === 0) {
                journeyEnabled = false
                journeySection.style.height = ''
                return
            }

            const lastCard = cards[cards.length - 1]
            const lastRect = lastCard.getBoundingClientRect()
            const viewportWidth = document.documentElement.clientWidth
            const overflow = lastRect.right - viewportWidth
            const endGap = 60

            if (overflow <= 0) {
                journeyEnabled = false
                journeySection.style.height = ''
                journeyTrack.style.transform = ''
                if (journeyProgress) journeyProgress.style.width = '0%'
                return
            }

            journeyDistance = Math.round(overflow + endGap)
            journeyEnabled = true

            journeySection.style.height =
                `${window.innerHeight + journeyDistance}px`

            journeyUpdate()
        }

        function journeyUpdate() {
            if (!journeyEnabled) return

            const rect = journeySection.getBoundingClientRect()
            const sectionTop = rect.top
            const sectionHeight = journeySection.offsetHeight
            const viewportHeight = window.innerHeight

            const maxScroll = sectionHeight - viewportHeight
            if (maxScroll <= 0) return

            let progress = -sectionTop / maxScroll
            progress = Math.max(0, Math.min(1, progress))

            const x = -progress * journeyDistance
            journeyTrack.style.transform = `translate3d(${x}px, 0, 0)`

            if (journeyProgress) {
                journeyProgress.style.width = `${progress * 100}%`
            }
        }

        function journeyOnScroll() {
            if (journeyTicking) return
            journeyTicking = true
            requestAnimationFrame(() => {
                journeyUpdate()
                journeyTicking = false
            })
        }

        journeyMeasure()

        let journeyResizeTimer = null
        window.addEventListener('resize', () => {
            clearTimeout(journeyResizeTimer)
            journeyResizeTimer = setTimeout(journeyMeasure, 150)
        })

        window.addEventListener('scroll', journeyOnScroll, { passive: true })

        window.addEventListener('load', () => {
            setTimeout(journeyMeasure, 200)
        })
    }

    // ====================================================
    // 10. Custom cat cursor
    // ====================================================
    const catCursor = document.getElementById('catCursor')

    const hasFinePointer =
        window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (catCursor && hasFinePointer && !prefersReducedMotion) {

        let cursorX = -100
        let cursorY = -100
        let cursorTicking = false

        catCursor.classList.add('is-hidden')

        function paintCursor() {
            catCursor.style.transform =
                `translate3d(${cursorX}px, ${cursorY}px, 0)`
            cursorTicking = false
        }

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX - 16
            cursorY = e.clientY - 16

            catCursor.classList.remove('is-hidden')

            if (!cursorTicking) {
                cursorTicking = true
                requestAnimationFrame(paintCursor)
            }
        })

        document.addEventListener('mouseleave', () => {
            catCursor.classList.add('is-hidden')
        })

        document.addEventListener('mouseover', (e) => {
            const target = e.target

            const isTextInput = target.closest('input, textarea, select')
            catCursor.classList.toggle('is-text-mode', Boolean(isTextInput))

            const isInteractive = target.closest(
                'a, button, .btn, .btn-contact, .btn-ghost, .journey-card, .project-flip, .tech-card, .edu-card'
            )
            catCursor.classList.toggle('is-hovering', Boolean(isInteractive))
        })
    }

    console.log('Portfolio loaded successfully ✨')
})