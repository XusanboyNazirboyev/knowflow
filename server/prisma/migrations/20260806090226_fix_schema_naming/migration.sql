/*
  Warnings:

  - You are about to drop the column `fielSize` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_member` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileSize` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Made the column `conversationId` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_workspaceId_fkey";

-- DropIndex
DROP INDEX "document_chunks_embedding_idx";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "fielSize",
ADD COLUMN     "fileSize" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "conversationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "workspace_member";

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_userId_workspaceId_key" ON "workspace_members"("userId", "workspaceId");

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
