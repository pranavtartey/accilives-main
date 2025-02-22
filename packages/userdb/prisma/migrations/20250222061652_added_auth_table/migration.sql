/*
  Warnings:

  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp",
ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "otp" TEXT DEFAULT '',
    "userid" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_phoneNumber_key" ON "Auth"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userid_key" ON "Auth"("userid");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
