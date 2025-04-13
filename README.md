## Architecture Flow

### For Visitors

Browser (GET /web-route)
↓
Route → Controller
↓
Service → Repository
↓
PostgreSQL
↓
Controller returns rendered HTML view

### For Admin Panel or API

Browser (POST /api-endpoint)
↓
API Route → Controller
↓
Service → Repository
↓
PostgreSQL
↓
Returns JSON response

## Project Structure

portfolio/
├── index.ts
├── views/ ← HTML pages rendered with a view engine (like EJS, Pug)
│ ├── home.ejs
│ ├── projects.ejs
│ └── blog.ejs
├── public/ ← Static assets (CSS, images, JS)
├── routes/
│ ├── api/ ← JSON endpoints
│ │ └── project.routes.js
│ └── web/ ← HTML-rendered routes
│ └── page.routes.js
├── controllers/
│ ├── api/
│ │ └── project.controller.js
│ └── web/
│ └── page.controller.js
├── services/
│ └── project.service.js
├── repositories/
│ └── project.repository.js
├── middlewares/
│ └── auth.middleware.js
├── config/
│ └── db.js
├── prisma/
│ └── schema.prisma
└── package.json

## Example Use Case: Public Portfolio Page

You visit: GET /projects
This should render HTML, not return JSON.

Here's how it flows:
page.routes.js maps GET /projects → PageController.showProjects

PageController uses ProjectService.getPublishedProjects()

ProjectService gets data via ProjectRepository

It passes the list to a view like res.render("projects", { projects })

## Split Routes: API vs Web
/api/projects → JSON endpoints (for admin panel)

/projects → Rendered pages (public portfolio)

## You might want:

Login for admin

Session-based auth middleware for CMS

Flash messages (for success/error after posting)

## Why This Hybrid Architecture Works Well

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
