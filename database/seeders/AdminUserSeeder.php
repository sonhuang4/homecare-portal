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

        // Create Sample Client Users
        User::create([
            'name' => 'John Smith',
            'email' => 'john@example.com',
            'password' => Hash::make('client123'),
            'phone' => '+1-555-0124',
            'role' => 'client',
            'is_active' => true,
            'membership_tier' => 'Premium',
            'credit_balance' => 250.00,
            'address' => '123 Main St, Los Angeles, CA 90210',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Maria Garcia',
            'email' => 'maria@example.com',
            'password' => Hash::make('client123'),
            'phone' => '+1-555-0125',
            'role' => 'client',
            'is_active' => true,
            'membership_tier' => 'Standard',
            'credit_balance' => 150.00,
            'address' => '456 Oak Ave, Beverly Hills, CA 90212',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'David Wilson',
            'email' => 'david@example.com',
            'password' => Hash::make('client123'),
            'phone' => '+1-555-0126',
            'role' => 'client',
            'is_active' => true,
            'membership_tier' => 'Deluxe',
            'credit_balance' => 500.00,
            'address' => '789 Pine St, Malibu, CA 90265',
            'email_verified_at' => now(),
        ]);

        echo "✅ Admin user created: admin@nwbhomecare.com / admin123\n";
        echo "✅ Sample client users created\n";
    }
}