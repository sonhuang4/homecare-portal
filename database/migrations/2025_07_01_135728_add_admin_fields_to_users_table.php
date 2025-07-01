<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Only add columns that don't exist
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['client', 'admin'])->default('client')->after('phone');
            }
            
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('role');
            }
            
            if (!Schema::hasColumn('users', 'membership_tier')) {
                $table->string('membership_tier')->nullable()->after('is_active');
            }
            
            if (!Schema::hasColumn('users', 'credit_balance')) {
                $table->decimal('credit_balance', 10, 2)->default(0)->after('membership_tier');
            }
            
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('credit_balance');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns_to_drop = [];
            
            if (Schema::hasColumn('users', 'phone')) {
                $columns_to_drop[] = 'phone';
            }
            if (Schema::hasColumn('users', 'role')) {
                $columns_to_drop[] = 'role';
            }
            if (Schema::hasColumn('users', 'is_active')) {
                $columns_to_drop[] = 'is_active';
            }
            if (Schema::hasColumn('users', 'membership_tier')) {
                $columns_to_drop[] = 'membership_tier';
            }
            if (Schema::hasColumn('users', 'credit_balance')) {
                $columns_to_drop[] = 'credit_balance';
            }
            if (Schema::hasColumn('users', 'address')) {
                $columns_to_drop[] = 'address';
            }
            
            if (!empty($columns_to_drop)) {
                $table->dropColumn($columns_to_drop);
            }
        });
    }
};