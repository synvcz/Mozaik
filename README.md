<div align="center">

#   Mozaik Kain Perca

**Piece together Indonesian flowers and icons from patterned fabric scraps.**

An interactive fabric-collage workshop inspired by batik, kawung, parang and the flowers of Indonesia.

![React](https://img.shields.io/badge/React-19-315C48?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-315C48?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-C77D55?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-A7B69A?logo=tailwindcss&logoColor=white)
![Konva](https://img.shields.io/badge/React_Konva-canvas-C77D55)

</div>

---

##  What is it?

*Kain perca* means "fabric scraps" and *mozaik* means "mosaic". In **Mozaik Kain Perca** you arrange colorful
pieces of patterned fabric on a canvas to build your own artwork: a moon orchid, a Rafflesia, a tumpeng, or
something completely original. No needle, no thread, no account.

##  Features

| | |
|---|---|
| **Workshop** | Animated home page with featured challenges and your recent creations |
| **Create** | A real canvas editor: add, drag, resize, rotate, layer, undo/redo, duplicate, delete |
| **Fabrics** | Batik, Kawung, Parang, Floral, Polka dots and Plain, in 12 colors |
| **Shapes** | Square, circle, petal, leaf, triangle and diamond |
| **Outline templates** | Dashed guides for 5 flowers and 4 Indonesian icons |
| **Challenges** | Anggrek Bulan, Rafflesia Arnoldii, Bunga Melati, Bunga Sepatu, Bunga Kenanga |
| **Galeri** | Community gallery: like, sort (newest / most popular), filter by category, publish |
| **My Collection** | Everything you saved this session: preview, continue editing, publish, delete |

### Outline templates

🌸 Anggrek Bulan · 🌺 Rafflesia Arnoldii · 🤍 Bunga Melati · 🌺 Bunga Sepatu · 🌼 Bunga Kenanga
🎭 Gunungan (wayang) · 🏠 Rumah Gadang · 🛕 Candi Borobudur · 🍚 Tumpeng

##  Getting started

```bash
git clone <your-repo-url>
cd Mozaik
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # type-check and production build
npm run lint      # ESLint
npm run preview   # serve the production build
```

##  How to use

1. Open **Create** (or start a **Challenge** to get an outline).
2. Choose a **shape**, a **color** and a **fabric**, then click the fabric to add it. On desktop you can drag it onto the canvas.
3. Drag, resize and rotate pieces. Use **Layers** to reorder them.
4. **Save** to My Collection, then **Publish** to Galeri when you are happy.

**Shortcuts:** `Ctrl/Cmd + Z` undo · `Ctrl/Cmd + Shift + Z` or `Ctrl + Y` redo · `Delete` remove the selected piece.

##  Tech stack

- **React + TypeScript + Vite**
- **Tailwind CSS v4** with a custom warm palette
- **React Konva** for the interactive canvas
- **Zustand** for state (editor, collection, gallery, toasts, navigation)
- **Lucide React** icons
- Hash-based navigation, so no router dependency

##  Project structure

```text
src/
├── components/   common · layout · editor · artwork · gallery · challenges · workshop
├── features/     page-level screens (workshop, editor, challenges, gallery, collection)
├── store/        zustand stores
├── data/         challenges, outline templates, seed gallery
├── lib/          shapes, fabric patterns, editor actions
└── types/
```

##  Notes

- There is **no backend**. All data lives in memory and resets when you refresh the page.
- Fabric patterns are generated in code, so there are no image assets to load.
- Flower illustrations and outlines are simplified, hand-drawn SVGs meant for inspiration, not botanical accuracy.

##  Palette

| Ivory | Forest | Sage | Terracotta |
|---|---|---|---|
| `#F8F6F0` | `#315C48` | `#A7B69A` | `#C77D55` |

---

<div align="center">Made with scraps of imagination </div>