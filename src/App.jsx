import { useState } from "react";
import IDCardForm from "./components/IDCardForm";
import IDCardPreview from "./components/IDCardPreview";

// Local state for now. Every value that lives here is exactly what will
// move into a Zustand store later — the shape doesn't change, only where
// it's declared. IDCardForm and IDCardPreview already only talk to their
// parent through props, so that swap won't touch either component.
const initialFormData = {
  fullName: "",
  idNumber: "",
  designation: "",
  department: "",
  phone: "",
  email: "",
  photo: null,
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file) => {
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  // PhotoUploader owns the object URL lifecycle; it just hands the current
  // URL up here so IDCardPreview has something to render.
  const handlePreviewChange = (url) => {
    setPhotoPreviewUrl(url);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10 sm:px-8 lg:px-12">
      <header className="mx-auto mb-10 max-w-6xl text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-flamingo">
          HH GOA 2026
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Build your ID card
        </h1>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <IDCardForm
          formData={formData}
          onChange={handleChange}
          onImageSelect={handleImageSelect}
          onPreviewChange={handlePreviewChange}
        />

        <div className="lg:sticky lg:top-10">
          <IDCardPreview data={formData} photoPreviewUrl={photoPreviewUrl} />
        </div>
      </main>
    </div>
  );
}

export default App;