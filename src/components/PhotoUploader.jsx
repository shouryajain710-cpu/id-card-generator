import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Upload, ImagePlus, RefreshCw, Trash2, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * PhotoUploader
 * Handles selecting, validating, previewing, replacing, and removing a
 * profile photo. Deliberately does NOT crop/zoom/pan/rotate — that's
 * PhotoEditor's job downstream. Fires `onImageSelect(file)` with a raw
 * File so a parent (eventually a Zustand store) can pick it up.
 */
export default function PhotoUploader({ onImageSelect }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const dragCounter = useRef(0); // tracks nested dragenter/dragleave pairs
  const errorId = useId();
  const infoId = useId();

  // Revoke the object URL whenever it changes or the component unmounts,
  // so we don't leak memory across uploads.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateFile = (candidate) => {
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      return "Please upload a JPG, PNG, or WEBP image.";
    }
    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      return "Image must be smaller than 5 MB.";
    }
    return null;
  };

  const acceptFile = useCallback(
    (candidate) => {
      const validationError = validateFile(candidate);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsProcessing(true);
      setError(null);

      // Revoke the previous preview before creating a new one.
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const nextUrl = URL.createObjectURL(candidate);
      setFile(candidate);
      setPreviewUrl(nextUrl);
      setIsProcessing(false);
      onImageSelect?.(candidate);
    },
    [previewUrl, onImageSelect]
  );

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
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
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onImageSelect?.(null);
  };

  const handleReplaceClick = (e) => {
    e.stopPropagation();
    openFilePicker();
  };

  const hasImage = Boolean(previewUrl);

  return (
    <div className="w-full max-w-sm font-body">
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
            group relative flex aspect-square w-full cursor-pointer flex-col
            items-center justify-center gap-3 rounded-2xl border-3 border-dashed
            px-6 text-center transition-all duration-200 ease-out
            ${
              isDragging
                ? "scale-[1.02] border-flamingo bg-forest-light/60"
                : "border-mustard/70 bg-forest-light/20 hover:border-mustard hover:bg-forest-light/40"
            }
            ${error ? "border-flamingo/80" : ""}
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard
          `}
        >
          {isProcessing ? (
            <RefreshCw className="h-8 w-8 animate-spin text-mustard" aria-hidden="true" />
          ) : (
            <Upload
              className={`h-8 w-8 transition-transform duration-200 ${
                isDragging ? "scale-110 text-flamingo" : "text-mustard group-hover:-translate-y-0.5"
              }`}
              aria-hidden="true"
            />
          )}

          <div className="space-y-1">
            <p className="font-display text-lg leading-none text-cream">
              {isDragging ? "Drop it here" : "Upload your photo"}
            </p>
            <p id={infoId} className="font-mono text-xs text-cream/60">
              Click or drag &middot; JPG, PNG, WEBP &middot; up to 5MB
            </p>
          </div>

          {error && (
            <div
              id={errorId}
              role="alert"
              className="mt-1 flex items-center gap-1.5 text-xs font-mono text-flamingo"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-3 border-mustard bg-forest-dark">
            <img
              src={previewUrl}
              alt={file?.name ? `Preview of uploaded photo: ${file.name}` : "Preview of uploaded photo"}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove uploaded photo"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-flamingo text-cream shadow-md transition-transform duration-150 hover:scale-105 hover:bg-flamingo/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            {file && (
              <p className="min-w-0 truncate font-mono text-xs text-cream/60">
                {file.name} &middot; {formatFileSize(file.size)}
              </p>
            )}

            <button
              type="button"
              onClick={handleReplaceClick}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border-2 border-mustard bg-transparent px-3 py-1.5 font-mono text-xs font-bold text-mustard transition-colors duration-150 hover:bg-mustard hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard"
            >
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Change photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}