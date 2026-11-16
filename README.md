# AUDITORY LAB — El oído humano

Plataforma educativa interactiva sobre el oído y la audición (React 19 + TypeScript + Vite + Tailwind 4 + Motion).
Funciona 100 % en el navegador, sin backend; el progreso se guarda en `localStorage`.

```bash
npm install
npm run dev      # http://localhost:5200
npm run check    # tipos + tests + build
```

## Estructura
- `src/data/` — contenido científico: anatomía, recorrido, módulos, glosario, quizzes y examen (20 preguntas).
- `src/lib/` — lógica pura: corrección (`grading.ts`), física (`physics.ts`), progreso (`progress.ts`), audio Web Audio (`audio.ts`), rutas por hash.
- `src/components/` — `EarArt` (ilustración SVG anatómica reutilizable), explorador anatómico, recorrido del sonido, osciloscopios en canvas, quiz.
- `src/views/` — dashboard, módulos 01–07, examen, glosario, evaluaciones.
