// Removes: blank lines, comment lines, trailing comments.
export function removeComments(text: readonly string[]): readonly string[] {
  return (
    text
      // Blank lines.
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      // Comment lines.
      .filter((l) => !l.startsWith("//"))
      // Trailing comments.
      .map((l) => l.split("//")[0].trim())
  );
}
