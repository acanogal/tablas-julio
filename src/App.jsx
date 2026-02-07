import { useState } from "react";
import TablasList from "./components/TablasList";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  const [view, setView] = useState("tablas"); // tablas | quiz

  return (
    <div className="app">
      <header className="app-header">
        <h1>Las Tablas de Julio</h1>
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
        </nav>
      </header>

      <main className="app-main">
        {view === "tablas" && <TablasList />}
        {view === "quiz" && <Quiz />}
      </main>
    </div>
  );
}

export default App;
