-- CreateEnum
CREATE TYPE "LoginStrategy" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "login_strategy" "LoginStrategy" NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;
