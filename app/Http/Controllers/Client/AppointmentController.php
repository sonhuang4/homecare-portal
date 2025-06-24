<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Display all user appointments
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get user's appointments with filtering
        $query = $user->appointments()
            ->byStatus($request->status)
            ->byServiceType($request->service_type)
            ->orderBy('appointment_date', 'asc')
            ->orderBy('start_time', 'asc');

        $appointments = $query->get();

        // Summary statistics
        $stats = [
            'total' => $user->appointments()->count(),
            'upcoming' => $user->appointments()->upcoming()->count(),
            'today' => $user->appointments()->today()->count(),
            'completed' => $user->appointments()->where('status', 'completed')->count(),
        ];

        return Inertia::render('Client/Appointments/Index', [
            'appointments' => $appointments,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'service_type' => $request->service_type ?? 'all',
            ]
        ]);
    }

    /**
     * Show the form for creating a new appointment
     */
    public function create(Request $request)
    {
        $selectedDate = $request->date ? Carbon::parse($request->date) : null;
        $availableSlots = $selectedDate ? 
            Appointment::getAvailableTimeSlots($selectedDate->toDateString()) : [];

        return Inertia::render('Client/Appointments/Create', [
            'selectedDate' => $selectedDate?->toDateString(),
            'availableSlots' => $availableSlots,
            'serviceTypes' => Appointment::SERVICE_TYPES,
            'priorities' => Appointment::PRIORITIES
        ]);
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_type' => 'required|in:' . implode(',', array_keys(Appointment::SERVICE_TYPES)),
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'priority' => 'required|in:' . implode(',', array_keys(Appointment::PRIORITIES)),
            'address' => 'nullable|string|max:500',
            'contact_phone' => 'nullable|string|max:20',
            'special_requirements' => 'nullable|array',
            'notes' => 'nullable|string|max:1000'
        ]);

        // Check for conflicts
        if (Appointment::hasConflict(
            $validated['appointment_date'], 
            $validated['start_time'], 
            $validated['end_time']
        )) {
            return back()->withErrors(['time_slot' => 'This time slot is already booked. Please choose another time.']);
        }

        // Create the appointment
        $appointment = auth()->user()->appointments()->create([
            'service_type' => $validated['service_type'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'appointment_date' => $validated['appointment_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'priority' => $validated['priority'],
            'address' => $validated['address'],
            'contact_phone' => $validated['contact_phone'] ?? auth()->user()->phone,
            'special_requirements' => $validated['special_requirements'],
            'notes' => $validated['notes'],
            'status' => 'scheduled'
        ]);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment scheduled successfully! You will receive a confirmation email shortly.');
    }

    /**
     * Display the specified appointment
     */
    public function show($id)
    {
        $appointment = auth()->user()->appointments()->findOrFail($id);

        return Inertia::render('Client/Appointments/Show', [
            'appointment' => $appointment
        ]);
    }

    /**
     * Show the form for editing the specified appointment
     */
    public function edit($id)
    {
        $appointment = auth()->user()->appointments()->findOrFail($id);

        if (!$appointment->can_be_rescheduled) {
            return redirect()->route('appointments.show', $id)
                ->with('error', 'This appointment cannot be rescheduled.');
        }

        $availableSlots = Appointment::getAvailableTimeSlots(
            $appointment->appointment_date->toDateString(), 
            $appointment->id
        );

        return Inertia::render('Client/Appointments/Edit', [
            'appointment' => $appointment,
            'availableSlots' => $availableSlots,
            'serviceTypes' => Appointment::SERVICE_TYPES,
            'priorities' => Appointment::PRIORITIES
        ]);
    }

    /**
     * Update the specified appointment
     */
    public function update(Request $request, $id)
    {
        $appointment = auth()->user()->appointments()->findOrFail($id);

        if (!$appointment->can_be_rescheduled) {
            return redirect()->route('appointments.show', $id)
                ->with('error', 'This appointment cannot be rescheduled.');
        }

        $validated = $request->validate([
            'service_type' => 'required|in:' . implode(',', array_keys(Appointment::SERVICE_TYPES)),
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'priority' => 'required|in:' . implode(',', array_keys(Appointment::PRIORITIES)),
            'address' => 'nullable|string|max:500',
            'contact_phone' => 'nullable|string|max:20',
            'special_requirements' => 'nullable|array',
            'notes' => 'nullable|string|max:1000'
        ]);

        // Check for conflicts (excluding current appointment)
        if (Appointment::hasConflict(
            $validated['appointment_date'], 
            $validated['start_time'], 
            $validated['end_time'],
            $appointment->id
        )) {
            return back()->withErrors(['time_slot' => 'This time slot is already booked. Please choose another time.']);
        }

        // Update the appointment
        $appointment->update($validated);

        return redirect()->route('appointments.show', $id)
            ->with('success', 'Appointment updated successfully!');
    }

    /**
     * Cancel the specified appointment
     */
    public function cancel(Request $request, $id)
    {
        $appointment = auth()->user()->appointments()->findOrFail($id);

        if (!$appointment->can_be_cancelled) {
            return redirect()->route('appointments.show', $id)
                ->with('error', 'This appointment cannot be cancelled.');
        }

        $validated = $request->validate([
            'cancellation_reason' => 'required|in:schedule_conflict,no_longer_needed,emergency,personal_reasons,other',
            'cancellation_notes' => 'nullable|string|max:500'
        ]);

        $appointment->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $validated['cancellation_reason'],
            'cancellation_notes' => $validated['cancellation_notes']
        ]);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment cancelled successfully.');
    }

    /**
     * Get available time slots for a specific date
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'exclude_id' => 'nullable|integer'
        ]);

        $slots = Appointment::getAvailableTimeSlots(
            $request->date, 
            $request->exclude_id
        );

        return response()->json(['slots' => $slots]);
    }

    /**
     * Quick reschedule - show available slots for rescheduling
     */
    public function reschedule($id)
    {
        $appointment = auth()->user()->appointments()->findOrFail($id);

        if (!$appointment->can_be_rescheduled) {
            return redirect()->route('appointments.show', $id)
                ->with('error', 'This appointment cannot be rescheduled.');
        }

        // Get next 14 days with available slots
        $availableDates = [];
        for ($i = 0; $i < 14; $i++) {
            $date = now()->addDays($i);
            if ($date->isWeekday()) { // Only show weekdays
                $slots = Appointment::getAvailableTimeSlots($date->toDateString(), $appointment->id);
                if (!empty($slots)) {
                    $availableDates[] = [
                        'date' => $date->toDateString(),
                        'date_formatted' => $date->format('M j, Y'),
                        'day_name' => $date->format('l'),
                        'slots' => $slots
                    ];
                }
            }
        }

        return Inertia::render('Client/Appointments/Reschedule', [
            'appointment' => $appointment,
            'availableDates' => $availableDates
        ]);
    }

    /**
     * Process quick reschedule
     */
    public function processReschedule(Request $request, $id)
    {
        $appointment = auth()->user()->appointments()->findOrFail($id);

        if (!$appointment->can_be_rescheduled) {
            return redirect()->route('appointments.show', $id)
                ->with('error', 'This appointment cannot be rescheduled.');
        }

        $validated = $request->validate([
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time'
        ]);

        // Check for conflicts
        if (Appointment::hasConflict(
            $validated['appointment_date'], 
            $validated['start_time'], 
            $validated['end_time'],
            $appointment->id
        )) {
            return back()->withErrors(['time_slot' => 'This time slot is no longer available. Please choose another time.']);
        }

        // Update the appointment
        $appointment->update([
            'appointment_date' => $validated['appointment_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'status' => 'scheduled' // Reset to scheduled if it was confirmed
        ]);

        return redirect()->route('appointments.show', $id)
            ->with('success', 'Appointment rescheduled successfully!');
    }
}