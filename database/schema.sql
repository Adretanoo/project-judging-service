-- ============================================================
--  Automated Project Judging Service — Database Schema (Auth Edition)
-- ============================================================

-- Drop tables in reverse-dependency order for easy re-runs
DROP TABLE IF EXISTS judge_conflicts;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS criteria;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS judges;
DROP TABLE IF EXISTS users;

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL CHECK (role IN ('author', 'judge', 'admin')),
    created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Judges ──────────────────────────────────────────────────────────────────
-- Links a judge persona back to a user
CREATE TABLE judges (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    team_name   VARCHAR(255) NOT NULL,
    author_id   INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Criteria ─────────────────────────────────────────────────────────────────
CREATE TABLE criteria (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(255)   NOT NULL,
    weight    DECIMAL(5, 2)  NOT NULL CHECK (weight > 0),
    max_score INT            NOT NULL CHECK (max_score > 0)
);

-- ─── Scores ───────────────────────────────────────────────────────────────────
CREATE TABLE scores (
    id          SERIAL PRIMARY KEY,
    judge_id    INT           NOT NULL REFERENCES judges(id)   ON DELETE CASCADE,
    project_id  INT           NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    criteria_id INT           NOT NULL REFERENCES criteria(id) ON DELETE CASCADE,
    score_value DECIMAL(7, 2) NOT NULL,
    comment     TEXT,
    UNIQUE (judge_id, project_id, criteria_id)
);

-- ─── Judge Conflicts ─────────────────────────────────────────────────────────
CREATE TABLE judge_conflicts (
    id         SERIAL PRIMARY KEY,
    judge_id   INT  NOT NULL REFERENCES judges(id)   ON DELETE CASCADE,
    project_id INT  NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reason     TEXT,
    UNIQUE (judge_id, project_id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_users_email         ON users(email);
CREATE INDEX idx_projects_author_id  ON projects(author_id);
CREATE INDEX idx_scores_project_id   ON scores(project_id);
CREATE INDEX idx_scores_judge_id     ON scores(judge_id);
CREATE INDEX idx_conflicts_judge     ON judge_conflicts(judge_id);
CREATE INDEX idx_conflicts_project   ON judge_conflicts(project_id);
