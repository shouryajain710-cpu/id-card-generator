import { heic } from "icodec";
import heicEncWasm from "icodec/heic-enc.wasm?url";

let encoderReady = false;

async function ensureEncoder() {
  if (!encoderReady) {
    await heic.loadEncoder(heicEncWasm);
    encoderReady = true;
  }
}

self.onmessage = async (event) => {
  const { type, id, imageData, quality = 82 } = event.data;

  if (type === "init") {
    try {
      await ensureEncoder();
      self.postMessage({ ok: true, type: "init" });
    } catch (error) {
      self.postMessage({
        ok: false,
        type: "init",
        error:
          error instanceof Error
            ? error.message
            : "Failed to load HEIC encoder.",
      });
    }
    return;
  }

  if (type !== "encode") {
    return;
  }

  try {
    await ensureEncoder();

    const pixels = new Uint8ClampedArray(
      imageData.data.buffer,
      imageData.data.byteOffset,
      imageData.data.byteLength
    );

    const frame = new ImageData(
      pixels,
      imageData.width,
      imageData.height
    );

    const bytes = heic.encode(frame, {
      quality,
      preset: "fast",
    });

    self.postMessage(
      {
        ok: true,
        type: "encode",
        id,
        buffer: bytes.buffer,
      },
      [bytes.buffer]
    );
  } catch (error) {
    self.postMessage({
      ok: false,
      type: "encode",
      id,
      error:
        error instanceof Error
          ? error.message
          : "HEIC encoding failed.",
    });
  }
};
