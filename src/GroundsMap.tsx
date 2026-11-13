import { useState } from 'react';
import { BUILDINGS, getBuildingUpgradeCost, type BuildingKey } from './data';

const layout: Array<{ key: BuildingKey; x: number; y: number; icon: string }> = [
  { key: 'stadium', x: 52, y: 29, icon: '🏟️' },
  { key: 'trainingGround', x: 24, y: 48, icon: '⚽' },
  { key: 'youthAcademy', x: 72, y: 48, icon: '🌱' },
  { key: 'gym', x: 38, y: 68, icon: '🏋️' },
  { key: 'medical', x: 61, y: 68, icon: '🩺' },
  { key: 'shop', x: 82, y: 72, icon: '👕' }
];

interface Props {
  buildings: Record<string, number>;
  money: number;
  onUpgrade: (key: BuildingKey) => void;
}

export default function GroundsMap({ buildings, money, onUpgrade }: Props) {
  const [selected, setSelected] = useState<BuildingKey>('stadium');
  const info = BUILDINGS[selected];
  const level = buildings[selected] ?? 1;
  const cost = getBuildingUpgradeCost(selected, level);

  return <section className="grounds-section">
    <header className="grounds-heading"><div><div className="kicker">TU COMPLEJO DEPORTIVO</div><h2>Terrenos de la academia</h2><p>Toca un edificio del mapa para consultar su nivel y mejorarlo.</p></div><span className="grounds-wallet">💰 {Math.round(money).toLocaleString('es-ES')} €</span></header>
    <div className="island-wrap">
      <div className="island-shadow" />
      <div className="island">
        <div className="island-road road-one" /><div className="island-road road-two" />
        <span className="map-tree tree-a">🌳</span><span className="map-tree tree-b">🌲</span><span className="map-tree tree-c">🌴</span><span className="map-tree tree-d">🌳</span><span className="map-tree tree-e">🌲</span>
        <div className="pond">💧</div><div className="map-sign">ACADEMIA<br /><b>{'★'.repeat(Math.min(5, Math.max(1, Math.ceil(level / 2)))}</b></div>
        {layout.map((item) => {
          const building = BUILDINGS[item.key];
          const buildingLevel = buildings[item.key] ?? 1;
          return <button key={item.key} className={`map-building ${selected === item.key ? 'selected' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setSelected(item.key)} aria-label={`${building.name}, nivel ${buildingLevel}`}>
            <span className="building-roof"><i>{item.icon}</i><b>Nv. {buildingLevel}</b></span><span className="building-base">{building.name}</span>
          </button>;
        })}
      </div>
    </div>
    <article className="selected-building-card">
      <div className="selected-building-icon">{BUILDINGS[selected].icon}</div>
      <div className="selected-building-copy"><div className="kicker">EDIFICIO SELECCIONADO</div><h3>{info.name}</h3><p>{info.description}</p><small>Nivel {level} · +{info.income} € de ingresos diarios por nivel</small></div>
      <button className="button primary grounds-upgrade" disabled={money < cost} onClick={() => onUpgrade(selected)}>{money < cost ? 'Fondos insuf.' : `Mejorar · ${cost.toLocaleString('es-ES')} €`}</button>
    </article>
    <div className="grounds-hint">🏗️ Las mejoras son permanentes y aumentan el nivel del edificio; mejorar el estadio también amplía su capacidad.</div>
  </section>;
}
