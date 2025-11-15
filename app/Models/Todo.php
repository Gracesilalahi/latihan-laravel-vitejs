<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Todo extends Model
{
    use HasFactory;

    // Konstanta status untuk menjaga konsistensi
    public const STATUS_PENDING = 'pending';
    public const STATUS_DONE = 'done';

    protected $fillable = [
        'user_id',
        'title',
        'note',
        'status',
        'due_date',
        'cover',
    ];

    // Append agar atribut cover_url otomatis tersedia di frontend (Inertia/Vue)
    protected $appends = ['cover_url'];

    /**
     * Accessor untuk mendapatkan URL cover yang tersimpan di storage/public
     */
    public function getCoverUrlAttribute()
    {
        return $this->cover ? Storage::url($this->cover) : null;
    }

    /**
     * Relasi ke user yang memiliki todo ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
