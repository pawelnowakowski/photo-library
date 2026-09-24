# Photo Library

Photo Library is a small Angular application for browsing an infinite stream of random photos. Users can save selected photos as favorites, view the complete favorites list and open a favorite in a dedicated details view. Favorites are stored in `localStorage`, so they remain available after a page refresh.

## Tech stack

- Angular 22 and Angular Material
- Angular Signals and RxJS
- SCSS with BEM naming
- Jasmine and Karma
- Picsum Photos

## Run locally

Requirements: Node.js supported by Angular 22, npm and Google Chrome or Chromium.

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Tests

Run tests in watch mode:

```bash
npm test
```

Run the test suite once in headless Chrome:

```bash
npm test:headless
```

## Production build

```bash
npm run build
```

Build output is generated in the `dist/` directory.
