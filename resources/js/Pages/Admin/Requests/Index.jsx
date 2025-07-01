import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function RequestIndex({ auth, requests, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        router.get('/admin/requests', { ...filters, status: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatDate = (date) => new Date(date).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <AdminLayout title="Manage Requests" auth={auth}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-white text-2xl font-bold">📋 All Service Requests</h2>
                    <select value={statusFilter} onChange={handleStatusChange} className="bg-white/20 text-white rounded-lg p-2">
                        <option value="all">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">ID</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Client</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Subject</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Date</th>
                                <th className="px-6 py-4 text-left text-sm text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {requests.data.map((req) => (
                                <tr key={req.id} className="hover:bg-white/5">
                                    <td className="px-6 py-4 text-white">#{req.id}</td>
                                    <td className="px-6 py-4 text-white">{req.user?.name}</td>
                                    <td className="px-6 py-4 text-white">{req.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">{formatDate(req.created_at)}</td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/requests/${req.id}`} className="text-blue-400 hover:underline text-sm">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {requests.links.length > 3 && (
                    <div className="text-center pt-4">
                        {requests.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || ''}
                                className={`px-3 py-1 mx-1 text-sm rounded ${link.active ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}