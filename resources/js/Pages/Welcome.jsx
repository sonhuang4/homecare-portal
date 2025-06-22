import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useToast } from '../Context/ToastContext';

export default function Welcome() {
    const { success, info } = useToast();

    const handleGetStarted = () => {
        info('Welcome to our platform! Please login or register to continue.');
    };

    const handleLearnMore = () => {
        success('Explore our features below to learn more about what we offer!');
    };

    return (
        <>
            <Head title="Welcome" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 p-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="text-white text-2xl font-bold flex items-center space-x-2">
                            <span className="text-3xl">🏠</span>
                            <span>Homecare Portal</span>
                        </div>
                        <div className="space-x-4">
                            <Link 
                                href="/login"
                                className="text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10 font-medium"
                            >
                                Login
                            </Link>
                            <Link 
                                href="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Welcome to Your
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
                                Client Portal
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Manage your account, schedule appointments, track requests, and access your documents 
                            all in one secure platform. Supporting both English and Spanish for your convenience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 shadow-2xl"
                            >
                                Get Started
                                <span className="ml-2">🚀</span>
                            </button>
                            
                            <button
                                onClick={handleLearnMore}
                                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Learn More
                                <span className="ml-2">📖</span>
                            </button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        {/* Feature 1 */}
                        <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📋</div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Request Management</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Submit and track your service requests with real-time updates. 
                                Get notified instantly when your request status changes.
                            </p>
                            <div className="mt-4 text-blue-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                → Learn more
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📅</div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Easy Booking</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Schedule, reschedule, or cancel appointments with just a few clicks. 
                                Integrated calendar view for easy management.
                            </p>
                            <div className="mt-4 text-blue-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                → Book now
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌍</div>
                            <h3 className="text-2xl font-semibold text-white mb-4">Multi-Language</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Full support for English and Spanish languages. 
                                Switch between languages instantly for better accessibility.
                            </p>
                            <div className="mt-4 text-blue-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                → EN | ES
                            </div>
                        </div>
                    </div>

                    {/* Additional Features Row */}
                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        {/* Feature 4 */}
                        <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📄</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Document Access</h3>
                                    <p className="text-gray-300">
                                        Securely view and download your important documents, photos, and reports.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="flex items-start space-x-4">
                                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">💬</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">WhatsApp Integration</h3>
                                    <p className="text-gray-300">
                                        Optional chat support through WhatsApp for quick communication.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-bold text-white mb-12">Trusted by Our Community</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                                <div className="text-gray-300">Happy Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-purple-400 mb-2">2K+</div>
                                <div className="text-gray-300">Requests Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-pink-400 mb-2">24/7</div>
                                <div className="text-gray-300">Support Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-400 mb-2">99%</div>
                                <div className="text-gray-300">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-20 text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join our platform today and experience seamless service management.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 shadow-xl"
                            >
                                Create Account
                                <span className="ml-2">✨</span>
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Sign In
                                <span className="ml-2">👋</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 mt-20 border-t border-white/20 py-8">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <p className="text-gray-400">
                            © 2024 Homecare Portal. All rights reserved. | 
                            <Link href="/privacy" className="hover:text-blue-400 transition-colors ml-1">Privacy Policy</Link> | 
                            <Link href="/terms" className="hover:text-blue-400 transition-colors ml-1">Terms of Service</Link>
                        </p>
                    </div>
                </footer>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}