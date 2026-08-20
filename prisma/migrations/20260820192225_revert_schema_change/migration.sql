/*
  Warnings:

  - You are about to drop the column `language` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "language",
DROP COLUMN "phoneNumber";
