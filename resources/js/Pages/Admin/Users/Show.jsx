import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Show({ auth, user, recentRequests, recentAppointments }) {
    const formatDate = (date) => new Date(date).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <AdminLayout title={`User Details - ${user.name}`} auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-4">👤 User Info</h2>
                    <div className="text-white space-y-2">
                        <div><strong>Name:</strong> {user.name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone || '—'}</div>
                        <div><strong>Address:</strong> {user.address || '—'}</div>
                        <div><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</div>
                        <div><strong>Role:</strong> {user.role}</div>
                        <div><strong>Joined:</strong> {formatDate(user.created_at)}</div>
                        <div><strong>Notes:</strong> {user.notes || '—'}</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">📋 Recent Requests</h3>
                        {recentRequests.length ? (
                            <ul className="text-white space-y-2">
                                {recentRequests.map(req => (
                                    <li key={req.id} className="border-b border-white/10 pb-2">
                                        <strong>{req.subject}</strong><br />
                                        <span className="text-sm text-gray-300">{formatDate(req.created_at)} — {req.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No recent requests.</p>
                        )}
                    </div>

                    <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">📅 Recent Appointments</h3>
                        {recentAppointments.length ? (
                            <ul className="text-white space-y-2">
                                {recentAppointments.map(appt => (
                                    <li key={appt.id} className="border-b border-white/10 pb-2">
                                        <strong>{appt.title}</strong><br />
                                        <span className="text-sm text-gray-300">{formatDate(appt.appointment_date)} — {appt.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No recent appointments.</p>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <Link href={`/admin/users/${user.id}/edit`} className="text-sm text-blue-400 hover:underline">✏️ Edit User</Link>
                </div>
            </div>
        </AdminLayout>
    );
}