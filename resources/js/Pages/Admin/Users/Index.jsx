import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link, router } from '@inertiajs/react';

export default function UsersIndex({ auth, users, stats, filters }) {
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

    const toggleUserStatus = (userId) => {
        router.patch(`/admin/users/${userId}/toggle-status`, {}, {
            onSuccess: () => {
                success('User status updated successfully');
            },
            onError: () => {
                error('Failed to update user status');
            }
        });
    };

    const deleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
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
            return '↕️';
        }
        return currentDirection === 'asc' ? '↑' : '↓';
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
                                    href="/admin/users/create"
                                    className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    <span>+</span>
                                    Add New User
                                </Link>
                                <Link
                                    href="/admin/users/export"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    📊 Export
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-white">{stats.total_users}</div>
                        <div className="text-gray-300 text-sm">Total Users</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.active_users}</div>
                        <div className="text-gray-300 text-sm">Active Users</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.new_this_month}</div>
                        <div className="text-gray-300 text-sm">New This Month</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.subscribers}</div>
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
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Role
                            </label>
                            <select
                                value={filters.role || 'all'}
                                onChange={(e) => handleFilter('role', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
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
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="unverified">Unverified</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get('/admin/users')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-yellow-300 font-medium">
                                {selectedUsers.length} users selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => info('Bulk email feature coming soon')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Send Email
                                </button>
                                <button
                                    onClick={() => info('Bulk export feature coming soon')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Export Selected
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedUsers([]);
                                        setShowBulkActions(false);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {users.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === users.data.length && users.data.length > 0}
                                                onChange={selectAllUsers}
                                                className="rounded border-gray-300"
                                            />
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                                            onClick={() => handleSort('name')}
                                        >
                                            User {getSortIcon('name')}
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                                            onClick={() => handleSort('email')}
                                        >
                                            Contact {getSortIcon('email')}
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
                                            className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            Joined {getSortIcon('created_at')}
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
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium">{user.name}</div>
                                                        <div className="text-gray-400 text-sm">ID: {user.id}</div>
                                                        {user.role === 'admin' && (
                                                            <div className="text-xs text-yellow-400 font-medium">Admin</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-white text-sm">{user.email}</div>
                                                    {user.phone && (
                                                        <div className="text-gray-400 text-sm">{user.phone}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(user)}`}
                                                >
                                                    {getStatusLabel(user)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.subscription_plan ? (
                                                    <span className="text-green-400 font-medium text-sm capitalize">
                                                        {user.subscription_plan}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No Plan</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="text-white">{user.requests_count} requests</div>
                                                    <div className="text-gray-400">{user.appointments_count} appointments</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm">
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}`}
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleUserStatus(user.id)}
                                                        className={`text-sm font-medium transition-colors ${
                                                            user.is_active 
                                                                ? 'text-yellow-400 hover:text-yellow-300' 
                                                                : 'text-green-400 hover:text-green-300'
                                                        }`}
                                                    >
                                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                                    >
                                                        Delete
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
                                    ? "No users match your current filters."
                                    : "No users have been added yet."}
                            </p>
                            <Link
                                href="/admin/users/create"
                                className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                Add First User
                            </Link>
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
            </div>
        </AdminLayout>
    );
}