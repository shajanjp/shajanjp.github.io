/**
 * Image Caption Filter
 *
 * A Nunjucks filter that wraps standalone <img> tags in <figure>
 * elements and uses the alt attribute as the <figcaption> text.
 *
 * Skips images that:
 *   - Have an empty or missing alt attribute
 *   - Are already wrapped in a <figure>
 *
 * Usage in Nunjucks templates:
 *
 *   {{ content | imgCaption | safe }}
 */

const IMG_REGEX = /<img\s[^>]*?>/gi;
const ALT_REGEX = /alt\s*=\s*"([^"]*)"/i;
const WRAPPED_IN_FIGURE = /<figure[\s>]/i;

function isWrappedInFigure(html, matchIndex) {
  const before = html.slice(Math.max(0, matchIndex - 300), matchIndex);
  return WRAPPED_IN_FIGURE.test(before);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("imgCaption", function (content) {
    if (!content || typeof content !== "string") return content;

    return content.replace(IMG_REGEX, (match, offset) => {
      if (isWrappedInFigure(content, offset)) return match;

      const altMatch = match.match(ALT_REGEX);
      const alt = altMatch ? altMatch[1].trim() : "";

      if (!alt) return match;

      return `<figure>\n  ${match}\n  <figcaption>${alt}</figcaption>\n</figure>`;
    });
  });
};
