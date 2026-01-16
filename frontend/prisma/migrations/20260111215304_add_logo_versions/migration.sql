-- CreateTable
CREATE TABLE "public"."LogoVersion" (
    "id" TEXT NOT NULL,
    "logoId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "editInstruction" TEXT,
    "maskUrl" TEXT,
    "seed" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogoVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LogoVersion_logoId_idx" ON "public"."LogoVersion"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "LogoVersion_logoId_versionNumber_key" ON "public"."LogoVersion"("logoId", "versionNumber");

-- AddForeignKey
ALTER TABLE "public"."LogoVersion" ADD CONSTRAINT "LogoVersion_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "public"."Logo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
