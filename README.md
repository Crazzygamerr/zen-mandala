# Zen-mandala

An editor for creating mandalas.

## Features

- Using PIXI.js for rendering
- Mandala, MandalaLayer, and Shape abstraction
- Preset shapes and custom shapes
- Animation

## Roadmap

- [x] Mandala generation from state JSON (Mandala layer add)
- [ ] Layer highlight on hover
- [ ] Use types from PIXI.js (graphics)
- [ ] Remove the app reference from MandalaLayer
- [ ] Shape builder
- [ ] Editor UI
- [ ] Animation timeline
- [ ] Animation class
- [ ] Performance optimization, using Sprites
- [ ] Exporting Images
- [ ] Recording and exporting animations
- [ ] Infinite looping GIFs
- [ ] Landing Page

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
