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

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);

        if (value === "all" || value === "") {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(`/requests?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
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
            medical: "🏥", // Will be converted to property_maintenance
            technical: "🔧",
            billing: "💳",
            general: "📋",
            // Construction-specific additions
            property_maintenance: "🏠",
            emergency_repair: "🚨",
            inspection: "📋",
            consultation: "👨‍🔧"
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

        return `${badges[status] || "bg-gray-500/20 border-gray-500/30"} ${statusColor}`;
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

    // Convert medical terminology to construction terms
    const getConstructionTypeLabel = (type, typeLabel) => {
        const constructionLabels = {
            'document': 'Property Documents',
            'appointment': 'Schedule Service',
            'medical': 'Property Assessment', // Converting medical to property assessment
            'technical': 'Technical Support',
            'billing': 'Billing Inquiry',
            'general': 'General Support'
        };
        return constructionLabels[type] || typeLabel;
    };

    return (
        <ClientLayout title="My Service Requests - NWB Homecare" auth={auth}>
            <div className="space-y-6">
                {/* Enhanced Header with NWB Branding */}
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
                                <h2 className="text-4xl font-bold text-white flex items-center">
                                    <span className="mr-4 text-5xl">📋</span>
                                    My Service Requests
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Track your property maintenance and support requests
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                    New Ways To Build (NWB) • Licensed & Insured • Serving LA since 2014
                                </p>
                            </div>
                            <Link
                                href="/requests/create"
                                className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                <span>+</span>
                                New Request
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact Alert */}
                <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-1">24/7 Emergency Property Service</h3>
                            <p className="text-slate-300 text-sm mb-2">
                                For urgent property emergencies (water leaks, electrical failures, security breaches):
                            </p>
                            <a 
                                href="tel:+13235554663" 
                                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 text-sm"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                📞 (323) 555-HOME - Emergency Hotline
                            </a>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-white">
                            {stats.total || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Total Requests</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {stats.submitted || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Submitted</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-orange-400">
                            {stats.in_progress || 0}
                        </div>
                        <div className="text-gray-300 text-sm">In Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {stats.completed || 0}
                        </div>
                        <div className="text-gray-300 text-sm">Completed</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                            {stats.reviewed || 0}
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
                                Search Requests
                            </label>
                            <input
                                type="text"
                                placeholder="Search subject, description..."
                                defaultValue={filters.search || ""}
                                onChange={(e) => {
                                    clearTimeout(window.searchTimeout);
                                    window.searchTimeout = setTimeout(() => {
                                        handleSearch(e.target.value);
                                    }, 300);
                                }}
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Request Status
                            </label>
                            <select
                                value={filters.status || "all"}
                                onChange={(e) => handleFilter("status", e.target.value)}
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                Request Type
                            </label>
                            <select
                                value={filters.type || "all"}
                                onChange={(e) => handleFilter("type", e.target.value)}
                                className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="document">Property Documents</option>
                                <option value="appointment">Schedule Service</option>
                                <option value="medical">Property Assessment</option>
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing Inquiry</option>
                                <option value="general">General Support</option>
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

                {/* Requests Grid */}
                {requests.length > 0 ? (
                    <div className="grid gap-6">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Request Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{getTypeIcon(request.type)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-xl font-bold text-white">{request.subject}</h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(request.status, request.status_color)}`}>
                                                        {request.status_label}
                                                    </span>
                                                    <span className={`text-sm font-medium ${request.priority_color}`}>
                                                        {request.priority_label} Priority
                                                    </span>
                                                </div>
                                                
                                                <p className="text-gray-300 mb-3">{request.description}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">🏷️</span>
                                                            <span>{getConstructionTypeLabel(request.type, request.type_label)}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">📅</span>
                                                            <span>Created: {formatDate(request.created_at)}</span>
                                                        </div>
                                                        {request.estimated_completion && (
                                                            <div className="flex items-center text-gray-300">
                                                                <span className="mr-2">⏰</span>
                                                                <span>Est. Completion: {request.estimated_completion_human || formatDate(request.estimated_completion)}</span>
                                                            </div>
                                                        )}
                                                        {request.contact_preference && request.contact_preference.length > 0 && (
                                                            <div className="flex items-start text-gray-300">
                                                                <span className="mr-2 mt-0.5">📞</span>
                                                                <span>Contact: {request.contact_preference.join(', ')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {request.phone && (
                                                            <div className="flex items-center text-gray-300">
                                                                <span className="mr-2">📱</span>
                                                                <span>{request.phone}</span>
                                                            </div>
                                                        )}
                                                        {request.preferred_contact_time && (
                                                            <div className="flex items-center text-gray-300">
                                                                <span className="mr-2">🕐</span>
                                                                <span>Preferred: {request.preferred_contact_time}</span>
                                                            </div>
                                                        )}
                                                        {request.attachments && request.attachments.length > 0 && (
                                                            <div className="flex items-start text-gray-300">
                                                                <span className="mr-2 mt-0.5">📎</span>
                                                                <span className="flex-1 text-xs">
                                                                    {request.attachments.length} attachment(s)
                                                                </span>
                                                            </div>
                                                        )}
                                                        {request.is_overdue && (
                                                            <div className="flex items-start text-red-400">
                                                                <span className="mr-2 mt-0.5">⚠️</span>
                                                                <span className="flex-1 text-xs font-medium">
                                                                    Overdue
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                                        <Link
                                            href={`/requests/${request.id}`}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                        >
                                            View Details
                                        </Link>
                                        
                                        {request.status === 'completed' && (
                                            <button
                                                onClick={() => info('Feedback feature coming soon!')}
                                                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                                style={{ backgroundColor: "#00b3ba" }}
                                            >
                                                Leave Review
                                            </button>
                                        )}
                                        
                                        {request.status === 'submitted' && (
                                            <Link
                                                href={`/requests/create?duplicate=${request.id}`}
                                                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                                style={{ backgroundColor: "#00b3ba" }}
                                            >
                                                Duplicate Request
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-medium text-white mb-2">No service requests found</h3>
                        <p className="text-gray-400 mb-6">
                            {Object.keys(filters).some(key => filters[key] && filters[key] !== 'all') 
                                ? "No requests match your current filters. Try adjusting your search criteria."
                                : "You don't have any property service requests yet."}
                        </p>
                        <Link
                            href="/requests/create"
                            className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                            style={{ backgroundColor: "#00b3ba" }}
                        >
                            Submit Your First Request
                        </Link>
                    </div>
                )}

                {/* Quick Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeDetailsModal}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">Request Details</h3>
                                <button
                                    onClick={closeDetailsModal}
                                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{getTypeIcon(selectedRequest.type)}</span>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{selectedRequest.subject}</h4>
                                        <p className="text-gray-300">{getConstructionTypeLabel(selectedRequest.type, selectedRequest.type_label)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                    <p className="text-white">{selectedRequest.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedRequest.status, selectedRequest.status_color)}`}>
                                            {selectedRequest.status_label}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                                        <p className={`font-medium ${selectedRequest.priority_color}`}>
                                            {selectedRequest.priority_label}
                                        </p>
                                    </div>
                                </div>

                                {selectedRequest.contact_preference && selectedRequest.contact_preference.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Contact Preferences</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRequest.contact_preference.map((preference, index) => (
                                                <span key={index} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-sm capitalize">
                                                    {preference}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                        <p className="text-white">{selectedRequest.phone}</p>
                                    </div>
                                )}

                                {selectedRequest.preferred_contact_time && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Preferred Contact Time</label>
                                        <p className="text-white capitalize">{selectedRequest.preferred_contact_time}</p>
                                    </div>
                                )}

                                {selectedRequest.estimated_completion && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Completion</label>
                                        <p className="text-white">
                                            {selectedRequest.estimated_completion_human || formatDate(selectedRequest.estimated_completion)}
                                        </p>
                                    </div>
                                )}

                                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Attachments</label>
                                        <div className="space-y-2">
                                            {selectedRequest.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center text-blue-400">
                                                    <span className="mr-2">📎</span>
                                                    <a 
                                                        href={`/storage/requests/${file}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        {file}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.admin_notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">NWB Team Notes</label>
                                        <p className="text-white bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">{selectedRequest.admin_notes}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="block text-gray-300">Created</label>
                                        <p className="text-white">{formatDate(selectedRequest.created_at)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300">Last Updated</label>
                                        <p className="text-white">{formatDate(selectedRequest.updated_at)}</p>
                                    </div>
                                </div>

                                {selectedRequest.is_overdue && (
                                    <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        <p className="text-red-300 text-sm font-medium">
                                            ⚠️ This request is overdue. Our team has been notified and will prioritize your request.
                                        </p>
                                    </div>
                                )}
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
                                    className="text-white px-4 py-2 rounded-lg transition-all"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Service Information Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">💡</span>
                        Request Types We Handle
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">📄</span>
                            <h4 className="text-white font-semibold mb-1">Property Documents</h4>
                            <p className="text-gray-300 text-sm">Contracts, warranties, inspection reports</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">📅</span>
                            <h4 className="text-white font-semibold mb-1">Schedule Service</h4>
                            <p className="text-gray-300 text-sm">Book maintenance visits and consultations</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">🏠</span>
                            <h4 className="text-white font-semibold mb-1">Property Assessment</h4>
                            <p className="text-gray-300 text-sm">Property evaluations and condition reports</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">🔧</span>
                            <h4 className="text-white font-semibold mb-1">Technical Support</h4>
                            <p className="text-gray-300 text-sm">Portal help and technical assistance</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">💳</span>
                            <h4 className="text-white font-semibold mb-1">Billing Inquiry</h4>
                            <p className="text-gray-300 text-sm">Questions about invoices and payments</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">📋</span>
                            <h4 className="text-white font-semibold mb-1">General Support</h4>
                            <p className="text-gray-300 text-sm">Any other questions or concerns</p>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}