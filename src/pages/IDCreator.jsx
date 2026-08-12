import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import PhotoUploader from "../components/PhotoUploader";

export default function IDCreator() {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

useEffect(() => {
  if (!photo) {
    setPhotoPreview(null);
    return;
  }

  const url = URL.createObjectURL(photo);
  setPhotoPreview(url);

  return () => {
    URL.revokeObjectURL(url);
  };
}, [photo]);

  return (
    <main className="min-h-screen bg-cream px-4 py-10 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* BACK */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-forest transition-colors hover:text-flamingo"
        >
          <ArrowLeft size={14} />
          BACK TO BUREAU
        </Link>


        {/* HEADER */}
        <header className="mb-10">

          <p className="font-mono text-xs tracking-[0.3em] text-flamingo">
            HH GOA 2026 / ID BUREAU
          </p>

          <h1 className="mt-2 font-display text-5xl text-ink sm:text-6xl">
            Build your ID card.
          </h1>

          <p className="mt-4 max-w-xl font-body text-sm leading-7 text-ink/60">
            Upload your photo and enter your details to create
            your official HH Goa identity card.
          </p>

        </header>


        {/* WORKSPACE */}
        <div className="grid gap-8 lg:grid-cols-2">


          {/* FORM */}
          <section className="rounded-3xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0_#062d20] sm:p-8">

            <div className="mb-8">

              <p className="font-mono text-xs font-bold tracking-[0.2em] text-flamingo">
                STEP 01
              </p>

              <h2 className="mt-2 font-display text-3xl text-ink">
                Upload your photo
              </h2>

            </div>

            <PhotoUploader
              onImageSelect={setPhoto}
            />


            {/* TEMPORARY DETAILS SECTION */}
            {photo && (
              <div className="mt-10 border-t-2 border-ink/10 pt-8">

                <p className="font-mono text-xs font-bold tracking-[0.2em] text-flamingo">
                  STEP 02
                </p>

                <h2 className="mt-2 font-display text-3xl text-ink">
                  Enter your details
                </h2>

                <div className="mt-6 space-y-4">

                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 outline-none transition focus:border-forest"
                  />

                  <input
                    type="text"
                    placeholder="ID Number"
                    className="w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 outline-none transition focus:border-forest"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">

                    <input
                      type="text"
                      placeholder="Designation / Role"
                      className="w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 outline-none focus:border-forest"
                    />

                    <input
                      type="text"
                      placeholder="Department"
                      className="w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-3 outline-none focus:border-forest"
                    />

                  </div>

                </div>

              </div>
            )}

          </section>


          {/* PREVIEW */}
          <section className="lg:sticky lg:top-20">

            <div className="flex min-h-[500px] items-center justify-center rounded-3xl border-2 border-ink bg-forest-dark p-8 shadow-[6px_6px_0_#000]">

              {!photo ? (
                <div className="text-center text-cream">

                  <CreditCard
                    size={48}
                    strokeWidth={1.5}
                    className="mx-auto mb-5 opacity-40"
                  />

                  <h2 className="font-display text-3xl">
                    Your ID card
                  </h2>

                  <p className="mt-3 max-w-xs font-mono text-xs leading-6 text-cream/50">
                    Upload a photo to start building your card.
                  </p>

                </div>
              ) : (
                <div className="w-full max-w-sm">

                  <div className="aspect-[1.58/1] rounded-2xl border-4 border-mustard bg-forest p-6 shadow-[8px_8px_0_#000]">

                    <div className="flex justify-between border-b border-mustard/30 pb-3">

                      <div>
                        <p className="font-display text-xl text-mustard">
                          HACKER HOUSE
                        </p>

                        <p className="font-mono text-[9px] text-cream/50">
                          GOA · 2026
                        </p>
                      </div>

                      <CreditCard className="text-mustard" size={22} />

                    </div>

                    <div className="mt-5 flex gap-4">

                      <div className="h-24 w-20 overflow-hidden rounded-xl border-2 border-mustard/50 bg-forest-dark">
                        <img
                        src={photoPreview}
                        alt="Uploaded profile"
                        className="h-full w-full object-cover"
                      />
                      </div>

                      <div>
                        <p className="font-display text-2xl text-cream">
                          YOUR NAME
                        </p>

                        <p className="mt-2 font-mono text-xs text-mustard">
                          DESIGNATION
                        </p>
                      </div>

                    </div>

                    <div className="mt-6 flex justify-between border-t border-mustard/30 pt-3 font-mono text-[9px] text-cream/50">
                      <span>SERIAL NO.</span>
                      <span>HHG26-00123</span>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}