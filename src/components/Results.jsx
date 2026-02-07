import { useI18n } from "../i18n.jsx";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getMessage(t, percentage, name) {
  if (percentage === 100) return t.msgPerfect(name);
  if (percentage >= 80) return t.msg80(name);
  if (percentage >= 60) return t.msg60(name);
  if (percentage >= 40) return t.msg40(name);
  return t.msgLow(name);
}

function getEmoji(percentage) {
  if (percentage === 100) return "\u{1F3C6}";
  if (percentage >= 80) return "\u2B50";
  if (percentage >= 60) return "\u{1F44F}";
  if (percentage >= 40) return "\u{1F4AA}";
  return "\u{1F4DA}";
}

function Results({ correct, total, time, name, hintsUsed, onPlayAgain }) {
  const { t } = useI18n();
  const wrong = total - correct;
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="results">
      <h2>{t.results}</h2>

      <div className="results-emoji">{getEmoji(percentage)}</div>

      <p className="results-message">{getMessage(t, percentage, name)}</p>

      <div className="results-stats">
        <div className="stat stat-correct">
          <span className="stat-number">{correct}</span>
          <span className="stat-label">{t.correct}</span>
        </div>
        <div className="stat stat-wrong">
          <span className="stat-number">{wrong}</span>
          <span className="stat-label">{t.wrong}</span>
        </div>
        <div className="stat stat-percent">
          <span className="stat-number">{percentage}%</span>
          <span className="stat-label">{t.accuracy}</span>
        </div>
        <div className="stat stat-time">
          <span className="stat-number">{formatTime(time)}</span>
          <span className="stat-label">{t.time}</span>
        </div>
      </div>

      <div className="results-detail">
        <p>
          {t.totalQuestions}: <strong>{total}</strong>
        </p>
        <p>
          {t.timePerQuestion}:{" "}
          <strong>{(time / total).toFixed(1)} {t.seconds}</strong>
        </p>
        {hintsUsed > 0 && (
          <p>
            {t.hintsUsed}: <strong>{hintsUsed}</strong>
          </p>
        )}
      </div>

      <button className="btn-play-again" onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

export default Results;
