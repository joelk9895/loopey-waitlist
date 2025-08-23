"use client";
import Join from "./component/join";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import Problem from "./component/problem";
import Solution from "./component/solution";
import Promise from "./component/promise";
import Cta from "./component/cta";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const text1Ref = useRef<HTMLHeadingElement | null>(null);
  const text2Ref = useRef<HTMLHeadingElement | null>(null);
  const waitlistRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.set(cardRef.current, {
          transformPerspective: 1200, // adds depth
          transformOrigin: "bottom center", // hinge at the bottom
        });

        gsap.fromTo(
          cardRef.current,
          { rotateX: 0 },
          {
            rotateX: 60, // folding back
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 30%",
              end: "200% 30%",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          cardRef.current,
          { z: 0 },
          {
            z: -600,
            rotateX: 70, // folding back
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "bottom 10%",
              end: "250% top",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          text1Ref.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 30%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          text2Ref.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top top",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          waitlistRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 30%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white">
      <section className="flex flex-col items-center justify-start gap-8 min-h-[200vh] min-w-full bg-gradient-to-b from-[#0052d4] to-blue-600">
        <div
          ref={cardRef}
          className="flex min-w-[90%] md:min-w-[85%] min-h-[90vh] bg-white rounded-xl flex-col items-center justify-center gap-4 sm:gap-8 sticky top-[5vh] shadow-xl px-4 sm:px-8"
        >
          {/* Navbar */}
          <nav className="flex items-center justify-center p-4 sm:p-6 bg-transparent w-full">
            <div className="flex gap-2 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 items-baseline mx-[0.5px]">
                  <div className="rounded-full bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] h-3 w-2"></div>
                  <div className="rounded-full bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] h-3 w-2"></div>
                </div>
                <svg width="20" height="10" viewBox="0 0 300 100" fill="none">
                  <path
                    d="M 10 30 Q 150 90 290 30"
                    stroke="url(#grad)"
                    strokeWidth="50"
                    fill="transparent"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#0052d4" />
                      <stop offset="50%" stopColor="#20bdff" />
                      <stop offset="100%" stopColor="#6fb1fc" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-black flex items-baseline bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] bg-clip-text text-transparent">
                loopey
              </h1>
            </div>
          </nav>

          {/* Heading */}
          <div className="flex items-center justify-center relative px-2 sm:px-4">
            <h2
              ref={text1Ref}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-center max-w-6xl z-10 text-black break-words"
            >
              An <span className="italic">i</span>
              ntelligent{" "}
              <span className="bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] bg-clip-text text-transparent">
                support
              </span>{" "}
              system that turns frustration into{" "}
              <span className="bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] bg-clip-text text-transparent">
                acti<span className="italic">o</span>n.
              </span>
            </h2>
            <span
              ref={text2Ref}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-center text-black absolute"
            >
              Your Feedback
            </span>
          </div>

          {/* Button */}
          <div
            ref={waitlistRef}
            className="p-2 border border-blue-300/30 rounded-full"
          >
            <div className="p-2 border border-blue-600/60 hover:scale-99 transition rounded-full">
              <div className="p-2 border-3 border-blue-600 hover:scale-99 transition rounded-full">
                <Link href="/waitlist">
                  <button className="bg-black font-bold text-white py-2 px-6 sm:px-8 rounded-full w-fit text-lg sm:text-2xl md:text-3xl hover:scale-95 focus:scale-90 transition">
                    Join Waitlist
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Join />
      <Problem />
      <Solution />
      <Promise />
      <Cta />
    </main>
  );
}
