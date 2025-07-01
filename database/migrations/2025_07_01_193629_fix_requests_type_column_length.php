<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('type', 100)->change(); // Increase from default to 100 chars
        });
    }

    public function down()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('type', 255)->change(); // Revert to default
        });
    }
};