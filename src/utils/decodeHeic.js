import { heic, toBitDepth } from "icodec";
import heicDecWasm from "icodec/heic-dec.wasm?url";

let decoderReady = false;

export function isHeicFile(file) {
  if (!file) {
    return false;
  }

  const type = file.type?.toLowerCase() || "";
  const name = file.name?.toLowerCase() || "";

  return (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

async function ensureDecoder() {
  if (!decoderReady) {
    await heic.loadDecoder(heicDecWasm);
    decoderReady = true;
  }
}

function imageDataToJpegBlob(
  imageData,
  quality = 0.92
) {
  const canvas =
    document.createElement("canvas");

  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Could not prepare HEIC image for display."
    );
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              "Failed to convert HEIC to JPEG."
            )
          );
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

export async function heicFileToDisplayBlob(
  file
) {
  await ensureDecoder();

  const buffer = new Uint8Array(
    await file.arrayBuffer()
  );

  const decoded = heic.decode(buffer);
  const imageData =
    decoded.depth && decoded.depth !== 8
      ? toBitDepth(decoded, 8)
      : decoded;

  return imageDataToJpegBlob(imageData);
}

export async function heicFileToJpegFile(
  file
) {
  const blob = await heicFileToDisplayBlob(file);
  const baseName = file.name.replace(
    /\.(heic|heif)$/i,
    ""
  );

  return new File(
    [blob],
    `${baseName || "photo"}.jpg`,
    { type: "image/jpeg" }
  );
}
