/*
  Warnings:

  - Added the required column `password` to the `users` table with a default value for existing rows.

*/
-- AlterTable: Add password column with default for existing rows
ALTER TABLE "users" ADD COLUMN "password" TEXT NOT NULL DEFAULT '';
