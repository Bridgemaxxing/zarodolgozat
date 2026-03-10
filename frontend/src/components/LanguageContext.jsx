import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_LS_KEY = "appLanguage";

const translations = {
  hu: {

    homeUpper: "OTTHON",
        equipment: "Felszerelés",
        stats: "Stats",
        inventory: "Inventory",
        clickForDetails: "Kattints a részletekhez",
        emptySlot: "Üres slot",
        empty: "Üres",
        inventoryEmpty: "Az inventory üres",
        selected: "Selected",
        equip: "Felvétel",
        unequip: "Levétel",
        selectItem: "Válassz ki egy tárgyat",
        deck: "Deck",
        deckNotSavedYet: "*jelenleg nem mentődik el a deck ha kilépsz*",
        capacity: "Capacity",
        availableAbilities: "Elérhető képességek",
        activeDeck: "Aktív Deck",
        emptyDeck: "Empty Deck",
        cancelUpper: "MÉGSE",
        saveDeck: "DECK MENTÉS",
        exitHouse: "Kilépés a házból",
        spellbook: "Varázskönyv",
        inventoryLabel: "Leltár",
        statistics: "Statisztikák",
        level: "Szint",
        hp: "Életerő",
        strength: "Erő",
        intellect: "Intelligencia",
        defense: "Védelem",
        gold: "Arany",
        houseTutInventory: "Kattints a Leltárra (felszerelés kezelése).",
        houseTutDeck: "Kattints a Szekrényre (deck szerkesztés).",
        houseTutStats: "Kattints a Statisztikákra (stat pontok).",
        houseTutExit: "Kattints a Kilépésre (vissza a Hubba).",

    menu: "Menü",
    settings: "Beállítások",
    logout: "Kijelentkezés",
    logoutPlaceholder: "Kijelentkezés (placeholder)",

    travel: "Utazás",
    blacksmith: "Kovács",
    quests: "Küldetések",
    shop: "Bolt",
    home: "Otthon",

    welcome: "Üdvözöllek!",
    hubIntroLine1:
      "Ez az a hely, ahol felkészülhetsz a következő utadra. Itt fejleszthetsz, vásárolhatsz, küldetéseket vállalhatsz, és rendbe teheted, amid van.",
    hubIntroLine2: "Ha készen állsz, továbbléphetsz az utazás felé.",
    continue: "Tovább",

    tutorialHome: "Kattints az OTTHON-ra (Inventory / Deck / Stats).",
    tutorialBlacksmith: "Kattints a KOVÁCS-ra (fejlesztések).",
    tutorialShop: "Kattints a BOLT-ra (vásárlás).",
    tutorialQuests: "Kattints a KÜLDETÉSEK-re.",
    tutorialTravel: "Kattints az UTAZÁS-ra (kaland indítása).",

    tab_sound: "Hang",
    tab_language: "Nyelv",
    tab_profile: "Profil",
    tab_admin: "Admin mód",

    soundTitle: "HANG",
    languageTitle: "NYELV",
    profileTitle: "PROFIL",
    adminTitle: "ADMIN MÓD",

    music: "Zene",
    effects: "Effektek",
    master: "Master",

    saveLaterNote: "Placeholder: később ténylegesen mentjük/alkalmazzuk.",
    languageSaveNote: "A nyelv azonnal vált és localStorage-ba mentődik.",

    profileImage: "Profilkép",
    noImage: "(Nincs kép)",
    unknown: "Ismeretlen",
    statsTitle: "STATISZTIKÁK",
    registeredAt: "Regisztráció ideje",

    enemiesDefeated: "Legyőzött ellenfelek",
    bossesDefeated: "Legyőzött bossok",
    battlesPlayed: "Lejátszott csaták",
    battlesWon: "Megnyert csaták",
    totalDamage: "Összes sebzés",
    totalDamageTaken: "Kapott sebzés",

    statsBackendNote: "(Ha még nem küldöd a statokat a backendből, akkor itt “—” lesz.)",

    editUsernameTitle: "Felhasználónév módosítása",
    editEmailTitle: "Email módosítása",
    changeUsername: "FELHASZNÁLÓNÉV VÁLTOZTATÁS",
    changeEmail: "EMAIL VÁLTOZTATÁS",
    newValue: "Új érték",
    cancel: "Mégse",
    change: "Változtat",
    close: "Bezárás",
    exampleEmail: "pl. valami@email.com",
    exampleUsername: "pl. uj_felhasznalo",

    adminNote:
      "Írd be az új értéket (SET). Üres mező = nem változik. Max HP mentéskor HP is fullra tölt.",
    goldSet: "Gold (SET)",
    maxHpSet: "Max HP (SET)",
    xpSet: "XP (SET)",
    levelSet: "Level (SET)",
    strengthSet: "Strength (SET)",
    intellectSet: "Intellect (SET)",
    defenseSet: "Defense (SET)",
    save: "Mentés",
    saving: "Mentés...",
    loadingSkip: "Loading screen skip",
    loadingSkipOn: "ON: az utazás/loading képernyő azonnal skipelődik.",
    loadingSkipOff: "OFF: az utazás/loading képernyő visszaszámlál.",
    statUpgradeTitle: "Stat Fejlesztés",
unspentPoints: "Elosztható pontok",
strengthShort: "Erő (STR)",
intellectShort: "Intelligencia (INT)",
defenseShort: "Védelem (DEF)",
hpUpgradeLabel: "Életerő (Max HP +5)",
statSaveError: "Nem sikerült menteni a statokat.",
weapon: "Fegyver",
helmet: "Sisak",
armor: "Páncél",
accessory: "Kiegészítő",
levelUpper: "SZINT",
goldUpper: "ARANY",
hpUpper: "HP",
goldLower: "gold",
healing: "Gyógyítás",
buyUpper: "VESZ",
sellUpper: "ELAD",
shopBuyFailed: "Sikertelen vásárlás",
shopSellFailed: "Sikertelen eladás",
shopHealFailed: "Sikertelen gyógyítás",
shopStatsLoading: "Még tölt a stat (full-stats).",
shopFullHp: "Full HP-n vagy.",
chooseHeroTitle: "Válassz egy hőst",
chooseHeroAlert: "Válassz egy hőst!",
notLoggedInError: "Hiba: nem vagy bejelentkezve.",
saveClassError: "Nem sikerült menteni a kasztot!",
serverError: "Szerver hiba történt!",
unknownClass: "Ismeretlen kaszt.",
detailsUp: "Részletek ▲",
detailsDown: "Részletek ▼",
roleLabel: "Szerep",
strengthLabel: "Erősség",
weaknessLabel: "Gyengeség",
createButton: "Létrehozás",
classLoadErrorConsole: "Nem sikerült betölteni a kasztokat:",

warriorName: "Harcos",
warriorShort: "Masszív közelharcos, aki többféle irányba is építhető: lehet biztonságos bruiser, agresszív sebző vagy kitartó túlélő.",
warriorRole: "Sokoldalú frontline",
warriorStrength: "Rugalmas buildlehetőségek, stabil jelenlét és jó alkalmazkodás különböző helyzetekhez.",
warriorWeakness: "Rossz döntésekkel könnyen nyomás alá kerülhet.",

mageName: "Varázsló",
mageShort: "Pusztító varázshasználó, aki nagy sebzéssel rendelkezik de kevés hibát engedhet meg magának.",
mageRole: "Burst / control mágus",
mageStrength: "Magas sebzés, erős spellhatások és veszélyes kombók, amelyek gyorsan eldönthetnek egy harcot.",
mageWeakness: "Törékenyebb.",

archerName: "Íjász",
archerShort: "Stabil távolsági sebző, aki folyamatos nyomás alatt tartja az ellenfelet, miközben a petje sok beérkező sebzést felfog helyette.",
archerRole: "Stabil ranged DPS",
archerStrength: "Megbízható, folyamatos sebzés és nagyobb biztonság a pet támogatása miatt.",
archerWeakness: "Ha a pet kiesik vagy nem tudja megtartani a nyomást, sokkal sebezhetőbbé válik.",
menu: "Menü",
settings: "Beállítások",
logout: "Kijelentkezés",
logoutPlaceholder: "Kijelentkezés (placeholder)",
hubImageAlt: "hub",
player: "player",
welcome: "Üdvözöllek!",
hubIntroLine1:
  "Ez az a hely, ahol felkészülhetsz a következő utadra. Itt fejleszthetsz, vásárolhatsz, küldetéseket vállalhatsz, és rendbe teheted, amid van.",
hubIntroLine2: "Ha készen állsz, továbbléphetsz az utazás felé.",
continue: "Tovább",
travel: "Utazás",
blacksmith: "Kovács",
quests: "Küldetések",
shop: "Bolt",
home: "Otthon",
hubTutHome: "Kattints az OTTHON-ra (Inventory / Deck / Stats).",
hubTutBlacksmith: "Kattints a KOVÁCS-ra (fejlesztések).",
hubTutShop: "Kattints a BOLT-ra (vásárlás).",
hubTutQuests: "Kattints a KÜLDETÉSEK-re.",
hubTutTravel: "Kattints az UTAZÁS-ra (kaland indítása).",
loading: "Betöltés...",
upgradeGoldInfo: "Fejlesztésre fordítható arany:",
noUpgradeableItems: "Nincs tovább fejleszthető tárgyad.",
currentItem: "Jelenlegi tárgy",
upgradedItem: "Fejlesztett tárgy",
upgradeCost: "Fejlesztés költsége",
notEnoughGoldForUpgrade: "Nincs elég aranyod a fejlesztéshez.",
processing: "Feldolgozás...",
upgrade: "Fejlesztés",
blacksmithUpgradeFailed: "A fejlesztés nem sikerült.",
blacksmithServerError: "Hiba a szerverrel való kapcsolatban.",
networkError: "Hálózati hiba.",
  },

  en: {
                statUpgradeTitle: "Stat Upgrade",
            unspentPoints: "Unspent Points",
            strengthShort: "Strength (STR)",
            intellectShort: "Intellect (INT)",
            defenseShort: "Defense (DEF)",
            hpUpgradeLabel: "Health (Max HP +5)",
            statSaveError: "Failed to save stats.",

            homeUpper: "HOME",
        equipment: "Equipment",
        stats: "Stats",
        inventory: "Inventory",
        clickForDetails: "Click for details",
        emptySlot: "Empty slot",
        empty: "Empty",
        inventoryEmpty: "Inventory is empty",
        selected: "Selected",
        equip: "Equip",
        unequip: "Unequip",
        selectItem: "Select an item",
        deck: "Deck",
        deckNotSavedYet: "*currently the deck is not saved if you leave*",
        capacity: "Capacity",
        availableAbilities: "Available Abilities",
        activeDeck: "Active Deck",
        emptyDeck: "Empty Deck",
        cancelUpper: "CANCEL",
        saveDeck: "SAVE DECK",
        exitHouse: "Exit the house",
        spellbook: "Spellbook",
        inventoryLabel: "Inventory",
        statistics: "Statistics",
        level: "Level",
        hp: "Health",
        strength: "Strength",
        intellect: "Intellect",
        defense: "Defense",
        gold: "Gold",
        houseTutInventory: "Click Inventory (manage equipment).",
        houseTutDeck: "Click Wardrobe/Spellbook (edit deck).",
        houseTutStats: "Click Statistics (stat points).",
        houseTutExit: "Click Exit (return to the Hub).",

    menu: "Menu",
    settings: "Settings",
    logout: "Log out",
    logoutPlaceholder: "Log out (placeholder)",

    travel: "Travel",
    blacksmith: "Blacksmith",
    quests: "Quests",
    shop: "Shop",
    home: "Home",

    welcome: "Welcome!",
    hubIntroLine1:
      "This is the place where you can prepare for your next journey. Here you can upgrade, shop, take quests, and organize what you have.",
    hubIntroLine2: "When you're ready, you can move on to travel.",
    continue: "Continue",

    tutorialHome: "Click HOME (Inventory / Deck / Stats).",
    tutorialBlacksmith: "Click BLACKSMITH (upgrades).",
    tutorialShop: "Click SHOP (buying).",
    tutorialQuests: "Click QUESTS.",
    tutorialTravel: "Click TRAVEL (start adventure).",

    tab_sound: "Sound",
    tab_language: "Language",
    tab_profile: "Profile",
    tab_admin: "Admin Mode",

    soundTitle: "SOUND",
    languageTitle: "LANGUAGE",
    profileTitle: "PROFILE",
    adminTitle: "ADMIN MODE",

    music: "Music",
    effects: "Effects",
    master: "Master",

    saveLaterNote: "Placeholder: later this will be saved/applied for real.",
    languageSaveNote: "Language switches instantly and is saved to localStorage.",

    profileImage: "Profile image",
    noImage: "(No image)",
    unknown: "Unknown",
    statsTitle: "STATISTICS",
    registeredAt: "Registration date",

    enemiesDefeated: "Enemies defeated",
    bossesDefeated: "Bosses defeated",
    battlesPlayed: "Battles played",
    battlesWon: "Battles won",
    totalDamage: "Total damage",
    totalDamageTaken: "Damage taken",

    statsBackendNote: "(If stats are not sent from the backend yet, this will show “—”.)",

    editUsernameTitle: "Change username",
    editEmailTitle: "Change email",
    changeUsername: "CHANGE USERNAME",
    changeEmail: "CHANGE EMAIL",
    newValue: "New value",
    cancel: "Cancel",
    change: "Change",
    close: "Close",
    exampleEmail: "e.g. something@email.com",
    exampleUsername: "e.g. new_username",

    adminNote:
      "Enter the new value (SET). Empty field = unchanged. Saving Max HP also refills HP to full.",
    goldSet: "Gold (SET)",
    maxHpSet: "Max HP (SET)",
    xpSet: "XP (SET)",
    levelSet: "Level (SET)",
    strengthSet: "Strength (SET)",
    intellectSet: "Intellect (SET)",
    defenseSet: "Defense (SET)",
    save: "Save",
    saving: "Saving...",
    loadingSkip: "Loading screen skip",
    loadingSkipOn: "ON: the travel/loading screen is skipped instantly.",
    loadingSkipOff: "OFF: the travel/loading screen shows the countdown.",
    weapon: "Weapon",
    helmet: "Helmet",
    armor: "Armor",
    accessory: "Accessory",
    levelUpper: "LEVEL",
    goldUpper: "GOLD",
    hpUpper: "HP",
    goldLower: "gold",
    healing: "Heal",
    buyUpper: "BUY",
    sellUpper: "SELL",
    shopBuyFailed: "Purchase failed",
    shopSellFailed: "Sell failed",
    shopHealFailed: "Healing failed",
    shopStatsLoading: "Stats are still loading (full-stats).",
    shopFullHp: "You are at full HP.",
    chooseHeroTitle: "Choose a hero",
chooseHeroAlert: "Choose a hero!",
notLoggedInError: "Error: you are not logged in.",
saveClassError: "Failed to save class!",
serverError: "A server error occurred!",
unknownClass: "Unknown class.",
detailsUp: "Details ▲",
detailsDown: "Details ▼",
roleLabel: "Role",
strengthLabel: "Strength",
weaknessLabel: "Weakness",
createButton: "Create",
classLoadErrorConsole: "Failed to load classes:",

warriorName: "Warrior",
warriorShort: "A durable melee fighter that can be built in multiple ways: a safe bruiser, an aggressive damage dealer, or a steady survivor.",
warriorRole: "Versatile frontline",
warriorStrength: "Flexible build options, stable presence, and strong adaptability in different situations.",
warriorWeakness: "Bad decisions can quickly put it under pressure.",

mageName: "Mage",
mageShort: "A devastating spellcaster with high damage output, but one that can afford very few mistakes.",
mageRole: "Burst / control mage",
mageStrength: "High damage, powerful spell effects, and dangerous combos that can quickly decide a fight.",
mageWeakness: "More fragile.",

archerName: "Archer",
archerShort: "A steady ranged damage dealer that keeps constant pressure on the enemy while its pet absorbs much of the incoming damage.",
archerRole: "Stable ranged DPS",
archerStrength: "Reliable sustained damage and greater safety thanks to pet support.",
archerWeakness: "If the pet falls or cannot maintain pressure, it becomes much more vulnerable.",
menu: "Menu",
settings: "Settings",
logout: "Log out",
logoutPlaceholder: "Log out (placeholder)",
hubImageAlt: "hub",
player: "player",
welcome: "Welcome!",
hubIntroLine1:
  "This is the place where you can prepare for your next journey. Here you can upgrade, shop, take quests, and organize what you have.",
hubIntroLine2: "When you're ready, you can move on to travel.",
continue: "Continue",
travel: "Travel",
blacksmith: "Blacksmith",
quests: "Quests",
shop: "Shop",
home: "Home",
hubTutHome: "Click HOME (Inventory / Deck / Stats).",
hubTutBlacksmith: "Click BLACKSMITH (upgrades).",
hubTutShop: "Click SHOP (buying).",
hubTutQuests: "Click QUESTS.",
hubTutTravel: "Click TRAVEL (start adventure).",
loading: "Loading...",
upgradeGoldInfo: "Gold available for upgrades:",
noUpgradeableItems: "You have no more upgradeable items.",
currentItem: "Current item",
upgradedItem: "Upgraded item",
upgradeCost: "Upgrade cost",
notEnoughGoldForUpgrade: "You do not have enough gold for the upgrade.",
processing: "Processing...",
upgrade: "Upgrade",
blacksmithUpgradeFailed: "The upgrade failed.",
blacksmithServerError: "Error while connecting to the server.",
networkError: "Network error.",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_LS_KEY);
      return saved === "en" ? "en" : "hu";
    } catch {
      return "hu";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_LS_KEY, language);
    } catch {}

    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next) => {
    setLanguageState(next === "en" ? "en" : "hu");
  };

  const t = (key) => {
    return translations[language]?.[key] ?? translations.hu?.[key] ?? key;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}