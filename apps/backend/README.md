# Backend App

This is the backend application for the full-stack Turborepo starter. It's built with NestJS and TypeScript.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Development

To start the development server:

```bash
npm run dev
```

This will start the NestJS development server at http://localhost:3000.

### Build

To build the application:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

### Production

To run the application in production mode:

```bash
npm run start
```

## Project Structure

- `src/`: Contains the source code
  - `app.controller.ts`: Main application controller
  - `app.module.ts`: Main application module
  - `app.service.ts`: Main application service
  - `main.ts`: Entry point of the application
- `test/`: Contains test files

## API Endpoints

The backend exposes the following API endpoints:

- `GET /api`: Returns a "Hello World!" message

## Customization

- NestJS configuration is in `nest-cli.json`
- TypeScript configuration is in `tsconfig.json` and `tsconfig.build.json`

For more information on customizing the backend, refer to the [NestJS documentation](https://docs.nestjs.com/).
