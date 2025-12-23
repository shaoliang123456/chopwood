-- Projects
CREATE TABLE "Projects" (
  "id"          SERIAL       PRIMARY KEY,
  "title"       TEXT         NOT NULL,
  "slug"        TEXT         NOT NULL,
  "description" TEXT         NOT NULL,
  "image"       TEXT         NOT NULL,
  "link_demo"   TEXT,
  "link_github" TEXT,
  "stacks"      TEXT         NOT NULL,
  "is_show"     BOOLEAN      NOT NULL DEFAULT TRUE,
  "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "content"     TEXT,
  "is_featured" BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX "Projects_slug_key" ON "Projects"("slug");

-- ContentMeta
CREATE TABLE "ContentMeta" (
  "id"         SERIAL       PRIMARY KEY,
  "slug"       TEXT         NOT NULL,
  "type"       TEXT         NOT NULL,
  "views"      INTEGER      NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "ContentMeta_slug_key" ON "ContentMeta"("slug");

-- IntegrationToken
CREATE TABLE "IntegrationToken" (
  "id"           SERIAL       PRIMARY KEY,
  "provider"     TEXT         NOT NULL,
  "access_token" TEXT,
  "refresh_token" TEXT        NOT NULL,
  "expires_at"   TIMESTAMP(3),
  "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "IntegrationToken_provider_key"
  ON "IntegrationToken"("provider");
