document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector("nav ul");
    const productList = document.querySelector(".product-list");
    const searchInput = document.querySelector("#searchInput");
    const categoryFilter = document.querySelector("#categoryFilter");
    const contactForm = document.querySelector("form");
    const header = document.querySelector("header");

    // Mobile Menu Functionality
    function toggleMobileMenu(event) {
        event.stopPropagation();
        navMenu.classList.toggle("active");
        mobileMenuBtn.setAttribute("aria-expanded", 
            mobileMenuBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
        );
    }

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (navMenu.classList.contains("active") && !e.target.closest("nav")) {
            navMenu.classList.remove("active");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        }
    });

    // Header scroll behavior
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove("scroll-up");
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains("scroll-down")) {
            // Scrolling down
            header.classList.remove("scroll-up");
            header.classList.add("scroll-down");
        } else if (currentScroll < lastScroll && header.classList.contains("scroll-down")) {
            // Scrolling up
            header.classList.remove("scroll-down");
            header.classList.add("scroll-up");
        }
        lastScroll = currentScroll;
    });

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open
                if (navMenu.classList.contains("active")) {
                    navMenu.classList.remove("active");
                    mobileMenuBtn.setAttribute("aria-expanded", "false");
                }
            }
        });
    });

    // Product Filtering with Animation
    let filterTimeout;
    
    function filterProducts() {
        clearTimeout(filterTimeout);
        
        filterTimeout = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;
            const products = document.querySelectorAll(".product-card");
            
            products.forEach(product => {
                const title = product.querySelector("h3").textContent.toLowerCase();
                const category = product.dataset.category;
                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = selectedCategory === "all" || category === selectedCategory;

                // Add transition class for smooth animation
                product.classList.add("filtering");
                
                if (matchesSearch && matchesCategory) {
                    setTimeout(() => {
                        product.style.display = "block";
                        requestAnimationFrame(() => {
                            product.classList.add("visible");
                            product.classList.remove("filtering");
                        });
                    }, 50);
                } else {
                    product.classList.remove("visible");
                    product.classList.remove("filtering");
                    setTimeout(() => {
                        product.style.display = "none";
                    }, 300); // Match this with CSS transition duration
                }
            });
        }, 200); // Debounce delay
    }

    searchInput.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);


    // Add intersection observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all product cards and sections
    document.querySelectorAll('.product-card, section').forEach(element => {
        observer.observe(element);
    });
});


// Add to your existing JavaScript
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navOverlay = document.querySelector(".nav-overlay");

function toggleMobileMenu(event) {
    event.stopPropagation();
    navMenu.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
    navOverlay.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
    
    mobileMenuBtn.setAttribute("aria-expanded", 
        mobileMenuBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
    );
}

mobileMenuBtn.addEventListener("click", toggleMobileMenu);
navOverlay.addEventListener("click", toggleMobileMenu);


document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.modern-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Add focused and filled classes for floating labels
    inputs.forEach(input => {
        // Initial check for pre-filled values
        if (input.value.trim() !== '') {
            input.closest('.form-field').classList.add('filled');
        }

        input.addEventListener('focus', () => {
            input.closest('.form-field').classList.add('focused');
        });

        input.addEventListener('blur', () => {
            const field = input.closest('.form-field');
            field.classList.remove('focused');
            if (input.value.trim() !== '') {
                field.classList.add('filled');
            } else {
                field.classList.remove('filled');
            }
        });
    });

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('.submit-button');
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success message
                alert('Thank you for your message. We will get back to you soon!');
                
                // Clear form data
                form.reset();
                
                // Reset all form fields and their styles
                inputs.forEach(input => {
                    input.value = '';
                    const field = input.closest('.form-field');
                    if (field) {
                        field.classList.remove('focused', 'filled');
                    }
                });

                // Specifically reset select element
                const select = form.querySelector('select');
                if (select) {
                    select.selectedIndex = 0;
                    select.closest('.form-field').classList.remove('filled');
                }

                // Clear textarea
                const textarea = form.querySelector('textarea');
                if (textarea) {
                    textarea.value = '';
                    textarea.closest('.form-field').classList.remove('filled');
                }

            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            alert('There was a problem sending your message. Please try again later.');
            console.error('Error:', error);
        } finally {
            submitButton.disabled = false;
        }
    });
});