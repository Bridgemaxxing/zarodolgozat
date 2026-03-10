// frontend/src/components/LoadingScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "./LanguageContext.jsx";
import "./LoadingScreen.css";
import loadingBg from "../assets/backgrounds/loadingscreen.jpg";

const SKIP_LS_KEY = "skipLoadingScreen";

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
  const { t } = useLanguage();

  const [tips, setTips] = useState([]);
  const [currentTip, setCurrentTip] = useState("");
  const [loadingTime, setLoadingTime] = useState(10);

  const hasFinished = useRef(false);
  const skipLoading = useRef(false);

  useEffect(() => {
    try {
      skipLoading.current = localStorage.getItem(SKIP_LS_KEY) === "1";
    } catch {
      skipLoading.current = false;
    }

    if (skipLoading.current && !hasFinished.current) {
      hasFinished.current = true;
      onDone();
    }
  }, [onDone]);

  useEffect(() => {
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
      .catch((err) => console.error(t("tipsErrorConsole"), err));
  }, [t]);

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

  useEffect(() => {
    if (skipLoading.current) return;

    const interval = setInterval(() => {
      setLoadingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (skipLoading.current) return;

    if (loadingTime === 0 && !hasFinished.current) {
      hasFinished.current = true;
      onDone();
    }
  }, [loadingTime, onDone]);

  if (skipLoading.current) return null;

  return (
    <div className="loading-bg" style={{ backgroundImage: `url(${loadingBg})` }}>
      <h1 className="jt --debug">
        <span className="jt__row">
          <span className="jt__text">{t("travelInProgress")}</span>
        </span>
        <span className="jt__row jt__row--sibling" aria-hidden="true">
          <span className="jt__text">{t("travelInProgress")}</span>
        </span>
        <span className="jt__row jt__row--sibling" aria-hidden="true">
          <span className="jt__text">{t("travelInProgress")}</span>
        </span>
        <span className="jt__row jt__row--sibling" aria-hidden="true">
          <span className="jt__text">{t("travelInProgress")}</span>
        </span>
      </h1>

      <span className="countdown-number">
        <span key={loadingTime}>{loadingTime}</span>
      </span>

      <div
        className="loading-tip"
        onClick={refreshTip}
        title={t("clickForNewTip")}
      >
        {typedTip.displayed || t("loadingTip")}
      </div>
    </div>
  );
}