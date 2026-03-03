<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'category',
        'price',
        'stock',
        'photo',
    ];

    public function enterprise()
    {
    return $this->belongsTo(Enterprise::class, 'user_id', 'user_id');
    }

}
