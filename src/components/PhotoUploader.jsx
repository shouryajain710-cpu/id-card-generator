import { useState, useRef, useId } from "react";
import { Upload, ImagePlus, Trash2, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
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
 * producing a processed image. This component no longer owns any preview
 * object URL itself: what it displays is entirely controlled by the
 * `previewUrl` prop, so it never has cropping/processing logic of its own.
 */
export default function PhotoUploader({
  onImageSelect,
  onRemove,
  previewUrl,
  fileName,
  fileSize,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  const errorId = useId();
  const infoId = useId();

  const validateFile = (candidate) => {
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      return "Please upload a JPG, PNG, or WEBP image.";
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
    // Reset immediately so re-selecting the exact same file (e.g. after
    // Cancel in the editor) still fires a change event next time.
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
    if (e.dataTransfer.types?.includes("Files")) setIsDragging(true);
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
    if (inputRef.current) inputRef.current.value = "";
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
        Upload profile photo (JPG, PNG, or WEBP, up to 5 MB)
      </label>
      <input
        ref={inputRef}
        id={`photo-upload-${errorId}`}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="sr-only"
      />

      {!hasImage ? (
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
              isDragging ? "scale-110 text-flamingo" : "text-mustard group-hover:-translate-y-0.5"
            }`}
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p className="font-display text-base leading-none text-cream">
              {isDragging ? "Drop it here" : "Click or drag a photo"}
            </p>
            <p id={infoId} className="mt-1 font-mono text-[11px] text-cream/60">
              JPG, PNG, WEBP &middot; up to 5MB
            </p>
          </div>

          {error && (
            <div
              id={errorId}
              role="alert"
              className="absolute -bottom-6 left-0 flex items-center gap-1.5 font-mono text-xs text-flamingo"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border-3 border-mustard bg-forest p-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-mustard/50 bg-forest-dark">
            <img
              src={previewUrl}
              alt={fileName ? `Uploaded photo: ${fileName}` : "Uploaded profile photo"}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            {fileName && (
              <p className="truncate font-mono text-[11px] text-cream/60">
                {fileName}
                {typeof fileSize === "number" && ` · ${formatFileSize(fileSize)}`}
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