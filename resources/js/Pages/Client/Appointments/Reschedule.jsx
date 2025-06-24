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

    // Mock available dates if none provided
    const mockAvailableDates = availableDates.length > 0 ? availableDates : [
        {
            date: '2024-06-25',
            date_formatted: 'Jun 25, 2024',
            day_name: 'Tuesday',
            slots: [
                { start_time: '09:00', end_time: '10:00', label: '9:00 AM - 10:00 AM' },
                { start_time: '11:00', end_time: '12:00', label: '11:00 AM - 12:00 PM' },
                { start_time: '14:00', end_time: '15:00', label: '2:00 PM - 3:00 PM' }
            ]
        },
        {
            date: '2024-06-26',
            date_formatted: 'Jun 26, 2024',
            day_name: 'Wednesday',
            slots: [
                { start_time: '08:00', end_time: '09:00', label: '8:00 AM - 9:00 AM' },
                { start_time: '10:00', end_time: '11:00', label: '10:00 AM - 11:00 AM' },
                { start_time: '15:00', end_time: '16:00', label: '3:00 PM - 4:00 PM' },
                { start_time: '16:00', end_time: '17:00', label: '4:00 PM - 5:00 PM' }
            ]
        },
        {
            date: '2024-06-27',
            date_formatted: 'Jun 27, 2024',
            day_name: 'Thursday',
            slots: [
                { start_time: '09:00', end_time: '10:00', label: '9:00 AM - 10:00 AM' },
                { start_time: '13:00', end_time: '14:00', label: '1:00 PM - 2:00 PM' },
                { start_time: '14:00', end_time: '15:00', label: '2:00 PM - 3:00 PM' }
            ]
        }
    ];

    // Mock appointment data if none provided
    const mockAppointment = appointment || {
        id: 1,
        service_type: 'home_visit',
        title: 'Weekly Home Care Visit',
        appointment_date: '2024-06-25',
        start_time: '10:00',
        end_time: '11:00',
        service_type_label: 'Home Visit',
        full_date_time: 'Jun 25, 2024 at 10:00 AM'
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
            warning('Please select a new date');
            return;
        }
        
        if (!data.start_time || !data.end_time) {
            warning('Please select a time slot');
            return;
        }

        info('Rescheduling your appointment...');

        patch(`/appointments/${mockAppointment.id}/reschedule`, {
            onSuccess: () => {
                success('🎉 Appointment rescheduled successfully!');
            },
            onError: () => {
                error('Failed to reschedule appointment. The selected time slot may no longer be available.');
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

    return (
        <ClientLayout title="Reschedule Appointment" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/appointments"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        ← Back to Appointments
                    </Link>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Reschedule Appointment</h2>
                    <p className="text-gray-300">Select a new date and time for your appointment</p>
                </div>

                {/* Current Appointment Info */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Appointment</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">{getServiceIcon(mockAppointment.service_type)}</span>
                        <div>
                            <h4 className="text-xl font-bold text-white">{mockAppointment.title}</h4>
                            <p className="text-gray-300">{mockAppointment.service_type_label}</p>
                            <p className="text-yellow-400 font-medium">
                                Currently scheduled: {mockAppointment.full_date_time}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reschedule Form */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6">Choose New Date & Time</h3>
                    
                    {mockAvailableDates.length > 0 ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Available Dates */}
                            <div className="space-y-6">
                                {mockAvailableDates.map((dateOption, index) => (
                                    <div
                                        key={dateOption.date}
                                        className={`rounded-xl border-2 transition-all duration-200 ${
                                            selectedDate?.date === dateOption.date
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-white/30 bg-white/5'
                                        }`}
                                    >
                                        {/* Date Header */}
                                        <button
                                            type="button"
                                            onClick={() => handleDateSelect(dateOption)}
                                            className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 rounded-t-xl transition-colors"
                                        >
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">
                                                    {dateOption.day_name}
                                                </h4>
                                                <p className="text-gray-300">{dateOption.date_formatted}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-blue-400">
                                                    {dateOption.slots.length} slots available
                                                </span>
                                                <span className={`transform transition-transform ${
                                                    selectedDate?.date === dateOption.date ? 'rotate-180' : ''
                                                }`}>
                                                    ⌄
                                                </span>
                                            </div>
                                        </button>

                                        {/* Time Slots */}
                                        {selectedDate?.date === dateOption.date && (
                                            <div className="p-4 pt-0 border-t border-white/10">
                                                <p className="text-gray-300 mb-3">Available time slots:</p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {dateOption.slots.map((slot, slotIndex) => (
                                                        <button
                                                            key={slotIndex}
                                                            type="button"
                                                            onClick={() => handleTimeSlotSelect(slot)}
                                                            className={`p-3 rounded-lg border text-center transition-all ${
                                                                selectedTimeSlot?.start_time === slot.start_time
                                                                    ? 'border-green-500 bg-green-500/20 text-white'
                                                                    : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            <div className="font-medium">{slot.label}</div>
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
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                                    <h4 className="text-green-300 font-semibold mb-3 flex items-center">
                                        <span className="mr-2">✅</span>
                                        New Appointment Details
                                    </h4>
                                    <div className="text-white">
                                        <p className="mb-2">
                                            <strong>Date:</strong> {selectedDate.date_formatted} ({selectedDate.day_name})
                                        </p>
                                        <p className="mb-2">
                                            <strong>Time:</strong> {selectedTimeSlot.label}
                                        </p>
                                        <p className="text-green-300 text-sm">
                                            Your appointment will be moved from {mockAppointment.full_date_time} to this new time.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Link
                                    href={`/appointments/${mockAppointment.id}`}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center"
                                >
                                    Cancel
                                </Link>
                                
                                <button
                                    type="submit"
                                    disabled={processing || !selectedDate || !selectedTimeSlot}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Rescheduling...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Confirm Reschedule
                                            <span className="ml-2">📅</span>
                                        </span>
                                    )}
                                </button>
                            </div>

                            {errors.appointment_date && (
                                <p className="text-red-400 text-sm">{errors.appointment_date}</p>
                            )}
                            {errors.start_time && (
                                <p className="text-red-400 text-sm">{errors.start_time}</p>
                            )}
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-xl font-medium text-white mb-2">No Available Slots</h3>
                            <p className="text-gray-400 mb-6">
                                There are currently no available time slots in the next 14 days. 
                                Please contact our support team for assistance with rescheduling.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => info('Contact support feature coming soon!')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    Contact Support
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

                {/* Important Notes */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <h4 className="text-yellow-300 font-semibold mb-3 flex items-center">
                        <span className="mr-2">ℹ️</span>
                        Rescheduling Information
                    </h4>
                    <ul className="text-yellow-200 text-sm space-y-2">
                        <li>• Rescheduling is free of charge when done at least 24 hours in advance</li>
                        <li>• You will receive a confirmation email once the reschedule is processed</li>
                        <li>• The appointment details (service type, duration, etc.) will remain the same</li>
                        <li>• If you need to change other details, please contact our support team</li>
                        <li>• Late cancellations (less than 24 hours) may incur a fee</li>
                    </ul>
                </div>
            </div>
        </ClientLayout>
    );
}