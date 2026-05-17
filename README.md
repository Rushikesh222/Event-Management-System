# EVENT-MANAGEMENT-SYSTEM

## Overview

This repository is a Node.js backend API for event management, ticket booking, and user authentication. It uses Express, MongoDB with Mongoose, JWT-based authentication, role-based access control, and a lightweight background job queue.

## Architecture & Design Decisions

- **Modular structure**: Code is organized into clearly separated layers.
  - `src/api` contains the Express app and middleware registration.
  - `src/config` handles database connection.
  - `src/controllers` contains business logic for auth, events, and bookings.
  - `src/routes` defines API endpoints and applies auth/authorization middleware.
  - `src/models` defines Mongoose schemas and validation.
  - `src/middlewares` implements token validation and role enforcement.
  - `src/jobs` contains the background queue and async task simulation.

- **Authentication**:
  - JWT tokens are issued at login/register and stored in cookies.
  - The middleware supports both cookie-based and bearer-token authorization.
  - Passwords are hashed with `bcryptjs` and excluded from query results by default.

- **Role-based access control**:
  - `organizer` users may create and update events.
  - `customer` users may book tickets.
  - Routes enforce roles using `authMiddleware` and `userRoles`.

- **Data modelling**:
  - `User` model includes email, password, name, and role.
  - `Event` model stores title, description, date, ticket counts, and organizer relation.
  - `Booking` model stores user booking information and references the related event.

- **Background processing**:
  - A custom in-memory `AdvancedQueue` handles asynchronous jobs with retry support.
  - Booking confirmation and event update notification jobs are enqueued without blocking request response.
  - This keeps the API responsive while demonstrating background task handling.

- **Reliability & validation**:
  - Event ticket booking validates availability before saving.
  - User registration checks duplicate emails.
  - Requests return clear HTTP status codes and error messages.

## Dependencies

- `express` for the HTTP API
- `mongoose` for MongoDB object modeling
- `dotenv` for configuration
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT auth
- `cookie-parser` for cookie support
- `cors` for cross-origin requests
- `nodemon` for development reloads
- `bullmq` and `ioredis` are installed but the current queue implementation uses an in-memory job queue; they can be used later for a Redis-backed queue.

## Environment Variables

Create a `.env` file in the project root with at least:

```env
DB_URL=mongodb://your-mongo-url
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

## Running the App

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default.

## API Endpoints

### Auth
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — log in and receive a JWT token

### Events
- `GET /api/events/` — get all events (authenticated)
- `POST /api/events/` — create a new event (organizer only)
- `PUT /api/events/event/:id` — update an event (organizer only)

### Booking
- `POST /api/booking/` — book tickets for an event (customer only)

## Key Files

- `server.js` — application bootstrap and database connection
- `src/api/index.js` — Express app setup and route mounting
- `src/config/db.js` — MongoDB connection logic
- `src/controllers/*` — request handlers and business logic
- `src/routes/*` — Express routers and endpoint definitions
- `src/middlewares/auth.middleware.js` — auth and authorization checks
- `src/jobs/queue.job.js` — in-memory background queue implementation
- `src/jobs/working.job.js` — simulated asynchronous jobs

## Notes

- The current background job queue is in-memory and suitable for development or lightweight workloads.
- For production-scale background processing, replace `src/jobs/queue.job.js` with a Redis-backed queue using `bullmq` and `ioredis`.
- The application assumes MongoDB is available at `DB_URL` and that JWT secrets are configured.
