let workerInstance = null;
let workerInitPromise = null;
let encoderReadyPromise = null;
let encodeRequestId = 0;

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

function waitForWorkerMessage(
  worker,
  predicate,
  timeoutMs = 120000
) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      reject(new Error("HEIC encoder timed out."));
    }, timeoutMs);

    const handleMessage = (event) => {
      if (!predicate(event.data)) {
        return;
      }

      window.clearTimeout(timeoutId);
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      resolve(event.data);
    };

    const handleError = (error) => {
      window.clearTimeout(timeoutId);
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      reject(error);
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);
  });
}

export function ensureHeicEncoderReady() {
  if (!encoderReadyPromise) {
    encoderReadyPromise = (async () => {
      const worker = await getHeicWorker();
      worker.postMessage({ type: "init" });

      const response = await waitForWorkerMessage(
        worker,
        (data) => data?.type === "init"
      );

      if (!response.ok) {
        throw new Error(
          response.error ||
            "Failed to load HEIC encoder."
        );
      }
    })();
  }

  return encoderReadyPromise;
}

export function preloadHeicEncoder() {
  return ensureHeicEncoderReady().catch(() => {});
}

export async function encodeImageDataToHeic(
  imageData,
  quality = 82
) {
  const worker = await getHeicWorker();
  await ensureHeicEncoderReady();

  const requestId = ++encodeRequestId;
  const transferableBuffer = imageData.data.buffer;

  worker.postMessage(
    {
      type: "encode",
      id: requestId,
      imageData: {
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
      },
      quality,
    },
    [transferableBuffer]
  );

  const response = await waitForWorkerMessage(
    worker,
    (data) =>
      data?.type === "encode" &&
      data.id === requestId
  );

  if (!response.ok) {
    throw new Error(
      response.error ||
        "HEIC encoding failed."
    );
  }

  return new Blob([response.buffer], {
    type: "image/heic",
  });
}

export async function canvasToHeicBlob(
  canvas,
  quality = 82
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
