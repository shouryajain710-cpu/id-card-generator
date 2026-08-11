import { useState, useEffect } from "react";
import PhotoUploader from "./PhotoUploader";
import PhotoEditor from "./PhotoEditor";

/**
 * IDCardForm
 * Renders every input for the ID card. It does NOT own the top-level form
 * state — App.jsx does — this component binds inputs to `formData` and
 * forwards changes up through `onChange`/`onImageSelect`/`onPreviewChange`.
 * That's what makes swapping App's useState for a Zustand store later a
 * no-op for this file: the props going up to App stay the same shape
 * either way.
 *
 * Photo editing lives entirely inside this component: it holds the
 * just-selected raw file (which drives whether PhotoEditor is open) and
 * the final processed photo, then forwards the processed result up via
 * the *same* onImageSelect/onPreviewChange props App already had — so
 * App.jsx doesn't need to know cropping exists.
 */
export default function IDCardForm({
  formData,
  onChange,
  onImageSelect,
  onPreviewChange,
}) {
  const [rawFile, setRawFile] = useState(null); // truthy => PhotoEditor is open
  const [processedPhoto, setProcessedPhoto] = useState(null); // { file, url } | null

  // Single owner of the processed-image object URL: created together with
  // the file so they're always in sync, revoked on replace and on unmount.
  useEffect(() => {
    onImageSelect?.(processedPhoto?.file ?? null);
    onPreviewChange?.(processedPhoto?.url ?? null);

    return () => {
      if (processedPhoto?.url) URL.revokeObjectURL(processedPhoto.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedPhoto]);

  const handleRawSelect = (file) => {
    setRawFile(file);
  };

  const handleEditorApply = (blob) => {
    const file = new File([blob], `cropped-${rawFile?.name ?? "photo.jpg"}`, {
      type: blob.type,
    });
    const url = URL.createObjectURL(file);
    setProcessedPhoto({ file, url });
    setRawFile(null);
  };

  const handleEditorCancel = () => {
    setRawFile(null);
  };

  const handleRemovePhoto = () => {
    setProcessedPhoto(null);
  };

  return (
    <div className="w-full rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8">
      {/* STEP 01 — Photo */}
      <div className="mb-8">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-mono text-xs font-bold tracking-widest text-flamingo">
            STEP 01
          </span>
          <h2 className="font-display text-xl text-ink">Upload your photo</h2>
        </div>

        <PhotoUploader
          onImageSelect={handleRawSelect}
          onRemove={handleRemovePhoto}
          previewUrl={processedPhoto?.url ?? null}
          fileName={processedPhoto?.file?.name}
          fileSize={processedPhoto?.file?.size}
        />

        {rawFile && (
          <PhotoEditor file={rawFile} onApply={handleEditorApply} onCancel={handleEditorCancel} />
        )}
      </div>

      {/* STEP 02 — Details */}
      <div>
        <div className="mb-5 flex items-baseline gap-2">
          <span className="font-mono text-xs font-bold tracking-widest text-flamingo">
            STEP 02
          </span>
          <h2 className="font-display text-xl text-ink">Enter your details</h2>
        </div>

        <div className="space-y-4">
          <Field
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Jordan Fernandes"
            required
          />

          <Field
            label="ID Number"
            name="idNumber"
            value={formData.idNumber}
            onChange={onChange}
            placeholder="HHG26-00123"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Designation / Role"
              name="designation"
              value={formData.designation}
              onChange={onChange}
              placeholder="Web Developer"
            />
            <Field
              label="Department"
              name="department"
              value={formData.department}
              onChange={onChange}
              placeholder="Engineering"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onChange}
              placeholder="+91 98765 43210"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="you@email.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small shared input primitive so every field looks/behaves identically. */
function Field({ label, name, value, onChange, type = "text", placeholder, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs font-bold text-ink/70">
        {label}
        {required && <span className="text-flamingo"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-forest/15 bg-cream/40 px-3.5 py-2.5 font-body text-sm text-ink placeholder:text-ink/30 transition-colors duration-150 focus:border-mustard focus:bg-white focus:outline-none focus:ring-2 focus:ring-mustard/30"
      />
    </div>
  );
}
