let workerInstance = null;
let workerInitPromise = null;

async function getHeicWorker() {
  if (workerInstance) {
    return workerInstance;
  }

  if (!workerInitPromise) {
    workerInitPromise = import(
      "../workers/heicEncoder.worker.js?worker"
    ).then(({ default: WorkerCtor }) => {
      workerInstance = new WorkerCtor();
      return workerInstance;
    });
  }

  return workerInitPromise;
}

export function encodeImageDataToHeic(
  imageData,
  quality = 85
) {
  return new Promise(async (resolve, reject) => {
    try {
      const worker = await getHeicWorker();

      const handleMessage = (event) => {
        worker.removeEventListener(
          "message",
          handleMessage
        );
        worker.removeEventListener(
          "error",
          handleError
        );

        if (event.data.ok) {
          resolve(
            new Blob([event.data.buffer], {
              type: "image/heic",
            })
          );
          return;
        }

        reject(
          new Error(
            event.data.error ||
              "HEIC encoding failed."
          )
        );
      };

      const handleError = (error) => {
        worker.removeEventListener(
          "message",
          handleMessage
        );
        worker.removeEventListener(
          "error",
          handleError
        );
        reject(error);
      };

      worker.addEventListener(
        "message",
        handleMessage
      );
      worker.addEventListener(
        "error",
        handleError
      );

      worker.postMessage({
        imageData,
        quality,
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function canvasToHeicBlob(
  canvas,
  quality = 85
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Could not read canvas for HEIC export."
    );
  }

  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  return encodeImageDataToHeic(
    imageData,
    quality
  );
}
