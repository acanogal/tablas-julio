import { useState, useEffect, useRef } from "react";
import TablasList from "./components/TablasList";
import Quiz from "./components/Quiz";
import { useI18n } from "./i18n.jsx";
import "./App.css";

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function App() {
  const { t, lang, changeLang } = useI18n();
  const [view, setView] = useState("tablas"); // tablas | quiz
  const [name, setName] = useState(() => localStorage.getItem("studentName") || "Julio");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      deferredPrompt.current = null;
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      if (outcome === "accepted") return;
    } else {
      setShowIOSGuide(true);
    }
  };

  const openChangeName = () => {
    setNameInput(name);
    setEditingName(true);
  };

  const saveName = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    localStorage.setItem("studentName", trimmed);
    setName(trimmed);
    setEditingName(false);
  };

  const installNavButton = !isStandalone && (
    <button className="nav-btn nav-btn-install" onClick={handleInstall}>
      {t.installApp}
    </button>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t.title(name)}</h1>
        <nav className="app-nav">
          <button
            className={`nav-btn ${view === "tablas" ? "active" : ""}`}
            onClick={() => setView("tablas")}
          >
            {t.viewTables}
          </button>
          <button
            className={`nav-btn ${view === "quiz" ? "active" : ""}`}
            onClick={() => setView("quiz")}
          >
            {t.practice}
          </button>
          <button className="nav-btn nav-btn-change" onClick={openChangeName}>
            {t.changeName}
          </button>
          {installNavButton}
        </nav>
      </header>

      <main className="app-main">
        {view === "tablas" && <TablasList />}
        {view === "quiz" && <Quiz name={name} />}
      </main>

      {editingName && (
        <div className="ios-guide-overlay" onClick={() => setEditingName(false)}>
          <div className="ios-guide" onClick={(e) => e.stopPropagation()}>
            <h3>{t.changeName}</h3>
            <form onSubmit={saveName} className="name-form">
              <input
                type="text"
                className="name-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={t.enterYourName}
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="btn-name" disabled={!nameInput.trim()}>
                {t.save}
              </button>
            </form>
          </div>
        </div>
      )}

      {showIOSGuide && (
        <div className="ios-guide-overlay" onClick={() => setShowIOSGuide(false)}>
          <div className="ios-guide" onClick={(e) => e.stopPropagation()}>
            <h3>{t.installOnDevice}</h3>
            <ol>
              <li dangerouslySetInnerHTML={{ __html: t.iosStep1 }} />
              <li dangerouslySetInnerHTML={{ __html: t.iosStep2 }} />
              <li dangerouslySetInnerHTML={{ __html: t.iosStep3 }} />
            </ol>
            <button className="btn-name" onClick={() => setShowIOSGuide(false)}>
              {t.understood}
            </button>
          </div>
        </div>
      )}
      <button
        className="lang-flag"
        onClick={() => changeLang(lang === "es" ? "en" : "es")}
        aria-label={t.language}
      >
        {lang === "es" ? "\u{1F1EC}\u{1F1E7}" : "\u{1F1EA}\u{1F1F8}"}
      </button>
    </div>
  );
}

export default App;
