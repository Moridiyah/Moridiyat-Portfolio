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

    // Simple console message to confirm the script is connected
    console.log('Portfolio loaded successfully ✅')
})