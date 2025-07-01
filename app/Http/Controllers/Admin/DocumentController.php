<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with('user')->latest()->get();
        $users = User::orderBy('name')->get();

        return Inertia::render('Admin/Documents/Index', [
            'documents' => $documents->map(fn($d) => [
                'id' => $d->id,
                'title' => $d->title,
                'type' => $d->type,
                'user' => ['id' => $d->user?->id, 'name' => $d->user?->name],
                'file_url' => $d->file_url,
            ]),
            'users' => $users->map(fn($u) => ['id' => $u->id, 'name' => $u->name]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'type' => 'nullable|string|max:100',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $path = $request->file('file')->store('documents', 'public');

        Document::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
            'type' => $validated['type'],
            'file_path' => $path,
        ]);

        return redirect()->back()->with('success', 'Document uploaded.');
    }

    public function destroy($id)
    {
        $doc = Document::findOrFail($id);
        Storage::disk('public')->delete($doc->file_path);
        $doc->delete();

        return redirect()->back()->with('success', 'Document deleted.');
    }
}