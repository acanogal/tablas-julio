function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getMessage(percentage, name) {
  if (percentage === 100) return `PERFECTO, ${name}! Eres un crack de las mates!`;
  if (percentage >= 80) return `Genial, ${name}! Lo has hecho muy bien!`;
  if (percentage >= 60) return `Bien hecho, ${name}! Sigue practicando!`;
  if (percentage >= 40) return `No esta mal, ${name}! A seguir mejorando!`;
  return `Animo, ${name}! La practica hace al maestro!`;
}

function getEmoji(percentage) {
  if (percentage === 100) return "🏆";
  if (percentage >= 80) return "⭐";
  if (percentage >= 60) return "👏";
  if (percentage >= 40) return "💪";
  return "📚";
}

function Results({ correct, total, time, name, hintsUsed, onPlayAgain }) {
  const wrong = total - correct;
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="results">
      <h2>Resultados</h2>

      <div className="results-emoji">{getEmoji(percentage)}</div>

      <p className="results-message">{getMessage(percentage, name)}</p>

      <div className="results-stats">
        <div className="stat stat-correct">
          <span className="stat-number">{correct}</span>
          <span className="stat-label">Aciertos</span>
        </div>
        <div className="stat stat-wrong">
          <span className="stat-number">{wrong}</span>
          <span className="stat-label">Fallos</span>
        </div>
        <div className="stat stat-percent">
          <span className="stat-number">{percentage}%</span>
          <span className="stat-label">Acierto</span>
        </div>
        <div className="stat stat-time">
          <span className="stat-number">{formatTime(time)}</span>
          <span className="stat-label">Tiempo</span>
        </div>
      </div>

      <div className="results-detail">
        <p>
          Total de preguntas: <strong>{total}</strong>
        </p>
        <p>
          Tiempo por pregunta:{" "}
          <strong>{(time / total).toFixed(1)} segundos</strong>
        </p>
        {hintsUsed > 0 && (
          <p>
            Pistas usadas: <strong>{hintsUsed}</strong>
          </p>
        )}
      </div>

      <button className="btn-play-again" onClick={onPlayAgain}>
        Volver a jugar
      </button>
    </div>
  );
}

export default Results;
