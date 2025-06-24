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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('service_type'); // 'consultation', 'home_visit', 'follow_up', 'assessment'
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('appointment_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('status')->default('scheduled'); // 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
            $table->string('priority')->default('medium'); // 'low', 'medium', 'high', 'urgent'
            $table->text('address')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('special_requirements')->nullable(); // wheelchair access, oxygen, etc.
            $table->text('notes')->nullable(); // client notes
            $table->text('admin_notes')->nullable(); // admin/staff notes
            $table->string('assigned_staff')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->text('cancellation_notes')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['user_id', 'appointment_date']);
            $table->index(['appointment_date', 'start_time']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};