<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
{
    View::composer('*', function ($view) {

        if (!auth()->check()) return;

        if (auth()->user()->role === 'resident') {
            $view->with('menuItems', [
                [
                    'label' => 'Dashboard',
                    'icon' => 'home',
                    'route' => route('resident.dashboard'),
                ],
                [
                    'label' => 'Find Services',
                    'icon' => 'search',
                    'route' => route('resident.services'),
                    ],
                [
                    'label' => 'My Bookings',
                    'icon' => 'calendar-check',
                    'route' => route('resident.bookings'),
                ],
                [
                    'label' => 'Messages',
                    'icon' => 'comments',
                    'route' => route('resident.messages'),
                ],
                [
                    'label' => 'Profile',
                    'icon' => 'user',
                    'route' => route('resident.profile'),
                ],
                [
                    'label' => 'Logout',
                    'icon' => 'sign-out-alt',
                    'route' => 'logout',
                ],
            ]);
        }
    });
}
}
