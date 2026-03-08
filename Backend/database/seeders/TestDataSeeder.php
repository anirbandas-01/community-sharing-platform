<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Community;
use App\Models\ProfessionalProfile;
use App\Models\Service;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@localhub.com',
            'password' => bcrypt('admin123'),
            'user_type' => 'admin',
            'phone' => '1234567890',
            'aadhaar' => '111111111111',
            'city' => 'Mumbai',
        ]);

        // Create resident user
        $resident = User::create([
            'name' => 'John Doe',
            'email' => 'resident@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'resident',
            'phone' => '9876543211',
            'aadhaar' => '222222222222',
            'city' => 'Mumbai',
        ]);

        // Create professional users
        $professionals = [
            [
                'name' => 'Rajesh Kumar',
                'email' => 'rajesh@test.com',
                'specialization' => 'Plumber',
                'bio' => 'Experienced plumber with 8+ years',
                'services' => [
                    ['name' => 'Plumbing Repair', 'price' => 500],
                    ['name' => 'Pipe Installation', 'price' => 800],
                ]
            ],
            [
                'name' => 'Sarah Wilson',
                'email' => 'sarah@test.com',
                'specialization' => 'Electrician',
                'bio' => 'Licensed electrician',
                'services' => [
                    ['name' => 'Electrical Repair', 'price' => 600],
                ]
            ],
        ];

        foreach ($professionals as $proData) {
            $pro = User::create([
                'name' => $proData['name'],
                'email' => $proData['email'],
                'password' => bcrypt('password'),
                'user_type' => 'professional',
                'phone' => '98765432' . rand(10, 99),
                'aadhaar' => rand(100000000000, 999999999999),
                'city' => 'Mumbai',
            ]);

            ProfessionalProfile::create([
                'user_id' => $pro->id,
                'bio' => $proData['bio'],
                'specialization' => $proData['specialization'],
                'experience_years' => rand(3, 10),
                'hourly_rate' => 500,
            ]);

            foreach ($proData['services'] as $service) {
                Service::create([
                    'professional_id' => $pro->id,
                    'name' => $service['name'],
                    'description' => 'Professional service',
                    'price' => $service['price'],
                    'duration' => 2,
                    'is_active' => true,
                ]);
            }
        }

        // Create communities
        $communities = [
            [
                'name' => 'Sunrise Apartments',
                'description' => 'Residential community in Andheri',
                'category' => 'local',
            ],
            [
                'name' => 'Tech Entrepreneurs Mumbai',
                'description' => 'Community for tech entrepreneurs',
                'category' => 'business',
            ],
            [
                'name' => 'Fitness Enthusiasts',
                'description' => 'Health and fitness community',
                'category' => 'general',
            ],
        ];

        foreach ($communities as $commData) {
            Community::create([
                'name' => $commData['name'],
                'description' => $commData['description'],
                'category' => $commData['category'],
                'status' => 'active',
                'visibility' => 'public',
                'created_by' => $admin->id,
                'member_count' => rand(10, 100),
            ]);
        }

        echo "✅ Test data created successfully!\n";
        echo "Admin: admin@localhub.com / admin123\n";
        echo "Resident: resident@test.com / password\n";
        echo "Professional: rajesh@test.com / password\n";
    }
}