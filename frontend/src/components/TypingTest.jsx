import { useState, useEffect, useRef, useCallback } from "react";
import API from "../../services/api";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog near the riverbank while the sun sets behind the mountains casting long shadows across the valley below. Technology has transformed the way we communicate and share ideas across borders making it easier than ever to connect with people from different cultures and backgrounds around the globe.",
  "Programming is the art of telling a computer what to do through carefully written instructions that must be precise and logical in every detail. Learning to code opens doors to endless possibilities and helps develop problem solving skills that are valuable in many areas of life beyond software development.",
  "In a world full of technology we often forget the simple joy of sitting quietly and reading a good book on a rainy afternoon with a warm cup of tea. The pages turn slowly as the story unfolds revealing characters and places that exist only in the imagination of the reader and the writer who created them.",
  "Every great developer was once a beginner who refused to give up and kept learning new things each day pushing through challenges with determination. The path to mastery is not a straight line but a winding road filled with obstacles that teach us more than any textbook or tutorial ever could.",
  "The ocean waves crashed against the rocky shore sending sprays of salty water into the cool morning air as seagulls circled overhead calling to each other. The lighthouse stood tall on the cliff guiding ships safely through the fog that rolled in from the open sea blanketing everything in a soft white mist.",
  "Success is not final and failure is not fatal it is the courage to continue that truly counts in the long journey of life and personal growth. We must embrace each challenge as an opportunity to learn and grow becoming stronger and more resilient with every step we take along the way forward.",
];

export default function TypingTest({ user }) {
  const [duration, setDuration] = useState(null); // null = not chosen yet
  const [sampleText, setSampleText] = useState("");
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const typedRef = useRef("");

  const pickNewText = useCallback(() => {
    const idx = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setSampleText(SAMPLE_TEXTS[idx]);
  }, []);

  useEffect(() => {
    pickNewText();
  }, [pickNewText]);

  // Countdown timer
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = duration - elapsed;
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current);
          endTest();
        }
      }, 200);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished, startTime, duration]);

  const endTest = () => {
    clearInterval(timerRef.current);
    setFinished(true);
    setTimeLeft(0);

    const currentTyped = typedRef.current;
    const timeMin = (Date.now() - startTime) / 1000 / 60;
    const words = currentTyped.trim().split(/\s+/).filter(Boolean).length;
    const calculatedWpm = timeMin > 0 ? Math.round(words / timeMin) : 0;
    setWpm(calculatedWpm);

    // Calculate final accuracy
    let correct = 0;
    for (let i = 0; i < currentTyped.length; i++) {
      if (currentTyped[i] === sampleText[i]) correct++;
    }
    setAccuracy(currentTyped.length > 0 ? Math.round((correct / currentTyped.length) * 100) : 100);

    // Save score
    const token = localStorage.getItem("token");
    API.post(
      "/score",
      { wpm: calculatedWpm },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((err) => console.error("Failed to save score", err));
  };

  const handleChange = (e) => {
    if (finished) return;
    const value = e.target.value;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
      setTimeLeft(duration);
    }

    setTyped(value);
    typedRef.current = value;

    // Live accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === sampleText[i]) correct++;
    }
    setAccuracy(value.length > 0 ? Math.round((correct / value.length) * 100) : 100);
  };

  const selectDuration = (secs) => {
    setDuration(secs);
    setTimeLeft(secs);
    pickNewText();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const reset = () => {
    setTyped("");
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setDuration(null);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(0);
    pickNewText();
  };

  const renderText = () => {
    return sampleText.split("").map((char, i) => {
      let className = "char";
      if (i < typed.length) {
        className += typed[i] === char ? " correct" : " incorrect";
      } else if (i === typed.length) {
        className += " cursor";
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Duration selection screen
  if (duration === null) {
    return (
      <div className="test-container">
        <div className="test-header">
          <h2>Typing Test</h2>
          <p className="test-greeting">Hello, {user} 👋</p>
        </div>
        <p className="duration-prompt">Choose your test duration</p>
        <div className="duration-picker">
          <button className="duration-btn" onClick={() => selectDuration(30)}>
            <span className="duration-time">30</span>
            <span className="duration-unit">seconds</span>
          </button>
          <button className="duration-btn" onClick={() => selectDuration(60)}>
            <span className="duration-time">60</span>
            <span className="duration-unit">seconds</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>Typing Test</h2>
        <p className="test-greeting">Hello, {user} 👋</p>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className={`stat-value ${timeLeft <= 5 && started ? "stat-danger" : ""}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="stat-label">Time Left</span>
        </div>
        <div className="stat">
          <span className="stat-value">{finished ? wpm : "—"}</span>
          <span className="stat-label">WPM</span>
        </div>
        <div className="stat">
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
      </div>

      {/* Text display */}
      <div className="text-display" onClick={() => inputRef.current?.focus()}>
        {renderText()}
      </div>

      {/* Hidden input for typing */}
      <textarea
        ref={inputRef}
        className="typing-input"
        value={typed}
        onChange={handleChange}
        disabled={finished}
        autoFocus
        spellCheck={false}
        placeholder="Click on the text above and start typing..."
      />

      {finished && (
        <div className="results-card">
          <h3>🎉 Time's Up!</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-number">{wpm}</span>
              <span className="result-label">WPM</span>
            </div>
            <div className="result-item">
              <span className="result-number">{accuracy}%</span>
              <span className="result-label">Accuracy</span>
            </div>
            <div className="result-item">
              <span className="result-number">{duration}s</span>
              <span className="result-label">Duration</span>
            </div>
          </div>
          <button className="btn-primary" onClick={reset}>
            Try Again
          </button>
        </div>
      )}

      {!finished && (
        <div className="test-actions">
          <button className="btn-secondary" onClick={reset}>
            ← Change Duration
          </button>
          {!started && <p className="start-hint">Start typing to begin the countdown...</p>}
        </div>
      )}
    </div>
  );
}
