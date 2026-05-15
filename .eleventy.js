const markdownIt = require("markdown-it");
const implicitFigures = require("markdown-it-implicit-figures");

module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter("pad2", n => String(n).padStart(2, "0"));
    
  // ── Date filters for timeline filtering ──────────────────────────────────
  eleventyConfig.addFilter("getYear",  d => d instanceof Date ? d.getFullYear().toString() : "");
  eleventyConfig.addFilter("getMonth", d => d instanceof Date ? String(d.getMonth() + 1).padStart(2, "0") : "");
  eleventyConfig.addFilter("getDay",   d => d instanceof Date ? String(d.getDate()).padStart(2, "0") : "");

  // ── Collections ──────────────────────────────────────────────────────────
  eleventyConfig.addCollection("latestPerTag", function(collectionApi) {
    const posts = collectionApi.getFilteredByTag("post").reverse();
    const seenTags  = new Set();
    const seenPosts = new Set();
    const uniquePosts = [];

    function isInternalTag(tag) {
      return (
        ["post", "all", "nav"].includes(tag) ||
        tag.startsWith("isbn_")
      );
    }

    for (const post of posts) {
      const tags = post.data.tags || [];
      let matchedNewTag = false;
      for (const tag of tags) {
        if (isInternalTag(tag)) continue;
        if (!seenTags.has(tag)) {
          seenTags.add(tag);
          matchedNewTag = true;
        }
      }
      if (matchedNewTag && !seenPosts.has(post.url)) {
        seenPosts.add(post.url);
        uniquePosts.push(post);
      }
    }
    return uniquePosts;
  });

  // ── Shortcodes ───────────────────────────────────────────────────────────

  // Left-aligned quote
  eleventyConfig.addPairedShortcode("quote", function(content, caption) {
    return `
<figure class="blockquote">
  <blockquote class="blockquote">
    <p>${content}</p>
  </blockquote>
  <figcaption class="blockquote-footer">${caption}</figcaption>
</figure>`;
  });

  // Right-aligned quote
  eleventyConfig.addPairedShortcode("quoteEnd", function(content, caption) {
    return `
<figure class="blockquote text-end">
  <blockquote class="blockquote">
    <p>${content}</p>
  </blockquote>
  <figcaption class="blockquote-footer">${caption}</figcaption>
</figure>`;
  });

  // ── Markdown engine ──────────────────────────────────────────────────────
  const markdownLib = markdownIt({ html: true, breaks: true, linkify: true })
    .use(implicitFigures, {
      figcaption: true,
      figcaptionClassName: "figure-caption",
    });
  eleventyConfig.setLibrary("md", markdownLib);

  // ── Config ───────────────────────────────────────────────────────────────
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    pathPrefix: process.env.ELEVENTY_ENV === "production" ? "/td/" : "/",
  };
};
