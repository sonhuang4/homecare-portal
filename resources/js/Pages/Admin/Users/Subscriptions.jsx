import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Subscriptions({ auth, subscriptions }) {
    const [filter, setFilter] = useState('all');

    const filtered = subscriptions.filter(sub => {
        if (filter === 'all') return true;
        return sub.stripe_status === filter;
    });

    return (
        <AdminLayout title="Active Subscriptions" auth={auth}>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-white text-2xl font-bold">📋 Client Subscriptions</h2>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white/20 text-white p-2 rounded-lg"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="canceled">Canceled</option>
                        <option value="incomplete">Incomplete</option>
                        <option value="past_due">Past Due</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm text-gray-300">Client</th>
                                <th className="px-6 py-3 text-left text-sm text-gray-300">Email</th>
                                <th className="px-6 py-3 text-left text-sm text-gray-300">Plan</th>
                                <th className="px-6 py-3 text-left text-sm text-gray-300">Status</th>
                                <th className="px-6 py-3 text-left text-sm text-gray-300">Since</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filtered.length > 0 ? filtered.map(sub => (
                                <tr key={sub.id} className="hover:bg-white/5">
                                    <td className="px-6 py-3 text-white">{sub.user.name}</td>
                                    <td className="px-6 py-3 text-white">{sub.user.email}</td>
                                    <td className="px-6 py-3 text-white">{sub.price_id}</td>
                                    <td className="px-6 py-3 text-white capitalize">{sub.stripe_status}</td>
                                    <td className="px-6 py-3 text-white">{sub.created_at}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-400 py-6">No subscriptions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
