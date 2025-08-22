import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cta() {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  useEffect(() => {
    // Blinking animation
    const blinkTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    blinkTimeline
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 0.1,
        duration: 0.1,
        ease: "power2.inOut",
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 1,
        duration: 0.1,
        ease: "power2.inOut",
      })
      // Double blink
      .to(
        [leftEyeRef.current, rightEyeRef.current],
        {
          scaleY: 0.1,
          duration: 0.08,
          ease: "power2.inOut",
        },
        "+=0.15"
      )
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 1,
        duration: 0.08,
        ease: "power2.inOut",
      });

    // Pupil following mouse movement

    return () => {
      blinkTimeline.kill();
    };
  }, []);

  return (
    <section className="bg-black w-full min-h-screen flex flex-col items-center justify-center gap-8 relative px-4 sm:px-8">
      <div className="flex flex-col gap-4 items-center absolute top-10 left-10 -rotate-12">
        <div className="flex gap-4">
          {" "}
          {/* Left Eye */}
          <div
            ref={leftEyeRef}
            className="w-14 h-16 bg-white rounded-full relative overflow-hidden"
            style={{ transformOrigin: "center center" }}
          ></div>
          {/* Right Eye */}
          <div
            ref={rightEyeRef}
            className="w-14 h-16 bg-white rounded-full relative overflow-hidden"
            style={{ transformOrigin: "center center" }}
          />
        </div>
        <svg width="100" height="50" viewBox="0 0 300 100" fill="none">
          <path
            d="M 10 30 Q 150 90 290 30"
            stroke="white"
            strokeWidth="50"
            fill="transparent"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
        <h3 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-center break-words">
          Ready to take the plunge?
        </h3>
        {/* Main button */}
        <div className="p-2 border border-blue-300/30 rounded-full w-fit max-w-full">
          <div className="p-2 border border-blue-600/60 hover:scale-99 transition rounded-full">
            <div className="p-2 border-3 border-blue-600 hover:scale-99 transition rounded-full">
              <button className="bg-black font-bold text-white py-2 px-6 sm:px-8 rounded-full w-full sm:w-fit text-lg sm:text-2xl md:text-3xl hover:scale-95 focus:scale-90 transition">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
