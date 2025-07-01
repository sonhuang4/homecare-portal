import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create({ auth }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'client',
        is_active: true,
        notes: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/users', form);
    };

    return (
        <AdminLayout title="Create New User" auth={auth}>
            <div className="max-w-2xl mx-auto bg-white/10 p-6 rounded-xl border border-white/20">
                <h2 className="text-white text-2xl font-bold mb-6">➕ Create New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-white block mb-1">Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" required />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" required />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Phone</label>
                        <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Address</label>
                        <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Role</label>
                        <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white">
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-white block mb-1">Active</label>
                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="ml-2" />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" required />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Confirm Password</label>
                        <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" required />
                    </div>
                    <div>
                        <label className="text-white block mb-1">Notes</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full rounded-lg p-2 bg-white/20 text-white" rows={3} />
                    </div>
                    <div className="flex justify-between items-center">
                        <Link href="/admin/users" className="text-gray-400 hover:text-white">← Cancel</Link>
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}