-- CreateEnum
CREATE TYPE "IDType" AS ENUM ('NIK', 'KTA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "idType" "IDType" NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
