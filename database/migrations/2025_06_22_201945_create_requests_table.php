<?php
// database/migrations/xxxx_create_requests_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['document', 'appointment', 'medical', 'technical', 'billing', 'general']);
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->string('subject');
            $table->text('description');
            $table->enum('status', ['submitted', 'reviewed', 'in_progress', 'completed', 'cancelled'])->default('submitted');
            $table->json('contact_preference');
            $table->string('phone')->nullable();
            $table->enum('preferred_contact_time', ['morning', 'afternoon', 'evening'])->nullable();
            $table->json('attachments')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('estimated_completion')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['user_id', 'status']);
            $table->index(['type', 'priority']);
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('requests');
    }
};