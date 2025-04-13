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

- .gitignore
- package-lock.json
- tsconfig.json
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
