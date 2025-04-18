# How to run the app in Development mode

- Step 1: Create and configure .env.dev
  - cp .env.example .env.dev
  - fill .env.dev
- If you need docker
  - Make sure docker is open in the background
  - npm run dev:docker
- If you don't need docker
  - npm run dev

## Useful commands

- docker-compose --env-file .env.dev -f docker-compose.dev.yaml down -v # Stop and remove containers, volumes
- docker image prune -af # Remove all unused images
- docker volume prune -f # Clean up unused volumes

## Architecture Flow

- For WEB
  - Browser (GET /web-route)
  - ↓
  - Route → Controller
  - ↓
  - Service → Repository
  - ↓
  - PostgreSQL
  - ↓
  - Controller returns rendered HTML view
- For API
  - Browser (POST /api-endpoint)
  - ↓
  - API Route → Controller
  - ↓
  - Service → Repository
  - ↓
  - PostgreSQL
  - ↓
  - Returns JSON response

## Project Structure

- .husky/
- prisma/
- .env
- .gitignore
- .prettierrc
- commitlint.config.js
- docker-compose.yaml
- Dockerfile
- eslint.config.mjs
- tsconfig.json
- package-lock.json
- package.json
- src/
  - index.ts
  - views/ (HTML pages rendered with a view engine)
    - home.ejs
    - projects.ejs
    - blog.ejs
  - public/ (Static assets like CSS, images, TS)
  - routes/
    - api/ (JSON endpoints)
      - project.routes.ts
    - web/ (HTML-rendered routes)
      - page.routes.ts
  - controllers/
    - api/
      - project.controller.ts
    - web/
      - page.controller.ts
  - services/
    - project.service.ts
  - repositories/
    - project.repository.ts
  - middlewares/
    - auth.middleware.ts
  - config/
    - db.ts
  - prisma/
    - schema.prisma
    - generated/

# 🎉 Achievements So Far

1.  **Public GitHub repo**  
    – ✅ Comprehensive `README.md` with run/build instructions, `.env.example`, visible TODO/Roadmap.
2.  **TypeScript + Node.js + Express**  
    – ES‑module setup, `tsconfig.json`, dev/build/npm scripts (`dev`, `build`, `start`, `dev:docker`).
3.  **Clean, Layered Architecture**  
    – `/src/routes → controllers → services → repositories → Prisma client`  
    – Shared **utils** (`asyncHandler`, custom errors), centralized **config** loader.
4.  **Prisma ORM**  
    – Type‑safe models, migrations, singleton client.
5.  **Hybrid Web + API**  
    – EJS‑templated pages, plus `/api` JSON endpoints.
6.  **Modular Routing**  
    – Distinct `web` vs `api` routers; plug‑and‑play controllers.
7.  **Security Foundations**  
    – Helmet for headers (custom CSP on `/`), global error handler, production‑only rate limiter.
8.  **DevOps‑Ready**  
    – Docker‑first: dev/prod `Dockerfile`s + Compose files (`docker-compose.dev.yaml`, `docker-compose.prod.yaml`), `dev:docker` script.
9.  **Environment Safety**  
    – dotenv (`.env.dev`, `.env.prod`, `.env.example`).
10. **Linting & Formatting**  
    – ESLint + Prettier, Husky pre‑commit hook (format & lint).

11. **Static Assets & Lifecycle**  
    – `express.static` support, well‑defined npm lifecycle scripts.

---

# 🚀 Roadmap

### Phase 1: Docs & Cleanup

- Sync **README** → code (all existing routes, remove “projects”/“blog” stubs)
- Orphaned views: implement or delete `projects.ejs`/`blog.ejs`
- Add ASCII/folder diagram of `/src/{routes,controllers,services,repositories,utils,config,views}`
- **Document Docker Compose usage**: note `-f docker-compose.dev.yaml` and `-f docker-compose.prod.yaml` for respective environments
- **Factor EJS layout partials**: extract shared header/footer into partials

### Phase 2: Developer DX & Code Quality

- **Path Aliases** (`@controllers/*`, `@services/*`, etc.) → refactor deep imports
- ESLint/Prettier lockdown on `.ts`, `.ejs`, `.json` via Husky
- Commit‑lint + Husky hook (Conventional Commits)
- **Install & configure lint‑staged** for faster, scoped pre‑commit checks

### Phase 3: Validation, Auth & Error Handling

- Request schemas (Zod or Joi) for auth, user, future CRUD
- Centralize HTTP error classes → map in global handler
- 404 & 5xx EJS error pages
- **Login flow**

  - FE + BE validation; Prisma schema for user/login
  - JWT + bcrypt, SMS confirmation, limit user count to 1
  - Route-guard middleware for admin pages

### Phase 4: Security Hardening

- CSRF (`csurf`) on all web forms; inject tokens in EJS
- CORS lock‑down to known origins
- HTTPS‑only enforcement in production
- Secure cookies/sessions (`secure`, `httpOnly`, `sameSite`)

### Phase 5: Observability & Monitoring

- **Basic logging** (Morgan in dev) & `/healthz` health‑check
- Structured logging (Pino for JSON output, log levels)
- `/metrics` endpoint for Prometheus
- Sentry integration + alerting (Slack/webhook)

### Phase 6: Testing & CI/CD

- **Unit tests** (Jest) for services & repositories (mocking Prisma)
- **Integration tests** (Supertest) on web & API routes
- Code‑coverage threshold enforcement
- **GitHub Actions**: on PR → lint/build/test/coverage; on merge → build & push Docker images
- Semantic Release (CHANGELOG, version bump, GitHub Release)

### Phase 7: API Docs & Versioning

- OpenAPI/Swagger spec (`/docs/openapi.yaml`) + Swagger UI at `/docs`
- Postman collection in repo
- **API versioning strategy**: mount routes under `/api/v1`, update docs accordingly

### Phase 8: Performance & Caching

- Static‑asset CDN + cache headers
- Template caching (in‑memory or Redis)
- DB query optimization & indexing
- Response compression middleware

### Phase 9: Front‑End Rebuild

- React/Next.js front‑end consuming your API
- Netlify/Vercel (or S3/CloudFront) CI/CD
- Theming, WCAG accessibility, responsive design

### Phase 10: Infra & Deployment

- Multi‑stage Docker builds for minimal images

- **NGINX**: reverse‑proxy configuration & SSL termination
- **pgAdmin**: containerized database management
- **Container & DB health checks**: ensure app and database readiness & liveness
- **Database backups**: scheduled dumps & point‑in‑time recovery
- Kubernetes + Helm charts (Deployment, Service, Ingress)
- Terraform (DB, cache, LB)
- Blue/Green or canary deploy strategy

### Phase 11: Optional Extras

- Headless CMS (Strapi/Ghost/Sanity) for blog
- WebSockets/SSE for real‑time admin notifications
- GraphQL gateway atop REST
