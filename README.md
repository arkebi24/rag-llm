# Full-Stack Turborepo Starter

This is a full-stack starter template using Turborepo, with a NestJS backend and a React frontend, configured for deployment on Vercel.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `backend`: a [NestJS](https://nestjs.com/) app
- `frontend`: a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/)

### Packages

- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations

## Frontend Technologies

The frontend app uses the following technologies:

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Development

To develop all apps and packages, run the following command:

```
npm run dev
```

This will start the development servers for both the frontend and backend.

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Deployment

This project is configured for deployment on Vercel. The `vercel.json` file in the root directory specifies the build and deployment settings.

To deploy:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Aceternity UI Documentation](https://ui.aceternity.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
