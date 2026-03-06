// frontend/src/components/LoadingScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import "./LoadingScreen.css";
import loadingBg from "../assets/backgrounds/loadingscreen.jpg";

const SKIP_LS_KEY = "skipLoadingScreen";

// TYPEWRITER HOOK (Változatlan)
function useTypewriter(text, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setDone(false);
      return;
    }
    let i = 0;
    let cancelled = false;
    setDisplayed("");
    setDone(false);

    const timer = setInterval(() => {
      if (cancelled) return;
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [text, speed]);

  return { displayed, done };
}

export default function LoadingScreen({ onDone }) {
  const [tips, setTips] = useState([]);
  const [currentTip, setCurrentTip] = useState("");
  const [loadingTime, setLoadingTime] = useState(10);

  // Biztosíték a dupla hívás ellen
  const hasFinished = useRef(false);

  // ✅ Skip beolvasás (minden mountnál)
  const skipLoading = useRef(false);
  useEffect(() => {
    try {
      skipLoading.current = localStorage.getItem(SKIP_LS_KEY) === "1";
    } catch {
      skipLoading.current = false;
    }

    // ha ON: azonnal done
    if (skipLoading.current && !hasFinished.current) {
      hasFinished.current = true;
      onDone();
    }
  }, [onDone]);

  // Tippek lekérése (Változatlan)
  useEffect(() => {
    // ha úgyis skip, nem muszáj fetch-elni (de nem baj ha marad)
    fetch("https://nodejs202.dszcbaross.edu.hu/api/tips")
      .then((res) => res.json())
      .then((data) => {
        const loadedTips = data.tips || [];
        setTips(loadedTips);
        if (loadedTips.length > 0) {
          const random = Math.floor(Math.random() * loadedTips.length);
          setCurrentTip(loadedTips[random]);
        }
      })
      .catch((err) => console.error("Tippek hiba:", err));
  }, []);

  const typedTip = useTypewriter(currentTip, 25);

  function refreshTip() {
    if (tips.length === 0) return;
    const random = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[random]);
  }

  useEffect(() => {
    if (tips.length === 0) return;
    const interval = setInterval(refreshTip, 10000);
    return () => clearInterval(interval);
  }, [tips]);

  // 1) Csak az idő csökkentése (Side effect mentes)
  useEffect(() => {
    // ✅ ha skip ON, ne is indítsuk a countdownot
    if (skipLoading.current) return;

    const interval = setInterval(() => {
      setLoadingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2) Figyeljük, mikor jár le az idő, és akkor hívjuk a szülőt
  useEffect(() => {
    if (skipLoading.current) return;

    if (loadingTime === 0 && !hasFinished.current) {
      hasFinished.current = true;
      onDone();
    }
  }, [loadingTime, onDone]);

  // ✅ ha már azonnal done volt, akkor se villogjon hülyén
  if (skipLoading.current) return null;

  return (
    <div className="loading-bg" style={{ backgroundImage: `url(${loadingBg})` }}>
      <h1 className="jt --debug">
        <span className="jt__row">
          <span className="jt__text">Utazás folyamatban</span>
        </span>
        <span className="jt__row jt__row--sibling" aria-hidden="true">
          <span className="jt__text">Utazás folyamatban</span>
        </span>
        <span className="jt__row jt__row--sibling" aria-hidden="true">
          <span className="jt__text">Utazás folyamatban</span>
        </span>
        <span className="jt__row jt__row--sibling" aria-hidden="true">
          <span className="jt__text">Utazás folyamatban</span>
        </span>
      </h1>

      <span className="countdown-number">
        <span key={loadingTime}>{loadingTime}</span>
      </span>

      <div className="loading-tip" onClick={refreshTip} title="Kattints új tippért!">
        {typedTip.displayed || "Tipp betöltése..."}
      </div>
    </div>
  );
}
