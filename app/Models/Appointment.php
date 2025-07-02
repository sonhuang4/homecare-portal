<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_type',
        'title',
        'description',
        'appointment_date',
        'start_time',
        'end_time',
        'status',
        'priority',
        'address',
        'contact_phone',
        'special_requirements',
        'notes',
        'admin_notes',
        'assigned_staff',
        'cancelled_at',
        'cancellation_reason',
        'cancellation_notes',
        'confirmed_at'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'special_requirements' => 'array',
        'cancelled_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Service types
    const SERVICE_TYPES = [
        'consultation' => 'Consultation',
        'home_visit' => 'Home Visit',
        'follow_up' => 'Follow-up Visit',
        'assessment' => 'Assessment',
        'inspection' => 'Inspection Session',
    ];

    // Status options
    const STATUSES = [
        'scheduled' => 'Scheduled',
        'confirmed' => 'Confirmed',
        'in_progress' => 'In Progress',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
        'no_show' => 'No Show'
    ];

    // Priority levels
    const PRIORITIES = [
        'low' => 'Low',
        'medium' => 'Medium',
        'high' => 'High',
        'urgent' => 'Urgent'
    ];

    /**
     * Get the user that owns the appointment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service type label
     */
    public function getServiceTypeLabelAttribute(): string
    {
        return self::SERVICE_TYPES[$this->service_type] ?? $this->service_type;
    }

    /**
     * Get the status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    /**
     * Get the priority label
     */
    public function getPriorityLabelAttribute(): string
    {
        return self::PRIORITIES[$this->priority] ?? $this->priority;
    }

    /**
     * Get the status color for UI
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'scheduled' => 'text-blue-400',
            'confirmed' => 'text-green-400',
            'in_progress' => 'text-orange-400',
            'completed' => 'text-green-600',
            'cancelled' => 'text-red-400',
            'no_show' => 'text-gray-400',
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
     * Get full date and time formatted
     */
    public function getFullDateTimeAttribute(): string
    {
        return $this->appointment_date->format('M j, Y') . ' at ' . 
               Carbon::parse($this->start_time)->format('g:i A');
    }

    /**
     * Get duration in minutes
     */
    public function getDurationAttribute(): int
    {
        $start = Carbon::parse($this->start_time);
        $end = Carbon::parse($this->end_time);
        return $start->diffInMinutes($end);
    }

    /**
     * Check if appointment is upcoming
     */
    public function getIsUpcomingAttribute(): bool
    {
        return $this->appointment_date->isFuture() || 
               ($this->appointment_date->isToday() && Carbon::parse($this->start_time)->isFuture());
    }

    /**
     * Check if appointment is today
     */
    public function getIsTodayAttribute(): bool
    {
        return $this->appointment_date->isToday();
    }

    /**
     * Check if appointment can be cancelled
     */
    public function getCanBeCancelledAttribute(): bool
    {
        return in_array($this->status, ['scheduled', 'confirmed']) && $this->is_upcoming;
    }

    /**
     * Check if appointment can be rescheduled
     */
    public function getCanBeRescheduledAttribute(): bool
    {
        return in_array($this->status, ['scheduled', 'confirmed']) && $this->is_upcoming;
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
     * Scope: Filter by service type
     */
    public function scopeByServiceType($query, $serviceType)
    {
        if ($serviceType && $serviceType !== 'all') {
            return $query->where('service_type', $serviceType);
        }
        return $query;
    }

    /**
     * Scope: Upcoming appointments
     */
    public function scopeUpcoming($query)
    {
        return $query->where(function($q) {
            $q->where('appointment_date', '>', now()->toDateString())
              ->orWhere(function($subQ) {
                  $subQ->where('appointment_date', '=', now()->toDateString())
                       ->where('start_time', '>', now()->toTimeString());
              });
        });
    }

    /**
     * Scope: Today's appointments
     */
    public function scopeToday($query)
    {
        return $query->where('appointment_date', now()->toDateString());
    }

    /**
     * Check for scheduling conflicts
     */
    public static function hasConflict($date, $startTime, $endTime, $excludeId = null)
    {
        $query = self::where('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where(function($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function($subQ) use ($startTime, $endTime) {
                      $subQ->where('start_time', '<=', $startTime)
                           ->where('end_time', '>=', $endTime);
                  });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Get available time slots for a given date
     */
    public static function getAvailableTimeSlots($date, $excludeId = null)
    {
        $workingHours = [
            'start' => '08:00',
            'end' => '18:00',
            'slot_duration' => 60 // minutes
        ];

        $bookedSlots = self::where('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->when($excludeId, function($q) use ($excludeId) {
                return $q->where('id', '!=', $excludeId);
            })
            ->get(['start_time', 'end_time']);

        $availableSlots = [];
        $currentTime = Carbon::parse($workingHours['start']);
        $endTime = Carbon::parse($workingHours['end']);

        while ($currentTime->lt($endTime)) {
            $slotEnd = $currentTime->copy()->addMinutes($workingHours['slot_duration']);
            
            $isAvailable = true;
            foreach ($bookedSlots as $booking) {
                $bookingStart = Carbon::parse($booking->start_time);
                $bookingEnd = Carbon::parse($booking->end_time);
                
                if ($currentTime->lt($bookingEnd) && $slotEnd->gt($bookingStart)) {
                    $isAvailable = false;
                    break;
                }
            }

            if ($isAvailable && $slotEnd->lte($endTime)) {
                $availableSlots[] = [
                    'start_time' => $currentTime->format('H:i'),
                    'end_time' => $slotEnd->format('H:i'),
                    'label' => $currentTime->format('g:i A') . ' - ' . $slotEnd->format('g:i A')
                ];
            }

            $currentTime->addMinutes($workingHours['slot_duration']);
        }

        return $availableSlots;
    }
}