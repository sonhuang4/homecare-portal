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

    const defaultServiceTypes = serviceTypes || {
        consultation: 'Consultation',
        home_visit: 'Home Visit',
        follow_up: 'Follow-up Visit',
        assessment: 'Assessment',
        therapy: 'Therapy Session',
        medical_checkup: 'Medical Checkup'
    };

    const defaultPriorities = priorities || {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent'
    };

    const specialRequirementOptions = [
        { value: 'wheelchair_access', label: 'Wheelchair Access', icon: '♿' },
        { value: 'oxygen_support', label: 'Oxygen Support', icon: '🫁' },
        { value: 'interpreter', label: 'Interpreter Needed', icon: '🗣️' },
        { value: 'mobility_assistance', label: 'Mobility Assistance', icon: '🦯' },
        { value: 'medication_management', label: 'Medication Management', icon: '💊' },
        { value: 'family_member_present', label: 'Family Member Present', icon: '👨‍👩‍👧‍👦' }
    ];

    const priorityDescriptions = {
        low: 'Non-urgent, flexible scheduling',
        medium: 'Standard appointment priority',
        high: 'Important, prefer sooner',
        urgent: 'Immediate attention needed'
    };

    // Mock available slots if none provided
    const mockTimeSlots = availableSlots.length > 0 ? availableSlots : [
        { start_time: '08:00', end_time: '09:00', label: '8:00 AM - 9:00 AM' },
        { start_time: '09:00', end_time: '10:00', label: '9:00 AM - 10:00 AM' },
        { start_time: '10:00', end_time: '11:00', label: '10:00 AM - 11:00 AM' },
        { start_time: '11:00', end_time: '12:00', label: '11:00 AM - 12:00 PM' },
        { start_time: '14:00', end_time: '15:00', label: '2:00 PM - 3:00 PM' },
        { start_time: '15:00', end_time: '16:00', label: '3:00 PM - 4:00 PM' },
        { start_time: '16:00', end_time: '17:00', label: '4:00 PM - 5:00 PM' }
    ];

    const handleDateChange = async (date) => {
        setData('appointment_date', date);
        setSelectedTimeSlot(null);
        setData('start_time', '');
        setData('end_time', '');
        
        // In real app, fetch available slots for the selected date
        info('Loading available time slots...');
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
        
        // Validation
        if (!data.service_type) {
            warning('Please select a service type');
            setCurrentStep(1);
            return;
        }
        
        if (!data.appointment_date) {
            warning('Please select an appointment date');
            setCurrentStep(2);
            return;
        }
        
        if (!data.start_time || !data.end_time) {
            warning('Please select a time slot');
            setCurrentStep(2);
            return;
        }
        
        if (!data.title.trim()) {
            warning('Please enter a title for your appointment');
            setCurrentStep(3);
            return;
        }

        info('Booking your appointment...');

        post('/appointments', {
            onSuccess: () => {
                success('🎉 Appointment booked successfully! You will receive a confirmation email shortly.');
                reset();
                setCurrentStep(1);
                setSelectedTimeSlot(null);
                setSelectedRequirements([]);
            },
            onError: () => {
                error('Failed to book appointment. Please try again.');
            }
        });
    };

    const getServiceIcon = (serviceType) => {
        const icons = {
            consultation: '👨‍⚕️',
            home_visit: '🏠',
            follow_up: '🔄',
            assessment: '📋',
            therapy: '💪',
            medical_checkup: '🩺'
        };
        return icons[serviceType] || '📅';
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
                return data.service_type && data.appointment_date && data.start_time && data.title.trim();
            default:
                return true;
        }
    };

    return (
        <ClientLayout title="Book New Appointment" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Book New Appointment</h2>
                    <p className="text-gray-300">Schedule your healthcare appointment in a few simple steps</p>
                </div>

                {/* Progress Steps */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                    currentStep >= step 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white/20 text-gray-400'
                                }`}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`w-16 h-1 mx-2 transition-all ${
                                        currentStep > step ? 'bg-blue-600' : 'bg-white/20'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-sm">
                        <span className={currentStep >= 1 ? 'text-white' : 'text-gray-400'}>Service Type</span>
                        <span className={currentStep >= 2 ? 'text-white' : 'text-gray-400'}>Date & Time</span>
                        <span className={currentStep >= 3 ? 'text-white' : 'text-gray-400'}>Details</span>
                        <span className={currentStep >= 4 ? 'text-white' : 'text-gray-400'}>Review</span>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-8">
                    
                    {/* Step 1: Service Type Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Select Service Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(defaultServiceTypes).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setData('service_type', value)}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                            data.service_type === value
                                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                                : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center mb-3">
                                            <span className="text-3xl mr-3">{getServiceIcon(value)}</span>
                                            <span className="font-semibold text-lg">{label}</span>
                                        </div>
                                        <p className="text-sm opacity-80">
                                            {value === 'consultation' && 'Professional medical consultation'}
                                            {value === 'home_visit' && 'Healthcare services at your home'}
                                            {value === 'follow_up' && 'Follow-up on previous treatment'}
                                            {value === 'assessment' && 'Health assessment and evaluation'}
                                            {value === 'therapy' && 'Physical or occupational therapy'}
                                            {value === 'medical_checkup' && 'Routine medical examination'}
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
                            <h3 className="text-2xl font-bold text-white mb-6">Select Date & Time</h3>
                            
                            {/* Date Selection */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Appointment Date
                                </label>
                                <input
                                    type="date"
                                    value={data.appointment_date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    min={getTomorrowDate()}
                                    max={getMaxDate()}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.appointment_date && (
                                    <p className="text-red-400 text-sm mt-2">{errors.appointment_date}</p>
                                )}
                            </div>

                            {/* Time Slot Selection */}
                            {data.appointment_date && (
                                <div>
                                    <label className="block text-lg font-semibold text-white mb-3">
                                        Available Time Slots
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {mockTimeSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleTimeSlotSelect(slot)}
                                                className={`p-3 rounded-lg border text-center transition-all ${
                                                    selectedTimeSlot?.start_time === slot.start_time
                                                        ? 'border-blue-500 bg-blue-500/20 text-white'
                                                        : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="font-medium">{slot.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                    {mockTimeSlots.length === 0 && (
                                        <p className="text-yellow-400 text-sm">No available time slots for this date. Please select another date.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Appointment Details */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Appointment Details</h3>
                            
                            {/* Title */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Appointment Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description of your appointment"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-400 text-sm mt-2">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Provide additional details about your appointment, symptoms, or specific needs..."
                                />
                                {errors.description && (
                                    <p className="text-red-400 text-sm mt-2">{errors.description}</p>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Priority Level
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(defaultPriorities).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('priority', value)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                                data.priority === value
                                                    ? 'border-blue-500 bg-blue-500/20'
                                                    : 'border-white/30 bg-white/5 hover:bg-white/10'
                                            }`}
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

                            {/* Address */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Location/Address
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows="2"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Enter address for home visits or specify clinic location preference..."
                                />
                                {errors.address && (
                                    <p className="text-red-400 text-sm mt-2">{errors.address}</p>
                                )}
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Phone number for appointment day contact"
                                />
                                {errors.contact_phone && (
                                    <p className="text-red-400 text-sm mt-2">{errors.contact_phone}</p>
                                )}
                            </div>

                            {/* Special Requirements */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Special Requirements
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {specialRequirementOptions.map((requirement) => (
                                        <label
                                            key={requirement.value}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedRequirements.includes(requirement.value)
                                                    ? 'border-blue-500 bg-blue-500/20'
                                                    : 'border-white/30 bg-white/5 hover:bg-white/10'
                                            }`}
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

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-lg font-semibold text-white mb-3">
                                    Additional Notes
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Any additional information, specific requests, or medical history relevant to this appointment..."
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
                            <h3 className="text-2xl font-bold text-white mb-6">Review & Confirm</h3>
                            
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
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

                                {data.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                        <p className="text-white">{data.description}</p>
                                    </div>
                                )}

                                {data.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                        <p className="text-white">{data.address}</p>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Special Requirements</label>
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

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                <h4 className="text-yellow-300 font-semibold mb-2">📋 Important Information</h4>
                                <ul className="text-yellow-200 text-sm space-y-1">
                                    <li>• Please arrive 10 minutes before your appointment time</li>
                                    <li>• Bring any relevant medical documents or medication lists</li>
                                    <li>• You will receive a confirmation email with detailed instructions</li>
                                    <li>• To reschedule or cancel, please give at least 24 hours notice</li>
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
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Booking Appointment...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Confirm Booking
                                            <span className="ml-2">✅</span>
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </ClientLayout>
    );
}