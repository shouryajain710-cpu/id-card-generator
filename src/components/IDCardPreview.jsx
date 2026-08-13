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
                "#1B4332",
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
                rounded-3xl
                border-3
                border-mustard
                bg-forest
                text-cream
                shadow-[0_22px_45px_rgba(0,0,0,0.30)]
                [backface-visibility:hidden]
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
                rounded-3xl
                border-3
                border-mustard
                bg-forest
                text-cream
                shadow-[0_22px_45px_rgba(0,0,0,0.30)]
                [backface-visibility:hidden]
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
  return (
    <div className="relative h-full w-full">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b-2
          border-dashed
          border-mustard/40
          px-5
          pb-4
          pt-5
        "
      >

        <div>

          <p
            className="
              font-display
              text-base
              leading-none
              text-mustard
            "
          >
            HACKER HOUSE
          </p>

          <p
            className="
              font-mono
              text-[10px]
              tracking-[0.2em]
              text-cream/50
            "
          >
            GOA · 2026
          </p>

        </div>

        <CreditCard
          className="h-5 w-5 text-cream/40"
          aria-hidden="true"
        />

      </div>

      {/* PHOTO */}

      <div
        className="
          flex
          flex-col
          items-center
          px-5
          pt-6
        "
      >

        <div
          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border-3
            border-mustard
            bg-forest-dark
          "
        >

          {photoPreviewUrl ? (
            <img
              src={
                photoPreviewUrl
              }
              alt={
                fullName !==
                "Your Name"
                  ? `Photo of ${fullName}`
                  : "Uploaded profile photo"
              }
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <User
              className="
                h-10
                w-10
                text-cream/30
              "
              aria-hidden="true"
            />
          )}

        </div>

        {/* NAME */}

        <h3
          className="
            mt-4
            text-center
            font-display
            text-2xl
            leading-tight
            text-cream
          "
        >
          {fullName}
        </h3>

        {/* DESIGNATION */}

        <span
          className="
            mt-2
            inline-flex
            max-w-full
            items-center
            gap-1.5
            rounded-full
            bg-mustard/15
            px-3
            py-1
            font-mono
            text-xs
            font-bold
            text-mustard
          "
        >

          <Briefcase
            className="h-3 w-3 shrink-0"
            aria-hidden="true"
          />

          <span className="truncate">
            {designation}
          </span>

        </span>

        {/* UNIQUE HH GOA TITLE */}

        {roleTitle && (
          <div
            className="
              mt-3
              w-full
              text-center
            "
          >

            <p
              className="
                font-mono
                text-[7px]
                font-bold
                tracking-[0.22em]
                text-flamingo
              "
            >
              HH GOA TITLE
            </p>

            <p
              className="
                mt-1
                font-graffiti
                text-[11px]
                leading-tight
                text-mustard
              "
            >
              {roleTitle.title}
            </p>

          </div>
        )}

      </div>

      {/* DETAILS */}

      <div
        className="
          mt-4
          space-y-2.5
          border-t
          border-cream/10
          px-5
          py-4
          font-mono
          text-xs
        "
      >

        {department && (
          <DetailRow
            icon={Building2}
            label={
              department
            }
          />
        )}

      </div>

      {/* FOOTER */}

      <CardFooter
        idNumber={idNumber}
      />

    </div>
  );
}

/* =====================================================
   BACK FACE
===================================================== */

function BackFace({
  idNumber,
}) {
  return (
    <div className="relative h-full w-full">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b-2
          border-dashed
          border-mustard/40
          px-5
          pb-4
          pt-5
        "
      >

        <div>

          <p
            className="
              font-display
              text-base
              leading-none
              text-mustard
            "
          >
            HACKER HOUSE
          </p>

          <p
            className="
              font-mono
              text-[10px]
              tracking-[0.2em]
              text-cream/50
            "
          >
            GOA · 2026
          </p>

        </div>

        <QrCode
          className="h-5 w-5 text-cream/40"
          aria-hidden="true"
        />

      </div>

      {/* BLURB */}

      <div className="px-5 pt-5">

        <p
          className="
            font-body
            text-xs
            leading-relaxed
            text-cream/70
          "
        >
          {HH_GOA_BLURB}
        </p>

      </div>

      {/* QR */}

      <div
        className="
          flex
          flex-col
          items-center
          px-5
          pt-6
        "
      >

        <div
          className="
            rounded-2xl
            border-3
            border-mustard
            bg-cream
            p-3
          "
        >

          <QRCodeSVG
            value={
              HH_GOA_WEBSITE_URL
            }
            size={112}
            bgColor="#FBF3DD"
            fgColor="#0E1F17"
            level="M"
          />

        </div>

        <p
          className="
            mt-3
            font-mono
            text-[10px]
            font-bold
            tracking-widest
            text-mustard
          "
        >
          SCAN TO VISIT HH GOA
        </p>

        <p
          className="
            mt-1
            font-mono
            text-[10px]
            text-cream/50
          "
        >
          {HH_GOA_WEBSITE_LABEL}
        </p>

      </div>

      {/* FOOTER */}

      <CardFooter
        idNumber={idNumber}
      />

    </div>
  );
}

/* =====================================================
   CARD FOOTER
===================================================== */

function CardFooter({
  idNumber,
}) {
  return (
    <div
      className="
        absolute
        inset-x-0
        bottom-0
        flex
        items-center
        justify-between
        border-t-2
        border-dashed
        border-mustard/40
        bg-forest-dark/60
        px-5
        py-3
      "
    >

      <span
        className="
          font-mono
          text-[10px]
          text-cream/40
        "
      >
        SERIAL NO.
      </span>

      <span
        className="
          font-mono
          text-xs
          font-bold
          text-mustard
        "
      >
        {idNumber}
      </span>

    </div>
  );
}

/* =====================================================
   DETAIL ROW
===================================================== */

function DetailRow({
  icon: Icon,
  label,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-cream/70
      "
    >

      <Icon
        className="
          h-3.5
          w-3.5
          shrink-0
          text-mustard/70
        "
        aria-hidden="true"
      />

      <span className="truncate">
        {label}
      </span>

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