# 🐦 NestJS Backend API — Twitter Clone

This is the backend server for the Twitter Clone web application, built with **NestJS**, **TypeORM**, **PostgreSQL**, and **Apollo GraphQL** (using a code-first approach).

---

## 📁 Directory Structure

```
src/
├── auth/                 # Authentication service & GraphQL resolver
├── config/               # Application & DB configuration using Configify
├── database/             # Data Source configuration and migrations
│   └── migrations/       # TypeORM database migration files
├── decorator/            # Custom decorators (e.g., @Public, @CurrentUser)
├── dtos/                 # Data Transfer Objects / GraphQL Inputs
├── entities/             # Database Entities (PostgreSQL tables)
│   ├── post/             # post.entity, comments.entity, likes.entity
│   └── user/             # user.entity, followers.entity
├── feed/                 # Posts, Feed, Comments, and Likes service & resolver
├── guard/                # GraphQL Authentication guards
├── strategy/             # JWT passport strategy
├── app.module.ts         # Central application module
├── main.ts               # Server bootstrapping entry point
└── schema.gql            # Auto-generated GraphQL Schema
```

---

## 🛠️ Requirements & Setup

### Prerequisites
*   Node.js (v20+)
*   npm (v10+)
*   Docker & Docker Compose (for PostgreSQL container)

### Setup Steps

1.  **Clone / Go to backend directory:**
    ```bash
    cd twitter-backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Database Container:**
    Spin up the PostgreSQL database container defined in `docker-compose.yml`:
    ```bash
    docker compose up -d
    ```

4.  **Configure Environment Variables:**
    The project uses `@itgorillaz/configify` to load, type-cast, and validate environment variables. Configure the `.env` file in the root of the backend directory:
    ```env
    PORT=3001
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=admin
    DB_PASSWORD=password
    DB_NAME=nest_db
    JWT_SECRET=supersecret
    JWT_EXPIRE_ACCESS=1d
    JWT_EXPIRE_REFRESH=7d
    ```

---

## 🗄️ Database Migrations

This project uses **TypeORM Migrations** to manage database schema updates.

*   **Generate a new migration:**
    ```bash
    npm run migration:generate --name=MigrationName
    ```
*   **Create an empty migration:**
    ```bash
    npm run migration:create --name=MigrationName
    ```
*   **Run migrations (Apply to DB):**
    ```bash
    npm run migration:run
    ```
*   **Revert last migration:**
    ```bash
    npm run migration:revert
    ```
*   **Show all migrations:**
    ```bash
    npm run migration:show
    ```

---

## 💻 Running the Server

```bash
# Start in development (watch mode)
npm run start:dev

# Start in production mode
npm run start:prod

# Start in debug mode
npm run start:debug
```

Once running:
*   The API server listens on port `3001` (configured via `.env`).
*   **GraphQL Playground:** Access the interactive playground at [http://localhost:3001/graphql](http://localhost:3001/graphql).
*   CORS is pre-configured to allow requests from the Next.js frontend at `http://localhost:3000`.

---

## 🔐 Authentication & Guards

*   The backend uses **JWT Passport Authentication** with an access token (expires in 1 day by default) and a refresh token (expires in 7 days).
*   A global `GqlAuthGuard` is registered in `app.module.ts` to protect all GraphQL endpoints by default.
*   To expose specific queries/mutations publicly (such as `login` or `signup`), use the custom `@Public()` decorator.
*   To retrieve the currently authenticated user in a resolver, use the `@CurrentUser()` decorator.

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run end-to-end (e2e) tests
npm run test:e2e

# Run test coverage report
npm run test:cov
```
