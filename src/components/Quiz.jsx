import { useState, useEffect, useRef, useCallback } from "react";
import Results from "./Results";

function generateQuestions(count) {
  const allQuestions = [];
  for (let a = 1; a <= 12; a++) {
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

function Quiz() {
  const [phase, setPhase] = useState("setup"); // setup | playing | results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
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

  const startQuiz = (count) => {
    const q = generateQuestions(count);
    setQuestions(q);
    setCurrentIndex(0);
    setCorrectCount(0);
    setUserAnswer("");
    setFeedback(null);
    setWrongAnswer(null);
    setElapsed(0);
    setStartTime(Date.now());
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
        }
      }, 1500);
    },
    [feedback, userAnswer, questions, currentIndex, startTime]
  );

  const handlePlayAgain = () => {
    setPhase("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setFeedback(null);
    setWrongAnswer(null);
    setElapsed(0);
    setStartTime(null);
  };

  if (phase === "results") {
    return (
      <Results
        correct={correctCount}
        total={questions.length}
        time={elapsed}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (phase === "setup") {
    return (
      <div className="quiz-setup">
        <h2>Practicar las Tablas</h2>
        <p className="quiz-intro">
          Julio, elige cuantas preguntas quieres responder:
        </p>
        <div className="quiz-options">
          {[10, 20, 30].map((n) => (
            <button key={n} className="btn-option" onClick={() => startQuiz(n)}>
              {n} preguntas
            </button>
          ))}
          <button className="btn-option btn-all" onClick={() => startQuiz("all")}>
            Todas (144)
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="quiz-playing">
      <div className="quiz-header">
        <span className="quiz-progress">
          Pregunta {currentIndex + 1} de {questions.length}
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
        <p className="question-label">Julio, cuanto es...</p>
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
            placeholder="Tu respuesta"
            autoComplete="off"
          />
          {!feedback && (
            <button type="submit" className="btn-submit" disabled={!userAnswer}>
              Responder
            </button>
          )}
        </form>

        {feedback === "correct" && (
          <p className="feedback feedback-correct">Muy bien, Julio!</p>
        )}
        {feedback === "wrong" && (
          <p className="feedback feedback-wrong">
            La respuesta correcta era <strong>{wrongAnswer}</strong>
          </p>
        )}
      </div>

      <div className="quiz-score">
        Aciertos: {correctCount} / {currentIndex + (feedback ? 1 : 0)}
      </div>
    </div>
  );
}

export default Quiz;
