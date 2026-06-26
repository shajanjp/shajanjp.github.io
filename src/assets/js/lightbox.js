/**
 * Lightbox — click on blog images to view full size.
 *
 * - Click any image inside a .prose figure to open it full-size
 *   in a centered overlay
 * - Click the overlay background or press Escape to close
 * - Image is displayed at natural dimensions, capped to viewport
 */

(function () {
  var lightboxEl = null;
  var lightboxImg = null;

  function init() {
    // Create lightbox DOM once
    lightboxEl = document.createElement("div");
    lightboxEl.className = "lightbox-overlay";
    lightboxEl.setAttribute("role", "dialog");
    lightboxEl.setAttribute("aria-label", "Image viewer");

    lightboxImg = document.createElement("img");
    lightboxImg.className = "lightbox-image";
    lightboxImg.alt = "";

    var closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close");

    lightboxEl.appendChild(lightboxImg);
    lightboxEl.appendChild(closeBtn);

    // Click on background closes
    lightboxEl.addEventListener("click", function (e) {
      if (e.target === lightboxEl) close();
    });
    closeBtn.addEventListener("click", close);

    document.body.appendChild(lightboxEl);

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    // Wire up click handlers on prose images
    wireImages();
  }

  function wireImages() {
    var images = document.querySelectorAll(".prose figure img");
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      img.removeEventListener("click", open);
      img.addEventListener("click", open);
      img.style.cursor = "pointer";
    }
  }

  function open(e) {
    var img = e.currentTarget;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightboxEl.classList.add("active");
    document.body.style.overflow = "hidden";

    // Re-trigger scale-in animation on each open
    lightboxImg.classList.remove("scale-in");
    void lightboxImg.offsetWidth;
    lightboxImg.classList.add("scale-in");
  }

  function close() {
    lightboxEl.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
