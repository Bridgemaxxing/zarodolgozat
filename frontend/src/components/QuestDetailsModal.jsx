// frontend/src/components/QuestDetailsModal.jsx
import React, { useState } from "react";
import { usePlayer } from "../context/PlayerContext.jsx";


export default function QuestDetailsModal({
  quest,
  onClose,
  onClaimSuccess,
  playerId,
  onStartQuestBattle
}) {

  const isClassBossQuest =
    quest.task_type === "boss" && Number(quest.class_required) > 0;

  const canStartQuestBattle =
    quest.status === "in_progress" && isClassBossQuest;

  const canClaim = quest.status === "completed";

  const [msg, setMsg] = useState("");

  const { setPlayer } = usePlayer();

  async function handleClaim() {

    setMsg("");

    try {

      const res = await fetch(
        "https://nodejs202.dszcbaross.edu.hu/api/quests/claim",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: playerId,
            questId: quest.quest_id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        setMsg(data.error || "Nem sikerült claimelni.");
        return;
      }

      setMsg("Jutalom átvéve.");

      const fresh = await fetch(
        `https://nodejs202.dszcbaross.edu.hu/api/players/${playerId}`
      ).then((r) => r.json());

      setPlayer((prev) =>
        !prev
          ? prev
          : {
              ...prev,
              xp: fresh.xp,
              level: fresh.level,
              gold: fresh.gold,
            }
      );

      if (onClaimSuccess) onClaimSuccess(quest.quest_id);

    } catch (err) {

      console.error(err);
      setMsg("Hiba történt a claim során.");

    }
  }

  function startBattle() {

    const bossName =
      Number(quest.class_required) === 6
        ? "Mountain King"
        : Number(quest.class_required) === 7
        ? "Arcane Abomination"
        : "Forest Spirit Beast";

    onStartQuestBattle?.({
      questId: quest.quest_id,
      enemies: [bossName],
      boss: true,
      mode: "quest",
    });

  }

  /* ---------- PAPÍR TEXT MANUÁLIS ÁLLÍTÁS ---------- */

  const paperSettings = [
    { padding: "150px 160px", fontSize: "24px" },
    { padding: "150px 160px", fontSize: "24px" },
    { padding: "150px 160px", fontSize: "24px" },
    { padding: "170px 170px", fontSize: "24px" },
    { padding: "170px 170px", fontSize: "24px" },
    { padding: "170px 170px", fontSize: "24px" }
  ];

  const paperIndex = quest.paperIndex ?? 0;
  const settings = paperSettings[paperIndex];

  return (

<div className="fixed inset-0 z-50 flex items-center justify-center ">

  {/* HÁTTÉR OVERLAY */}
  <div
    className="absolute inset-0 bg-black/70"
    onClick={onClose}
  />

  {/* PAPÍR */}
  <div
    style={{
      width: "900px",
      height: "750px",
      backgroundImage: `url(/images/quest11.png)`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      position: "relative",
      fontFamily: '"Jersey 10", sans-serif',
      zIndex: 10
    }}
  >
    

    {/* SAFE TEXT AREA */}
    <div
      style={{
        //background:"black",
        position: "absolute",

        top: "150px",
        left: "240px",

        width: "440px",
        height: "450px",

        overflow: "hidden",

        textAlign: "center",
        color: "black",
        fontSize: "30px",
        lineHeight: "1.25",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px"
      }}
    >
      

      <h2 style={{ fontSize: "36px" }}>
        {quest.title}
      </h2>

      {canStartQuestBattle && (
        <button
          onClick={startBattle}
          className="quest-text-button"
        >
          Quest battle
        </button>
      )}

      <div>{quest.description}</div>

      <div>
        {quest.task_type === "kill" && "Ölj meg ellenfeleket."}
        {quest.task_type === "boss" && "Győzz le egy főellenséget."}
        {quest.task_type === "custom" && "Teljesítsd a speciális feltételt."}
      </div>

      <div>
        Haladás: {quest.progress}/{quest.target_amount}
      </div>

      <div>
        +{quest.reward_xp} XP<br/>
        +{quest.reward_gold} arany
      </div>

      {quest.status === "locked" && <div>Még zárolva</div>}
      {quest.status === "in_progress" && <div>Folyamatban</div>}
      {quest.status === "claimed" && <div>Már átvetted</div>}

      {canClaim && (
        <button
          onClick={handleClaim}
          className="quest-text-button"
        >
          Jutalom átvétele
        </button>
      )}

      {msg && <div>{msg}</div>}
      <button
        onClick={onClose}
        className="quest-paper-close-text"
      >
        Bezárás
      </button>
    </div>

  </div>

</div>
);
}