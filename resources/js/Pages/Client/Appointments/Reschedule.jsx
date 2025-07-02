import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link } from '@inertiajs/react';

export default function RescheduleAppointment({ auth, appointment, availableDates = [] }) {
    const { success, error, info, warning } = useToast();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const { data, setData, patch, processing, errors } = useForm({
        appointment_date: '',
        start_time: '',
        end_time: ''
    });

    // Mock available dates if none provided for development
    const mockAvailableDates = availableDates.length > 0 ? availableDates : [
        {
            date: '2024-06-25',
            date_formatted: 'Jun 25, 2024',
            day_name: 'Tuesday',
            slots: [
                { start_time: '08:00', end_time: '10:00', label: '8:00 AM - 10:00 AM' },
                { start_time: '10:00', end_time: '12:00', label: '10:00 AM - 12:00 PM' },
                { start_time: '14:00', end_time: '16:00', label: '2:00 PM - 4:00 PM' }
            ]
        },
        {
            date: '2024-06-26',
            date_formatted: 'Jun 26, 2024',
            day_name: 'Wednesday',
            slots: [
                { start_time: '08:00', end_time: '10:00', label: '8:00 AM - 10:00 AM' },
                { start_time: '12:00', end_time: '14:00', label: '12:00 PM - 2:00 PM' },
                { start_time: '16:00', end_time: '18:00', label: '4:00 PM - 6:00 PM' }
            ]
        },
        {
            date: '2024-06-27',
            date_formatted: 'Jun 27, 2024',
            day_name: 'Thursday',
            slots: [
                { start_time: '09:00', end_time: '11:00', label: '9:00 AM - 11:00 AM' },
                { start_time: '13:00', end_time: '15:00', label: '1:00 PM - 3:00 PM' },
                { start_time: '15:00', end_time: '17:00', label: '3:00 PM - 5:00 PM' }
            ]
        },
        {
            date: '2024-06-28',
            date_formatted: 'Jun 28, 2024',
            day_name: 'Friday',
            slots: [
                { start_time: '08:00', end_time: '10:00', label: '8:00 AM - 10:00 AM' },
                { start_time: '11:00', end_time: '13:00', label: '11:00 AM - 1:00 PM' },
                { start_time: '14:00', end_time: '16:00', label: '2:00 PM - 4:00 PM' }
            ]
        }
    ];

    // Use real appointment data from backend or mock data for development
    const mockAppointment = appointment || {
        id: 1,
        service_type: 'preventive_maintenance',
        title: 'Monthly Preventive Maintenance Visit',
        appointment_date: '2024-06-25',
        start_time: '10:00',
        end_time: '12:00',
        service_type_label: 'Preventive Maintenance',
        full_date_time: 'Jun 25, 2024 at 10:00 AM',
        address: '1247 Sunset Blvd, Los Angeles, CA 90026',
        priority_label: 'Standard'
    };

    const handleDateSelect = (dateOption) => {
        setSelectedDate(dateOption);
        setSelectedTimeSlot(null);
        setData({
            appointment_date: dateOption.date,
            start_time: '',
            end_time: ''
        });
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot);
        setData({
            ...data,
            start_time: slot.start_time,
            end_time: slot.end_time
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.appointment_date) {
            warning('Please select a new service date');
            return;
        }
        
        if (!data.start_time || !data.end_time) {
            warning('Please select a service time slot');
            return;
        }

        info('Rescheduling your homecare service appointment...');

        patch(`/appointments/${mockAppointment.id}/reschedule`, {
            onSuccess: () => {
                success('🏡 Service appointment rescheduled successfully! Our NWB team has been notified and will contact you to confirm the new schedule.');
            },
            onError: () => {
                error('Failed to reschedule service appointment. The selected time slot may no longer be available. Please call (323) 555-HOME for immediate assistance.');
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
            general_maintenance: '🛠️',
            // Legacy medical services for backward compatibility
            consultation: '👨‍⚕️',
            home_visit: '🏠',
            follow_up: '🔄',
            assessment: '📋',
            therapy: '💪',
            medical_checkup: '🩺'
        };
        return icons[serviceType] || '📅';
    };

    const formatDateTime = (date, time) => {
        if (mockAppointment.full_date_time) {
            return mockAppointment.full_date_time;
        }
        
        const appointmentDate = new Date(date);
        const timeOnly = time.includes('T') ? new Date(time) : new Date(`2000-01-01T${time}`);
        
        return appointmentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' at ' + timeOnly.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <ClientLayout title="Reschedule Service Appointment - NWB Homecare" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Enhanced Header with NWB Branding */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/appointments"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                ← Back to Service Appointments
                            </Link>
                        </div>
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white mb-3 flex items-center justify-center">
                                <span className="mr-4 text-5xl">🏡</span>
                                Reschedule Service Appointment
                            </h2>
                            <p className="text-xl text-slate-300 mb-2">
                                Select a new date and time for your property service
                            </p>
                            <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                New Ways To Build (NWB) • Flexible Scheduling • Licensed Contractors
                            </p>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact Alert */}
                <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-1">Need Emergency Service?</h3>
                            <p className="text-slate-300 text-sm mb-2">
                                For urgent property emergencies that can't wait for rescheduling:
                            </p>
                            <a 
                                href="tel:+13235554663" 
                                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 text-sm"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                📞 818---397--8536 - 24/7 Emergency Line
                            </a>
                        </div>
                    </div>
                </div>

                {/* Current Service Appointment Info */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Service Appointment</h3>
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-start gap-4">
                            <span className="text-4xl">{getServiceIcon(mockAppointment.service_type)}</span>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-white mb-1">{mockAppointment.title}</h4>
                                <p className="text-gray-300 mb-2">{mockAppointment.service_type_label}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-yellow-400 font-medium flex items-center">
                                            <span className="mr-2">📅</span>
                                            Currently scheduled: {formatDateTime(mockAppointment.appointment_date, mockAppointment.start_time)}
                                        </p>
                                        {mockAppointment.priority_label && (
                                            <p className="text-gray-300 flex items-center mt-1">
                                                <span className="mr-2">⚡</span>
                                                Priority: {mockAppointment.priority_label}
                                            </p>
                                        )}
                                    </div>
                                    {mockAppointment.address && (
                                        <div>
                                            <p className="text-gray-300 flex items-start">
                                                <span className="mr-2 mt-0.5">📍</span>
                                                <span className="flex-1">{mockAppointment.address}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reschedule Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6">Choose New Service Date & Time</h3>
                    
                    {mockAvailableDates.length > 0 ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Available Service Dates */}
                            <div className="space-y-6">
                                {mockAvailableDates.map((dateOption, index) => (
                                    <div
                                        key={dateOption.date}
                                        className={`rounded-xl border-2 transition-all duration-200 ${
                                            selectedDate?.date === dateOption.date
                                                ? 'text-white border-white/30'
                                                : 'border-white/30 bg-white/5'
                                        }`}
                                        style={selectedDate?.date === dateOption.date ? { 
                                            borderColor: "#00b3ba", 
                                            backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                        } : {}}
                                    >
                                        {/* Date Header */}
                                        <button
                                            type="button"
                                            onClick={() => handleDateSelect(dateOption)}
                                            className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 rounded-t-xl transition-colors"
                                        >
                                            <div>
                                                <h4 className="text-lg font-semibold text-white flex items-center">
                                                    <span className="mr-2">🗓️</span>
                                                    {dateOption.day_name}
                                                </h4>
                                                <p className="text-gray-300">{dateOption.date_formatted}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                                    {dateOption.slots.length} service slots available
                                                </span>
                                                <span className={`transform transition-transform ${
                                                    selectedDate?.date === dateOption.date ? 'rotate-180' : ''
                                                }`}>
                                                    ⌄
                                                </span>
                                            </div>
                                        </button>

                                        {/* Service Time Slots */}
                                        {selectedDate?.date === dateOption.date && (
                                            <div className="p-4 pt-0 border-t border-white/10">
                                                <p className="text-gray-300 mb-3 flex items-center">
                                                    <span className="mr-2">⏰</span>
                                                    Available service time slots (2-hour windows):
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {dateOption.slots.map((slot, slotIndex) => (
                                                        <button
                                                            key={slotIndex}
                                                            type="button"
                                                            onClick={() => handleTimeSlotSelect(slot)}
                                                            className={`p-4 rounded-lg border text-center transition-all ${
                                                                selectedTimeSlot?.start_time === slot.start_time
                                                                    ? 'text-white border-white/30'
                                                                    : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                                            }`}
                                                            style={selectedTimeSlot?.start_time === slot.start_time ? { 
                                                                borderColor: "#00b3ba", 
                                                                backgroundColor: "rgba(0, 179, 186, 0.2)" 
                                                            } : {}}
                                                        >
                                                            <div className="font-medium">{slot.label}</div>
                                                            <div className="text-xs text-gray-400 mt-1">Professional service window</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Confirmation Section */}
                            {selectedDate && selectedTimeSlot && (
                                <div className="border border-green-500/20 rounded-xl p-6" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                                    <h4 className="text-green-300 font-semibold mb-3 flex items-center">
                                        <span className="mr-2">✅</span>
                                        New Service Appointment Details
                                    </h4>
                                    <div className="text-white space-y-2">
                                        <p className="flex items-center">
                                            <span className="mr-2">📅</span>
                                            <strong>Service Date:</strong> {selectedDate.date_formatted} ({selectedDate.day_name})
                                        </p>
                                        <p className="flex items-center">
                                            <span className="mr-2">⏰</span>
                                            <strong>Service Time:</strong> {selectedTimeSlot.label}
                                        </p>
                                        <p className="flex items-center">
                                            <span className="mr-2">🏠</span>
                                            <strong>Service Type:</strong> {mockAppointment.service_type_label}
                                        </p>
                                        <div className="mt-3 p-3 rounded-lg bg-white/5">
                                            <p className="text-green-300 text-sm">
                                                <strong>Rescheduling Summary:</strong> Your service appointment will be moved from <span className="text-yellow-300">{formatDateTime(mockAppointment.appointment_date, mockAppointment.start_time)}</span> to <span className="text-green-300">{selectedDate.date_formatted} at {selectedTimeSlot.label.split(' - ')[0]}</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Link
                                    href={`/appointments/${mockAppointment.id}`}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center"
                                >
                                    Cancel Rescheduling
                                </Link>
                                
                                <button
                                    type="submit"
                                    disabled={processing || !selectedDate || !selectedTimeSlot}
                                    className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
                                    style={{ 
                                        background: selectedDate && selectedTimeSlot && !processing 
                                            ? "linear-gradient(135deg, #00b3ba 0%, #008a94 100%)" 
                                            : "#6b7280"
                                    }}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Rescheduling Service...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Confirm Service Reschedule
                                            <span className="ml-2">🏡</span>
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Form Validation Errors */}
                            {errors.appointment_date && (
                                <p className="text-red-400 text-sm">{errors.appointment_date}</p>
                            )}
                            {errors.start_time && (
                                <p className="text-red-400 text-sm">{errors.start_time}</p>
                            )}
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">🏡</div>
                            <h3 className="text-xl font-medium text-white mb-2">No Available Service Slots</h3>
                            <p className="text-gray-400 mb-6">
                                There are currently no available service appointments in the next 14 days. 
                                Our team is working to accommodate your needs - please contact us for priority scheduling.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="tel:+13235554663"
                                    className="text-white px-6 py-3 rounded-lg font-medium transition-all"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    📞 Call (323) 555-HOME
                                </a>
                                <button
                                    onClick={() => info('WhatsApp support integration coming soon!')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    💬 WhatsApp Support
                                </button>
                                <Link
                                    href={`/appointments/${mockAppointment.id}`}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center"
                                >
                                    Back to Appointment
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* NWB Rescheduling Information */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                        <span className="mr-2">🏡</span>
                        NWB Service Rescheduling Policy
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="text-blue-300 font-medium mb-2">No-Fee Rescheduling</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Free rescheduling 24+ hours in advance</li>
                                <li>• Emergency rescheduling always free</li>
                                <li>• Subscription members get priority slots</li>
                                <li>• Weather-related delays are automatic</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-green-300 font-medium mb-2">What Stays the Same</h5>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>• Service type and scope remain unchanged</li>
                                <li>• Same assigned technician when possible</li>
                                <li>• Property access requirements preserved</li>
                                <li>• Original service notes and preparations</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Important Service Information */}
                <div className="border border-yellow-500/20 rounded-xl p-6" style={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}>
                    <h4 className="text-yellow-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">ℹ️</span>
                        Important Rescheduling Information
                    </h4>
                    <ul className="text-yellow-200 text-sm space-y-2">
                        <li>• <strong>Confirmation:</strong> You will receive SMS and email confirmation once rescheduled</li>
                        <li>• <strong>Technician Assignment:</strong> We'll try to keep the same technician for continuity</li>
                        <li>• <strong>Service Preparation:</strong> All materials and tools remain prepared for your service</li>
                        <li>• <strong>Property Access:</strong> Previous access instructions and requirements are preserved</li>
                        <li>• <strong>Priority Scheduling:</strong> Subscription members get first access to premium time slots</li>
                        <li>• <strong>Emergency Changes:</strong> Call (323) 555-HOME for same-day emergency rescheduling</li>
                    </ul>
                </div>
            </div>
        </ClientLayout>
    );
}