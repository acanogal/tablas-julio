import { useState, useEffect } from "react";

function TablasList() {
  const tablas = Array.from({ length: 12 }, (_, i) => i + 1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (selected === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft" && selected > 1) setSelected(selected - 1);
      if (e.key === "ArrowRight" && selected < 12) setSelected(selected + 1);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selected]);

  return (
    <div className="tablas-container">
      <h2>Tablas de Multiplicar</h2>
      <div className="tablas-grid">
        {tablas.map((num) => (
          <div
            key={num}
            className="tabla-card tabla-card-clickable"
            onClick={() => setSelected(num)}
          >
            <h3>Tabla del {num}</h3>
            <ul>
              {tablas.map((mult) => (
                <li key={mult}>
                  {num} x {mult} = <strong>{num * mult}</strong>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div className="tabla-modal-overlay" onClick={() => setSelected(null)}>
          <div className="tabla-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="tabla-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Cerrar"
            >
              &times;
            </button>

            <button
              className="tabla-modal-nav tabla-modal-prev"
              onClick={() => setSelected(selected - 1)}
              disabled={selected <= 1}
              aria-label="Tabla anterior"
            >
              &#8249;
            </button>

            <div className="tabla-modal-content">
              <h3>Tabla del {selected}</h3>
              <ul>
                {tablas.map((mult) => (
                  <li key={mult}>
                    {selected} x {mult} = <strong>{selected * mult}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="tabla-modal-nav tabla-modal-next"
              onClick={() => setSelected(selected + 1)}
              disabled={selected >= 12}
              aria-label="Tabla siguiente"
            >
              &#8250;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablasList;
