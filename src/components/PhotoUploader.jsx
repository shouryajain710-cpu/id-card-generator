import { useState, useRef, useId } from "react";
import { Upload, ImagePlus, Trash2, AlertCircle } from "lucide-react";

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

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * PhotoUploader
 * Selects and validates a photo, then hands the raw File to the parent via
 * `onImageSelect` — the parent is responsible for opening PhotoEditor and
 * producing a processed image.
 */
export default function PhotoUploader({
  onImageSelect,
  onRemove,
  previewUrl,
  fileName,
  fileSize,
  isProcessing = false,
  processingMessage = "Processing photo…",
  error: externalError = null,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  const errorId = useId();
  const infoId = useId();

  const validateFile = (candidate) => {
    const candidateName = candidate.name?.toLowerCase() || "";
    const fileType = candidate.type?.toLowerCase() || "";

    const isAcceptedType = ACCEPTED_TYPES.includes(fileType);

    const isAcceptedExtension =
      candidateName.endsWith(".jpg") ||
      candidateName.endsWith(".jpeg") ||
      candidateName.endsWith(".png") ||
      candidateName.endsWith(".webp") ||
      candidateName.endsWith(".heic") ||
      candidateName.endsWith(".heif");

    if (!isAcceptedType && !isAcceptedExtension) {
      return "Please upload a JPG, PNG, WEBP, or HEIC image.";
    }

    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      return "Image must be smaller than 5 MB.";
    }

    return null;
  };

  const acceptFile = (candidate) => {
    const validationError = validateFile(candidate);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onImageSelect?.(candidate);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];

    // Reset immediately so re-selecting the exact same file still fires change.
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
  const displayError = externalError || error;

  return (
    <div className="w-full font-body">
      <label htmlFor={`photo-upload-${errorId}`} className="sr-only">
        Upload profile photo (JPG, PNG, WEBP, or HEIC, up to 5 MB)
      </label>

      <input
        ref={inputRef}
        id={`photo-upload-${errorId}`}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
        onChange={handleInputChange}
        className="sr-only"
      />

      {!hasImage ? (
        <div
          role="button"
          tabIndex={0}
          aria-describedby={displayError ? errorId : infoId}
          aria-busy={isProcessing}
          onClick={isProcessing ? undefined : openFilePicker}
          onKeyDown={isProcessing ? undefined : handleKeyDown}
          onDragEnter={isProcessing ? undefined : handleDragEnter}
          onDragOver={isProcessing ? undefined : handleDragOver}
          onDragLeave={isProcessing ? undefined : handleDragLeave}
          onDrop={isProcessing ? undefined : handleDrop}
          className={`
            group relative flex w-full items-center gap-3
            rounded-xl border-3 border-dashed px-4 py-4 text-left
            transition-all duration-200 ease-out
            ${
              isProcessing
                ? "cursor-wait border-mustard bg-forest-dark"
                : "cursor-pointer"
            }
            ${
              !isProcessing && isDragging
                ? "scale-[1.01] border-flamingo bg-forest-dark"
                : !isProcessing
                  ? "border-mustard/70 bg-forest hover:border-mustard hover:bg-forest-dark"
                  : ""
            }
            ${displayError ? "border-flamingo/80" : ""}
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard
          `}
        >
          <Upload
            className={`h-6 w-6 shrink-0 transition-transform duration-200 ${
              isProcessing
                ? "animate-pulse text-mustard"
                : isDragging
                  ? "scale-110 text-flamingo"
                  : "text-mustard group-hover:-translate-y-0.5"
            }`}
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p className="font-display text-base leading-none text-cream">
              {isProcessing
                ? processingMessage
                : isDragging
                  ? "Drop it here"
                  : "Click or drag a photo"}
            </p>

            <p id={infoId} className="mt-1 font-mono text-[11px] text-cream/60">
              {isProcessing
                ? "This may take a few seconds on first upload"
                : "JPG, PNG, WEBP, HEIC · up to 5MB"}
            </p>
          </div>

          {displayError && (
            <div
              id={errorId}
              role="alert"
              className="absolute -bottom-6 left-0 flex items-center gap-1.5 font-mono text-xs text-flamingo"
            >
              <AlertCircle
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{displayError}</span>
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
