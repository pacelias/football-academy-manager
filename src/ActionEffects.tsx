import { useEffect, useState } from 'react';
import './action-effects.css';

type Effect = 'training' | 'match' | 'day' | null;

export default function ActionEffects() {
  const [effect, setEffect] = useState<Effect>(null);

  useEffect(() => {
    let timeout: number | undefined;
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || button.disabled) return;
      const text = `${button.innerText || ''} ${button.getAttribute('aria-label') || ''}`.toLocaleLowerCase('es');
      let next: Effect = null;
      if (text.includes('entrenamiento') || text.includes('entrenar')) next = 'training';
      else if (text.includes('jugar')) next = 'match';
      else if (text.includes('avanzar')) next = 'day';
      if (!next) return;
      setEffect(next);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setEffect(null), next === 'match' ? 1900 : 1400);
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!effect) return null;
  const title = effect === 'training' ? '¡A entrenar!' : effect === 'match' ? '¡Comienza el partido!' : 'Nueva jornada';
  return <div className={`action-fx action-fx-${effect}`} role="status" aria-live="polite">
    <div className="action-fx-card">
      <div className="action-fx-scene">
        {effect === 'training' && <><span className="fx-cone fx-cone-left">🔶</span><span className="fx-ball">⚽</span><span className="fx-cone fx-cone-right">🔶</span></>}
        {effect === 'match' && <><span className="fx-goal">🥅</span><span className="fx-ball">⚽</span><span className="fx-lights">✦　✦　✦</span></>}
        {effect === 'day' && <><span className="fx-sun">🌤️</span><span className="fx-lights">✦　✦　✦</span></>}
      </div>
      <strong>{title}</strong>
      <div className="action-fx-progress"><i /></div>
    </div>
  </div>;
}
