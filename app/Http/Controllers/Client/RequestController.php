<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class RequestController extends Controller
{
    /**
     * Display all user requests
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get user's requests with filtering using the model
        $query = $user->requests()
            ->byStatus($request->status)
            ->byType($request->type)
            ->search($request->search)
            ->orderBy('created_at', 'desc');

        $requests = $query->get();

        // Summary statistics
        $stats = [
            'total' => $user->requests()->count(),
            'submitted' => $user->requests()->where('status', 'submitted')->count(),
            'in_progress' => $user->requests()->where('status', 'in_progress')->count(),
            'completed' => $user->requests()->where('status', 'completed')->count(),
        ];

        return Inertia::render('Client/Requests/Index', [
            'requests' => $requests,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'type' => $request->type ?? 'all',
                'search' => $request->search ?? '',
            ]
        ]);
    }

    /**
     * Show the form for creating a new request
     */
    public function create()
    {
        return Inertia::render('Client/Requests/Create');
    }

    /**
     * Store a newly created request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:document,appointment,medical,technical,billing,general',
            'priority' => 'required|in:low,medium,high,urgent',
            'subject' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'contact_preference' => 'required|array|min:1',
            'contact_preference.*' => 'in:email,phone,whatsapp',
            'phone' => 'nullable|string|max:20',
            'preferred_contact_time' => 'nullable|in:morning,afternoon,evening',
            'attachments.*' => 'nullable|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png,gif'
        ]);

        // Handle file uploads
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('requests', $filename, 'public');
                $attachments[] = $filename;
            }
        }

        // Create the request using the model
        $newRequest = auth()->user()->requests()->create([
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'contact_preference' => $validated['contact_preference'],
            'phone' => $validated['phone'],
            'preferred_contact_time' => $validated['preferred_contact_time'],
            'attachments' => $attachments,
            'status' => 'submitted',
            'estimated_completion' => \App\Models\Request::calculateEstimatedCompletion($validated['priority']),
        ]);

        // Send notification email (optional)
        // Mail::to(auth()->user())->send(new RequestSubmittedMail($newRequest));

        return redirect()->route('requests.index')
            ->with('success', 'Request submitted successfully! You will receive a confirmation email shortly.');
    }

    /**
     * Display the specified request
     */
    public function show($id)
    {
        $request = auth()->user()->requests()->findOrFail($id);

        return Inertia::render('Client/Requests/Show', [
            'request' => $request
        ]);
    }

    /**
     * Calculate estimated completion time based on priority
     */
    private function calculateEstimatedCompletion($priority)
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