function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      if (image.naturalWidth === 0 || image.naturalHeight === 0) {
        reject(new Error("Image loaded with zero dimensions"));
        return;
      }

      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    image.src = url;
  });
}

export async function getCroppedImageBlob(
  imageSrc,
  croppedAreaPixels,
  fileType = "image/jpeg"
) {
  const image = await createImage(imageSrc);

  const cropX = Math.round(croppedAreaPixels.x);
  const cropY = Math.round(croppedAreaPixels.y);
  const cropWidth = Math.round(croppedAreaPixels.width);
  const cropHeight = Math.round(croppedAreaPixels.height);

  if (cropWidth <= 0 || cropHeight <= 0) {
    throw new Error(
      `Invalid crop size: ${cropWidth}x${cropHeight}`
    );
  }

  const canvas = document.createElement("canvas");

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas produced an empty blob"));
          return;
        }

        resolve(blob);
      },
      fileType,
      0.92
    );
  });
}