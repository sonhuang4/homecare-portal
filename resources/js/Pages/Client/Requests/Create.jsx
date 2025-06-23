import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { useForm } from '@inertiajs/react';

export default function CreateRequest({ auth }) {
    const { success, error, info, warning } = useToast();
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        priority: 'medium',
        subject: '',
        description: '',
        contact_preference: ['email'],
        phone: '',
        preferred_contact_time: '',
        attachments: [],
    });

    const requestTypes = [
        { value: 'document', label: 'Document Request', icon: '📄', description: 'Request documents, reports, or certificates' },
        { value: 'appointment', label: 'Schedule Appointment', icon: '📅', description: 'Book or reschedule an appointment' },
        { value: 'medical', label: 'Medical Support', icon: '🏥', description: 'Medical questions or concerns' },
        { value: 'technical', label: 'Technical Support', icon: '💻', description: 'Portal or technical issues' },
        { value: 'billing', label: 'Billing Inquiry', icon: '💳', description: 'Payment or billing questions' },
        { value: 'general', label: 'General Support', icon: '❓', description: 'Other questions or requests' },
    ];

    const priorityLevels = [
        { value: 'low', label: 'Low', color: 'text-green-400', description: 'Response within 3-5 business days' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-400', description: 'Response within 1-2 business days' },
        { value: 'high', label: 'High', color: 'text-orange-400', description: 'Response within 24 hours' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-400', description: 'Immediate attention required' },
    ];

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 5) {
            warning('You can upload a maximum of 5 files');
            return;
        }
        
        const validFiles = files.filter(file => {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                warning(`File ${file.name} is too large. Maximum size is 10MB.`);
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
        info('File removed');
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
        if (!data.type) {
            warning('Please select a request type');
            return;
        }
        
        if (!data.subject.trim()) {
            warning('Please enter a subject for your request');
            return;
        }
        
        if (!data.description.trim()) {
            warning('Please provide a description of your request');
            return;
        }

        if (data.contact_preference.length === 0) {
            warning('Please select at least one contact preference');
            return;
        }

        info('Submitting your request...');

        // Create FormData for file uploads
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'attachments') {
                selectedFiles.forEach(file => {
                    formData.append('attachments[]', file);
                });
            } else if (key === 'contact_preference') {
                data[key].forEach(pref => {
                    formData.append('contact_preference[]', pref);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        post('/requests', {
            data: formData,
            onSuccess: () => {
                success('🎉 Request submitted successfully! You will receive a confirmation email shortly.');
                reset();
                setSelectedFiles([]);
            },
            onError: () => {
                error('Failed to submit request. Please try again.');
            }
        });
    };

    const selectedType = requestTypes.find(type => type.value === data.type);
    const selectedPriority = priorityLevels.find(priority => priority.value === data.priority);

    return (
        <ClientLayout title="Submit New Request" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Submit New Request</h2>
                    <p className="text-gray-300">
                        Describe your request and we'll get back to you as soon as possible
                    </p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-8">
                    
                    {/* Request Type Selection */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Request Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {requestTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setData('type', type.value)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                        data.type === type.value
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3">{type.icon}</span>
                                        <span className="font-medium">{type.label}</span>
                                    </div>
                                    <p className="text-sm opacity-80">{type.description}</p>
                                </button>
                            ))}
                        </div>
                        {errors.type && (
                            <p className="text-red-400 text-sm mt-2">{errors.type}</p>
                        )}
                    </div>

                    {/* Priority Level */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Priority Level
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {priorityLevels.map((priority) => (
                                <button
                                    key={priority.value}
                                    type="button"
                                    onClick={() => setData('priority', priority.value)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                        data.priority === priority.value
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-white/30 bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`text-xl font-bold mb-1 ${priority.color}`}>
                                        {priority.label}
                                    </div>
                                    <p className="text-xs text-gray-400">{priority.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Subject *
                        </label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={selectedType ? `Brief summary of your ${selectedType.label.toLowerCase()}` : "Brief summary of your request"}
                            required
                        />
                        {errors.subject && (
                            <p className="text-red-400 text-sm mt-2">{errors.subject}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Description *
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="6"
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Please provide detailed information about your request. Include any relevant dates, reference numbers, or specific requirements."
                            required
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-400">
                                Be as specific as possible to help us assist you better
                            </span>
                            <span className="text-sm text-gray-400">
                                {data.description.length}/1000
                            </span>
                        </div>
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-2">{errors.description}</p>
                        )}
                    </div>

                    {/* File Attachments */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Attachments (Optional)
                        </label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="text-4xl mb-2">📎</div>
                                <p className="text-white font-medium mb-1">Click to upload files</p>
                                <p className="text-gray-400 text-sm">
                                    PDF, DOC, JPG, PNG up to 10MB each (max 5 files)
                                </p>
                            </label>
                        </div>

                        {/* Selected Files */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-white font-medium">Selected Files:</p>
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

                    {/* Contact Preferences */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Preferred Contact Method *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { value: 'email', label: 'Email', icon: '📧', description: 'Updates via email' },
                                { value: 'phone', label: 'Phone Call', icon: '📞', description: 'Phone consultation' },
                                { value: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'WhatsApp messages' },
                            ].map((method) => (
                                <label
                                    key={method.value}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        data.contact_preference.includes(method.value)
                                            ? 'border-blue-500 bg-blue-500/20'
                                            : 'border-white/30 bg-white/5 hover:bg-white/10'
                                    }`}
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
                    </div>

                    {/* Phone Number (if phone selected) */}
                    {data.contact_preference.includes('phone') && (
                        <div>
                            <label className="block text-lg font-semibold text-white mb-3">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    )}

                    {/* Preferred Contact Time */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Preferred Contact Time (Optional)
                        </label>
                        <select
                            value={data.preferred_contact_time}
                            onChange={(e) => setData('preferred_contact_time', e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Any time</option>
                            <option value="morning">Morning (8 AM - 12 PM)</option>
                            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                            <option value="evening">Evening (5 PM - 8 PM)</option>
                        </select>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting Request...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Submit Request
                                    <span className="ml-2">🚀</span>
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Help Section */}
                <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Tips for Better Requests
                    </h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Be specific about dates, times, and reference numbers</li>
                        <li>• Include relevant screenshots or documents</li>
                        <li>• Mention any previous related requests or conversations</li>
                        <li>• For urgent matters, please call our support line directly</li>
                    </ul>
                </div>
            </div>
        </ClientLayout>
    );
}