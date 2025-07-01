import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useToast } from '../../../Context/ToastContext';

export default function Show({ auth, request, activity_log = [] }) {
    const { success, error, info } = useToast();
    const [status, setStatus] = useState(request.status);
    const [internalNote, setInternalNote] = useState(request.admin_notes || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleUpdate = () => {
        if (!internalNote.trim() && status === request.status) {
            info('No changes to save');
            return;
        }

        setIsUpdating(true);
        
        router.patch(`/admin/requests/${request.id}`, {
            status,
            admin_notes: internalNote
        }, {
            onSuccess: () => {
                success('Request updated successfully!');
                setIsUpdating(false);
            },
            onError: () => {
                error('Failed to update request');
                setIsUpdating(false);
            },
            onFinish: () => {
                setIsUpdating(false);
            }
        });
    };

    const deleteRequest = () => {
        router.delete(`/admin/requests/${request.id}`, {
            onSuccess: () => {
                success('Request deleted successfully');
            },
            onError: () => {
                error('Failed to delete request');
            }
        });
        setShowDeleteModal(false);
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
            reviewed: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
            in_progress: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
            completed: 'bg-green-500/20 border-green-500/30 text-green-400',
            cancelled: 'bg-red-500/20 border-red-500/30 text-red-400'
        };
        return badges[status] || 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    };

    const getTypeIcon = (type) => {
        const icons = {
            document: '📄',
            appointment: '📅',
            medical: '🏥',
            technical: '🔧',
            billing: '💳',
            general: '📋'
        };
        return icons[type] || '📋';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            low: 'text-green-400',
            medium: 'text-yellow-400',
            high: 'text-orange-400',
            urgent: 'text-red-400'
        };
        return badges[priority] || 'text-gray-400';
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    const hasChanges = status !== request.status || internalNote !== (request.admin_notes || '');

    return (
        <AdminLayout title={`Request #${request.id} - ${request.subject}`} auth={auth}>
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
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="text-6xl">{getTypeIcon(request.type)}</div>
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-2">
                                        Request #{request.id}
                                    </h2>
                                    <p className="text-xl text-slate-300 mb-2">{request.subject}</p>
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(request.status)}`}>
                                            {request.status_label || request.status}
                                        </span>
                                        <span className={`text-sm font-medium ${getPriorityBadge(request.priority)}`}>
                                            {request.priority_label || request.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                        Type: {request.type_label || request.type} • Created: {formatDate(request.created_at)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/admin/users/${request.user?.id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    View Client
                                </Link>
                                <Link
                                    href="/admin/requests"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Requests
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Request Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Request Information */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Request Details
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="border-b border-white/10 pb-4">
                                    <label className="text-sm text-gray-400">Subject</label>
                                    <p className="text-white font-medium text-lg">{request.subject}</p>
                                </div>
                                
                                <div className="border-b border-white/10 pb-4">
                                    <label className="text-sm text-gray-400">Description</label>
                                    <p className="text-white font-medium leading-relaxed">{request.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-b border-white/10 pb-4">
                                        <label className="text-sm text-gray-400">Request Type</label>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            {getTypeIcon(request.type)} {request.type_label || request.type}
                                        </p>
                                    </div>
                                    
                                    <div className="border-b border-white/10 pb-4">
                                        <label className="text-sm text-gray-400">Priority Level</label>
                                        <p className={`font-medium ${getPriorityBadge(request.priority)}`}>
                                            {request.priority_label || request.priority}
                                        </p>
                                    </div>
                                </div>

                                {request.contact_preference && (
                                    <div className="border-b border-white/10 pb-4">
                                        <label className="text-sm text-gray-400">Contact Preferences</label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {request.contact_preference.map((pref, index) => (
                                                <span key={index} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm capitalize">
                                                    {pref}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {request.phone && (
                                    <div className="border-b border-white/10 pb-4">
                                        <label className="text-sm text-gray-400">Contact Phone</label>
                                        <p className="text-white font-medium">{request.phone}</p>
                                    </div>
                                )}

                                {request.estimated_completion && (
                                    <div className="border-b border-white/10 pb-4">
                                        <label className="text-sm text-gray-400">Estimated Completion</label>
                                        <p className="text-white font-medium">
                                            {request.estimated_completion_human || formatDate(request.estimated_completion)}
                                        </p>
                                    </div>
                                )}

                                {request.attachments && request.attachments.length > 0 && (
                                    <div>
                                        <label className="text-sm text-gray-400">Attachments</label>
                                        <div className="space-y-2 mt-2">
                                            {request.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center text-blue-400 bg-white/5 p-3 rounded-lg">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
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
                            </div>
                        </div>

                        {/* Activity Log */}
                        {activity_log.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Activity Timeline
                                </h3>
                                <div className="space-y-4">
                                    {activity_log.map((log, index) => (
                                        <div key={index} className="flex items-start gap-4 bg-white/5 p-4 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                                {log.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{log.description}</p>
                                                <p className="text-gray-400 text-sm">{log.user?.name} • {formatDate(log.created_at)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Client Information */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Client Information
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {getInitials(request.user?.name)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{request.user?.name || 'Unknown User'}</p>
                                        <p className="text-gray-400 text-sm">{request.user?.email || 'No email'}</p>
                                    </div>
                                </div>
                                
                                {request.user?.phone && (
                                    <div className="border-t border-white/10 pt-4">
                                        <label className="text-sm text-gray-400">Phone</label>
                                        <p className="text-white font-medium">{request.user.phone}</p>
                                    </div>
                                )}
                                
                                {request.user?.address && (
                                    <div className="border-t border-white/10 pt-4">
                                        <label className="text-sm text-gray-400">Property Address</label>
                                        <p className="text-white font-medium">{request.user.address}</p>
                                    </div>
                                )}

                                <div className="border-t border-white/10 pt-4">
                                    <Link
                                        href={`/admin/users/${request.user?.id}`}
                                        className="w-full text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                        style={{ backgroundColor: "#00b3ba" }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Full Profile
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-3" style={{ color: "#00b3ba" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                </svg>
                                Admin Actions
                            </h3>
                            
                            {hasChanges && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                                    <p className="text-yellow-300 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        You have unsaved changes
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Status Update */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Request Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="submitted" className="bg-gray-800">🔵 Submitted</option>
                                        <option value="reviewed" className="bg-gray-800">🟡 Reviewed</option>
                                        <option value="in_progress" className="bg-gray-800">🟠 In Progress</option>
                                        <option value="completed" className="bg-gray-800">🟢 Completed</option>
                                        <option value="cancelled" className="bg-gray-800">🔴 Cancelled</option>
                                    </select>
                                </div>

                                {/* Admin Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={internalNote}
                                        onChange={(e) => setInternalNote(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Add internal notes about this request..."
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Internal notes visible only to admin users</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isUpdating || !hasChanges}
                                        className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                            isUpdating || !hasChanges 
                                                ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                                                : 'text-white hover:shadow-lg transform hover:scale-105'
                                        }`}
                                        style={!isUpdating && hasChanges ? { backgroundColor: "#00b3ba" } : {}}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {hasChanges ? 'Save Changes' : 'No Changes'}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => info('Send notification feature coming soon')}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Notify Client
                                    </button>

                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Request
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Request Metadata */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                            <h4 className="text-lg font-semibold text-white mb-4">Request Metadata</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Created:</span>
                                    <span className="text-white">{formatDate(request.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Last Updated:</span>
                                    <span className="text-white">{formatDate(request.updated_at)}</span>
                                </div>
                                {request.is_overdue && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <span className="text-red-400 font-medium">⚠️ Overdue</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-md w-full">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete Request</h3>
                                <p className="text-gray-300 mb-6">
                                    Are you sure you want to delete request #{request.id}? This action cannot be undone and will permanently remove all associated data.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteRequest}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                                    >
                                        Delete Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Help Information */}
                <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
                    <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Request Management Guide
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h5 className="font-semibold text-white mb-2">Status Updates:</h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>• <strong>Submitted:</strong> New request received</li>
                                <li>• <strong>Reviewed:</strong> Admin has assessed the request</li>
                                <li>• <strong>In Progress:</strong> Work is being performed</li>
                                <li>• <strong>Completed:</strong> Request has been fulfilled</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">Admin Actions:</h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>• Update status to track progress</li>
                                <li>• Add internal notes for team communication</li>
                                <li>• View client profile for context</li>
                                <li>• Notify client of updates via email</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-white mb-2">Best Practices:</h5>
                            <ul className="space-y-1 text-gray-300">
                                <li>• Always add notes when changing status</li>
                                <li>• Respond to urgent requests within 4 hours</li>
                                <li>• Keep clients informed of progress</li>
                                <li>• Document all actions taken</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}