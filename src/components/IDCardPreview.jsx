import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useReducedMotion,
} from "framer-motion";

import {
  User,
  Briefcase,
  Building2,
  QrCode,
  Download,
  CreditCard,
  Code2,
  Crown,
  Sprout,
  Triangle,
  Rocket,
  MapPin,
  Globe,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

import { formatName } from "../utils/formatName";

import {
  HH_GOA_WEBSITE_URL,
  HH_GOA_WEBSITE_LABEL,
  HH_GOA_BLURB,
} from "../utils/hhGoaConfig";

import HangingLogoStrip from "./HangingLogoStrip";
import ShareToXButton from "./ShareToXButton";

import { getRoleTitle } from "../utils/roleTitles";
import { canvasToHeicBlob } from "../utils/encodeHeic";

import nightBackImg from "../assets/nightBack.jpg";

export default function IDCardPreview({
  data,
  photoPreviewUrl,
  downloadFormat = "png",
}) {
  const [side, setSide] = useState("front");

  const [isDownloading, setIsDownloading] =
    useState(false);

  const [animationKey, setAnimationKey] =
    useState(0);

  const [isHovering, setIsHovering] =
    useState(false);

  const frontRef = useRef(null);
  const backRef = useRef(null);
  const cardAreaRef = useRef(null);

  const prefersReducedMotion =
    useReducedMotion();

  /* =====================================================
     3D CARD MOTION
  ===================================================== */

  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);

  const floatY = useMotionValue(0);
  const floatRotate = useMotionValue(0);

  const cursorRotateX =
    useMotionValue(0);

  const cursorRotateY =
    useMotionValue(0);

  const dragMeta = useRef({
    dragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startRotateY: 0,
    startRotateX: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: 0,
  });

  const springConfig =
    prefersReducedMotion
      ? { duration: 0 }
      : {
          type: "spring",
          stiffness: 140,
          damping: 18,
          mass: 0.9,
        };

  /* =====================================================
     FLOATING ANIMATION
  ===================================================== */

  useEffect(() => {
    if (prefersReducedMotion) {
      floatY.set(0);
      floatRotate.set(0);
      return;
    }

    const yAnimation = animate(
      floatY,
      [-5, 5, -5],
      {
        duration: 4.5,
        ease: "easeInOut",
        repeat: Infinity,
      }
    );

    const rotateAnimation = animate(
      floatRotate,
      [-0.8, 0.8, -0.8],
      {
        duration: 5.2,
        ease: "easeInOut",
        repeat: Infinity,
      }
    );

    return () => {
      yAnimation.stop();
      rotateAnimation.stop();
    };
  }, [
    floatY,
    floatRotate,
    prefersReducedMotion,
  ]);

  /* =====================================================
     RESET CURSOR TILT
  ===================================================== */

  useEffect(() => {
    if (prefersReducedMotion) {
      cursorRotateX.set(0);
      cursorRotateY.set(0);
    }
  }, [
    cursorRotateX,
    cursorRotateY,
    prefersReducedMotion,
  ]);

  /* =====================================================
     SETTLE CARD
  ===================================================== */

  const settleTo = (
    target,
    nextSide
  ) => {
    animate(
      rotateY,
      target,
      springConfig
    );

    animate(
      rotateX,
      0,
      springConfig
    );

    animate(
      cursorRotateX,
      0,
      springConfig
    );

    animate(
      cursorRotateY,
      0,
      springConfig
    );

    if (nextSide) {
      setSide(nextSide);
    }
  };

  /* =====================================================
     REPLAY CARD ENTRANCE WHEN PHOTO CHANGES
  ===================================================== */

  useEffect(() => {
    if (photoPreviewUrl) {
      setAnimationKey(
        (key) => key + 1
      );
    }
  }, [photoPreviewUrl]);

  /* =====================================================
     FORM DATA
  ===================================================== */

  const fullName =
    data.fullName?.trim()
      ? formatName(data.fullName)
      : "Your Name";

  const designation =
    data.designation?.trim() ||
    "Designation";

  const idNumber =
    data.idNumber?.trim() ||
    "ID Number";

  const department =
    data.department?.trim() || "";

  /*
   * UNIQUE HH GOA TITLE
   */
  const roleTitle =
    getRoleTitle(
      data.designation
    );

  /* =====================================================
     CURSOR TILT
  ===================================================== */

  const handlePointerEnter =
    () => {
      if (
        prefersReducedMotion
      ) {
        return;
      }

      setIsHovering(true);
    };

  const handlePointerMoveOnCard =
    (event) => {
      if (
        prefersReducedMotion
      ) {
        return;
      }

      const meta =
        dragMeta.current;

      if (meta.dragging) {
        return;
      }

      const element =
        cardAreaRef.current;

      if (!element) {
        return;
      }

      const rect =
        element.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left;

      const y =
        event.clientY -
        rect.top;

      const normalizedX =
        (x / rect.width) *
          2 -
        1;

      const normalizedY =
        (y / rect.height) *
          2 -
        1;

      const targetRotateY =
        normalizedX * 7;

      const targetRotateX =
        normalizedY * -5;

      animate(
        cursorRotateY,
        targetRotateY,
        {
          type: "spring",
          stiffness: 240,
          damping: 24,
          mass: 0.5,
        }
      );

      animate(
        cursorRotateX,
        targetRotateX,
        {
          type: "spring",
          stiffness: 240,
          damping: 24,
          mass: 0.5,
        }
      );
    };

  const handlePointerLeave =
    () => {
      setIsHovering(false);

      if (
        prefersReducedMotion
      ) {
        return;
      }

      animate(
        cursorRotateX,
        0,
        springConfig
      );

      animate(
        cursorRotateY,
        0,
        springConfig
      );
    };

  /* =====================================================
     FLIP
  ===================================================== */

  const handleFlip = () => {
    const nextSide =
      side === "front"
        ? "back"
        : "front";

    settleTo(
      rotateY.get() + 180,
      nextSide
    );
  };

  const handleCardKeyDown =
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        handleFlip();
      }
    };

  const handleBackButton =
    () => {
      handleFlip();
    };

  const handleFlatButton =
    () => {
      const current =
        rotateY.get();

      const nearestSameFace =
        Math.round(
          current / 360
        ) * 360;

      settleTo(
        nearestSameFace,
        side
      );
    };

  /* =====================================================
     DRAG TO SPIN
  ===================================================== */

  const handlePointerDown =
    (event) => {
      const meta =
        dragMeta.current;

      meta.dragging = true;

      meta.pointerId =
        event.pointerId;

      meta.startX =
        event.clientX;

      meta.startY =
        event.clientY;

      meta.startRotateY =
        rotateY.get();

      meta.startRotateX =
        rotateX.get();

      meta.lastX =
        event.clientX;

      meta.lastT =
        performance.now();

      meta.velocity = 0;
      meta.moved = 0;

      cursorRotateX.set(0);
      cursorRotateY.set(0);

      event.currentTarget.setPointerCapture?.(
        event.pointerId
      );
    };

  const handlePointerMove =
    (event) => {
      const meta =
        dragMeta.current;

      if (
        !meta.dragging ||
        event.pointerId !==
          meta.pointerId
      ) {
        return;
      }

      const deltaX =
        event.clientX -
        meta.startX;

      const deltaY =
        event.clientY -
        meta.startY;

      meta.moved =
        Math.max(
          meta.moved,
          Math.abs(deltaX),
          Math.abs(deltaY)
        );

      rotateY.set(
        meta.startRotateY +
          deltaX * 0.6
      );

      rotateX.set(
        Math.max(
          -12,
          Math.min(
            12,
            meta.startRotateX -
              deltaY * 0.12
          )
        )
      );

      const now =
        performance.now();

      const dt =
        now - meta.lastT;

      if (dt > 0) {
        meta.velocity =
          (event.clientX -
            meta.lastX) /
          dt;
      }

      meta.lastX =
        event.clientX;

      meta.lastT =
        now;
    };

  const handlePointerUp =
    (event) => {
      const meta =
        dragMeta.current;

      if (
        !meta.dragging ||
        event.pointerId !==
          meta.pointerId
      ) {
        return;
      }

      meta.dragging = false;

      event.currentTarget.releasePointerCapture?.(
        meta.pointerId
      );

      if (
        meta.moved < 6
      ) {
        handleFlip();
        return;
      }

      const flicked =
        rotateY.get() +
        meta.velocity * 140;

      const nearest =
        Math.round(
          flicked / 180
        ) * 180;

      const normalized =
        ((nearest % 360) +
          360) %
        360;

      const nextSide =
        normalized === 180
          ? "back"
          : "front";

      settleTo(
        nearest,
        nextSide
      );
    };

  /* =====================================================
     FILE NAME
  ===================================================== */

  const getBaseFileName =
    () => {
      const safeName =
        fullName
          .replace(
            /[^a-zA-Z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          );

      if (
        !safeName ||
        safeName ===
          "Your-Name"
      ) {
        return "HHGOA-2026-ID-Card";
      }

      return (
        "HHGOA-2026-" +
        safeName
      );
    };

  /* =====================================================
     EXPORT CARD
  ===================================================== */

  const exportCardToCanvas =
    async (element) => {
      if (!element) {
        throw new Error(
          "Card element not found."
        );
      }

      const clone =
        element.cloneNode(true);

      prepareCloneForExport(
        clone,
        element
      );

      const iframe =
        mountCloneInExportIframe(
          clone,
          element.offsetWidth,
          element.offsetHeight
        );

      try {
        await waitForImages(
          clone
        );

        await inlineSvgsInClone(
          clone
        );

        if (
          iframe.contentDocument
            ?.fonts?.ready
        ) {
          await iframe.contentDocument.fonts.ready;
        }

        return await html2canvas(
          clone,
          {
            window:
              iframe.contentWindow,
            scale: 3,
            backgroundColor:
              "#041610",
            allowTaint: true,
            useCORS: true,
            logging: false,
            foreignObjectRendering:
              false,
            width:
              element.offsetWidth,
            height:
              element.offsetHeight,
          }
        );
      } catch (error) {
        console.error(
          "Export error:",
          error
        );

        let errorMsg =
          "Failed to export ID card.";

        if (
          error instanceof Error
        ) {
          errorMsg +=
            ` ${error.message}`;
        }

        throw new Error(errorMsg);
      } finally {
        if (
          document.body.contains(
            iframe
          )
        ) {
          document.body.removeChild(
            iframe
          );
        }
      }
    };

  /* =====================================================
     DOWNLOAD
  ===================================================== */

  const handleDownload =
    async () => {
      if (isDownloading) {
        return;
      }

      setIsDownloading(true);

      try {
        const baseName =
          getBaseFileName();
        const extension =
          downloadFormat === "heic"
            ? "heic"
            : "png";

        const downloadCanvasAsPng =
          async (
            canvas,
            filename
          ) => {
            downloadDataUrl(
              canvas.toDataURL(
                "image/png"
              ),
              filename
            );
          };

        const downloadCanvasAsHeic =
          async (
            canvas,
            filename
          ) => {
            const blob =
              await canvasToHeicBlob(
                canvas
              );

            downloadBlob(
              blob,
              filename
            );
          };

        const downloadCanvas =
          downloadFormat === "heic"
            ? downloadCanvasAsHeic
            : downloadCanvasAsPng;

        const canvas =
          await exportCardToCanvas(
            getExportElement(
              side === "back" ? backRef : frontRef,
              side === "back"
                ? { skip3dWrapper: true }
                : undefined
            )
          );

        await downloadCanvas(
          canvas,
          `${baseName}-${side}.${extension}`
        );
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : String(error);

        console.error(
          "Failed to download ID card:",
          errorMsg
        );

        alert(
          `Download failed: ${errorMsg}. Please try again.`
        );
      } finally {
        setIsDownloading(false);
      }
    };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex w-full flex-col items-center">

      {/* SPIN CONTROLS */}

      <div className="mb-3 flex w-full max-w-xs items-center justify-between gap-2">

        <span className="rounded-full border border-mustard/40 bg-forest-dark/80 px-3 py-1 font-mono text-[9px] tracking-widest text-cream/70">
          DRAG ↔ TO SPIN
        </span>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={
              handleBackButton
            }
            className="rounded-full border border-mustard/40 bg-forest-dark/80 px-3 py-1 font-mono text-[9px] font-bold tracking-widest text-cream/80 transition-colors hover:text-mustard"
          >
            {side === "back"
              ? "FRONT"
              : "BACK"}
          </button>

          <button
            type="button"
            onClick={
              handleFlatButton
            }
            className="rounded-full border border-mustard/40 bg-forest-dark/80 px-3 py-1 font-mono text-[9px] font-bold tracking-widest text-cream/80 transition-colors hover:text-mustard"
          >
            FLAT
          </button>

        </div>

      </div>

      {/* CARD + LANYARD */}

      <div
        key={animationKey}
        className="
          id-card-hanging-rig
          relative
          flex
          w-full
          max-w-xs
          flex-col
          items-center
        "
      >

        <HangingLogoStrip
          className="-mb-1"
          strapHeight="clamp(6rem,16vh,11rem)"
        />

        {/* INTERACTIVE CARD AREA */}

        <div
          ref={cardAreaRef}
          role="button"
          tabIndex={0}
          aria-label="Drag to spin, or press Enter to flip, the ID card"
          onKeyDown={
            handleCardKeyDown
          }
          onPointerEnter={
            handlePointerEnter
          }
          onPointerMove={
            handlePointerMoveOnCard
          }
          onPointerLeave={
            handlePointerLeave
          }
          onPointerDown={
            handlePointerDown
          }
          onPointerMoveCapture={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerUp
          }
          className="
            relative
            aspect-[5/8]
            w-full
            cursor-grab
            touch-none
            select-none
            [perspective:1200px]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-mustard
            focus-visible:ring-offset-4
            active:cursor-grabbing
          "
        >

          {/* FLOATING 3D CARD */}

          <motion.div
            style={{
              rotateY:
                rotateY,
              rotateX:
                rotateX,
              y: floatY,
              rotateZ:
                floatRotate,
              transformStyle:
                "preserve-3d",
            }}
            animate={{
              scale:
                isHovering &&
                !prefersReducedMotion
                  ? 1.012
                  : 1,
            }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 260,
                damping: 20,
              },
            }}
            className="
              relative
              h-full
              w-full
              will-change-transform
            "
          >

            {/* FRONT */}

            <div
              ref={frontRef}
              className="
                absolute
                inset-0
                h-full
                w-full
                overflow-hidden
                rounded-[26px]
                border-2
                border-[#c8f526]
                bg-[#041610]
                text-white
                shadow-[0_0_30px_rgba(200,245,38,0.25)]
                crisp-card
              "
            >

              <div className="id-card-content-reveal h-full w-full">

                <FrontFace
                  fullName={
                    fullName
                  }
                  designation={
                    designation
                  }
                  idNumber={
                    idNumber
                  }
                  department={
                    department
                  }
                  photoPreviewUrl={
                    photoPreviewUrl
                  }
                  roleTitle={
                    roleTitle
                  }
                />

              </div>

            </div>

            {/* BACK */}

            <div
              ref={backRef}
              className="
                absolute
                inset-0
                h-full
                w-full
                overflow-hidden
                rounded-[26px]
                border-2
                border-[#c8f526]
                bg-[#041610]
                text-white
                shadow-[0_0_30px_rgba(200,245,38,0.25)]
                crisp-card
                [transform:rotateY(180deg)]
              "
            >

              <BackFace
                idNumber={
                  idNumber
                }
              />

            </div>

          </motion.div>

        </div>

      </div>

      {/* CARD ANIMATIONS */}

      <style>{`
        .id-card-hanging-rig {
          transform-origin: top center;

          animation:
            hhgoa-card-fall
            900ms
            cubic-bezier(0.22, 0.8, 0.25, 1)
            both,
            hhgoa-lanyard-swing
            3.4s
            ease-in-out
            900ms
            infinite;

          will-change:
            transform,
            opacity;
        }

        @keyframes hhgoa-card-fall {

          0% {
            opacity: 0;
            transform:
              translateY(-420px)
              rotate(-2deg);
          }

          70% {
            opacity: 1;
            transform:
              translateY(10px)
              rotate(0.8deg);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              rotate(0deg);
          }

        }

        .id-card-content-reveal {
          animation:
            hhgoa-content-reveal
            700ms
            ease-out
            450ms
            both;

          will-change:
            clip-path,
            opacity,
            transform;
        }

        @keyframes hhgoa-content-reveal {

          0% {
            opacity: 0;

            clip-path:
              inset(
                0 0 100% 0
              );

            transform:
              translateY(-8px);
          }

          100% {
            opacity: 1;

            clip-path:
              inset(
                0 0 0 0
              );

            transform:
              translateY(0);
          }

        }

        @media (
          prefers-reduced-motion: reduce
        ) {

          .id-card-hanging-rig {
            animation: none;
          }

          .id-card-content-reveal {
            animation: none;
            clip-path: none;
            opacity: 1;
            transform: none;
          }

        }
      `}</style>

      {/* HINT */}

      <p className="mt-3 font-mono text-[10px] tracking-widest text-ink/40">
        DRAG TO SPIN · MOVE TO TILT · TAP TO FLIP
      </p>

      {/* DOWNLOAD */}

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={
            handleDownload
          }
          disabled={
            isDownloading
          }
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-forest
            px-5
            py-2.5
            font-mono
            text-xs
            font-bold
            text-cream
            transition-all
            duration-150
            hover:-translate-y-0.5
            hover:bg-forest-dark
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Download
            className="h-4 w-4"
            aria-hidden="true"
          />

          {isDownloading
            ? downloadFormat === "heic"
              ? "Preparing HEIC..."
              : "Preparing PNG..."
            : `Download ${downloadFormat.toUpperCase()}`}
        </button>
        <ShareToXButton/>
      </div>

    </div>
  );
}

/* =====================================================
   CARD BACKGROUND (Night Beach Photo)
===================================================== */

function CardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img
        src={nightBackImg}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />

      {/* Dark overlay so card text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(3, 17, 11, 0.72), rgba(3, 17, 11, 0.35), rgba(3, 17, 11, 0.82))",
        }}
      />

      {/* Subtle cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#c8f526_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
    </div>
  );
}

/* =====================================================
   FRONT FACE
===================================================== */

function FrontFace({
  fullName,
  designation,
  idNumber,
  department,
  photoPreviewUrl,
  roleTitle,
}) {
  const displayId = idNumber && idNumber.trim() ? idNumber : "26-0427";
  const displayName = fullName && fullName.trim() && fullName !== "Your Name" ? formatName(fullName) : "YOUR NAME";
  const displayStack = designation && designation.trim() ? designation : "YOUR STACK";
  const displayDept = department && department.trim() ? department : "e.g. Full Stack / AI / Designer";
  const titleObj = roleTitle || getRoleTitle(designation) || { title: "THE CODE NOMAD" };

  return (
    <div
      data-export-root
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-4 sm:p-5 text-white crisp-card select-none"
    >
      <CardBackground />

      {/* TOP CONTENT LAYER */}
      <div className="relative z-10 space-y-3">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#c8f526]/25 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#c8f526] bg-[#041610] font-mono text-xs font-black text-[#c8f526] shadow-[0_0_8px_rgba(200,245,38,0.4)]">
              HH
            </div>
            <div>
              <p className="font-tech text-xs font-bold leading-none tracking-wider text-white">
                HACKER HOUSE
              </p>
              <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-[#c8f526]">
                GOA · 2026
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="block font-mono text-[7px] font-bold tracking-widest text-[#c8f526]/70 uppercase">
              BUILDER ID
            </span>
            <span className="inline-block rounded border border-[#c8f526]/40 bg-[#041610]/80 px-2 py-0.5 font-mono text-[10px] font-bold text-[#c8f526]">
              {displayId}
            </span>
          </div>
        </div>

        {/* PHOTO AREA */}
        <div className="relative my-2 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Corner reticle brackets */}
            <span className="absolute -left-2.5 -top-2.5 font-mono text-xs font-bold text-[#c8f526]">┌</span>
            <span className="absolute -right-2.5 -top-2.5 font-mono text-xs font-bold text-[#c8f526]">┐</span>
            <span className="absolute -bottom-2.5 -left-2.5 font-mono text-xs font-bold text-[#c8f526]">└</span>
            <span className="absolute -bottom-2.5 -right-2.5 font-mono text-xs font-bold text-[#c8f526]">┘</span>

            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#c8f526] bg-[#041610] shadow-[0_0_15px_rgba(200,245,38,0.3)] sm:h-28 sm:w-28">
              {photoPreviewUrl ? (
                <img
                  src={photoPreviewUrl}
                  alt={`Photo of ${displayName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-[#c8f526]/40" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* NAME & SCRIPT TAGLINE */}
          <div className="mt-3 text-center">
            <h2 className="font-syne text-xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-2xl">
              {displayName}
            </h2>
            <p className="font-script text-base text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-lg">
              Build. Ship. Launch.
            </p>
          </div>
        </div>

        {/* TECHNICAL ROWS */}
        <div className="space-y-2 pt-1">
          {/* STACK / ROLE */}
          <div className="flex items-center gap-2.5 rounded-xl border border-[#c8f526]/20 bg-[#061a13]/85 p-2 backdrop-blur-xs">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c8f526]/50 bg-[#041610] text-[#c8f526]">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-mono text-[7px] font-bold tracking-widest text-[#c8f526]/80 uppercase">
                STACK / ROLE
              </span>
              <p className="truncate font-mono text-xs font-bold text-white uppercase">
                {displayStack}
              </p>
              <p className="truncate font-mono text-[8px] text-white/50">
                {displayDept}
              </p>
            </div>
          </div>

          {/* BUILDER TITLE */}
          <div className="flex items-center gap-2.5 rounded-xl border border-[#c8f526]/20 bg-[#061a13]/85 p-2 backdrop-blur-xs">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c8f526]/50 bg-[#041610] text-[#c8f526]">
              <Crown className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-mono text-[7px] font-bold tracking-widest text-[#c8f526]/80 uppercase">
                BUILDER TITLE
              </span>
              <p className="truncate font-syne text-xs font-bold text-white uppercase">
                {titleObj.title}
              </p>
              <p className="truncate font-mono text-[8px] text-white/50">
                Ideas into impact.
              </p>
            </div>
          </div>
        </div>

        {/* THE JOURNEY TIMELINE */}
        <div className="pt-1">
          <p className="mb-1 text-center font-mono text-[8px] font-bold tracking-[0.2em] text-[#c8f526]/80 uppercase">
            THE JOURNEY
          </p>

          <div className="relative flex items-center justify-between px-2">
            {/* Connecting dashed line */}
            <div className="absolute left-6 right-6 top-3 -z-0 h-px border-t border-dashed border-[#c8f526]/40" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c8f526] bg-[#041610] text-[#c8f526]">
                <Sprout className="h-3 w-3" />
              </div>
              <span className="mt-0.5 font-mono text-[6px] font-bold text-white/70">01</span>
              <span className="font-mono text-[7px] font-bold text-[#c8f526]/90">GENESIS</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c8f526] bg-[#041610] text-[#c8f526]">
                <Triangle className="h-3 w-3" />
              </div>
              <span className="mt-0.5 font-mono text-[6px] font-bold text-white/70">02</span>
              <span className="font-mono text-[7px] font-bold text-[#c8f526]/90">TRIANGLE</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c8f526] bg-[#041610] text-[#c8f526]">
                <Code2 className="h-3 w-3" />
              </div>
              <span className="mt-0.5 font-mono text-[6px] font-bold text-white/70">03</span>
              <span className="font-mono text-[7px] font-bold text-[#c8f526]/90">BUILD</span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c8f526] bg-[#041610] text-[#c8f526]">
                <Rocket className="h-3 w-3" />
              </div>
              <span className="mt-0.5 font-mono text-[6px] font-bold text-white/70">04</span>
              <span className="font-mono text-[7px] font-bold text-[#c8f526]/90">LAUNCH</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD FRONT FOOTER */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#c8f526]/20 pt-2 font-mono text-[8px]">
        <div className="flex items-center gap-1 text-white/70">
          <MapPin className="h-3 w-3 text-[#c8f526]" />
          <span>GOA, INDIA</span>
          <span className="text-white/40">|</span>
          <span>28 - 31 OCT 2026</span>
        </div>
        <span className="font-bold text-[#c8f526]">#FrameInGoa</span>
      </div>
    </div>
  );
}

/* =====================================================
   BACK FACE
===================================================== */

function BackFace({ idNumber }) {
  const displayId = idNumber && idNumber.trim() ? idNumber : "26-0427";

  return (
    <div
      data-export-root
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[26px] border-2 border-[#c8f526] bg-[#041610] p-4 text-white shadow-[0_0_30px_rgba(200,245,38,0.25)] crisp-card select-none sm:p-5"
    >
      <CardBackground />

      {/* TOP CONTENT LAYER */}
      <div className="relative z-10 space-y-3">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#c8f526]/25 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#c8f526] bg-[#041610] font-mono text-xs font-black text-[#c8f526] shadow-[0_0_8px_rgba(200,245,38,0.4)]">
              HH
            </div>
            <div>
              <p className="font-tech text-xs font-bold leading-none tracking-wider text-white">
                HACKER HOUSE
              </p>
              <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-[#c8f526]">
                GOA · 2026
              </p>
            </div>
          </div>

          <div className="font-mono text-[9px] text-[#c8f526]/70">
            ┌ ┐
          </div>
        </div>

        {/* BLURB */}
        <div className="px-1 text-left">
          <p className="font-mono text-[10px] leading-relaxed text-white/85 sm:text-xs">
            A residency for builders — hackers, designers, and founders shipping real projects together in{" "}
            <span className="font-bold text-[#c8f526]">Goa.</span>
          </p>
        </div>

        {/* QR CODE SECTION */}
        <div className="relative flex flex-col items-center justify-center pt-1">
          <div className="relative">
            {/* Corner reticles */}
            <span className="absolute -left-2.5 -top-2.5 font-mono text-xs font-bold text-[#c8f526]">┌</span>
            <span className="absolute -right-2.5 -top-2.5 font-mono text-xs font-bold text-[#c8f526]">┐</span>
            <span className="absolute -bottom-2.5 -left-2.5 font-mono text-xs font-bold text-[#c8f526]">└</span>
            <span className="absolute -bottom-2.5 -right-2.5 font-mono text-xs font-bold text-[#c8f526]">┘</span>

            <div className="rounded-2xl border-2 border-[#c8f526] bg-[#f4efe0] p-2.5 shadow-[0_0_15px_rgba(200,245,38,0.25)]">
              <QRCodeSVG
                value={HH_GOA_WEBSITE_URL}
                size={108}
                bgColor="#f4efe0"
                fgColor="#041610"
                level="M"
              />
            </div>
          </div>

          <p className="mt-2 font-mono text-[10px] font-bold tracking-widest text-[#c8f526]">
            SCAN TO VISIT HH GOA
          </p>
          <p className="font-mono text-[9px] text-white/50">
            {HH_GOA_WEBSITE_LABEL}
          </p>
        </div>

        {/* ACCESS TERMINAL BOX */}
        <div className="rounded-xl border border-[#c8f526]/30 bg-[#02120c]/90 p-2.5 font-mono text-[9px] backdrop-blur-xs">
          {/* Terminal Title Bar */}
          <div className="mb-1.5 flex items-center justify-between border-b border-[#c8f526]/20 pb-1 text-[#c8f526]">
            <span className="font-bold tracking-wider">&gt; ACCESS TERMINAL</span>
            <span className="text-white/40">- □ ×</span>
          </div>

          {/* Lines */}
          <div className="space-y-0.5 text-white/80">
            <p><span className="text-[#c8f526]">&gt; STATUS   :</span> BUILDER</p>
            <p><span className="text-[#c8f526]">&gt; ACCESS   :</span> GRANTED</p>
            <p><span className="text-[#c8f526]">&gt; MISSION  :</span> BUILD · SHIP · LAUNCH</p>
            <p><span className="text-[#c8f526]">&gt; LOCATION :</span> GOA, INDIA</p>
            <p><span className="text-[#c8f526]">&gt; UNIT     :</span> {displayId}</p>
            <p className="text-[#c8f526] animate-pulse">&gt; _</p>
          </div>
        </div>
      </div>

      {/* CARD BACK FOOTER */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#c8f526]/20 pt-2 font-mono text-[9px]">
        <div>
          <span className="text-white/40">SERIAL NO. </span>
          <span className="font-bold text-[#c8f526]">{displayId}</span>
        </div>
        <Globe className="h-4 w-4 text-[#c8f526]/70" />
      </div>
    </div>
  );
}

/* =====================================================
   IMAGE LOADING
===================================================== */

const UNSUPPORTED_COLOR_PATTERN =
  /(oklab|oklch|lab\(|lch\(|hwb\(|color\()/i;

const EXPORT_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Bungee&family=Baloo+2:wght@600;700;800&family=Yatra+One&family=Rajdhani:wght@600;700&family=Syne:wght@700;800&family=Caveat:wght@600;700&display=swap";

const EXPORT_COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "fill",
  "stroke",
  "boxShadow",
  "textShadow",
];

function getExportElement(
  ref,
  { skip3dWrapper = false } = {}
) {
  const element = ref?.current;

  if (!element) {
    return null;
  }

  if (skip3dWrapper) {
    return (
      element.querySelector(
        "[data-export-root]"
      ) ?? element
    );
  }

  return element;
}

function sanitizeStylesheetText(css) {
  if (!css) {
    return css;
  }

  let sanitized = css.replace(
    /oklab\((?:[^()]|\([^()]*\))*\)/gi,
    (match) => toSafeCanvasColor(match)
  );

  sanitized = sanitized.replace(
    /oklch\((?:[^()]|\([^()]*\))*\)/gi,
    "rgb(200, 245, 38)"
  );

  sanitized = sanitized.replace(
    /(?:lab|lch|hwb)\((?:[^()]|\([^()]*\))*\)/gi,
    "rgb(255, 255, 255)"
  );

  return sanitized;
}

function injectExportStyles(doc) {
  const fontLink =
    doc.createElement("link");

  fontLink.rel = "stylesheet";
  fontLink.href = EXPORT_FONT_HREF;
  doc.head.appendChild(fontLink);

  document
    .querySelectorAll("style")
    .forEach((styleEl) => {
      if (!styleEl.textContent) {
        return;
      }

      const exportStyle =
        doc.createElement("style");

      exportStyle.textContent =
        sanitizeStylesheetText(
          styleEl.textContent
        );

      doc.head.appendChild(
        exportStyle
      );
    });
}

function toSafeCanvasColor(value) {
  if (typeof value !== "string") {
    return value;
  }

  const convertOklabToRgb = (oklabString) => {
    const match = oklabString.match(
      /oklab\(([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)(?:\s*\/\s*([-0-9.]+))?\)/i
    );

    if (!match) {
      return oklabString;
    }

    const [, l, a, b, alpha = "1"] = match;
    const L = Number(l);
    const A = Number(a);
    const B = Number(b);
    const alphaValue = Number(alpha);

    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
    const s_ = L - 0.0894841775 * A - 1.291485548 * B;

    const lCubed = l_ ** 3;
    const mCubed = m_ ** 3;
    const sCubed = s_ ** 3;

    let r =
      4.0767416621 * lCubed -
      3.3077115913 * mCubed +
      0.2309699292 * sCubed;
    let g =
      -1.2684380046 * lCubed +
      2.6097574011 * mCubed -
      0.3413193965 * sCubed;
    let bChannel =
      -0.0041960863 * lCubed -
      0.7034186147 * mCubed +
      1.707614701 * sCubed;

    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    bChannel = Math.max(0, Math.min(1, bChannel));

    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(bChannel * 255);

    return `rgba(${red}, ${green}, ${blue}, ${Math.min(1, Math.max(0, alphaValue))})`;
  };

  if (UNSUPPORTED_COLOR_PATTERN.test(value)) {
    if (value.includes("oklab")) {
      return convertOklabToRgb(value);
    }
    return "rgb(255, 255, 255)";
  }

  return value;
}

function sanitizeCSSValue(value) {
  if (typeof value !== "string" || !value) {
    return value;
  }

  if (!UNSUPPORTED_COLOR_PATTERN.test(value)) {
    return value;
  }

  let sanitized = value.replace(
    /oklab\((?:[^()]|\([^()]*\))*\)/gi,
    (match) => toSafeCanvasColor(match)
  );

  sanitized = sanitized.replace(
    /oklch\((?:[^()]|\([^()]*\))*\)/gi,
    "rgb(200, 245, 38)"
  );

  sanitized = sanitized.replace(
    /(?:lab|lch|hwb)\((?:[^()]|\([^()]*\))*\)/gi,
    "rgb(255, 255, 255)"
  );

  sanitized = sanitized.replace(
    /color\((?:[^()]|\([^()]*\))*\)/gi,
    (match) => {
      if (match.includes("srgb")) {
        return match;
      }
      return "rgb(255, 255, 255)";
    }
  );

  if (UNSUPPORTED_COLOR_PATTERN.test(sanitized)) {
    return null;
  }

  return sanitized;
}

function walkElementsInParallel(
  sourceRoot,
  cloneRoot,
  callback
) {
  callback(sourceRoot, cloneRoot);

  const sourceWalker =
    document.createTreeWalker(
      sourceRoot,
      NodeFilter.SHOW_ELEMENT
    );
  const cloneWalker =
    document.createTreeWalker(
      cloneRoot,
      NodeFilter.SHOW_ELEMENT
    );

  while (
    sourceWalker.nextNode() &&
    cloneWalker.nextNode()
  ) {
    callback(
      sourceWalker.currentNode,
      cloneWalker.currentNode
    );
  }
}

function inlineComputedStylesForExport(
  cloneEl,
  sourceEl
) {
  const computed =
    window.getComputedStyle(sourceEl);

  cloneEl.style.setProperty(
    "animation",
    "none",
    "important"
  );
  cloneEl.style.setProperty(
    "transition",
    "none",
    "important"
  );
  cloneEl.style.clipPath = "none";
  cloneEl.style.webkitClipPath = "none";
  cloneEl.style.transform = "none";
  cloneEl.style.transformOrigin =
    "center center";
  cloneEl.style.backfaceVisibility =
    "visible";
  cloneEl.style.webkitBackfaceVisibility =
    "visible";
  cloneEl.style.transformStyle = "flat";
  cloneEl.style.backdropFilter = "none";
  cloneEl.style.perspective = "none";

  EXPORT_COLOR_PROPS.forEach(
    (prop) => {
      const value = computed[prop];

      if (
        !value ||
        value === "none" ||
        value === "transparent"
      ) {
        return;
      }

      const sanitized =
        sanitizeCSSValue(value);

      if (
        sanitized === null ||
        sanitized === undefined
      ) {
        return;
      }

      cloneEl.style[prop] = sanitized;
    }
  );

  const backgroundImage =
    computed.backgroundImage;

  if (
    backgroundImage &&
    backgroundImage !== "none"
  ) {
    const safeBackground =
      sanitizeCSSValue(backgroundImage);

    if (safeBackground) {
      cloneEl.style.backgroundImage =
        safeBackground;
    } else {
      cloneEl.style.backgroundImage =
        "none";
    }
  }
}

function mountCloneInExportIframe(
  clone,
  width,
  height
) {
  const iframe =
    document.createElement("iframe");

  iframe.setAttribute(
    "aria-hidden",
    "true"
  );
  iframe.style.position = "fixed";
  iframe.style.left = "-200vw";
  iframe.style.top = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  document.body.appendChild(iframe);

  const doc =
    iframe.contentDocument;

  if (!doc) {
    throw new Error(
      "Could not create export frame."
    );
  }

  doc.open();
  doc.write(
    "<!DOCTYPE html><html><head></head><body></body></html>"
  );
  doc.close();

  injectExportStyles(doc);

  doc.body.style.margin = "0";
  doc.body.style.padding = "0";
  doc.body.style.width = `${width}px`;
  doc.body.style.height = `${height}px`;
  doc.body.style.backgroundColor =
    "#041610";
  doc.body.style.overflow = "hidden";

  doc.body.appendChild(clone);

  return iframe;
}

function prepareCloneForExport(clone, sourceElement) {
  clone.style.transform = "none";
  clone.style.perspective = "none";
  clone.style.position = "relative";
  clone.style.inset = "auto";
  clone.style.width = `${sourceElement.offsetWidth}px`;
  clone.style.height = `${sourceElement.offsetHeight}px`;
  clone.style.backfaceVisibility = "visible";
  clone.style.webkitBackfaceVisibility = "visible";
  clone.style.transformStyle = "flat";
  clone.style.overflow = "hidden";

  walkElementsInParallel(
    sourceElement,
    clone,
    (sourceEl, cloneEl) => {
      inlineComputedStylesForExport(
        cloneEl,
        sourceEl
      );
    }
  );

  clone
    .querySelectorAll(".id-card-scanline")
    .forEach((node) => {
      node.style.display = "none";
    });

  clone
    .querySelectorAll(".id-card-content-reveal")
    .forEach((node) => {
      node.style.clipPath = "none";
      node.style.webkitClipPath = "none";
      node.style.opacity = "1";
      node.style.transform = "none";
      node.style.setProperty(
        "animation",
        "none",
        "important"
      );
    });
}

async function inlineSvgsInClone(root) {
  const svgs = [
    ...root.querySelectorAll("svg"),
  ];

  await Promise.all(
    svgs.map(async (svg) => {
      const rect =
        svg.getBoundingClientRect();
      const width =
        rect.width ||
        Number(svg.getAttribute("width")) ||
        110;
      const height =
        rect.height ||
        Number(svg.getAttribute("height")) ||
        110;
      const svgString =
        new XMLSerializer().serializeToString(
          svg
        );
      const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
      const img =
        document.createElement("img");

      img.width = width;
      img.height = height;
      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
      img.style.display = "block";

      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(
            new Error(
              "Failed to inline SVG for export."
            )
          );
        img.src = url;
      });

      svg.replaceWith(img);
    })
  );
}

function loadImage(src) {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.onload = () => {
        resolve(image);
      };

      image.onerror = () => {
        reject(
          new Error(
            "Failed to load exported card image."
          )
        );
      };

      image.src = src;
    }
  );
}

/* =====================================================
   WAIT FOR IMAGES
===================================================== */

async function waitForImages(
  element
) {
  const images =
    element.querySelectorAll(
      "img"
    );

  await Promise.all(
    Array.from(images).map(
      (image) => {
        if (image.complete) {
          return Promise.resolve();
        }

        return new Promise(
          (resolve) => {
            image.onload =
              resolve;

            image.onerror =
              resolve;
          }
        );
      }
    )
  );
}

/* =====================================================
   DOWNLOAD DATA URL
===================================================== */

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);

  try {
    downloadDataUrl(url, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function downloadDataUrl(
  dataUrl,
  filename
) {
  const link =
    document.createElement(
      "a"
    );

  link.href = dataUrl;

  link.download =
    filename;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );
}