-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "eventID" TEXT NOT NULL,
    "candidateID" TEXT NOT NULL,
    "createdAtEpoch" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);
