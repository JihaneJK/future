<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_id', 'receiver_id', 'job_id', 'content', 'message', 'read'
    ];

    protected $appends = ['message'];

    protected $casts = [
        'read' => 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    // Mapper $message->message → colonne 'content'
    public function getMessageAttribute()
    {
        return $this->attributes['content'] ?? null;
    }

    public function setMessageAttribute($value)
    {
        $this->attributes['content'] = $value;
    }

    // Compatibilité read_at pour le futur, utilise 'read' (boolean)
    public function getReadAtAttribute()
    {
        return $this->attributes['read'] ? now() : null;
    }
}
