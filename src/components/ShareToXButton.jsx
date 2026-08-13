export default function ShareToXButton() {
  const handleShare = () => {
    const text =
      "I just created my digital ID card using the HH Goa ID Card Generator! 🎫✨\n\n" +
      "A digital identity card generator built for Hacker House Goa, " +
      "with photo editing, custom roles, live 3D card preview and downloadable ID cards.\n\n" +
      "Built with React ⚛️\n\n" +
      "#HackerHouseGoa #HHGoa #ReactJS #WebDevelopment #DigitalIdentity";

    const shareUrl =
      "https://twitter.com/intent/tweet" +
      `?text=${encodeURIComponent(text)}`;

    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer,width=600,height=500"
    );
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="
        flex
        items-center
        justify-center
        gap-2
        rounded-full
        border-2
        border-ink
        bg-mustard
        px-5
        py-2.5
        font-mono
        text-xs
        font-bold
        text-ink
        transition-all
        duration-150
        hover:-translate-y-0.5
        hover:bg-mustard-light
        active:translate-y-0
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-mustard
      "
    >
      <span
        className="text-sm font-black leading-none"
        aria-hidden="true"
      >
        𝕏
      </span>

      Share to X
    </button>
  );
}