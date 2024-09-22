# Frontend App

This is the frontend application for the full-stack Turborepo starter. It's built with React, TypeScript, and Vite.

## Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)

## Getting Started

### Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server at http://localhost:5173.

### Build

To build the application:

```bash
npm run build
```

This will create a `dist` folder with the production build of the application.

### Linting

To run the linter:

```bash
npm run lint
```

This will run the ESLint linter on the application.

## Project Structure

- `src/`: Contains the source code
  - `components/`: React components
  - `lib/`: Utility functions and helpers
  - `App.tsx`: Main application component
  - `main.tsx`: Entry point of the application
- `public/`: Static assets
- `index.html`: HTML template

## Customization

- Tailwind CSS configuration is in `tailwind.config.js`
- Vite configuration is in `vite.config.ts`
- TypeScript configuration is in `tsconfig.json` and `tsconfig.node.json`

For more information on customizing the frontend, refer to the documentation of the respective technologies used.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
