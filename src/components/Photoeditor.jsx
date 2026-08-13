import { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, RotateCcw } from "lucide-react";
import { getCroppedImageBlob } from "../utils/cropImage";

/**
 * PhotoEditor
 * Centered modal that opens whenever `file` is truthy. Owns crop/zoom
 * state and its own object URL for displaying `file` in the cropper —
 * that URL is created and revoked entirely within this component, so
 * nothing here leaks outside regardless of Apply or Cancel.
 *
 * Returns a processed Blob through `onApply`; never touches the original
 * File beyond reading it.
 */
export default function PhotoEditor({ file, onApply, onCancel }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!file) {
      return undefined;
    }

    let cancelled = false;
    let objectUrl = null;

    const loadImage = async () => {
      setIsLoadingImage(true);
      setLoadError(null);
      setImageUrl(null);

      try {
        objectUrl = URL.createObjectURL(file);

        const image = new Image();
        image.src = objectUrl;

        await new Promise((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () =>
            reject(
              new Error(
                "This image format is not supported in your browser."
              )
            );
        });

        if (cancelled) {
          return;
        }

        setImageUrl(objectUrl);
      } catch (error) {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }

        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load image."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingImage(false);
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [file]);

  const handleCropComplete = useCallback((_croppedArea, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleApply = async () => {
    if (!imageUrl || !croppedAreaPixels) {
      return;
    }

    setIsApplying(true);

    try {
      const outputType =
        file.type?.startsWith("image/")
          ? file.type
          : "image/jpeg";

      const blob = await getCroppedImageBlob(
        imageUrl,
        croppedAreaPixels,
        outputType
      );

      onApply(blob);
    } catch (err) {
      console.error("Failed to crop image:", err);
    } finally {
      setIsApplying(false);
    }
  };

  if (!file) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-editor-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-forest/10 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="photo-editor-title" className="font-display text-xl text-ink">
            Adjust your photo
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close editor without saving changes"
            className="rounded-full p-1.5 text-ink/50 transition-colors duration-150 hover:bg-forest/5 hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-ink">
          {isLoadingImage && (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-cream/70">
              Loading photo…
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-xs text-flamingo">
              {loadError}
            </div>
          )}

          {imageUrl && !loadError && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="photo-editor-zoom" className="mb-1.5 block font-mono text-xs font-bold text-ink/70">
            Zoom
          </label>
          <input
            id="photo-editor-zoom"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-mustard"
            disabled={!imageUrl || Boolean(loadError)}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            disabled={!imageUrl || Boolean(loadError)}
            className="flex items-center gap-1.5 rounded-full border-2 border-forest/15 px-3.5 py-2 font-mono text-xs font-bold text-ink/70 transition-colors duration-150 hover:border-forest/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-2 font-mono text-xs font-bold text-ink/60 transition-colors duration-150 hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={
                isApplying ||
                isLoadingImage ||
                Boolean(loadError) ||
                !croppedAreaPixels
              }
              className="rounded-full bg-forest px-5 py-2 font-mono text-xs font-bold text-cream transition-colors duration-150 hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isApplying ? "Applying…" : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
