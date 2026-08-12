export function chunkText(
  text: string,
  chunkSize: number = 800,
  overlap: number = 150,
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (endIndex === text.length) {
      break;
    }

    startIndex = endIndex - overlap;
  }

  return chunks;
}
