# AI Copilot Instructions - DevSquad Group Portfolio

## Project Overview
This is a full-stack portfolio website for DevSquad (8 CS students). It showcases DSA projects (Queue/Deque, Binary Tree).

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Backend: Flask + SQLAlchemy + SQLite
- Architecture: RESTful API with CORS enabled, separate frontend/backend processes

---

## Critical Setup & Workflow

### Backend Startup
```bash
cd portfolio-backend
pip install -r requirements.txt
python run.py
```
Runs on `http://localhost:5000`. Creates SQLite DB at `instance/portfolio.db`.

### Frontend Startup
```bash
cd portfolio-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Uses Vite's dev server.

### Database Migrations
```bash
cd portfolio-backend
flask db upgrade  # Apply pending migrations
flask db migrate -m "description"  # Create new migration
```

---

## Architecture & Key Integration Points

### API Communication Pattern
- **Base URL:** `http://localhost:5000/api`
- **Frontend Client:** `portfolio-frontend/src/services/api.tsx` (axios with `Content-Type: application/json`)
- **CORS:** Backend configured to accept requests from `localhost:5173` and `localhost:8080`
- **Routes Prefix:** All blueprints registered with `/api` prefix
  - Main routes: `/api/*`
  - Binary tree: `/api/binary-tree/*`

### Database Layer
- **Models:** `portfolio-backend/app/models.py` (Project, QueueOperation, DequeOperation)
- **Binary Tree Models:** `portfolio-backend/app/binary_tree/models.py` (BinaryTreeOperation with JSON tree_data)
- **Critical Pattern:** Binary tree uses `db.JSON` for tree structure storage. Deep copy required before mutations to trigger SQLAlchemy's change detection (see `copy.deepcopy()` in routes.py).

### Route Implementation Pattern
Backend routes in `routes.py` have INCOMPLETE handlers (missing returns/implementations). When completing:
1. Validate input with explicit error messages
2. Use `get_or_create()` helper to manage single DB instances
3. Return `jsonify()` responses with appropriate HTTP status codes
4. Incomplete routes: `delete_project()`, `update_project()`, queue/deque operations

---

## Project-Specific Conventions

### Frontend Pages & Components
- **Pages:** `src/pages/` (Home, About, Works, BinaryTree, etc.)
- **Tree UI:** `src/components/binary-tree/` (ControlPanel, TreeVisualization, PostOrderDisplay)
- **UI Library:** shadcn/ui components in `src/components/ui/` (pre-built, use for consistency)
- **Data:** `src/data/projects.json` & `team.json` (static data source)

### Image Path Convention
**Public assets are served at root, NOT `/public/` prefix:**
- ✅ Correct: `/projects/queue.png`, `/background/about-page.png`
- ❌ Wrong: `/public/projects/queue.png`
- Files located in `public-frontend/public/` directory

### Binary Tree Implementation
- Tree stored as nested JSON object with structure: `{id, value, left: {...}, right: {...}}`
- Key utilities in `portfolio-backend/app/binary_tree/utils.py`:
  - `find_node_by_value()` / `find_node_by_id()` - traversal helpers
  - `compute_postorder()` - post-order traversal
  - `remove_node_by_id()` - deletion helper
- **Critical:** Must use `copy.deepcopy(tree)` before mutations, then reassign: `bt.tree_data = tree_copy`

---

## Common Failure Points & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError: No module named 'flask_sqlalchemy'` | Missing dependencies | Run `pip install -r requirements.txt` |
| Frontend can't reach backend | Backend not running or CORS misconfigured | Verify `http://localhost:5000/api/` responds; check `app/__init__.py` CORS config |
| Image 404 errors | Using `/public/` prefix in image paths | Remove `/public/` - images served at root |
| Binary tree mutations not persisting | SQLAlchemy not detecting JSON changes | Use `copy.deepcopy()` before mutations, use `db.session.merge()` after |
| Incomplete route handlers cause errors | Routes return `None` instead of response | All route handlers must return `jsonify(...)` |

---

## File Structure Reference
- Backend routes: `portfolio-backend/app/routes.py` & `portfolio-backend/app/binary_tree/routes.py`
- Frontend API client: `portfolio-frontend/src/services/api.tsx`
- Entry points: `portfolio-backend/run.py` (Flask), `portfolio-frontend/src/main.tsx` (React)
- Database config: `portfolio-backend/config.py` (uses SQLite by default)
