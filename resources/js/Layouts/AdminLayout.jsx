import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useToast } from '../Context/ToastContext';

export default function AdminLayout({ children, title = 'Admin Dashboard', auth }) {
    const page = usePage();
    const url = page.url || '';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { success, info } = useToast();

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
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            current: url === '/admin/dashboard' || url === '/admin',
            emoji: '📊',
            description: 'System overview'
        },
        {
            name: 'Users Management',
            href: '/admin/users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            current: url.includes('/admin/users'),
            emoji: '👥',
            description: 'Client accounts & profiles',
            badge: 3 // New registrations
        },
        {
            name: 'Service Requests',
            href: '/admin/requests',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            current: url.includes('/admin/requests'),
            emoji: '📋',
            description: 'Support & maintenance requests',
            badge: 7 // Pending requests
        },
        {
            name: 'Documents',
            href: '/admin/documents',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            current: url.includes('/admin/documents'),
            emoji: '📄',
            description: 'Contracts & reports'
        },
        {
            name: 'Billing & Subscriptions',
            href: '/admin/subscriptions',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            current: url.includes('/admin/subscriptions') || url.includes('/admin/billing'),
            emoji: '💳',
            description: 'Payment management'
        },
    ];

    // Quick action items for different admin sections
    const quickActions = [
        {
            name: 'Add New User',
            href: '/admin/users/create',
            icon: '👤',
            description: 'Create client account'
        },
    ];

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: "#00b3ba" }}></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full filter blur-2xl" style={{ backgroundColor: "#00b3ba" }}></div>
                </div>

                <div className="relative z-10 flex h-screen">
                    {/* Sidebar */}
                    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-white/5 backdrop-blur-lg border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                        <div className="flex h-full flex-col">
                            {/* Logo */}
                            <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
                                <Link href="/admin/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                    <img src="/images/logo.png" alt="NWB Logo" className="w-10 h-10" />
                                    <div>
                                        <div className="text-white text-lg font-bold">Admin Portal</div>
                                        <div className="text-xs font-medium" style={{ color: "#00b3ba" }}>
                                            New Ways To Build
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Admin User Info */}
                            <div className="px-6 py-4 border-b border-white/10">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: "#00b3ba" }}>
                                        👑
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">
                                            {auth?.user?.name || 'Administrator'}
                                        </p>
                                        <p className="text-xs text-slate-400">System Administrator</p>
                                        <div className="flex items-center mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                                            <span className="text-xs text-green-400">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
                                    Management
                                </div>
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                            item.current
                                                ? 'text-white shadow-lg'
                                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                        style={item.current ? { backgroundColor: "rgba(0, 179, 186, 0.2)" } : {}}
                                    >
                                        <span className="mr-3 group-hover:scale-110 transition-transform" style={{ color: item.current ? "#00b3ba" : "inherit" }}>
                                            {item.icon}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span>{item.name}</span>
                                                <div className="flex items-center gap-2">
                                                    {/* Badge for notifications/counts */}
                                                    {item.badge && (
                                                        <span className="text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold" style={{ backgroundColor: "#be0909" }}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {/* Current page indicator */}
                                                    {item.current && (
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#00b3ba" }}></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </nav>

                            {/* Quick Actions Section */}
                            <div className="px-6 py-4 border-t border-white/10 space-y-1">
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
                                    Quick Actions
                                </div>
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.href}
                                        className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                    >
                                        <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
                                            {action.icon}
                                        </span>
                                        <div className="flex-1">
                                            <div>{action.name}</div>
                                            <div className="text-xs text-slate-400">{action.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Bottom Actions */}
                            <div className="px-6 py-4 border-t border-white/10 space-y-1">
                                <Link
                                    href="/dashboard"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View as Client
                                </Link>
                                <Link
                                    href="/help"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Help & Support
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile sidebar overlay */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <div className="absolute inset-0 bg-black/50"></div>
                        </div>
                    )}

                    {/* Main content */}
                    <div className="flex flex-1 flex-col lg:pl-0">
                        {/* Top bar */}
                        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white/5 backdrop-blur-lg border-b border-white/10 px-4 shadow-sm lg:px-6">
                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="text-white lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>

                            {/* Breadcrumb / Page title */}
                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                                <div className="flex items-center gap-x-2">
                                    <h1 className="text-xl font-semibold text-white">{title}</h1>
                                    {/* Breadcrumb navigation */}
                                    {url.includes('/admin/users') && (
                                        <nav className="flex items-center space-x-2 text-sm text-slate-400">
                                            <span>/</span>
                                            {url === '/admin/users' && <span>Users Management</span>}
                                            {url.includes('/admin/users/create') && <span>Create User</span>}
                                            {url.includes('/admin/users/') && !url.includes('/create') && url !== '/admin/users' && <span>User Details</span>}
                                        </nav>
                                    )}
                                    {url.includes('/admin/requests') && (
                                        <nav className="flex items-center space-x-2 text-sm text-slate-400">
                                            <span>/</span>
                                            <span>Service Requests</span>
                                        </nav>
                                    )}
                                    {url.includes('/admin/appointments') && (
                                        <nav className="flex items-center space-x-2 text-sm text-slate-400">
                                            <span>/</span>
                                            <span>Appointments</span>
                                        </nav>
                                    )}
                                </div>
                                
                                {/* Top bar actions */}
                                <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
                                    {/* System status indicator */}
                                    <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <span className="text-green-400 text-xs font-medium">System Online</span>
                                    </div>

                                    {/* Emergency notifications */}
                                    <button className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                                        <span className="sr-only">Emergency alerts</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                        {/* Emergency badge */}
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center font-semibold" style={{ backgroundColor: "rgb(190 9 9)" }}>
                                            2
                                        </span>
                                    </button>

                                    {/* Regular notifications */}
                                    <button className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                                        <span className="sr-only">View notifications</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        {/* Notification badge */}
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center font-semibold" style={{ backgroundColor: "#00b3ba" }}>
                                            8
                                        </span>
                                    </button>

                                    {/* Context-sensitive quick action button */}
                                    {url.includes('/admin/users') ? (
                                        <Link
                                            href="/admin/users/create"
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add User
                                        </Link>
                                    ) : url.includes('/admin/requests') ? (
                                        <button
                                            onClick={() => info('Bulk actions available in requests list')}
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Bulk Actions
                                        </button>
                                    ) : url.includes('/admin/appointments') ? (
                                        <Link
                                            href="/admin/appointments/create"
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                                            </svg>
                                            Schedule Service
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/admin/dashboard"
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                    )}

                                    {/* Admin profile menu */}
                                    <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#00b3ba" }}>
                                            {auth?.user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-white text-sm font-medium">
                                                {auth?.user?.name || 'Administrator'}
                                            </p>
                                            <p className="text-slate-400 text-xs">Admin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page content */}
                        <main className="flex-1 overflow-y-auto">
                            <div className="px-4 py-6 lg:px-6">
                                {children}
                            </div>
                        </main>

                        {/* Admin footer with stats */}
                        <footer className="bg-white/5 backdrop-blur-lg border-t border-white/10 px-6 py-4">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center space-x-6 text-xs text-slate-400">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <span>System Status: Operational</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span>⚡</span>
                                        <span>Server Load: 23%</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span>👥</span>
                                        <span>Active Users: 47</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span>🔒</span>
                                        <span>Security: Normal</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-xs">
                                    <span className="text-slate-400">
                                        © 2025 New Ways To Build (NWB) - Admin Portal v2.1.0
                                    </span>
                                    <Link
                                        href="/admin/system/logs"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        System Logs
                                    </Link>
                                    <Link
                                        href="/admin/help"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Admin Help
                                    </Link>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}