import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";
import "./ClassSelect.css";

export default function ClassSelect({ onNext }) {
  const { player, setPlayer } = usePlayer();
  const { t } = useLanguage();

  const [classData, setClassData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openDetails, setOpenDetails] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch(`https://nodejs202.dszcbaross.edu.hu/api/classes`);
        const data = await res.json();
        setClassData(data);
      } catch (err) {
        console.error(t("classLoadErrorConsole"), err);
      }
    }
    loadClasses();
  }, [t]);

  const classDetails = useMemo(
    () => ({
      6: {
        name: t("warriorName"),
        short: t("warriorShort"),
        role: t("warriorRole"),
        strength: t("warriorStrength"),
        weakness: t("warriorWeakness"),
      },
      7: {
        name: t("mageName"),
        short: t("mageShort"),
        role: t("mageRole"),
        strength: t("mageStrength"),
        weakness: t("mageWeakness"),
      },
      8: {
        name: t("archerName"),
        short: t("archerShort"),
        role: t("archerRole"),
        strength: t("archerStrength"),
        weakness: t("archerWeakness"),
      },
    }),
    [t]
  );

  const videoSources = [
    "/video/classharcos.mp4",
    "/video/classvarazslo.mp4",
    "/video/classtavolsagi.mp4",
  ];

  const videoRefs = useRef([]);

  function handleSelect(id, index) {
    setSelected(id);

    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
        v.currentTime = 0;
      }
    });

    const vid = videoRefs.current[index];
    if (vid) {
      vid.play();
      vid.onended = () => {
        vid.pause();
      };
    }
  }

  async function create() {
    if (!selected) return alert(t("chooseHeroAlert"));
    if (!player || !player.username) {
      return alert(t("notLoggedInError"));
    }

    try {
      const res = await fetch(`https://nodejs202.dszcbaross.edu.hu/api/set-class`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: player.username, classId: selected }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("set-class failed:", data);
        return alert(data.error || t("saveClassError"));
      }

      setPlayer({ ...player, class_id: selected });
      onNext();
    } catch (e) {
      console.error("set-class error:", e);
      alert(t("serverError"));
    }
  }

  return (
    <div className="path-choice-bg">
      <div className="absolute inset-0 bg-black/50"></div>

      <h2 className="absolute top-5 left-1/2 -translate-x-1/2 text-4xl font-bold text-white select-none pixelosvenyvalaszt">
        {t("chooseHeroTitle")}
      </h2>

      <div className="absolute inset-0 flex">
        {classData.map((cls, index) => (
          <div
            key={cls.id}
            onClick={() => handleSelect(cls.id, index)}
            className={`class-card relative w-1/3 h-full cursor-pointer overflow-hidden transition-all duration-500 ${
              selected === cls.id ? "selected" : ""
            }`}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={videoSources[index]}
              preload="auto"
              muted
              className="ClassHatter absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            <div
              className={`overlay absolute inset-0 transition-colors duration-300 ${
                selected === cls.id ? "bg-black/0" : "bg-black/30"
              }`}
            ></div>

            <span className="classname absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl select-none pixelfont transition-all duration-300">
              {classDetails[cls.id]?.name || cls.name}
            </span>

            <div className="classStats absolute top-10 left-1/2 -translate-x-1/2 w-[80%] text-center text-gray-200 font-[Jersey 10] text-base drop-shadow-lg">
              <div className="classDescription mb-2">
                {classDetails[cls.id]?.short || t("unknownClass")}
              </div>

              <button
                type="button"
                className="detailsToggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDetails(openDetails === cls.id ? null : cls.id);
                }}
              >
                {openDetails === cls.id ? t("detailsUp") : t("detailsDown")}
              </button>

            
              {openDetails === cls.id && (
          <div className="detailsPanel mt-2">
            <div>
              <strong>{t("roleLabel")}:</strong> {classDetails[cls.id]?.role}
            </div>
            <div>
              <strong>{t("strengthLabel")}:</strong> {classDetails[cls.id]?.strength}
            </div>
            <div>
              <strong>{t("weaknessLabel")}:</strong> {classDetails[cls.id]?.weakness}
            </div>
          </div>
        )}
        {selected === cls.id && (
        <button
          type="button"
          className="buttonClass createButton classCreateButton"
          onClick={(e) => {
            e.stopPropagation();
            create();
          }}
        >
          {t("createButton")}
        </button>
      )}
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}