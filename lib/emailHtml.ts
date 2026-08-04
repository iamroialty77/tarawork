const URL_PATTERN = /(https?:\/\/[^\s<>"']+)/gi;

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trimTrailingPunctuation(url: string) {
  let trimmed = url;
  let trailing = "";
  while (/[),.!?:;]$/.test(trimmed)) {
    trailing = trimmed.slice(-1) + trailing;
    trimmed = trimmed.slice(0, -1);
  }
  return { url: trimmed, trailing };
}

export function linkifyPlainText(text: string) {
  let html = "";
  let lastIndex = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const rawUrl = match[0];
    const index = match.index ?? 0;
    const { url, trailing } = trimTrailingPunctuation(rawUrl);
    html += escapeHtml(text.slice(lastIndex, index));
    html += `<a href="${escapeHtml(url)}" style="color:#4f46e5;text-decoration:underline" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;
    html += escapeHtml(trailing);
    lastIndex = index + rawUrl.length;
  }
  html += escapeHtml(text.slice(lastIndex));
  return html;
}

export function renderPlainTextEmailHtml(text: string) {
  return linkifyPlainText(text).replace(/\n/g, "<br />");
}
