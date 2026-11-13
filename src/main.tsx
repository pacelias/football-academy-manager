import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TrainingPicker from './TrainingPicker';
import './timer.css';

const TRAINING_TIMER = 'fam-training-ready-at';
const MATCHDAY_TIMER = 'fam-next-matchday-at';
const DAY_MS = 12 * 60 * 60 * 1000;
const TRAINING_MS = 2 * 60 * 60 * 1000;

function formatRemaining(deadline: number, now: number): string {
  const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function TimerDock() {
  const [now, setNow] = useState(Date.now());
  const [trainingReadyAt, setTrainingReadyAt] = useState(0);
  const [nextDayAt, setNextDayAt] = useState(0);

  useEffect(() => {
    const storedTraining = Number(localStorage.getItem(TRAINING_TIMER) || 0);
    let storedDay = Number(localStorage.getItem(MATCHDAY_TIMER) || 0);
    if (!localStorage.getItem(MATCHDAY_TIMER)) {
      storedDay = Date.now() + DAY_MS;
      localStorage.setItem(MATCHDAY_TIMER, String(storedDay));
    }
    setTrainingReadyAt(storedTraining);
    setNextDayAt(storedDay);

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || button.disabled) return;
      const label = (button.innerText || button.getAttribute('aria-label') || '').toLocaleLowerCase('es');
      const isTraining = label.includes('entrenar') || label.includes('entrenamiento individual') || label.includes('entrenamiento colectivo');
      const isDay = label.includes('avanzar') && label.includes('día') || label.includes('avanzar día');
      const timestamp = Date.now();
      if (isTraining) {
        const deadline = Number(localStorage.getItem(TRAINING_TIMER) || 0);
        if (deadline > timestamp) {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.alert(`El entrenamiento estará disponible en ${formatRemaining(deadline, timestamp)}.`);
          return;
        }
        const nextReady = timestamp + TRAINING_MS;
        localStorage.setItem(TRAINING_TIMER, String(nextReady));
        setTrainingReadyAt(nextReady);
      } else if (isDay) {
        const deadline = Number(localStorage.getItem(MATCHDAY_TIMER) || 0);
        if (deadline > timestamp) {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.alert(`La siguiente jornada estará disponible en ${formatRemaining(deadline, timestamp)}.`);
          return;
        }
        const nextReady = timestamp + DAY_MS;
        localStorage.setItem(MATCHDAY_TIMER, String(nextReady));
        setNextDayAt(nextReady);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('click', onClick, true);
    };
  }, []);

  const trainingLeft = Math.max(0, trainingReadyAt - now);
  const dayLeft = Math.max(0, nextDayAt - now);
  return <aside className="timer-dock" aria-live="polite" aria-label="Temporizadores de juego">
    <div className={`timer-chip ${trainingLeft === 0 ? 'ready' : ''}`}>
      <span className="timer-icon">⚽</span>
      <span><small>ENTRENAMIENTO</small><b>{trainingLeft ? formatRemaining(trainingReadyAt, now) : 'DISPONIBLE'}</b></span>
    </div>
    <div className={`timer-chip ${dayLeft === 0 ? 'ready' : ''}`}>
      <span className="timer-icon">🗓️</span>
      <span><small>PRÓXIMA JORNADA</small><b>{dayLeft ? formatRemaining(nextDayAt, now) : 'DISPONIBLE'}</b></span>
    </div>
  </aside>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><><App /><TrainingPicker /><TimerDock /></></React.StrictMode>
);
