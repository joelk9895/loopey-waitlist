"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { addToWaitlist } from "@/lib/supabase";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralSource, setReferralSource] = useState<string | null>(null);

  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  useEffect(() => {
    // Check URL params for referral code
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      const source = urlParams.get("source");
      if (ref) setReferralSource(ref);
      else if (source) setReferralSource(source);
    }

    // Blinking animation for eyes
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
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 0.1,
        duration: 0.08,
        ease: "power2.inOut",
        delay: 0.5,
      })
      .to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 1,
        duration: 0.08,
        ease: "power2.inOut",
      });

    return () => {
      blinkTimeline.kill();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Add the user to our Supabase waitlist table
      const {
        success,
        error: supabaseError,
        data,
      } = await addToWaitlist(email, name, referralSource);

      if (!success) {
        console.error("Waitlist page received error:", supabaseError);
        throw new Error(supabaseError);
      }

      // Store in localStorage as a backup
      localStorage.setItem("waitlistEmail", email);
      if (name) localStorage.setItem("waitlistName", name);

      // Store the referral code if available
      interface WaitlistResponse {
        referral_code?: string;
      }
      const responseData = data as WaitlistResponse[];
      if (responseData && responseData[0]?.referral_code) {
        localStorage.setItem(
          "waitlistReferralCode",
          responseData[0].referral_code
        );
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message ||
            "There was an error submitting your information. Please try again."
        );
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black">
      <div className="w-full max-w-5xl p-4 sm:p-8 relative">
        {/* Animated face - moved to top-right corner */}
        <div className="hidden md:flex flex-col gap-4 items-center absolute top-[10vh] right-0 -rotate-12 z-10">
          <div className="flex gap-4">
            {/* Left Eye */}
            <div
              ref={leftEyeRef}
              className="w-6 h-8 bg-white rounded-full relative overflow-hidden"
              style={{ transformOrigin: "center center" }}
            ></div>
            {/* Right Eye */}
            <div
              ref={rightEyeRef}
              className="w-6 h-8 bg-white rounded-full relative overflow-hidden"
              style={{ transformOrigin: "center center" }}
            />
          </div>
          <svg width="50" height="25" viewBox="0 0 300 100" fill="none">
            <path
              d="M 10 30 Q 150 90 290 30"
              stroke="white"
              strokeWidth="50"
              fill="transparent"
            />
          </svg>
        </div>

        {/* Header/Navigation */}
        <nav className="flex items-center justify-between mb-12 sm:mb-16">
          <Link href="/" className="flex gap-2 items-center">
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
          </Link>
          <Link
            href="/"
            className="text-white text-sm sm:text-base border border-blue-600/30 rounded-full px-4 py-2 hover:bg-blue-900/10 transition"
          >
            Back to Home
          </Link>
        </nav>

        {submitted ? (
          <div className="bg-gradient-to-b from-[#0052d4]/10 to-blue-600/10 border border-blue-300/30 rounded-xl p-8 sm:p-12 text-center text-white mt-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif mb-4">
              Thank you for
              <span className="bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] bg-clip-text text-transparent">
                {" "}
                joining!
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-8">
              We&apos;ve added {name ? name : "you"} to our waitlist. We&apos;ll notify
              you when we launch!
            </p>

            {/* Referral section */}
            <div className="mb-12 max-w-lg mx-auto">
              <h3 className="text-xl font-serif mb-4">
                Share with your friends
              </h3>
              <p className="text-base text-white/70 mb-4">
                Help us grow by sharing your unique referral link:
              </p>

              <div className="flex items-center justify-between border border-blue-300/30 rounded-full py-2 px-4 bg-black/30 mb-6">
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-white/80 text-sm">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/waitlist?ref=${
                      localStorage.getItem("waitlistReferralCode") || ""
                    }`}
                </div>
                <button
                  className="ml-2 text-blue-300 px-3 py-1 rounded-full border border-blue-300/30 text-sm hover:bg-blue-900/20 transition"
                  onClick={() => {
                    const link = `${window.location.origin}/waitlist?ref=${
                      localStorage.getItem("waitlistReferralCode") || ""
                    }`;
                    navigator.clipboard.writeText(link);
                    alert("Copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  className="p-2 rounded-full bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/20 transition"
                  onClick={() => {
                    const text = encodeURIComponent(
                      "Join me on the waitlist for Loopey - an intelligent support system that turns confusion into clarity!"
                    );
                    const url = encodeURIComponent(
                      `${window.location.origin}/waitlist?ref=${
                        localStorage.getItem("waitlistReferralCode") || ""
                      }`
                    );
                    window.open(
                      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                      "_blank"
                    );
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#1DA1F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.04 10.04 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/30 hover:bg-[#0A66C2]/20 transition"
                  onClick={() => {
                    const url = encodeURIComponent(
                      `${window.location.origin}/waitlist?ref=${
                        localStorage.getItem("waitlistReferralCode") || ""
                      }`
                    );
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                      "_blank"
                    );
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#0A66C2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition"
                  onClick={() => {
                    const text = encodeURIComponent(
                      "Join me on the waitlist for Loopey - an intelligent support system!"
                    );
                    const url = encodeURIComponent(
                      `${window.location.origin}/waitlist?ref=${
                        localStorage.getItem("waitlistReferralCode") || ""
                      }`
                    );
                    window.open(
                      `https://wa.me/?text=${text}%20${url}`,
                      "_blank"
                    );
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="#25D366"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-2 border border-blue-300/30 rounded-full w-fit mx-auto">
              <div className="p-2 border border-blue-600/60 hover:scale-99 transition rounded-full">
                <div className="p-2 border-3 border-blue-600 hover:scale-99 transition rounded-full">
                  <Link href="/">
                    <button className="bg-black font-bold text-white py-2 px-6 sm:px-8 rounded-full w-fit text-lg sm:text-2xl hover:scale-95 focus:scale-90 transition">
                      Return to Homepage
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black border border-blue-600/30 rounded-xl p-8 sm:p-12 text-white mt-12">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif mb-6 text-center">
              Join our
              <span className="bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] bg-clip-text text-transparent">
                {" "}
                waitlist
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-center text-white/80 mb-12 max-w-2xl mx-auto">
              Be among the first to experience our intelligent support system
              when we launch.
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-xl mx-auto"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-base font-medium mb-2"
                >
                  Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-5 py-4 rounded-full bg-transparent border border-blue-300/50 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-medium mb-2"
                >
                  Email Address <span className="text-blue-300">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-5 py-4 rounded-full bg-transparent border border-blue-300/50 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="pt-4">
                <div className="p-2 border border-blue-300/30 rounded-full w-full">
                  <div className="p-2 border border-blue-600/60 hover:scale-99 transition rounded-full">
                    <div className="p-2 border-3 border-blue-600 hover:scale-99 transition rounded-full">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-black font-bold text-white py-2 px-6 rounded-full w-full text-xl sm:text-2xl hover:scale-95 focus:scale-90 transition flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Join Waitlist"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-center opacity-70 mt-6">
                We respect your privacy and will never share your information
                with third parties.
              </p>
            </form>
          </div>
        )}
      </div>

      {/* Social proof / Details */}
      <div className="w-full max-w-5xl p-4 sm:p-8 mt-8 sm:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="border border-blue-600/20 rounded-xl p-8 bg-gradient-to-b from-[#0052d4]/5 to-blue-600/5 hover:border-blue-600/40 transition">
            <div className="w-12 h-12 mb-4 bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 12L12 16L16 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif mb-3">Early Access</h3>
            <p className="opacity-80 text-white/70">
              Be the first to try our intelligent support system when we launch.
            </p>
          </div>

          <div className="border border-blue-600/20 rounded-xl p-8 bg-gradient-to-b from-[#0052d4]/5 to-blue-600/5 hover:border-blue-600/40 transition">
            <div className="w-12 h-12 mb-4 bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif mb-3">No Spam</h3>
            <p className="opacity-80 text-white/70">
              We&apos;ll only email you when we have important updates to share.
            </p>
          </div>

          <div className="border border-blue-600/20 rounded-xl p-8 bg-gradient-to-b from-[#0052d4]/5 to-blue-600/5 hover:border-blue-600/40 transition">
            <div className="w-12 h-12 mb-4 bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.287 15.9606C19.3467 16.285 19.5043 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4243 16.365 19.2667 16.0406 19.207C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.287C7.71502 19.3467 7.41568 19.5043 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.57567 16.6643 4.73332 16.365 4.79303 16.0406C4.85274 15.7162 4.81305 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73305 8.69838 4.77274 8.36381 4.71303 8.03941C4.65332 7.71502 4.49567 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.57567 7.63502 4.73332 7.95941 4.79303C8.28381 4.85274 8.61838 4.81305 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73305 15.6362 4.77274 15.9606 4.71303C16.285 4.65332 16.5843 4.49567 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4243 7.33568 19.2667 7.63502 19.207 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15V15Z"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif mb-3">Exclusive Benefits</h3>
            <p className="opacity-80 text-white/70">
              Waitlist members will receive special offers and priority access
              to new features.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
