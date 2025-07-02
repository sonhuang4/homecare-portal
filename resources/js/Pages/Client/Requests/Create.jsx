import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { useForm } from '@inertiajs/react';

export default function CreateRequest({ auth }) {
    const { success, error, info, warning } = useToast();
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        service_type: '',
        priority: 'medium',
        property_address: '',
        subject: '',
        description: '',
        contact_preference: ['email'],
        phone: '',
        preferred_visit_time: '',
        property_access_info: '',
        subscription_tier: '',
        credit_usage: false,
        attachments: [],
    });

    const serviceTypes = [
        { value: 'preventive_maintenance', label: 'Preventive Maintenance', icon: '🔧', description: 'Monthly subscription visits and routine upkeep' },
        { value: 'emergency_repair', label: 'Emergency Repair', icon: '🚨', description: 'Urgent home repairs requiring immediate attention' },
        { value: 'property_inspection', label: 'Property Inspection', icon: '📋', description: 'Comprehensive property assessments and reports' },
        { value: 'home_improvement', label: 'Home Improvement', icon: '🏗️', description: 'Renovations, upgrades, and property enhancements' },
        { value: 'hvac_service', label: 'HVAC Services', icon: '❄️', description: 'Heating, ventilation, and air conditioning maintenance' },
        { value: 'plumbing_service', label: 'Plumbing Services', icon: '🚿', description: 'Pipe repairs, fixture installations, leak fixes' },
        { value: 'electrical_service', label: 'Electrical Services', icon: '⚡', description: 'Wiring, outlets, lighting, and electrical repairs' },
        { value: 'roofing_service', label: 'Roofing Services', icon: '🏠', description: 'Roof inspections, repairs, and gutter maintenance' },
        { value: 'painting_service', label: 'Painting Services', icon: '🎨', description: 'Interior/exterior painting and touch-up services' },
        { value: 'landscaping_service', label: 'Landscaping & Outdoor', icon: '🌿', description: 'Garden maintenance, sprinkler systems, outdoor repairs' },
        { value: 'security_service', label: 'Security & Safety', icon: '🔒', description: 'Lock repairs, security system maintenance, safety checks' },
        { value: 'general_maintenance', label: 'General Maintenance', icon: '🛠️', description: 'Other property maintenance and repair services' },
    ];

    const priorityLevels = [
        { value: 'low', label: 'Low Priority', color: 'text-green-400', description: 'Scheduled within 5-7 business days' },
        { value: 'medium', label: 'Standard', color: 'text-yellow-400', description: 'Scheduled within 2-3 business days' },
        { value: 'high', label: 'High Priority', color: 'text-orange-400', description: 'Scheduled within 24 hours' },
        { value: 'emergency', label: 'Emergency', color: 'text-red-400', description: 'Immediate response - same day service' },
    ];

    const subscriptionTiers = [
        { value: 'standard', label: 'Standard Plan', description: '2 visits/month + emergency support' },
        { value: 'premium', label: 'Premium Plan', description: '4 visits/month + priority scheduling' },
        { value: 'deluxe', label: 'Deluxe Plan', description: 'Unlimited visits + concierge service' },
        { value: 'non_member', label: 'Non-Member', description: 'One-time service request (higher rates apply)' },
    ];

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 5) {
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
        
        // Enhanced validation
        if (!data.service_type) {
            warning('Please select a service type for your property');
            return;
        }
        
        if (!data.property_address.trim()) {
            warning('Please enter your property address in Los Angeles');
            return;
        }
        
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

        if (!data.subscription_tier) {
            warning('Please select your subscription plan or non-member option');
            return;
        }

        // Phone validation if phone contact is selected
        if (data.contact_preference.includes('phone') && !data.phone.trim()) {
            warning('Please enter your phone number since you selected phone contact');
            return;
        }

        info('Submitting your homecare service request...');

        // Create clean FormData
        const formData = new FormData();
        
        // Add all form fields
        formData.append('service_type', data.service_type);
        formData.append('priority', data.priority);
        formData.append('property_address', data.property_address);
        formData.append('subject', data.subject);
        formData.append('description', data.description);
        formData.append('phone', data.phone || '');
        formData.append('preferred_visit_time', data.preferred_visit_time || '');
        formData.append('property_access_info', data.property_access_info || '');
        formData.append('subscription_tier', data.subscription_tier);
        formData.append('credit_usage', data.credit_usage ? '1' : '0');
        
        // Add contact preferences
        data.contact_preference.forEach((pref, index) => {
            formData.append(`contact_preference[${index}]`, pref);
        });
        
        // Add files
        selectedFiles.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });
        console.log('Route URL:', route('requests.store'));
        console.log('Form Data being sent:', Object.fromEntries(formData));
        post('/requests', {  // Use direct URL instead of route helper
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                success('🏡 Service request submitted successfully!');
                reset();
                setSelectedFiles([]);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                error('Failed to submit service request.');
            }
        });
    };

    const selectedService = serviceTypes.find(type => type.value === data.service_type);
    const selectedPriority = priorityLevels.find(priority => priority.value === data.priority);
    const selectedTier = subscriptionTiers.find(tier => tier.value === data.subscription_tier);

    return (
        <ClientLayout title="New Homecare Service Request - NWB" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Enhanced Header */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-3 flex items-center justify-center">
                            <span className="mr-4 text-5xl">🏡</span>
                            Homecare Service Request
                        </h2>
                        <p className="text-xl text-slate-300 mb-2">
                            Professional property maintenance services in Los Angeles
                        </p>
                        <p className="text-sm font-medium mb-2" style={{ color: "#00b3ba" }}>
                            New Ways To Build (NWB) • Licensed & Insured • Serving LA since 2014
                        </p>
                        <p className="text-sm text-slate-400">
                            500+ satisfied homeowners • Subscription-based maintenance • Credit rollover system
                        </p>
                    </div>
                </div>

                {/* Emergency Alert */}
                <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-start space-x-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-2">24/7 Emergency Property Services</h3>
                            <p className="text-slate-300 mb-3">
                                For urgent property emergencies (water leaks, electrical failures, security breaches, HVAC failures), contact our emergency response team immediately:
                            </p>
                            <a 
                                href="tel:+13235554663" 
                                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                📞 818---397--8536 - Emergency Hotline
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-8">
                    
                    {/* Subscription Tier Selection */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Subscription Plan *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subscriptionTiers.map((tier) => (
                                <button
                                    key={tier.value}
                                    type="button"
                                    onClick={() => setData('subscription_tier', tier.value)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                        data.subscription_tier === tier.value
                                            ? 'text-white border-white/30'
                                            : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                    style={data.subscription_tier === tier.value ? { 
                                        borderColor: "#00b3ba", 
                                        backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                    } : {}}
                                >
                                    <div className="font-medium text-lg mb-1">{tier.label}</div>
                                    <p className="text-sm opacity-80">{tier.description}</p>
                                </button>
                            ))}
                        </div>
                        {errors.subscription_tier && (
                            <p className="text-red-400 text-sm mt-2">{errors.subscription_tier}</p>
                        )}
                    </div>

                    {/* Property Address */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Property Address (Los Angeles) *
                        </label>
                        <input
                            type="text"
                            value={data.property_address}
                            onChange={(e) => setData('property_address', e.target.value)}
                            className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 transition-all duration-300 focus:border-[#00b3ba]"
                            placeholder="Enter your Los Angeles property address"
                            required
                        />
                        {errors.property_address && (
                            <p className="text-red-400 text-sm mt-2">{errors.property_address}</p>
                        )}
                    </div>

                    {/* Service Type Selection */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Service Type *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {serviceTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setData('service_type', type.value)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                        data.service_type === type.value
                                            ? 'text-white border-white/30'
                                            : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                    style={data.service_type === type.value ? { 
                                        borderColor: "#00b3ba", 
                                        backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                    } : {}}
                                >
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3">{type.icon}</span>
                                        <span className="font-medium">{type.label}</span>
                                    </div>
                                    <p className="text-sm opacity-80">{type.description}</p>
                                </button>
                            ))}
                        </div>
                        {errors.service_type && (
                            <p className="text-red-400 text-sm mt-2">{errors.service_type}</p>
                        )}
                    </div>

                    {/* Priority Level */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                            Service Priority
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {priorityLevels.map((priority) => (
                                <button
                                    key={priority.value}
                                    type="button"
                                    onClick={() => setData('priority', priority.value)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                        data.priority === priority.value
                                            ? 'text-white border-white/30'
                                            : 'border-white/30 bg-white/5 hover:bg-white/10'
                                    }`}
                                    style={data.priority === priority.value ? { 
                                        borderColor: "#00b3ba", 
                                        backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                    } : {}}
                                >
                                    <div className={`text-lg font-bold mb-1 ${priority.color}`}>
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
                            Service Subject *
                        </label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 transition-all duration-300 focus:border-[#00b3ba]"
                            placeholder={selectedService ? `Brief summary of your ${selectedService.label.toLowerCase()}` : "Brief summary of the property service needed"}
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
                            placeholder="Please describe the property maintenance or repair needed. Include specific rooms, areas, symptoms, materials required, preferred timeline, etc. The more details you provide, the better we can prepare for your service visit."
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

                    {/* Credit Usage Option */}
                    {(data.subscription_tier === 'standard' || data.subscription_tier === 'premium' || data.subscription_tier === 'deluxe') && (
                        <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.credit_usage}
                                    onChange={(e) => setData('credit_usage', e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                                    data.credit_usage 
                                        ? 'border-[#00b3ba] bg-[#00b3ba]' 
                                        : 'border-white/30'
                                }`}>
                                    {data.credit_usage && <span className="text-white text-sm">✓</span>}
                                </div>
                                <div>
                                    <span className="text-white font-medium">Use rolled-over credits for this service</span>
                                    <p className="text-gray-400 text-sm">
                                        Apply unused monthly visit credits toward this service request (if available)
                                    </p>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* File Attachments */}
                    <div>
                        <label className="block text-lg font-semibold text-white mb-3">
                            Property Photos & Documents (Recommended)
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
                                <p className="text-white font-medium mb-1">Upload Photos of Property Issue</p>
                                <p className="text-gray-400 text-sm">
                                    Photos help our technicians prepare proper tools and materials. Supports PDF, DOC, JPG, PNG, HEIC up to 10MB each (max 5 files)
                                </p>
                            </label>
                        </div>

                        {/* Selected Files */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-white font-medium">Attached Files:</p>
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

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-600 hover:bg-gray-700"
                        >
                            Cancel Request
                        </button>
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
                                    Submitting Homecare Request...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Submit Service Request
                                    <span className="ml-2">🏡</span>
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                {/* Enhanced Help Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Tips for Better Service Requests
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Include photos of the property issue for accurate preparation</li>
                            <li>• Specify exact rooms, floors, or areas requiring service</li>
                            <li>• Describe any sounds, leaks, damages, or changes noticed</li>
                            <li>• Mention if the issue affects property safety or daily living</li>
                        </ul>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Reference any previous NWB services or warranty work</li>
                            <li>• Include gate codes, parking info, or access instructions</li>
                            <li>• Note if pets are present or special entry requirements</li>
                            <li>• Mention preferred materials or brand specifications</li>
                        </ul>
                    </div>
                </div>

                {/* Service Guarantee */}
                <div className="text-center p-6 rounded-2xl border border-white/20" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                    <h3 className="text-lg font-bold text-white mb-4">NWB Homecare Service Guarantee</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <span className="text-3xl block mb-2">🛡️</span>
                            <h4 className="text-white font-semibold mb-1">Licensed & Insured</h4>
                            <p className="text-gray-400 text-sm">CA license, full insurance coverage</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl block mb-2">⚡</span>
                            <h4 className="text-white font-semibold mb-1">24/7 Emergency</h4>
                            <p className="text-gray-400 text-sm">Always available for urgent property issues</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl block mb-2">✅</span>
                            <h4 className="text-white font-semibold mb-1">Satisfaction Guarantee</h4>
                            <p className="text-gray-400 text-sm">100% satisfaction or we return</p>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl block mb-2">🏆</span>
                            <h4 className="text-white font-semibold mb-1">500+ Happy Clients</h4>
                            <p className="text-gray-400 text-sm">Serving LA homeowners since 2014</p>
                        </div>
                    </div>
                </div>

                {/* Subscription Benefits */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">🎯</span>
                        Your Subscription Benefits
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <h4 className="text-white font-semibold mb-2">Standard Plan</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• 2 maintenance visits/month</li>
                                <li>• Emergency response support</li>
                                <li>• Credit rollover system</li>
                                <li>• 10% discount on additional services</li>
                            </ul>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <h4 className="text-white font-semibold mb-2">Premium Plan</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• 4 maintenance visits/month</li>
                                <li>• Priority scheduling</li>
                                <li>• Extended credit rollover</li>
                                <li>• 15% discount on additional services</li>
                            </ul>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <h4 className="text-white font-semibold mb-2">Deluxe Plan</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Unlimited maintenance visits</li>
                                <li>• Concierge service</li>
                                <li>• Flexible credit system</li>
                                <li>• 20% discount on additional services</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}