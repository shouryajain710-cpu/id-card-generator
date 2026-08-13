import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/back.jpg";

// Reusable "fade + rise into view" animation for scroll-triggered reveals.
// once: false so it replays both scrolling down into view and scrolling
// back up past it again.
const revealOnScroll = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function Home() {
  return (
    <main className="overflow-hidden bg-forest-dark">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[calc(100vh-48px)] overflow-hidden bg-forest px-6 py-16 lg:px-16">

        {/* Decorative circle */}
        <div className="pointer-events-none absolute left-[55%] top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[70px] border-mustard/20" />

        {/* Hero content */}
        <div className="relative mx-auto grid min-h-[75vh] max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT — TEXT */}
          <div>

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mustard px-4 py-2 shadow-[4px_4px_0_#000]">

              <span className="h-2 w-2 rounded-full bg-flamingo" />

              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-ink">
                OFFICIAL ID CARD BUREAU
              </span>

            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.82, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 15,
                mass: 0.9,
                delay: 0.1,
              }}
              className="relative text-[clamp(4rem,10vw,9rem)] leading-[0.82] tracking-tight"
            >
              <span className="font-graffiti text-shadow-graffiti block text-cream">
                HACKER
              </span>

              <span className="font-graffiti text-shadow-graffiti relative inline-block text-mustard">
                HOUSE
                <span
                  className="hhgoa-flag-wave hhgoa-goa-badge absolute -top-[0.55em] -right-[0.15em] font-hindi-script text-[0.55em] text-flamingo"
                  style={{ transform: "rotate(-8deg)" }}
                >
                  गोवा
                </span>
              </span>
            </motion.h1>

            <p className="mt-10 max-w-xl font-body text-lg font-semibold leading-8 text-cream/90">
              Create your official Hacker House Goa 2026
              digital identity. Upload your photo, enter your
              details and generate your card.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/create"
                className="rounded-xl border-2 border-ink bg-mustard px-6 py-4 font-mono text-sm font-bold text-ink shadow-[5px_5px_0_#000] transition-transform hover:-translate-y-1"
              >
                CREATE YOUR ID ↓
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border-2 border-cream px-6 py-4 font-mono text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-forest"
              >
                HOW IT WORKS
              </a>

            </div>

          </div>


          {/* RIGHT — HERO IMAGE */}
          <div className="relative flex items-center justify-center">

            <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border-4 border-mustard shadow-[10px_10px_0_#000]">

              {/* Goa background */}
              <img
                src={heroImage}
                alt="Goa beach and retro street scene"
                className="h-full min-h-[420px] w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-forest-dark/20" />

              {/* Floating ID Card */}
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-56 rotate-[-5deg] rounded-2xl border-4 border-mustard bg-forest-dark/95 p-5 shadow-[8px_8px_0_#000] backdrop-blur-sm sm:w-64">

                  {/* Card header */}
                  <div className="border-b border-mustard/40 pb-3">

                    <p className="font-display text-lg text-mustard">
                      HACKER HOUSE
                    </p>

                    <p className="font-mono text-[9px] text-cream/50">
                      GOA · 2026
                    </p>

                  </div>


                  {/* Profile placeholder */}
                  <div className="flex h-32 items-center justify-center">

                    <div className="h-20 w-20 rounded-full border-2 border-mustard/70 bg-cream/10" />

                  </div>


                  {/* Name */}
                  <p className="font-display text-xl text-cream">
                    YOUR NAME
                  </p>

                  <p className="mt-2 font-mono text-[9px] text-mustard">
                    HHG26-00123
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="bg-forest-dark px-6 py-20 lg:px-16"
      >

        <div className="mx-auto max-w-7xl">

          <motion.div className="mb-10" {...revealOnScroll}>

            <p className="font-mono text-xs font-bold tracking-[0.3em] text-flamingo">
              THE BUREAU
            </p>

            <h2 className="mt-3 font-display text-4xl text-cream sm:text-6xl">
              Get your card.
            </h2>

          </motion.div>


          <div className="grid gap-5 md:grid-cols-3">

            <motion.div
              {...revealOnScroll}
              transition={{ ...revealOnScroll.transition, delay: 0.05 }}
            >
              <Step
                number="01"
                title="Upload your photo"
                text="Drop in a clear profile photo and crop it for your card."
              />
            </motion.div>

            <motion.div
              {...revealOnScroll}
              transition={{ ...revealOnScroll.transition, delay: 0.15 }}
            >
              <Step
                number="02"
                title="Enter your details"
                text="Add your name, ID number, role and other information."
              />
            </motion.div>

            <motion.div
              {...revealOnScroll}
              transition={{ ...revealOnScroll.transition, delay: 0.25 }}
            >
              <Step
                number="03"
                title="Generate your card"
                text="Preview your finished identity card and export it."
              />
            </motion.div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-mustard px-6 py-20 lg:px-16">

        <motion.div
          className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center"
          {...revealOnScroll}
        >

          <div>

            <p className="font-mono text-xs font-bold tracking-[0.3em] text-flamingo">
              READY?
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-ink sm:text-6xl">
              Make your HH Goa identity.
            </h2>

          </div>

          <Link
            to="/create"
            className="shrink-0 rounded-xl border-2 border-ink bg-forest px-7 py-4 font-mono text-sm font-bold text-cream shadow-[5px_5px_0_#000] transition-transform hover:-translate-y-1"
          >
            BUILD MY ID →
          </Link>

        </motion.div>

      </section>

    </main>
  );
}


/* ================= STEP CARD ================= */

function Step({ number, title, text }) {
  return (
    <article className="rounded-2xl border-2 border-ink bg-cream p-6 shadow-[5px_5px_0_#000]">

      <span className="font-display text-5xl text-flamingo">
        {number}
      </span>

      <h3 className="mt-5 font-display text-2xl text-ink">
        {title}
      </h3>

      <p className="mt-3 font-body text-sm leading-6 text-ink/70">
        {text}
      </p>

    </article>
  );
}