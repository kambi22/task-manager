-- CreateTable
CREATE TABLE "task_history" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "task_title" TEXT NOT NULL,
    "user_id" TEXT,
    "user_name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
