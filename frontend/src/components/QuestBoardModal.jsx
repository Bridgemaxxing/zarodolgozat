// frontend/src/components/QuestBoardModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import QuestDetailsModal from "./QuestDetailsModal.jsx";
import "./QuestBoardModal.css";

export default function QuestBoardModal({
  playerId,
  playerClassId,
  onClose,
  onStartQuestBattle,
}) {

  const classIdNum = Number(playerClassId);

  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [closing, setClosing] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);

  const loadQuests = useCallback(async () => {
    if (!playerId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://nodejs202.dszcbaross.edu.hu/api/quests/${playerId}`
      );

      const data = await res.json();

      const filtered = (data || []).filter(
        (q) =>
          q.class_required === null ||
          Number(q.class_required) === classIdNum
      );

      setQuests(filtered);
      setErrorMsg("");

    } catch (err) {
      console.error(err);
      setErrorMsg("Nem sikerült betölteni a küldetéseket.");
    } finally {
      setLoading(false);
    }
  }, [playerId, classIdNum]);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 350);
  }

  const positions = [
  { top: "22%", left: "12%", rotate: "-6deg" },
  { top: "23%", left: "38%", rotate: "4deg" },
  { top: "17%", left: "62%", rotate: "-3deg" },
  { top: "50%", left: "15%", rotate: "5deg" },
  { top: "50%", left: "42%", rotate: "-5deg" },
  { top: "48%", left: "66%", rotate: "3deg" },
];
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div
        className={`quest-board-container relative rounded-xl shadow-2xl overflow-hidden ${
          closing ? "closing" : ""
        }`}
        style={{
          width: "90vw",
          height: "90vh",
          maxWidth: 1400,
          maxHeight: 900,
        }}
      >

        {/* QUESTWINDOW */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: 'url("/images/QUESTWINDOW.png")' }}
        />

        <button
          onClick={handleClose}
          className="kilepes absolute top-5 right-6 z-30"
        >
          X
        </button>

        {/* BAL DIV */}
        <div
          onClick={() => setBoardOpen(true)}
          className="baldiv absolute cursor-pointer z-20"
          style={{
            //background:"black",
            top: "22%",
            left: "8%",
            width: "25%",
            height: "32%",
          }}
        />

        {/* JOBB DIV */}
        <div
          className="absolute cursor-pointer z-20"
          style={{
            top: "25%",
            right: "24%",
            width: "20%",
            height: "35%",
          }}
        />

        {/* QUEST BOARD */}
        {boardOpen && (
          <div className="bg-black/70 absolute inset-0 flex items-center justify-center z-40">

            <div
              className="relative bg-cover bg-center"
              style={{
                width: "900px",
                height: "700px",
                backgroundImage: 'url("/images/QUESTBOARD.png")',
              }}
            >

              <button
                onClick={() => setBoardOpen(false)}
                className="kilepes absolute top-6 right-8"
              >
                X
              </button>

              {quests.slice(0,6).map((q, i) => {

                const pos = positions[i];

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedQuest({ ...q, paperIndex: i })}
                    className="quest-icon"
                    style={{
                      backgroundImage: `url(/images/quest${i+1}.png)`,
                      top: pos.top,
                      left: pos.left,
                      transform: `rotate(${pos.rotate})`
                    }}
                  >
                    {i+1}.
                  </div>
                );
              })}

            </div>

          </div>
        )}

        {errorMsg && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-yellow-200 text-sm bg-black/60 px-4 py-2 rounded">
            {errorMsg}
          </div>
        )}

        {selectedQuest && (
          <QuestDetailsModal
            quest={selectedQuest}
            playerId={playerId}
            onClose={() => setSelectedQuest(null)}
            onClaimSuccess={() => {
              setSelectedQuest(null);
              loadQuests();
            }}
            onStartQuestBattle={(payload) => {
              onStartQuestBattle?.(payload);
              onClose?.();
            }}
          />
        )}

      </div>
    </div>
  );
}