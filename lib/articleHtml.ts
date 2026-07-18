const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const sanitizeArticleHtml = (content: string) => {
  const allowedTags = new Set([
    "p", "br", "h1", "h2", "h3", "strong", "b", "em", "i", "u", "s", "blockquote",
    "ul", "ol", "li", "a", "table", "thead", "tbody", "tr", "th", "td", "hr", "div", "span",
    "pre", "code", "sup", "sub",
  ]);

  return content.replace(/<!--[\s\S]*?-->|<\/?[^>]+>/g, (tag) => {
    if (tag.startsWith("<!--")) return "";
    const match = tag.match(/^<\s*(\/?)\s*([a-z0-9]+)([^>]*)>/i);
    if (!match) return "";
    const [, closing, rawName, rawAttributes] = match;
    const name = rawName.toLowerCase();
    if (!allowedTags.has(name)) return "";
    if (closing) return `</${name}>`;

    const attributes: string[] = [];
    if (name === "a") {
      const hrefMatch = rawAttributes.match(/href\s*=\s*["']([^"']+)["']/i);
      const href = hrefMatch?.[1]?.trim() || "";
      if (/^(https?:\/\/|mailto:|\/)/i.test(href)) {
        const escapedHref = href.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
        attributes.push(`href="${escapedHref}"`, `rel="noopener noreferrer"`);
        if (/^https?:\/\//i.test(href)) attributes.push(`target="_blank"`);
      }
    }
    if (["th", "td"].includes(name)) {
      for (const attribute of ["colspan", "rowspan"]) {
        const size = rawAttributes.match(new RegExp(`${attribute}\\s*=\\s*["']?(\\d+)`, "i"))?.[1];
        if (size) attributes.push(`${attribute}="${Math.min(20, Number(size))}"`);
      }
    }
    const alignment = rawAttributes.match(/(?:text-align\s*:\s*|align\s*=\s*["']?)(left|center|right|justify)/i)?.[1];
    if (alignment) attributes.push(`style="text-align:${alignment.toLowerCase()}"`);

    return `<${name}${attributes.length ? ` ${attributes.join(" ")}` : ""}>`;
  }).trim();
};

export const legacySectionsToHtml = (sections: { heading: string; body: string }[]) =>
  sanitizeArticleHtml(sections.map((section) => {
    const generatedHeading = /^Guide section \d+$/i.test(section.heading.trim());
    const heading = generatedHeading
      ? ""
      : /<\/?[a-z][^>]*>/i.test(section.heading)
        ? section.heading
        : `<h2>${escapeHtml(section.heading)}</h2>`;
    return `${heading}${section.body}`;
  }).join("\n"));

export const htmlToPlainText = (value: string) =>
  value
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/\s*(p|div|h1|h2|h3|li|tr)\s*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
