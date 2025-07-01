<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RequestController extends Controller
{
    /**
     * Display all user requests
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Build query with filters
        $query = \App\Models\Request::where('user_id', $user->id);

        // Apply filters
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('subject', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%")
                  ->orWhere('property_address', 'like', "%{$request->search}%");
            });
        }

        // Get requests with computed attributes
        $requests = $query->orderBy('created_at', 'desc')->get()->map(function($req) {
            return $this->addComputedAttributes($req);
        });

        
        // Summary statistics
        $stats = [
            'total' => $requests->count(),
            'submitted' => $requests->where('status', 'submitted')->count(),
            'reviewed' => $requests->where('status', 'reviewed')->count(),
            'in_progress' => $requests->where('status', 'in_progress')->count(),
            'completed' => $requests->where('status', 'completed')->count(),
            'cancelled' => $requests->where('status', 'cancelled')->count(),
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
    public function create(Request $request)
    {
        $duplicateData = null;
        
        // Handle duplicate request
        if ($request->filled('duplicate')) {
            $originalRequest = auth()->user()->requests()->find($request->duplicate);
            if ($originalRequest) {
                $duplicateData = [
                    'service_type' => $originalRequest->type,
                    'priority' => $originalRequest->priority,
                    'property_address' => $originalRequest->property_address,
                    'subject' => $originalRequest->subject . ' (Copy)',
                    'description' => $originalRequest->description,
                    'contact_preference' => $originalRequest->contact_preference,
                    'phone' => $originalRequest->phone,
                    'preferred_visit_time' => $originalRequest->preferred_contact_time,
                    'property_access_info' => $originalRequest->property_access_info,
                    'subscription_tier' => $originalRequest->subscription_tier,
                    'credit_usage' => $originalRequest->credit_usage,
                ];
            }
        }

        return Inertia::render('Client/Requests/Create', [
            'duplicateData' => $duplicateData
        ]);
    }

    /**
     * Store a newly created request
     */
    public function store(Request $request)
    {

        try {
            $validated = $request->validate([
                'service_type' => 'required|in:preventive_maintenance,emergency_repair,property_inspection,home_improvement,hvac_service,plumbing_service,electrical_service,roofing_service,painting_service,landscaping_service,security_service,general_maintenance',
                'priority' => 'required|in:low,medium,high,emergency',
                'subject' => 'required|string|max:255',
                'description' => 'required|string|max:2000',
                'contact_preference' => 'required|array|min:1',
                'contact_preference.*' => 'in:email,phone,whatsapp',
                'property_address' => 'required|string|max:500',
                'phone' => 'nullable|string|max:20',
                'preferred_visit_time' => 'nullable|in:morning,afternoon,evening,weekend,emergency',
                'property_access_info' => 'nullable|string|max:1000',
                'subscription_tier' => 'required|in:standard,premium,deluxe,non_member',
                'credit_usage' => 'nullable|boolean',
                'attachments.*' => 'nullable|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png,gif,heic'
            ]);

            Log::info('Validation passed:', $validated);

            // Handle file uploads
            $attachments = [];
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if ($file && $file->isValid()) {
                        $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $path = $file->storeAs('requests', $filename, 'public');
                        $attachments[] = [
                            'filename' => $filename,
                            'original_name' => $file->getClientOriginalName(),
                            'path' => $path,
                            'size' => $file->getSize(),
                            'mime_type' => $file->getMimeType()
                        ];
                    }
                }
            }

            // Map frontend field names to database field names
            $requestData = [
                'type' => $validated['service_type'],
                'priority' => $validated['priority'],
                'subject' => $validated['subject'],
                'description' => $validated['description'],
                'contact_preference' => $validated['contact_preference'],
                'property_address' => $validated['property_address'],
                'phone' => $validated['phone'],
                'preferred_contact_time' => $validated['preferred_visit_time'],
                'property_access_info' => $validated['property_access_info'],
                'subscription_tier' => $validated['subscription_tier'],
                'credit_usage' => $validated['credit_usage'] ?? false,
                'attachments' => $attachments,
                'status' => 'submitted',
                'estimated_completion' => $this->calculateEstimatedCompletion($validated['priority']),
            ];

            Log::info('Mapped data:', $requestData);

            // Create the request
            $newRequest = auth()->user()->requests()->create($requestData);

            Log::info('Request created successfully with ID: ' . $newRequest->id);

            // Send notification email (optional)
            // $this->sendRequestNotification($newRequest);

            return redirect()->route('requests.index')
                ->with('success', 'Service request submitted successfully! Our NWB team will contact you within the specified timeframe to schedule your visit.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            
            return back()->withErrors($e->errors())->withInput()->with('error', 
                'Failed to submit service request. Please check all required fields and try again, or call our emergency hotline: (323) 555-HOME'
            );

        } catch (\Exception $e) {
            Log::error('General error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return back()->withInput()->with('error', 
                'An unexpected error occurred while submitting your request. Please try again or contact support.'
            );
        }
    }

    /**
     * Display the specified request
     */
    public function show($id)
    {
        $request = auth()->user()->requests()->findOrFail($id);

        // Add computed attributes
        $request = $this->addComputedAttributes($request);

        return Inertia::render('Client/Requests/Show', [
            'request' => $request
        ]);
    }

    /**
     * Show the form for editing the specified request
     */
    public function edit($id)
    {
        $request = auth()->user()->requests()->findOrFail($id);

        // Only allow editing if request is not completed or cancelled
        if (in_array($request->status, ['completed', 'cancelled'])) {
            return redirect()->route('requests.show', $id)
                ->with('error', 'This request cannot be edited as it is ' . $request->status . '.');
        }

        return Inertia::render('Client/Requests/Edit', [
            'request' => $request
        ]);
    }

    /**
     * Update the specified request
     */
    public function update(Request $request, $id)
    {
        $requestModel = auth()->user()->requests()->findOrFail($id);

        // Only allow updating if request is submitted or reviewed
        if (!in_array($requestModel->status, ['submitted', 'reviewed'])) {
            return redirect()->route('requests.show', $id)
                ->with('error', 'This request cannot be updated as it is ' . $requestModel->status . '.');
        }

        try {
            $validated = $request->validate([
                'subject' => 'required|string|max:255',
                'description' => 'required|string|max:2000',
                'contact_preference' => 'required|array|min:1',
                'contact_preference.*' => 'in:email,phone,whatsapp',
                'phone' => 'nullable|string|max:20',
                'preferred_visit_time' => 'nullable|in:morning,afternoon,evening,weekend,emergency',
                'property_access_info' => 'nullable|string|max:1000',
                'attachments.*' => 'nullable|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png,gif,heic'
            ]);

            // Handle new file uploads
            $existingAttachments = $requestModel->attachments ?? [];
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if ($file && $file->isValid()) {
                        $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                        $path = $file->storeAs('requests', $filename, 'public');
                        $existingAttachments[] = [
                            'filename' => $filename,
                            'original_name' => $file->getClientOriginalName(),
                            'path' => $path,
                            'size' => $file->getSize(),
                            'mime_type' => $file->getMimeType()
                        ];
                    }
                }
            }

            $requestModel->update([
                'subject' => $validated['subject'],
                'description' => $validated['description'],
                'contact_preference' => $validated['contact_preference'],
                'phone' => $validated['phone'],
                'preferred_contact_time' => $validated['preferred_visit_time'],
                'property_access_info' => $validated['property_access_info'],
                'attachments' => $existingAttachments,
            ]);

            return redirect()->route('requests.show', $id)
                ->with('success', 'Request updated successfully!');

        } catch (\Exception $e) {
            Log::error('Error updating request: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to update request. Please try again.');
        }
    }

    /**
     * Cancel the specified request
     */
    public function cancel($id)
    {
        $request = auth()->user()->requests()->findOrFail($id);

        // Only allow cancelling if request is not completed or already cancelled
        if (in_array($request->status, ['completed', 'cancelled'])) {
            return redirect()->route('requests.show', $id)
                ->with('error', 'This request cannot be cancelled as it is ' . $request->status . '.');
        }

        $request->update([
            'status' => 'cancelled',
            'admin_notes' => ($request->admin_notes ? $request->admin_notes . "\n\n" : '') . 
                           'Request cancelled by client on ' . now()->format('M j, Y g:i A')
        ]);

        return redirect()->route('requests.index')
            ->with('success', 'Request cancelled successfully.');
    }

    /**
     * Add computed attributes to request model
     */
    private function addComputedAttributes($request)
    {
        $request->type_label = $this->getServiceTypeLabel($request->type);
        $request->status_label = $this->getStatusLabel($request->status);
        $request->priority_label = $this->getPriorityLabel($request->priority);
        $request->subscription_tier_label = $this->getSubscriptionTierLabel($request->subscription_tier);
        
        // Add color classes
        $request->status_color = $this->getStatusColor($request->status);
        $request->priority_color = $this->getPriorityColor($request->priority);
        
        // Format estimated completion
        if ($request->estimated_completion) {
            $request->estimated_completion_human = $request->estimated_completion->format('M j, Y g:i A');
        }

        // Check if overdue
        $request->is_overdue = $this->isRequestOverdue($request);

        // Attachments count
        $request->attachments_count = $request->attachments ? count($request->attachments) : 0;
        $request->has_attachments = $request->attachments_count > 0;

        // Contact preference string
        $request->contact_preference_string = $this->getContactPreferenceString($request->contact_preference);

        return $request;
    }

    /**
     * Calculate estimated completion time based on priority
     */
    private function calculateEstimatedCompletion($priority)
    {
        $hours = match($priority) {
            'emergency' => 4,   // 4 hours for emergency
            'high' => 24,       // 1 day for high priority
            'medium' => 48,     // 2 days for medium priority
            'low' => 120,       // 5 days for low priority
            default => 48
        };

        return now()->addHours($hours);
    }

    /**
     * Get service type label for display
     */
    private function getServiceTypeLabel($type)
    {
        $labels = [
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
            // Legacy types for backward compatibility
            'document' => 'Document Request',
            'appointment' => 'Schedule Appointment',
            'medical' => 'Property Assessment',
            'technical' => 'Technical Support',
            'billing' => 'Billing Inquiry',
            'general' => 'General Support'
        ];

        return $labels[$type] ?? ucfirst(str_replace('_', ' ', $type));
    }

    /**
     * Get status label for display
     */
    private function getStatusLabel($status)
    {
        $labels = [
            'submitted' => 'Submitted',
            'reviewed' => 'Reviewed',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled'
        ];

        return $labels[$status] ?? ucfirst($status);
    }

    /**
     * Get priority label for display
     */
    private function getPriorityLabel($priority)
    {
        $labels = [
            'low' => 'Low Priority',
            'medium' => 'Standard',
            'high' => 'High Priority',
            'emergency' => 'Emergency'
        ];

        return $labels[$priority] ?? ucfirst($priority);
    }

    /**
     * Get subscription tier label for display
     */
    private function getSubscriptionTierLabel($tier)
    {
        if (!$tier) return null;
        
        $labels = [
            'standard' => 'Standard Plan',
            'premium' => 'Premium Plan',
            'deluxe' => 'Deluxe Plan',
            'non_member' => 'Non-Member'
        ];

        return $labels[$tier] ?? ucfirst(str_replace('_', ' ', $tier));
    }

    /**
     * Get status color for UI
     */
    private function getStatusColor($status)
    {
        return match($status) {
            'submitted' => 'text-blue-400',
            'reviewed' => 'text-yellow-400',
            'in_progress' => 'text-orange-400',
            'completed' => 'text-green-400',
            'cancelled' => 'text-red-400',
            default => 'text-gray-400'
        };
    }

    /**
     * Get priority color for UI
     */
    private function getPriorityColor($priority)
    {
        return match($priority) {
            'low' => 'text-green-400',
            'medium' => 'text-yellow-400',
            'high' => 'text-orange-400',
            'emergency' => 'text-red-400',
            default => 'text-gray-400'
        };
    }

    /**
     * Check if request is overdue
     */
    private function isRequestOverdue($request)
    {
        if (!$request->estimated_completion) {
            return false;
        }

        return now()->isAfter($request->estimated_completion) && $request->status !== 'completed';
    }

    /**
     * Get contact preference as a readable string
     */
    private function getContactPreferenceString($contactPreference)
    {
        if (!$contactPreference || !is_array($contactPreference)) {
            return 'Not specified';
        }

        $preferences = array_map(function($pref) {
            return match($pref) {
                'email' => 'Email',
                'phone' => 'Phone',
                'whatsapp' => 'WhatsApp',
                default => ucfirst($pref)
            };
        }, $contactPreference);

        return implode(', ', $preferences);
    }

    /**
     * Send request notification (placeholder for email service)
     */
    private function sendRequestNotification($request)
    {
        try {
            // Send email to user
            // Mail::to(auth()->user())->send(new RequestSubmittedMail($request));
            
            // Send notification to admin
            // Mail::to(config('app.admin_email'))->send(new NewRequestAdminMail($request));
            
            Log::info('Request notifications sent for request ID: ' . $request->id);
        } catch (\Exception $e) {
            Log::error('Failed to send request notifications: ' . $e->getMessage());
        }
    }

    /**
     * Get request statistics for dashboard
     */
    public function getStats()
    {
        $user = auth()->user();
        
        $stats = [
            'total' => $user->requests()->count(),
            'submitted' => $user->requests()->where('status', 'submitted')->count(),
            'reviewed' => $user->requests()->where('status', 'reviewed')->count(),
            'in_progress' => $user->requests()->where('status', 'in_progress')->count(),
            'completed' => $user->requests()->where('status', 'completed')->count(),
            'cancelled' => $user->requests()->where('status', 'cancelled')->count(),
            'overdue' => $user->requests()
                ->where('estimated_completion', '<', now())
                ->where('status', '!=', 'completed')
                ->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Download attachment file
     */
    public function downloadAttachment($requestId, $attachmentIndex)
    {
        $request = auth()->user()->requests()->findOrFail($requestId);
        
        if (!$request->attachments || !isset($request->attachments[$attachmentIndex])) {
            abort(404, 'Attachment not found');
        }

        $attachment = $request->attachments[$attachmentIndex];
        $filePath = storage_path('app/public/' . $attachment['path']);

        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath, $attachment['original_name']);
    }

    /**
     * Bulk operations on requests
     */
    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:cancel,delete',
            'request_ids' => 'required|array|min:1',
            'request_ids.*' => 'exists:requests,id'
        ]);

        $requests = auth()->user()->requests()->whereIn('id', $validated['request_ids']);

        switch ($validated['action']) {
            case 'cancel':
                $requests->whereNotIn('status', ['completed', 'cancelled'])
                        ->update([
                            'status' => 'cancelled',
                            'admin_notes' => 'Bulk cancelled by client on ' . now()->format('M j, Y g:i A')
                        ]);
                break;
                
            case 'delete':
                // Only allow deletion of cancelled or very old completed requests
                $requests->whereIn('status', ['cancelled'])
                        ->orWhere(function($q) {
                            $q->where('status', 'completed')
                              ->where('updated_at', '<', now()->subMonths(6));
                        })
                        ->delete();
                break;
        }

        return redirect()->route('requests.index')
            ->with('success', 'Bulk action completed successfully.');
    }
}