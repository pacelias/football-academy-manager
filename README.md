# Football Academy Manager ⚽

MVP jugable, mobile-first y en español. React, TypeScript, Vite y PWA; el progreso se guarda en el almacenamiento local del navegador.

## Ejecutar en Android con Termux

Ejecuta cada comando por separado (pulsa Enter después de cada línea):

```sh
pkg update
pkg install git nodejs
 git clone https://github.com/pacelias/football-academy-manager.git
cd football-academy-manager
npm install
npm run dev -- --host 0.0.0.0
```

Deja Termux abierto y visita `http://localhost:5173` en el navegador del mismo teléfono. En el menú del navegador puedes elegir **Añadir a pantalla de inicio**. Para salir del servidor usa `Ctrl+C`.

Si ya clonaste el proyecto, entra a su carpeta y usa `git pull` para recibir cambios antes de ejecutar `npm install` y `npm run dev -- --host 0.0.0.0`.

## MVP incluido

- Crear club y guardar automáticamente la partida.
- Plantilla inicial con valoración, potencial, posición, forma, moral y atributos.
- Entrenamientos individuales y colectivos con coste y fatiga.
- Amistosos con rivales, resultados, ingresos y registro.
- Ingresos diarios, salarios básicos y mejoras de instalaciones.
- Misiones con recompensas.
- Interfaz adaptable a móvil e instalable como PWA tras desplegarse con HTTPS.

La primera versión no incluye ligas, transferencias, torneos ni simulación en tiempo real; se pueden añadir progresivamente.
