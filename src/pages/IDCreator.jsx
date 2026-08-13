import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import IDCardForm from "../components/IDCardForm";
import IDCardPreview from "../components/IDCardPreview";
import greenBack from "../assets/greenBack.jpg";

const initialFormData = {
  fullName: "",
  idNumber: "",
  designation: "",
  department: "",
  photo: null,
};

export default function IDCreator() {
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // IDCardForm owns the raw-select -> PhotoEditor -> processed-photo
  // pipeline internally; this just receives the final processed File.
  const handleImageSelect = (file) => {
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handlePreviewChange = (url) => {
    setPhotoPreviewUrl(url);
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-8 lg:px-12"
      style={{
        backgroundImage: `url(${greenBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center 15%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/75 via-cream/25 to-transparent" />

      {/* PAGE CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* BACK */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 font-mono text-xs font-bold tracking-widest text-forest shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-flamingo"
        >
          <ArrowLeft size={14} />
          BACK TO BUREAU
        </Link>

        {/* HEADER */}
        <header className="mb-10">
          <p className="font-mono text-xs font-bold tracking-[0.3em] text-flamingo">
            HH GOA 2026 / ID BUREAU
          </p>

          <h1 className="mt-2 font-graffiti text-5xl text-ink sm:text-6xl">
            Build your ID card.
          </h1>

          <p className="mt-4 max-w-xl font-body text-sm font-bold leading-7 text-ink/70">
            Upload your photo and enter your details to create your
            official HH Goa identity card.
          </p>
        </header>

        {/* WORKSPACE */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* FORM */}
          <section className="rounded-3xl border-2 border-ink bg-white/90 p-6 shadow-[6px_6px_0_#062d20] backdrop-blur-sm sm:p-8">
            <IDCardForm
              formData={formData}
              onChange={handleChange}
              onImageSelect={handleImageSelect}
              onPreviewChange={handlePreviewChange}
            />
          </section>

          {/* PREVIEW */}
          <section className="lg:sticky lg:top-20">
            <IDCardPreview
              data={formData}
              photoPreviewUrl={photoPreviewUrl}
            />
          </section>
        </div>
      </div>
    </main>
  );
}