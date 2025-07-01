import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { useForm, Link } from '@inertiajs/react';

export default function EditRequest({ auth, request }) {
    const { success, error, info, warning } = useToast();
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const { data, setData, patch, processing, errors, reset } = useForm({
        subject: request.subject || '',
        description: request.description || '',
        contact_preference: request.contact_preference || ['email'],
        phone: request.phone || '',
        preferred_visit_time: request.preferred_contact_time || '',
        property_access_info: request.property_access_info || '',
        attachments: [],
    });

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const existingAttachments = request.attachments || [];
        
        if (files.length + selectedFiles.length + existingAttachments.length > 5) {
            warning('You can upload a maximum of 5 files per service request');
            return;
        }
        
        const validFiles = files.filter(file => {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                warning(`File ${file.name} is too large. Maximum size is 10MB per file.`);
                return false;
            }
            return true;
        });

        setSelectedFiles(prev => [...prev, ...validFiles]);
        setData('attachments', [...selectedFiles, ...validFiles]);
        info(`${validFiles.length} file(s) added successfully`);
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setData('attachments', newFiles);
        info('File removed from request');
    };

    const handleContactPreferenceChange = (preference) => {
        const current = data.contact_preference || [];
        let updated;
        
        if (current.includes(preference)) {
            updated = current.filter(p => p !== preference);
        } else {
            updated = [...current, preference];
        }
        
        setData('contact_preference', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!data.subject.trim()) {
            warning('Please enter a subject for your service request');
            return;
        }
        
        if (!data.description.trim()) {
            warning('Please provide details about the maintenance or repair needed');
            return;
        }

        if (data.contact_preference.length === 0) {
            warning('Please select at least one contact method');
            return;
        }

        // Phone validation if phone contact is selected
        if (data.contact_preference.includes('phone') && !data.phone.trim()) {
            warning('Please enter your phone number since you selected phone contact');
            return;
        }

        info('Updating your homecare service request...');

        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add form fields
        formData.append('subject', data.subject);
        formData.append('description', data.description);
        formData.append('phone', data.phone || '');
        formData.append('preferred_visit_time', data.preferred_visit_time || '');
        formData.append('property_access_info', data.property_access_info || '');
        formData.append('_method', 'PATCH');
        
        // Add contact preferences
        data.contact_preference.forEach((pref, index) => {
            formData.append(`contact_preference[${index}]`, pref);
        });
        
        // Add new files
        selectedFiles.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        patch(route('requests.update', request.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                success('🏡 Service request updated successfully!');
                setSelectedFiles([]);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                error('Failed to update service request.');
            }
        });
    };

    const getTypeIcon = (type) => {
        const icons = {
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
            technical: '🔧',
            billing: '💳',
            general: '📋'
        };
        return icons[type] || '📋';
    };

    const getStatusBadge = (status) => {
        const badges = {
            submitted: "bg-blue-500/20 border-blue-500/30 text-blue-400",
            reviewed: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
            in_progress: "bg-orange-500/20 border-orange-500/30 text-orange-400",
            completed: "bg-green-500/20 border-green-500/30 text-green-400",
            cancelled: "bg-red-500/20 border-red-500/30 text-red-400",
        };
        return badges[status] || "bg-gray-500/20 border-gray-500/30 text-gray-400";
    };

    return (
        <ClientLayout title={`Edit Request - ${request.subject} - NWB`} auth={auth}>
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
                                href={`/requests/${request.id}`}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                ← Back to Request Details
                            </Link>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-4xl font-bold text-white flex items-center gap-3 mb-3">
                                    <span className="text-5xl">{getTypeIcon(request.type)}</span>
                                    Edit Service Request
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Update your homecare service request details
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                    Request ID: REQ-{request.id.toString().padStart(6, '0')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(request.status)}`}>
                                    {request.status_label || request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Request Info */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Request Information</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-300">Service Type:</span>
                            <p className="text-white font-medium">{request.type_label || request.type}</p>
                        </div>
                        <div>
                            <span className="text-gray-300">Priority:</span>
                            <p className="text-white font-medium">{request.priority_label || request.priority}</p>
                        </div>
                        <div>
                            <span className="text-gray-300">Property Address:</span>
                            <p className="text-white font-medium">{request.property_address}</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-300 text-sm">
                            <strong>Note:</strong> Service type, priority, and property address cannot be changed after submission. 
                            If you need to modify these details, please create a new request and cancel this one.
                        </p>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-8">
                    
                    {/* Subject */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Service Subject *
                        </label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 transition-all duration-300 focus:border-[#00b3ba]"
                            placeholder="Brief summary of the property service needed"
                            required
                        />
                        {errors.subject && (
                            <p className="text-red-400 text-sm mt-2">{errors.subject}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Detailed Description *
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="6"
                            className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 transition-all duration-300 resize-none focus:border-[#00b3ba]"
                            placeholder="Please describe the property maintenance or repair needed. Include specific rooms, areas, symptoms, materials required, preferred timeline, etc."
                            required
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-400">
                                Include room locations, symptoms, materials needed, and access requirements
                            </span>
                            <span className="text-sm text-gray-400">
                                {data.description.length}/2000
                            </span>
                        </div>
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-2">{errors.description}</p>
                        )}
                    </div>

                    {/* Property Access Information */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Property Access Information
                        </label>
                        <textarea
                            value={data.property_access_info}
                            onChange={(e) => setData('property_access_info', e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 transition-all duration-300 resize-none focus:border-[#00b3ba]"
                            placeholder="Gate codes, parking instructions, key location, pet information, security system details, or any special access requirements for our technicians"
                        />
                        <p className="text-sm text-gray-400 mt-2">
                            Help our technicians access your property efficiently and safely
                        </p>
                    </div>

                    {/* Contact Preferences */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Preferred Contact Methods *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { value: 'email', label: 'Email Updates', icon: '📧', description: 'Service confirmations & progress updates' },
                                { value: 'phone', label: 'Phone Calls', icon: '📞', description: 'Direct communication with technicians' },
                                { value: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'Real-time chat with NWB team' },
                            ].map((method) => (
                                <label
                                    key={method.value}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        data.contact_preference.includes(method.value)
                                            ? 'text-white border-white/30'
                                            : 'border-white/30 bg-white/5 hover:bg-white/10'
                                    }`}
                                    style={data.contact_preference.includes(method.value) ? { 
                                        borderColor: "#00b3ba", 
                                        backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                    } : {}}
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.contact_preference.includes(method.value)}
                                        onChange={() => handleContactPreferenceChange(method.value)}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl mr-3">{method.icon}</span>
                                    <div>
                                        <div className="text-white font-medium">{method.label}</div>
                                        <div className="text-gray-400 text-sm">{method.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.contact_preference && (
                            <p className="text-red-400 text-sm mt-2">{errors.contact_preference}</p>
                        )}
                    </div>

                    {/* Phone Number (if phone selected) */}
                    {data.contact_preference.includes('phone') && (
                        <div>
                            <label className="block text-lg font-semibold text-white mb-3">
                                📞 Phone Number for Service Coordination
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 transition-all duration-300 focus:border-[#00b3ba]"
                                placeholder="Enter phone number for technician coordination"
                            />
                            {errors.phone && (
                                <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                            )}
                        </div>
                    )}

                    {/* Preferred Visit Time */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Preferred Service Visit Time
                        </label>
                        <select
                            value={data.preferred_visit_time}
                            onChange={(e) => setData('preferred_visit_time', e.target.value)}
                            className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white transition-all duration-300 focus:border-[#00b3ba]"
                        >
                            <option value="">Any time during business hours (8 AM - 6 PM)</option>
                            <option value="morning">Morning (8 AM - 12 PM)</option>
                            <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                            <option value="evening">Evening (4 PM - 6 PM)</option>
                            <option value="weekend">Weekend (Saturday 9 AM - 3 PM)</option>
                            <option value="emergency">Emergency - ASAP</option>
                        </select>
                        <p className="text-sm text-gray-400 mt-2">
                            Priority scheduling available for Premium and Deluxe subscribers
                        </p>
                    </div>

                    {/* Existing Attachments */}
                    {request.attachments && request.attachments.length > 0 && (
                        <div>
                            <label className="block text-lg font-semibold text-white mb-3">
                                Current Attachments ({request.attachments.length})
                            </label>
                            <div className="space-y-2 mb-4">
                                {request.attachments.map((attachment, index) => {
                                    const fileName = typeof attachment === 'object' ? attachment.original_name || attachment.filename : attachment;
                                    return (
                                        <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                                            <div className="flex items-center">
                                                <span className="text-lg mr-2">📄</span>
                                                <span className="text-white text-sm">{fileName}</span>
                                                {typeof attachment === 'object' && attachment.size && (
                                                    <span className="text-gray-400 text-xs ml-2">
                                                        ({(attachment.size / 1024 / 1024).toFixed(1)}MB)
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-gray-400 text-sm">Existing file</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Add New Attachments */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Add New Property Photos & Documents
                        </label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.heic"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="text-4xl mb-2">📸</div>
                                <p className="text-white font-medium mb-1">Upload Additional Photos or Documents</p>
                                <p className="text-gray-400 text-sm">
                                    Add more photos or documents to help our technicians. Supports PDF, DOC, JPG, PNG, HEIC up to 10MB each (max 5 files total)
                                </p>
                            </label>
                        </div>

                        {/* Selected New Files */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-white font-medium">New Files to Add:</p>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-lg mr-2">📄</span>
                                            <span className="text-white text-sm">{file.name}</span>
                                            <span className="text-gray-400 text-xs ml-2">
                                                ({(file.size / 1024 / 1024).toFixed(1)}MB)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Link
                            href={`/requests/${request.id}`}
                            className="flex-1 text-center text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-600 hover:bg-gray-700"
                        >
                            Cancel Changes
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                            style={{ backgroundColor: "#00b3ba" }}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Request...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Update Service Request
                                    <span className="ml-2">🏡</span>
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Help Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Editing Guidelines
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Service type and priority cannot be changed after submission</li>
                            <li>• Property address is locked to ensure proper service routing</li>
                            <li>• You can update description to add more details</li>
                            <li>• Contact preferences can be modified anytime</li>
                        </ul>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• New attachments will be added to existing ones</li>
                            <li>• Existing files cannot be removed (contact support if needed)</li>
                            <li>• Changes are only allowed while request is submitted/reviewed</li>
                            <li>• Updates will refresh the estimated completion time</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}