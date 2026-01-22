const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Pass through any static assets if you add them later (e.g., images)
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/blog/**/*.jpg");


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

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

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
