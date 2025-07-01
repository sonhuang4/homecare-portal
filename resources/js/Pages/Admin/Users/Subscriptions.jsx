import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useToast } from '../../../Context/ToastContext';

export default function Subscriptions({ 
    auth, 
    subscriptions = [], 
    filters = {},
    stats = {}
}) {
    const { success, error, info } = useToast();
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);

        if (value === "all" || value === "") {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(
            `/admin/subscriptions?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearch = (searchTerm) => {
        const params = new URLSearchParams(window.location.search);

        if (searchTerm === "") {
            params.delete("search");
        } else {
            params.set("search", searchTerm);
        }

        router.get(
            `/admin/subscriptions?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSubscriptionSelect = (subscriptionId) => {
        setSelectedSubscriptions((prev) => {
            const updated = prev.includes(subscriptionId)
                ? prev.filter((id) => id !== subscriptionId)
                : [...prev, subscriptionId];
            setShowBulkActions(updated.length > 0);
            return updated;
        });
    };

    const selectAllSubscriptions = () => {
        const allSubscriptionIds = subscriptions.map((subscription) => subscription.id);
        setSelectedSubscriptions(
            selectedSubscriptions.length === allSubscriptionIds.length
                ? []
                : allSubscriptionIds
        );
        setShowBulkActions(selectedSubscriptions.length !== allSubscriptionIds.length);
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: "bg-green-500/20 border-green-500/30 text-green-400",
            canceled: "bg-red-500/20 border-red-500/30 text-red-400",
            incomplete: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
            incomplete_expired: "bg-orange-500/20 border-orange-500/30 text-orange-400",
            past_due: "bg-red-500/20 border-red-500/30 text-red-400",
            trialing: "bg-blue-500/20 border-blue-500/30 text-blue-400",
            unpaid: "bg-gray-500/20 border-gray-500/30 text-gray-400",
        };
        return (
            badges[status] || "bg-gray-500/20 border-gray-500/30 text-gray-400"
        );
    };

    const getStatusIcon = (status) => {
        const icons = {
            active: "✅",
            canceled: "❌",
            incomplete: "⏳",
            incomplete_expired: "🔴",
            past_due: "⚠️",
            trialing: "🆓",
            unpaid: "💸",
        };
        return icons[status] || "❓";
    };

    const getPlanBadge = (priceId) => {
        // You can customize this based on your actual price IDs
        const plans = {
            'price_basic': "bg-blue-500/20 border-blue-500/30 text-blue-400",
            'price_premium': "bg-purple-500/20 border-purple-500/30 text-purple-400",
            'price_pro': "bg-gold-500/20 border-gold-500/30 text-yellow-400",
        };
        return plans[priceId] || "bg-gray-500/20 border-gray-500/30 text-gray-400";
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatPlanName = (priceId) => {
        // Customize based on your actual price IDs
        const planNames = {
            'price_basic': 'Basic Plan',
            'price_premium': 'Premium Plan', 
            'price_pro': 'Professional Plan',
        };
        return planNames[priceId] || priceId || 'Unknown Plan';
    };

    const bulkCancelSubscriptions = () => {
        if (selectedSubscriptions.length === 0) return;

        if (confirm(`Are you sure you want to cancel ${selectedSubscriptions.length} subscriptions?`)) {
            router.patch(
                "/admin/subscriptions/bulk-cancel",
                {
                    subscription_ids: selectedSubscriptions,
                },
                {
                    onSuccess: () => {
                        success(
                            `${selectedSubscriptions.length} subscriptions cancelled successfully`
                        );
                        setSelectedSubscriptions([]);
                        setShowBulkActions(false);
                    },
                    onError: () => {
                        error("Failed to cancel subscriptions");
                    },
                }
            );
        }
    };

    // Filter subscriptions based on current filters
    const filteredSubscriptions = subscriptions.filter(sub => {
        if (filters.status && filters.status !== 'all' && sub.stripe_status !== filters.status) {
            return false;
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                sub.user.name.toLowerCase().includes(searchLower) ||
                sub.user.email.toLowerCase().includes(searchLower) ||
                sub.price_id.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <AdminLayout
            title="Subscription Management - NWB Admin"
            auth={auth}
        >
            <div className="space-y-6">
                {/* Header */}
                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)",
                    }}
                >
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
                                    <span className="mr-4 text-5xl">💳</span>
                                    Subscription Management
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Monitor and manage all client subscriptions and billing
                                </p>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: "#00b3ba" }}
                                >
                                    Admin Dashboard • Subscription Management • Billing System
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-white">
                            {stats.total || subscriptions.length}
                        </div>
                        <div className="text-gray-300 text-sm">
                            Total Subscriptions
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-green-400">
                            {stats.active || subscriptions.filter(s => s.stripe_status === 'active').length}
                        </div>
                        <div className="text-gray-300 text-sm">Active</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-blue-400">
                            {stats.trialing || subscriptions.filter(s => s.stripe_status === 'trialing').length}
                        </div>
                        <div className="text-gray-300 text-sm">Trialing</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-yellow-400">
                            {stats.incomplete || subscriptions.filter(s => s.stripe_status === 'incomplete').length}
                        </div>
                        <div className="text-gray-300 text-sm">Incomplete</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-orange-400">
                            {stats.past_due || subscriptions.filter(s => s.stripe_status === 'past_due').length}
                        </div>
                        <div className="text-gray-300 text-sm">Past Due</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-red-400">
                            {stats.canceled || subscriptions.filter(s => s.stripe_status === 'canceled').length}
                        </div>
                        <div className="text-gray-300 text-sm">Canceled</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-2">
                                Search Subscriptions
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by client name, email, plan..."
                                    defaultValue={filters.search || ""}
                                    onChange={(e) => {
                                        clearTimeout(window.searchTimeout);
                                        window.searchTimeout = setTimeout(
                                            () => {
                                                handleSearch(e.target.value);
                                            },
                                            300
                                        );
                                    }}
                                    className="w-full pl-10 px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status || "all"}
                                onChange={(e) =>
                                    handleFilter("status", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">✅ Active</option>
                                <option value="trialing">🆓 Trialing</option>
                                <option value="incomplete">⏳ Incomplete</option>
                                <option value="past_due">⚠️ Past Due</option>
                                <option value="canceled">❌ Canceled</option>
                                <option value="unpaid">💸 Unpaid</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get("/admin/subscriptions")}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
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
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {selectedSubscriptions.length} subscriptions selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={bulkCancelSubscriptions}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Cancel Selected
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedSubscriptions([]);
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

                {/* Subscriptions Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {filteredSubscriptions && filteredSubscriptions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedSubscriptions.length ===
                                                        filteredSubscriptions.length &&
                                                    filteredSubscriptions.length > 0
                                                }
                                                onChange={selectAllSubscriptions}
                                                className="rounded border-gray-300 bg-[#232424]"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Client Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Plan
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredSubscriptions.map((subscription) => (
                                        <tr
                                            key={subscription.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubscriptions.includes(
                                                        subscription.id
                                                    )}
                                                    onChange={() =>
                                                        handleSubscriptionSelect(
                                                            subscription.id
                                                        )
                                                    }
                                                    className="rounded border-gray-300 bg-[#232424]"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">
                                                    #{subscription.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                                                        {subscription.user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium text-sm">
                                                            {subscription.user?.name ||
                                                                "Unknown User"}
                                                        </div>
                                                        <div className="text-gray-400 text-xs">
                                                            {subscription.user?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPlanBadge(
                                                        subscription.price_id
                                                    )}`}
                                                >
                                                    💳 {formatPlanName(subscription.price_id)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                        subscription.stripe_status
                                                    )}`}
                                                >
                                                    <span className="mr-1">
                                                        {getStatusIcon(subscription.stripe_status)}
                                                    </span>
                                                    {subscription.stripe_status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm">
                                                    {formatDate(subscription.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/admin/subscriptions/${subscription.id}`}
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                                        title="View Details"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    </Link>
                                                    {subscription.stripe_status === 'active' && (
                                                        <Link
                                                            href={`/admin/subscriptions/${subscription.id}/cancel`}
                                                            method="patch"
                                                            as="button"
                                                            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                                            title="Cancel Subscription"
                                                            onClick={(e) => {
                                                                if (!confirm('Are you sure you want to cancel this subscription?')) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💳</div>
                            <h3 className="text-xl font-medium text-white mb-2">
                                No subscriptions found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {Object.values(filters).some(
                                    (filter) => filter && filter !== "all"
                                )
                                    ? "No subscriptions match your current filters. Try adjusting your search criteria."
                                    : "No active subscriptions found in the system."}
                            </p>
                            <div className="flex justify-center gap-3">
                                {Object.values(filters).some(
                                    (filter) => filter && filter !== "all"
                                ) && (
                                    <button
                                        onClick={() =>
                                            router.get("/admin/subscriptions")
                                        }
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Subscription Management Guide */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Subscription Management Guide
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Subscription Status:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • ✅ <strong>Active:</strong> Subscription is current and paid
                                </li>
                                <li>
                                    • 🆓 <strong>Trialing:</strong> In free trial period
                                </li>
                                <li>
                                    • ⏳ <strong>Incomplete:</strong> Payment setup incomplete
                                </li>
                                <li>
                                    • ⚠️ <strong>Past Due:</strong> Payment failed, retry in progress
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Plan Types:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • 💳 <strong>Basic:</strong> Standard features
                                </li>
                                <li>
                                    • 💎 <strong>Premium:</strong> Enhanced features
                                </li>
                                <li>
                                    • 🏆 <strong>Professional:</strong> Full access
                                </li>
                                <li>
                                    • 🔧 <strong>Custom:</strong> Enterprise solutions
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Quick Actions:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • Use bulk actions for multiple subscriptions
                                </li>
                                <li>
                                    • Filter by status to identify issues
                                </li>
                                <li>• Monitor trial conversions and renewals</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}