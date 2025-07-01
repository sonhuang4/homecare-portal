import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '../Context/ToastContext';

export default function AdminLayout({ children, title = 'Admin Dashboard', auth }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { success } = useToast();

    const handleLogout = () => {
        router.post('/logout', {}, {
            onSuccess: () => {
                success('Logged out successfully');
            }
        });
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: '📊',
            current: route().current('admin.dashboard')
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: '👥',
            current: route().current('admin.users.*')
        },
        {
            name: 'Requests', 
            href: '/admin/requests',
            icon: '📋',
            current: route().current('admin.requests.*')
        },
        {
            name: 'Documents',
            href: '/admin/documents',
            icon: '📄',
            current: route().current('admin.documents.*')
        },
    ];

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Logo Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <Link href="/admin/dashboard" className="flex items-center space-x-3">
                                <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    🏠
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">NWB Admin</h2>
                                    <p className="text-xs text-gray-400">Homecare Portal</p>
                                </div>
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Admin User Info */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{auth.user.name}</p>
                                    <p className="text-gray-400 text-xs">Administrator</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        item.current
                                            ? 'text-white border border-white/20'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                    style={item.current ? { backgroundColor: "rgba(0, 179, 186, 0.2)" } : {}}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-white/10 space-y-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <span className="text-lg">👁️</span>
                                <span>View as Client</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
                            >
                                <span className="text-lg">🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:ml-72">
                    {/* Top bar */}
                    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden text-gray-400 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <h1 className="text-xl font-semibold text-white">{title}</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Quick Actions */}
                                <Link
                                    href="/admin/requests"
                                    className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                                    title="View Requests"
                                >
                                    <span className="text-xl">📋</span>
                                </Link>
                                <Link
                                    href="/admin/appointments"
                                    className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                                    title="View Appointments"
                                >
                                    <span className="text-xl">📅</span>
                                </Link>
                                <button 
                                    className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                                    title="Emergency Alert"
                                >
                                    <span className="text-xl">🚨</span>
                                </button>

                                {/* User Menu */}
                                <div className="flex items-center space-x-2 pl-4 border-l border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white text-sm font-medium hidden sm:block">
                                        {auth.user.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}