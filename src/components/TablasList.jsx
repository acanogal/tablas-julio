function TablasList() {
  const tablas = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="tablas-container">
      <h2>Tablas de Multiplicar</h2>
      <div className="tablas-grid">
        {tablas.map((num) => (
          <div key={num} className="tabla-card">
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
    </div>
  );
}

export default TablasList;
