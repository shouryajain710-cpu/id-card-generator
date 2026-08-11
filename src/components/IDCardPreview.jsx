import { User, Briefcase, Building2, Phone, Mail, CreditCard } from "lucide-react";

/**
 * IDCardPreview
 * Purely presentational: renders whatever it's given in `data` and
 * `photoPreviewUrl`. It never touches form state or upload logic —
 * that separation is what lets this stay a dumb component even after
 * App's local state is swapped out for Zustand.
 */
export default function IDCardPreview({ data, photoPreviewUrl }) {
  const fullName = data.fullName?.trim() || "Your Name";
  const designation = data.designation?.trim() || "Designation";
  const idNumber = data.idNumber?.trim() || "ID Number";
  const department = data.department?.trim();
  const phone = data.phone?.trim();
  const email = data.email?.trim();

  return (
    <div className="flex w-full justify-center">
      <div className="relative aspect-[5/8] w-full max-w-xs overflow-hidden rounded-3xl border-3 border-mustard bg-forest text-cream shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-mustard/40 px-5 pt-5 pb-4">
          <div>
            <p className="font-display text-base leading-none text-mustard">HACKER HOUSE</p>
            <p className="font-mono text-[10px] tracking-[0.2em] text-cream/50">GOA · 2026</p>
          </div>
          <CreditCard className="h-5 w-5 text-cream/40" aria-hidden="true" />
        </div>

        {/* Photo */}
        <div className="flex flex-col items-center px-5 pt-6">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-3 border-mustard bg-forest-dark">
            {photoPreviewUrl ? (
              <img
                src={photoPreviewUrl}
                alt={fullName !== "Your Name" ? `Photo of ${fullName}` : "Uploaded profile photo"}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-cream/30" aria-hidden="true" />
            )}
          </div>

          <h3 className="mt-4 text-center font-display text-2xl leading-tight text-cream">
            {fullName}
          </h3>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mustard/15 px-3 py-1 font-mono text-xs font-bold text-mustard">
            <Briefcase className="h-3 w-3" aria-hidden="true" />
            {designation}
          </span>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-2.5 border-t border-cream/10 px-5 py-4 font-mono text-xs">
          {department && (
            <DetailRow icon={Building2} label={department} />
          )}
          {phone && <DetailRow icon={Phone} label={phone} />}
          {email && <DetailRow icon={Mail} label={email} />}
        </div>

        {/* Serial / footer */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t-2 border-dashed border-mustard/40 bg-forest-dark/60 px-5 py-3">
          <span className="font-mono text-[10px] text-cream/40">SERIAL NO.</span>
          <span className="font-mono text-xs font-bold text-mustard">{idNumber}</span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-cream/70">
      <Icon className="h-3.5 w-3.5 shrink-0 text-mustard/70" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </div>
  );
}