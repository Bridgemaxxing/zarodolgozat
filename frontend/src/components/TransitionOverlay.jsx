import React, { useEffect, useRef, useState } from "react";

export default function TransitionOverlay({
  src, // Itt már a preloadVideo-ból kapott URL-t használd!
  onEnd,
  videoDelay = 200,
  darkOpacityStart = 1.0,
  darkOpacityMid = 0.6,
  fadeDuration = 600
}) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState("start"); // "start" | "mid" | "out"

  useEffect(() => {
    // 1. Ütemezzük a fázisváltást és a videó indítását
    const timer = setTimeout(() => {
      setPhase("mid");
      if (videoRef.current) {
        // Mivel már a memóriában van (Blob), a play() azonnali lesz
        videoRef.current.play().catch((err) => {
          console.error("Transition video play error:", err);
          handleVideoEnd();
        });
      }
    }, videoDelay);

    return () => clearTimeout(timer);
  }, [videoDelay]);

  function handleVideoEnd() {
    setPhase("out");
    setTimeout(() => {
      onEnd?.();
    }, fadeDuration);
  }

  // Opacity kiszámítása a fázisok alapján
  const getOverlayOpacity = () => {
    if (phase === "start") return darkOpacityStart;
    if (phase === "mid") return darkOpacityMid;
    return 0;
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* A videó MINDIG renderelődik, ha van src. 
         Az opacity váltás segít, hogy ne legyen 'fekete villanás' az induláskor.
      */}
      <video
        ref={videoRef}
        src={src}
        className={`absolute inset-0 w-screen h-screen object-cover transition-opacity duration-300 ${
          phase === "start" ? "opacity-0" : "opacity-100"
        }`}
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
      />

      {/* Fekete réteg a videó felett */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "black",
          opacity: getOverlayOpacity(),
          transition: `opacity ${fadeDuration}ms ease`,
        }}
      />
    </div>
  );
}