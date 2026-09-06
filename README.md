# Repaint Visualizer — API (Node.js + Express + MongoDB)

Backend for the Smart Wall Paint Visualizer PRD. Implements the data model
described in the PRD's Data Requirements section (Users, Projects, Colors,
Patterns) and the auth/CRUD needed to support an Angular frontend.

## What's included

```
backend/
  models/        Mongoose schemas: User, Project, Color, Pattern
  routes/        auth.js, colors.js, projects.js
  middleware/    JWT auth + admin-role guard
  uploads/       room photos land here (multer)
  server.js      Express app entrypoint
  .env.example   copy to .env and fill in
```

## Setup

1. Install [Node.js 18+](https://nodejs.org) and have a MongoDB instance
   available (local `mongod`, or a free cluster on MongoDB Atlas).
2. From this folder:
   ```bash
   npm install
   cp .env.example .env
   # edit .env: set MONGO_URI and a real JWT_SECRET
   npm run dev      # or: npm start
   ```
3. The API comes up on `http://localhost:5000` (or your `PORT`).
   Check it with `GET /api/health`.

## Endpoints

| Method | Path                | Auth        | Purpose                          |
|--------|---------------------|-------------|-----------------------------------|
| POST   | /api/auth/register   | —           | Create a user account            |
| POST   | /api/auth/login      | —           | Get a JWT                        |
| GET    | /api/colors          | —           | List paint colours (filter by `?category=`) |
| POST   | /api/colors          | admin       | Add a colour                     |
| PUT    | /api/colors/:id      | admin       | Edit a colour                    |
| DELETE | /api/colors/:id      | admin       | Remove a colour                  |
| POST   | /api/projects        | user        | Upload a room photo, start a project |
| GET    | /api/projects        | user        | List your saved projects         |
| GET    | /api/projects/:id    | user        | Get one project (with wall/colour detail) |
| PUT    | /api/projects/:id    | user        | Save wall selections / final render |
| DELETE | /api/projects/:id    | user        | Delete a project                 |

Send the JWT from login/register as `Authorization: Bearer <token>` on
protected routes. To make a user an admin, set their `role` field to
`"admin"` directly in MongoDB (or add a one-off admin-promotion script).

## Connecting the frontend

The `index.html` visualizer included alongside this backend is a
self-contained client-side demo (canvas-based wall selection and
recolouring) so it can be tried without standing up a server. To wire it to
this API for real persistence:

- Call `POST /api/projects` with the uploaded photo (multipart form,
  field name `photo`) once a user is signed in.
- Call `PUT /api/projects/:id` with the `wallSelections` array (polygon
  points, chosen colour ID, opacity, finish) whenever the user updates
  their design, and again with `finalPhotoUrl` when they export.
- Use `GET /api/colors` to populate the palette instead of the hard-coded
  list in the demo.

An Angular 15+ frontend (as specified in the PRD's technology section) would
consume these same endpoints via `HttpClient`, with an `AuthInterceptor`
attaching the JWT to each request.

## Notes

- Passwords are hashed with bcrypt; nothing is stored in plain text.
- Room photos are written to `uploads/` and served statically at
  `/uploads/<filename>` — for production, swap this for S3 or another
  object store and save the resulting URL on the `Project`.
- This is a Phase 1 scaffold matching the PRD's in-scope features (manual
  wall selection, colour application, save/download). AI wall detection,
  AR/VR preview, and payments are explicitly out of scope per the PRD.
