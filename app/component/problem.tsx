"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current && sectionRef.current) {
        const chars = textRef.current.querySelectorAll("span");

        gsap.fromTo(
          chars,
          {
            background: "#222",
            color: "transparent",
            opacity: 0.9,
            y: 20,
          },
          {
            background: "transparent",
            color: "white",
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom 80%",
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Utility: split string into spans (preserve spaces!)
  const splitText = (text: string) =>
    text.split(" ").map((char, i) => {
      return (
        <span
          key={i}
          className={
            char === " "
              ? "inline-block w-2 rounded-full py-0 mx-1"
              : "inline-block rounded-full py-0 mx-1"
          }
        >
          {char}&nbsp;
        </span>
      );
    });

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center gap-8 min-h-screen bg-black w-full"
    >
      <h3
        ref={textRef}
        className="text-7xl font-serif -tracking-wider whitespace-pre-wrap font-regular text-black max-w-7xl text-center"
      >
        {splitText(
          "Wasting hours with bots that don’t listen or support teams that don’t get it is frustrating. It kills trust, slows you down, and makes you want to quit."
        )}
      </h3>
    </section>
  );
}
