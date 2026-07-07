// Jekyll built post URLs (/:year/:month/:day/:title/) from the post date in
// the build machine's timezone; the deployed site was built on UTC runners,
// so the live URLs use the UTC calendar day. `date` here is the exact
// instant (see addDateParsing in eleventy.config.js), so its UTC day
// reproduces the live URLs on any machine.
function utcDay(data) {
  const date = data.page.date;
  if (!(date instanceof Date) || isNaN(date)) return null;
  const iso = date.toISOString();
  return { y: iso.slice(0, 4), m: iso.slice(5, 7), d: iso.slice(8, 10) };
}

module.exports = {
  eleventyComputed: {
    permalink(data) {
      if (data.published === false) return false;
      const date = utcDay(data);
      if (!date) return data.permalink;
      return `/${date.y}/${date.m}/${date.d}/${data.page.fileSlug}/`;
    },
    eleventyExcludeFromCollections(data) {
      return data.published === false;
    },
    displayDate(data) {
      const date = utcDay(data);
      return date ? `${date.y}-${date.m}-${date.d}` : "";
    },
  },
};
