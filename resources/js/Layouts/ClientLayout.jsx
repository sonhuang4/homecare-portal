import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import useTranslations from '../Hooks/useTranslations';

export default function ClientLayout({ children, title, auth }) {
    const page = usePage();
    const url = page.url || '';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Import translation function
    const { t, getDirection } = useTranslations();

    const navigation = [
        {
            name: t('navigation.dashboard'),
            href: '/dashboard',
            icon: '📊',
            current: url === '/dashboard'
        },
        {
            name: t('navigation.requests'),
            href: '/requests',
            icon: '📋',
            current: url.includes('/requests')
        },
        {
            name: t('navigation.appointments'),
            href: '/appointments',
            icon: '📅',
            current: url.includes('/appointments'),
            badge: 2 // Number of upcoming appointments
        },
        {
            name: t('navigation.whatsapp_support'),
            href: '/whatsapp',
            icon: '💬',
            current: url.includes('/whatsapp')
        },
        {
            name: t('navigation.documents'),
            href: '/documents',
            icon: '📄',
            current: url.includes('/documents')
        },
        {
            name: t('navigation.account'),
            href: '/account',
            icon: '⚙️',
            current: url.includes('/account')
        }
    ];

    return (
        <>
            <Head title={title} />
            
            <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900`} dir={getDirection()}>
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10 flex h-screen">
                    {/* Sidebar */}
                    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                        <div className="flex h-full flex-col">
                            {/* Logo */}
                            <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/20">
                                <Link href="/" className="text-white text-xl font-bold flex items-center space-x-2">
                                    <span className="text-2xl">🏠</span>
                                    <span>{t('messages.homecare_portal')}</span>
                                </Link>
                            </div>

                            {/* User Info */}
                            <div className="px-6 py-4 border-b border-white/20">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {auth?.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">
                                            {auth?.user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-300">{t('messages.client_account')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            item.current
                                                ? 'bg-white/20 text-white shadow-md'
                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                        <span className="flex-1">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            {/* Badge for notifications/counts */}
                                            {item.badge && (
                                                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {/* Current page indicator */}
                                            {item.current && (
                                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </nav>

                            {/* Quick Actions Section */}
                            <div className="px-6 py-4 border-t border-white/20 space-y-2">
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    {t('navigation.quick_actions')}
                                </div>
                                <Link
                                    href="/appointments/create"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-green-500/20 hover:text-green-300 transition-all duration-200"
                                >
                                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">📅</span>
                                    {t('navigation.book_appointment')}
                                </Link>
                                <Link
                                    href="/requests/create"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200"
                                >
                                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">📋</span>
                                    {t('navigation.new_request')}
                                </Link>
                                <Link
                                    href="/whatsapp"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-green-500/20 hover:text-green-300 transition-all duration-200"
                                >
                                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">💬</span>
                                    {t('navigation.whatsapp_support')}
                                </Link>
                            </div>

                            {/* Bottom Actions */}
                            <div className="px-6 py-4 border-t border-white/20 space-y-2">
                                <Link
                                    href="/help"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">❓</span>
                                    {t('navigation.help_support')}
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                                >
                                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform">🚪</span>
                                    {t('navigation.logout')}
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
                        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white/10 backdrop-blur-lg border-b border-white/20 px-4 shadow-sm lg:px-6">
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
                                    {/* Breadcrumb for appointments */}
                                    {url.includes('/appointments') && (
                                        <nav className="flex items-center space-x-2 text-sm text-gray-300">
                                            <span>/</span>
                                            {url === '/appointments' && <span>{t('messages.my_appointments')}</span>}
                                            {url.includes('/appointments/create') && <span>{t('messages.book_appointment')}</span>}
                                            {url.includes('/appointments/') && url.includes('/reschedule') && <span>{t('messages.reschedule')}</span>}
                                            {url.includes('/appointments/') && !url.includes('/create') && !url.includes('/reschedule') && url !== '/appointments' && <span>{t('messages.appointment_details')}</span>}
                                        </nav>
                                    )}
                                    {/* Breadcrumb for requests */}
                                    {url.includes('/requests') && (
                                        <nav className="flex items-center space-x-2 text-sm text-gray-300">
                                            <span>/</span>
                                            {url === '/requests' && <span>{t('navigation.requests')}</span>}
                                            {url.includes('/requests/create') && <span>{t('navigation.new_request')}</span>}
                                        </nav>
                                    )}
                                    {/* Breadcrumb for WhatsApp */}
                                    {url.includes('/whatsapp') && (
                                        <nav className="flex items-center space-x-2 text-sm text-gray-300">
                                            <span>/</span>
                                            <span>{t('navigation.whatsapp_support')}</span>
                                        </nav>
                                    )}
                                </div>
                                
                                {/* Quick actions */}
                                <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
                                    {/* Language Switcher */}
                                    <LanguageSwitcher />

                                    {/* Notifications */}
                                    <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                                        <span className="sr-only">View notifications</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        {/* Notification badge */}
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                            3
                                        </span>
                                    </button>

                                    {/* Context-sensitive quick action button */}
                                    {url.includes('/appointments') ? (
                                        <Link
                                            href="/appointments/create"
                                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                        >
                                            <span>📅</span>
                                            {t('messages.book_appointment')}
                                        </Link>
                                    ) : url.includes('/whatsapp') ? (
                                        <Link
                                            href="/whatsapp"
                                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                        >
                                            <span>💬</span>
                                            {t('messages.whatsapp_support')}
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/requests/create"
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                        >
                                            <span>+</span>
                                            {t('navigation.new_request')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Page content */}
                        <main className="flex-1 overflow-y-auto">
                            <div className="px-4 py-6 lg:px-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>

                {/* Custom animations */}
                <style jsx>{`
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                `}</style>
            </div>
        </>
    );
}