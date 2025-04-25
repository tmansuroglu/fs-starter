## How to run the app

<details>
<summary>Development</summary>

- cp .env.example .env.dev
  - fill .env.dev
- Make sure docker is open in the background
- npm run dev:docker
</details>

## Useful commands

<details>
<summary>Click here to expand</summary>

- docker-compose --env-file .env.dev -f docker-compose.dev.yaml down -v # Stop and remove containers, volumes
- docker image prune -af # Remove all unused images
- docker volume prune -f # Clean up unused volumes
</details>

## Request Flows

<details>
<summary>Request Flow For Web</summary>

- Browser (GET /web-route)
- ↓
- Route → Controller
- ↓
- Service → Repository
- ↓
- PostgreSQL
- ↓
- Controller returns rendered HTML view
</details>

<details>
<summary>Request Flow For API</summary>

- Browser (POST /api-endpoint)
- ↓
- API Route → Controller
- ↓
- Service → Repository
- ↓
- PostgreSQL
- ↓
- Returns JSON response
</details>

## Architecture

<details>
<summary>Click here to expand</summary>

This project follows a clean, layered design. Each layer has **allowed** activities and clear **limits** to keep code maintainable and decoupled.

---

### 1. Framework / Driver

- **Allowed**
  - ✅ Creating and configuring the Express app (`src/index.ts`)
  - ✅ Registering global middleware (CORS, body-parser, etc.)
  - ✅ Mounting top-level routes (`src/routes/*.ts`)
- **Limits**
  - ❌ No business logic
  - ❌ No request parsing/validation beyond global parsers
  - ❌ No direct data access

---

### 2. Interface-Adapter

#### A) Validation Middleware (`src/middlewares/validation.middleware.ts`)

- **Allowed**
  - ✅ Parsing, coercing and stripping HTTP payloads via Zod schemas
  - ✅ Rejecting invalid requests with uniform 4xx responses
  - ✅ Attaching cleaned data to `req` for downstream handlers
- **Limits**
  - ❌ No domain/business rules
  - ❌ No database or external API calls

#### B) Controllers (`src/controllers/*.ts`)

- **Allowed**
  - ✅ Receiving a _validated_ `req` (typed by Zod)
  - ✅ Calling **services** with plain payloads
  - ✅ Formatting and sending HTTP responses (status codes, JSON)
  - ✅ Delegating errors to a global error handler via `next(err)`
- **Limits**
  - ❌ No low-level validation or parsing
  - ❌ No direct repository / ORM usage
  - ❌ No Zod schema definitions

---

### 3. Application-Logic (Services) (`src/services/*.ts`)

- **Allowed**
  - ✅ Implementing core use-cases (e.g. `loginUser`, `createOrder`)
  - ✅ Enforcing business invariants and orchestration of domain rules
  - ✅ Calling repositories to fetch or persist data
  - ✅ Throwing domain-level errors (e.g. `UnauthorizedError`)
- **Limits**
  - ❌ No Express `Request`/`Response` or middleware concerns
  - ❌ No raw HTTP parsing or Zod validation
  - ❌ No framework-specific code

---

### 4. Domain / Model (Schemas & Types) (`src/schemas/*.schema.ts`)

- **Allowed**
  - ✅ Defining Zod schemas for inputs and entities (e.g. `LoginPayload`)
  - ✅ Exporting plain TypeScript types via `z.infer<>`
  - ✅ Shared domain constants or enums
- **Limits**
  - ❌ No Express or HTTP imports
  - ❌ No service/business logic
  - ❌ No data-access code

---

### 5. Infrastructure (Repositories & Adapters) (`src/repositories/*.ts`)

- **Allowed**
  - ✅ Performing data access (database queries, ORM calls)
  - ✅ Calling external APIs or cache layers
  - ✅ Mapping raw data into domain entities
- **Limits**
  - ❌ No business rules or orchestration
  - ❌ No HTTP handling or validation

---

#### Why this matters

- 🔄 **One-way dependencies**:  
  Framework → Interface-Adapter → Application-Logic → Domain → Infrastructure
- ✅ **Separation of concerns**:  
  Validation, business rules, data access and HTTP wiring each live in their own layer
- ⚙️ **Testability**:  
  Services test with pure types, controllers test with validated requests, infrastructure tests with stubs
- 🔄 **Reusability**:  
  Domain schemas & services can be reused in CLI tools, GraphQL APIs, or other adapters

</details>

## Project Structure

<details>
<summary>Click here to expand</summary>

- .gitignore
- .dockerignore
- .eslint.config.mjs
- .prettierrc
- commitlint.config.js
- docker-compose.dev.yaml
- docker-compose.prod.yaml
- Dockerfile.dev
- Dockerfile.prod
- .env.example
- package.json
- package-lock.json
- tsconfig.json
- README.md
- .husky/
  - pre-commit
  - commit-msg
- prisma/
  - schema.prisma
- src/
  - index.ts
  - config/
    - env.ts
    - db.ts
  - controllers/
    - api/
      - auth.controller.ts
    - web/
      - page.controller.ts
  - public/
    - css/
      - login.css
      - reset.css
  - middlewares/
    - auth.middleware.ts
    - error-handler.middleware.ts
    - rate-limiter.middleware.ts
  - repositories/
    - user.repository.ts
  - routes/
    - api/
      - auth.routes.ts
    - web/
      - page.routes.ts
  - services/
    - auth.services.ts
  - utils/
    - async-handler.ts
    - errors.ts
  - views/
    - admin.ejs
    - home.ejs
    - login.ejs
    - partials/
      - footer.ejs
      - header.ejs
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

<details open>
<summary>Phase 5: Security Hardening (IN PROGRESS)</summary>

- CSRF (`csurf`) on all web forms; inject tokens in EJS
  - **DRY shared view data**: add middleware to inject common `res.locals` (user session,user info, CSRF tokens) into all renders
- CORS lock‑down to known origins
- HTTPS‑only enforcement in production
- Secure cookies/sessions (`secure`, `httpOnly`, `sameSite`)
- Different helmets for API and WEB
- Route guard for API endpoints
- Route guard for WEB pages
</details>

<details>
<summary>Phase 6: Observability & Monitoring</summary>

- **Basic logging** (Morgan in dev) & `/healthz` health‑check
- Structured logging (Pino for JSON output, log levels)
- `/metrics` endpoint for Prometheus
- **Correlation IDs**: inject unique request IDs for log tracing
- Sentry integration + alerting (Slack/webhook)
</details>

<details>
<summary>Phase 7: Testing & CI/CD</summary>

- **Unit tests** (Jest) for services & repositories (mocking Prisma)
- **Integration tests** (Supertest) on web & API routes
- Code‑coverage threshold enforcement
- **Split App vs. Server**: extract `app.ts` (Express app) and `server.ts` (boot) for testability
- **GitHub Actions**: on PR → lint/build/test/coverage; on merge → build & push Docker images
- Semantic Release (CHANGELOG, version bump, GitHub Release)
- Remember to add test script for graceful DB shutdown in index.ts
</details>

<details>
<summary>Phase 8: API Docs & Versioning</summary>

- OpenAPI/Swagger spec (`/docs/openapi.yaml`) + Swagger UI at `/docs`
- Postman collection in repo
- **API versioning strategy**: mount routes under `/api/v1`, update docs accordingly
</details>

<details>
<summary>Phase 9: Performance & Caching</summary>

- Static‑asset CDN + cache headers
- Template caching (in‑memory or Redis)
- DB query optimization & indexing
- Response compression middleware
</details>

<details>
<summary>Phase 10: Front‑End Rebuild</summary>

- React/Next.js front‑end consuming your API
- Netlify/Vercel (or S3/CloudFront) CI/CD
- Theming, WCAG accessibility, responsive design
- 404 & 5xx EJS error pages
- **Login flow**
  - FE validation
  - JWT + bcrypt, SMS confirmation, limit user count to 1
  - Route-guard middleware for admin pages
  </details>

<details>
<summary>Phase 11: Infra & Deployment</summary>

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
<summary>Phase 12: Postponed Tasks</summary>

- **Document Docker Compose usage**: note `-f docker-compose.dev.yaml` and `-f docker-compose.prod.yaml` for respective environments
- Add how to run in prod into README.md
- Add how to deploy into README.md
- **Docker Live Reload --watch** Docker doesn't live reload FE. Fix it.
- **Transaction boundaries**: wrap multi‑step operations in `prisma.$transaction(…)`
</details>

<details>
<summary>Phase 13: Optional Extras</summary>

- Translated errors
- Headless CMS (Strapi/Ghost/Sanity) for blog
- WebSockets/SSE for real‑time admin notifications
- GraphQL gateway atop REST
- **Feature flags**: toggle new features via ENV or flags service
</details>
