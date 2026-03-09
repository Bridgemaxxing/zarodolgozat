import React, { useState, useRef, useEffect } from "react";
import { DEFAULT_CLASSES } from "../data/classes.js";
import { usePlayer } from "../context/PlayerContext.jsx";
import "./ClassSelect.css";

export default function ClassSelect({ onNext }) {
  const { player, setPlayer } = usePlayer();
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
        console.error("Nem sikerült betölteni a kasztokat:", err);
      }
    }
    loadClasses();
  }, []);

 const classDetails = {
  6: {
    short: "Masszív közelharcos, aki többféle irányba is építhető: lehet biztonságos bruiser, agresszív sebző vagy kitartó túlélő.",
    role: "Sokoldalú frontline",
    strength: "Rugalmas buildlehetőségek, stabil jelenlét és jó alkalmazkodás különböző helyzetekhez.",
    weakness: "Rossz döntésekkel könnyen nyomás alá kerülhet.",
  },
  7: {
    short: "Pusztító varázshasználó, aki nagy sebzéssel rendelkezik de kevés hibát engedhet meg magának.",
    role: "Burst / control mágus",
    strength: "Magas sebzés, erős spellhatások és veszélyes kombók, amelyek gyorsan eldönthetnek egy harcot.",
    weakness: "Törékenyebb",
  },
  8: {
    short: "Stabil távolsági sebző, aki folyamatos nyomás alatt tartja az ellenfelet, miközben a petje sok beérkező sebzést felfog helyette.",
    role: "Stabil ranged DPS",
    strength: "Megbízható, folyamatos sebzés és nagyobb biztonság a pet támogatása miatt.",
    weakness: "Ha a pet kiesik vagy nem tudja megtartani a nyomást, sokkal sebezhetőbbé válik.",
  },
};

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
    if (!selected) return alert("Válassz egy hőst!");
    if (!player || !player.username) {
      return alert("Hiba: nem vagy bejelentkezve.");
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
        return alert(data.error || "Nem sikerült menteni a kasztot!");
      }

      setPlayer({ ...player, class_id: selected });
      onNext();
    } catch (e) {
      console.error("set-class error:", e);
      alert("Szerver hiba történt!");
    }
  }

  return (
    <div className="path-choice-bg">
      <div className="absolute inset-0 bg-black/50"></div>

      <h2 className="absolute top-5 left-1/2 -translate-x-1/2 text-4xl font-bold text-white select-none pixelosvenyvalaszt">
        Válassz egy hőst
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
              {cls.name}
            </span>

            <div className="classStats absolute top-10 left-1/2 -translate-x-1/2 w-[80%] text-center text-gray-200 font-[Jersey 10] text-base drop-shadow-lg">
              <div className="classDescription mb-2">
                {classDetails[cls.id]?.short || "Ismeretlen kaszt."}
              </div>

              <button
                type="button"
                className="detailsToggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDetails(openDetails === cls.id ? null : cls.id);
                }}
              >
                {openDetails === cls.id ? "Részletek ▲" : "Részletek ▼"}
              </button>

              {openDetails === cls.id && (
                <div className="detailsPanel mt-2">
                  <div><strong>Szerep:</strong> {classDetails[cls.id]?.role}</div>
                  <div><strong>Erősség:</strong> {classDetails[cls.id]?.strength}</div>
                  <div><strong>Gyengeség:</strong> {classDetails[cls.id]?.weakness}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <button onClick={create} className="buttonClass createButton">
          Létrehozás
        </button>
      )}
    </div>
  );
}