import { toPng } from "html-to-image";

/**
 * Renders an element to a PNG without using fetch for the generated data URL.
 * Width/height default to the element's own rendered size (a live UI screenshot).
 */
export async function exportElementToPng(
  element: HTMLElement,
  options: { width?: number; height?: number; pixelRatio?: number } = {},
): Promise<Blob | null> {
  try {
    const dataUrl = await toPng(element, {
      width: options.width,
      height: options.height,
      pixelRatio: options.pixelRatio ?? 2,
    });
    const base64 = dataUrl.split(",", 2)[1];

    if (!base64) {
      return null;
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: "image/png" });
  } catch {
    return null;
  }
}
