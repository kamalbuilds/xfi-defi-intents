-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
