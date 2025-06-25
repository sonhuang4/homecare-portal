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
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            current: url === '/dashboard'
        },
        {
            name: t('navigation.requests'),
            href: '/requests',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            current: url.includes('/requests')
        },
        {
            name: t('navigation.appointments'),
            href: '/appointments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                </svg>
            ),
            current: url.includes('/appointments'),
            badge: 2 // Number of upcoming appointments
        },
        {
            name: t('navigation.whatsapp_support'),
            href: '/whatsapp',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            current: url.includes('/whatsapp')
        },
        {
            name: t('navigation.documents'),
            href: '/documents',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            current: url.includes('/documents')
        },
        {
            name: t('navigation.account'),
            href: '/account',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            current: url.includes('/account')
        }
    ];

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }} dir={getDirection()}>
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: "#00b3ba" }}></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full filter blur-2xl" style={{ backgroundColor: "#00b3ba" }}></div>
                </div>

                <div className="relative z-10 flex h-screen">
                    {/* Sidebar */}
                    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                        <div className="flex h-full flex-col">
                            {/* Logo */}
                            <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
                                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                    <img src="/images/logo.png" alt="NWB Logo" className="w-10 h-10" />
                                    <div>
                                        <div className="text-white text-lg font-bold">Homecare</div>
                                        <div className="text-xs font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                                    </div>
                                </Link>
                            </div>

                            {/* User Info */}
                            <div className="px-6 py-4 border-b border-white/10">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#00b3ba" }}>
                                        {auth?.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">
                                            {auth?.user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-slate-400">{t('messages.client_account')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                            item.current
                                                ? 'text-white shadow-lg'
                                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                        style={item.current ? { backgroundColor: "rgba(0, 179, 186, 0.2)" } : {}}
                                    >
                                        <span className="mr-3 group-hover:scale-110 transition-transform" style={{ color: item.current ? "#00b3ba" : "inherit" }}>
                                            {item.icon}
                                        </span>
                                        <span className="flex-1">{item.name}</span>
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
                                    </Link>
                                ))}
                            </nav>

                            {/* Quick Actions Section */}
                            <div className="px-6 py-4 border-t border-white/10 space-y-1">
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
                                    {t('navigation.quick_actions')}
                                </div>
                                <Link
                                    href="/appointments/create"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                                    </svg>
                                    {t('navigation.book_appointment')}
                                </Link>
                                <Link
                                    href="/requests/create"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    {t('navigation.new_request')}
                                </Link>
                                <Link
                                    href="/whatsapp"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {t('navigation.whatsapp_support')}
                                </Link>
                            </div>

                            {/* Bottom Actions */}
                            <div className="px-6 py-4 border-t border-white/10 space-y-1">
                                <Link
                                    href="/help"
                                    className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('navigation.help_support')}
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
                                    {/* Breadcrumb for appointments */}
                                    {url.includes('/appointments') && (
                                        <nav className="flex items-center space-x-2 text-sm text-slate-400">
                                            <span>/</span>
                                            {url === '/appointments' && <span>{t('messages.my_appointments')}</span>}
                                            {url.includes('/appointments/create') && <span>{t('messages.book_appointment')}</span>}
                                            {url.includes('/appointments/') && url.includes('/reschedule') && <span>{t('messages.reschedule')}</span>}
                                            {url.includes('/appointments/') && !url.includes('/create') && !url.includes('/reschedule') && url !== '/appointments' && <span>{t('messages.appointment_details')}</span>}
                                        </nav>
                                    )}
                                    {/* Breadcrumb for requests */}
                                    {url.includes('/requests') && (
                                        <nav className="flex items-center space-x-2 text-sm text-slate-400">
                                            <span>/</span>
                                            {url === '/requests' && <span>{t('navigation.requests')}</span>}
                                            {url.includes('/requests/create') && <span>{t('navigation.new_request')}</span>}
                                        </nav>
                                    )}
                                    {/* Breadcrumb for WhatsApp */}
                                    {url.includes('/whatsapp') && (
                                        <nav className="flex items-center space-x-2 text-sm text-slate-400">
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
                                    <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
                                        <span className="sr-only">View notifications</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        {/* Notification badge */}
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center font-semibold" style={{ backgroundColor: "rgb(190 9 9)" }}>
                                            3
                                        </span>
                                    </button>

                                    {/* Context-sensitive quick action button */}
                                    {url.includes('/appointments') ? (
                                        <Link
                                            href="/appointments/create"
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                                            </svg>
                                            {t('messages.book_appointment')}
                                        </Link>
                                    ) : url.includes('/whatsapp') ? (
                                        <Link
                                            href="/whatsapp"
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            {t('messages.whatsapp_support')}
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/requests/create"
                                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            style={{ backgroundColor: "#00b3ba" }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
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
            </div>
        </>
    );
}