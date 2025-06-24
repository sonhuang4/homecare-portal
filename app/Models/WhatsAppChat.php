<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsAppChat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone_number',
        'whatsapp_message_id',
        'message',
        'direction',
        'routed_to_team',
        'routing_confidence',
        'status',
        'metadata',
        'delivered_at',
        'read_at'
    ];

    protected $casts = [
        'metadata' => 'array',
        'routing_confidence' => 'decimal:2',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Direction constants
    const DIRECTION_INBOUND = 'inbound';
    const DIRECTION_OUTBOUND = 'outbound';

    // Status constants
    const STATUS_SENT = 'sent';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_READ = 'read';
    const STATUS_FAILED = 'failed';

    // Team constants
    const TEAM_GENERAL = 'general';
    const TEAM_MEDICAL = 'medical';
    const TEAM_BILLING = 'billing';
    const TEAM_EMERGENCY = 'emergency';

    /**
     * Get the user that owns the chat message
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Filter by direction
     */
    public function scopeInbound($query)
    {
        return $query->where('direction', self::DIRECTION_INBOUND);
    }

    /**
     * Scope: Filter by direction
     */
    public function scopeOutbound($query)
    {
        return $query->where('direction', self::DIRECTION_OUTBOUND);
    }

    /**
     * Scope: Filter by team
     */
    public function scopeByTeam($query, $team)
    {
        return $query->where('routed_to_team', $team);
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Recent messages
     */
    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get chat statistics
     */
    public static function getStats($days = 30)
    {
        $baseQuery = self::where('created_at', '>=', now()->subDays($days));

        return [
            'total_messages' => $baseQuery->count(),
            'inbound_messages' => $baseQuery->inbound()->count(),
            'outbound_messages' => $baseQuery->outbound()->count(),
            'unique_users' => $baseQuery->distinct('user_id')->count('user_id'),
            'team_distribution' => $baseQuery->groupBy('routed_to_team')
                ->selectRaw('routed_to_team, count(*) as count')
                ->pluck('count', 'routed_to_team')
                ->toArray(),
            'average_response_time' => self::getAverageResponseTime($days)
        ];
    }

    /**
     * Calculate average response time
     */
    public static function getAverageResponseTime($days = 30)
    {
        // This would calculate the time between inbound messages and outbound responses
        // For now, return a mock value
        return '2.5 minutes';
    }

    /**
     * Get conversation for a user or phone number
     */
    public static function getConversation($identifier, $limit = 50)
    {
        $query = self::query();

        if (is_numeric($identifier)) {
            // Assume it's a user ID
            $query->where('user_id', $identifier);
        } else {
            // Assume it's a phone number
            $query->where('phone_number', $identifier);
        }

        return $query->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();
    }

    /**
     * Mark message as delivered
     */
    public function markAsDelivered()
    {
        $this->update([
            'status' => self::STATUS_DELIVERED,
            'delivered_at' => now()
        ]);
    }

    /**
     * Mark message as read
     */
    public function markAsRead()
    {
        $this->update([
            'status' => self::STATUS_READ,
            'read_at' => now()
        ]);
    }

    /**
     * Check if message is from business hours
     */
    public function isDuringBusinessHours()
    {
        $businessHours = config('whatsapp.routing.business_hours');
        $messageTime = $this->created_at->setTimezone($businessHours['timezone']);
        
        $start = $messageTime->copy()->setTimeFromTimeString($businessHours['start']);
        $end = $messageTime->copy()->setTimeFromTimeString($businessHours['end']);

        return $messageTime->between($start, $end) && $messageTime->isWeekday();
    }

    /**
     * Get team name for display
     */
    public function getTeamNameAttribute()
    {
        $teams = [
            self::TEAM_GENERAL => 'General Support',
            self::TEAM_MEDICAL => 'Medical Support',
            self::TEAM_BILLING => 'Billing Support',
            self::TEAM_EMERGENCY => 'Emergency Support'
        ];

        return $teams[$this->routed_to_team] ?? 'Unknown';
    }

    /**
     * Get formatted phone number
     */
    public function getFormattedPhoneAttribute()
    {
        $phone = $this->phone_number;
        
        // Format as US phone number if it looks like one
        if (strlen($phone) === 11 && substr($phone, 0, 1) === '1') {
            return sprintf('+1 (%s) %s-%s', 
                substr($phone, 1, 3),
                substr($phone, 4, 3),
                substr($phone, 7, 4)
            );
        }
        
        return '+' . $phone;
    }
}