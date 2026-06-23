<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * WHY THIS EXISTS:
     *
     * The original migration (2026_06_20_000001) tried to enforce uniqueness with:
     *   unique(['user_id', 'appointment_id'])       -- for professional reviews
     *   unique(['user_id', 'order_id'])             -- for product/store reviews
     *
     * And migration 2026_06_20_000003 upgraded the order one to:
     *   unique(['user_id', 'order_id', 'review_type'])
     *
     * BUT both appointment_id and order_id are NULLABLE columns.
     * In PostgreSQL, NULL != NULL, so a standard unique index treats every NULL
     * as distinct — meaning a user can submit 100 reviews with appointment_id = NULL
     * and the unique constraint never fires.
     *
     * FIX: Replace both standard unique indexes with PostgreSQL partial indexes
     * using WHERE column IS NOT NULL. This enforces uniqueness only for real values,
     * and ignores NULLs entirely (which is the correct behaviour).
     */
    public function up(): void
    {
        // ── Step 1: Drop the broken standard unique indexes ─────────────────
        // These exist from previous migrations but don't work with NULLs in PostgreSQL.

        DB::statement("
            DROP INDEX IF EXISTS reviews_user_appt_type_unique
        ");

        DB::statement("
            DROP INDEX IF EXISTS reviews_user_order_type_unique
        ");

        // Also drop the standard unique index on order_id from migration _000003
        // (it may exist as a standard index if _000003 ran before this fix)
        DB::statement("
            DROP INDEX IF EXISTS reviews_user_order_unique
        ");

        // ── Step 2: Create correct partial indexes ───────────────────────────
        // These only apply when the column IS NOT NULL, which is exactly what we want.

        // One professional review per appointment (appointment_id must be set)
        DB::statement("
            CREATE UNIQUE INDEX reviews_user_appt_type_unique
            ON reviews (user_id, appointment_id, review_type)
            WHERE appointment_id IS NOT NULL
        ");

        // One product/store review per order (order_id must be set)
        DB::statement("
            CREATE UNIQUE INDEX reviews_user_order_type_unique
            ON reviews (user_id, order_id, review_type)
            WHERE order_id IS NOT NULL
        ");
    }

    public function down(): void
    {
        // Drop the partial indexes
        DB::statement("DROP INDEX IF EXISTS reviews_user_appt_type_unique");
        DB::statement("DROP INDEX IF EXISTS reviews_user_order_type_unique");

        // Restore the old (broken) standard unique indexes so rollback is clean
        DB::statement("
            CREATE UNIQUE INDEX reviews_user_appt_type_unique
            ON reviews (user_id, appointment_id, review_type)
        ");

        DB::statement("
            CREATE UNIQUE INDEX reviews_user_order_type_unique
            ON reviews (user_id, order_id, review_type)
        ");
    }
};