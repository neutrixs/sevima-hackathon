-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "cookie" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_cookie_key" ON "Session"("cookie");
