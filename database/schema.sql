-- ============================================================
--  Automated Project Judging Service — Database Schema
-- ============================================================

-- Drop tables in reverse-dependency order for easy re-runs
DROP TABLE IF EXISTS judge_conflicts;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS criteria;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS judges;

-- ─── Judges ──────────────────────────────────────────────────────────────────
CREATE TABLE judges (
    id         SERIAL PRIMARY KEY,
    full_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    team_name   VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Criteria ─────────────────────────────────────────────────────────────────
-- weight: decimal multiplier (e.g. 0.3 = 30 %)
-- max_score: upper bound for score_value in the scores table
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
    -- A judge can score the same project+criteria pair only once
    UNIQUE (judge_id, project_id, criteria_id)
);

-- ─── Judge Conflicts ─────────────────────────────────────────────────────────
-- Records cases where a judge has declared a conflict of interest for a project
CREATE TABLE judge_conflicts (
    id         SERIAL PRIMARY KEY,
    judge_id   INT  NOT NULL REFERENCES judges(id)   ON DELETE CASCADE,
    project_id INT  NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reason     TEXT,
    UNIQUE (judge_id, project_id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_scores_project_id  ON scores(project_id);
CREATE INDEX idx_scores_judge_id    ON scores(judge_id);
CREATE INDEX idx_conflicts_judge    ON judge_conflicts(judge_id);
CREATE INDEX idx_conflicts_project  ON judge_conflicts(project_id);
