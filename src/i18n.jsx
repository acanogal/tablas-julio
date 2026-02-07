import { createContext, useContext, useState } from "react";

const translations = {
  es: {
    // Header
    title: (name) => `Las Tablas de ${name}`,
    viewTables: "Ver Tablas",
    practice: "Practicar",
    changeName: "Cambiar nombre",
    installApp: "Instalar app",

    // Change name modal
    enterYourName: "Escribe tu nombre",
    save: "Guardar",

    // iOS install guide
    installOnDevice: "Instalar en tu dispositivo",
    iosStep1: "Pulsa el boton <strong>Compartir</strong> en la barra del navegador",
    iosStep2: 'Selecciona <strong>"Anadir a pantalla de inicio"</strong>',
    iosStep3: 'Pulsa <strong>"Anadir"</strong> para confirmar',
    understood: "Entendido",

    // TablasList
    multiplicationTables: "Tablas de Multiplicar",
    tableOf: (n) => `Tabla del ${n}`,
    close: "Cerrar",
    previousTable: "Tabla anterior",
    nextTable: "Tabla siguiente",

    // Quiz - setup
    practiceTitle: "Practicar las Tablas",
    chooseTablesIntro: (name) => `${name}, elige que tablas quieres practicar:`,
    all: "Todas",
    continue: "Continuar",
    chooseCountIntro: (name) => `${name}, elige cuantas preguntas quieres responder:`,
    nQuestions: (n) => `${n} preguntas`,
    allQuestions: (n) => `Todas (${n})`,
    back: "Volver",

    // Quiz - playing
    questionProgress: (current, total) => `Pregunta ${current} de ${total}`,
    howMuchIs: (name) => `${name}, cuanto es...`,
    yourAnswer: "?",
    answer: "Responder",
    hintVisible: "Pista visible",
    hint: "Pista",
    correctFeedback: (name) => `Muy bien, ${name}!`,
    wrongFeedback: "La respuesta correcta era",
    score: "Aciertos",

    // Quiz - hints
    hint1: "Todo numero multiplicado por 1 es el mismo.",
    hint10: (other) => `Para multiplicar por 10, solo anade un 0 al final de ${other}.`,
    hint2: (other) => `Multiplicar por 2 es sumar el numero consigo mismo: ${other} + ${other}.`,
    hint5: (other) => `Truco del 5: cuenta de 5 en 5 tantas veces como diga el ${other}: 5, 10, 15, 20, 25...`,
    hint9: (other) => `Truco del 9: calcula ${other} x 10 y restale ${other}.`,
    hint11: (other) => `Para multiplicar por 11, calcula ${other} x 10 y sumale ${other}.`,
    hint4: (other) => `Multiplicar por 4 es doblar dos veces: primero ${other} x 2, y luego dobla el resultado.`,
    hint3: (other) => `Para multiplicar por 3, dobla ${other} y luego sumale ${other}.`,
    hint8: (other) => `Multiplicar por 8 es doblar tres veces: ${other} x 2, luego x 2, y otra vez x 2.`,
    hint6: (other) => `Para multiplicar por 6, calcula ${other} x 5 y luego sumale ${other}.`,
    hint12: (other) => `Para multiplicar por 12, calcula ${other} x 10 y luego sumale ${other} + ${other}.`,
    hint7: (other) => `Para multiplicar por 7, calcula ${other} x 5 y luego sumale ${other} + ${other}.`,
    hintGeneric: (a, b) => `Descompon: piensa en ${a} x ${Math.floor(b / 2)} y luego suma lo que falta.`,

    // Results
    results: "Resultados",
    correct: "Aciertos",
    wrong: "Fallos",
    accuracy: "Acierto",
    time: "Tiempo",
    totalQuestions: "Total de preguntas",
    timePerQuestion: "Tiempo por pregunta",
    seconds: "segundos",
    hintsUsed: "Pistas usadas",
    playAgain: "Volver a jugar",
    msgPerfect: (name) => `PERFECTO, ${name}! Eres un crack de las mates!`,
    msg80: (name) => `Genial, ${name}! Lo has hecho muy bien!`,
    msg60: (name) => `Bien hecho, ${name}! Sigue practicando!`,
    msg40: (name) => `No esta mal, ${name}! A seguir mejorando!`,
    msgLow: (name) => `Animo, ${name}! La practica hace al maestro!`,

    // Language
    language: "Idioma",
  },
  en: {
    // Header
    title: (name) => `${name}'s Times Tables`,
    viewTables: "View Tables",
    practice: "Practice",
    changeName: "Change name",
    installApp: "Install app",

    // Change name modal
    enterYourName: "Enter your name",
    save: "Save",

    // iOS install guide
    installOnDevice: "Install on your device",
    iosStep1: "Tap the <strong>Share</strong> button in the browser bar",
    iosStep2: 'Select <strong>"Add to Home Screen"</strong>',
    iosStep3: 'Tap <strong>"Add"</strong> to confirm',
    understood: "Got it",

    // TablasList
    multiplicationTables: "Multiplication Tables",
    tableOf: (n) => `${n} Times Table`,
    close: "Close",
    previousTable: "Previous table",
    nextTable: "Next table",

    // Quiz - setup
    practiceTitle: "Practice Times Tables",
    chooseTablesIntro: (name) => `${name}, choose which tables to practice:`,
    all: "All",
    continue: "Continue",
    chooseCountIntro: (name) => `${name}, choose how many questions:`,
    nQuestions: (n) => `${n} questions`,
    allQuestions: (n) => `All (${n})`,
    back: "Back",

    // Quiz - playing
    questionProgress: (current, total) => `Question ${current} of ${total}`,
    howMuchIs: (name) => `${name}, what is...`,
    yourAnswer: "?",
    answer: "Answer",
    hintVisible: "Hint shown",
    hint: "Hint",
    correctFeedback: (name) => `Great job, ${name}!`,
    wrongFeedback: "The correct answer was",
    score: "Correct",

    // Quiz - hints
    hint1: "Any number multiplied by 1 is itself.",
    hint10: (other) => `To multiply by 10, just add a 0 at the end of ${other}.`,
    hint2: (other) => `Multiplying by 2 is the same as adding the number to itself: ${other} + ${other}.`,
    hint5: (other) => `Trick for 5: count by 5s as many times as ${other}: 5, 10, 15, 20, 25...`,
    hint9: (other) => `Trick for 9: calculate ${other} x 10 and subtract ${other}.`,
    hint11: (other) => `To multiply by 11, calculate ${other} x 10 and add ${other}.`,
    hint4: (other) => `Multiplying by 4 is doubling twice: first ${other} x 2, then double the result.`,
    hint3: (other) => `To multiply by 3, double ${other} and then add ${other}.`,
    hint8: (other) => `Multiplying by 8 is doubling three times: ${other} x 2, then x 2, then x 2 again.`,
    hint6: (other) => `To multiply by 6, calculate ${other} x 5 and then add ${other}.`,
    hint12: (other) => `To multiply by 12, calculate ${other} x 10 and then add ${other} + ${other}.`,
    hint7: (other) => `To multiply by 7, calculate ${other} x 5 and then add ${other} + ${other}.`,
    hintGeneric: (a, b) => `Break it down: think of ${a} x ${Math.floor(b / 2)} and add what's left.`,

    // Results
    results: "Results",
    correct: "Correct",
    wrong: "Wrong",
    accuracy: "Accuracy",
    time: "Time",
    totalQuestions: "Total questions",
    timePerQuestion: "Time per question",
    seconds: "seconds",
    hintsUsed: "Hints used",
    playAgain: "Play again",
    msgPerfect: (name) => `PERFECT, ${name}! You're a math champion!`,
    msg80: (name) => `Great job, ${name}! You did really well!`,
    msg60: (name) => `Well done, ${name}! Keep practicing!`,
    msg40: (name) => `Not bad, ${name}! Keep improving!`,
    msgLow: (name) => `Keep going, ${name}! Practice makes perfect!`,

    // Language
    language: "Language",
  },
};

function detectLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved && translations[saved]) return saved;
  const browserLang = navigator.language.slice(0, 2);
  return translations[browserLang] ? browserLang : "es";
}

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage);

  const changeLang = (newLang) => {
    localStorage.setItem("lang", newLang);
    setLang(newLang);
  };

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ t, lang, changeLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
