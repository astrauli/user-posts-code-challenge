-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hash" TEXT,
ADD COLUMN     "salt" TEXT,
ALTER COLUMN "full_name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL;
