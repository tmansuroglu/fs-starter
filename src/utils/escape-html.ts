const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

const ESCAPE_REGEX = /[&<>"']/g

export function escapeHtml(input: unknown): string {
  const str = String(input)
  return str.replace(ESCAPE_REGEX, (char) => ESCAPE_MAP[char] || char)
}
