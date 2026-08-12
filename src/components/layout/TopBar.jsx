import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b-2 border-forest-dark bg-forest px-4 lg:px-6">

      <div className="flex items-center gap-3">

        <span className="h-2 w-2 rounded-full bg-flamingo" />

        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-mustard sm:text-xs">
          ID BUREAU OPEN
        </span>

        <span className="hidden font-mono text-[10px] tracking-[0.2em] text-cream/70 sm:inline">
          28–31 OCT 2026
        </span>

        <span className="hidden font-mono text-[10px] tracking-[0.2em] text-forest-light sm:inline">
          NORTH GOA
        </span>

      </div>

      <Link
        to="/create"
        className="font-mono text-[10px] font-bold tracking-[0.15em] text-cream transition-colors hover:text-mustard"
      >
        CREATE ID →
      </Link>

    </header>
  );
}