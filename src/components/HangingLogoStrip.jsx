import { motion, useReducedMotion } from "framer-motion";

export default function HangingLogoStrip({
  className = "",
  strapHeight = "clamp(6rem, 16vh, 11rem)",
}) {
  const prefersReducedMotion =
    useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative flex flex-col items-center ${className}`}
      style={{
        height: strapHeight,
      }}
    >
      {/* =====================================================
          HH TOP CLIP
      ====================================================== */}

      <motion.div
        className="
          relative
          z-20
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          border-2
          border-[#c8f526]
          bg-[#041610]
          shadow-[0_4px_10px_rgba(0,0,0,0.6)]
        "
        animate={
          prefersReducedMotion
            ? {
                rotate: 0,
              }
            : {
                rotate: [
                  -1.5,
                  1.5,
                  -1,
                  0.5,
                  -1.5,
                ],
              }
        }
        transition={{
          duration: 4.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          transformOrigin:
            "50% 100%",
        }}
      >
        <span
          className="
            font-mono
            text-xs
            font-black
            tracking-tighter
            text-[#c8f526]
          "
        >
          HH
        </span>

        {/* Grommet */}

        <span
          className="
            absolute
            -top-1.5
            h-2
            w-4
            rounded-full
            border
            border-[#c8f526]/60
            bg-[#092219]
          "
        />
      </motion.div>

      {/* =====================================================
          FLEXIBLE RIBBON
      ====================================================== */}

      <motion.div
        className="
          relative
          -mt-0.5
          flex-1
          w-8
        "
        animate={
          prefersReducedMotion
            ? {
                rotate: 0,
              }
            : {
                rotate: [
                  -0.7,
                  0.8,
                  -0.5,
                  0.9,
                  -0.7,
                ],
              }
        }
        transition={{
          duration: 5.2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          transformOrigin:
            "50% 0%",
        }}
      >
        {/* =================================================
            MAIN FLEXIBLE STRIP
        ================================================== */}

        <svg
          viewBox="0 0 40 260"
          preserveAspectRatio="none"
          className="
            absolute
            inset-0
            h-full
            w-full
            overflow-visible
          "
        >
          <defs>

            {/* Dark woven cyber lanyard stripes */}

            <pattern
              id="hhgoaRibbonPattern"
              patternUnits="userSpaceOnUse"
              width="16"
              height="16"
              patternTransform="rotate(0)"
            >
              <rect
                width="16"
                height="16"
                fill="#061c14"
              />

              <rect
                x="0"
                y="0"
                width="2"
                height="16"
                fill="#c8f526"
                opacity="0.85"
              />

              <rect
                x="14"
                y="0"
                width="2"
                height="16"
                fill="#c8f526"
                opacity="0.85"
              />
            </pattern>

            {/* Soft shadow */}

            <filter
              id="ribbonShadow"
              x="-50%"
              y="-20%"
              width="200%"
              height="140%"
            >
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="1.2"
                floodColor="#000000"
                floodOpacity="0.65"
              />
            </filter>

          </defs>

          {/* =================================================
              FLEXIBLE RIBBON SHAPE
          ================================================== */}

          <motion.path
            d="
              M 11 0
              C 10 38, 14 70, 11 105
              C 8 140, 15 172, 12 205
              C 10 228, 13 245, 12 260

              L 28 260

              C 29 245, 27 228, 29 205
              C 32 172, 25 140, 29 105
              C 32 70, 26 38, 29 0

              Z
            "
            fill="url(#hhgoaRibbonPattern)"
            stroke="#041610"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            filter="url(#ribbonShadow)"
            animate={
              prefersReducedMotion
                ? {
                    d: `
                      M 11 0
                      C 10 38, 14 70, 11 105
                      C 8 140, 15 172, 12 205
                      C 10 228, 13 245, 12 260
                      L 28 260
                      C 29 245, 27 228, 29 205
                      C 32 172, 25 140, 29 105
                      C 32 70, 26 38, 29 0
                      Z
                    `,
                  }
                : {
                    d: [
                      `
                        M 11 0
                        C 8 38, 15 70, 10 105
                        C 6 140, 17 172, 10 205
                        C 7 228, 14 245, 11 260
                        L 28 260
                        C 31 245, 24 228, 30 205
                        C 37 172, 26 140, 30 105
                        C 35 70, 27 38, 29 0
                        Z
                      `,

                      `
                        M 11 0
                        C 14 38, 7 70, 13 105
                        C 18 140, 6 172, 14 205
                        C 17 228, 9 245, 13 260
                        L 28 260
                        C 25 245, 32 228, 27 205
                        C 21 172, 33 140, 27 105
                        C 22 70, 31 38, 29 0
                        Z
                      `,

                      `
                        M 11 0
                        C 9 38, 14 70, 11 105
                        C 8 140, 15 172, 12 205
                        C 10 228, 13 245, 12 260
                        L 28 260
                        C 29 245, 27 228, 29 205
                        C 32 172, 25 140, 29 105
                        C 32 70, 26 38, 29 0
                        Z
                      `,
                    ],
                  }
            }
            transition={{
              duration: 5.2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

          {/* =================================================
              SMALL HIGHLIGHT
          ================================================== */}

          <motion.path
            d="
              M 14 3
              C 13 45, 16 75, 14 110
              C 12 150, 17 180, 15 220
            "
            fill="none"
            stroke="#c8f526"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
            animate={
              prefersReducedMotion
                ? {
                    opacity: 0.4,
                  }
                : {
                    opacity: [
                      0.2,
                      0.5,
                      0.25,
                      0.45,
                      0.2,
                    ],
                  }
            }
            transition={{
              duration: 4.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

        </svg>

        {/* =================================================
            SMALL METAL CONNECTOR
        ================================================== */}

        <div
          className="
            absolute
            bottom-[-2px]
            left-1/2
            h-2.5
            w-5
            -translate-x-1/2
            rounded-b-md
            border-x-2
            border-b-2
            border-[#c8f526]
            bg-[#041610]
            shadow-[0_2px_4px_rgba(0,0,0,0.5)]
          "
        />

      </motion.div>
    </div>
  );
}