import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link, useForm } from '@inertiajs/react';

export default function AppointmentShow({ auth, appointment: appointmentData }) {
    const { success, info, error, warning } = useToast();
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Form for cancellation
    const { data, setData, patch, processing } = useForm({
        cancellation_reason: '',
        cancellation_notes: ''
    });

    // Mock appointment data if none provided
    const appointment = appointmentData || {
        id: 1,
        service_type: 'home_visit',
        title: 'Weekly Home Care Visit',
        description: 'Regular home care checkup and medication management',
        appointment_date: '2024-06-25',
        start_time: '10:00',
        end_time: '11:00',
        status: 'confirmed',
        priority: 'medium',
        address: '123 Main St, Anytown, ST 12345',
        contact_phone: '+1 (555) 123-4567',
        special_requirements: ['wheelchair_access', 'medication_management'],
        notes: 'Please bring blood pressure medication list',
        admin_notes: 'Patient has been contacted to confirm appointment details. Medical records reviewed.',
        assigned_staff: 'Nurse Sarah Johnson',
        confirmed_at: '2024-06-23T09:15:00.000000Z',
        created_at: '2024-06-20T10:30:00.000000Z',
        updated_at: '2024-06-23T09:15:00.000000Z',
        service_type_label: 'Home Visit',
        status_label: 'Confirmed',
        priority_label: 'Medium',
        status_color: 'text-green-400',
        priority_color: 'text-yellow-400',
        full_date_time: 'Jun 25, 2024 at 10:00 AM',
        duration: 60,
        is_upcoming: true,
        can_be_cancelled: true,
        can_be_rescheduled: true
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

    const getStatusBadge = (status, statusColor) => {
        const badges = {
            scheduled: 'bg-blue-500/20 border-blue-500/30',
            confirmed: 'bg-green-500/20 border-green-500/30',
            in_progress: 'bg-orange-500/20 border-orange-500/30',
            completed: 'bg-green-600/20 border-green-600/30',
            cancelled: 'bg-red-500/20 border-red-500/30',
            no_show: 'bg-gray-500/20 border-gray-500/30'
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

    const getRequirementLabel = (requirement) => {
        const labels = {
            wheelchair_access: 'Wheelchair Access',
            oxygen_support: 'Oxygen Support',
            interpreter: 'Interpreter Needed',
            mobility_assistance: 'Mobility Assistance',
            medication_management: 'Medication Management',
            family_member_present: 'Family Member Present'
        };
        return labels[requirement] || requirement;
    };

    const getRequirementIcon = (requirement) => {
        const icons = {
            wheelchair_access: '♿',
            oxygen_support: '🫁',
            interpreter: '🗣️',
            mobility_assistance: '🦯',
            medication_management: '💊',
            family_member_present: '👨‍👩‍👧‍👦'
        };
        return icons[requirement] || '📋';
    };

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        
        if (!data.cancellation_reason) {
            warning('Please select a cancellation reason');
            return;
        }

        patch(`/appointments/${appointment.id}/cancel`, {
            onSuccess: () => {
                success('Appointment cancelled successfully');
                setShowCancelModal(false);
            },
            onError: () => {
                error('Failed to cancel appointment. Please try again.');
            }
        });
    };

    const cancellationReasons = [
        { value: 'schedule_conflict', label: 'Schedule Conflict' },
        { value: 'no_longer_needed', label: 'No Longer Needed' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'personal_reasons', label: 'Personal Reasons' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <ClientLayout title={`Appointment #${appointment.id}`} auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href="/appointments"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                ← Back to Appointments
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span className="text-3xl">{getServiceIcon(appointment.service_type)}</span>
                            {appointment.title}
                        </h2>
                        <p className="text-gray-300 mt-1">{appointment.service_type_label}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(appointment.status, appointment.status_color)}`}>
                            {appointment.status_label}
                        </span>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPriorityBadge(appointment.priority, appointment.priority_color)}`}>
                            {appointment.priority_label} Priority
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Appointment Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Appointment Information */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6">Appointment Details</h3>
                            
                            <div className="space-y-6">
                                {/* Date and Time */}
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
                                            <p className="text-white text-lg font-semibold">{appointment.full_date_time}</p>
                                            <p className="text-gray-400 text-sm">Duration: {appointment.duration} minutes</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Assigned Staff</label>
                                            <p className="text-white font-medium">{appointment.assigned_staff || 'To be assigned'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {appointment.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                        <p className="text-white leading-relaxed bg-white/5 p-4 rounded-lg">
                                            {appointment.description}
                                        </p>
                                    </div>
                                )}

                                {/* Location */}
                                {appointment.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                        <div className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                                            <span className="text-xl">📍</span>
                                            <p className="text-white">{appointment.address}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Contact Information */}
                                {appointment.contact_phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                                            <span className="text-xl">📞</span>
                                            <p className="text-white">{appointment.contact_phone}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Special Requirements */}
                                {appointment.special_requirements && appointment.special_requirements.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Special Requirements</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {appointment.special_requirements.map((requirement, index) => (
                                                <div key={index} className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                                                    <span className="text-xl">{getRequirementIcon(requirement)}</span>
                                                    <span className="text-blue-300 font-medium">{getRequirementLabel(requirement)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Client Notes */}
                                {appointment.notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Notes</label>
                                        <p className="text-white bg-white/5 p-4 rounded-lg leading-relaxed">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {appointment.admin_notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Staff Notes</label>
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                            <p className="text-yellow-200 leading-relaxed">{appointment.admin_notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary & Actions */}
                    <div className="space-y-6">
                        {/* Quick Summary */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Service:</span>
                                    <span className="text-white text-sm">{appointment.service_type_label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Status:</span>
                                    <span className={`text-sm font-medium ${appointment.status_color}`}>
                                        {appointment.status_label}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Priority:</span>
                                    <span className={`text-sm font-medium ${appointment.priority_color}`}>
                                        {appointment.priority_label}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Created:</span>
                                    <span className="text-white text-sm">{formatDate(appointment.created_at)}</span>
                                </div>
                                {appointment.confirmed_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Confirmed:</span>
                                        <span className="text-green-400 text-sm">{formatDate(appointment.confirmed_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                            <div className="space-y-3">
                                {appointment.can_be_rescheduled && (
                                    <Link
                                        href={`/appointments/${appointment.id}/reschedule`}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-all font-medium text-center block"
                                    >
                                        📅 Reschedule Appointment
                                    </Link>
                                )}
                                
                                {appointment.can_be_cancelled && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all font-medium"
                                    >
                                        ❌ Cancel Appointment
                                    </button>
                                )}

                                <button
                                    onClick={() => info('Contact support feature coming soon!')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all font-medium"
                                >
                                    💬 Contact Support
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-all font-medium"
                                >
                                    🖨️ Print Details
                                </button>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                            <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                                <span className="mr-2">ℹ️</span>
                                Important Information
                            </h4>
                            <ul className="text-blue-200 text-sm space-y-2">
                                <li>• Please arrive 10 minutes before your appointment</li>
                                <li>• Bring a valid ID and insurance card</li>
                                <li>• Bring any relevant medical documents</li>
                                <li>• Cancel at least 24 hours in advance to avoid fees</li>
                                <li>• Contact us if you have any questions</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCancelModal(false)}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-white mb-4">Cancel Appointment</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to cancel this appointment? This action cannot be undone.
                            </p>

                            <form onSubmit={handleCancelSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Reason for Cancellation *
                                    </label>
                                    <select
                                        value={data.cancellation_reason}
                                        onChange={(e) => setData('cancellation_reason', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        {cancellationReasons.map((reason) => (
                                            <option key={reason.value} value={reason.value}>
                                                {reason.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        value={data.cancellation_notes}
                                        onChange={(e) => setData('cancellation_notes', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Any additional information about the cancellation..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCancelModal(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                                    >
                                        Keep Appointment
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Cancelling...' : 'Cancel Appointment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}