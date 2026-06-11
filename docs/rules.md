# Project Rules - Instagram Reel Downloader

## Coding Standards
- **TypeScript Everywhere**: No `any`. Use strict typing.
- **Next.js Best Practices**: Use App Router, Server Components where possible, and optimized metadata.
- **Tailwind CSS**: Follow mobile-first design. Use semantic variables for themes.
- **ShadCN UI**: Use for consistent component design.
- **Drizzle ORM**: All database interactions must go through Drizzle. No raw SQL unless absolutely necessary.
- **Clean Code**: DRY (Don't Repeat Yourself), SOLID principles, and meaningful naming.

## Folder Structure
- `app/`: Next.js App Router (Routes, Layouts, API).
- `components/`: Reusable UI components.
- `db/`: Database schema and configuration.
- `utils/`: Helper functions and shared logic.
- `public/`: Static assets.
- `docs/`: Project documentation.

## Naming Conventions
- **Files/Folders**: `kebab-case` for folders and non-component files. `PascalCase` for React components.
- **Variables/Functions**: `camelCase`.
- **Constants**: `UPPER_SNAKE_CASE`.
- **Types/Interfaces**: `PascalCase`.

## Security
- Secrets must be stored in `.env`.
- Never commit `.env` or any credentials.
- Validate all user inputs.
- Use rate limiting for API routes.

## API Rules
- Use meaningful status codes (200, 201, 400, 401, 403, 404, 500).
- Consistent JSON response format: `{ data: ..., message: ... }` or `{ error: ..., message: ... }`.

## Git Rules
- Use Conventional Commits:
  - `feat`: New features.
  - `fix`: Bug fixes.
  - `refactor`: Code changes that neither fix a bug nor add a feature.
  - `docs`: Documentation changes.
  - `db`: Database schema or migration changes.
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
  - `test`: Adding missing tests or correcting existing tests.
- Never use generic messages like `update` or `changes`.
