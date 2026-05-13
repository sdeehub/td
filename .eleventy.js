const markdownIt = require("markdown-it");
const implicitFigures = require("markdown-it-implicit-figures");

module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("latestPerTag", function(collectionApi) {
    // all posts sorted newest first
    const posts = collectionApi.getFilteredByTag("post").reverse();

    const seenTags = new Set();
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

	// skip internal/common tags
	  if (isInternalTag(tag)) {
	  continue;
	}

	// first time seeing this tag
	if (!seenTags.has(tag)) {
	  seenTags.add(tag);
	  matchedNewTag = true;
	}
      }

      // add post only once total
      if (matchedNewTag && !seenPosts.has(post.url)) {
	seenPosts.add(post.url);
	uniquePosts.push(post);
      }
    }

    return uniquePosts;
  });

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
