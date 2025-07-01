import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link, router } from '@inertiajs/react';

export default function UsersIndex({ auth, users = { data: [], links: [] }, stats = {}, filters = {} }) {
    const { success, error, info, warning } = useToast();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);
        
        if (value === 'all' || value === '') {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(`/admin/users?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (searchTerm) => {
        const params = new URLSearchParams(window.location.search);
        
        if (searchTerm === '') {
            params.delete('search');
        } else {
            params.set('search', searchTerm);
        }

        router.get(`/admin/users?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSort = (column) => {
        const params = new URLSearchParams(window.location.search);
        const currentSort = params.get('sort');
        const currentDirection = params.get('direction');
        
        if (currentSort === column) {
            // Toggle direction
            params.set('direction', currentDirection === 'asc' ? 'desc' : 'asc');
        } else {
            params.set('sort', column);
            params.set('direction', 'asc');
        }

        router.get(`/admin/users?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const toggleUserStatus = (userId, currentStatus) => {
        const action = currentStatus ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            router.patch(`/admin/users/${userId}/toggle-status`, {}, {
                onSuccess: () => {
                    success(`User ${action}d successfully`);
                },
                onError: () => {
                    error(`Failed to ${action} user`);
                }
            });
        }
    };

    const deleteUser = (userId, userName) => {
        if (confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone and will remove all their data including requests and appointments.`)) {
            router.delete(`/admin/users/${userId}`, {
                onSuccess: () => {
                    success('User deleted successfully');
                },
                onError: () => {
                    error('Failed to delete user');
                }
            });
        }
    };

    const handleUserSelect = (userId) => {
        setSelectedUsers(prev => {
            const updated = prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId];
            setShowBulkActions(updated.length > 0);
            return updated;
        });
    };

    const selectAllUsers = () => {
        const allUserIds = users.data.map(user => user.id);
        setSelectedUsers(selectedUsers.length === allUserIds.length ? [] : allUserIds);
        setShowBulkActions(selectedUsers.length !== allUserIds.length);
    };

    const getStatusBadge = (user) => {
        if (!user.is_active) {
            return 'bg-red-500/20 border-red-500/30 text-red-400';
        }
        if (!user.email_verified_at) {
            return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
        }
        return 'bg-green-500/20 border-green-500/30 text-green-400';
    };

    const getStatusLabel = (user) => {
        if (!user.is_active) return 'Inactive';
        if (!user.email_verified_at) return 'Unverified';
        return 'Active';
    };

    const getStatusIcon = (user) => {
        if (!user.is_active) return '🔴';
        if (!user.email_verified_at) return '🟡';
        return '🟢';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getSortIcon = (column) => {
        const currentSort = filters.sort;
        const currentDirection = filters.direction;
        
        if (currentSort !== column) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return currentDirection === 'asc' ? (
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
        );
    };

    const getUserAvatar = (user) => {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold mr-3 relative">
                {user.name.charAt(0).toUpperCase()}
                {user.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-xs">👑</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout title="User Management - NWB Admin" auth={auth}>
            <div className="space-y-6">
                {/* Header */}
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
                                <h2 className="text-4xl font-bold text-white mb-3 flex items-center">
                                    <span className="mr-4 text-5xl">👥</span>
                                    User Management
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Manage NWB homecare clients and their accounts
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                    Admin Dashboard • User Control Panel • Account Management
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href="/admin/users/export"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Users
                                </Link>
                                <Link
                                    href="/admin/users/create"
                                    className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add New User
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-white">{stats.total_users || 0}</div>
                        <div className="text-gray-300 text-sm">Total Users</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-green-400">{stats.active_users || 0}</div>
                        <div className="text-gray-300 text-sm">Active Users</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-blue-400">{stats.new_this_month || 0}</div>
                        <div className="text-gray-300 text-sm">New This Month</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-purple-400">{stats.subscribers || 0}</div>
                        <div className="text-gray-300 text-sm">Subscribers</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-2">
                                Search Users
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    defaultValue={filters.search || ""}
                                    onChange={(e) => {
                                        clearTimeout(window.searchTimeout);
                                        window.searchTimeout = setTimeout(() => {
                                            handleSearch(e.target.value);
                                        }, 300);
                                    }}
                                    className="w-full pl-10 px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Role
                            </label>
                            <select
                                value={filters.role || 'all'}
                                onChange={(e) => handleFilter('role', e.target.value)}
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="client">👤 Client</option>
                                <option value="admin">👑 Admin</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">🟢 Active</option>
                                <option value="inactive">🔴 Inactive</option>
                                <option value="unverified">🟡 Unverified</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get('/admin/users')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-medium flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {selectedUsers.length} users selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => info('Bulk email feature coming soon')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Send Email
                                </button>
                                <button
                                    onClick={() => info('Bulk export feature coming soon')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Selected
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedUsers([]);
                                        setShowBulkActions(false);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {users.data && users.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === users.data.length && users.data.length > 0}
                                                onChange={selectAllUsers}
                                                className="rounded border-gray-300 bg-[#232424]"
                                            />
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-2">
                                                User {getSortIcon('name')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                                            onClick={() => handleSort('email')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Contact {getSortIcon('email')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Subscription
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Activity
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Joined {getSortIcon('created_at')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleUserSelect(user.id)}
                                                    className="rounded border-gray-300 bg-[#232424]"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getUserAvatar(user)}
                                                    <div>
                                                        <div className="text-white font-medium">{user.name}</div>
                                                        <div className="text-gray-400 text-sm">ID: {user.id}</div>
                                                        {user.role === 'admin' && (
                                                            <div className="text-xs text-yellow-400 font-medium flex items-center gap-1">
                                                                👑 Administrator
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-white text-sm flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(user)}`}
                                                >
                                                    {getStatusIcon(user)} {getStatusLabel(user)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.subscription_plan ? (
                                                    <span className="text-green-400 font-medium text-sm capitalize flex items-center gap-1">
                                                        💎 {user.subscription_plan}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No Plan</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="text-white flex items-center gap-1">
                                                        📋 {user.requests_count || 0} requests
                                                    </div>
                                                    <div className="text-gray-400 flex items-center gap-1">
                                                        📅 {user.appointments_count || 0} appointments
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm">
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-1">
                                                    {/* View Button */}
                                                    <Link
                                                        href={`/admin/users/${user.id}`}
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all group"
                                                        title="View User Details"
                                                    >
                                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>

                                                    {/* Edit Button */}
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all group"
                                                        title="Edit User"
                                                    >
                                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>

                                                    {/* Toggle Status Button */}
                                                    <button
                                                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                        className={`p-2 rounded-lg transition-all group ${
                                                            user.is_active 
                                                                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10' 
                                                                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                                        }`}
                                                        title={user.is_active ? 'Deactivate User' : 'Activate User'}
                                                    >
                                                        {user.is_active ? (
                                                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => deleteUser(user.id, user.name)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all group"
                                                        title="Delete User"
                                                    >
                                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-xl font-medium text-white mb-2">
                                No users found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {Object.values(filters).some(filter => filter && filter !== 'all') 
                                    ? "No users match your current filters. Try adjusting your search criteria."
                                    : "No users have been added yet. Start by creating your first user account."}
                            </p>
                            <div className="flex justify-center gap-3">
                                <Link
                                    href="/admin/users/create"
                                    className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add First User
                                </Link>
                                {Object.values(filters).some(filter => filter && filter !== 'all') && (
                                    <button
                                        onClick={() => router.get('/admin/users')}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div className="text-gray-300 text-sm">
                                Showing {users.from} to {users.to} of {users.total} users
                            </div>
                            <div className="flex space-x-1">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            link.active
                                                ? 'text-white border'
                                                : link.url
                                                ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                                : 'text-gray-500 cursor-not-allowed'
                                        }`}
                                        style={link.active ? { backgroundColor: "#00b3ba", borderColor: "#00b3ba" } : {}}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Footer */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Admin Actions</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link
                            href="/admin/users/create"
                            className="flex items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all group"
                        >
                            <svg className="w-6 h-6 text-blue-400 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <div>
                                <p className="text-white font-medium">Add New User</p>
                                <p className="text-gray-400 text-sm">Create client account</p>
                            </div>
                        </Link>

                        <button
                            onClick={() => info('Bulk import feature coming soon')}
                            className="flex items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all group"
                        >
                            <svg className="w-6 h-6 text-green-400 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            <div>
                                <p className="text-white font-medium">Import Users</p>
                                <p className="text-gray-400 text-sm">Bulk CSV import</p>
                            </div>
                        </button>

                        <Link
                            href="/admin/users/export"
                            className="flex items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all group"
                        >
                            <svg className="w-6 h-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <p className="text-white font-medium">Export Users</p>
                                <p className="text-gray-400 text-sm">Download CSV report</p>
                            </div>
                        </Link>

                        <button
                            onClick={() => info('User analytics dashboard coming soon')}
                            className="flex items-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all group"
                        >
                            <svg className="w-6 h-6 text-orange-400 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <div>
                                <p className="text-white font-medium">User Analytics</p>
                                <p className="text-gray-400 text-sm">View detailed stats</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}