# Full Stack Starter

A production-ready boilerplate for building secure, scalable web applications with Node.js, TypeScript, Express, Prisma, Redis, and Docker.

## Features

- TypeScript configuration with `ts-node-dev`
- Express server with best-practice middleware:
  - Helmet (CSP) & permissions policy
  - Rate limiting
  - CSRF protection
  - HTTPS redirection
  - CORS support
- Prisma ORM for PostgreSQL
- Redis-backed session store using `express-session` & `connect-redis`
- EJS templating for server-side rendering
- Environment validation with `zod`
- Dockerized development & production setups
- Git hooks with Husky & lint-staged

## Tech Stack

| Component            | Framework / Library         |
| -------------------- | --------------------------- |
| Runtime              | Node.js                     |
| Language             | TypeScript                  |
| Web framework        | Express.js                  |
| Database ORM         | Prisma                      |
| Database             | PostgreSQL                  |
| Session store        | Redis                       |
| Template engine      | EJS                         |
| Validation           | Zod                         |
| Security             | Helmet, CSURF, rate limiter |
| Configuration        | dotenv                      |
| Docker orchestration | Docker Compose              |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (for containerized development/production)
- A running PostgreSQL instance (local or hosted)
- A running Redis instance (local or via Docker)

## Getting Started

```bash
git clone <repo-url>
cd fs-starter-main
cp .env.example .env.dev
# Fill in .env.dev with your environment variables
```

## Development

**Local (without Docker)**

```bash
npm install
npm run generate-dev
npm run migrate-dev
npm run dev # or with docker npm run dev:docker

```

## Docker Reset

```bash
npm run docker:reset

```

## Production

TBA

## Database Migrations

- **Generate client**: `npm run generate-dev`
- **Apply migrations (dev)**: `npm run migrate-dev`
- **Apply migrations (prod)**: TBA

## Architecture Overview

<details>
<summary>Click here to expand</summary>

This project follows a **Clean, Layered Architecture** (also known as n-tier or Onion Architecture). This approach cleanly separates concerns into discrete layers, making the codebase more maintainable, testable, and scalable.

```text
Client
  ↓
Express & Middleware
(src/index.ts + src/middlewares)
  ↓
Routing → Controllers
(src/api & src/web)
  ↓
Services
(src/domains/*/services.ts)            ← Business logic
  ↓
Repositories
(src/domains/*/repositories.ts)       ← Data-access abstraction
  ↓
Prisma Client & Redis
(src/infrastructures/*)               ← Concrete adapters
```

---

### 1. Presentation Layer

**Purpose:** Handle HTTP concerns (routing, validation, request/response shaping, and view rendering).

- **Entry Point** (`src/index.ts`)

  - Bootstraps Express, applies global middleware (Helmet, CORS, rate-limit, CSRF, HTTPS redirect), and mounts API & Web routers.

- **API Routes** (`src/api/v1/…`)

  - Versioned JSON endpoints under `/api/v1`.
  - Each resource (e.g. `sessions`, `users`) has:
  - `router.ts` – defines routes.
  - `controllers.ts` – handles request/response, calls services.
  - `schemas.ts` – Zod schemas for validation.

- **Web Routes** (`src/web/…`)

  - EJS-based server-rendered views in `components/` and `pages/`.
  - `router.ts` and `controllers.ts` render pages (e.g. login, register, admin).

---

### 2. Domain Layer

**Purpose:** Encapsulate core business rules and use-case logic, independent of web or database frameworks.

- **Services** (`src/domains/{sessions,users}/services.ts`)

  - Orchestrate use cases (e.g. “register user”, “create session”).

- **Repositories** (`src/domains/{sessions,users}/repositories.ts`)

  - Define abstract data-access methods (e.g. `findByEmail`, `createSession`).

> These modules never import Express, HTTP, or view libraries—only plain TypeScript/JavaScript.

---

### 3. Infrastructure Layer

**Purpose:** Provide concrete implementations for external systems (database, cache, sessions, etc.).

- **Database** (`src/infrastructures/db.ts`)

  - Exports a singleton Prisma client connected to PostgreSQL.

- **Cache / Session Store** (`src/infrastructures/redis-client.ts`)

  - Exports a Redis client for `express-session`.

- **Security & Ops**

  - Centralized CORS policies (`cors.ts`), Content Security Policy headers (`csp.ts`), and graceful shutdown logic (`shutdown.ts`).

> Repositories import these adapters to persist and retrieve data.

---

### 4. Cross-Cutting Concerns

**Purpose:** Shared utilities and middleware used across multiple layers.

- **Errors** (`src/errors/…`)

  - Custom HTTP error classes (`custom-errors.ts`) and Prisma-specific error mappings (`prisma-errors.ts`).

- **Middleware** (`src/middlewares/…`)

  - Error handling (`api-error-handler.ts`), async wrapper (`async-handler.ts`), permission checks, view-locals injection, etc.

- **Utilities** (`src/utils/…`)

  - Common helpers (e.g. error formatting, enums).

- **Configuration** (`src/config/env.ts`)

  - Loads and validates environment variables via Zod, exposing a typed `config` object.

---

## Request Flow (Example)

1. **HTTP & Middleware**

   - Incoming request → global middleware (security, parsing)

2. **Routing**

   - URL & method determine whether to hit an API or Web router.

3. **Controller**

   - Validates input (Zod), calls the appropriate Service, sends JSON or renders an EJS view.

4. **Service**

   - Implements business logic, calls Repository methods.

5. **Repository**

   - Calls Prisma or Redis to persist/retrieve data.

6. **Response**

   - Data bubbles back through Service → Controller → client.

---

## Benefits of This Architecture

1. **Separation of Concerns**

   - Each layer has a single responsibility, simplifying both comprehension and maintenance.

2. **Testability**

   - Services and repositories can be unit-tested in isolation by mocking out infrastructure adapters.

3. **Scalability**

   - Add new interfaces (e.g. GraphQL) or swap out Prisma for another ORM with minimal impact on core business logic.

4. **Maintainability**

   - Clear folder boundaries guide contributors:

     - **`domains/`** for business logic
     - **`api/`** / **`web/`** for endpoints
     - **`infrastructures/`** for external integrations

</details>

## Project Structure

<details>
<summary>Click here to expand</summary>

## Project Structure

```plaintext
- .dockerignore
- .env.example
- .gitignore
- .husky/
  - commit-msg
  - pre-commit
- .lintstagedrc.json
- .prettierignore
- .prettierrc
- Dockerfile.dev
- Dockerfile.prod
- README.md
- commitlint.config.js
- docker-compose.dev.yaml
- docker-compose.prod.yaml
- eslint.config.mjs
- package.json
- package-lock.json
- tsconfig.json
- prisma/
  - schema.prisma
  - migrations/
    - ...
- src/
  - index.ts
  - api/
    - v1/
      - router.ts
      - sessions/
        - controllers.ts
        - router.ts
        - schemas.ts
      - users/
        - controllers.ts
        - router.ts
        - schemas.ts
  - config/
    - env.ts
  - domains/
    - sessions/
      - repositories.ts
      - services.ts
    - users/
      - repositories.ts
      - services.ts
  - errors/
    - custom-errors.ts
    - prisma-errors.ts
  - infrastructures/
    - cors.ts
    - csp.ts
    - db.ts
    - redis-client.ts
    - shutdown.ts
  - middlewares/
    - api-error-handler.ts
    - async-handler.ts
    - https-redirect.ts
    - permission-policy.ts
    - rate-limiter.ts
    - session.ts
    - validation.ts
    - view-locals.ts
  - utils/
    - api-error-responder.ts
    - enums.ts
  - web/
    - components/
      - footer.ejs
      - header.ejs
    - pages/
      - 404.ejs
      - 500.ejs
      - admin.ejs
      - csrf-error.ejs
      - home.ejs
      - layout.ejs
      - login.ejs
      - register.ejs
    - public/
      - css/
        - login.css
        - register.css
        - reset.css
    - router.ts
    - controllers.ts
```

</details>

## 🚀 Roadmap

<details>
<summary>Phase 1: Core (COMPLETED)</summary>

- **Public GitHub repo**  
  – Comprehensive `README.md` with run/build instructions, `.env.example`, visible TODO/Roadmap.
- **TypeScript + Node.js + Express**  
  – ES‑module setup, `tsconfig.json`, dev/build/npm scripts (`dev`, `build`, `start`, `dev:docker`).
- **Clean, Layered Architecture**  
  – `/src/routes → controllers → services → repositories → Prisma client`  
  – Shared **utils** (`asyncHandler`, custom errors), centralized **config** loader.
- **Prisma ORM**  
  – Type‑safe models, migrations, singleton client.
- **Hybrid Web + API**  
  – EJS‑templated pages, plus `/api` JSON endpoints.
- **Modular Routing**  
  – Distinct `web` vs `api` routers; plug‑and‑play controllers.
- **Security Foundations**  
  – Helmet for headers (custom CSP on `/`), global error handler, production‑only rate limiter.
- **DevOps‑Ready**  
  – Docker‑first: dev/prod `Dockerfile`s + Compose files (`docker-compose.dev.yaml`, `docker-compose.prod.yaml`), `dev:docker` script.
- **Environment Safety**  
  – dotenv (`.env.dev`, `.env.prod`, `.env.example`).
- **Linting & Formatting**  
  – ESLint + Prettier, Husky pre‑commit hook, commitlint (format & lint).
- **Static Assets & Lifecycle**  
  – `express.static` support, well‑defined npm lifecycle scripts.
- Centralize HTTP error classes → map in global handler
- **HTTP Error hierarchy**: implement `BadRequestError`, `NotFoundError`, etc. subclasses
</details>

<details>
<summary>Phase 2: Docs & Cleanup (COMPLETED)</summary>

- Sync **README** → code (all existing routes, remove “projects”/“blog” stubs)
- Orphaned views: implement or delete `projects.ejs`/`blog.ejs`
- Add ASCII/folder diagram of `/src/{routes,controllers,services,repositories,utils,config,views}`
- **Factor EJS layout partials**: extract shared header/footer into partials
- **Ensure middleware ordering**: register `helmet()`, `cors()`, etc. before body‑parsers and routes
</details>

<details>
<summary>Phase 3: Developer DX & Code Quality (COMPLETED)</summary>

- **Path Aliases** (`@controllers/*`, `@services/*`, etc.) → refactor deep imports
- ESLint/Prettier lockdown on `.ts`, `.ejs`, `.json` via Husky
- **Install & configure lint‑staged** for faster, scoped pre‑commit checks
</details>

<details>
<summary>Phase 4: Validation, Auth & Error Handling (COMPLETED)</summary>

- Request schemas (Zod or Joi) for auth, user, future CRUD
- **Config validation at startup**: use Zod/Joi to validate `process.env` on boot
- **Type‑safe config exports**: wrap validated env in a typed config object
- **Prisma type reuse**: leverage generated `Prisma.*` types instead of custom interfaces
- **Prisma connection handling**: ensure singleton client disconnects gracefully on shutdown
  </details>

<details>
<summary>Phase 5: Security Hardening (COMPLETED)</summary>

- CSRF (`csurf`) on all web forms; inject tokens in EJS
  - **DRY shared view data**: add middleware to inject common `res.locals` (user session,user info, CSRF tokens) into all renders
- CORS lock‑down to known origins
- HTTPS‑only enforcement in production
- Secure cookies/sessions (`secure`, `httpOnly`, `sameSite`)
- Different helmets for API and WEB
</details>

<details open>
<summary>Phase 6: Basic RESTful CRUD endpoints and views</summary>

### Completed

- Create Register page (basic UI)
- Create Login page (basic UI)
- Add prisma errors into error handling middleware
- Change file organization
- Update README.md
- Refactor error structure from string[] to Record<string, string>

### In progress

- Session restful crud
  - JWT + bcrypt
- User restful crud

### TODO

- Admin page
- Route guard for pages and endpoints
- Improve validation messages from prisma orm
- Make sure all the middlewares in index.ts and router files are working as inteded
- Domain Layer Purity ? There is leak
- Infrastructure vs Middleware. Some files are misplaced. Maybe logic is not understood properly
- Null‐checks: In your session service, you do user?.id when signing your JWT; if getUserByEmail returns null, you’ll sign { userId: undefined }. Either ensure the user exists (throw an error) before hashing or keep your types consistent.

</details>

<details>
<summary>Phase 7: Observability & Monitoring</summary>

- **Basic logging** (Morgan in dev) & `/healthz` health‑check
- Structured logging (Pino for JSON output, log levels)
- `/metrics` endpoint for Prometheus
- **Correlation IDs**: inject unique request IDs for log tracing
- Sentry integration + alerting (Slack/webhook)
</details>

<details>
<summary>Phase 8: Testing & CI/CD</summary>

- **Unit tests** (Jest) for services & repositories (mocking Prisma)
- **Integration tests** (Supertest) on web & API routes
- Code‑coverage threshold enforcement
- **Split App vs. Server**: extract `app.ts` (Express app) and `server.ts` (boot) for testability
- **GitHub Actions**: on PR → lint/build/test/coverage; on merge → build & push Docker images
- Semantic Release (CHANGELOG, version bump, GitHub Release)
- Remember to add test script for graceful DB shutdown in index.ts
</details>

<details>
<summary>Phase 9: API Docs & Versioning</summary>

- OpenAPI/Swagger spec (`/docs/openapi.yaml`) + Swagger UI at `/docs`
- Postman collection in repo
- **API versioning strategy**: mount routes under `/api/v1`, update docs accordingly
</details>

<details>
<summary>Phase 10: Performance & Caching</summary>

- Static‑asset CDN + cache headers
- Template caching (in‑memory or Redis)
- DB query optimization & indexing
- Response compression middleware
</details>

<details>
<summary>Phase 11: Front‑End Rebuild</summary>

- React/Next.js front‑end consuming your API
- Netlify/Vercel (or S3/CloudFront) CI/CD
- Theming, WCAG accessibility, responsive design
- 404 & 5xx EJS error pages
  </details>

<details>
<summary>Phase 12: Infra & Deployment</summary>

- Multi‑stage Docker builds for minimal images
- **NGINX**: reverse‑proxy configuration & SSL termination
- **pgAdmin**: containerized database management
- **Container & DB health checks**: ensure app and database readiness & liveness
- **Database backups**: scheduled dumps & point‑in‑time recovery
- Kubernetes + Helm charts (Deployment, Service, Ingress)
- Terraform (DB, cache, LB)
- Blue/Green or canary deploy strategy
</details>

<details>
<summary>Phase 13: Postponed Tasks</summary>

- Persistent session with express session
- **Document Docker Compose usage**: note `-f docker-compose.dev.yaml` and `-f docker-compose.prod.yaml` for respective environments
- Add how to run in prod into README.md
- Add how to deploy into README.md
- **Docker Live Reload --watch** Docker doesn't live reload FE. Fix it.
- **Transaction boundaries**: wrap multi‑step operations in `prisma.$transaction(…)`
- Route guard for API endpoints
- different app for api and web? middleware confusion
</details>

<details>
<summary>Phase 14: Optional Extras</summary>

- Translated errors
- Headless CMS (Strapi/Ghost/Sanity) for blog
- WebSockets/SSE for real‑time admin notifications
- GraphQL gateway atop REST
- **Feature flags**: toggle new features via ENV or flags service
</details>

## License

[MIT](https://chatgpt.com/c/LICENSE)
