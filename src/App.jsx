import { useState } from "react";
import IDCardForm from "./components/IDCardForm";
import IDCardPreview from "./components/IDCardPreview";

const initialFormData = {
  fullName: "",
  idNumber: "",
  designation: "",
  department: "",
  photo: null,
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (file) => {
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const handlePreviewChange = (url) => {
    setPhotoPreviewUrl(url);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10 sm:px-8 lg:px-10">

      {/* Header */}
      <header className="mx-auto mb-10 max-w-7xl text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-flamingo">
          HH GOA 2026
        </p>

        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Build your ID card
        </h1>
      </header>

      {/* Main workspace */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_360px_1fr] lg:items-start">

        {/* LEFT */}
        <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
          <IDCardForm
            section="left"
            formData={formData}
            onChange={handleChange}
            onImageSelect={handleImageSelect}
            onPreviewChange={handlePreviewChange}
          />
        </div>

        {/* CENTER */}
        <div className="lg:sticky lg:top-8">
          <IDCardPreview
            data={formData}
            photoPreviewUrl={photoPreviewUrl}
          />
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
          <IDCardForm
            section="right"
            formData={formData}
            onChange={handleChange}
          />
        </div>

      </main>
    </div>
  );
}

export default App;