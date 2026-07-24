const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");
const MarkdownIt = require("markdown-it");
const itemEmbed = require("./src/_plugins/item-embed");
const imgCaption = require("./src/_plugins/img-caption");

const md = new MarkdownIt({ html: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss.rssPlugin);
  eleventyConfig.addPlugin(itemEmbed);
  // Image caption filter — used in post layout for blog content images
  eleventyConfig.addPlugin(imgCaption);

  // Pass through any static assets if you add them later (e.g., images)
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/blog/**/*.{jpg,png,pdf}");
  eleventyConfig.addPassthroughCopy("src/photography/**/*.{jpg,png}");
  eleventyConfig.addPassthroughCopy("src/projects/**/*.{jpg,png}");
  eleventyConfig.addPassthroughCopy("src/shortcuts/**/*.{jpg,png}");
  eleventyConfig.addPassthroughCopy("src/ssh/**/*.js");

  eleventyConfig.addCollection("projects", function (collectionApi) {
    return collectionApi.getFilteredByTag("projects").sort(function (a, b) {
      const dateA = new Date(a.data.created || a.date);
      const dateB = new Date(b.data.created || b.date);
      return dateA - dateB;
    });
  });

  eleventyConfig.addCollection("shortcuts", function (collectionApi) {
    return collectionApi.getFilteredByTag("shortcuts");
  });

  eleventyConfig.addCollection("timeline", function (collectionApi) {
    const blog = collectionApi.getFilteredByTag("blog").map(function (item) {
      return {
        url: item.url,
        date: item.date,
        data: item.data,
        type: "blog",
        sortDate: new Date(item.date),
        itemDate: item.date,
      };
    });

    const photos = collectionApi.getFilteredByTag("photos").map(function (item) {
      return {
        url: item.url,
        date: item.date,
        data: item.data,
        type: "photo",
        sortDate: new Date(item.date),
        itemDate: item.date,
      };
    });

    const projects = collectionApi.getFilteredByTag("projects").map(function (item) {
      const projectDate = item.data.created || item.date;
      return {
        url: item.url,
        date: item.date,
        data: item.data,
        type: "project",
        sortDate: new Date(projectDate),
        itemDate: projectDate,
      };
    });

    // Personal events from global data file
    const personalEvents = require('./src/_data/events.json');
    const personal = personalEvents.map(function (item) {
      return {
        url: item.url || '#',
        date: new Date(item.date),
        data: { title: item.title },
        type: 'personal',
        sortDate: new Date(item.date),
        itemDate: item.date,
      };
    });

    return blog.concat(photos).concat(projects).concat(personal).sort(function (a, b) {
      return b.sortDate - a.sortDate;
    });
  });

  // Return color from palette by index; wraps around if out of bounds
  const shortcutColors = [
    "rgb(237, 90, 96)",
    "rgb(252, 123, 91)",
    "rgb(41, 191, 79)",
    "rgb(14, 197, 165)",
    "rgb(231, 192, 23)",
    "rgb(98, 194, 235)",
    "rgb(24, 138, 255)",
    "rgb(71, 102, 194)",
    "rgb(123, 77, 179)",
    "rgb(243, 158, 65)",
    "rgb(174, 111, 216)",
    "rgb(233, 125, 200)",
    "rgb(143, 168, 148)",
    "rgb(184, 158, 127)",
    "rgb(125, 136, 146)",
    "rgb(124, 77, 179)",
  ];

  eleventyConfig.addFilter("shortcutColor", function (index) {
    return shortcutColors[index % shortcutColors.length];
  });

  // Filters
  eleventyConfig.addFilter("humanDate", function (dateObj) {
    return dateObj.toLocaleDateString("en-US", {
      month: "short", // Jan
      day: "numeric", // 1
      year: "numeric", // 2024
    });
  });

  eleventyConfig.addFilter("humanDateYearMonth", function (dateObj) {
    const date = new Date(dateObj);
    return date.toLocaleDateString("en-US", {
      month: "short", // Jan
      year: "numeric", // 2024
    });
  });

  eleventyConfig.addFilter("humanDateDayMonth", function (dateObj) {
    const date = new Date(dateObj);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.toLocaleDateString("en-US", { year: "numeric" });
    return `${day} ${month} ${year}`;
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("markdown", function (content) {
    return md.render(content);
  });

  // Safe JS string embedding: JSON stringifies and escapes </script>
  eleventyConfig.addFilter("js", function (value) {
    const s = typeof value === 'string' ? value : JSON.stringify(value);
    return JSON.stringify(s).replace(/<\//g, '<\\/');
  });

  // Strip collection tags (projects, blog, photos, shortcuts) from tag arrays
  const collectionTags = new Set(['projects', 'blog', 'photos', 'shortcuts']);
  eleventyConfig.addFilter("userTags", function (tags) {
    if (!Array.isArray(tags)) return [];
    return tags.filter(t => !collectionTags.has(t));
  });

  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};

async function imageShortcode(src, alt, sizes = "100vw", className = "") {
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
