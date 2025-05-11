const markdownIt = require("markdown-it");
const implicitFigures = require("markdown-it-implicit-figures");

module.exports = function (eleventyConfig) {
  // Shortcode: Left-aligned quote
  eleventyConfig.addPairedShortcode("quote", function(content, caption) {
    return `
<figure class="blockquote">
  <blockquote class="blockquote">
    <p>${content}</p>
  </blockquote>
  <figcaption class="blockquote-footer">${caption}</figcaption>
</figure>`;
  });

  // Shortcode: Right-aligned quote
  eleventyConfig.addPairedShortcode("quoteEnd", function(content, caption) {
    return `
<figure class="blockquote text-end">
  <blockquote class="blockquote">
    <p>${content}</p>
  </blockquote>
  <figcaption class="blockquote-footer">${caption}</figcaption>
</figure>`;
  });

  // Custom Markdown engine with figure support
  const markdownLib = markdownIt({ html: true, breaks: true, linkify: true })
    .use(implicitFigures, {
      figcaption: true,
      figcaptionClassName: "figure-caption",
    });

  eleventyConfig.setLibrary("md", markdownLib);

  // Return config object (this is where defaults go in v2)
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk", // ✅ Enables Nunjucks in .md
  };
};
