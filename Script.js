// Toggle Menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Close menu when clicking on a link
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menu').classList.remove('active');
    });
});

// Fire Particles Animation
const fireContainer = document.getElementById('fireContainer');

function createSpark(side) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    const size = Math.random() * 4 + 2;
    
    if (side === 'left') {
        spark.style.left = Math.random() * 20 + '%';
    } else {
        spark.style.left = Math.random() * 20 + 80 + '%';
    }
    
    spark.style.bottom = '0';
    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.animationDuration = duration + 's';
    spark.style.animationDelay = delay + 's';
    
    fireContainer.appendChild(spark);
    
    setTimeout(() => {
        spark.remove();
    }, (duration + delay) * 1000);
}

// Create sparks continuously
setInterval(() => {
    createSpark('left');
    createSpark('right');
}, 70);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const eventCards = document.querySelectorAll('.event-card');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;

                const index = parseInt(card.dataset.index);
                setTimeout(() => {
                    card.classList.add('show');
                }, index * 30); // delay per card

                observer.unobserve(card);
            }
        });
    }, { threshold: 0.1 });

    eventCards.forEach((card, index) => {
        card.dataset.index = index;
        observer.observe(card);
    });
});

// Enhanced parallax with smooth movement
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

function animate() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        const speed = (index + 1) * 8;
        const x = (currentX - 0.5) * speed;
        const y = (currentY - 0.5) * speed;
        flame.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animate);
}
animate();

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, observerOptions);

document.querySelectorAll('.content-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(80px) scale(0.95)';
    card.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
});

// Smooth scroll for scroll indicator
document.querySelector('.scroll-indicator').addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Hide scroll indicator after scrolling
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
});

// Add tilt effect on cards
document.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateY(-10px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
    });
});
