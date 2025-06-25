import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Homecare by NWB - Professional Home Maintenance in Los Angeles" />
            
            <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Navigation */}
                <nav className="relative z-50 p-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                            <img src="/images/logo.png" alt="NWB Logo" className="w-[10rem] h-[9rem]" />
                            <div>
                                <div className="text-white text-2xl font-bold">Homecare</div>
                                <div className="text-sm font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </Link>
                        <div className="space-x-4">
                            <Link 
                                href="/login"
                                className="text-white hover:opacity-80 transition-opacity px-4 py-2 rounded-lg hover:bg-white/10 font-medium"
                            >
                                Sign In
                            </Link>
                            <Link 
                                href="/register"
                                className="text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: "#00b3ba" }}></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full filter blur-2xl" style={{ backgroundColor: "#00b3ba" }}></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-center lg:text-left space-y-8">
                                <div>
                                    <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                        Professional Home
                                        <span className="block" style={{ color: "#00b3ba" }}>
                                            Maintenance Portal
                                        </span>
                                    </h1>
                                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                                        Protect your Los Angeles home with our subscription-based maintenance service. 
                                        Manage appointments, track services, and build credits for future projects—all in one secure portal.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl"
                                        style={{ backgroundColor: "#00b3ba" }}
                                    >
                                        Start Your Membership
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all"
                                    >
                                        Learn More
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                                    <div className="flex items-center text-slate-300">
                                        <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Licensed & Insured</span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">500+ Happy Homeowners</span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Serving LA Since 2014</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Portal Preview */}
                            <div className="relative">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                            <svg className="w-8 h-8" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21V5a2 2 0 012-2h4a2 2 0 012 2v16" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Your Homecare Portal</h3>
                                        <p className="text-slate-300">Everything you need to maintain your home</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                                <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold">Schedule Services</h4>
                                                <p className="text-slate-400 text-sm">Book maintenance appointments online</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                                <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold">Credit Management</h4>
                                                <p className="text-slate-400 text-sm">Track and use your service credits</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                                <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold">WhatsApp Support</h4>
                                                <p className="text-slate-400 text-sm">Get help through integrated chat</p>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Link
                                                href="/register"
                                                className="w-full inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                                                style={{ backgroundColor: "#00b3ba" }}
                                            >
                                                Access Your Portal
                                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Why Choose Homecare by NWB?
                            </h2>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                Professional home maintenance that protects your investment and gives you peace of mind
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-8 h-8" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Priority Scheduling</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Members get preferred appointment times and emergency response when you need it most.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-8 h-8" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Credit Rollover System</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Unused monthly visits convert to credits that accumulate for larger projects and repairs.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-8 h-8" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Quality Guarantee</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Licensed professionals with satisfaction guarantee. Your home's value and safety come first.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 relative">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Ready to Protect Your Home?
                            </h2>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                                Join hundreds of Los Angeles homeowners who trust NWB for professional home maintenance. 
                                Start your membership today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl"
                                    style={{ backgroundColor: "#00b3ba" }}
                                >
                                    Start Free Trial
                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all"
                                >
                                    Contact Us
                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-12 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                <img src="/images/logo.png" alt="NWB Logo" className="w-[4rem] h-[4rem]" />
                                <div>
                                    <div className="text-white text-lg font-bold">Homecare by NWB</div>
                                    <div className="text-slate-400 text-sm">Professional Home Maintenance</div>
                                </div>
                            </div>
                            <div className="text-slate-400 text-sm text-center lg:text-right">
                                <p>© 2024 New Ways To Build. Licensed & Insured in Los Angeles, CA</p>
                                <p className="mt-1">Contact: support@nwb.com | (818) 397-8536</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}