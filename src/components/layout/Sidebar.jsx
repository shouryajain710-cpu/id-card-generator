import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    let frameId = null;

    const handleScroll = () => {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll <= 0) {
          setActiveDot(0);
          frameId = null;
          return;
        }

        const scrollProgress = window.scrollY / maxScroll;

        // Four dots = four scroll stages.
        // The original pink dot stays pink, then the dots below it
        // progressively turn pink as the page moves down.
        const nextDot = Math.min(
          3,
          Math.floor(scrollProgress * 4)
        );

        setActiveDot(nextDot);
        frameId = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[80px] border-r-2 border-mustard bg-forest-dark lg:flex lg:flex-col">

      {/* HH LOGO */}
      <Link
        to="/"
        className="flex h-20 items-center justify-center border-b-2 border-mustard"
        aria-label="HH Goa home"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-mustard font-display text-xl text-forest-dark shadow-[3px_3px_0_#000]">
          HH
        </div>
      </Link>

      {/* NAV */}
      <nav className="flex flex-1 flex-col items-center justify-center gap-10">
        <Link
          to="/"
          className={`vertical-nav ${
            location.pathname === "/"
              ? "text-mustard"
              : "text-cream/50"
          }`}
        >
          / GOA
        </Link>

        <Link
          to="/create"
          className={`vertical-nav ${
            location.pathname === "/create"
              ? "text-mustard"
              : "text-cream/50"
          }`}
        >
          / 2026
        </Link>

        <span className="vertical-nav text-cream/50">
          / ID BUREAU
        </span>
      </nav>

      {/* DOTS */}
      <div className="flex flex-col items-center gap-2 pb-8">
        {[0, 1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              dot <= activeDot
                ? "bg-flamingo"
                : "bg-forest-light"
            }`}
          />
        ))}
      </div>

    </aside>
  );
}