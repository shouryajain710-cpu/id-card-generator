import { useEffect, useMemo, useState } from "react";

/**
 * TypewriterHeading
 * Types out a sequence of styled text segments letter by letter, then
 * leaves a blinking cursor at the end. Segments can be separated by
 * a literal "\n" inside a segment's `text` to force a line break.
 *
 * Example:
 * <TypewriterHeading
 *   segments={[
 *     { text: "HACKER\n", className: "font-graffiti text-cream" },
 *     { text: "HOUSE ", className: "font-graffiti text-mustard" },
 *     { text: "गोवा", className: "font-hindi text-flamingo" },
 *   ]}
 * />
 */
export default function TypewriterHeading({
  segments,
  as: Tag = "h1",
  className = "",
  speed = 45,
  startDelay = 200,
  respectReducedMotion = true,
}) {
  const fullText = useMemo(
    () => segments.map((segment) => segment.text).join(""),
    [segments]
  );

  const prefersReducedMotion = useMemo(() => {
    if (!respectReducedMotion || typeof window === "undefined") {
      return false;
    }
    return window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
  }, [respectReducedMotion]);

  const [visibleCount, setVisibleCount] = useState(
    prefersReducedMotion ? fullText.length : 0
  );
  const [isDone, setIsDone] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    setVisibleCount(0);
    setIsDone(false);

    let index = 0;
    let intervalId;

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setVisibleCount(index);

        if (index >= fullText.length) {
          clearInterval(intervalId);
          setIsDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(intervalId);
    };
  }, [fullText, speed, startDelay, prefersReducedMotion]);

  // Slice each segment's text according to how many total
  // characters should currently be visible.
  let remaining = visibleCount;
  const renderedSegments = segments.map((segment, index) => {
    const take = Math.max(
      0,
      Math.min(segment.text.length, remaining)
    );
    remaining -= take;

    const visibleText = segment.text.slice(0, take);

    return (
      <span key={index} className={segment.className}>
        {visibleText.split("\n").map((line, lineIndex, arr) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < arr.length - 1 && <br />}
          </span>
        ))}
      </span>
    );
  });

  return (
    <Tag className={className}>
      {renderedSegments}
      <span
        aria-hidden="true"
        className={`typewriter-cursor ${isDone ? "opacity-60" : ""}`}
        style={{ height: "0.85em" }}
      />
      <span className="sr-only">{fullText.replace(/\n/g, " ")}</span>
    </Tag>
  );
}
