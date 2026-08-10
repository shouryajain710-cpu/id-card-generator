import { Sparkles, CreditCard } from "lucide-react";
import PhotoUploader from "./components/PhotoUploader";

function App() {
  return (
    <main className="min-h-screen bg-[#FBF3DD] text-[#0E1F17]">

      {/* Navbar */}
      <header className="border-b border-[#0E1F17]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B4332] text-[#F2C230]">
              <CreditCard size={21} />
            </div>

            <div>
              <h1 className="font-bold leading-none">
                HH GOA
              </h1>

              <p className="mt-1 text-xs text-[#0E1F17]/50">
                ID CARD GENERATOR
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#0E1F17]/10 bg-white/50 px-4 py-2 text-sm sm:flex">
            <Sparkles size={15} />
            Create your identity
          </div>

        </div>
      </header>


      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16">

        <div className="mb-12 max-w-2xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1B4332]">
            Digital Identity
          </p>

          <h2 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Create your
            <span className="text-[#1B4332]"> ID card.</span>
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#0E1F17]/60">
            Upload your photo, customize your identity and generate a
            personalized digital ID card in seconds.
          </p>

        </div>


        {/* Main workspace */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Left */}
          <section className="rounded-3xl border border-[#0E1F17]/10 bg-white p-6 shadow-[0_20px_60px_rgba(14,31,23,0.08)]">

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#0E1F17]/40">
                Step 01
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Upload your photo
              </h3>
            </div>

            <PhotoUploader />

          </section>


          {/* Right - temporary */}
          <section className="flex min-h-[400px] items-center justify-center rounded-3xl border border-[#0E1F17]/10 bg-[#1B4332] p-6 shadow-[0_20px_60px_rgba(14,31,23,0.12)]">

            <div className="text-center text-[#FBF3DD]">

              <CreditCard
                size={48}
                strokeWidth={1.5}
                className="mx-auto mb-5 opacity-60"
              />

              <h3 className="text-2xl font-bold">
                Your ID card
              </h3>

              <p className="mt-2 text-sm text-[#FBF3DD]/60">
                Your live preview will appear here.
              </p>

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}

export default App;