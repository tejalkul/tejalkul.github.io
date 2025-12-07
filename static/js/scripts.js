const body = document.body;
const colorModeToggle = document.querySelector(".color-mode-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (colorModeToggle) {
  const sun = colorModeToggle.querySelector(".sun");
  const moon = colorModeToggle.querySelector(".moon");
  const storedMode = localStorage.getItem("darkMode");

  if (storedMode === "enabled") {
    body.classList.add("dark-mode");
    sun?.classList.remove("visible");
    moon?.classList.add("visible");
  } else {
    body.classList.remove("dark-mode");
    sun?.classList.add("visible");
    moon?.classList.remove("visible");
  }

  colorModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const enabled = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
    if (enabled) {
      sun?.classList.remove("visible");
      moon?.classList.add("visible");
    } else {
      sun?.classList.add("visible");
      moon?.classList.remove("visible");
    }
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("show");
  });
}

function sendEmail() {
  const email = "tejalk00@gmail.com";
  window.location.href = `mailto:${email}`;
}

window.sendEmail = sendEmail;

function copyLink(event, sectionId) {
  event.preventDefault();
  const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;

  navigator.clipboard
    .writeText(url)
    .then(() => showToast("Link copied to clipboard!"))
    .catch(() => {
      const tempInput = document.createElement("input");
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast("Link copied to clipboard!");
    });
}

window.copyLink = copyLink;

function showToast(message) {
  const existingToast = document.querySelector(".copy-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "copy-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function initializeMediaHover() {
  const mediaImages = document.querySelectorAll(".research-media[data-video]");

  mediaImages.forEach((img) => {
    const videoSrc = img.dataset.video;
    const container = img.parentElement;
    let videoStatus = "unchecked";
    let videoElement = null;

    const playVideo = () => {
      if (!videoElement) {
        videoElement = document.createElement("video");
        videoElement.src = videoSrc;
        videoElement.className = img.className;
        videoElement.alt = img.alt;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.playsInline = true;
        videoElement.style.display = "none";
        container.appendChild(videoElement);
      }

      img.style.display = "none";
      videoElement.style.display = "block";
      videoElement.play().catch(() => {});
    };

    container.addEventListener("mouseenter", async () => {
      if (videoStatus === "exists") {
        playVideo();
        return;
      }

      if (videoStatus === "missing") {
        return;
      }

      try {
        const response = await fetch(videoSrc, { method: "HEAD" });
        if (response.ok) {
          videoStatus = "exists";
          playVideo();
        } else {
          videoStatus = "missing";
          console.warn(`Video not found: ${videoSrc}`);
        }
      } catch (error) {
        videoStatus = "missing";
        console.error(`Network error checking video: ${videoSrc}`, error);
      }
    });

    container.addEventListener("mouseleave", () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.style.display = "none";
        img.style.display = "block";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const headings = document.querySelectorAll(".section-heading h2");
  headings.forEach((heading) => {
    heading.addEventListener("click", (event) => {
      const sectionId = heading.parentElement.id;
      copyLink(event, sectionId);
    });
  });

  initializeMediaHover();
});
