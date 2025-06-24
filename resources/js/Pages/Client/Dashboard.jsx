import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ClientLayout from '../../Layouts/ClientLayout';
import { useToast } from '../../Context/ToastContext';

export default function Dashboard({ auth, membership, visits, notifications }) {
    const { success, info, error } = useToast();
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Form for updating profile information
    const { data, setData, patch, errors, processing } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
    });

    // Mock data - replace with real props from Laravel
    const mockData = {
        membership: membership || {
            type: 'Premium',
            status: 'Active',
            startDate: '2024-01-15',
            expiryDate: '2024-12-15',
            autoRenew: true
        },
        visits: visits || {
            total: 24,
            remaining: 8,
            used: 16,
            nextAppointment: '2024-06-25 10:00 AM'
        },
        notifications: notifications || [
            { id: 1, message: 'Your appointment is confirmed for June 25th', type: 'success', time: '2 hours ago' },
            { id: 2, message: 'Document uploaded: Medical Report', type: 'info', time: '1 day ago' },
            { id: 3, message: 'Payment processed successfully', type: 'success', time: '3 days ago' }
        ]
    };

    const handleQuickAction = (action) => {
        switch(action) {
            case 'book':
                // Navigate to appointments create page
                window.location.href = '/appointments/create';
                break;
            case 'request':
                // Navigate to requests create page
                window.location.href = '/requests/create';
                break;
            case 'documents':
                info('Loading your documents...');
                break;
            case 'profile':
                setIsEditingProfile(true);
                break;
            default:
                info('Feature coming soon!');
        }
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                success('Profile updated successfully!');
                setIsEditingProfile(false);
            },
            onError: () => {
                error('There was an error updating your profile.');
            }
        });
    };

    const cancelProfileEdit = () => {
        setIsEditingProfile(false);
        setData({
            name: auth?.user?.name || '',
            email: auth?.user?.email || '',
        });
    };

    return (
        <ClientLayout title="Dashboard" auth={auth}>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {auth?.user?.name || 'Client'}! 👋
                    </h2>
                    <p className="text-xl text-gray-300">
                        Here's an overview of your account and recent activity.
                    </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Membership Status */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Membership</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                mockData.membership.status === 'Active' 
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-red-500/20 text-red-300'
                            }`}>
                                {mockData.membership.status}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-300">Type:</span>
                                <span className="text-white font-medium">{mockData.membership.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Expires:</span>
                                <span className="text-white font-medium">
                                    {new Date(mockData.membership.expiryDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">Auto-Renew:</span>
                                <span className="text-white font-medium">
                                    {mockData.membership.autoRenew ? '✅ Yes' : '❌ No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Visits Overview */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Visits</h3>
                            <span className="text-2xl">📅</span>
                        </div>
                        <div className="space-y-3">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400 mb-1">
                                    {mockData.visits.remaining}
                                </div>
                                <div className="text-sm text-gray-300">Remaining</div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Used:</span>
                                <span className="text-white font-medium">{mockData.visits.used}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(mockData.visits.used / mockData.visits.total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="text-center text-gray-300 text-xs">
                                {mockData.visits.used} of {mockData.visits.total} visits used
                            </div>
                        </div>
                    </div>

                    {/* Next Appointment */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Next Appointment</h3>
                            <span className="text-2xl">⏰</span>
                        </div>
                        <div className="text-center space-y-3">
                            <div>
                                <div className="text-white font-bold text-lg">
                                    10:00 AM
                                </div>
                                <div className="text-gray-300 text-sm">
                                    June 25, 2024
                                </div>
                            </div>
                            <button
                                onClick={() => handleQuickAction('book')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105"
                            >
                                Manage Booking
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => handleQuickAction('book')}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-center group transform hover:scale-105"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📅</div>
                            <div className="text-white font-medium">Book Appointment</div>
                            <div className="text-gray-400 text-xs mt-1">Schedule new visit</div>
                        </button>

                        <button
                            onClick={() => handleQuickAction('request')}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-center group transform hover:scale-105"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                            <div className="text-white font-medium">Submit Request</div>
                            <div className="text-gray-400 text-xs mt-1">New service request</div>
                        </button>

                        <button
                            onClick={() => handleQuickAction('documents')}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-center group transform hover:scale-105"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
                            <div className="text-white font-medium">View Documents</div>
                            <div className="text-gray-400 text-xs mt-1">Access your files</div>
                        </button>

                        <button
                            onClick={() => handleQuickAction('profile')}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-center group transform hover:scale-105"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
                            <div className="text-white font-medium">Account Settings</div>
                            <div className="text-gray-400 text-xs mt-1">Manage profile</div>
                        </button>
                    </div>
                </div>

                {/* Two Column Layout: Account Info & Recent Activity */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Account Information */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="mr-3 text-2xl">👤</span>
                            Account Information
                            {!isEditingProfile && (
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="ml-auto text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1 rounded-lg transition-all"
                                >
                                    Edit
                                </button>
                            )}
                        </h3>

                        {!isEditingProfile ? (
                            // Display Mode
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-gray-300 font-medium">Full Name:</span>
                                    <span className="text-white font-semibold">{auth?.user?.name || 'John Doe'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-gray-300 font-medium">Email:</span>
                                    <span className="text-white font-semibold">{auth?.user?.email || 'john@example.com'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-gray-300 font-medium">Member Since:</span>
                                    <span className="text-white font-semibold">
                                        {new Date(mockData.membership.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-gray-300 font-medium">Account Type:</span>
                                    <span className="text-blue-400 font-semibold">Client</span>
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 font-medium"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelProfileEdit}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="mr-3 text-2xl">🔔</span>
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {mockData.notifications.map((notification) => (
                                <div key={notification.id} className="flex items-start space-x-4 py-3 hover:bg-white/5 rounded-lg transition-all">
                                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                                        notification.type === 'success' ? 'bg-green-400' :
                                        notification.type === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium leading-5">
                                            {notification.message}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4">
                                <button 
                                    onClick={() => info('Opening notifications page...')}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all text-sm font-medium"
                                >
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Account Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-1">24</div>
                            <div className="text-gray-300 text-sm">Total Visits</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-400 mb-1">12</div>
                            <div className="text-gray-300 text-sm">Requests Completed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-1">3</div>
                            <div className="text-gray-300 text-sm">Active Requests</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-yellow-400 mb-1">98%</div>
                            <div className="text-gray-300 text-sm">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}