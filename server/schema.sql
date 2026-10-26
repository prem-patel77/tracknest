CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company     VARCHAR(150) NOT NULL,
    job_title   VARCHAR(150) NOT NULL,
    location    VARCHAR(150),
    salary      VARCHAR(50),
    status      VARCHAR(20) NOT NULL DEFAULT 'Saved'
                CHECK (status IN ('Saved','Applied','OA','Interview','Offer','Rejected')),
    deadline    DATE,
    job_url     TEXT,
    notes       TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);