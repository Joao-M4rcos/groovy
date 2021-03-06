CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "title" text,
  "body" text,
  "is_created" text
);

CREATE TABLE "albums" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "title" text,
  "is_created" text
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text,
  "album_id" text,
  "is_created" text
);

CREATE TABLE "todos" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "title" text,
  "completed" text,
  "is_created" text
);
