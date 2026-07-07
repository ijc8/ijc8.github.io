const fs = require("fs");
const path = require("path");
const sass = require("sass");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");

// Pre-built web apps and other directories that should be copied through
// verbatim, not processed as templates. (Jekyll copied these implicitly
// because their files have no front matter.)
const STATIC_DIRS = [
  "alternator",
  "blocks",
  "bundles",
  "consult",
  "glitchgate",
  "gtcmt-intro-livecoding",
  "kilobeat",
  "minimax",
  "nime2024/slides",
  "pattern-planter",
  "projector",
  "rtcmix-demo",
  "runnable",
  "s",
  "scorecard-creator",
  "simusk8r",
];

const ASSET_DIRS = ["images", "js", "static"];

module.exports = function (eleventyConfig) {
  // {.class key="value"} attribute lists (successor to kramdown's {: ...} IALs)
  // typographer: smart quotes/dashes/ellipses, like kramdown produced
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ typographer: true });
    md.use(markdownItAttrs);
    md.use(markdownItFootnote);
    // kramdown-compatible footnote markup: bare-number markers, label-based
    // ids (#fn:label), and the classes the old site shipped with. Keeps
    // existing deep links and CSS working.
    md.renderer.rules.footnote_caption = (tokens, idx) =>
      String(tokens[idx].meta.id + 1);
    md.renderer.rules.footnote_anchor_name = (tokens, idx, options, env) => {
      const label = tokens[idx].meta.label;
      return ":" + (label || String(tokens[idx].meta.id + 1));
    };
    md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
      const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
      const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
      let refid = id;
      if (tokens[idx].meta.subId > 0) refid += ":" + tokens[idx].meta.subId;
      return `<sup id="fnref${refid}"><a href="#fn${id}" class="footnote" rel="footnote">${caption}</a></sup>`;
    };
    md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
      let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
      if (tokens[idx].meta.subId > 0) id += ":" + tokens[idx].meta.subId;
      return ` <a href="#fnref${id}" class="reversefootnote">↩</a>`;
    };
  });

  // Jekyll-era date strings ("2017-09-02 01:56:00 -0700") aren't ISO, so
  // Eleventy can't parse them natively. Parse to the exact instant; post
  // URLs derive from its UTC calendar day, matching what the GitHub Actions
  // build (UTC) has been publishing.
  eleventyConfig.addDateParsing(function (dateValue) {
    if (typeof dateValue === "string") {
      const m = dateValue.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?(?:\s*([+-])(\d{2}):?(\d{2}))?$/
      );
      if (m) {
        let ms = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
        if (m[7]) {
          const offset = (+m[8] * 60 + +m[9]) * 60 * 1000;
          ms += m[7] === "-" ? offset : -offset;
        }
        return new Date(ms);
      }
    }
  });

  for (const dir of [...STATIC_DIRS, ...ASSET_DIRS]) {
    eleventyConfig.addPassthroughCopy(dir);
    eleventyConfig.ignores.add(`${dir}/**`);
  }
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("*.pdf");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("nime2024/slides/README.md");
  eleventyConfig.ignores.add("misc/**");
  eleventyConfig.ignores.add("vendor/**");
  eleventyConfig.ignores.add("_sass/**"); // partials, only ever @imported

  // SCSS -> CSS, replacing Jekyll's built-in Sass pipeline.
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile(inputContent) {
      const result = sass.compileString(inputContent, { loadPaths: ["_sass"] });
      return () => result.css;
    },
  });

  // Jekyll's {% post_url 2020-05-21-kilobeat %} tag: resolve the post's
  // actual URL from the collection (the URL's date can differ from the
  // filename's; see _posts/_posts.11tydata.js).
  eleventyConfig.addLiquidTag("post_url", function () {
    return {
      parse(tagToken) {
        this.target = tagToken.args.trim();
      },
      render(ctx) {
        const posts = ctx.environments.collections.posts;
        const post = posts.find((p) =>
          p.page.inputPath.endsWith(`/${this.target}.md`)
        );
        if (!post) throw new Error(`post_url: no post matches "${this.target}"`);
        return post.url;
      },
    };
  });

  // site.posts equivalent: newest first.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("_posts/*.md").slice().reverse()
  );

  // Port of _plugins/goatcounter_injector.rb: inject the GoatCounter snippet
  // into passthrough-copied HTML (pre-built apps). Templated pages already
  // get it from the default layout.
  eleventyConfig.on("eleventy.after", async ({ dir, results }) => {
    // Only touch copied files, not templated pages (which get the snippet
    // from their layout, or deliberately lack it, e.g. scorecard-workshop).
    const templated = new Set(results.map((r) => path.resolve(r.outputPath)));
    const site = JSON.parse(
      fs.readFileSync(path.join(__dirname, "_data/site.json"), "utf8")
    );
    const tag = `<script data-goatcounter="https://${site.goatcounter}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>\n`;
    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, entry.name);
        if (entry.isDirectory()) {
          walk(p);
        } else if (entry.name.endsWith(".html")) {
          if (templated.has(path.resolve(p))) continue;
          const content = fs.readFileSync(p, "utf8");
          if (content.includes("goatcounter.com") || content.includes("gc.zgo.at")) continue;
          if (!content.includes("</body>")) continue;
          fs.writeFileSync(p, content.replace("</body>", `${tag}</body>`));
        }
      }
    };
    walk(dir.output);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      layouts: "_layouts",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
};
