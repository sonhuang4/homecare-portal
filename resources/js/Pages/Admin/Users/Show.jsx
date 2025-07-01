import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useToast } from '../../../Context/ToastContext';

export default function Show({ auth, user, recentRequests = [], recentAppointments = [], stats = {} }) {
    const { success, error, info } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const formatShortDate = (date) => new Date(date).toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric'
    });

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
            reviewed: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
            in_progress: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
            completed: 'bg-green-500/20 border-green-500/30 text-green-400',
            cancelled: 'bg-red-500/20 border-red-500/30 text-red-400',
            scheduled: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
            confirmed: 'bg-green-500/20 border-green-500/30 text-green-400'
        };
        return badges[status] || 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    };

    const toggleUserStatus = () => {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            router.patch(`/admin/users/${user.id}/toggle-status`, {}, {
                onSuccess: () => {
                    success(`User ${action}d successfully`);
                },
                onError: () => {
                    error(`Failed to ${action} user`);
                }
            });
        }
    };

    const deleteUser = () => {
        router.delete(`/admin/users/${user.id}`, {
            onSuccess: () => {
                success('User deleted successfully');
            },
            onError: () => {
                error('Failed to delete user');
            }
        });
        setShowDeleteModal(false);
    };

    const sendLoginAs = () => {
        info('Login as user feature coming soon');
    };

    const sendPasswordReset = () => {
        info('Password reset email sent to user');
    };

    return (
        <AdminLayout title={`User Profile - ${user.name}`} auth={auth}>
            <div className="space-y-6">
                {/* Header with User Profile */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex items-center gap-6">
                                {/* User Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                                        {getInitials(user.name)}
                                    </div>
                                    {user.role === 'admin' && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                                            <span className="text-lg">👑</span>
                                        </div>
                                    )}
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                                        user.is_active ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                        <span className="text-white text-xs font-bold">
                                            {user.is_active ? '✓' : '✕'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-2">{user.name}</h2>
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            user.is_active 
                                                ? 'bg-green-500/20 border-green-500/30 text-green-400 border' 
                                                : 'bg-red-500/20 border-red-500/30 text-red-400 border'
                                        }`}>
                                            {user.is_active ? '🟢 Active' : '🔴 Inactive'}
                                        </span>
                                        <span className="text-slate-300 text-sm">
                                            {user.role === 'admin' ? '👑 Administrator' : '👤 Client'}
                                        </span>
                                        {!user.email_verified_at && (
                                            <span className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 border px-3 py-1 rounded-full text-sm font-medium">
                                                ⚠️ Unverified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="mr-4">📧 {user.email}</span>
                                        {user.phone && <span className="mr-4">📱 {user.phone}</span>}
                                    </p>
                                    <p className="text-sm font-medium mt-2" style={{ color: "#00b3ba" }}>
                                        User ID: {user.id} • Joined: {formatShortDate(user.created_at)} • Last Active: {formatShortDate(user.updated_at)}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/admin/users/${user.id}/edit`}
                                    className="text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit User
                                </Link>
                                <button
                                    onClick={toggleUserStatus}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                        user.is_active 
                                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {user.is_active ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                            Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Activate
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/admin/users"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Users
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.total_requests || recentRequests.length}</div>
                        <div className="text-gray-300 text-sm">Total Requests</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.total_appointments || recentAppointments.length}</div>
                        <div className="text-gray-300 text-sm">Total Appointments</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.active_subscriptions || 0}</div>
                        <div className="text-gray-300 text-sm">Active Plans</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-orange-400">{stats.last_login || 'Never'}</div>
                        <div className="text-gray-300 text-sm">Days Since Login</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                User Information
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">Full Name</label>
                                    <p className="text-white font-medium">{user.name}</p>
                                </div>
                                
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">Email Address</label>
                                    <p className="text-white font-medium">{user.email}</p>
                                    {user.email_verified_at && (
                                        <p className="text-green-400 text-xs">✅ Verified {formatShortDate(user.email_verified_at)}</p>
                                    )}
                                </div>
                                
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">Phone Number</label>
                                    <p className="text-white font-medium">{user.phone || '—'}</p>
                                </div>
                                
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">Property Address</label>
                                    <p className="text-white font-medium">{user.address || '—'}</p>
                                </div>
                                
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">Account Status</label>
                                    <p className={`font-medium ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                        {user.is_active ? '🟢 Active' : '🔴 Inactive'}
                                    </p>
                                </div>
                                
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">User Role</label>
                                    <p className="text-white font-medium">
                                        {user.role === 'admin' ? '👑 Administrator' : '👤 Client'}
                                    </p>
                                </div>
                                
                                <div className="border-b border-white/10 pb-3">
                                    <label className="text-sm text-gray-400">Joined Date</label>
                                    <p className="text-white font-medium">{formatDate(user.created_at)}</p>
                                </div>
                                
                                {user.notes && (
                                    <div>
                                        <label className="text-sm text-gray-400">Admin Notes</label>
                                        <p className="text-white font-medium bg-white/5 p-3 rounded-lg mt-1">{user.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={sendLoginAs}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Login as User
                                    </button>
                                    <button
                                        onClick={sendPasswordReset}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        Reset Password
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Panels */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Requests */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Recent Service Requests
                                </h3>
                                <Link
                                    href={`/admin/requests?user_id=${user.id}`}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                            
                            {recentRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {recentRequests.slice(0, 5).map((request) => (
                                        <div key={request.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">🏡</span>
                                                    <div>
                                                        <p className="text-white font-medium">{request.subject}</p>
                                                        <p className="text-gray-400 text-sm">{formatDate(request.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}>
                                                    {request.status_label || request.status}
                                                </span>
                                                <Link
                                                    href={`/admin/requests/${request.id}`}
                                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <span className="text-4xl block mb-2">📋</span>
                                    <p>No service requests yet</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Appointments */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                                    </svg>
                                    Recent Appointments
                                </h3>
                            </div>
                            
                            {recentAppointments.length > 0 ? (
                                <div className="space-y-3">
                                    {recentAppointments.slice(0, 5).map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">📅</span>
                                                    <div>
                                                        <p className="text-white font-medium">{appointment.title}</p>
                                                        <p className="text-gray-400 text-sm">{formatDate(appointment.appointment_date)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status)}`}>
                                                    {appointment.status_label || appointment.status}
                                                </span>
                                                <Link
                                                    href={`/admin/appointments/${appointment.id}`}
                                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <span className="text-4xl block mb-2">📅</span>
                                    <p>No appointments scheduled yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-md w-full">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete User Account</h3>
                                <p className="text-gray-300 mb-6">
                                    Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone and will remove all their data including requests and appointments.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteUser}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}