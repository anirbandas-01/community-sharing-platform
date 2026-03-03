<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class AdminSession
{
    public function handle($request, Closure $next)
    {
        if (!session()->has('admin_id')) {
            return redirect('/admin_login');
        }

        return $next($request);
    }
}