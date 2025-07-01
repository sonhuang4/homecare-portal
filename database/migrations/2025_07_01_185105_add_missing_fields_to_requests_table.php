<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('property_address')->nullable()->after('description');
            $table->string('subscription_tier')->nullable()->after('property_address');
            $table->boolean('credit_usage')->default(false)->after('subscription_tier');
            $table->text('property_access_info')->nullable()->after('credit_usage');
        });
    }

    public function down()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn(['property_address', 'subscription_tier', 'credit_usage', 'property_access_info']);
        });
    }
};