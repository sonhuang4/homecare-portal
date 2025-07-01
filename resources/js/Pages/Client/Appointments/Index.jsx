import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link, router } from '@inertiajs/react';

export default function AppointmentsIndex({ auth, appointments = [], stats = {}, filters = {} }) {
    const { info, success } = useToast();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleFilter = (filterType, value) => {
        const params = new URLSearchParams(window.location.search);
        
        if (value === 'all' || value === '') {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(`/appointments?${params.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const openDetailsModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setSelectedAppointment(null);
        setShowDetailsModal(false);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        // Handle both full datetime and time-only strings
        const time = timeString.includes('T') ? new Date(timeString) : new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDateTime = (date, time) => {
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

    // Service types for filtering (should match your model)
    const serviceTypes = {
        preventive_maintenance: 'Preventive Maintenance',
        emergency_repair: 'Emergency Repair',
        property_inspection: 'Property Inspection',
        home_improvement: 'Home Improvement',
        hvac_service: 'HVAC Service',
        plumbing_service: 'Plumbing Service',
        electrical_service: 'Electrical Service',
        roofing_service: 'Roofing Service',
        painting_service: 'Painting Service',
        landscaping_service: 'Landscaping Service',
        security_service: 'Security Service',
        general_maintenance: 'General Maintenance',
        consultation: 'Consultation',
        home_visit: 'Home Visit',
        follow_up: 'Follow-up Visit',
        assessment: 'Assessment',
        therapy: 'Therapy Session',
    };

    return (
        <ClientLayout title="My Service Appointments - NWB Homecare" auth={auth}>
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
                                <h2 className="text-4xl font-bold text-white flex items-center">
                                    <span className="mr-4 text-5xl">🏡</span>
                                    My Service Appointments
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Professional property maintenance scheduling
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                    New Ways To Build (NWB) • Licensed & Insured • Serving LA since 2014
                                </p>
                            </div>
                            <Link
                                href="/appointments/create"
                                className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                <span>+</span>
                                Schedule Service
                            </Link>
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
                                For urgent property emergencies (water leaks, electrical failures, security breaches):
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

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-white">{stats.total || 0}</div>
                        <div className="text-gray-300 text-sm">Total Services</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.upcoming || 0}</div>
                        <div className="text-gray-300 text-sm">Upcoming</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-orange-400">{stats.today || 0}</div>
                        <div className="text-gray-300 text-sm">Today</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.completed || 0}</div>
                        <div className="text-gray-300 text-sm">Completed</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Service Status</label>
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no_show">No Show</option>
                            </select>
                        </div>

                        {/* Service Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Service Type</label>
                            <select
                                value={filters.service_type || 'all'}
                                onChange={(e) => handleFilter('service_type', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Services</option>
                                {Object.entries(serviceTypes).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => router.get('/appointments')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Service Appointments Grid */}
                {appointments.length > 0 ? (
                    <div className="grid gap-6">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Service Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{getServiceIcon(appointment.service_type)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-xl font-bold text-white">{appointment.title}</h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status, appointment.status_color)}`}>
                                                        {appointment.status_label}
                                                    </span>
                                                    <span className={`text-sm font-medium ${appointment.priority_color}`}>
                                                        {appointment.priority_label} Priority
                                                    </span>
                                                </div>
                                                {appointment.description && (
                                                    <p className="text-gray-300 mb-3">{appointment.description}</p>
                                                )}
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">📅</span>
                                                            <span>{appointment.full_date_time || formatDateTime(appointment.appointment_date, appointment.start_time)}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">⏱️</span>
                                                            <span>{appointment.duration || 60} minutes</span>
                                                        </div>
                                                        {appointment.assigned_staff && (
                                                            <div className="flex items-center text-gray-300">
                                                                <span className="mr-2">👷‍♂️</span>
                                                                <span>{appointment.assigned_staff}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">🏷️</span>
                                                            <span>{appointment.service_type_label}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {appointment.address && (
                                                            <div className="flex items-start text-gray-300">
                                                                <span className="mr-2 mt-0.5">📍</span>
                                                                <span className="flex-1">{appointment.address}</span>
                                                            </div>
                                                        )}
                                                        {appointment.contact_phone && (
                                                            <div className="flex items-center text-gray-300">
                                                                <span className="mr-2">📞</span>
                                                                <span>{appointment.contact_phone}</span>
                                                            </div>
                                                        )}
                                                        {appointment.special_requirements && appointment.special_requirements.length > 0 && (
                                                            <div className="flex items-start text-gray-300">
                                                                <span className="mr-2 mt-0.5">⚠️</span>
                                                                <span className="flex-1 text-xs">
                                                                    Special requirements
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                                        <button
                                            onClick={() => openDetailsModal(appointment)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                        >
                                            View Details
                                        </button>
                                        
                                        {appointment.can_be_rescheduled && (
                                            <Link
                                                href={`/appointments/${appointment.id}/reschedule`}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                            >
                                                Reschedule
                                            </Link>
                                        )}
                                        
                                        {appointment.can_be_cancelled && (
                                            <Link
                                                href={`/appointments/${appointment.id}/cancel`}
                                                method="patch"
                                                as="button"
                                                data={{
                                                    cancellation_reason: 'schedule_conflict',
                                                    cancellation_notes: 'Cancelled via client portal'
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                                onClick={(e) => {
                                                    if (!confirm('Are you sure you want to cancel this appointment?')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </Link>
                                        )}

                                        <Link
                                            href={`/appointments/${appointment.id}`}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                        >
                                            Full View
                                        </Link>
                                        
                                        {appointment.status === 'completed' && (
                                            <button
                                                onClick={() => info('Feedback feature coming soon!')}
                                                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                                style={{ backgroundColor: "#00b3ba" }}
                                            >
                                                Leave Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-center py-12">
                        <div className="text-6xl mb-4">🏡</div>
                        <h3 className="text-xl font-medium text-white mb-2">No service appointments found</h3>
                        <p className="text-gray-400 mb-6">
                            {Object.keys(filters).some(key => filters[key] && filters[key] !== 'all') 
                                ? "No appointments match your current filters. Try adjusting your search criteria."
                                : "You don't have any property service appointments scheduled yet."}
                        </p>
                        <Link
                            href="/appointments/create"
                            className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                            style={{ backgroundColor: "#00b3ba" }}
                        >
                            Schedule Your First Service
                        </Link>
                    </div>
                )}

                {/* Quick Details Modal */}
                {showDetailsModal && selectedAppointment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeDetailsModal}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">Service Appointment Details</h3>
                                <button
                                    onClick={closeDetailsModal}
                                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{getServiceIcon(selectedAppointment.service_type)}</span>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{selectedAppointment.title}</h4>
                                        <p className="text-gray-300">{selectedAppointment.service_type_label}</p>
                                    </div>
                                </div>

                                {selectedAppointment.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Service Description</label>
                                        <p className="text-white">{selectedAppointment.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
                                        <p className="text-white">
                                            {selectedAppointment.full_date_time || formatDateTime(selectedAppointment.appointment_date, selectedAppointment.start_time)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                                        <p className="text-white">{selectedAppointment.duration || 60} minutes</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedAppointment.status, selectedAppointment.status_color)}`}>
                                            {selectedAppointment.status_label}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                                        <p className={`font-medium ${selectedAppointment.priority_color}`}>
                                            {selectedAppointment.priority_label}
                                        </p>
                                    </div>
                                </div>

                                {selectedAppointment.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Property Location</label>
                                        <p className="text-white">{selectedAppointment.address}</p>
                                    </div>
                                )}

                                {selectedAppointment.assigned_staff && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Technician</label>
                                        <p className="text-white">{selectedAppointment.assigned_staff}</p>
                                    </div>
                                )}

                                {selectedAppointment.contact_phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Contact Phone</label>
                                        <p className="text-white">{selectedAppointment.contact_phone}</p>
                                    </div>
                                )}

                                {selectedAppointment.special_requirements && selectedAppointment.special_requirements.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Special Requirements</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAppointment.special_requirements.map((requirement, index) => (
                                                <span key={index} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-sm">
                                                    {requirement}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedAppointment.notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Client Notes</label>
                                        <p className="text-white bg-white/5 p-3 rounded-lg">{selectedAppointment.notes}</p>
                                    </div>
                                )}

                                {selectedAppointment.admin_notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes</label>
                                        <p className="text-white bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">{selectedAppointment.admin_notes}</p>
                                    </div>
                                )}

                                {selectedAppointment.status === 'cancelled' && (
                                    <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        <label className="block text-sm font-medium text-red-300 mb-1">Cancellation Details</label>
                                        {selectedAppointment.cancellation_reason && (
                                            <p className="text-red-200 text-sm mb-1">
                                                Reason: {selectedAppointment.cancellation_reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                        )}
                                        {selectedAppointment.cancellation_notes && (
                                            <p className="text-red-200 text-sm">
                                                Notes: {selectedAppointment.cancellation_notes}
                                            </p>
                                        )}
                                        {selectedAppointment.cancelled_at && (
                                            <p className="text-red-200 text-sm">
                                                Cancelled: {new Date(selectedAppointment.cancelled_at).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={closeDetailsModal}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/appointments/${selectedAppointment.id}`}
                                    className="text-white px-4 py-2 rounded-lg transition-all"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Service Benefits Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">🎯</span>
                        Your NWB Homecare Benefits
                    </h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">🛡️</span>
                            <h4 className="text-white font-semibold mb-1">Licensed & Insured</h4>
                            <p className="text-gray-300 text-sm">Full insurance coverage & CA contractor license</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">⚡</span>
                            <h4 className="text-white font-semibold mb-1">24/7 Emergency</h4>
                            <p className="text-gray-300 text-sm">Always available for urgent property issues</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white/5">
                            <span className="text-3xl block mb-2">💳</span>
                            <h4 className="text-white font-semibold mb-1">Credit System</h4>
                            <p className="text-gray-300 text-sm">Unused visits convert to credits for future use</p>
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