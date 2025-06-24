import React, { useState } from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';
import { Link, router } from '@inertiajs/react';

export default function AppointmentsIndex({ auth, appointments = [], stats = {}, filters = {} }) {
    const { info, success } = useToast();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Mock data if no real data provided
    const mockAppointments = appointments.length > 0 ? appointments : [
        {
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
            notes: 'Please bring blood pressure medication list',
            assigned_staff: 'Nurse Sarah Johnson',
            service_type_label: 'Home Visit',
            status_label: 'Confirmed',
            priority_label: 'Medium',
            status_color: 'text-green-400',
            priority_color: 'text-yellow-400',
            full_date_time: 'Jun 25, 2024 at 10:00 AM',
            duration: 60,
            is_upcoming: true,
            is_today: false,
            can_be_cancelled: true,
            can_be_rescheduled: true
        },
        {
            id: 2,
            service_type: 'consultation',
            title: 'Follow-up Consultation',
            description: 'Review test results and adjust treatment plan',
            appointment_date: '2024-06-28',
            start_time: '14:00',
            end_time: '15:00',
            status: 'scheduled',
            priority: 'high',
            address: 'Homecare by NWB Clinic, 456 Health Ave',
            contact_phone: '+1 (555) 123-4567',
            notes: 'Bring recent lab results',
            assigned_staff: 'Dr. Michael Chen',
            service_type_label: 'Consultation',
            status_label: 'Scheduled',
            priority_label: 'High',
            status_color: 'text-blue-400',
            priority_color: 'text-orange-400',
            full_date_time: 'Jun 28, 2024 at 2:00 PM',
            duration: 60,
            is_upcoming: true,
            is_today: false,
            can_be_cancelled: true,
            can_be_rescheduled: true
        },
        {
            id: 3,
            service_type: 'therapy',
            title: 'Physical Therapy Session',
            description: 'Continuation of rehabilitation program',
            appointment_date: '2024-06-20',
            start_time: '09:00',
            end_time: '10:00',
            status: 'completed',
            priority: 'medium',
            address: '123 Main St, Anytown, ST 12345',
            contact_phone: '+1 (555) 123-4567',
            notes: 'Focus on shoulder mobility exercises',
            assigned_staff: 'Therapist Lisa Wong',
            service_type_label: 'Therapy Session',
            status_label: 'Completed',
            priority_label: 'Medium',
            status_color: 'text-green-600',
            priority_color: 'text-yellow-400',
            full_date_time: 'Jun 20, 2024 at 9:00 AM',
            duration: 60,
            is_upcoming: false,
            is_today: false,
            can_be_cancelled: false,
            can_be_rescheduled: false
        }
    ];

    const mockStats = Object.keys(stats).length > 0 ? stats : {
        total: 3,
        upcoming: 2,
        today: 0,
        completed: 1
    };

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
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <ClientLayout title="My Appointments" auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">My Appointments</h2>
                        <p className="text-gray-300">Schedule and manage your healthcare appointments</p>
                    </div>
                    <Link
                        href="/appointments/create"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        <span>+</span>
                        Book Appointment
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-white">{mockStats.total}</div>
                        <div className="text-gray-300 text-sm">Total</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-blue-400">{mockStats.upcoming}</div>
                        <div className="text-gray-300 text-sm">Upcoming</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-orange-400">{mockStats.today}</div>
                        <div className="text-gray-300 text-sm">Today</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
                        <div className="text-2xl font-bold text-green-400">{mockStats.completed}</div>
                        <div className="text-gray-300 text-sm">Completed</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Status</label>
                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
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
                                <option value="consultation">Consultation</option>
                                <option value="home_visit">Home Visit</option>
                                <option value="follow_up">Follow-up</option>
                                <option value="assessment">Assessment</option>
                                <option value="therapy">Therapy</option>
                                <option value="medical_checkup">Medical Checkup</option>
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

                {/* Appointments Grid */}
                {mockAppointments.length > 0 ? (
                    <div className="grid gap-6">
                        {mockAppointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Appointment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{getServiceIcon(appointment.service_type)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white">{appointment.title}</h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status, appointment.status_color)}`}>
                                                        {appointment.status_label}
                                                    </span>
                                                    <span className={`text-sm font-medium ${appointment.priority_color}`}>
                                                        {appointment.priority_label} Priority
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 mb-3">{appointment.description}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">📅</span>
                                                            <span>{formatDate(appointment.appointment_date)} at {formatTime(appointment.start_time)}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-300">
                                                            <span className="mr-2">⏱️</span>
                                                            <span>{appointment.duration} minutes</span>
                                                        </div>
                                                        {appointment.assigned_staff && (
                                                            <div className="flex items-center text-gray-300">
                                                                <span className="mr-2">👨‍⚕️</span>
                                                                <span>{appointment.assigned_staff}</span>
                                                            </div>
                                                        )}
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
                                            <button
                                                onClick={() => info('Cancel appointment feature will open confirmation dialog')}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        <Link
                                            href={`/appointments/${appointment.id}`}
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all text-center"
                                        >
                                            Full View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-medium text-white mb-2">No appointments found</h3>
                        <p className="text-gray-400 mb-6">You don't have any appointments scheduled yet.</p>
                        <Link
                            href="/appointments/create"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                        >
                            Book Your First Appointment
                        </Link>
                    </div>
                )}

                {/* Quick Details Modal */}
                {showDetailsModal && selectedAppointment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeDetailsModal}>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">Appointment Details</h3>
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                    <p className="text-white">{selectedAppointment.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
                                        <p className="text-white">{selectedAppointment.full_date_time}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                                        <p className="text-white">{selectedAppointment.duration} minutes</p>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                        <p className="text-white">{selectedAppointment.address}</p>
                                    </div>
                                )}

                                {selectedAppointment.assigned_staff && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Staff</label>
                                        <p className="text-white">{selectedAppointment.assigned_staff}</p>
                                    </div>
                                )}

                                {selectedAppointment.notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                                        <p className="text-white bg-white/5 p-3 rounded-lg">{selectedAppointment.notes}</p>
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
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}