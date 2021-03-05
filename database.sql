CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "userId" int UNIQUE,
  "title" text NOT NULL,
  "body" text NOT NULL
);

CREATE TABLE "albums" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int UNIQUE,
  "title" text NOT NULL
);

CREATE TABLE "todos" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int UNIQUE,
  "title" text NOT NULL,
  "completed" text NOT NULL
);
