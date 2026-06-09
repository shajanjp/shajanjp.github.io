/**
 * Item Embed Plugin
 *
 * Provides shortcodes and filters to retrieve any collection item by
 * its slug (directory name).  Works for blog posts, projects,
 * photography, or any collection where items live at
 * src/{collection}/{slug}/index.md.
 *
 * Usage in Nunjucks templates:
 *
 *   {% itemEmbed "blog", "my-blog-slug" %}
 *   {% itemEmbed "projects", "my-project-slug" %}
 *   {% itemEmbed "photos", "my-photo-slug" %}
 *
 *   or retrieve the item object and render manually:
 *
 *   {% set item = collections.blog | getItemBySlug("my-blog-slug") %}
 *   <a href="{{ item.url }}">{{ item.data.title }}</a>
 */

const path = require("path");

/**
 * Extracts the slug from a collection item's input path.
 * Items live at src/{collection}/{slug}/index.md, so
 * page.inputPath ends with /{slug}/index.md and we extract
 * the parent directory name as the slug.
 */
function slugFromInputPath(inputPath) {
  const dir = path.dirname(inputPath);
  return path.basename(dir);
}

module.exports = function (eleventyConfig) {
  /**
   * Filter: getItemBySlug(slug)
   *
   * Looks through any collection and returns the first item whose
   * input-path slug matches.  Returns undefined if not found.
   *
   * Usage:
   *   {% set item = collections.blog | getItemBySlug("my-slug") %}
   *   {{ item.data.title }}
   *
   *   {% set item = collections.projects | getItemBySlug("my-project") %}
   *   {{ item.data.title }}
   */
  eleventyConfig.addFilter("getItemBySlug", function (collection, slug) {
    if (!collection || !slug) return undefined;
    return collection.find((item) => slugFromInputPath(item.inputPath) === slug);
  });

  /**
   * Shortcode: itemEmbed(collectionName, slug)
   *
   * Renders a compact card for the given collection item.
   * Shows date, title, description, tags, and a thumbnail/icon.
   *
   * Usage:
   *   {% itemEmbed "blog", "my-blog-slug" %}
   *   {% itemEmbed "projects", "my-project" %}
   *   {% itemEmbed "photos", "my-photo" %}
   *
   * Supported collection names: "blog", "projects", "photos", or any
   * collection key available in the template context.
   */
  eleventyConfig.addShortcode("itemEmbed", function (collectionName, slug) {
    const collections = this.ctx?.collections;
    if (!collections) return "";

    const collection = collections[collectionName];
    if (!collection)
      return `<p class="text-sm text-red-500">Collection "${collectionName}" not found.</p>`;

    const item = collection.find(
      (i) => slugFromInputPath(i.inputPath) === slug
    );
    if (!item)
      return `<p class="text-sm text-red-500">Item "${slug}" not found in "${collectionName}".</p>`;

    const { title, description, date, created, tags, icon, image, thumbnail } =
      item.data;
    const url = item.url;

    // Resolve display date: prefer date field, fall back to created
    const displayDate = date || created;
    const dateStr = displayDate
      ? new Date(displayDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    // Determine the collection-specific tag to exclude from display
    const collectionTag = collectionName === "photos" ? "photos" : collectionName;

    // Build tag links (excluding the collection's own tag)
    const tagLinks = (tags || [])
      .filter((t) => t !== collectionTag)
      .map(
        (t) =>
          `<a href="/${collectionName === "photos" ? "blog" : collectionName}/tag/${t}/" class="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 rounded-sm hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300">${t}</a>`
      )
      .join(" ");

    // Resolve image/icon URL
    const imgSrc = icon
      ? `${url}${icon}`
      : image
        ? `${url}${image}`
        : thumbnail
          ? `${url}${thumbnail}`
          : null;

    return `
<div class="relative flex flex-row items-start sm:items-center gap-4 sm:gap-6 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
  <div class="flex-1 min-w-0">
    <div class="text-[10px] text-zinc-400 dark:text-zinc-600 mb-1 uppercase tracking-widest font-semibold">${dateStr}</div>
    <a href="${url}" class="block">
      <h3 class="text-lg font-medium leading-tight mb-2 text-zinc-900 dark:text-zinc-100 transition-colors break-words">${title || slug}</h3>
    </a>
    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">${description || ""}</p>
    <div class="flex flex-wrap gap-2">${tagLinks}</div>
  </div>
  ${
    imgSrc
      ? `<div class="w-8 h-8 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden flex items-center justify-center order-first sm:order-last">
          <div class="flex justify-center">
            <img src="${imgSrc}" alt="${title || slug}" class="w-10 h-auto transition-all duration-300 invert-40 dark:invert-70">
          </div>
        </div>`
      : ""
  }
</div>`;
  });
};
