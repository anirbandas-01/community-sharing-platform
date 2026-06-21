<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CommunityPost;
  

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'image',
        'status',
        'visibility',
        'created_by',
        'member_count',
        'location',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'community_members')
            ->withPivot('role', 'status')
            ->withTimestamps();
    }

    public function posts()
    {
        return $this->hasMany(CommunityPost::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}

