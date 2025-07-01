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

    // Use real appointment data from backend or mock data for development
    const appointment = appointmentData || {
        id: 1,
        service_type: 'preventive_maintenance',
        title: 'Monthly Preventive Maintenance Visit',
        description: 'Routine property inspection and maintenance check including HVAC, plumbing, electrical systems',
        appointment_date: '2024-06-25',
        start_time: '10:00',
        end_time: '12:00',
        status: 'confirmed',
        priority: 'medium',
        address: '1247 Sunset Blvd, Los Angeles, CA 90026',
        contact_phone: '+1 (323) 555-4663',
        special_requirements: ['key_access', 'pet_present', 'ladder_access'],
        notes: 'Focus on kitchen faucet leak and check HVAC filter replacement. Property has two dogs (friendly). Gate code is 1247.',
        admin_notes: 'Technician Mike Rodriguez assigned. Tools and materials prepared. Customer contacted to confirm access requirements.',
        assigned_staff: 'Senior Technician Mike Rodriguez',
        confirmed_at: '2024-06-23T09:15:00.000000Z',
        created_at: '2024-06-20T10:30:00.000000Z',
        updated_at: '2024-06-23T09:15:00.000000Z',
        service_type_label: 'Preventive Maintenance',
        status_label: 'Confirmed',
        priority_label: 'Standard',
        status_color: 'text-green-400',
        priority_color: 'text-yellow-400',
        full_date_time: 'Jun 25, 2024 at 10:00 AM',
        duration: 120,
        is_upcoming: true,
        can_be_cancelled: true,
        can_be_rescheduled: true
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
            key_access: 'Property Key Required',
            gate_code: 'Gate Code Needed',
            pet_present: 'Pets on Property',
            power_shutoff: 'Power Shutoff Required',
            water_shutoff: 'Water Shutoff Required',
            tenant_occupied: 'Tenant Occupied Property',
            ladder_access: 'Ladder/Height Work',
            heavy_equipment: 'Heavy Equipment Needed',
            permits_required: 'Permits Required',
            safety_equipment: 'Special Safety Equipment',
            // Legacy medical requirements for backward compatibility
            wheelchair_access: 'Wheelchair Access',
            oxygen_support: 'Oxygen Support',
            interpreter: 'Interpreter Needed',
            mobility_assistance: 'Mobility Assistance',
            medication_management: 'Medication Management',
            family_member_present: 'Family Member Present'
        };
        return labels[requirement] || requirement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getRequirementIcon = (requirement) => {
        const icons = {
            key_access: '🔑',
            gate_code: '🚪',
            pet_present: '🐕',
            power_shutoff: '⚡',
            water_shutoff: '💧',
            tenant_occupied: '🏠',
            ladder_access: '🪜',
            heavy_equipment: '🚚',
            permits_required: '📋',
            safety_equipment: '🦺',
            // Legacy medical icons
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
                success('🏡 Service appointment cancelled successfully. Our team has been notified.');
                setShowCancelModal(false);
            },
            onError: () => {
                error('Failed to cancel service appointment. Please try again or call (323) 555-HOME.');
            }
        });
    };

    const cancellationReasons = [
        { value: 'schedule_conflict', label: 'Schedule Conflict' },
        { value: 'no_longer_needed', label: 'Service No Longer Needed' },
        { value: 'emergency', label: 'Emergency Situation' },
        { value: 'personal_reasons', label: 'Personal Reasons' },
        { value: 'property_issues', label: 'Property Access Issues' },
        { value: 'other', label: 'Other' }
    ];

    const formatDateTime = (date, time) => {
        if (appointment.full_date_time) {
            return appointment.full_date_time;
        }
        
        const appointmentDate = new Date(date);
        const timeOnly = time.includes('T') ? new Date(time) : new Date(`2000-01-01T${time}`);
        
        return appointmentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) + ' at ' + timeOnly.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <ClientLayout title={`Service Appointment #${appointment.id} - NWB Homecare`} auth={auth}>
            <div className="space-y-6">
                {/* Enhanced Header with NWB Branding */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Link
                                        href="/appointments"
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                    >
                                        ← Back to Service Appointments
                                    </Link>
                                </div>
                                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <span className="text-3xl">{getServiceIcon(appointment.service_type)}</span>
                                    {appointment.title}
                                </h2>
                                <p className="text-gray-300 mt-1">{appointment.service_type_label}</p>
                                <p className="text-sm font-medium mt-1" style={{ color: "#00b3ba" }}>
                                    New Ways To Build (NWB) • Professional Property Maintenance
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(appointment.status, appointment.status_color)}`}>
                                    {appointment.status_label}
                                </span>
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPriorityBadge(appointment.priority, appointment.priority_color)}`}>
                                    {appointment.priority_label} Priority
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact Alert */}
                <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-1">24/7 Emergency Service</h3>
                            <p className="text-slate-300 text-sm mb-2">
                                For urgent property emergencies or appointment changes:
                            </p>
                            <a 
                                href="tel:+13235554663" 
                                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 text-sm"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                📞 (323) 555-HOME - Emergency Hotline
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Service Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Service Information */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6">Service Appointment Details</h3>
                            
                            <div className="space-y-6">
                                {/* Date, Time & Technician */}
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Service Date & Time</label>
                                            <p className="text-white text-lg font-semibold">
                                                {formatDateTime(appointment.appointment_date, appointment.start_time)}
                                            </p>
                                            <p className="text-gray-400 text-sm">Duration: {appointment.duration || 60} minutes</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Assigned Technician</label>
                                            <p className="text-white font-medium flex items-center">
                                                <span className="mr-2">👷‍♂️</span>
                                                {appointment.assigned_staff || 'Technician will be assigned 24 hours before service'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Description */}
                                {appointment.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Service Description</label>
                                        <p className="text-white leading-relaxed bg-white/5 p-4 rounded-lg">
                                            {appointment.description}
                                        </p>
                                    </div>
                                )}

                                {/* Property Location */}
                                {appointment.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Property Address</label>
                                        <div className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                                            <span className="text-xl">📍</span>
                                            <p className="text-white">{appointment.address}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Contact Information */}
                                {appointment.contact_phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone for Service Day</label>
                                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                                            <span className="text-xl">📞</span>
                                            <p className="text-white">{appointment.contact_phone}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Property Access & Safety Requirements */}
                                {appointment.special_requirements && appointment.special_requirements.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Property Access & Safety Requirements</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {appointment.special_requirements.map((requirement, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-white/30" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                                                    <span className="text-xl">{getRequirementIcon(requirement)}</span>
                                                    <span className="text-white font-medium">{getRequirementLabel(requirement)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Property & Service Notes */}
                                {appointment.notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Property & Service Notes</label>
                                        <p className="text-white bg-white/5 p-4 rounded-lg leading-relaxed">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Technician Notes */}
                                {appointment.admin_notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Technician Preparation Notes</label>
                                        <div className="border border-yellow-500/20 rounded-lg p-4" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                                            <p className="text-white leading-relaxed">{appointment.admin_notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Cancellation Details (if cancelled) */}
                                {appointment.status === 'cancelled' && (
                                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                        <label className="block text-sm font-medium text-red-300 mb-2">Cancellation Details</label>
                                        {appointment.cancellation_reason && (
                                            <p className="text-red-200 text-sm mb-1">
                                                Reason: {appointment.cancellation_reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                        )}
                                        {appointment.cancellation_notes && (
                                            <p className="text-red-200 text-sm mb-1">
                                                Notes: {appointment.cancellation_notes}
                                            </p>
                                        )}
                                        {appointment.cancelled_at && (
                                            <p className="text-red-200 text-sm">
                                                Cancelled: {new Date(appointment.cancelled_at).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary & Actions */}
                    <div className="space-y-6">
                        {/* Quick Summary */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Service Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Service Type:</span>
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
                                    <span className="text-gray-300">Requested:</span>
                                    <span className="text-white text-sm">{formatDate(appointment.created_at)}</span>
                                </div>
                                {appointment.confirmed_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Confirmed:</span>
                                        <span className="text-green-400 text-sm">{formatDate(appointment.confirmed_at)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Duration:</span>
                                    <span className="text-white text-sm">{appointment.duration || 60} minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Service Actions */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Service Actions</h3>
                            <div className="space-y-3">
                                {appointment.can_be_rescheduled && (
                                    <Link
                                        href={`/appointments/${appointment.id}/reschedule`}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-all font-medium text-center block"
                                    >
                                        📅 Reschedule Service
                                    </Link>
                                )}
                                
                                {appointment.can_be_cancelled && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all font-medium"
                                    >
                                        ❌ Cancel Service
                                    </button>
                                )}

                                <button
                                    onClick={() => info('WhatsApp support integration coming soon!')}
                                    className="w-full text-white px-4 py-3 rounded-lg transition-all font-medium"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    💬 WhatsApp Support
                                </button>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-all font-medium"
                                >
                                    🖨️ Print Service Details
                                </button>

                                {appointment.status === 'completed' && (
                                    <button
                                        onClick={() => info('Service feedback feature coming soon!')}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all font-medium"
                                    >
                                        ⭐ Rate Service
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* NWB Service Information */}
                        <div className="border border-blue-500/20 rounded-2xl p-6" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                            <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                                <span className="mr-2">🏡</span>
                                NWB Service Information
                            </h4>
                            <ul className="text-blue-200 text-sm space-y-2">
                                <li>• Licensed technicians with 5+ years experience</li>
                                <li>• Arrive within 30-minute window of scheduled time</li>
                                <li>• SMS notifications with live technician tracking</li>
                                <li>• All work includes NWB quality guarantee</li>
                                <li>• Emergency service available 24/7</li>
                                <li>• Free re-service within 30 days if issues persist</li>
                            </ul>
                        </div>

                        {/* Subscription Benefits */}
                        {(appointment.service_type === 'preventive_maintenance' || appointment.service_type === 'general_maintenance') && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <span className="mr-2">💳</span>
                                    Subscription Benefits
                                </h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    <li>• Priority scheduling for subscribers</li>
                                    <li>• Discounted rates on additional services</li>
                                    <li>• Credit rollover for unused visits</li>
                                    <li>• No trip charges for subscription services</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cancel Service Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCancelModal(false)}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-white mb-4">Cancel Service Appointment</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to cancel this service appointment? Our team will be notified immediately.
                            </p>

                            <form onSubmit={handleCancelSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Reason for Cancellation *
                                    </label>
                                    <select
                                        value={data.cancellation_reason}
                                        onChange={(e) => setData('cancellation_reason', e.target.value)}
                                        className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent"
                                        style={{ '--tw-ring-color': '#00b3ba' }}
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
                                        className="w-full px-3 py-2 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                        style={{ '--tw-ring-color': '#00b3ba' }}
                                        placeholder="Any additional information about the cancellation or rescheduling preferences..."
                                    />
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-yellow-200 text-sm">
                                        <strong>Note:</strong> Cancellations less than 24 hours before service may incur a fee. Emergency cancellations are exempt.
                                    </p>
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
                                        {processing ? 'Cancelling...' : 'Cancel Service'}
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