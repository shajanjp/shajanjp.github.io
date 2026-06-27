/**
 * Lightbox — click on blog images to view full size.
 *
 * - Click any image inside a .prose figure to open it full-size
 *   in a centered overlay
 * - Click the overlay background or press Escape to close
 * - Shows a loading spinner while the image downloads
 * - Image is displayed at natural dimensions, capped to viewport
 */

(function () {
  var lightboxEl = null;
  var lightboxImg = null;
  var lightboxSpinner = null;

  function init() {
    // Create lightbox DOM once
    lightboxEl = document.createElement("div");
    lightboxEl.className = "lightbox-overlay";
    lightboxEl.setAttribute("role", "dialog");
    lightboxEl.setAttribute("aria-label", "Image viewer");

    // Loading spinner
    lightboxSpinner = document.createElement("div");
    lightboxSpinner.className = "lightbox-spinner";

    lightboxImg = document.createElement("img");
    lightboxImg.className = "lightbox-image";
    lightboxImg.alt = "";
    lightboxImg.style.display = "none";  // hidden until loaded

    var closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close");

    lightboxEl.appendChild(lightboxSpinner);
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

    // Clear old image and show spinner immediately
    lightboxImg.style.display = "none";
    lightboxImg.src = "";
    lightboxImg.alt = "";
    lightboxSpinner.style.display = "";
    lightboxEl.classList.add("active");
    document.body.style.overflow = "hidden";

    // Set new src and wait for it to load
    lightboxImg.onload = function () {
      lightboxSpinner.style.display = "none";
      lightboxImg.style.display = "";

      // Re-trigger scale-in animation on each open
      lightboxImg.classList.remove("scale-in");
      void lightboxImg.offsetWidth;
      lightboxImg.classList.add("scale-in");
    };

    lightboxImg.onerror = function () {
      lightboxSpinner.style.display = "none";
    };

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
  }

  function close() {
    lightboxEl.classList.remove("active");
    lightboxImg.style.display = "none";
    lightboxImg.src = "";
    lightboxImg.alt = "";
    lightboxImg.onload = null;
    lightboxImg.onerror = null;
    lightboxSpinner.style.display = "none";
    document.body.style.overflow = "";
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
