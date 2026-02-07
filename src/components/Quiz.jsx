import { useState, useEffect, useRef, useCallback } from "react";
import Results from "./Results";
import { useI18n } from "../i18n.jsx";

const ALL_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function generateQuestions(tables, count) {
  const allQuestions = [];
  for (const a of tables) {
    for (let b = 1; b <= 12; b++) {
      allQuestions.push({ a, b, answer: a * b });
    }
  }
  // Shuffle
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }
  return count === "all" ? allQuestions : allQuestions.slice(0, count);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getHint(t, a, b) {
  const has = (n) => a === n || b === n;
  const otherOf = (n) => (a === n ? b : a);

  if (has(1)) return t.hint1;
  if (has(10)) return t.hint10(otherOf(10));
  if (has(2)) return t.hint2(otherOf(2));
  if (has(5)) return t.hint5(otherOf(5));
  if (has(9)) return t.hint9(otherOf(9));
  if (has(11)) return t.hint11(otherOf(11));
  if (has(4)) return t.hint4(otherOf(4));
  if (has(3)) return t.hint3(otherOf(3));
  if (has(8)) return t.hint8(otherOf(8));
  if (has(6)) return t.hint6(otherOf(6));
  if (has(12)) return t.hint12(otherOf(12));
  if (has(7)) return t.hint7(otherOf(7));
  return t.hintGeneric(a, b);
}

function Quiz({ name }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState("tables"); // tables | count | playing | results
  const [selectedTables, setSelectedTables] = useState([...ALL_TABLES]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (phase !== "playing" || !startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  useEffect(() => {
    if (phase === "playing" && inputRef.current && !feedback) {
      inputRef.current.focus();
    }
  }, [phase, currentIndex, feedback]);

  const toggleTable = (n) => {
    setSelectedTables((prev) =>
      prev.includes(n) ? prev.filter((t) => t !== n) : [...prev, n].sort((a, b) => a - b)
    );
  };

  const toggleAll = () => {
    setSelectedTables((prev) =>
      prev.length === ALL_TABLES.length ? [] : [...ALL_TABLES]
    );
  };

  const totalQuestions = selectedTables.length * 12;

  const startQuiz = (count) => {
    const q = generateQuestions(selectedTables, count);
    setQuestions(q);
    setCurrentIndex(0);
    setCorrectCount(0);
    setUserAnswer("");
    setFeedback(null);
    setWrongAnswer(null);
    setElapsed(0);
    setStartTime(Date.now());
    setShowHint(false);
    setHintsUsed(0);
    setPhase("playing");
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (feedback) return;

      const current = questions[currentIndex];
      const parsed = parseInt(userAnswer, 10);
      const isCorrect = parsed === current.answer;

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
        setWrongAnswer(current.answer);
      }

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          setElapsed(Math.floor((Date.now() - startTime) / 1000));
          setPhase("results");
        } else {
          setCurrentIndex((i) => i + 1);
          setUserAnswer("");
          setFeedback(null);
          setWrongAnswer(null);
          setShowHint(false);
        }
      }, 1500);
    },
    [feedback, userAnswer, questions, currentIndex, startTime]
  );

  const handlePlayAgain = () => {
    setPhase("tables");
    setSelectedTables([...ALL_TABLES]);
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setFeedback(null);
    setWrongAnswer(null);
    setElapsed(0);
    setStartTime(null);
    setShowHint(false);
    setHintsUsed(0);
  };

  const handleHint = () => {
    if (!showHint) {
      setHintsUsed((h) => h + 1);
    }
    setShowHint(true);
  };

  if (phase === "results") {
    return (
      <Results
        correct={correctCount}
        total={questions.length}
        time={elapsed}
        name={name}
        hintsUsed={hintsUsed}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (phase === "tables") {
    const allSelected = selectedTables.length === ALL_TABLES.length;
    return (
      <div className="quiz-setup">
        <h2>{t.practiceTitle}</h2>
        <p className="quiz-intro">
          {t.chooseTablesIntro(name)}
        </p>
        <div className="table-selector">
          <button
            className={`btn-table-select ${allSelected ? "selected" : ""}`}
            onClick={toggleAll}
          >
            {t.all}
          </button>
          {ALL_TABLES.map((n) => (
            <button
              key={n}
              className={`btn-table-select ${selectedTables.includes(n) ? "selected" : ""}`}
              onClick={() => toggleTable(n)}
            >
              x{n}
            </button>
          ))}
        </div>
        <button
          className="btn-option btn-continue"
          disabled={selectedTables.length === 0}
          onClick={() => setPhase("count")}
        >
          {t.continue}
        </button>
      </div>
    );
  }

  if (phase === "count") {
    return (
      <div className="quiz-setup">
        <h2>{t.practiceTitle}</h2>
        <p className="quiz-intro">
          {t.chooseCountIntro(name)}
        </p>
        <div className="quiz-options">
          {[10, 20, 30].map((n) =>
            n <= totalQuestions ? (
              <button key={n} className="btn-option" onClick={() => startQuiz(n)}>
                {t.nQuestions(n)}
              </button>
            ) : null
          )}
          <button className="btn-option btn-all" onClick={() => startQuiz("all")}>
            {t.allQuestions(totalQuestions)}
          </button>
        </div>
        <button className="btn-back" onClick={() => setPhase("tables")}>
          {t.back}
        </button>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="quiz-playing">
      <div className="quiz-header">
        <span className="quiz-progress">
          {t.questionProgress(currentIndex + 1, questions.length)}
        </span>
        <span className="quiz-timer">{formatTime(elapsed)}</span>
      </div>

      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{
            width: `${((currentIndex + (feedback ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className={`quiz-question ${feedback || ""}`}>
        <p className="question-label">{t.howMuchIs(name)}</p>
        <p className="question-text">
          {current.a} x {current.b} = ?
        </p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            className="quiz-input"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!feedback}
            placeholder={t.yourAnswer}
            autoComplete="off"
          />
          {!feedback && (
            <div className="quiz-buttons">
              <button type="submit" className="btn-submit" disabled={!userAnswer}>
                {t.answer}
              </button>
              <button type="button" className="btn-hint" onClick={handleHint} disabled={showHint}>
                {showHint ? t.hintVisible : t.hint}
              </button>
            </div>
          )}
        </form>

        {showHint && !feedback && (
          <div className="hint-box">
            <p className="hint-text">{getHint(t, current.a, current.b)}</p>
          </div>
        )}

        {feedback === "correct" && (
          <p className="feedback feedback-correct">{t.correctFeedback(name)}</p>
        )}
        {feedback === "wrong" && (
          <p className="feedback feedback-wrong">
            {t.wrongFeedback} <strong>{wrongAnswer}</strong>
          </p>
        )}
      </div>

      <div className="quiz-score">
        {t.score}: {correctCount} / {currentIndex + (feedback ? 1 : 0)}
      </div>
    </div>
  );
}

export default Quiz;
