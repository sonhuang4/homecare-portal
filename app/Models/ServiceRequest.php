<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_type',
        'priority',
        'description',
        'preferred_date',
        'status',
        'estimated_cost',
        'notes',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'estimated_cost' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}