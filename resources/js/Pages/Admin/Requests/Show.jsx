import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Show({ auth, request }) {
    const [status, setStatus] = useState(request.status);
    const [internalNote, setInternalNote] = useState(request.internal_note || '');

    const handleUpdate = () => {
        router.patch(`/admin/requests/${request.id}`, {
            status,
            internal_note: internalNote
        });
    };

    const formatDate = (date) => new Date(date).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <AdminLayout title={`Request #${request.id}`} auth={auth}>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-4">📋 Request Details</h2>
                    <div className="text-white space-y-2">
                        <div><strong>Client:</strong> {request.user?.name}</div>
                        <div><strong>Subject:</strong> {request.subject}</div>
                        <div><strong>Description:</strong> {request.description}</div>
                        <div><strong>Created:</strong> {formatDate(request.created_at)}</div>
                    </div>
                </div>

                <div className="bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
                    <h3 className="text-white font-semibold">🛠️ Admin Actions</h3>

                    <div>
                        <label className="text-white block mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-white/20 text-white rounded-lg p-2"
                        >
                            <option value="submitted">Submitted</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-white block mb-1">Internal Note</label>
                        <textarea
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                            className="w-full bg-white/20 text-white rounded-lg p-2"
                            rows={3}
                        />
                    </div>

                    <div className="text-right">
                        <button onClick={handleUpdate} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
