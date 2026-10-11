// Automatically update the year in the footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year')
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear()
    }


    console.log('Portfolio loaded successfully ✅')
})