# Crumb Club Cookie Studio

A small, browser-based cookie decorating game built with TypeScript and Vite. Pick a cookie, choose toppings, then tap or drag over the cookie to decorate it. No account or app installation is needed.

## Features

- Four cookie bases: classic, cocoa, berry, and vanilla
- Six toppings: sprinkles, chocolate chips, sugar pearls, stars, candy hearts, and icing
- Topping-specific default colors, plus a color palette for overrides
- Adjustable topping size, drag-to-decorate, undo, clear, and sprinkle shower
- Export your finished cookie as a PNG
- Responsive layout for desktop and mobile browsers

## Run Locally

From the workspace root, enter the game folder and install its dependencies:

```powershell
cd .\cookie-lab
npm install
```

Start the development server:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173` (or the next available port).

## Share on the Same Wi-Fi

Start Vite with network access enabled:

```powershell
npm run dev -- --host 0.0.0.0 --port 5175
```

Find your computer's Wi-Fi IPv4 address with `ipconfig`, then open `http://<computer-ip>:5175` on another device connected to the same network. Keep the development server running while playing. Your firewall may ask permission for local network access.

## Type-Check and Build

Run these commands from the `cookie-lab` folder:

```powershell
npm run typecheck
npm run build
```

The production site is written to `dist/`. To preview that build locally:

```powershell
npm run preview
```

To preview it on other devices on your Wi-Fi, use `npm run preview -- --host 0.0.0.0` and open the network URL Vite prints.

## Deploy

This is a static site. Run `npm run build`, then publish the contents of `dist/` with a static host such as Netlify, Vercel, or GitHub Pages. A public deployment can be opened from any device with a browser.

## Project Files

- `src/main.ts` contains the game UI, canvas rendering, and interactions.
- `src/game.css` contains the visual styles and responsive layout.
- `index.html` is the Vite page entry point.
- `tsconfig.json` enables strict TypeScript checking.

