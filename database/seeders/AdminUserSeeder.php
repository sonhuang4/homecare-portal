<?php
// Create this file: database/seeders/AdminUserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@nwbhomecare.com',
            'password' => Hash::make('admin123'), // Change this password!
            'phone' => '+1-555-0123',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);


        echo "✅ Admin user created: admin@nwbhomecare.com / admin123\n";
        echo "✅ Sample client users created\n";
    }
}