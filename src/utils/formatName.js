/**
 * formatName
 * Normalizes a raw name string into Title Case for display purposes only.
 * Does NOT mutate what the user typed in the form — call this where the
 * name is rendered (IDCardPreview), not in the input's onChange.
 *
 * "shorya jain"   -> "Shorya Jain"
 * "SHORYA JAIN"   -> "Shorya Jain"
 * "sHoRyA jAiN"   -> "Shorya Jain"
 * "shorya   jain" -> "Shorya Jain"
 */
export function formatName(name) {
  if (!name) return "";

  return name
    .trim()
    .replace(/\s+/g, " ") // collapse extra internal whitespace
    .split(" ")
    .map((word) =>
      word.length ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
    )
    .join(" ");
}