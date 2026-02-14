const words = ["Instantly", "Effortlessly", "Beautifully", "Visually"];
let index = 0;

function changeWord() {
    const word = document.getElementById("changing-word");
    
    // update text
    word.textContent = words[index];

    // restart animation
    word.style.animation = "none";
    void word.offsetWidth;  // force reflow to restart animation
    word.style.animation = "slideIn 0.6s ease";

    // next word
    index = (index + 1) % words.length;
}

// change every 2 seconds
setInterval(changeWord, 2000);
// Scroll reveal for mockup image
const mockupImg = document.querySelector(".mockup-image");

function handleScrollReveal() {
    const rect = mockupImg.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.85;

    if (rect.top < triggerPoint) {
        mockupImg.classList.add("reveal");
        window.removeEventListener("scroll", handleScrollReveal);
    }
}

window.addEventListener("scroll", handleScrollReveal);
// Sticky navbar shadow
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (window.scrollY > 20) {
        nav.classList.add("sticky");
    } else {
        nav.classList.remove("sticky");
    }
});
// Fade + slide reveal for cards
const psCards = document.querySelectorAll(".fade-on-scroll");

function revealOnScroll() {
    psCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            card.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
// Feature card scroll animation
const featureCards = document.querySelectorAll(".feature-on-scroll");

function revealFeatures() {
    featureCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            card.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealFeatures);
revealFeatures();
// Editor section reveal animation
const editorCards = document.querySelectorAll(".editor-on-scroll");

function revealEditors() {
    editorCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            card.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealEditors);
revealEditors();
// Templates cards animation
const templateCards = document.querySelectorAll(".template-on-scroll");

function revealTemplates() {
    templateCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            card.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealTemplates);
revealTemplates();
// How It Works animation
const howSteps = document.querySelectorAll(".how-on-scroll");

function revealHowSteps() {
    howSteps.forEach(step => {
        const rect = step.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            step.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealHowSteps);
revealHowSteps();
// Testimonials scroll effect
const testimonials = document.querySelectorAll(".testimonial-on-scroll");

function revealTestimonials() {
    testimonials.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            card.classList.add("reveal");
        }
    });
}

window.addEventListener("scroll", revealTestimonials);
revealTestimonials();
// CTA scroll reveal
const ctaContent = document.querySelector(".cta-on-scroll");

function revealCTA() {
    if (!ctaContent) return;

    const rect = ctaContent.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
        ctaContent.classList.add("reveal");
    }
}

window.addEventListener("scroll", revealCTA);
revealCTA();
    
