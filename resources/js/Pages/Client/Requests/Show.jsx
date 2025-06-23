import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link } from '@inertiajs/react';

export default function RequestShow({ auth, request: requestData }) {
    const { success, info } = useToast();
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Mock data if no real data provided
    const request = requestData || {
        id: 1,
        type: 'document',
        subject: 'Medical Records Request',
        description: 'I need copies of my recent blood test results from last month. Please include the detailed report and any recommendations from the doctor. This is for my upcoming consultation with a specialist.',
        status: 'in_progress',
        priority: 'medium',
        created_at: '2024-06-20T10:30:00.000000Z',
        updated_at: '2024-06-22T14:15:00.000000Z',
        estimated_completion: '2024-06-25T17:00:00.000000Z',
        attachments: ['blood_test_prescription.pdf', 'insurance_card.jpg', 'previous_results.png'],
        contact_preference: ['email', 'phone'],
        phone: '+1 (555) 123-4567',
        preferred_contact_time: 'morning',
        admin_notes: 'Documents are being prepared by the medical records department. Patient has been contacted via email to confirm identity verification.',
        type_label: 'Document Request',
        status_label: 'In Progress',
        priority_label: 'Medium',
        status_color: 'text-orange-400',
        priority_color: 'text-yellow-400',
        timeline: [
            {
                id: 1,
                status: 'submitted',
                timestamp: '2024-06-20T10:30:00.000000Z',
                title: 'Request Submitted',
                description: 'Request submitted by client',
                by: 'System',
                icon: '📝'
            },
            {
                id: 2,
                status: 'reviewed',
                timestamp: '2024-06-21T09:15:00.000000Z',
                title: 'Request Reviewed',
                description: 'Request reviewed and approved by admin team',
                by: 'Admin Sarah',
                icon: '👀'
            },
            {
                id: 3,
                status: 'in_progress',
                timestamp: '2024-06-22T14:15:00.000000Z',
                title: 'Processing Started',
                description: 'Medical records department contacted for document preparation',
                by: 'Admin John',
                icon: '⚙️'
            },
            {
                id: 4,
                status: 'pending',
                timestamp: null,
                title: 'Completion Expected',
                description: 'Documents will be ready for pickup or secure email delivery',
                by: 'System',
                icon: '📅',
                estimated: true
            }
        ]
    };

    const getTypeIcon = (type) => {
        const icons = {
            document: '📄',
            appointment: '📅',
            medical: '🏥',
            technical: '💻',
            billing: '💳',
            general: '❓'
        };
        return icons[type] || '📋';
    };

    const getStatusBadge = (status, statusColor) => {
        const badges = {
            submitted: 'bg-blue-500/20 border-blue-500/30',
            reviewed: 'bg-yellow-500/20 border-yellow-500/30',
            in_progress: 'bg-orange-500/20 border-orange-500/30',
            completed: 'bg-green-500/20 border-green-500/30',
            cancelled: 'bg-red-500/20 border-red-500/30'
        };
        
        return `${badges[status] || 'bg-gray-500/20 border-gray-500/30'} ${statusColor}`;
    };

    const getPriorityBadge = (priority, priorityColor) => {
        const badges = {
            low: 'bg-green-500/20 border-green-500/30',
            medium: 'bg-yellow-500/20 border-yellow-500/30',
            high: 'bg-orange-500/20 border-orange-500/30',
            urgent: 'bg-red-500/20 border-red-500/30'
        };
        
        return `${badges[priority] || 'bg-gray-500/20 border-gray-500/30'} ${priorityColor}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
            gif: '🖼️'
        };
        return icons[extension] || '📎';
    };

    const isImageFile = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
    };

    const handleFileClick = (filename) => {
        if (isImageFile(filename)) {
            setSelectedImage(filename);
            setShowImageModal(true);
        } else {
            info(`Downloading ${filename}...`);
            // In real app: window.open(`/storage/requests/${filename}`, '_blank');
        }
    };

    const handleCopyRequestId = () => {
        navigator.clipboard.writeText(`REQ-${request.id.toString().padStart(6, '0')}`);
        success('Request ID copied to clipboard!');
    };

    return (
        <ClientLayout title={`Request #${request.id}`} auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href="/requests"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                ← Back to Requests
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span className="text-2xl">{getTypeIcon(request.type)}</span>
                            {request.subject}
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={handleCopyRequestId}
                                className="text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-1"
                            >
                                ID: REQ-{request.id.toString().padStart(6, '0')}
                                <span className="text-xs">📋</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(request.status, request.status_color)}`}>
                            {request.status_label}
                        </span>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPriorityBadge(request.priority, request.priority_color)}`}>
                            {request.priority_label} Priority
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Request Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Request Information */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Request Details</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <p className="text-white leading-relaxed bg-white/5 p-4 rounded-lg">
                                        {request.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                        <p className="text-white flex items-center">
                                            <span className="mr-2">{getTypeIcon(request.type)}</span>
                                            {request.type_label}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                        <p className={`font-medium ${request.priority_color}`}>
                                            {request.priority_label}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Preference</label>
                                        <div className="flex gap-2">
                                            {(request.contact_preference || []).map((pref) => (
                                                <span key={pref} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                                                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {request.phone && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                            <p className="text-white">{request.phone}</p>
                                        </div>
                                    )}
                                </div>

                                {request.preferred_contact_time && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Contact Time</label>
                                        <p className="text-white capitalize">{request.preferred_contact_time}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attachments */}
                        {request.attachments && request.attachments.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">Attachments ({request.attachments.length})</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(request.attachments || []).map((file, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleFileClick(file)}
                                            className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                                        >
                                            <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                                                {getFileIcon(file)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate">{file}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {isImageFile(file) ? 'Click to view' : 'Click to download'}
                                                </p>
                                            </div>
                                            <span className="text-gray-400 group-hover:text-white transition-colors">
                                                {isImageFile(file) ? '👁️' : '⬇️'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Notes */}
                        {request.admin_notes && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <span className="mr-2">💬</span>
                                    Admin Notes
                                </h3>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                    <p className="text-white leading-relaxed">{request.admin_notes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Timeline & Summary */}
                    <div className="space-y-6">
                        {/* Quick Summary */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Created:</span>
                                    <span className="text-white text-sm">{formatDate(request.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Last Updated:</span>
                                    <span className="text-white text-sm">{formatDate(request.updated_at)}</span>
                                </div>
                                {request.estimated_completion && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Est. Completion:</span>
                                        <span className="text-green-400 text-sm">{formatDate(request.estimated_completion)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Attachments:</span>
                                    <span className="text-white">{(request.attachments || []).length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-6">Request Timeline</h3>
                            <div className="space-y-4">
                                {(request.timeline || []).map((item, index) => (
                                    <div key={item.id} className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                            item.estimated 
                                                ? 'bg-gray-500/20 border border-gray-500/30' 
                                                : 'bg-blue-500/20 border border-blue-500/30'
                                        }`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className={`text-sm font-medium ${item.estimated ? 'text-gray-400' : 'text-white'}`}>
                                                    {item.title}
                                                </p>
                                                {item.timestamp && (
                                                    <p className="text-xs text-gray-400">
                                                        {formatDate(item.timestamp)}
                                                    </p>
                                                )}
                                            </div>
                                            <p className={`text-sm ${item.estimated ? 'text-gray-500' : 'text-gray-300'}`}>
                                                {item.description}
                                            </p>
                                            {item.by && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    by {item.by}
                                                </p>
                                            )}
                                        </div>
                                            {index < (request.timeline || []).length - 1 && !item.estimated && (
                                            <div className="absolute left-10 mt-8 w-px h-6 bg-white/20"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => info('Contact feature coming soon!')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all font-medium"
                                >
                                    Contact Support
                                </button>
                                <button
                                    onClick={() => info('Print feature coming soon!')}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all font-medium"
                                >
                                    Print Request
                                </button>
                                {request.status !== 'completed' && request.status !== 'cancelled' && (
                                    <button
                                        onClick={() => info('Cancel request feature coming soon!')}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all font-medium"
                                    >
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Modal */}
                {showImageModal && selectedImage && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowImageModal(false)}>
                        <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setShowImageModal(false)}
                                    className="bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <img 
                                    src={`/api/placeholder/800/600`} 
                                    alt={selectedImage}
                                    className="max-w-full max-h-[80vh] object-contain mx-auto"
                                />
                                <p className="text-center text-gray-600 mt-2 font-medium">{selectedImage}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}