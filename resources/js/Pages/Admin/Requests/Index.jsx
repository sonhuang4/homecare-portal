import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useToast } from "../../../Context/ToastContext";

export default function RequestIndex({
    auth,
    requests = { data: [], links: [] },
    filters = {},
    stats = {},
}) {
    const { success, error, info } = useToast();
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);

        if (value === "all" || value === "") {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(
            `/admin/requests?${params.toString()}`,
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
            `/admin/requests?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleRequestSelect = (requestId) => {
        setSelectedRequests((prev) => {
            const updated = prev.includes(requestId)
                ? prev.filter((id) => id !== requestId)
                : [...prev, requestId];
            setShowBulkActions(updated.length > 0);
            return updated;
        });
    };

    const selectAllRequests = () => {
        const allRequestIds = requests.data.map((request) => request.id);
        setSelectedRequests(
            selectedRequests.length === allRequestIds.length
                ? []
                : allRequestIds
        );
        setShowBulkActions(selectedRequests.length !== allRequestIds.length);
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: "bg-blue-500/20 border-blue-500/30 text-blue-400",
            reviewed: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
            in_progress:
                "bg-orange-500/20 border-orange-500/30 text-orange-400",
            completed: "bg-green-500/20 border-green-500/30 text-green-400",
            cancelled: "bg-red-500/20 border-red-500/30 text-red-400",
        };
        return (
            badges[status] || "bg-gray-500/20 border-gray-500/30 text-gray-400"
        );
    };

    const getTypeIcon = (type) => {
        const icons = {
            document: "📄",
            appointment: "📅",
            medical: "🏥",
            technical: "🔧",
            billing: "💳",
            general: "📋",
            property_maintenance: "🏠",
            emergency_repair: "🚨",
        };
        return icons[type] || "📋";
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            low: "text-green-400",
            medium: "text-yellow-400",
            high: "text-orange-400",
            urgent: "text-red-400",
        };
        return badges[priority] || "text-gray-400";
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const bulkUpdateStatus = (status) => {
        if (selectedRequests.length === 0) return;

        router.patch(
            "/admin/requests/bulk-update",
            {
                request_ids: selectedRequests,
                status: status,
            },
            {
                onSuccess: () => {
                    success(
                        `${selectedRequests.length} requests updated to ${status}`
                    );
                    setSelectedRequests([]);
                    setShowBulkActions(false);
                },
                onError: () => {
                    error("Failed to update requests");
                },
            }
        );
    };

    return (
        <AdminLayout
            title="Service Requests Management - NWB Admin"
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
                                    <span className="mr-4 text-5xl">📋</span>
                                    Service Requests Management
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Manage all client service requests and
                                    support tickets
                                </p>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: "#00b3ba" }}
                                >
                                    Admin Dashboard • Request Management •
                                    Support System
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href="/admin/requests/export"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
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
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Export Data
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-white">
                            {stats.total || 0}
                        </div>
                        <div className="text-gray-300 text-sm">
                            Total Requests
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-blue-400">
                            {stats.submitted || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Submitted</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-orange-400">
                            {stats.in_progress || 0}
                        </div>
                        <div className="text-gray-300 text-sm">In Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-green-400">
                            {stats.completed || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Completed</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                        <div className="text-2xl font-bold text-red-400">
                            {stats.urgent || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Urgent</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-2">
                                Search Requests
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
                                    placeholder="Search by subject, description, client..."
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
                                <option value="submitted">🔵 Submitted</option>
                                <option value="reviewed">🟡 Reviewed</option>
                                <option value="in_progress">
                                    🟠 In Progress
                                </option>
                                <option value="completed">🟢 Completed</option>
                                <option value="cancelled">🔴 Cancelled</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Type
                            </label>
                            <select
                                value={filters.type || "all"}
                                onChange={(e) =>
                                    handleFilter("type", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="document">📄 Document</option>
                                <option value="appointment">
                                    📅 Appointment
                                </option>
                                <option value="technical">🔧 Technical</option>
                                <option value="billing">💳 Billing</option>
                                <option value="general">📋 General</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get("/admin/requests")}
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
                                {selectedRequests.length} requests selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => bulkUpdateStatus("reviewed")}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Mark as Reviewed
                                </button>
                                <button
                                    onClick={() =>
                                        bulkUpdateStatus("in_progress")
                                    }
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Mark in Progress
                                </button>
                                <button
                                    onClick={() =>
                                        bulkUpdateStatus("completed")
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                                >
                                    Mark Completed
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedRequests([]);
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

                {/* Requests Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {requests.data && requests.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedRequests.length ===
                                                        requests.data.length &&
                                                    requests.data.length > 0
                                                }
                                                onChange={selectAllRequests}
                                                className="rounded border-gray-300 bg-[#232424]"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Request Details
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Client
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Priority
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {requests.data.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRequests.includes(
                                                        request.id
                                                    )}
                                                    onChange={() =>
                                                        handleRequestSelect(
                                                            request.id
                                                        )
                                                    }
                                                    className="rounded border-gray-300 bg-[#232424]"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">
                                                    #{request.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">
                                                        {getTypeIcon(
                                                            request.type
                                                        )}
                                                    </span>
                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {request.subject}
                                                        </div>
                                                        <div className="text-gray-400 text-sm truncate max-w-xs">
                                                            {
                                                                request.description
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {request.type_label ||
                                                                request.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                                                        {request.user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium text-sm">
                                                            {request.user
                                                                ?.name ||
                                                                "Unknown User"}
                                                        </div>
                                                        <div className="text-gray-400 text-xs">
                                                            {
                                                                request.user
                                                                    ?.email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                        request.status
                                                    )}`}
                                                >
                                                    {request.status_label ||
                                                        request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-sm font-medium ${getPriorityBadge(
                                                        request.priority
                                                    )}`}
                                                >
                                                    {request.priority_label ||
                                                        request.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm">
                                                    {formatDate(
                                                        request.created_at
                                                    )}
                                                </div>
                                                {request.estimated_completion && (
                                                    <div className="text-gray-400 text-xs">
                                                        Est:{" "}
                                                        {formatDate(
                                                            request.estimated_completion
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/admin/requests/${request.id}`}
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                                    >
                                                        <svg
                                                            className="w-4 h-4 group-hover:scale-110 transition-transform"
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
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-medium text-white mb-2">
                                No service requests found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {Object.values(filters).some(
                                    (filter) => filter && filter !== "all"
                                )
                                    ? "No requests match your current filters. Try adjusting your search criteria."
                                    : "No service requests have been submitted yet."}
                            </p>
                            <div className="flex justify-center gap-3">
                                {Object.values(filters).some(
                                    (filter) => filter && filter !== "all"
                                ) && (
                                    <button
                                        onClick={() =>
                                            router.get("/admin/requests")
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

                {/* Pagination */}
                {requests.last_page > 1 && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between">
                            <div className="text-gray-300 text-sm">
                                Showing {requests.from} to {requests.to} of{" "}
                                {requests.total} requests
                            </div>
                            <div className="flex space-x-1">
                                {requests.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            link.active
                                                ? "text-white border"
                                                : link.url
                                                ? "text-gray-300 hover:text-white hover:bg-white/10"
                                                : "text-gray-500 cursor-not-allowed"
                                        }`}
                                        style={
                                            link.active
                                                ? {
                                                      backgroundColor:
                                                          "#00b3ba",
                                                      borderColor: "#00b3ba",
                                                  }
                                                : {}
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Request Management Guide */}
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
                        Request Management Guide
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Status Workflow:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • 🔵 <strong>Submitted:</strong> New request
                                    received
                                </li>
                                <li>
                                    • 🟡 <strong>Reviewed:</strong> Admin has
                                    reviewed
                                </li>
                                <li>
                                    • 🟠 <strong>In Progress:</strong> Being
                                    worked on
                                </li>
                                <li>
                                    • 🟢 <strong>Completed:</strong> Request
                                    fulfilled
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Priority Levels:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • 🔴 <strong>Urgent:</strong> Immediate
                                    attention
                                </li>
                                <li>
                                    • 🟠 <strong>High:</strong> Within 24 hours
                                </li>
                                <li>
                                    • 🟡 <strong>Medium:</strong> Within 48
                                    hours
                                </li>
                                <li>
                                    • 🟢 <strong>Low:</strong> Within 5 days
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">
                                Quick Actions:
                            </h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>
                                    • Use bulk actions for multiple requests
                                </li>
                                <li>
                                    • Filter by urgent priority for emergencies
                                </li>
                                <li>• Export data for reporting</li>
                                <li>• Update status to track progress</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
