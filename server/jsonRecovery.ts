/**
 * Attempt to recover a truncated JSON string by closing open brackets/braces.
 * This handles the common case where the AI response hits the token limit
 * and the JSON is cut off mid-string or mid-object.
 */
export function recoverTruncatedJson(text: string): unknown {
  let cleaned = text.trim();

  // If it already parses, return it
  try { return JSON.parse(cleaned); } catch { /* continue recovery */ }

  // Track string/bracket state
  let inString = false;
  let escaped = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }

    if (inString) {
      if (ch === '"') { inString = false; }
      continue;
    }

    if (ch === '"') { inString = true; continue; }
  }

  // If we're inside a string, truncate back to the last comma or opening bracket
  if (inString) {
    let truncateAt = cleaned.length;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      if (cleaned[i] === ',' || cleaned[i] === '[' || cleaned[i] === '{') {
        truncateAt = i;
        if (cleaned[i] === ',') truncateAt = i;
        break;
      }
    }
    cleaned = cleaned.substring(0, truncateAt);
    cleaned = cleaned.replace(/,\s*$/, '');
  }

  // Count remaining open brackets/braces and close them
  const closeStack: string[] = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\') { esc = true; continue; }
    if (inStr) { if (ch === '"') inStr = false; continue; }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{') closeStack.push('}');
    else if (ch === '[') closeStack.push(']');
    else if (ch === '}' || ch === ']') closeStack.pop();
  }

  // Close any open string
  if (inStr) cleaned += '"';

  // Remove trailing comma before closing
  cleaned = cleaned.replace(/,\s*$/, '');

  // Close all open brackets/braces in reverse order
  while (closeStack.length > 0) {
    cleaned += closeStack.pop();
  }

  return JSON.parse(cleaned);
}
