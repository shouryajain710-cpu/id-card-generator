import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t-2 border-mustard bg-forest-dark px-6 py-12 lg:px-12">

      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 md:grid-cols-3">

          {/* BRAND */}
          <div>
            <p className="font-display text-3xl text-mustard">
              HH GOA 2026
            </p>

            <p className="mt-4 max-w-xs font-mono text-xs leading-6 text-cream/60">
              The official digital ID card bureau for Hacker House Goa 2026.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.25em] text-flamingo">
              BUREAU
            </p>

            <div className="mt-4 flex flex-col gap-3 font-mono text-xs text-cream/70">

              <Link
                to="/"
                className="transition-colors hover:text-mustard"
              >
                HOME
              </Link>

              <Link
                to="/create"
                className="transition-colors hover:text-mustard"
              >
                CREATE ID
              </Link>

            </div>
          </div>

          {/* EVENT */}
          <div className="md:text-right">

            <p className="font-mono text-xs font-bold tracking-[0.25em] text-flamingo">
              EVENT
            </p>

            <p className="mt-4 font-mono text-xs leading-6 text-cream/60">
              HACKER HOUSE GOA
              <br />
              28–31 OCT 2026
              <br />
              NORTH GOA
            </p>

          </div>

        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-cream/10 pt-5 font-mono text-[10px] tracking-widest text-cream/40 sm:flex-row">
          <span>HH GOA 2026</span>
          <span>BUILD YOUR ID. OWN YOUR SIGNAL.</span>
        </div>

      </div>

    </footer>
  );
}