-- Lattice Daily v1 schema draft

CREATE TABLE papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  authors JSONB,
  abstract TEXT,
  arxiv_url TEXT,
  published_date TEXT,
  summary JSONB,
  topics JSONB,
  score INTEGER,
  status TEXT DEFAULT 'unread'
);

CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  paper_id TEXT REFERENCES papers(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
