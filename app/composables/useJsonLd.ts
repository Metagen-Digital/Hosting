// Emit a schema.org JSON-LD block for the current page.
//
// Pass a getter that returns null while data is still loading — the script tag
// is then simply omitted rather than shipping a half-empty graph. `key` keeps
// unhead from merging separate blocks into one; use a distinct key per type.
export function useJsonLd(
  key: string,
  data: MaybeRefOrGetter<Record<string, unknown> | null | undefined>,
) {
  useHead(computed(() => {
    const value = toValue(data)
    if (!value) return {}
    return {
      script: [{
        key: `ld-${key}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', ...value }),
      }],
    }
  }))
}

/** Strip HTML and collapse whitespace — for turning rich text into a meta description. */
export function toPlainText(html: string | null | undefined, max = 160): string {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  // Cut on a word boundary so descriptions don't end mid-word.
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`
}
