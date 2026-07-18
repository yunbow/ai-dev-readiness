# Diagnóstico de Preparación para el Desarrollo Impulsado por IA (AI-Driven Development Readiness)

[![Lint & Link Check](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml/badge.svg)](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../../LICENSE)

**Demo:** https://yunbow.github.io/ai-dev-readiness/

Una aplicación web estática que visualiza el grado de preparación de una organización de desarrollo o proyecto para el desarrollo impulsado por IA, simplemente respondiendo un breve cuestionario.

- **Puntuación de Desarrollo Impulsado por IA** (sobre 100 puntos, en 5 ejes)
- **Nivel de Adopción de IA** (Nivel 1–5)
- **Reducción estimada del esfuerzo de desarrollo gracias al uso de IA** (mostrada como rango, con un tope del 45%)
- Idoneidad de la IA por proceso / fortalezas / mejoras prioritarias / hoja de ruta de adopción
- Compartir en redes sociales con una imagen de la puntuación adjunta

Sus respuestas y resultados se procesan íntegramente en su navegador (LocalStorage / IndexedDB); **no se envía nada al exterior**. No requiere inicio de sesión y es gratuito.

## Stack Tecnológico

TypeScript / React 19 / Vite 8 / Tailwind CSS 4 / shadcn/ui / React Router (HashRouter) / idb / html-to-image / Vitest

## Desarrollo

```bash
cd app            # Ir al directorio de la app
npm ci            # Instalar dependencias
npm run dev       # Iniciar el servidor de desarrollo
npm run test      # Pruebas unitarias de la lógica de diagnóstico (Vitest)
npm run build     # Verificación de tipos + build de producción (dist/)
npm run preview   # Vista previa del resultado del build
```

### Prueba de humo E2E

```bash
cd app
npx playwright install chromium   # solo la primera vez
npm run build && npm run preview  # iniciar en otra terminal (puerto 4173)
node tests/e2e-smoke.mjs
```

## Despliegue (GitHub Pages)

Al hacer push a la rama `main`, `.github/workflows/deploy.yml` ejecuta pruebas → build → publicación en GitHub Pages.
Configure **Settings → Pages → Build and deployment → Source como "GitHub Actions"** en el repositorio.
Gracias a HashRouter y a un `base: "./"` relativo, funciona independientemente del nombre del repositorio.

## Estructura de Directorios

```text
app/src/
├─ app/             Enrutamiento y layout compartido
├─ pages/           6 pantallas (inicio / selección de diagnóstico / respuestas / resultado / historial / About)
├─ components/      assessment / result / share / charts / ui (shadcn)
├─ domain/
│  ├─ assessment/   Motor de diagnóstico (preguntas, puntuación, tasa de reducción, idoneidad por proceso, recomendaciones) — independiente de React, con pruebas unitarias
│  └─ history/      Tipos de registro de historial
├─ infrastructure/  localStorage / IndexedDB / generación de imágenes PNG
├─ hooks/ lib/ constants/
docs/design/        Especificaciones de implementación (especificación de puntuación, especificación de UI, catálogo de recomendaciones)
```

## Lógica de Diagnóstico

- Ejes de evaluación: Documentación y Formalización del Conocimiento 25 pts / Proceso de Desarrollo 25 pts / Aseguramiento de Calidad 20 pts / Marco de Uso de IA 15 pts / Idoneidad del Proyecto 15 pts
- Puntuación determinista basada en reglas (las mismas respuestas siempre producen el mismo resultado)
- Carencias graves, como no usar Git, limitan la puntuación total
- Consulte `docs/design/01-scoring-spec.md` para más detalles

## Aviso

El resultado del diagnóstico es una estimación basada en las respuestas del cuestionario. La reducción real del esfuerzo varía según el tamaño del sistema, la deuda técnica, el nivel de habilidad del equipo, las herramientas de IA utilizadas, los requisitos de seguridad, el alcance de la adopción y otros factores.

---

Languages: [English](../../../README.md) | [日本語](../ja/README.md) | [简体中文](../zh-CN/README.md) | [한국어](../ko/README.md) | Español
