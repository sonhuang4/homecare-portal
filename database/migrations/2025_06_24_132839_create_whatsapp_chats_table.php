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
        Schema::create('whatsapp_chats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('phone_number');
            $table->string('whatsapp_message_id')->nullable();
            $table->text('message');
            $table->enum('direction', ['inbound', 'outbound']);
            $table->string('routed_to_team')->nullable(); // general, medical, billing, emergency
            $table->decimal('routing_confidence', 3, 2)->nullable(); // 0.00 to 1.00
            $table->enum('status', ['sent', 'delivered', 'read', 'failed'])->default('sent');
            $table->json('metadata')->nullable(); // Additional data like message type, attachments, etc.
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['user_id', 'created_at']);
            $table->index(['phone_number', 'created_at']);
            $table->index('routed_to_team');
            $table->index('direction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_chats');
    }
};