export function chunkText(text: string): string[] {
  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  if (!normalizedText) {
    return [];
  }

  const chunks = normalizedText
    .split(/(?=\d+\.\s)/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length > 1 && !/^\d+\.\s/.test(chunks[0])) {
    chunks.shift();
  }

  return chunks;
}
