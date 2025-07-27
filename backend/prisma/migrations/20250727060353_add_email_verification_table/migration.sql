-- CreateTable
CREATE TABLE "email_verification" (
    "email_verification_id" VARCHAR(50) NOT NULL,
    "token" VARCHAR(50) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("email_verification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_token_key" ON "email_verification"("token");

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
