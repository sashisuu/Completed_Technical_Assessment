CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY,
  postId INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  body TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS comments_name_idx ON comments USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS comments_email_idx ON comments (email);
