CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "userId" int,
  "title" text,
  "body" text
);

CREATE TABLE "albums" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "title" text
);

CREATE TABLE "todos" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "title" text,
  "completed" text
);
