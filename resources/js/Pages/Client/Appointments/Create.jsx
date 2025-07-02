import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link } from '@inertiajs/react';

export default function CreateAppointment({ auth, selectedDate, availableSlots = [], serviceTypes, priorities }) {
    const { success, error, info, warning } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedRequirements, setSelectedRequirements] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        service_type: '',
        title: '',
        description: '',
        appointment_date: selectedDate || '',
        start_time: '',
        end_time: '',
        priority: 'medium',
        address: '',
        contact_phone: '',
        special_requirements: [],
        notes: ''
    });

    // NWB Homecare Service Types
    const defaultServiceTypes = serviceTypes || {
        preventive_maintenance: 'Preventive Maintenance',
        emergency_repair: 'Emergency Repair',
        property_inspection: 'Property Inspection',
        home_improvement: 'Home Improvement',
        hvac_service: 'HVAC Service',
        plumbing_service: 'Plumbing Service',
        electrical_service: 'Electrical Service',
        roofing_service: 'Roofing Service',
        painting_service: 'Painting Service',
        landscaping_service: 'Landscaping & Outdoor',
        security_service: 'Security & Safety',
        general_maintenance: 'General Maintenance'
    };

    const defaultPriorities = priorities || {
        low: 'Low',
        medium: 'Standard',
        high: 'High',
        urgent: 'Emergency'
    };

    // Property service requirements
    const specialRequirementOptions = [
        { value: 'key_access', label: 'Property Key Required', icon: '🔑' },
        { value: 'gate_code', label: 'Gate Code Needed', icon: '🚪' },
        { value: 'pet_present', label: 'Pets on Property', icon: '🐕' },
        { value: 'power_shutoff', label: 'Power Shutoff Required', icon: '⚡' },
        { value: 'water_shutoff', label: 'Water Shutoff Required', icon: '💧' },
        { value: 'tenant_occupied', label: 'Tenant Occupied Property', icon: '🏠' },
        { value: 'ladder_access', label: 'Ladder/Height Work', icon: '🪜' },
        { value: 'heavy_equipment', label: 'Heavy Equipment Needed', icon: '🚚' },
        { value: 'permits_required', label: 'Permits Required', icon: '📋' },
        { value: 'safety_equipment', label: 'Special Safety Equipment', icon: '🦺' }
    ];

    const priorityDescriptions = {
        low: 'Scheduled within 5-7 business days',
        medium: 'Standard scheduling (2-3 business days)',
        high: 'Priority scheduling (within 24 hours)',
        urgent: 'Emergency response (same day service)'
    };

    // Mock available slots if none provided
    const mockTimeSlots = availableSlots.length > 0 ? availableSlots : [
        { start_time: '08:00', end_time: '10:00', label: '8:00 AM - 10:00 AM' },
        { start_time: '10:00', end_time: '12:00', label: '10:00 AM - 12:00 PM' },
        { start_time: '12:00', end_time: '14:00', label: '12:00 PM - 2:00 PM' },
        { start_time: '14:00', end_time: '16:00', label: '2:00 PM - 4:00 PM' },
        { start_time: '16:00', end_time: '18:00', label: '4:00 PM - 6:00 PM' }
    ];

    const handleDateChange = async (date) => {
        setData('appointment_date', date);
        setSelectedTimeSlot(null);
        setData('start_time', '');
        setData('end_time', '');
        
        // In real app, fetch available slots for the selected date
        info('Loading available service slots...');
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
        setData('start_time', slot.start_time);
        setData('end_time', slot.end_time);
    };

    const handleRequirementToggle = (requirement) => {
        const current = selectedRequirements;
        let updated;
        
        if (current.includes(requirement)) {
            updated = current.filter(r => r !== requirement);
        } else {
            updated = [...current, requirement];
        }
        
        setSelectedRequirements(updated);
        setData('special_requirements', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Enhanced validation for homecare services
        if (!data.service_type) {
            warning('Please select a homecare service type');
            setCurrentStep(1);
            return;
        }
        
        if (!data.appointment_date) {
            warning('Please select a service date');
            setCurrentStep(2);
            return;
        }
        
        if (!data.start_time || !data.end_time) {
            warning('Please select a service time slot');
            setCurrentStep(2);
            return;
        }
        
        if (!data.title.trim()) {
            warning('Please enter a title for your service request');
            setCurrentStep(3);
            return;
        }

        if (!data.address.trim()) {
            warning('Please provide the property address for service');
            setCurrentStep(3);
            return;
        }

        info('Scheduling your homecare service...');

        post('/appointments', {
            onSuccess: () => {
                success('🏡 Service appointment scheduled successfully! Our NWB team will contact you to confirm details and prepare for your visit.');
                reset();
                setCurrentStep(1);
                setSelectedTimeSlot(null);
                setSelectedRequirements([]);
            },
            onError: () => {
                error('Failed to schedule service appointment. Please try again or call our emergency hotline: (323) 555-HOME');
            }
        });
    };

    const getServiceIcon = (serviceType) => {
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
            general_maintenance: '🛠️'
        };
        return icons[serviceType] || '📅';
    };

    const getServiceDescription = (serviceType) => {
        const descriptions = {
            preventive_maintenance: 'Monthly subscription visits and routine property upkeep',
            emergency_repair: 'Urgent home repairs requiring immediate attention',
            property_inspection: 'Comprehensive property assessments and reports',
            home_improvement: 'Renovations, upgrades, and property enhancements',
            hvac_service: 'Heating, ventilation, and air conditioning maintenance',
            plumbing_service: 'Pipe repairs, fixture installations, leak fixes',
            electrical_service: 'Wiring, outlets, lighting, and electrical repairs',
            roofing_service: 'Roof inspections, repairs, and gutter maintenance',
            painting_service: 'Interior/exterior painting and touch-up services',
            landscaping_service: 'Garden maintenance, sprinkler systems, outdoor repairs',
            security_service: 'Lock repairs, security system maintenance, safety checks',
            general_maintenance: 'Other property maintenance and repair services'
        };
        return descriptions[serviceType] || 'Professional homecare service';
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90); // 3 months ahead
        return maxDate.toISOString().split('T')[0];
    };

    const canProceedToStep = (step) => {
        switch(step) {
            case 2:
                return data.service_type;
            case 3:
                return data.service_type && data.appointment_date && data.start_time;
            case 4:
                return data.service_type && data.appointment_date && data.start_time && data.title.trim() && data.address.trim();
            default:
                return true;
        }
    };

    return (
        <ClientLayout title="Schedule Homecare Service - NWB" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Enhanced Header with NWB Branding */}
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
                            Schedule Homecare Service
                        </h2>
                        <p className="text-xl text-slate-300 mb-2">
                            Professional property maintenance by licensed contractors
                        </p>
                        <p className="text-sm font-medium mb-2" style={{ color: "#00b3ba" }}>
                            New Ways To Build (NWB) • Licensed & Insured • Serving LA since 2014
                        </p>
                        <p className="text-sm text-slate-400">
                            Book your service appointment in a few simple steps
                        </p>
                    </div>
                </div>

                {/* Emergency Alert */}
                <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-start space-x-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-2">Emergency Service Available 24/7</h3>
                            <p className="text-slate-300 mb-3">
                                For urgent property emergencies (water leaks, electrical failures, security breaches), contact our emergency response team immediately:
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

                {/* Progress Steps */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                    currentStep >= step 
                                        ? 'text-white border-2'
                                        : 'bg-[#232424] text-gray-400'
                                }`} style={currentStep >= step ? { backgroundColor: "#00b3ba", borderColor: "#00b3ba" } : {}}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`w-16 h-1 mx-2 transition-all ${
                                        currentStep > step ? 'bg-[#232424]' : 'bg-[#232424]'
                                    }`} style={currentStep > step ? { backgroundColor: "#00b3ba" } : {}}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-sm">
                        <span className={currentStep >= 1 ? 'text-white' : 'text-gray-400'}>Service Type</span>
                        <span className={currentStep >= 2 ? 'text-white' : 'text-gray-400'}>Date & Time</span>
                        <span className={currentStep >= 3 ? 'text-white' : 'text-gray-400'}>Property Details</span>
                        <span className={currentStep >= 4 ? 'text-white' : 'text-gray-400'}>Review & Book</span>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-8">
                    
                    {/* Step 1: Service Type Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Select Property Service Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(defaultServiceTypes).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setData('service_type', value)}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                            data.service_type === value
                                                ? 'text-white border-white/30'
                                                : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                        style={data.service_type === value ? { 
                                            borderColor: "#00b3ba", 
                                            backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                        } : {}}
                                    >
                                        <div className="flex items-center mb-3">
                                            <span className="text-3xl mr-3">{getServiceIcon(value)}</span>
                                            <span className="font-semibold text-lg">{label}</span>
                                        </div>
                                        <p className="text-sm opacity-80">
                                            {getServiceDescription(value)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            {errors.service_type && (
                                <p className="text-red-400 text-sm">{errors.service_type}</p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Date & Time Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Select Service Date & Time</h3>
                            
                            {/* Date Selection */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Service Date
                                </label>
                                <input
                                    type="date"
                                    value={data.appointment_date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    min={getTomorrowDate()}
                                    max={getMaxDate()}
                                    className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent"
                                    style={{ '--tw-ring-color': '#00b3ba' }}
                                    required
                                />
                                <p className="text-sm text-gray-400 mt-2">
                                    Emergency services available 24/7 by calling (323) 555-HOME
                                </p>
                                {errors.appointment_date && (
                                    <p className="text-red-400 text-sm mt-2">{errors.appointment_date}</p>
                                )}
                            </div>

                            {/* Time Slot Selection */}
                            {data.appointment_date && (
                                <div>
                                    <label className="block text-lg font-semibold text-white mb-3">
                                        Available Service Time Slots
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {mockTimeSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleTimeSlotSelect(slot)}
                                                className={`p-4 rounded-lg border text-center transition-all ${
                                                    selectedTimeSlot?.start_time === slot.start_time
                                                        ? 'text-white border-white/30'
                                                        : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                                }`}
                                                style={selectedTimeSlot?.start_time === slot.start_time ? { 
                                                    borderColor: "#00b3ba", 
                                                    backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                                } : {}}
                                            >
                                                <div className="font-medium">{slot.label}</div>
                                                <div className="text-xs text-gray-400 mt-1">2-hour service window</div>
                                            </button>
                                        ))}
                                    </div>
                                    {mockTimeSlots.length === 0 && (
                                        <p className="text-yellow-400 text-sm">No available service slots for this date. Please select another date or call for emergency service.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Property & Service Details */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Property & Service Details</h3>
                            
                            {/* Service Title */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Service Request Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                                    style={{ '--tw-ring-color': '#00b3ba' }}
                                    placeholder="Brief description of the property service needed"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-400 text-sm mt-2">{errors.title}</p>
                                )}
                            </div>

                            {/* Property Address */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Property Address (Los Angeles) *
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                    style={{ '--tw-ring-color': '#00b3ba' }}
                                    placeholder="Enter your Los Angeles property address where service is needed&#10;Include unit number, gate codes, or access instructions if applicable"
                                    required
                                />
                                {errors.address && (
                                    <p className="text-red-400 text-sm mt-2">{errors.address}</p>
                                )}
                            </div>

                            {/* Service Description */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Service Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                    style={{ '--tw-ring-color': '#00b3ba' }}
                                    placeholder="Provide detailed information about the property maintenance or repair needed. Include specific rooms, areas, symptoms, materials required, or any relevant details that will help our technicians prepare for the service visit."
                                />
                                {errors.description && (
                                    <p className="text-red-400 text-sm mt-2">{errors.description}</p>
                                )}
                            </div>

                            {/* Priority Level */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Service Priority Level
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(defaultPriorities).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('priority', value)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                                data.priority === value
                                                    ? 'text-white border-white/30'
                                                    : 'border-white/30 bg-white/5 hover:bg-white/10'
                                            }`}
                                            style={data.priority === value ? { 
                                                borderColor: "#00b3ba", 
                                                backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                            } : {}}
                                        >
                                            <div className={`text-lg font-bold mb-1 ${
                                                value === 'low' ? 'text-green-400' :
                                                value === 'medium' ? 'text-yellow-400' :
                                                value === 'high' ? 'text-orange-400' :
                                                'text-red-400'
                                            }`}>
                                                {label}
                                            </div>
                                            <p className="text-xs text-gray-400">{priorityDescriptions[value]}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Contact Phone for Service Day
                                </label>
                                <input
                                    type="tel"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                                    style={{ '--tw-ring-color': '#00b3ba' }}
                                    placeholder="Phone number for technician coordination on service day"
                                />
                                {errors.contact_phone && (
                                    <p className="text-red-400 text-sm mt-2">{errors.contact_phone}</p>
                                )}
                            </div>

                            {/* Property Access & Safety Requirements */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Property Access & Safety Requirements
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {specialRequirementOptions.map((requirement) => (
                                        <label
                                            key={requirement.value}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedRequirements.includes(requirement.value)
                                                    ? 'text-white border-white/30'
                                                    : 'border-white/30 bg-white/5 hover:bg-white/10'
                                            }`}
                                            style={selectedRequirements.includes(requirement.value) ? { 
                                                borderColor: "#00b3ba", 
                                                backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                            } : {}}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRequirements.includes(requirement.value)}
                                                onChange={() => handleRequirementToggle(requirement.value)}
                                                className="sr-only"
                                            />
                                            <span className="text-xl mr-3">{requirement.icon}</span>
                                            <span className="text-white font-medium">{requirement.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Service Notes */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Additional Property & Service Notes
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                    style={{ '--tw-ring-color': '#00b3ba' }}
                                    placeholder="Any additional information about property access, preferred materials, previous work history, or special instructions for our technicians..."
                                />
                                {errors.notes && (
                                    <p className="text-red-400 text-sm mt-2">{errors.notes}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review & Confirm */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Review & Confirm Service Booking</h3>
                            
                            <div className="bg-white/5 rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-4xl">{getServiceIcon(data.service_type)}</span>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">{data.title}</h4>
                                        <p className="text-gray-300">{defaultServiceTypes[data.service_type]}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Service Date & Time</label>
                                        <p className="text-white">
                                            {new Date(data.appointment_date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-white">
                                            {selectedTimeSlot?.label}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Priority Level</label>
                                        <p className={`font-medium ${
                                            data.priority === 'low' ? 'text-green-400' :
                                            data.priority === 'medium' ? 'text-yellow-400' :
                                            data.priority === 'high' ? 'text-orange-400' :
                                            'text-red-400'
                                        }`}>
                                            {defaultPriorities[data.priority]} Priority
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Property Address</label>
                                    <p className="text-white">{data.address}</p>
                                </div>

                                {data.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Service Description</label>
                                        <p className="text-white">{data.description}</p>
                                    </div>
                                )}

                                {data.contact_phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Contact Phone</label>
                                        <p className="text-white">{data.contact_phone}</p>
                                    </div>
                                )}

                                {selectedRequirements.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Property Requirements</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRequirements.map((req) => {
                                                const requirement = specialRequirementOptions.find(r => r.value === req);
                                                return requirement ? (
                                                    <span key={req} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                        <span>{requirement.icon}</span>
                                                        {requirement.label}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                {data.notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Additional Notes</label>
                                        <p className="text-white">{data.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border border-yellow-500/20 rounded-lg p-4" style={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}>
                                <h4 className="text-yellow-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">🏡</span>
                                    NWB Homecare Service Information
                                </h4>
                                <ul className="text-yellow-200 text-sm space-y-1">
                                    <li>• Our licensed technicians will arrive within the scheduled time window</li>
                                    <li>• Service includes Inspection Session, work completion, and cleanup</li>
                                    <li>• You will receive SMS updates and can track technician arrival</li>
                                    <li>• Emergency services available 24/7 at (323) 555-HOME</li>
                                    <li>• All work includes NWB quality guarantee and warranty</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <div className="flex gap-4 flex-1">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    ← Previous
                                </button>
                            )}
                            
                            <Link
                                href="/appointments"
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center"
                            >
                                Cancel
                            </Link>
                        </div>

                        <div className="flex gap-4 flex-1">
                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!canProceedToStep(currentStep + 1)}
                                    className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                                    style={{ 
                                        background: "linear-gradient(135deg, #00b3ba 0%, #008a94 100%)"
                                    }}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Scheduling Service...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Confirm Service Booking
                                            <span className="ml-2">🏡</span>
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Service Benefits */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">🎯</span>
                        Why Choose NWB Homecare Services?
                    </h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">🛡️</span>
                            <h4 className="text-white font-semibold mb-1">Licensed & Insured</h4>
                            <p className="text-gray-300 text-sm">CA contractor license & full insurance coverage</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">⚡</span>
                            <h4 className="text-white font-semibold mb-1">24/7 Emergency</h4>
                            <p className="text-gray-300 text-sm">Always available for urgent property issues</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">✅</span>
                            <h4 className="text-white font-semibold mb-1">Quality Guarantee</h4>
                            <p className="text-gray-300 text-sm">100% satisfaction guarantee on all work</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">🏆</span>
                            <h4 className="text-white font-semibold mb-1">500+ Happy Clients</h4>
                            <p className="text-gray-300 text-sm">Serving LA homeowners since 2014</p>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}