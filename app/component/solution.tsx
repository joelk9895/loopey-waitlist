"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function Solution() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Reset states
    gsap.set(wordsRef.current, {
      opacity: 0,
      y: 100,
      rotationX: 45,
      transformOrigin: "center bottom",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });

    tl.to(wordsRef.current, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1,
      ease: "back.out(1.7)",
      stagger: {
        each: 0.05,
        from: "start",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const text =
    "What if support felt different? Imagine a system that doesn't just reply, but actually understands your frustration, learns your intent, and translates it into real action.";
  const words = text.split(" ");

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center gap-8 min-h-screen bg-gradient-to-b from-black to-blue-600 via-blue-500 text-white min-w-full px-4 sm:px-8"
    >
      <h3
        ref={textRef}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-relaxed -tracking-wider whitespace-pre-wrap font-regular text-white max-w-5xl text-center break-words"
        style={{ perspective: "1000px" }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => {
              wordsRef.current[index] = el;
            }}
            className="inline-block mr-3"
            style={{ transformStyle: "preserve-3d" }}
          >
            {word}
          </span>
        ))}
      </h3>
    </section>
  );
}
