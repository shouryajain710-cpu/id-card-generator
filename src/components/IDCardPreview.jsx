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
import { toPng } from "html-to-image";

import { formatName } from "../utils/formatName";

import {
  HH_GOA_WEBSITE_URL,
  HH_GOA_WEBSITE_LABEL,
  HH_GOA_BLURB,
} from "../utils/hhGoaConfig";

import HangingLogoStrip from "./HangingLogoStrip";

import { getRoleTitle } from "../utils/roleTitles";

import nightBackImg from "../assets/nightBack.jpg";

export default function IDCardPreview({
  data,
  photoPreviewUrl,
}) {
  const [side, setSide] = useState("front");
  const [downloadSide, setDownloadSide] =
    useState("front");

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

  const exportCard =
    async (element) => {
      if (!element) {
        throw new Error(
          "Card element not found."
        );
      }

      const clone =
        element.cloneNode(true);

      clone.style.transform =
        "none";

      clone.style.position =
        "relative";

      clone.style.inset =
        "auto";

      clone.style.width =
        `${element.offsetWidth}px`;

      clone.style.height =
        `${element.offsetHeight}px`;

      clone.style.backfaceVisibility =
        "visible";

      clone.style.webkitBackfaceVisibility =
        "visible";

      const container =
        document.createElement(
          "div"
        );

      container.style.position =
        "fixed";

      container.style.left =
        "-100000px";

      container.style.top =
        "0";

      container.style.width =
        `${element.offsetWidth}px`;

      container.style.height =
        `${element.offsetHeight}px`;

      container.style.overflow =
        "hidden";

      container.style.pointerEvents =
        "none";

      container.style.zIndex =
        "-1";

      container.appendChild(
        clone
      );

      document.body.appendChild(
        container
      );

      try {
        await waitForImages(
          clone
        );

        const dataUrl =
          await toPng(
            clone,
            {
              pixelRatio: 3,
              cacheBust: true,
              backgroundColor:
                "#041610",
              width:
                element.offsetWidth,
              height:
                element.offsetHeight,
            }
          );

        return dataUrl;
      } finally {
        document.body.removeChild(
          container
        );
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

        if (
          downloadSide ===
          "front"
        ) {
          const dataUrl =
            await exportCard(
              frontRef.current
            );

          downloadDataUrl(
            dataUrl,
            `${baseName}-front.png`
          );

          return;
        }

        if (
          downloadSide ===
          "back"
        ) {
          const dataUrl =
            await exportCard(
              backRef.current
            );

          downloadDataUrl(
            dataUrl,
            `${baseName}-back.png`
          );

          return;
        }

        if (
          downloadSide ===
          "both"
        ) {
          const frontDataUrl =
            await exportCard(
              frontRef.current
            );

          const backDataUrl =
            await exportCard(
              backRef.current
            );

          const frontImage =
            await loadImage(
              frontDataUrl
            );

          const backImage =
            await loadImage(
              backDataUrl
            );

          const gap = 60;

          const canvasWidth =
            frontImage.width +
            backImage.width +
            gap;

          const canvasHeight =
            Math.max(
              frontImage.height,
              backImage.height
            );

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            canvasWidth;

          canvas.height =
            canvasHeight;

          const ctx =
            canvas.getContext(
              "2d"
            );

          if (!ctx) {
            throw new Error(
              "Could not create canvas context."
            );
          }

          ctx.fillStyle =
            "#FBF3DD";

          ctx.fillRect(
            0,
            0,
            canvasWidth,
            canvasHeight
          );

          ctx.drawImage(
            frontImage,
            0,
            (
              canvasHeight -
              frontImage.height
            ) / 2
          );

          ctx.drawImage(
            backImage,
            frontImage.width +
              gap,
            (
              canvasHeight -
              backImage.height
            ) / 2
          );

          const combinedDataUrl =
            canvas.toDataURL(
              "image/png"
            );

          downloadDataUrl(
            combinedDataUrl,
            `${baseName}-both.png`
          );
        }
      } catch (error) {
        console.error(
          "Failed to download ID card:",
          error
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

      {/* DOWNLOAD CONTROLS */}

      <div className="mt-5 flex flex-col items-center gap-3">

        <div
          className="
            inline-flex
            items-center
            rounded-full
            border-2
            border-mustard
            bg-forest-dark
            p-1
          "
          aria-label="Choose card side to download"
        >

          <button
            type="button"
            onClick={() =>
              setDownloadSide(
                "front"
              )
            }
            aria-pressed={
              downloadSide ===
              "front"
            }
            className={`
              rounded-full
              px-4
              py-1.5
              font-mono
              text-xs
              font-bold
              transition-colors
              duration-150
              ${
                downloadSide ===
                "front"
                  ? "bg-mustard text-ink"
                  : "text-cream/60 hover:text-cream"
              }
            `}
          >
            Front
          </button>

          <button
            type="button"
            onClick={() =>
              setDownloadSide(
                "back"
              )
            }
            aria-pressed={
              downloadSide ===
              "back"
            }
            className={`
              rounded-full
              px-4
              py-1.5
              font-mono
              text-xs
              font-bold
              transition-colors
              duration-150
              ${
                downloadSide ===
                "back"
                  ? "bg-mustard text-ink"
                  : "text-cream/60 hover:text-cream"
              }
            `}
          >
            Back
          </button>

          <button
            type="button"
            onClick={() =>
              setDownloadSide(
                "both"
              )
            }
            aria-pressed={
              downloadSide ===
              "both"
            }
            className={`
              rounded-full
              px-4
              py-1.5
              font-mono
              text-xs
              font-bold
              transition-colors
              duration-150
              ${
                downloadSide ===
                "both"
                  ? "bg-mustard text-ink"
                  : "text-cream/60 hover:text-cream"
              }
            `}
          >
            Both
          </button>

        </div>

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
            ? "Preparing PNG..."
            : `Download ${
                downloadSide ===
                "both"
                  ? "Both"
                  : downloadSide ===
                    "front"
                  ? "Front"
                  : "Back"
              }`}

        </button>

      </div>

    </div>
  );
}

/* =====================================================
   CARD BACKGROUND (Night Beach Photo)
===================================================== */

function CardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* Night beach background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${nightBackImg})` }}
      />

      {/* Cyber Grid Dots Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#c8f526_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#03110b]/80 via-transparent to-[#03110b]/90" />
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
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-4 sm:p-5 text-white crisp-card select-none">
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
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-4 sm:p-5 text-white crisp-card select-none">
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