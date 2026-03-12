// frontend/src/components/LoginScreen.jsx
import React, { useState, useEffect } from "react";
import "./LoginScreen.css";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";

export default function LoginScreen({ onLogin }) {
  const { setPlayer } = usePlayer();
  const { t, language, setLanguage } = useLanguage();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    return () => (document.body.style.margin = "0");
  }, []);

  function showTempAlert(message) {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setHiding(true);
      setTimeout(() => {
        setShowAlert(false);
        setHiding(false);
      }, 400);
    }, 2500);
  }

  async function handle() {
    if (!username.trim() && !email.trim()) {
      showTempAlert(t("loginNeedIdentifier"));
      return;
    }

    if (!password.trim()) {
      showTempAlert(t("loginNeedPassword"));
      return;
    }

    try {
      if (isRegistering) {
        if (!email.trim()) {
          showTempAlert(t("loginNeedEmail"));
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showTempAlert(t("loginInvalidEmail"));
          return;
        }

        if (password !== confirmPassword) {
          showTempAlert(t("loginPasswordsDontMatch"));
          return;
        }

        const regRes = await fetch(`https://nodejs202.dszcbaross.edu.hu/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
          showTempAlert(regData.error || t("registerFailed"));
          return;
        }

        const loginRes = await fetch(`https://nodejs202.dszcbaross.edu.hu/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: username, password }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          showTempAlert(loginData.error || t("registerLoginFailed"));
          return;
        }

        setPlayer(loginData.user);
        localStorage.setItem("sk_current_user", loginData.user.username);
        localStorage.setItem("sk_current_user_id", loginData.user.id);
        onLogin(loginData.user.username);
        return;
      } else {
        const loginRes = await fetch(`https://nodejs202.dszcbaross.edu.hu/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: username || email, password }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          showTempAlert(loginData.error || t("loginFailed"));
          return;
        }

        setPlayer(loginData.user);
        localStorage.setItem("sk_current_user", loginData.user.username);
        localStorage.setItem("sk_current_user_id", loginData.user.id);
        onLogin(loginData.user.username);
      }
    } catch (e) {
      console.error("Login error:", e);
      showTempAlert(t("serverError"));
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter" && document.activeElement.tagName === "INPUT") {
        handle();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [username, email, password, confirmPassword, isRegistering, language]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden font-poppins">
      <div
        className={`alertBanner ${
          showAlert ? (hiding ? "slideUp" : "slideDown") : "hidden"
        }`}
      >
        {alertMessage}
      </div>

      {/* NYELVVÁLTÓ */}
      <div className="loginLangSwitcher">
        <button
          type="button"
          className={`loginLangBtn ${language === "hu" ? "active" : ""}`}
          onClick={() => setLanguage("hu")}
        >
          HU
        </button>
        <button
          type="button"
          className={`loginLangBtn ${language === "en" ? "active" : ""}`}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
      </div>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="-z-10 absolute top-0 left-0 w-full h-full object-cover object-center"
      >
        <source src="/video/1.webm" type="video/webm" />
      </video>

      <div className="loginBox relative z-10 w-11/12 sm:w-2/3 md:w-1/3 p-8 text-white shadow-2xl backdrop-blur-sm text-center">
        <h2 className="bejelentkezes">
          {isRegistering ? t("registerTitle") : t("loginTitle")}
        </h2>

        <p className="parancs">
          {isRegistering ? t("registerSubtitle") : t("loginSubtitle")}
        </p>

        <input
          type="text"
          placeholder={isRegistering ? t("usernamePlaceholder") : t("identifierPlaceholder")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="felhasznalonev bg-red-950 w-full p-3 mb-5 text-yellow-100 text-center placeholder-yellow-100 focus:outline-none focus:ring-2 focus:ring-red-700"
        />

        {isRegistering && (
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email bg-red-950 w-full p-3 mb-5 text-yellow-100 text-center placeholder-yellow-100 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        )}

        <input
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="jelszo bg-red-950 w-full p-3 mb-5 text-yellow-100 text-center placeholder-yellow-100 focus:outline-none focus:ring-2 focus:ring-red-700"
        />

        {isRegistering && (
          <input
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="jelszo bg-red-950 w-full p-3 mb-5 text-yellow-100 text-center placeholder-yellow-100 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        )}

        <button onClick={handle} className="button">
          {isRegistering ? t("registerButton") : t("continueUpper")}
        </button>

        <p className="regisztracioText">
          {isRegistering ? (
            <>
              <span className="regText">{t("alreadyHaveAccount")}</span>{" "}
              <span
                className="regisztracioLink"
                onClick={() => setIsRegistering(false)}
              >
                {t("switchToLogin")}
              </span>
            </>
          ) : (
            <>
              <span className="regText">{t("noAccountYet")}</span>{" "}
              <span
                className="regisztracioLink"
                onClick={() => setIsRegistering(true)}
              >
                {t("switchToRegister")}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="logoDiv">
        <div className="logoContainer">
          <div>
            <a
              className="logoItem"
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              <img className="logo" src="/images/YT.png" alt="youtube" />
              <p className="socialMediaNames">YouTube</p>
            </a>
          </div>

          <div>
            <a
              className="logoItem"
              href="https://www.x.com"
              target="_blank"
              rel="noreferrer"
            >
              <img className="logo" src="/images/X.png" alt="x" />
              <p className="socialMediaNames">X</p>
            </a>
          </div>

          <div>
            <a
              className="logoItem"
              href="https://www.discord.com"
              target="_blank"
              rel="noreferrer"
            >
              <img className="logo" src="/images/DC.png" alt="discord" />
              <p className="socialMediaNames">Discord</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}