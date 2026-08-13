import { useState, useRef, useId } from "react";
import { Upload, ImagePlus, Trash2, AlertCircle, Loader2 } from "lucide-react";

<<<<<<< HEAD
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
=======
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB for raw photos
>>>>>>> 5ecd5c3 (Heic file addition)

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function isHeicFile(file) {
  if (!file) return false;
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  if (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
  if (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  ) {
    return true;
  }

  // Magic bytes check for HEIC/HEIF (ftyp box at byte offset 4)
  try {
    const slice = file.slice(0, 12);
    const buffer = await slice.arrayBuffer();
    if (buffer.byteLength >= 12) {
      const view = new DataView(buffer);
      const ftyp = String.fromCharCode(
        view.getUint8(4),
        view.getUint8(5),
        view.getUint8(6),
        view.getUint8(7)
      );
      if (ftyp === "ftyp") {
        const brand = String.fromCharCode(
          view.getUint8(8),
          view.getUint8(9),
          view.getUint8(10),
          view.getUint8(11)
        ).toLowerCase();
        if (
          brand.includes("heic") ||
          brand.includes("heif") ||
          brand.includes("mif1") ||
          brand.includes("msf1") ||
          brand.includes("hevc")
        ) {
          return true;
        }
      }
    }
  } catch (e) {
    // Ignore arrayBuffer error if file is restricted
  }

  return false;
}

async function isSupportedImage(file) {
  if (await isHeicFile(file)) return true;
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  if (type.startsWith("image/")) return true;

  const validExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".gif",
    ".bmp",
    ".heic",
    ".heif",
    ".svg",
  ];
  return validExtensions.some((ext) => name.endsWith(ext));
}

/**
 * PhotoUploader
 * Robust photo uploader with client-side HEIC/HEIF conversion to JPEG.
 */
export default function PhotoUploader({
  onImageSelect,
  onRemove,
  previewUrl,
  fileName,
  fileSize,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  const errorId = useId();
  const infoId = useId();

<<<<<<< HEAD
  const validateFile = (candidate) => {
    const fileName = candidate.name?.toLowerCase() || "";
    const fileType = candidate.type?.toLowerCase() || "";

    const isAcceptedType = ACCEPTED_TYPES.includes(fileType);

    const isAcceptedExtension =
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".webp") ||
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif");

    if (!isAcceptedType && !isAcceptedExtension) {
      return "Please upload a JPG, PNG, WEBP, or HEIC image.";
=======
  const validateFile = async (candidate) => {
    if (!(await isSupportedImage(candidate))) {
      return "Please upload a valid image file (JPG, JPEG, PNG, WEBP, HEIC, etc.).";
>>>>>>> 5ecd5c3 (Heic file addition)
    }

    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      return "Image must be smaller than 25 MB.";
    }

    return null;
  };

<<<<<<< HEAD
  const acceptFile = (candidate) => {
    const validationError = validateFile(candidate);

=======
  const acceptFile = async (candidate) => {
    const validationError = await validateFile(candidate);
>>>>>>> 5ecd5c3 (Heic file addition)
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const isHeic = await isHeicFile(candidate);

    // Convert HEIC / HEIF to JPEG for browser rendering & canvas compatibility
    if (isHeic) {
      setIsConverting(true);
      try {
        // Dynamically import heic2any on demand for code-splitting
        const heicModule = await import("heic2any");
        const convertFn =
          typeof heicModule.default === "function"
            ? heicModule.default
            : typeof heicModule === "function"
            ? heicModule
            : window.heic2any;

        if (!convertFn) {
          throw new Error("HEIC converter is not initialized.");
        }

        const result = await convertFn({
          blob: candidate,
          toType: "image/jpeg",
          quality: 0.92,
        });

        const convertedBlob = Array.isArray(result) ? result[0] : result;
        const newName = candidate.name.replace(/\.(heic|heif)$/i, "") + ".jpg";
        const convertedFile = new File([convertedBlob], newName, {
          type: "image/jpeg",
        });

        onImageSelect?.(convertedFile);
      } catch (err) {
        console.error("HEIC conversion error:", err);
        setError("Could not convert HEIC photo. Please try a JPG or PNG.");
      } finally {
        setIsConverting(false);
      }
      return;
    }

    // Standard image files
    onImageSelect?.(candidate);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
<<<<<<< HEAD

    // Reset immediately so re-selecting the exact same file (e.g. after
    // Cancel in the editor) still fires a change event next time.
=======
>>>>>>> 5ecd5c3 (Heic file addition)
    e.target.value = "";

    if (selected) acceptFile(selected);
  };

  const openFilePicker = () => inputRef.current?.click();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current += 1;

    if (e.dataTransfer.types?.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current = 0;
    setIsDragging(false);

    const dropped = e.dataTransfer.files?.[0];

    if (dropped) acceptFile(dropped);
  };

  const handleRemove = () => {
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove?.();
  };

  const handleReplaceClick = (e) => {
    e.stopPropagation();
    openFilePicker();
  };

  const hasImage = Boolean(previewUrl);

  return (
    <div className="w-full font-body">
      <label htmlFor={`photo-upload-${errorId}`} className="sr-only">
<<<<<<< HEAD
        Upload profile photo (JPG, PNG, WEBP, or HEIC, up to 5 MB)
=======
        Upload profile photo (JPG, JPEG, PNG, WEBP, or HEIC)
>>>>>>> 5ecd5c3 (Heic file addition)
      </label>

      <input
        ref={inputRef}
        id={`photo-upload-${errorId}`}
        type="file"
<<<<<<< HEAD
        accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
=======
        accept="image/*,.heic,.HEIC,.heif,.HEIF,image/heic,image/heif,image/heic-sequence,image/heif-sequence"
>>>>>>> 5ecd5c3 (Heic file addition)
        onChange={handleInputChange}
        className="sr-only"
      />

      {isConverting ? (
        <div className="flex w-full items-center justify-center gap-3 rounded-xl border-3 border-mustard bg-forest p-4 text-cream">
          <Loader2 className="h-6 w-6 animate-spin text-mustard" aria-hidden="true" />
          <span className="font-mono text-xs font-bold text-mustard">
            Converting HEIC photo to JPG...
          </span>
        </div>
      ) : !hasImage ? (
        <div
          role="button"
          tabIndex={0}
          aria-describedby={error ? errorId : infoId}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            group relative flex w-full cursor-pointer items-center gap-3
            rounded-xl border-3 border-dashed px-4 py-4 text-left
            transition-all duration-200 ease-out
            ${
              isDragging
                ? "scale-[1.01] border-flamingo bg-forest-dark"
                : "border-mustard/70 bg-forest hover:border-mustard hover:bg-forest-dark"
            }
            ${error ? "border-flamingo/80" : ""}
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard
          `}
        >
          <Upload
            className={`h-6 w-6 shrink-0 transition-transform duration-200 ${
              isDragging
                ? "scale-110 text-flamingo"
                : "text-mustard group-hover:-translate-y-0.5"
            }`}
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p className="font-display text-base leading-none text-cream">
              {isDragging ? "Drop it here" : "Click or drag a photo"}
            </p>

            <p id={infoId} className="mt-1 font-mono text-[11px] text-cream/60">
<<<<<<< HEAD
              JPG, PNG, WEBP, HEIC &middot; up to 5MB
=======
              JPG, JPEG, PNG, WEBP, HEIC &middot; up to 15MB
>>>>>>> 5ecd5c3 (Heic file addition)
            </p>
          </div>

          {error && (
            <div
              id={errorId}
              role="alert"
              className="absolute -bottom-6 left-0 flex items-center gap-1.5 font-mono text-xs text-flamingo"
            >
              <AlertCircle
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border-3 border-mustard bg-forest p-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-mustard/50 bg-forest-dark">
            <img
              src={previewUrl}
              alt={
                fileName
                  ? `Uploaded photo: ${fileName}`
                  : "Uploaded profile photo"
              }
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            {fileName && (
              <p className="truncate font-mono text-[11px] text-cream/60">
                {fileName}
                {typeof fileSize === "number" &&
                  ` · ${formatFileSize(fileSize)}`}
              </p>
            )}

            <button
              type="button"
              onClick={handleReplaceClick}
              className="mt-1.5 flex items-center gap-1.5 rounded-full border-2 border-mustard bg-transparent px-3 py-1 font-mono text-[11px] font-bold text-mustard transition-colors duration-150 hover:bg-mustard hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard"
            >
              <ImagePlus className="h-3 w-3" aria-hidden="true" />
              Change photo
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove uploaded photo"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-flamingo text-cream shadow-md transition-transform duration-150 hover:scale-105 hover:bg-flamingo/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}