import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useToast } from '../../Context/ToastContext';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ 
    auth, 
    stats, 
    recentUsers = [], 
    recentRequests = [], 
    recentAppointments = [] 
}) {
    const { info } = useToast();
    const [timeRange, setTimeRange] = useState('today');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const getUrgentItems = () => {
        const urgent = [];
        
        // Add emergency requests
        recentRequests.forEach(request => {
            if (request.priority === 'urgent' || request.priority === 'emergency') {
                urgent.push({
                    type: 'request',
                    id: request.id,
                    title: `🚨 ${request.subject}`,
                    subtitle: `Emergency request from ${request.user?.name}`,
                    time: request.created_at
                });
            }
        });

        // Add today's appointments
        recentAppointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.appointment_date);
            const today = new Date();
            if (appointmentDate.toDateString() === today.toDateString()) {
                urgent.push({
                    type: 'appointment',
                    id: appointment.id,
                    title: `📅 ${appointment.title}`,
                    subtitle: `Today at ${appointment.start_time} - ${appointment.user?.name}`,
                    time: appointment.appointment_date
                });
            }
        });

        return urgent.slice(0, 5);
    };

    return (
        <AdminLayout title="Dashboard Overview" auth={auth}>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-3">
                                    Welcome back, {auth.user.name}! 👋
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    NWB Homecare Admin Dashboard
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                    Manage your homecare business with powerful admin tools
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href="/admin/reports/generate"
                                    className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    📊 Generate Report
                                </Link>
                                <Link
                                    href="/admin/users/create"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    👤 Add User
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Dashboard Overview</h3>
                    <div className="flex items-center space-x-2">
                        {['today', 'week', 'month'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    timeRange === range
                                        ? 'text-white border'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                                style={timeRange === range ? { backgroundColor: "#00b3ba", borderColor: "#00b3ba" } : {}}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold text-white">{stats.total_users || 0}</p>
                                <p className="text-green-400 text-sm">+{stats.new_users_this_month || 0} this month</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Requests */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Active Requests</p>
                                <p className="text-3xl font-bold text-white">{stats.pending_requests || 0}</p>
                                <p className="text-yellow-400 text-sm">of {stats.total_requests || 0} total</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <span className="text-2xl">📋</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Upcoming Appointments</p>
                                <p className="text-3xl font-bold text-white">{stats.upcoming_appointments || 0}</p>
                                <p className="text-blue-400 text-sm">of {stats.total_appointments || 0} total</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-2xl">📅</span>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-medium">Monthly Revenue</p>
                                <p className="text-3xl font-bold text-white">${(stats.revenue_this_month || 0).toLocaleString()}</p>
                                <p className="text-green-400 text-sm">Billing system ready</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Urgent Items */}
                        {getUrgentItems().length > 0 && (
                            <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                                <h4 className="text-lg font-semibold text-red-300 mb-4 flex items-center">
                                    <span className="mr-2">🚨</span>
                                    Urgent Items ({getUrgentItems().length})
                                </h4>
                                <div className="space-y-3">
                                    {getUrgentItems().map((item, index) => (
                                        <div key={index} className="flex items-center justify-between bg-red-500/5 p-3 rounded-lg">
                                            <div>
                                                <p className="text-white font-medium">{item.title}</p>
                                                <p className="text-red-200 text-sm">{item.subtitle}</p>
                                            </div>
                                            <Link
                                                href={`/admin/${item.type}s/${item.id}`}
                                                className="text-red-300 hover:text-red-200 text-sm font-medium"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Requests */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Recent Service Requests</h4>
                                <Link
                                    href="/admin/requests"
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentRequests.slice(0, 5).map((request) => (
                                    <div key={request.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">🏡</span>
                                                <div>
                                                    <p className="text-white font-medium">{request.subject}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {request.user?.name} • {formatDate(request.created_at)}
                                                    </p>
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
                                {recentRequests.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <span className="text-4xl block mb-2">📋</span>
                                        No recent requests
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Appointments */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Recent Appointments</h4>
                                <Link
                                    href="/admin/appointments"
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentAppointments.slice(0, 5).map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">📅</span>
                                                <div>
                                                    <p className="text-white font-medium">{appointment.title}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {appointment.user?.name} • {formatDate(appointment.appointment_date)}
                                                    </p>
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
                                {recentAppointments.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <span className="text-4xl block mb-2">📅</span>
                                        No recent appointments
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions & Recent Users */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                <Link
                                    href="/admin/users/create"
                                    className="flex items-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all group"
                                >
                                    <span className="text-2xl mr-3">👤</span>
                                    <div>
                                        <p className="text-white font-medium group-hover:text-blue-300">Add New User</p>
                                        <p className="text-gray-400 text-sm">Create client or admin account</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/requests"
                                    className="flex items-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all group"
                                >
                                    <span className="text-2xl mr-3">📋</span>
                                    <div>
                                        <p className="text-white font-medium group-hover:text-orange-300">Manage Requests</p>
                                        <p className="text-gray-400 text-sm">Review pending requests</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/appointments"
                                    className="flex items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all group"
                                >
                                    <span className="text-2xl mr-3">📅</span>
                                    <div>
                                        <p className="text-white font-medium group-hover:text-green-300">View Schedule</p>
                                        <p className="text-gray-400 text-sm">Manage appointments</p>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => info('Emergency dispatch system ready')}
                                    className="w-full flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all group"
                                >
                                    <span className="text-2xl mr-3">🚨</span>
                                    <div className="text-left">
                                        <p className="text-white font-medium group-hover:text-red-300">Emergency Dispatch</p>
                                        <p className="text-gray-400 text-sm">24/7 emergency response</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Users */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">Recent Users</h4>
                                <Link
                                    href="/admin/users"
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentUsers.slice(0, 5).map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{user.name}</p>
                                                <p className="text-gray-400 text-xs">{formatDate(user.created_at)}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/admin/users/${user.id}`}
                                            className="text-blue-400 hover:text-blue-300 text-xs"
                                        >
                                            View
                                        </Link>
                                    </div>
                                ))}
                                {recentUsers.length === 0 && (
                                    <div className="text-center py-4 text-gray-400">
                                        <span className="text-2xl block mb-1">👥</span>
                                        <span className="text-xs">No recent users</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-lg font-semibold text-white mb-4">System Status</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">Database</span>
                                    <span className="text-green-400 text-sm flex items-center">
                                        🟢 Online
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">WhatsApp API</span>
                                    <span className="text-green-400 text-sm flex items-center">
                                        🟢 Connected
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">Billing System</span>
                                    <span className="text-yellow-400 text-sm flex items-center">
                                        🟡 Ready
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">Emergency Line</span>
                                    <span className="text-green-400 text-sm flex items-center">
                                        🟢 Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}