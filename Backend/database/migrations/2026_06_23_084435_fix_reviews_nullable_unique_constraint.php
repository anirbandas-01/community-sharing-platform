<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // PostgreSQL created these as CONSTRAINTS (not plain indexes) in the previous
        // migration, so we must DROP CONSTRAINT, not DROP INDEX.

        DB::statement("
            ALTER TABLE reviews
            DROP CONSTRAINT IF EXISTS reviews_user_appt_type_unique
        ");

        DB::statement("
            ALTER TABLE reviews
            DROP CONSTRAINT IF EXISTS reviews_user_order_type_unique
        ");

        DB::statement("
            ALTER TABLE reviews
            DROP CONSTRAINT IF EXISTS reviews_user_order_unique
        ");

        // Also try dropping as plain indexes in case any exist that way
        DB::statement("DROP INDEX IF EXISTS reviews_user_appt_type_unique");
        DB::statement("DROP INDEX IF EXISTS reviews_user_order_type_unique");
        DB::statement("DROP INDEX IF EXISTS reviews_user_order_unique");

        // Create correct partial indexes — only enforce uniqueness when column IS NOT NULL.
        // Standard unique indexes don't work with nullable columns in PostgreSQL
        // because NULL != NULL, allowing unlimited duplicate NULLs.

        DB::statement("
            CREATE UNIQUE INDEX reviews_user_appt_type_unique
            ON reviews (user_id, appointment_id, review_type)
            WHERE appointment_id IS NOT NULL
        ");

        DB::statement("
            CREATE UNIQUE INDEX reviews_user_order_type_unique
            ON reviews (user_id, order_id, review_type)
            WHERE order_id IS NOT NULL
        ");
    }

    public function down(): void
    {
        DB::statement("DROP INDEX IF EXISTS reviews_user_appt_type_unique");
        DB::statement("DROP INDEX IF EXISTS reviews_user_order_type_unique");

        // Restore old (broken) constraints so rollback is clean
        DB::statement("
            ALTER TABLE reviews
            ADD CONSTRAINT reviews_user_appt_type_unique
            UNIQUE (user_id, appointment_id, review_type)
        ");

        DB::statement("
            ALTER TABLE reviews
            ADD CONSTRAINT reviews_user_order_type_unique
            UNIQUE (user_id, order_id, review_type)
        ");
    }
};