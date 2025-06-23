import React, { useState } from "react";
import ClientLayout from "../../../Layouts/ClientLayout";
import { useToast } from "../../../Context/ToastContext";
import { Link, router } from "@inertiajs/react";

export default function RequestIndex({
    auth,
    requests = [],
    stats = {},
    filters = {},
}) {
    const { info, success } = useToast();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Mock data if no real data provided
    const mockRequests =
        requests.length > 0
            ? requests
            : [
                  {
                      id: 1,
                      type: "document",
                      subject: "Medical Records Request",
                      description: "Need copies of my recent test results",
                      status: "completed",
                      priority: "medium",
                      created_at: "2024-06-20T10:30:00.000000Z",
                      updated_at: "2024-06-22T14:15:00.000000Z",
                      estimated_completion: "2024-06-25T17:00:00.000000Z",
                      attachments: ["test_results.pdf"],
                      contact_preference: ["email"],
                      admin_notes: "Documents sent via secure email",
                      type_label: "Document Request",
                      status_label: "Completed",
                      priority_label: "Medium",
                      status_color: "text-green-400",
                      priority_color: "text-yellow-400",
                  },
                  {
                      id: 2,
                      type: "appointment",
                      subject: "Schedule Follow-up Appointment",
                      description: "Need to schedule follow-up for next week",
                      status: "in_progress",
                      priority: "high",
                      created_at: "2024-06-21T09:15:00.000000Z",
                      updated_at: "2024-06-21T11:30:00.000000Z",
                      estimated_completion: "2024-06-24T12:00:00.000000Z",
                      attachments: [],
                      contact_preference: ["phone", "email"],
                      admin_notes: "Checking availability for next week",
                      type_label: "Schedule Appointment",
                      status_label: "In Progress",
                      priority_label: "High",
                      status_color: "text-orange-400",
                      priority_color: "text-orange-400",
                  },
                  {
                      id: 3,
                      type: "technical",
                      subject: "Cannot Access Documents",
                      description:
                          "Getting error when trying to download my reports",
                      status: "submitted",
                      priority: "medium",
                      created_at: "2024-06-22T16:45:00.000000Z",
                      updated_at: "2024-06-22T16:45:00.000000Z",
                      estimated_completion: "2024-06-25T16:45:00.000000Z",
                      attachments: ["screenshot.png"],
                      contact_preference: ["email"],
                      admin_notes: null,
                      type_label: "Technical Support",
                      status_label: "Submitted",
                      priority_label: "Medium",
                      status_color: "text-blue-400",
                      priority_color: "text-yellow-400",
                  },
                  {
                      id: 4,
                      type: "billing",
                      subject: "Question about invoice #12345",
                      description:
                          "Need clarification on billing charges for last month",
                      status: "reviewed",
                      priority: "low",
                      created_at: "2024-06-18T14:20:00.000000Z",
                      updated_at: "2024-06-19T09:45:00.000000Z",
                      estimated_completion: "2024-06-23T14:20:00.000000Z",
                      attachments: [],
                      contact_preference: ["email"],
                      admin_notes: "Finance team reviewing the invoice",
                      type_label: "Billing Inquiry",
                      status_label: "Reviewed",
                      priority_label: "Low",
                      status_color: "text-yellow-400",
                      priority_color: "text-green-400",
                  },
              ];

    const mockStats =
        Object.keys(stats).length > 0
            ? stats
            : {
                  total: 4,
                  submitted: 1,
                  in_progress: 1,
                  completed: 1,
                  reviewed: 1,
              };

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);

        if (value === "all" || value === "") {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        // Use Inertia to navigate with filters
        router.get(
            `/requests?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSearch = (searchTerm) => {
        handleFilter("search", searchTerm);
    };

    const openDetailsModal = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setSelectedRequest(null);
        setShowDetailsModal(false);
    };

    const getTypeIcon = (type) => {
        const icons = {
            document: "📄",
            appointment: "📅",
            medical: "🏥",
            technical: "💻",
            billing: "💳",
            general: "❓",
        };
        return icons[type] || "📋";
    };

    const getStatusBadge = (status, statusColor) => {
        const badges = {
            submitted: "bg-blue-500/20 border-blue-500/30",
            reviewed: "bg-yellow-500/20 border-yellow-500/30",
            in_progress: "bg-orange-500/20 border-orange-500/30",
            completed: "bg-green-500/20 border-green-500/30",
            cancelled: "bg-red-500/20 border-red-500/30",
        };

        return `${
            badges[status] || "bg-gray-500/20 border-gray-500/30"
        } ${statusColor}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <ClientLayout title="My Requests" auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            My Requests
                        </h2>
                        <p className="text-gray-300">
                            Track and manage all your service requests
                        </p>
                    </div>
                    <Link
                        href="/requests/create"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        <span>+</span>
                        New Request
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-white">
                            {mockStats.total}
                        </div>
                        <div className="text-gray-300 text-sm">Total</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {mockStats.submitted}
                        </div>
                        <div className="text-gray-300 text-sm">Submitted</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-orange-400">
                            {mockStats.in_progress}
                        </div>
                        <div className="text-gray-300 text-sm">In Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {mockStats.completed}
                        </div>
                        <div className="text-gray-300 text-sm">Completed</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                            {mockStats.reviewed || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Reviewed</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search requests..."
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
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="submitted">Submitted</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
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
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="document">Document</option>
                                <option value="appointment">Appointment</option>
                                <option value="medical">Medical</option>
                                <option value="technical">Technical</option>
                                <option value="billing">Billing</option>
                                <option value="general">General</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get("/requests")}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {mockRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Request
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Priority
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Created
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {mockRequests.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-white font-medium">
                                                        {request.subject}
                                                    </div>
                                                    <div className="text-gray-400 text-sm truncate max-w-xs">
                                                        {request.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-2">
                                                        {getTypeIcon(
                                                            request.type
                                                        )}
                                                    </span>
                                                    <span className="text-white text-sm">
                                                        {request.type_label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                        request.status,
                                                        request.status_color
                                                    )}`}
                                                >
                                                    {request.status_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-sm font-medium ${request.priority_color}`}
                                                >
                                                    {request.priority_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white text-sm">
                                                    {formatDate(
                                                        request.created_at
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            openDetailsModal(
                                                                request
                                                            )
                                                        }
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                    <Link
                                                        href={`/requests/${request.id}`}
                                                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                                    >
                                                        Full View
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
                                No requests found
                            </h3>
                            <p className="text-gray-400 mb-6">
                                You haven't submitted any requests yet.
                            </p>
                            <Link
                                href="/requests/create"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                            >
                                Submit Your First Request
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={closeDetailsModal}
                    >
                        <div
                            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    Request Details
                                </h3>
                                <button
                                    onClick={closeDetailsModal}
                                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Subject
                                    </label>
                                    <p className="text-white">
                                        {selectedRequest.subject}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <p className="text-white">
                                        {selectedRequest.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Type
                                        </label>
                                        <p className="text-white flex items-center">
                                            <span className="mr-2">
                                                {getTypeIcon(
                                                    selectedRequest.type
                                                )}
                                            </span>
                                            {selectedRequest.type_label}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Priority
                                        </label>
                                        <p
                                            className={`font-medium ${selectedRequest.priority_color}`}
                                        >
                                            {selectedRequest.priority_label}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                            selectedRequest.status,
                                            selectedRequest.status_color
                                        )}`}
                                    >
                                        {selectedRequest.status_label}
                                    </span>
                                </div>

                                {selectedRequest.attachments &&
                                    selectedRequest.attachments.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Attachments
                                            </label>
                                            <div className="space-y-2">
                                                {selectedRequest.attachments.map(
                                                    (file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center text-blue-400"
                                                        >
                                                            <span className="mr-2">
                                                                📎
                                                            </span>
                                                            {file}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {selectedRequest.admin_notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Admin Notes
                                        </label>
                                        <p className="text-white bg-white/5 p-3 rounded-lg">
                                            {selectedRequest.admin_notes}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="block text-gray-300">
                                            Created
                                        </label>
                                        <p className="text-white">
                                            {formatDate(
                                                selectedRequest.created_at
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300">
                                            Last Updated
                                        </label>
                                        <p className="text-white">
                                            {formatDate(
                                                selectedRequest.updated_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={closeDetailsModal}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/requests/${selectedRequest.id}`}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
