import { heic } from "icodec";
import heicEncWasm from "icodec/heic-enc.wasm?url";

let encoderReady = false;

self.onmessage = async (event) => {
  const { imageData, quality = 85 } = event.data;

  try {
    if (!encoderReady) {
      await heic.loadEncoder(heicEncWasm);
      encoderReady = true;
    }

    const bytes = heic.encode(imageData, {
      quality,
      preset: "medium",
    });

    self.postMessage(
      {
        ok: true,
        buffer: bytes.buffer,
      },
      [bytes.buffer]
    );
  } catch (error) {
    self.postMessage({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "HEIC encoding failed.",
    });
  }
};
