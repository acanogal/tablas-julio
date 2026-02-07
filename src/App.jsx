import { useState, useEffect, useRef } from "react";
import TablasList from "./components/TablasList";
import Quiz from "./components/Quiz";
import "./App.css";

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function App() {
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
      Instalar app
    </button>
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Las Tablas de {name}</h1>
        <nav className="app-nav">
          <button
            className={`nav-btn ${view === "tablas" ? "active" : ""}`}
            onClick={() => setView("tablas")}
          >
            Ver Tablas
          </button>
          <button
            className={`nav-btn ${view === "quiz" ? "active" : ""}`}
            onClick={() => setView("quiz")}
          >
            Practicar
          </button>
          <button className="nav-btn nav-btn-change" onClick={openChangeName}>
            Cambiar nombre
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
            <h3>Cambiar nombre</h3>
            <form onSubmit={saveName} className="name-form">
              <input
                type="text"
                className="name-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Escribe tu nombre"
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className="btn-name" disabled={!nameInput.trim()}>
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}

      {showIOSGuide && (
        <div className="ios-guide-overlay" onClick={() => setShowIOSGuide(false)}>
          <div className="ios-guide" onClick={(e) => e.stopPropagation()}>
            <h3>Instalar en tu dispositivo</h3>
            <ol>
              <li>Pulsa el boton <strong>Compartir</strong> en la barra del navegador</li>
              <li>Selecciona <strong>"Anadir a pantalla de inicio"</strong></li>
              <li>Pulsa <strong>"Anadir"</strong> para confirmar</li>
            </ol>
            <button className="btn-name" onClick={() => setShowIOSGuide(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
