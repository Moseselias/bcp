// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize navbar scroll detection
  initNavbarScroll();

  // Initialize animations
  initScrollAnimations();

  // Initialize parallax effect
  initParallaxEffect();

  // Initialize form validation
  initFormValidation();

  // Initialize hover effects
  initHoverEffects();
});

// Initialize navbar scroll detection
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let ticking = false;

  function updateNavbar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    ticking = false;
  }

  function requestNavbarUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  // Initial check
  updateNavbar();

  // Listen for scroll events
  window.addEventListener("scroll", requestNavbarUpdate);

  // Also check on resize
  window.addEventListener("resize", updateNavbar);
}

// Smooth scroll to contact section
function scrollToContact() {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// FAQ Accordion functionality
function toggleAccordion(trigger) {
  const item = trigger.closest(".accordion-item");
  const content = item.querySelector(".accordion-content");
  const icon = trigger.querySelector(".accordion-icon");
  const allItems = document.querySelectorAll(".accordion-item");

  // Close all other accordion items
  allItems.forEach((otherItem) => {
    if (otherItem !== item && otherItem.classList.contains("active")) {
      otherItem.classList.remove("active");
      const otherContent = otherItem.querySelector(".accordion-content");
      const otherIcon = otherItem.querySelector(".accordion-icon");
      otherContent.style.maxHeight = "0";

      // Update icon back to plus
      if (otherIcon) {
        otherIcon.setAttribute("data-lucide", "plus");
      }
    }
  });

  // Toggle current item
  const isActive = item.classList.contains("active");

  if (isActive) {
    // Close current item
    item.classList.remove("active");
    content.style.maxHeight = "0";
    icon.setAttribute("data-lucide", "plus");
  } else {
    // Open current item
    item.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
    icon.setAttribute("data-lucide", "minus");
  }

  // Reinitialize icons after changing them
  lucide.createIcons();
}

// Contact form handling with validation
function initFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return false;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Add loading state
    submitBtn.classList.add("loading");
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate form submission delay
    setTimeout(() => {
      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      };

      console.log("Form submitted:", data);

      // Show success message
      showNotification(
        "Thank you for your inquiry! We will get back to you soon.",
        "success",
      );

      // Reset form
      form.reset();

      // Remove loading state
      submitBtn.classList.remove("loading");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Form validation function
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Reset previous error states
  clearFieldErrors();

  let isValid = true;

  if (name === "") {
    showFieldError("name", "Name is required");
    isValid = false;
  }

  if (email === "") {
    showFieldError("email", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  }

  if (message === "") {
    showFieldError("message", "Message is required");
    isValid = false;
  }

  return isValid;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show field error
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest(".form-group");

  // Add error class
  field.style.borderColor = "#dc2626";
  field.style.boxShadow = "0 0 0 3px rgba(220, 38, 38, 0.1)";

  // Create error message if it doesn't exist
  let errorElement = formGroup.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.style.color = "#dc2626";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "4px";
    formGroup.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

// Clear field errors
function clearFieldErrors() {
  const fields = document.querySelectorAll(
    "#contactForm input, #contactForm textarea",
  );
  fields.forEach((field) => {
    field.style.borderColor = "";
    field.style.boxShadow = "";
    const formGroup = field.closest(".form-group");
    const errorElement = formGroup.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  });
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "9999",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  });

  // Set background color based on type
  if (type === "success") {
    notification.style.backgroundColor = "#16a34a";
  } else if (type === "error") {
    notification.style.backgroundColor = "#dc2626";
  } else {
    notification.style.backgroundColor = "#2563eb";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Initialize scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe elements for fade-in animation
  const animatedElements = document.querySelectorAll(
    ".service-card, .about-item, .contact-card",
  );

  animatedElements.forEach((element, index) => {
    element.classList.add("fade-in");
    element.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(element);
  });
}

// Initialize parallax effect for hero background
function initParallaxEffect() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector(".hero-bg");

    if (heroBackground) {
      const speed = 0.5;
      const yPos = scrolled * speed;
      heroBackground.style.transform = `translateY(${yPos}px)`;
    }

    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestParallaxUpdate);
}

// Initialize hover effects
function initHoverEffects() {
  // Service card hover effects
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // About item hover effects
  const aboutItems = document.querySelectorAll(".about-item");
  aboutItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".about-icon");
      if (icon) {
        icon.style.transform = "scale(1.1) rotate(5deg)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    item.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".about-icon");
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)";
      }
    });
  });
}

// Add smooth scrolling for any internal links
document.addEventListener("click", function (e) {
  if (
    e.target.tagName === "A" &&
    e.target.getAttribute("href")?.startsWith("#")
  ) {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Keyboard navigation for accordion
document.addEventListener("keydown", function (e) {
  if (e.target.classList.contains("accordion-trigger")) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAccordion(e.target);
    }
  }
});

// Resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    // Update accordion max-heights on resize
    const activeAccordions = document.querySelectorAll(
      ".accordion-item.active .accordion-content",
    );
    activeAccordions.forEach((content) => {
      content.style.maxHeight = content.scrollHeight + "px";
    });
  }, 250);
});

// Add loading indicator for page
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add focus management for accessibility
document.addEventListener("keydown", function (e) {
  // Add focus styles for keyboard navigation
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", function () {
  document.body.classList.remove("keyboard-navigation");
});

// Add service for managing focus
function manageFocus() {
  const style = document.createElement("style");
  style.textContent = `
    body:not(.keyboard-navigation) *:focus {
      outline: none;
    }
    
    .keyboard-navigation *:focus {
      outline: 2px solid #f5761a;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// Initialize focus management
manageFocus();

// Console log for development
console.log("BillCharlesltd.com website loaded successfully!");
console.log(
  "Features loaded: Contact form, FAQ accordion, smooth scrolling, parallax effects, orange navbar",
);
