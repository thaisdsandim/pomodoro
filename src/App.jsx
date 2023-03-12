import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import soundUrl from "./assets/sound/alarm.mp3";
import "./assets/style/app.css"

function App() {
  const [timer, setTimer] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isInterval, setIsInterval] = useState(false);
  const [play] = useSound(soundUrl);
  const [pomodoroCount, setPomodoroCount] = useState(
    localStorage.getItem("pomodoroCount") || 0
  );
  const [showPopup, setShowPopup] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      play();
      setPomodoroCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem("pomodoroCount", newCount);
        return newCount;
      });
      setShowPopup(true);
      setHasPlayed(true);
      setIsRunning(false);
      setTimer(isInterval ? 5 * 60 : 25 * 60);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timer, play, hasPlayed, isInterval]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const startInterval = () => {
    setIsInterval(true);
    setIsRunning(true);
    setTimer(5 * 60);
    setHasPlayed(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div class="space">
      <div id="timer">
        {Math.floor(timer / 60).toString().padStart(2, "0")}:
        {(timer % 60).toString().padStart(2, "0")}
      </div>
      <button onClick={startTimer} disabled={isRunning} id="start">
        Iniciar
      </button>
      <button onClick={stopTimer} disabled={!isRunning} id="stop">
        Parar
      </button>
      <br></br>
      <button onClick={startInterval} disabled={isInterval || isRunning} id="interval">
        Intervalo
      </button>
      {isInterval && <div>Modo Intervalo</div>}
      <div id="count">Contagem: {pomodoroCount}</div>
      <audio src={soundUrl} />
      {showPopup && (
        <div className="popup">
          <p>O tempo acabou!</p>
          <button onClick={closePopup}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default App;