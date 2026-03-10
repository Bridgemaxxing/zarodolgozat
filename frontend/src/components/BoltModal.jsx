import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext.jsx";
import "./BoltModal.css";

export default function ShopModal({ onClose }) {
  const { t } = useLanguage();

  const [isClosing, setIsClosing] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [mode, setMode] = useState("buy");
  const [activeCategory, setActiveCategory] = useState("weapon");
  const [fullStats, setFullStats] = useState(null);

  const userId = localStorage.getItem("sk_current_user_id");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const itemsToShow =
    mode === "buy"
      ? shopItems.filter((i) => i.type === activeCategory)
      : inventoryItems.filter((i) => i.type === activeCategory);

  const finalHp = fullStats?.final?.hp ?? null;
  const finalMaxHp = fullStats?.final?.max_hp ?? null;
  const hpKey = userId ? `adventure_hp_${userId}` : null;

  const readRunHp = () => {
    if (!hpKey) return null;
    const raw = sessionStorage.getItem(hpKey);
    return raw == null ? null : Number(raw);
  };

  const runHp = readRunHp();
  const currentHp = runHp ?? finalHp;
  const maxHp = finalMaxHp;
  const isFull = currentHp != null && maxHp != null && currentHp >= maxHp;
  const HEAL_COST = 100;

  const CATEGORIES = [
    { type: "weapon", icon: "⚔️", label: t("weapon") },
    { type: "helmet", icon: "👑", label: t("helmet") },
    { type: "armor", icon: "🛡️", label: t("armor") },
    { type: "accessory", icon: "💍", label: t("accessory") },
  ];

  useEffect(() => {
    if (!error) return;

    setShowError(true);

    const timer = setTimeout(() => {
      setShowError(false);
    }, 3000);

    const cleanup = setTimeout(() => {
      setError(null);
    }, 3350);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [error]);

  useEffect(() => {
    if (!userId) return;

    fetch(`https://nodejs202.dszcbaross.edu.hu/api/player/${userId}/full-stats`)
      .then((r) => r.json())
      .then(setFullStats);

    fetch(`https://nodejs202.dszcbaross.edu.hu/api/inventory/${userId}`)
      .then((r) => r.json())
      .then(setInventoryItems);
  }, [userId]);

  useEffect(() => {
    const classId = fullStats?.player?.class_id;
    if (!userId || !classId) return;

    fetch(`https://nodejs202.dszcbaross.edu.hu/api/items?classId=${classId}`)
      .then((r) => r.json())
      .then(setShopItems);
  }, [userId, fullStats?.player?.class_id]);

  const refreshAll = async () => {
    const stats = await fetch(
      `https://nodejs202.dszcbaross.edu.hu/api/player/${userId}/full-stats`
    ).then((r) => r.json());
    setFullStats(stats);

    const inv = await fetch(
      `https://nodejs202.dszcbaross.edu.hu/api/inventory/${userId}`
    ).then((r) => r.json());
    setInventoryItems(inv);
  };

  const buy = async (itemId) => {
    setBusy(true);
    try {
      const res = await fetch("https://nodejs202.dszcbaross.edu.hu/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: Number(userId), itemId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || t("shopBuyFailed"));
        setShowError(true);
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
      const res = await fetch("https://nodejs202.dszcbaross.edu.hu/api/shop/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: Number(userId), itemId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || t("shopSellFailed"));
        setShowError(true);
      } else {
        await refreshAll();
      }
    } finally {
      setBusy(false);
    }
  };

  const healForGold = async () => {
    if (!userId) return;

    if (maxHp == null || currentHp == null) {
      setError(t("shopStatsLoading"));
      return;
    }

    if (isFull) {
      setError(t("shopFullHp"));
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("https://nodejs202.dszcbaross.edu.hu/api/shop/heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: Number(userId) }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || t("shopHealFailed"));
        return;
      }

      sessionStorage.setItem(hpKey, String(maxHp));
      await refreshAll();
    } finally {
      setBusy(false);
    }
  };

  console.log("HEAL AFTER setItem", {
    hpKey,
    storedNow: sessionStorage.getItem(hpKey),
    maxHp,
  });

  const heal = async () => {
    setBusy(true);
    try {
      const res = await fetch("https://nodejs202.dszcbaross.edu.hu/api/shop/heal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: Number(userId) }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || t("shopHealFailed"));
        setShowError(true);
        return;
      }

      sessionStorage.removeItem(`adventure_hp_${userId}`);
      await refreshAll();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "fade-out" : "fade-in"}`}>
      <div
        className={`shopBorder relative w-[90%] h-[90%] overflow-hidden modal-content ${
          isClosing ? "scale-down" : "scale-up"
        }`}
        style={{
          backgroundImage: `url("/images/BOLT.gif")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button
          onClick={handleClose}
          className="kilepes absolute top-4 right-4 text-white z-30"
          aria-label={t("close")}
          title={t("close")}
        >
          X
        </button>

        <div className="Stats space-y-2 absolute/60 p-4 w-64 z-20">
          <div className="StatsStatsName flex justify-between">
            {t("levelUpper")}: <span className="StatsStats">{fullStats?.player?.level ?? "-"}</span>
          </div>
          <div className="StatsStatsName flex justify-between">
            XP: <span className="StatsStats">{fullStats?.player?.xp ?? "-"}</span>
          </div>
          <div className="StatsStatsName flex justify-between">
            {t("goldUpper")}: <span className="StatsStats">{fullStats?.player?.gold ?? "-"}</span>
          </div>
        </div>

        <div className="kategoriakBorder absolute bottom-[30%] left-4 flex gap-3 px-4 py-2 z-20">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.type}
              onClick={() => setActiveCategory(cat.type)}
              className={`kategoriakButton ${activeCategory === cat.type ? "active" : ""}`}
              title={cat.label}
              aria-label={cat.label}
            >
              {cat.icon}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          <div className="text-white">
            {t("hpUpper")}: <b>{currentHp ?? "-"}</b> / <b>{maxHp ?? "-"}</b>
          </div>

          <button
            onClick={healForGold}
            disabled={busy || isFull}
            className="px-4 py-2 bg-green-700 rounded disabled:opacity-50 boltHealGomb"
          >
            {t("healing")} ({HEAL_COST} {t("goldLower")})
          </button>
        </div>

        <div className="veszeladGombDiv gap-3 absolute bottom-[30%] right-4 flex z-20">
          <button
            onClick={() => setMode("buy")}
            className={`veszButton px-6 py-2 ${mode === "buy" ? "active" : ""}`}
          >
            {t("buyUpper")}
          </button>

          <button
            onClick={() => setMode("sell")}
            className={`eladButton px-6 py-2 ${mode === "sell" ? "active" : ""}`}
          >
            {t("sellUpper")}
          </button>
        </div>

        <div className="alsoSav absolute bottom-0 left-0 right-0 h-[28%] p-4 z-20">
          <div className="h-full">
            <div className="grid grid-cols-9 gap-3">
              {itemsToShow.map((item) => (
                <div
                  key={item.id || item.item_id}
                  className="targyDiv p-2 flex flex-col"
                >
                  <div className={`targyNev text-center truncate rarity-${item.rarity}`}>
                    {item.name}
                  </div>

                  <div className="text-center text-gray-300">
                    {item.min_dmg ? `${item.min_dmg}-${item.max_dmg}` : "—"}
                  </div>

                  {mode === "buy" ? (
                    <button
                      onClick={() => buy(item.id)}
                      disabled={busy}
                      className="targyBuyButton py-1"
                    >
                      {item.prize}
                    </button>
                  ) : (
                    <button
                      onClick={() => sell(item.item_id)}
                      disabled={busy}
                      className="targySellButton Button py-1"
                    >
                      {Math.floor(item.prize * 0.9)}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`shopAlert ${showError ? "shopAlert-show" : "shopAlert-hide"}`}>
          {error}
        </div>
      </div>
    </div>
  );
}