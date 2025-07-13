// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize admin functionality
  initAdminNavbar();
  initLoginForm();
  initDashboardInteractions();
  initMessageDetailActions();
});

// Admin navbar functionality (no scroll behavior change needed)
function initAdminNavbar() {
  // Admin navbar is always solid, no scroll behavior needed
  console.log("Admin navbar initialized");
}

// Tobi Edit here
// ① On DOM ready, fire any Django messages
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#django-messages .django-message")
    .forEach(el => {
      showNotification(el.textContent.trim(), el.dataset.level);
    });
});

// Login form functionality
// ② Initialize login-button spinner—but let the form submit
function initLoginForm() {
  const loginForm = document.querySelector(".login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function () {
    const submitBtn   = this.querySelector(".login-btn");
    const originalHTML = submitBtn.innerHTML;

    // Show spinner & disable
    submitBtn.innerHTML = '<div class="spinner"></div>Signing In…';
    submitBtn.disabled  = true;

    // **NO e.preventDefault()**, so the browser POSTs to Django
    // **NO window.location.href** – Django’s view will redirect.

    // (Optional) if for some reason the server is slow and you
    // want to revert the button after 10s, you could:
    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }, 10000);
  });
}

// Dashboard interactions
function initDashboardInteractions() {
  // View button functionality
  const viewButtons = document.querySelectorAll(".view-btn");
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const messageItem = this.closest(".message-item");
      const messageName =
        messageItem.querySelector(".message-name").textContent;

      showNotification(`Opening message from ${messageName}...`, "info");


    });
  });

  // Delete button functionality
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const messageItem = this.closest(".message-item");
      const messageName = messageItem.querySelector(".message-name").textContent;

      // Add fade out animation
      messageItem.style.opacity = "0.5";
      messageItem.style.transform = "translateX(-20px)";

      setTimeout(() => {
        messageItem.remove();
        showNotification(`Message from ${messageName} deleted`, "success");
      }, 300);
      
    });
  });

  // Show All button functionality
  const showAllBtn = document.querySelector(".show-all-btn");
  if (showAllBtn) {
    showAllBtn.addEventListener("click", function () {
      this.innerHTML = '<div class="spinner"></div>Loading all messages...';
      this.disabled = true;

      setTimeout(() => {
        showNotification("All messages loaded", "success");
        this.textContent = "Show All Messages";
        this.disabled = false;
      }, 2000);
    });
  }
}




// Message detail page actions
function initMessageDetailActions() {
  // Back button functionality
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {

    });
  }

  // Reply form functionality
  const replyForm = document.querySelector(".reply-form");
  if (replyForm) {
    replyForm.addEventListener("submit", function () {

      const replyText = document.getElementById("reply").value.trim();

      if (!replyText) {
        showNotification("Please enter a reply message", "error");
        return;
      }

      const submitBtn = this.querySelector(".reply-btn");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<div class="spinner"></div>Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification("Reply sent successfully!", "success");
        document.getElementById("reply").value = "";

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
}

// Delete message notification only
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-message-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      // Let the browser handle the real POST—only intercept to confirm & notify

      // Fire your toast and then continue with the form submit
      showNotification("Message deleted successfully", "success");
      // no spinner, no redirect—just let Django handle the delete
    });
  });
});

// Notification system
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
    fontSize: "14px",
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

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

// Add loading spinner CSS
const spinnerCSS = `
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Add spinner styles to head
const style = document.createElement("style");
style.textContent = spinnerCSS;
document.head.appendChild(style);

// Add hover effects for interactive elements
document.addEventListener("DOMContentLoaded", function () {
  // Add hover effects to cards
  const cards = document.querySelectorAll(
    ".dashboard-card, .detail-card, .sidebar-card, .login-card",
  );
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "";
    });
  });

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add ripple animation CSS
const rippleCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const rippleStyle = document.createElement("style");
rippleStyle.textContent = rippleCSS;
document.head.appendChild(rippleStyle);

// Console log for developmen