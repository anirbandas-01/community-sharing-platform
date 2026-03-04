<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
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
