<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@localhub.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@localhub.com',
                'password' => Hash::make('admin123'), // Change this password!
                'user_type' => 'admin',
                'phone' => '0000000000',
                'aadhaar' => '000000000000', // ✅ Add aadhaar (12 zeros)
                'city' => 'Admin City',
            ]
        );

        echo "✅ Admin created: admin@localhub.com / admin123\n";
    }
}