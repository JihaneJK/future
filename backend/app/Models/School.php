<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'name', 'city', 'type', 'level', 'rating',
        'tuition', 'duration', 'slug', 'description',
        'programs', 'website', 'active'
    ];

    protected $casts = [
        'programs' => 'array',
        'active' => 'boolean',
    ];
}