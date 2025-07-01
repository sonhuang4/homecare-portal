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
        'property_address',        // Added missing field
        'subscription_tier',       // Added missing field
        'credit_usage',           // Added missing field
        'property_access_info',   // Added missing field
        'attachments',
        'admin_notes',
        'estimated_completion'
    ];

    protected $casts = [
        'contact_preference' => 'array',
        'attachments' => 'array',
        'credit_usage' => 'boolean',           // Added cast
        'estimated_completion' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Updated request types to match your frontend
    const TYPES = [
        'preventive_maintenance' => 'Preventive Maintenance',
        'emergency_repair' => 'Emergency Repair',
        'property_inspection' => 'Property Inspection',
        'home_improvement' => 'Home Improvement',
        'hvac_service' => 'HVAC Services',
        'plumbing_service' => 'Plumbing Services',
        'electrical_service' => 'Electrical Services',
        'roofing_service' => 'Roofing Services',
        'painting_service' => 'Painting Services',
        'landscaping_service' => 'Landscaping & Outdoor',
        'security_service' => 'Security & Safety',
        'general_maintenance' => 'General Maintenance',
        // Keep legacy types for compatibility
        'document' => 'Document Request',
        'appointment' => 'Schedule Appointment',
        'medical' => 'Medical Support',
        'technical' => 'Technical Support',
        'billing' => 'Billing Inquiry',
        'general' => 'General Support'
    ];

    // Updated priority levels to match your frontend
    const PRIORITIES = [
        'low' => 'Low Priority',
        'medium' => 'Standard',
        'high' => 'High Priority',
        'emergency' => 'Emergency',  // Added emergency priority
        'urgent' => 'Urgent'         // Keep for legacy
    ];

    // Status options
    const STATUSES = [
        'submitted' => 'Submitted',
        'reviewed' => 'Reviewed',
        'in_progress' => 'In Progress',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled'
    ];

    // Subscription tiers
    const SUBSCRIPTION_TIERS = [
        'standard' => 'Standard Plan',
        'premium' => 'Premium Plan',
        'deluxe' => 'Deluxe Plan',
        'non_member' => 'Non-Member'
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
        return self::TYPES[$this->type] ?? ucfirst(str_replace('_', ' ', $this->type));
    }

    /**
     * Get the priority label
     */
    public function getPriorityLabelAttribute(): string
    {
        return self::PRIORITIES[$this->priority] ?? ucfirst($this->priority);
    }

    /**
     * Get the status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Get the subscription tier label
     */
    public function getSubscriptionTierLabelAttribute(): string
    {
        return self::SUBSCRIPTION_TIERS[$this->subscription_tier] ?? ucfirst(str_replace('_', ' ', $this->subscription_tier));
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
            'emergency' => 'text-red-400',
            'urgent' => 'text-red-400',
            default => 'text-gray-400'
        };
    }

    /**
     * Get the type icon for UI
     */
    public function getTypeIconAttribute(): string
    {
        $icons = [
            'preventive_maintenance' => '🔧',
            'emergency_repair' => '🚨',
            'property_inspection' => '📋',
            'home_improvement' => '🏗️',
            'hvac_service' => '❄️',
            'plumbing_service' => '🚿',
            'electrical_service' => '⚡',
            'roofing_service' => '🏠',
            'painting_service' => '🎨',
            'landscaping_service' => '🌿',
            'security_service' => '🔒',
            'general_maintenance' => '🛠️',
            // Legacy types
            'document' => '📄',
            'appointment' => '📅',
            'medical' => '🏥',
            'technical' => '🔧',
            'billing' => '💳',
            'general' => '📋'
        ];

        return $icons[$this->type] ?? '📋';
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
     * Get contact preference as a readable string
     */
    public function getContactPreferenceStringAttribute(): string
    {
        if (!$this->contact_preference || !is_array($this->contact_preference)) {
            return 'Not specified';
        }

        $preferences = array_map(function($pref) {
            return match($pref) {
                'email' => 'Email',
                'phone' => 'Phone',
                'whatsapp' => 'WhatsApp',
                default => ucfirst($pref)
            };
        }, $this->contact_preference);

        return implode(', ', $preferences);
    }

    /**
     * Get attachments count
     */
    public function getAttachmentsCountAttribute(): int
    {
        return $this->attachments ? count($this->attachments) : 0;
    }

    /**
     * Check if request has attachments
     */
    public function getHasAttachmentsAttribute(): bool
    {
        return $this->attachments_count > 0;
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
     * Scope: Filter by priority
     */
    public function scopeByPriority($query, $priority)
    {
        if ($priority && $priority !== 'all') {
            return $query->where('priority', $priority);
        }
        return $query;
    }

    /**
     * Scope: Filter by subscription tier
     */
    public function scopeBySubscriptionTier($query, $tier)
    {
        if ($tier && $tier !== 'all') {
            return $query->where('subscription_tier', $tier);
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
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('property_address', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    /**
     * Scope: Emergency requests
     */
    public function scopeEmergency($query)
    {
        return $query->where('priority', 'emergency');
    }

    /**
     * Scope: High priority requests
     */
    public function scopeHighPriority($query)
    {
        return $query->whereIn('priority', ['high', 'emergency', 'urgent']);
    }

    /**
     * Scope: Active requests (not completed or cancelled)
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['completed', 'cancelled']);
    }

    /**
     * Calculate estimated completion based on priority
     */
    public static function calculateEstimatedCompletion($priority): \Carbon\Carbon
    {
        $hours = match($priority) {
            'emergency' => 4,   // 4 hours for emergency
            'urgent' => 4,      // 4 hours for urgent (legacy)
            'high' => 24,       // 1 day
            'medium' => 48,     // 2 days
            'low' => 120,       // 5 days
            default => 48
        };

        return now()->addHours($hours);
    }
}