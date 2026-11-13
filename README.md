body {
  margin: 0;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, #09141d 0%, #0d1c2d 100%);
  color: #e5edf6;
}

* {
  box-sizing: border-box;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  max-width: 520px;
  margin: 0 auto;
  padding: 12px 14px 90px;
  background: radial-gradient(circle at top, rgba(36, 81, 128, 0.5), rgba(9, 12, 18, 0.96));
}

.intro-shell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-card {
  width: min(100%, 460px);
  background: rgba(14, 23, 35, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 26px;
  padding: 24px 18px;
  box-shadow: 0 20px 60px rgba(5, 10, 18, 0.5);
}

.badge {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.18);
  color: #9ae6b4;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
h3,
h4,
p {
  margin-top: 0;
}

h1 {
  font-size: clamp(2rem, 7vw, 3rem);
  margin: 15px 0 10px;
}

p {
  color: #bfd2eb;
  line-height: 1.5;
}

.text-input {
  width: 100%;
  margin: 12px 0 16px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.92);
  color: white;
  border-radius: 14px;
  padding: 14px 16px;
}

.primary-button,
.secondary-button,
.nav-button {
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.primary-button {
  width: 100%;
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  color: white;
  padding: 14px 18px;
  font-weight: 700;
}

.secondary-button {
  background: rgba(15, 118, 110, 0.18);
  color: #dffef6;
  padding: 10px 14px;
  font-weight: 600;
}

.primary-button:hover,
.secondary-button:hover,
.nav-button:hover {
  transform: translateY(-1px);
}

.compact {
  width: auto;
  min-width: 105px;
  padding: 11px 16px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding: 14px 4px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  opacity: 0.8;
}

.topbar h2 {
  margin: 4px 0 0;
  font-size: 1.5rem;
}

.stat-stack {
  display: flex;
  gap: 10px;
}

.mini-stat {
  min-width: 92px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  padding: 8px 10px;
}

.mini-stat span,
.detail-card span,
.stats-row span,
.player-topline small,
.building-card p,
.simple-card small,
.history-item span,
.mission-card p,
.input-label {
  color: #b8cee8;
}

.mini-stat strong,
.detail-card strong {
  display: block;
  margin-top: 6px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-grid {
  display: grid;
  gap: 16px;
}

.panel {
  background: rgba(11, 18, 28, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 22px;
  padding: 16px;
}

.highlight {
  background: linear-gradient(180deg, rgba(17, 98, 111, 0.2), rgba(13, 20, 30, 0.86));
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.cards-grid,
.buildings-grid {
  display: grid;
  gap: 12px;
}

.cards-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 14px 12px;
}

.players-stack,
.missions-list,
.logs-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.player-card,
.simple-card,
.building-card,
.mission-card,
.history-item {
  background: rgba(16, 24, 34, 0.86);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 16px;
  padding: 12px 14px;
}

.player-topline,
.building-topline,
.simple-card,
.mission-meta,
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.player-topline b,
.simple-card b,
.mission-card h4,
.building-card h4 {
  display: block;
  font-size: 1rem;
}

.rating-pill,
.badge-soft {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  padding: 8px 10px;
  background: rgba(59, 130, 246, 0.22);
  border-radius: 999px;
  font-weight: 700;
  color: #dbeafe;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.9rem;
}

.inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.building-card p {
  margin: 10px 0 14px;
}

.history-item {
  font-size: 0.92rem;
}

.history-item em {
  font-style: normal;
  color: #f8fae7;
  font-weight: 700;
}

.mission-card {
  justify-content: space-between;
  align-items: flex-start;
}

.mission-card.is-complete {
  border-color: rgba(52, 211, 153, 0.4);
  background: rgba(6, 78, 59, 0.18);
}

.mission-meta {
  flex-direction: column;
  align-items: flex-end;
  min-width: 82px;
}

.log-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  color: #dbeafe;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(100%, 520px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 12px 18px;
  background: rgba(10, 16, 22, 0.94);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.nav-button {
  padding: 12px 8px;
  background: rgba(15, 23, 42, 0.8);
  color: #dfeaf9;
  font-weight: 600;
}

.nav-button.active {
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #1e293b;
}

@media (max-width: 420px) {
  .app-shell {
    padding-left: 10px;
    padding-right: 10px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
