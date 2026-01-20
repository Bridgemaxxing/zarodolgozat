import React, { useEffect, useState } from "react";
import "./BoltModal.css";

export default function ShopModal({ onClose }) {
  const [playerData, setPlayerData] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("buy"); // buy | sell
  const [activeCategory, setActiveCategory] = useState("weapon");

  const userId = localStorage.getItem("sk_current_user_id");

  const CATEGORIES = [
    { type: "weapon", icon: "⚔️" },
    { type: "armor", icon: "🛡️" },
    { type: "accessory", icon: "💍" },
    { type: "potion", icon: "🧪" }
  ];

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/api/players/${userId}`)
      .then(r => r.json())
      .then(setPlayerData);

    fetch("http://localhost:3000/api/items")
      .then(r => r.json())
      .then(setShopItems);

    fetch(`http://localhost:3000/api/inventory/${userId}`)
      .then(r => r.json())
      .then(setInventoryItems);
  }, [userId]);

  const refreshAll = async () => {
    const player = await fetch(
      `http://localhost:3000/api/players/${userId}`
    ).then(r => r.json());
    setPlayerData(player);

    const inv = await fetch(
      `http://localhost:3000/api/inventory/${userId}`
    ).then(r => r.json());
    setInventoryItems(inv);
  };

  const buy = async (itemId) => {
    setBusy(true);
    try {
      const res = await fetch("http://localhost:3000/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: Number(userId), itemId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Sikertelen vásárlás");
      } else {
        await refreshAll();
      }
    } finally {
      setBusy(false);
    }
  };

  const sell = async (itemId) => {
    setBusy(true);
    try {
      const res = await fetch("http://localhost:3000/api/shop/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: Number(userId), itemId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Sikertelen eladás");
      } else {
        await refreshAll();
      }
    } finally {
      setBusy(false);
    }
  };

  const itemsToShow =
    mode === "buy"
      ? shopItems.filter(i => i.type === activeCategory)
      : inventoryItems.filter(i => i.type === activeCategory);

  return (
    <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
      <div
        className="shopBorder relative w-[90%] h-[90%] overflow-hidden"
        style={{
          backgroundImage: `url("./src/assets/pics/BOLT.gif")`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Kilépés */}
        <button
          onClick={onClose}
          className="kilepes absolute top-4 right-4 text-white z-30"
        >
          X
        </button>

        {/* STATS */}
        <div className="Stats absolute bg-white/60 text-white p-4 w-64 z-20">
          <div className="">SZINT: {playerData?.level ?? "-"}</div>
          <div>XP: {playerData?.xp ?? "-"}</div>
          <div>ARANY: {playerData?.gold ?? "-"}</div>
        </div>

        {/* KATEGÓRIA GOMBOK – BAL */}
        <div className="absolute bottom-[30%] left-4 flex gap-3 bg-black/60 px-4 py-2 rounded z-20">
          {CATEGORIES.map(cat => (
            <button
              key={cat.type}
              onClick={() => setActiveCategory(cat.type)}
              className={`text-2xl ${
                activeCategory === cat.type
                  ? "scale-110"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>

        {/* VESZ / ELAD – JOBB */}
        <div className="absolute bottom-[30%] right-4 flex bg-black/60 rounded z-20">
          <button
            onClick={() => setMode("buy")}
            className={`px-6 py-2 text-white ${
              mode === "buy" ? "bg-yellow-700" : "opacity-60"
            }`}
          >
            VESZ
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`px-6 py-2 text-white ${
              mode === "sell" ? "bg-yellow-700" : "opacity-60"
            }`}
          >
            ELAD
          </button>
        </div>

        {/* ALSÓ ITEM SÁV */}
        <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-black/70 p-4 z-20">
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-9 gap-3">
              {itemsToShow.map(item => (
                <div
                  key={item.id || item.item_id}
                  className="bg-black/60 border border-yellow-700 p-2 text-xs text-white flex flex-col justify-between hover:bg-black/80 transition"
                >
                  <div className="text-center font-medium truncate">
                    {item.name}
                  </div>

                  <div className="text-center text-gray-300">
                    {item.min_dmg
                      ? `${item.min_dmg}-${item.max_dmg}`
                      : "—"}
                  </div>

                  {mode === "buy" ? (
                    <button
                      onClick={() => buy(item.id)}
                      disabled={busy}
                      className="mt-1 border border-yellow-600 py-1 hover:bg-yellow-800/40 disabled:opacity-50"
                    >
                      {item.prize}
                    </button>
                  ) : (
                    <button
                      onClick={() => sell(item.item_id)}
                      disabled={busy}
                      className="mt-1 border border-red-700 py-1 hover:bg-red-800/40 disabled:opacity-50"
                    >
                      {Math.floor(item.prize * 0.9)}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-[32%] left-1/2 -translate-x-1/2 bg-red-900/80 text-white px-4 py-2 rounded z-20">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
