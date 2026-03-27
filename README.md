# Automated Project Judging Service

A production-ready REST API built with **Fastify** and **PostgreSQL** that allows judges to evaluate projects using weighted criteria and automatically calculates a ranked leaderboard.

---

## Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Runtime      | Node.js ≥ 18                       |
| Framework    | Fastify 4                          |
| Database     | PostgreSQL                         |
| Docs         | Swagger UI (`@fastify/swagger-ui`) |
| Config       | dotenv                             |

---

## Project Structure

```
project-judging-service/
├── database/
│   └── schema.sql              # PostgreSQL DDL — run once to initialize DB
├── src/
│   ├── server.js               # Entry point — boots Fastify
│   ├── app.js                  # App factory — registers plugins & routes
│   ├── config/
│   │   └── db.js               # Singleton pg connection pool
│   ├── plugins/
│   │   └── swagger.js          # OpenAPI spec + Swagger UI on /docs
│   └── modules/
│       ├── judges/             # judge.{routes,controller,service,repository}.js
│       ├── projects/           # project.{routes,controller,service,repository}.js
│       ├── criteria/           # criteria.{routes,controller,service,repository}.js
│       ├── scores/             # score.{routes,controller,service,repository}.js
│       └── leaderboard/        # leaderboard.{routes,controller,service}.js
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd project-judging-service
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Initialize the database

Connect to your PostgreSQL instance and run the schema:

```bash
psql -U postgres -d judging_db -f database/schema.sql
```

Or create the database first:

```bash
psql -U postgres -c "CREATE DATABASE judging_db;"
psql -U postgres -d judging_db -f database/schema.sql
```

### 4. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000`.

---

## API Documentation

Interactive Swagger UI: **http://localhost:3000/docs**

---

## API Endpoints

### Judges

| Method | Path           | Description          |
|--------|----------------|----------------------|
| POST   | `/judges`      | Create a new judge   |
| GET    | `/judges`      | List all judges      |
| GET    | `/judges/:id`  | Get a judge by ID    |

**Example — create a judge:**
```json
POST /judges
{
  "full_name": "Jane Doe",
  "email": "jane@example.com"
}
```

---

### Projects

| Method | Path             | Description           |
|--------|------------------|-----------------------|
| POST   | `/projects`      | Create a new project  |
| GET    | `/projects`      | List all projects     |
| GET    | `/projects/:id`  | Get a project by ID   |

**Example — create a project:**
```json
POST /projects
{
  "title": "EcoDrive",
  "description": "Gamifies eco-friendly driving.",
  "team_name": "Green Wheels"
}
```

---

### Criteria

| Method | Path         | Description               |
|--------|--------------|---------------------------|
| POST   | `/criteria`  | Create an evaluation criterion |
| GET    | `/criteria`  | List all criteria         |

**Example — create a criterion:**
```json
POST /criteria
{
  "name": "Innovation",
  "weight": 0.4,
  "max_score": 10
}
```

---

### Scores

| Method | Path                    | Description                        |
|--------|-------------------------|------------------------------------|
| POST   | `/scores`               | Submit a score                     |
| GET    | `/scores/project/:id`   | Get all scores for a project       |

**Example — submit a score:**
```json
POST /scores
{
  "judge_id": 1,
  "project_id": 2,
  "criteria_id": 1,
  "score_value": 8.5,
  "comment": "Very creative approach."
}
```

> A judge can score each (project, criterion) pair only once. Duplicate submissions return **409 Conflict**.

---

### Leaderboard

| Method | Path           | Description                     |
|--------|----------------|---------------------------------|
| GET    | `/leaderboard` | Ranked projects by final score  |

**Formula:**
```
final_score = SUM(score_value × weight)
```

**Example response:**
```json
[
  { "rank": 1, "project_id": 2, "title": "EcoDrive", "team_name": "Green Wheels", "final_score": 7.65 },
  { "rank": 2, "project_id": 1, "title": "SmartCity", "team_name": "Urbanists", "final_score": 6.20 }
]
```

---

## Validation

All request bodies are validated by Fastify's built-in JSON Schema validator. Invalid payloads receive a `400 Bad Request` with a descriptive message.

---

## Environment Variables

| Variable        | Default        | Description                  |
|-----------------|----------------|------------------------------|
| `HOST`          | `0.0.0.0`      | Server bind address          |
| `PORT`          | `3000`         | Server port                  |
| `DB_HOST`       | `localhost`    | PostgreSQL host              |
| `DB_PORT`       | `5432`         | PostgreSQL port              |
| `DB_NAME`       | `judging_db`   | Database name                |
| `DB_USER`       | `postgres`     | Database user                |
| `DB_PASSWORD`   | *(empty)*      | Database password            |
| `SWAGGER_ENABLED` | `true`       | Enable Swagger UI            |
