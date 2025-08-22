import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Promise() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const wordsRef = useRef([]);
  const backgroundRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states for words with dramatic effects
    gsap.set(wordsRef.current, {
      opacity: 0,
      y: 120,
      rotationX: 90,
      rotationY: 45,
      scale: 0.5,
      transformOrigin: "center bottom",
    });

    // Main scroll-triggered timeline with enhanced effects
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1.8,
        pin: false,
        anticipatePin: 1,
      },
    });

    // Enhanced word reveal with multiple transform properties
    tl.to(wordsRef.current, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 3,
      ease: "back.out(1.4)",
      stagger: {
        amount: 2.5,
        from: "start",
        ease: "power2.inOut",
      },
    })

      // Text depth and perspective animation
      .to(
        textRef.current,
        {
          scale: 1.05,
          z: 80,
          rotationX: 1,
          duration: 4,
          ease: "power1.inOut",
        },
        "-=2"
      )

      // Highlight key words with color and glow
      .to(
        wordsRef.current.filter((_, i) =>
          [0, 4, 7, 10, 13, 16, 19].includes(i)
        ),
        {
          color: "#00ffff",
          textShadow: "0 0 25px #00ffff, 0 0 50px #0080ff",
          scale: 1.08,
          duration: 2,
          ease: "elastic.out(1, 0.4)",
          stagger: 0.15,
        },
        "-=1.8"
      )

      // Wave effect through words
      .to(
        wordsRef.current,
        {
          y: (i) => Math.sin(i * 0.5) * 12,
          duration: 1.8,
          ease: "power2.inOut",
          stagger: 0.05,
        },
        "-=1.2"
      )

      // Final emphasis with micro rotations
      .to(
        wordsRef.current.filter((_, i) => i % 6 === 0),
        {
          rotationZ: (i) => (i % 2 === 0 ? 1.5 : -1.5),
          duration: 1.2,
          ease: "elastic.out(1, 0.6)",
          stagger: 0.08,
        },
        "-=0.8"
      );

    // Enhanced mouse parallax with 3D depth
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const normalizedX = (clientX / innerWidth - 0.5) * 2;
      const normalizedY = (clientY / innerHeight - 0.5) * 2;

      gsap.to(textRef.current, {
        rotationY: normalizedX * 6,
        rotationX: normalizedY * -4,
        z: normalizedX * 25,
        transformPerspective: 1200,
        duration: 0.5,
        ease: "power2.out",
      });

      // Individual word micro-movements
      wordsRef.current.forEach((word, i) => {
        if (word && i % 8 === 0) {
          gsap.to(word, {
            x: normalizedX * (3 + Math.sin(i) * 2),
            y: normalizedY * (2 + Math.cos(i) * 1.5),
            rotationZ: normalizedX * 0.5,
            duration: 0.7,
            ease: "power2.out",
          });
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(textRef.current, {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
      });

      wordsRef.current.forEach((word, i) => {
        if (word && i % 8 === 0) {
          gsap.to(word, {
            x: 0,
            y: 0,
            rotationZ: 0,
            duration: 1,
            ease: "elastic.out(1, 0.6)",
          });
        }
      });
    };

    if (sectionRef.current) {
      sectionRef.current.addEventListener("mousemove", handleMouseMove);
      sectionRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (sectionRef.current) {
        sectionRef.current.removeEventListener("mousemove", handleMouseMove);
        sectionRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const text =
    "That's what we're building: an intelligent support system that turns confusion into clarity, and frustration into resolution.";
  const words = text.split(" ");

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center gap-8 min-h-screen bg-gradient-to-b from-blue-600 to-black via-blue-500 text-white min-w-full relative overflow-hidden px-4"
    >
      <h3
        ref={textRef}
        className="text-7xl font-serif leading-relaxed -tracking-wider whitespace-wrap font-regular text-white max-w-7xl text-center relative z-10"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => (wordsRef.current[index] = el)}
            className="inline-block mr-4"
            style={{
              transformStyle: "preserve-3d",
              textShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          >
            {word}
          </span>
        ))}
      </h3>
    </section>
  );
}
