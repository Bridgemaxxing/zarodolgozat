import React, { useEffect, useMemo, useState } from "react";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";
import "./Beallitasok.css";

const CLASS_CONFIG = {
  6: { key: "warrior", displayName: "Harcos", sprite: "/ui/player/warriorsquare.png" },
  7: { key: "mage", displayName: "Varázsló", sprite: "/ui/player/magesquare.png" },
  8: { key: "archer", displayName: "Íjász", sprite: "/ui/player/ijasz.png" },
};

const SKIP_LS_KEY = "skipLoadingScreen";

export default function BeallitasokModal({ onClose }) {
  const { player } = usePlayer() || {};
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState("hang");
  const [isClosing, setIsClosing] = useState(false);

  // Hang
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);
  const [masterOn, setMasterOn] = useState(true);
  const [musicVol, setMusicVol] = useState(70);
  const [sfxVol, setSfxVol] = useState(80);
  const [masterVol, setMasterVol] = useState(90);

  // Profil edit
  const [editOpen, setEditOpen] = useState(false);
  const [editField, setEditField] = useState("username");
  const [editValue, setEditValue] = useState("");

  const profileSprite = useMemo(() => {
    const cid = Number(player?.class_id);
    return CLASS_CONFIG[cid]?.sprite || "";
  }, [player?.class_id]);

  const username = player?.username || "Ismeretlen";
  const email = player?.email || player?.mail || "";
  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  const isAdmin = Number(player?.admin) === 1;

  const TABS = useMemo(() => {
    const tabs = [
      { key: "hang", label: t("sound") },
      { key: "nyelv", label: t("language") },
      { key: "profil", label: t("profile") },
    ];

    if (isAdmin) {
      tabs.push({ key: "admin", label: t("adminMode") });
    }

    return tabs;
  }, [isAdmin, t]);

  useEffect(() => {
    if (!isAdmin && activeTab === "admin") setActiveTab("hang");
  }, [isAdmin, activeTab]);

  const stats = player?.statistics || player?.stats || player?.stat || null;

  const statRows = [
    { key: "enemies_defeated", label: "Legyőzött ellenfelek" },
    { key: "bosses_defeated", label: "Legyőzött bossok" },
    { key: "battles_played", label: "Lejátszott csaták" },
    { key: "battles_won", label: "Megnyert csaták" },
    { key: "total_damage", label: "Összes sebzés" },
    { key: "total_damage_taken", label: "Kapott sebzés" },
  ];
  const createdAtText = useMemo(() => formatCreatedAt(player?.created_at), [player?.created_at]);


  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => onClose?.(), 300);
  };

  const openEdit = (fieldKey) => {
    setEditField(fieldKey);
    setEditValue("");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditValue("");
  };

  const handleProfileChange = () => {
    alert(`${editField === "username" ? "Felhasználónév" : "Email"} változtatás (placeholder): ${editValue}`);
    closeEdit();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/70 z-50 beallitasok-overlay ${isClosing ? "opacity-0" : "opacity-100"}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="beallitasok-overlayInner">
        <div className={`beallitasok beallitasok-container relative ${isClosing ? "closing" : ""}`}>
          <button type="button" onClick={handleClose} className="beallitasok-close kilepes" aria-label="Bezárás">
            X
          </button>

          <div className="beallitasok-tabs" role="tablist" aria-label="Beállítások fülek">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`beallitasok-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.key);
                closeEdit();
              }}
            >
              {tab.label}
            </button>
          ))}
          </div>

          <div className="beallitasok-panelWrap">
            <div className="beallitasok-body invMinden">
              {/* HANG */}
              {activeTab === "hang" && (
                <div className="beallitasok-panel invStatsBorder">
                  <div className="beallitasok-panel-title invEquipmentText">{t("sound").toUpperCase()}</div>

                  <AudioRow label="Zene" enabled={musicOn} onToggle={() => setMusicOn((v) => !v)} value={musicVol} onChange={setMusicVol} />
                  <AudioRow label="Effektek" enabled={sfxOn} onToggle={() => setSfxOn((v) => !v)} value={sfxVol} onChange={setSfxVol} />
                  <AudioRow label="Master" enabled={masterOn} onToggle={() => setMasterOn((v) => !v)} value={masterVol} onChange={setMasterVol} />

                  <div className="beallitasok-note invInvValassz">Placeholder: később ténylegesen mentjük/alkalmazzuk.</div>
                </div>
              )}

              {/* NYELV */}
              {activeTab === "nyelv" && (
                <div className="beallitasok-panel invStatsBorder">
                 <div className="beallitasok-panel-title invEquipmentText">{t("language").toUpperCase()}</div>

                  <div className="beallitasok-langWrapBig">
                  <button
                  type="button"
                  className={`beallitasok-langBtnBig invInvEquipBtn ${language === "hu" ? "selected" : ""}`}
                  onClick={() => setLanguage("hu")}
                >
                  <span className="pixel-flag-big flag-hu" aria-hidden="true" />
                  <span className="beallitasok-langTextBig">{t("hungarian")}</span>
                </button>

                <button
                  type="button"
                  className={`beallitasok-langBtnBig invInvEquipBtn ${language === "en" ? "selected" : ""}`}
                  onClick={() => setLanguage("en")}
                >
                  <span className="pixel-flag-big flag-uk" aria-hidden="true" />
                  <span className="beallitasok-langTextBig">{t("english")}</span>
                </button>
                  </div>

                  <div className="beallitasok-note invInvValassz">{t("languageSaved")}</div>
                </div>
              )}

              {/* PROFIL */}
              {activeTab === "profil" && (
                <div className="beallitasok-panel invStatsBorder">
                  <div className="beallitasok-panel-title invEquipmentText beallitasok-titleBig">{t("profile").toUpperCase()}</div>
                  <div className="beallitasok-profileCenter">
                    <div className="beallitasok-avatarOutline">
                      {profileSprite ? (
                        <img src={profileSprite} alt="Profilkép" className="beallitasok-avatarImg" />
                      ) : (
                        <div className="beallitasok-avatarFallback invInvValassz">(Nincs kép)</div>
                      )}
                    </div>

                    <div className="beallitasok-inlineField">
                      <div className="beallitasok-inlineText invCharacterText">{username}</div>
                      <button type="button" className="beallitasok-pencil" title="Felhasználónév módosítása" onClick={() => openEdit("username")}>
                        ✎
                      </button>
                    </div>

                    <div className="beallitasok-inlineField">
                      <div className="beallitasok-inlineText invEquipmentText">{maskedEmail || "—"}</div>
                      <button type="button" className="beallitasok-pencil" title="Email módosítása" onClick={() => openEdit("email")}>
                        ✎
                      </button>
                    </div>

                    <div className="beallitasok-subTitle invEquipmentText">STATISZTIKÁK</div>

                    <div className="beallitasok-statsTableWrap">
                      <table className="beallitasok-statsTable">
                        <tr>
  <td className="beallitasok-statsKey invStatName">Regisztráció ideje</td>
  <td className="beallitasok-statsVal invEquipmentText">{createdAtText || "—"}</td>
</tr>

                        <tbody>
                          {statRows.map((r) => (
                            <tr key={r.key}>
                              <td className="beallitasok-statsKey invStatName">{r.label}</td>
                              <td className="beallitasok-statsVal invEquipmentText">
                                {stats && stats[r.key] != null ? stats[r.key] : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="beallitasok-note invInvValassz" style={{ marginTop: 8 }}>
                        (Ha még nem küldöd a statokat a backendből, akkor itt “—” lesz.)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN */}
              {activeTab === "admin" && isAdmin && (
                <div className="beallitasok-panel invStatsBorder">
                  <div className="beallitasok-panel-title invEquipmentText">{t("adminMode").toUpperCase()}</div>
                  <AdminPanel adminId={player?.id} targetPlayerId={player?.id} />
                </div>
              )}
            </div>
          </div>

          {/* Edit popup */}
          {editOpen && (
            <div className="beallitasok-editOverlay" onClick={closeEdit}>
              <div className="beallitasok-editModal invStatsBorder" onClick={(e) => e.stopPropagation()}>
                <div className="beallitasok-editHeader invEquipedItems">
                  <div className="beallitasok-editTitle invEquipmentText">
                    {editField === "username" ? "FELHASZNÁLÓNÉV" : "EMAIL"} VÁLTOZTATÁS
                  </div>

                  <button type="button" className="beallitasok-editClose invInvItemClear" onClick={closeEdit} aria-label="Bezárás">
                    X
                  </button>
                </div>

                <div className="beallitasok-editBody invItemsBorder">
                  <div className="beallitasok-editLabel invStatName">Új érték</div>

                  <input
                    className="beallitasok-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    type="text"
                    placeholder={editField === "email" ? "pl. valami@email.com" : "pl. uj_felhasznalo"}
                  />

                  <div className="beallitasok-editActions">
                    <button type="button" className="invInvUnEquipBtn beallitasok-editBtn" onClick={closeEdit}>
                      Mégse
                    </button>
                    <button
                      type="button"
                      className="invInvEquipBtn beallitasok-editBtn"
                      onClick={handleProfileChange}
                      disabled={!editValue.trim()}
                      style={{
                        opacity: editValue.trim() ? 1 : 0.6,
                        cursor: editValue.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      Változtat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   ADMIN PANEL (SET / UPDATE)
   - uncontrolled input (caret fix)
   - csak intet enged
   - csak a kitöltött mezőket küldi
   - max_hp küldésekor hp=max_hp is megy
   + ✅ Loading screen skip toggle (admin only)
   ------------------------- */
function AdminPanel({ adminId, targetPlayerId }) {
  const [loading, setLoading] = useState(false);

  // ✅ loading skip
  const [skipLoading, setSkipLoading] = useState(() => {
    try {
      return localStorage.getItem(SKIP_LS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const toggleSkipLoading = () => {
    setSkipLoading((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SKIP_LS_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  // ✅ uncontrolled inputok
  const refs = {
    gold: React.useRef(null),
    max_hp: React.useRef(null),
    xp: React.useRef(null),
    level: React.useRef(null),
    strength: React.useRef(null),
    intellect: React.useRef(null),
    defense: React.useRef(null),
  };

  const readInt = (ref) => {
    const s = (ref?.current?.value ?? "").trim();
    if (s === "") return null;
    if (!/^-?\d+$/.test(s)) return "__INVALID__";
    const n = Number(s);
    if (!Number.isInteger(n)) return "__INVALID__";
    return n;
  };

  const save = async () => {
    if (!adminId || !targetPlayerId) return alert("Nincs admin/target id.");

    const values = {};
    for (const k of Object.keys(refs)) {
      const n = readInt(refs[k]);
      if (n === "__INVALID__") return alert(`Hibás szám: ${k}`);
      if (n != null) values[k] = n;
    }

    if (values.max_hp != null) values.hp = values.max_hp;
    if (Object.keys(values).length === 0) return alert("Nem írtál be semmit.");

    try {
      setLoading(true);

      const res = await fetch("https://nodejs202.dszcbaross.edu.hu//api/admin/set-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, targetPlayerId, values }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(data?.error || data?.message || "Hiba az admin állításnál.");

      alert("Sikeres mentés!");

      Object.values(refs).forEach((r) => {
        if (r.current) r.current.value = "";
      });
    } catch {
      alert("Hálózati hiba.");
    } finally {
      setLoading(false);
    }
  };

  const Row = ({ label, k, placeholder }) => (
    <div className="beallitasok-row invStatsDiv">
      <div className="beallitasok-label invStatName">{label}</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
        <input
          ref={refs[k]}
          className="beallitasok-input"
          style={{ width: 180, textAlign: "right" }}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            if (!/^-?\d*$/.test(v)) {
              e.target.value = v.replace(/[^\d-]/g, "");
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="beallitasok-note invInvValassz" style={{ marginBottom: 12 }}>
        Írd be az új értéket (SET). Üres mező = nem változik. Max HP mentéskor HP is fullra tölt.
      </div>

      <Row label="Gold (SET)" k="gold" placeholder="-" />
      <Row label="Max HP (SET)" k="max_hp" placeholder="-" />
      <Row label="XP (SET)" k="xp" placeholder="-" />
      <Row label="Level (SET)" k="level" placeholder="-" />
      <Row label="Strength (SET)" k="strength" placeholder="-" />
      <Row label="Intellect (SET)" k="intellect" placeholder="-" />
      <Row label="Defense (SET)" k="defense" placeholder="-" />

      <div className="beallitasok-editActions" style={{ marginTop: 12 }}>
        <button
          type="button"
          className="invInvEquipBtn beallitasok-editBtn"
          onClick={save}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Mentés..." : "Mentés"}
        </button>
      </div>

      {/* ✅ SKIP TOGGLE: ADMIN ALJÁN */}
      <div className="beallitasok-row invStatsDiv" style={{ marginTop: 16 }}>
        <div className="beallitasok-label invStatName">Loading screen skip</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={toggleSkipLoading}
            className={`beallitasok-toggle ${skipLoading ? "on" : "off selected"}`}
            aria-pressed={skipLoading}
            title="Ha ON, az utazós loading képernyőt átugorja"
          >
            {skipLoading ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="beallitasok-note invInvValassz" style={{ marginTop: 8, opacity: 0.9 }}>
        {skipLoading
          ? "ON: az utazás/loading képernyő azonnal skipelődik."
          : "OFF: az utazás/loading képernyő visszaszámlál."}
      </div>
    </div>
  );
}

/* ---------- meglévő cuccok ---------- */

function AudioRow({ label, enabled, onToggle, value, onChange }) {
  return (
    <div className={`beallitasok-row invStatsDiv ${!enabled ? "audio-disabled" : ""}`}>
      <div className="beallitasok-label invStatName">{label}</div>

      <div className="beallitasok-audioRight">
        <Toggle enabled={enabled} onToggle={onToggle} />
        <Slider value={value} onChange={onChange} disabled={!enabled} />
        <div className="beallitasok-audioValue">{value}</div>
      </div>
    </div>
  );
}

function Slider({ value, onChange, disabled }) {
  return (
    <input
      className="beallitasok-slider pixelRange"
      type="range"
      min="0"
      max="100"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={`beallitasok-toggle ${enabled ? "on" : "off selected"}`}
      onClick={onToggle}
      aria-pressed={enabled}
    >
      {enabled ? "ON" : "OFF"}
    </button>
  );
}

function maskEmail(email) {
  if (!email || typeof email !== "string") return "";
  const at = email.indexOf("@");
  if (at <= 0) return email;

  const local = email.slice(0, at);
  const domain = email.slice(at);

  if (local.length <= 2) return local + "*****" + domain;

  const first2 = local.slice(0, 2);
  const last2 = local.length >= 4 ? local.slice(-2) : local.slice(-1);
  return `${first2}*****${last2}${domain}`;
}

function formatCreatedAt(v) {
  if (!v) return "";

  // MySQL DATETIME általában: "2026-02-06 19:28:32"
  // Safari miatt lecseréljük space -> 'T' + ha nincs timezone, így is jó lesz a legtöbb böngészőben
  const s = String(v).replace(" ", "T");
  const d = new Date(s);

  // ha parse fail (Invalid Date), akkor nyomjuk ki nyersen
  if (Number.isNaN(d.getTime())) return String(v);

  return d.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
