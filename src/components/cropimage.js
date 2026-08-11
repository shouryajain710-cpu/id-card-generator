function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

export async function getCroppedImageBlob(
  imageSrc,
  croppedAreaPixels,
  fileType = "image/jpeg"
) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  const width = Math.round(croppedAreaPixels.width);
  const height = Math.round(croppedAreaPixels.height);

  if (width <= 0 || height <= 0) {
    throw new Error("Invalid crop dimensions");
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    Math.round(croppedAreaPixels.x),
    Math.round(croppedAreaPixels.y),
    width,
    height,
    0,
    0,
    width,
    height
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