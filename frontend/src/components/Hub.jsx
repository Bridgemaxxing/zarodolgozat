import React, { useState, useRef, useEffect, useMemo } from "react";
import ShopModal from "./BoltModal.jsx";
import BlacksmithModal from "./KovacsModal.jsx";
import InvModal from "./Inv.jsx";
import QuestBoardModal from "./QuestBoardModal.jsx";
import BeallitasokModal from "./Beallitasok.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";
import "./Hub.css";
import TutorialOverlay from "./TutorialOverlay.jsx";

export default function Hub({ onGoAdventure, onStartQuestBattle }) {
  const { player, logout } = usePlayer();
  const { t } = useLanguage();

  const timeoutRef = useRef(null);
  const unlockRef = useRef(null);

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 40, y: 75 });
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState("");

  const [showShop, setShowShop] = useState(false);
  const [showBlacksmith, setShowBlacksmith] = useState(false);
  const [showInv, setShowInv] = useState(false);
  const [showQuestBoard, setShowQuestBoard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  

  const isAnyModalOpen =
    showShop || showBlacksmith || showInv || showQuestBoard || showSettings;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const [uiLock, setUiLock] = useState(false);
  const lock = (ms = 750) => {
    setUiLock(true);
    clearTimeout(unlockRef.current);
    unlockRef.current = setTimeout(() => setUiLock(false), ms);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(unlockRef.current);
    };
  }, []);

  const SPEED = 20;

  const zoomTo = (xPercent, yPercent, zoomLevel = 2) => {
    setIsFadingOut(true);

    setTimeout(() => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const newOffsetX =
        windowWidth / 2 - windowWidth * (xPercent / 100) * zoomLevel;
      const newOffsetY =
        windowHeight / 2 - windowHeight * (yPercent / 100) * zoomLevel;

      setZoom(zoomLevel);
      setOffset({ x: newOffsetX, y: newOffsetY });
      setIsZooming(true);
    }, 400);
  };

  const resetZoom = () => {
    setTimeout(() => {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setIsZooming(false);

      setTimeout(() => {
        setIsFadingOut(false);
      }, 120);
    }, 420);
  };

  const moveTo = (x, y, type) => {
    if (uiLock) return;
    lock(900);

    clearTimeout(timeoutRef.current);
    zoomTo(x, y);

    const dx = x - playerPos.x;
    const dy = y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = (distance / SPEED) * 300;

    setIsMoving(true);
    setPlayerPos({ x, y });

    timeoutRef.current = setTimeout(() => {
      openModal(type);
    }, 650);

    setTimeout(() => {
      setIsMoving(false);
    }, duration);
  };

  const openModal = (type) => {
    if (type === "shop") setShowShop(true);
    if (type === "blacksmith") setShowBlacksmith(true);
    if (type === "inv") setShowInv(true);
    if (type === "quest") setShowQuestBoard(true);

    if (type === "adventure") {
      resetZoom();
      onGoAdventure?.();
    }
  };

  const handleClose = (setter) => {
    if (uiLock) return;
    lock(900);

    setIsFadingOut(true);
    setter(false);
    resetZoom();
  };

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showHubIntro, setShowHubIntro] = useState(false);

  const hzAdventureRef = useRef(null);
  const hzBlacksmithRef = useRef(null);
  const hzQuestRef = useRef(null);
  const hzShopRef = useRef(null);
  const hzHomeRef = useRef(null);

  useEffect(() => {
    if (!player?.id) return;

    const introDone =
      localStorage.getItem(`hub_intro_done_${player.id}`) === "1";
    const tutorialDone =
      localStorage.getItem(`hub_tutorial_done_${player.id}`) === "1";

    if (!introDone) {
      setShowHubIntro(true);
      setTutorialStep(0);
      return;
    }

    setShowHubIntro(false);
    setTutorialStep(tutorialDone ? 0 : 1);
  }, [player?.id]);

  const tutorialSteps = useMemo(
    () => ({
      1: { ref: hzHomeRef, text: t("hubTutHome") },
      2: { ref: hzBlacksmithRef, text: t("hubTutBlacksmith") },
      3: { ref: hzShopRef, text: t("hubTutShop") },
      4: { ref: hzQuestRef, text: t("hubTutQuests") },
      5: { ref: hzAdventureRef, text: t("hubTutTravel") },
    }),
    [t]
  );

  function finishHubIntro() {
    if (player?.id) {
      localStorage.setItem(`hub_intro_done_${player.id}`, "1");
    }

    setShowHubIntro(false);

    const tutorialDone =
      localStorage.getItem(`hub_tutorial_done_${player.id}`) === "1";

    if (!tutorialDone) {
      setTutorialStep(1);
    }
  }

  function finishTutorial() {
    if (player?.id) localStorage.setItem(`hub_tutorial_done_${player.id}`, "1");
    setTutorialStep(0);
  }

  function skipTutorial() {
    finishTutorial();
  }

  const tutActive =
    !showHubIntro && tutorialStep > 0 && !isAnyModalOpen && !isMenuOpen;
  const pe = (step) => (tutActive && tutorialStep !== step ? "none" : "auto");
  const peFinal = (step) => (uiLock ? "none" : pe(step));

  return (
    <div className="hub-root">
      <div className="hub-topbar">
        <button
          className="hub-hamburger"
          aria-label={t("menu")}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className="hub-hamburger-line" />
          <span className="hub-hamburger-line" />
          <span className="hub-hamburger-line" />
        </button>

        {isMenuOpen && (
          <>
            <div className="hub-menu-backdrop" onClick={() => setIsMenuOpen(false)} />
            <div className="hub-menu-panel">
              <div className="hub-menu-title">{t("menu")}</div>

              <button
                className="hub-menu-item"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowSettings(true);
                }}
              >
                {t("settings")}
              </button>

              <button
                className="hub-menu-item danger"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
              >
                {t("logout")}
              </button>
            </div>
          </>
        )}
      </div>

      {hoveredLocation && !isAnyModalOpen && (
        <div className="location-tooltip">{hoveredLocation}</div>
      )}

      <div className={`hub-overlay ${isFadingOut || isAnyModalOpen ? "is-dark" : ""}`} />

      <div className="camera">
        <div
          className={`world ${isZooming ? "hub-zooming" : ""}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: "transform 650ms ease-in-out",
          }}
        >
          <img src="/images/HUB.png" alt={t("hubImageAlt")} className="hub-image" />

          <div
            ref={hzAdventureRef}
            className="hotzone keret"
            style={{
              left: "38%",
              bottom: "17%",
              width: "440px",
              height: "500px",
              pointerEvents: peFinal(5),
            }}
            onClick={() => {
              if (tutActive && tutorialStep === 5) finishTutorial();
              moveTo(50, 80, "adventure");
            }}
          >
            <span className="zone-label">{t("travel")}</span>
          </div>

          <div
            ref={hzBlacksmithRef}
            className="hotzone keret"
            style={{
              left: "5%",
              bottom: "13%",
              width: "620px",
              height: "360px",
              pointerEvents: peFinal(2),
            }}
            onClick={() => {
              if (tutActive && tutorialStep === 2) setTutorialStep(3);
              moveTo(30, 85, "blacksmith");
            }}
          >
            <span className="zone-label">{t("blacksmith")}</span>
          </div>

          <div
            ref={hzQuestRef}
            className="hotzone keret"
            style={{
              right: "20%",
              bottom: "12%",
              width: "330px",
              height: "270px",
              pointerEvents: peFinal(4),
            }}
            onClick={() => {
              if (tutActive && tutorialStep === 4) setTutorialStep(5);
              moveTo(65, 80, "quest");
            }}
          >
            <span className="zone-label">{t("quests")}</span>
          </div>

          <div
            ref={hzShopRef}
            className="hotzone keret"
            style={{
              right: "5%",
              bottom: "12%",
              width: "280px",
              height: "250px",
              pointerEvents: peFinal(3),
            }}
            onClick={() => {
              if (tutActive && tutorialStep === 3) setTutorialStep(4);
              moveTo(85, 85, "shop");
            }}
          >
            <span className="zone-label">{t("shop")}</span>
          </div>

          <div
            ref={hzHomeRef}
            className="hotzone keret"
            style={{
              right: "20%",
              bottom: "38%",
              width: "300px",
              height: "240px",
              pointerEvents: peFinal(1),
            }}
            onClick={() => {
              moveTo(60, 80, "inv");
            }}
          >
            <span className="zone-label">{t("home")}</span>
          </div>

          <img
            src="/images/TESZT.PNG"
            alt={t("player")}
            className={`player ${isMoving ? "moving" : ""}`}
            style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
          />
        </div>
      </div>

      {showShop && <ShopModal onClose={() => handleClose(setShowShop)} />}
      {showBlacksmith && <BlacksmithModal onClose={() => handleClose(setShowBlacksmith)} />}

      {showInv && (
        <InvModal
          onClose={() => {
            handleClose(setShowInv);

            if (tutorialStep === 1) {
              setTimeout(() => {
                setTutorialStep(2);
              }, 700);
            }
          }}
        />
      )}

      {showQuestBoard && player && (
        <QuestBoardModal
          playerId={player.id}
          playerClassId={Number(player.class_id)}
          onClose={() => handleClose(setShowQuestBoard)}
          onStartQuestBattle={(payload) => {
            handleClose(setShowQuestBoard);
            onStartQuestBattle?.(payload);
          }}
        />
      )}

      {tutActive && tutorialSteps[tutorialStep] && (
        <TutorialOverlay
          targetRef={tutorialSteps[tutorialStep].ref}
          text={tutorialSteps[tutorialStep].text}
          onSkip={skipTutorial}
          showNext={false}
        />
      )}

      {showHubIntro && (
        <div className="hub-intro-overlay">
          <div className="hub-intro-panel">
            <h2>{t("welcome")}</h2>

            <p>{t("hubIntroLine1")}</p>
            <p>{t("hubIntroLine2")}</p>

            <button className="buttonClass" onClick={finishHubIntro}>
              {t("continue")}
            </button>
          </div>
        </div>
      )}

      {showSettings && <BeallitasokModal onClose={() => setShowSettings(false)} />}
      {showLogoutConfirm && (
        <div className="logout-confirm">
          <p>{t("Biztosan ki akarsz jelentkezni?")}</p>

          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            {t("Igen")}
          </button>

          <button
            onClick={() => setShowLogoutConfirm(false)}
          >
            {t("Nem")}
          </button>
        </div>
      )}
    </div>
  );
}