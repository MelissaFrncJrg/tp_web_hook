export function $(sel: string): HTMLElement {
  const el = document.querySelector(sel) as HTMLElement | null;
  if (!el) throw new Error(`Élément introuvable: ${sel}`);
  return el;
}

export function log(message: unknown) {
  const host = $("#log");
  const item = document.createElement("div");
  item.className = "item";
  item.textContent = stringifySmart(message);
  host.prepend(item);
}

export function stringifySmart(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const obj = JSON.parse(trimmed);
        return JSON.stringify(obj, null, 2);
      } catch {
        return value;
      }
    }
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
