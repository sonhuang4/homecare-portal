import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link, router } from '@inertiajs/react';

export default function RequestShow({ auth, request }) {
    const { success, info } = useToast();
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const getTypeIcon = (type) => {
        const icons = {
            // Homecare service types
            preventive_maintenance: '🔧',
            emergency_repair: '🚨',
            property_inspection: '📋',
            home_improvement: '🏗️',
            hvac_service: '❄️',
            plumbing_service: '🚿',
            electrical_service: '⚡',
            roofing_service: '🏠',
            painting_service: '🎨',
            landscaping_service: '🌿',
            security_service: '🔒',
            general_maintenance: '🛠️',
            // Legacy types
            document: '📄',
            appointment: '📅',
            medical: '🏥',
            technical: '💻',
            billing: '💳',
            general: '❓'
        };
        return icons[type] || '📋';
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

    const getPriorityBadge = (priority) => {
        const badges = {
            low: 'bg-green-500/20 border-green-500/30 text-green-400',
            medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
            high: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
            emergency: 'bg-red-500/20 border-red-500/30 text-red-400',
            urgent: 'bg-red-500/20 border-red-500/30 text-red-400'
        };
        return badges[priority] || 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
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
            gif: '🖼️',
            heic: '🖼️'
        };
        return icons[extension] || '📎';
    };

    const isImageFile = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'heic'].includes(extension);
    };

    const handleFileClick = (attachment) => {
        if (typeof attachment === 'object' && attachment.path) {
            // New format with file object
            if (isImageFile(attachment.original_name || attachment.filename)) {
                setSelectedImage(attachment);
                setShowImageModal(true);
            } else {
                info(`Opening ${attachment.original_name || attachment.filename}...`);
                window.open(`/storage/${attachment.path}`, '_blank');
            }
        } else {
            // Legacy format with just filename
            if (isImageFile(attachment)) {
                setSelectedImage(attachment);
                setShowImageModal(true);
            } else {
                info(`Opening ${attachment}...`);
                window.open(`/storage/requests/${attachment}`, '_blank');
            }
        }
    };

    const handleCopyRequestId = () => {
        navigator.clipboard.writeText(`REQ-${request.id.toString().padStart(6, '0')}`);
        success('Request ID copied to clipboard!');
    };

    const handleDuplicate = () => {
        router.get(route('requests.create'), { duplicate: request.id });
    };

    return (
        <ClientLayout title={`Request Details - ${request.subject} - NWB`} auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Link
                                href="/requests"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                ← Back to Requests
                            </Link>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-4xl font-bold text-white flex items-center gap-3 mb-3">
                                    <span className="text-5xl">{getTypeIcon(request.type)}</span>
                                    {request.subject}
                                </h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleCopyRequestId}
                                        className="text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-1"
                                        style={{ color: "#00b3ba" }}
                                    >
                                        ID: REQ-{request.id.toString().padStart(6, '0')}
                                        <span className="text-xs">📋</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(request.status)}`}>
                                    {request.status_label || request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPriorityBadge(request.priority)}`}>
                                    {request.priority_label || request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                </span>
                            </div>
                        </div>
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
                                            {request.type_label || request.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                        <p className={`font-medium ${request.priority === 'emergency' ? 'text-red-400' : request.priority === 'high' ? 'text-orange-400' : request.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {request.priority_label || request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                                        </p>
                                    </div>
                                </div>

                                {/* Property and Service Info */}
                                {request.property_address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Property Address</label>
                                        <p className="text-white">{request.property_address}</p>
                                    </div>
                                )}

                                {request.subscription_tier && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Subscription Plan</label>
                                        <p className="text-white">{request.subscription_tier_label || request.subscription_tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Preference</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {(request.contact_preference || []).map((pref, index) => (
                                                <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
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

                                {request.property_access_info && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Property Access Information</label>
                                        <p className="text-white bg-white/5 p-4 rounded-lg">{request.property_access_info}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attachments */}
                        {request.attachments && request.attachments.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">Attachments ({request.attachments.length})</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {request.attachments.map((attachment, index) => {
                                        const fileName = typeof attachment === 'object' ? attachment.original_name || attachment.filename : attachment;
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => handleFileClick(attachment)}
                                                className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                                            >
                                                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                                                    {getFileIcon(fileName)}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{fileName}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {isImageFile(fileName) ? 'Click to view' : 'Click to download'}
                                                        {typeof attachment === 'object' && attachment.size && 
                                                            ` • ${(attachment.size / 1024 / 1024).toFixed(1)}MB`
                                                        }
                                                    </p>
                                                </div>
                                                <span className="text-gray-400 group-hover:text-white transition-colors">
                                                    {isImageFile(fileName) ? '👁️' : '⬇️'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Admin Notes */}
                        {request.admin_notes && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <span className="mr-2">💬</span>
                                    NWB Team Notes
                                </h3>
                                <div className="rounded-lg p-4 border" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)", borderColor: "#00b3ba" }}>
                                    <p className="text-white leading-relaxed">{request.admin_notes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Summary & Actions */}
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
                                    <span className="text-white">{request.attachments_count || (request.attachments ? request.attachments.length : 0)}</span>
                                </div>
                                {request.credit_usage && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Credit Usage:</span>
                                        <span className="text-green-400 text-sm">Applied</span>
                                    </div>
                                )}
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
                                    onClick={handleDuplicate}
                                    className="w-full text-white px-4 py-2 rounded-lg transition-all font-medium"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    Duplicate Request
                                </button>
                                <button
                                    onClick={() => window.print()}
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
                                    src={typeof selectedImage === 'object' ? `/storage/${selectedImage.path}` : `/storage/requests/${selectedImage}`}
                                    alt={typeof selectedImage === 'object' ? selectedImage.original_name : selectedImage}
                                    className="max-w-full max-h-[80vh] object-contain mx-auto"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/800/600';
                                    }}
                                />
                                <p className="text-center text-gray-600 mt-2 font-medium">
                                    {typeof selectedImage === 'object' ? selectedImage.original_name : selectedImage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}