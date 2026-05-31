<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use App\Models\Community;
use App\Models\ProfessionalProfile;
use App\Models\Service;

class TestDataSeeder extends Seeder
{
    /**
     * Downloads a profile avatar from ui-avatars.com and stores it locally.
     * Returns the stored path (e.g. "avatars/admin.png") or null on failure.
     */
    private function downloadAvatar(string $name, string $filename, string $bgColor = '4F46E5'): ?string
    {
        try {
            $url = "https://ui-avatars.com/api/?name=" . urlencode($name)
                . "&size=256&background={$bgColor}&color=ffffff&bold=true&format=png";

            $response = Http::timeout(10)->get($url);

            if ($response->successful()) {
                $path = "avatars/{$filename}.png";
                Storage::disk('public')->put($path, $response->body());
                return $path;
            }
        } catch (\Exception $e) {
            // silently skip if no internet during seeding
        }

        return null;
    }

    public function run(): void
    {
        // Ensure avatars directory exists
        Storage::disk('public')->makeDirectory('avatars');

        // ─────────────────────────────────────────────
        // 1. ADMIN
        // ─────────────────────────────────────────────
        $adminAvatar = $this->downloadAvatar('Admin User', 'admin', '1E293B');

        $admin = User::create([
            'name'            => 'Admin User',
            'email'           => 'admin@localhub.com',
            'password'        => bcrypt('admin123'),
            'user_type'       => 'admin',
            'phone'           => '9000000001',
            'aadhaar'         => '111111111111',
            'city'            => 'Mumbai',
            'address'         => 'LocalHub HQ, Bandra West, Mumbai - 400050',
            /* 'bio'             => 'Platform administrator with full system access.', */
            'profile_image'   => $adminAvatar,
            /* 'is_verified'     => true, */
            'email_verified_at' => now(),
        ]);

        // ─────────────────────────────────────────────
        // 2. RESIDENTS
        // ─────────────────────────────────────────────
        $residents = [
            [
                'name'    => 'John Doe',
                'email'   => 'resident@test.com',
                'phone'   => '9000000002',
                'aadhaar' => '222222222222',
                'city'    => 'Mumbai',
                'address' => 'Flat 4B, Sunrise Apartments, Andheri East, Mumbai - 400069',
                /* 'bio'     => 'Long-time resident of Andheri, loves community events.', */
                'color'   => '0EA5E9',
                'slug'    => 'john_doe',
            ],
            [
                'name'    => 'Priya Sharma',
                'email'   => 'priya@test.com',
                'phone'   => '9000000003',
                'aadhaar' => '333333333333',
                'city'    => 'Pune',
                'address' => 'Plot 12, Koregaon Park, Pune - 411001',
                /* 'bio'     => 'Working professional, active in local fitness groups.', */
                'color'   => 'EC4899',
                'slug'    => 'priya_sharma',
            ],
        ];

        foreach ($residents as $data) {
            $avatar = $this->downloadAvatar($data['name'], $data['slug'], $data['color']);
            User::create([
                'name'              => $data['name'],
                'email'             => $data['email'],
                'password'          => bcrypt('password'),
                'user_type'         => 'resident',
                'phone'             => $data['phone'],
                'aadhaar'           => $data['aadhaar'],
                'city'              => $data['city'],
                'address'           => $data['address'],
               /*  'bio'               => $data['bio'], */
                'profile_image'     => $avatar,
                /* 'is_verified'       => true, */
                'email_verified_at' => now(),
            ]);
        }

        // ─────────────────────────────────────────────
        // 3. PROFESSIONALS
        // ─────────────────────────────────────────────
        $professionals = [
            [
                'name'           => 'Rajesh Kumar',
                'email'          => 'rajesh@test.com',
                'phone'          => '9000000004',
                'aadhaar'        => '444444444444',
                'city'           => 'Mumbai',
                'address'        => '22, Dharavi Road, Mumbai - 400017',
                /* 'bio'            => 'Experienced plumber with 8+ years handling residential & commercial pipework.', */
                'specialization' => 'Plumber',
                'experience'     => 8,
                'hourly_rate'    => 500,
                'color'          => '16A34A',
                'slug'           => 'rajesh_kumar',
                'services'       => [
                    ['name' => 'Plumbing Repair',   'description' => 'Fix leaks, blockages, and faulty taps.',        'price' => 500,  'duration' => 1],
                    ['name' => 'Pipe Installation', 'description' => 'New pipe fitting for kitchen and bathrooms.',    'price' => 800,  'duration' => 2],
                    ['name' => 'Drain Cleaning',    'description' => 'High-pressure drain unblocking service.',        'price' => 400,  'duration' => 1],
                ],
            ],
            [
                'name'           => 'Sarah Wilson',
                'email'          => 'sarah@test.com',
                'phone'          => '9000000005',
                'aadhaar'        => '555555555555',
                'city'           => 'Mumbai',
                'address'        => 'B-5, Powai Heights, Powai, Mumbai - 400076',
                /* 'bio'            => 'Licensed electrician specialising in home wiring, MCB panels and EV charger installations.', */
                'specialization' => 'Electrician',
                'experience'     => 6,
                'hourly_rate'    => 600,
                'color'          => 'D97706',
                'slug'           => 'sarah_wilson',
                'services'       => [
                    ['name' => 'Electrical Repair',  'description' => 'Fix wiring faults, switches and sockets.',     'price' => 600,  'duration' => 1],
                    ['name' => 'MCB Panel Setup',    'description' => 'New MCB panel installation and testing.',       'price' => 1500, 'duration' => 3],
                    ['name' => 'EV Charger Install', 'description' => 'Home EV charging point installation.',          'price' => 2500, 'duration' => 4],
                ],
            ],
            [
                'name'           => 'Amit Verma',
                'email'          => 'amit@test.com',
                'phone'          => '9000000006',
                'aadhaar'        => '666666666666',
                'city'           => 'Pune',
                'address'        => 'Shop 3, FC Road, Pune - 411004',
                /* 'bio'            => 'Professional carpenter crafting custom furniture and woodwork for homes and offices.', */
                'specialization' => 'Carpenter',
                'experience'     => 10,
                'hourly_rate'    => 450,
                'color'          => '7C3AED',
                'slug'           => 'amit_verma',
                'services'       => [
                    ['name' => 'Furniture Assembly',  'description' => 'Flat-pack and custom furniture assembly.',     'price' => 700,  'duration' => 2],
                    ['name' => 'Custom Woodwork',     'description' => 'Bespoke shelves, wardrobes and cabinets.',     'price' => 3000, 'duration' => 8],
                    ['name' => 'Door & Window Repair','description' => 'Repair and refinish wooden doors/windows.',   'price' => 500,  'duration' => 2],
                ],
            ],
        ];

        foreach ($professionals as $data) {
            $avatar = $this->downloadAvatar($data['name'], $data['slug'], $data['color']);

            $pro = User::create([
                'name'              => $data['name'],
                'email'             => $data['email'],
                'password'          => bcrypt('password'),
                'user_type'         => 'professional',
                'phone'             => $data['phone'],
                'aadhaar'           => $data['aadhaar'],
                'city'              => $data['city'],
                'address'           => $data['address'],
                /* 'bio'               => $data['bio'], */
                'profile_image'     => $avatar,
                /* 'is_verified'       => true, */
                'email_verified_at' => now(),
            ]);

            ProfessionalProfile::create([
                'user_id'          => $pro->id,
                /* 'bio'              => $data['bio'], */
                'specialization'   => $data['specialization'],
                'experience_years' => $data['experience'],
                'hourly_rate'      => $data['hourly_rate'],
                'is_available'     => true,
                'rating'           => round(mt_rand(40, 50) / 10, 1),
                'total_reviews'    => mt_rand(5, 40),
            ]);

            foreach ($data['services'] as $svc) {
                Service::create([
                    'professional_id' => $pro->id,
                    'name'            => $svc['name'],
                    'description'     => $svc['description'],
                    'price'           => $svc['price'],
                    'duration'        => $svc['duration'],
                    'is_active'       => true,
                ]);
            }
        }

        // ─────────────────────────────────────────────
        // 4. BUSINESS USERS
        // ─────────────────────────────────────────────
        $businesses = [
            [
                'name'         => 'Meena Grocers',
                'email'        => 'meena@business.test.com',
                'phone'        => '9000000007',
                'aadhaar'      => '777777777777',
                'city'         => 'Mumbai',
                'address'      => 'Shop 7, SV Road, Borivali West, Mumbai - 400092',
/*                 'bio'          => 'Neighbourhood grocery store offering fresh produce and home delivery.', */
                'color'        => '059669',
                'slug'         => 'meena_grocers',
            ],
            [
                'name'         => 'TechFix Solutions',
                'email'        => 'techfix@business.test.com',
                'phone'        => '9000000008',
                'aadhaar'      => '888888888888',
                'city'         => 'Pune',
                'address'      => '201, IT Park, Hinjewadi Phase 1, Pune - 411057',
/*                 'bio'          => 'Laptop, phone and gadget repair centre with same-day turnaround.', */
                'color'        => '2563EB',
                'slug'         => 'techfix_solutions',
            ],
        ];

        foreach ($businesses as $data) {
            $avatar = $this->downloadAvatar($data['name'], $data['slug'], $data['color']);
            User::create([
                'name'              => $data['name'],
                'email'             => $data['email'],
                'password'          => bcrypt('password'),
                'user_type'         => 'business',
                'phone'             => $data['phone'],
                'aadhaar'           => $data['aadhaar'],
                'city'              => $data['city'],
                'address'           => $data['address'],
               /*  'bio'               => $data['bio'], */
                'profile_image'     => $avatar,
                /* 'is_verified'       => true, */
                'email_verified_at' => now(),
            ]);
        }

        // ─────────────────────────────────────────────
        // 5. COMMUNITIES  (created by admin)
        // ─────────────────────────────────────────────
        $communities = [
            [
                'name'         => 'Sunrise Apartments',
                'description'  => 'Official community for residents of Sunrise Apartments, Andheri East.',
                'category'     => 'local',
                'member_count' => 87,
            ],
            [
                'name'         => 'Tech Entrepreneurs Mumbai',
                'description'  => 'Connect, collaborate and grow with Mumbai\'s startup founders.',
                'category'     => 'business',
                'member_count' => 214,
            ],
            [
                'name'         => 'Fitness Enthusiasts Pune',
                'description'  => 'Running groups, gym meetups and wellness challenges in Pune.',
                'category'     => 'general',
                'member_count' => 143,
            ],
            [
                'name'         => 'LocalHub Testing Community',
                'description'  => 'Private community used for QA and feature testing only.',
                'category'     => 'general',
                'member_count' => 5,
            ],
        ];

        foreach ($communities as $comm) {
            Community::create([
                'name'         => $comm['name'],
                'description'  => $comm['description'],
                'category'     => $comm['category'],
                'status'       => 'active',
                'visibility'   => 'public',
                'created_by'   => $admin->id,
                'member_count' => $comm['member_count'],
            ]);
        }

        // ─────────────────────────────────────────────
        // Summary
        // ─────────────────────────────────────────────
        $this->command->info('');
        $this->command->info('✅  Test data seeded successfully!');
        $this->command->info('');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin',        'admin@localhub.com',          'admin123'],
                ['Resident',     'resident@test.com',           'password'],
                ['Resident',     'priya@test.com',              'password'],
                ['Professional', 'rajesh@test.com',             'password'],
                ['Professional', 'sarah@test.com',              'password'],
                ['Professional', 'amit@test.com',               'password'],
                ['Business',     'meena@business.test.com',     'password'],
                ['Business',     'techfix@business.test.com',   'password'],
            ]
        );
        $this->command->info('');
        $this->command->info('Profile images saved to: storage/app/public/avatars/');
        $this->command->info('Run "php artisan storage:link" if you haven\'t already.');
        $this->command->info('');
    }
}