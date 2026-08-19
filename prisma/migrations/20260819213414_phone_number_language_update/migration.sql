/*
  Warnings:

  - Added the required column `language` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
