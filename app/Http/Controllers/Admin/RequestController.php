<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Request as ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::with('user');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $requests = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Requests/Index', [
            'requests' => $requests,
            'filters' => [
                'status' => $request->status ?? 'all'
            ]
        ]);
    }

    public function show($id)
    {
        $request = ServiceRequest::with('user')->findOrFail($id);

        return Inertia::render('Admin/Requests/Show', [
            'request' => $request
        ]);
    }

    public function update(Request $req, $id)
    {
        $request = ServiceRequest::findOrFail($id);

        $request->update($req->only(['status', 'internal_note']));

        return back()->with('success', 'Request updated successfully.');
    }
}