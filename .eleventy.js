const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Pass through any static assets if you add them later (e.g., images)
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/blog/**/*.jpg");
  eleventyConfig.addPassthroughCopy("src/photography/**/*.jpg");
  eleventyConfig.addPassthroughCopy("src/projects/**/*.jpg");


  // Filters
  eleventyConfig.addFilter("humanDate", function (dateObj) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short", // Jan
      day: "numeric", // 1
      year: "numeric" // 2024
    });
  });
  
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};

async function imageShortcode(
  src,
  alt,
  sizes = "100vw",
  className = ""
) {
  console.log("IMAGE SRC:", src);
  if (!alt) {
    throw new Error(`Missing alt text for image: ${src}`);
  }

  const metadata = await Image(src, {
    widths: [320, 640, 960, 1280],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/img/",
    urlPath: "/img/",
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    class: className,
  };

  return Image.generateHTML(metadata, imageAttributes);
}