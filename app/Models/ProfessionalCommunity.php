<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessionalCommunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'created_by',
        'is_private'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'community_members')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }

/*     public function posts()
    {
        return $this->hasMany(CommunityPost::class);
    } */
}
