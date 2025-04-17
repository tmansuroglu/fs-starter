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

- For Visitors
  - Browser (GET /web-route)
  - ↓
  - Route → Controller
  - ↓
  - Service → Repository
  - ↓
  - PostgreSQL
  - ↓
  - Controller returns rendered HTML view
- For Admin Panel or API
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

## Example Use Case: Public Portfolio Page

- You visit: GET /projects
  - This should render HTML, not return JSON.
  - Here's how it flows:
  - page.routes.js maps GET /projects → PageController.showProjects
  - PageController uses ProjectService.getPublishedProjects()
  - ProjectService gets data via ProjectRepository
  - It passes the list to a view like res.render("projects", { projects })

## Split Routes: API vs Web

- /api/projects → JSON endpoints (for admin panel)
- /projects → Rendered pages (public portfolio)

## Why This Hybrid Architecture Works Well

- Familiar to frontend devs
- Views allow SEO & customization
- Can still expose REST API
- Clean separation (web vs api)
- Same service layer for both
- Feels like React + routing
- Ideal for portfolio
- Decoupled future frontend possible
- Easier testing, debugging, scaling
- DRY: one logic source for both HTML & API

# TODO

- test library
- aliases
- zod
- docker
- kubernetes
- react ?,
- pipeline setup
- add csrf protection
- add rate limiting for safety
- add validation
- HTTPS Only in Production
- Set Security Headers

# Steps

- Build Login page

  - add validation to FE and BE
  - Create schema with prisma
  - use jwt and bcrypt
  - Create login and validation with SMS confirmation.
  - Make sure user count is limited to 1
  - Make sure api and web endpoints are safe
  - Add route guard middleware for admin page
  - Redis
    - Storing session IDs (for login state)
    - Blacklisting JWT tokens (for logout)
  - NGINX
  - pgAdmin
  - container and db health check
  - db backups
  - update readme file structure
  - test prod docker flow and environment variables
