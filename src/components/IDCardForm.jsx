import { useState, useEffect } from "react";
import PhotoUploader from "./PhotoUploader";
import PhotoEditor from "./PhotoEditor";

const DESIGNATION_PRESETS = [
  { label: "Web Developer", value: "Web Developer" },
  { label: "AI / ML", value: "AI / ML" },
  { label: "Data Analytics", value: "Data Analytics" },
  { label: "UI / UX", value: "UI / UX Designer" },
  { label: "Cybersecurity", value: "Cybersecurity" },
];

export default function IDCardForm({
  formData,
  onChange,
  onImageSelect,
  onPreviewChange,
  section = "all",
}) {
  const [rawFile, setRawFile] = useState(null);
  const [processedPhoto, setProcessedPhoto] = useState(null);

  // Only clean up the object URL.
  // Do not update the parent from this effect.
  useEffect(() => {
    return () => {
      if (processedPhoto?.url) {
        URL.revokeObjectURL(processedPhoto.url);
      }
    };
  }, [processedPhoto?.url]);

  const handleRawSelect = (file) => {
    setRawFile(file);
  };

  const handleEditorApply = (blob) => {
    const file = new File(
      [blob],
      `cropped-${rawFile?.name ?? "photo.jpg"}`,
      {
        type: blob.type,
      }
    );

    const url = URL.createObjectURL(file);

    setProcessedPhoto({
      file,
      url,
    });

    // Update parent directly when the processed photo is ready.
    onImageSelect?.(file);
    onPreviewChange?.(url);

    setRawFile(null);
  };

  const handleEditorCancel = () => {
    setRawFile(null);
  };

  const handleRemovePhoto = () => {
    setProcessedPhoto(null);

    // Update parent directly when photo is removed.
    onImageSelect?.(null);
    onPreviewChange?.(null);
  };

  const handlePresetSelect = (value) => {
    onChange({
      target: {
        name: "designation",
        value,
      },
    });
  };

  const showLeft = section === "left" || section === "all";
  const showRight = section === "right" || section === "all";

  return (
    <>
      {showLeft && (
        <div className="space-y-6">
          {/* STEP 01 */}
          <section>
            <SectionTitle number="01" title="Upload your photo" />

            <PhotoUploader
              onImageSelect={handleRawSelect}
              onRemove={handleRemovePhoto}
              previewUrl={processedPhoto?.url ?? null}
              fileName={processedPhoto?.file?.name}
              fileSize={processedPhoto?.file?.size}
            />

            {rawFile && (
              <PhotoEditor
                file={rawFile}
                onApply={handleEditorApply}
                onCancel={handleEditorCancel}
              />
            )}
          </section>

          {/* Name */}
          <Field
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Jordan Fernandes"
            required
          />

          {/* ID */}
          <Field
            label="ID Number"
            name="idNumber"
            value={formData.idNumber}
            onChange={onChange}
            placeholder="HHG26-00123"
            required
          />
        </div>
      )}

      {showRight && (
        <div className="space-y-6">
          {/* STEP 02 */}
          <section>
            <SectionTitle number="02" title="Your role" />

            <div>
              <Field
                label="Designation / Role"
                name="designation"
                value={formData.designation}
                onChange={onChange}
                placeholder="Web Developer"
              />

              <div className="mt-3">
                <p className="mb-2 font-mono text-[10px] font-bold tracking-widest text-ink/40">
                  QUICK SELECT
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {DESIGNATION_PRESETS.map((preset) => {
                    const isActive =
                      formData.designation === preset.value;

                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          handlePresetSelect(preset.value)
                        }
                        aria-pressed={isActive}
                        className={`rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard ${
                          isActive
                            ? "border-mustard bg-mustard text-ink"
                            : "border-forest/15 bg-cream/40 text-ink/60 hover:border-mustard hover:text-ink"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Department */}
          <Field
            label="Department"
            name="department"
            value={formData.department}
            onChange={onChange}
            placeholder="Engineering"
          />
        </div>
      )}
    </>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="mb-4 flex items-baseline gap-2">
      <span className="font-mono text-xs font-bold tracking-widest text-flamingo">
        STEP {number}
      </span>

      <h2 className="font-display text-xl text-ink">
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block font-mono text-xs font-bold text-ink/70"
      >
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