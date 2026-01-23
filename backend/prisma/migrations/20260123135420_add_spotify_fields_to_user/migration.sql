-- AlterTable
ALTER TABLE "users" ADD COLUMN     "spotify_access_token" TEXT,
ADD COLUMN     "spotify_id" TEXT,
ADD COLUMN     "spotify_refresh_token" TEXT,
ADD COLUMN     "spotify_token_expiry" TIMESTAMP(3);
