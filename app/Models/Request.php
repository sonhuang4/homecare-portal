<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'priority',
        'subject',
        'description',
        'status',
        'contact_preference',
        'phone',
        'preferred_contact_time',
        'attachments',
        'admin_notes',
        'estimated_completion'
    ];

    protected $casts = [
        'contact_preference' => 'array',
        'attachments' => 'array',
        'estimated_completion' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Request types
    const TYPES = [
        'document' => 'Document Request',
        'appointment' => 'Schedule Appointment',
        'medical' => 'Medical Support',
        'technical' => 'Technical Support',
        'billing' => 'Billing Inquiry',
        'general' => 'General Support'
    ];

    // Priority levels
    const PRIORITIES = [
        'low' => 'Low',
        'medium' => 'Medium',
        'high' => 'High',
        'urgent' => 'Urgent'
    ];

    // Status options
    const STATUSES = [
        'submitted' => 'Submitted',
        'reviewed' => 'Reviewed',
        'in_progress' => 'In Progress',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled'
    ];

    /**
     * Get the user that owns the request
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the type label
     */
    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? $this->type;
    }

    /**
     * Get the priority label
     */
    public function getPriorityLabelAttribute(): string
    {
        return self::PRIORITIES[$this->priority] ?? $this->priority;
    }

    /**
     * Get the status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    /**
     * Get the status color for UI
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'submitted' => 'text-blue-400',
            'reviewed' => 'text-yellow-400',
            'in_progress' => 'text-orange-400',
            'completed' => 'text-green-400',
            'cancelled' => 'text-red-400',
            default => 'text-gray-400'
        };
    }

    /**
     * Get the priority color for UI
     */
    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'low' => 'text-green-400',
            'medium' => 'text-yellow-400',
            'high' => 'text-orange-400',
            'urgent' => 'text-red-400',
            default => 'text-gray-400'
        };
    }

    /**
     * Check if request is overdue
     */
    public function getIsOverdueAttribute(): bool
    {
        if (!$this->estimated_completion) {
            return false;
        }

        return now()->isAfter($this->estimated_completion) && $this->status !== 'completed';
    }

    /**
     * Get estimated completion in human readable format
     */
    public function getEstimatedCompletionHumanAttribute(): ?string
    {
        if (!$this->estimated_completion) {
            return null;
        }

        return $this->estimated_completion->format('M j, Y g:i A');
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, $status)
    {
        if ($status && $status !== 'all') {
            return $query->where('status', $status);
        }
        return $query;
    }

    /**
     * Scope: Filter by type
     */
    public function scopeByType($query, $type)
    {
        if ($type && $type !== 'all') {
            return $query->where('type', $type);
        }
        return $query;
    }

    /**
     * Scope: Search in subject and description
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    /**
     * Calculate estimated completion based on priority
     */
    public static function calculateEstimatedCompletion($priority): \Carbon\Carbon
    {
        $hours = match($priority) {
            'urgent' => 4,      // 4 hours
            'high' => 24,       // 1 day
            'medium' => 48,     // 2 days
            'low' => 120,       // 5 days
            default => 48
        };

        return now()->addHours($hours);
    }
}