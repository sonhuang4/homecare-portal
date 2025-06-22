import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useToast } from '../../Context/ToastContext';

export default function Register() {
    const { success, error, info, warning } = useToast();
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client', // Default to client
        terms: false,
    });

    // Show validation errors as toasts
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // Show first error as toast
            const firstErrorKey = Object.keys(errors)[0];
            const firstError = errors[firstErrorKey];
            error(`${firstErrorKey.charAt(0).toUpperCase() + firstErrorKey.slice(1)}: ${firstError}`);
        }
    }, [errors]);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        // Validate terms acceptance
        if (!data.terms) {
            warning('Please accept the terms and conditions to continue.');
            return;
        }

        // Check password confirmation
        if (data.password !== data.password_confirmation) {
            error('Passwords do not match. Please check and try again.');
            return;
        }

        info('Creating your account...');

        post(route('register'), {
            onSuccess: () => {
                success('🎉 Welcome to Homecare Portal! Your account has been created successfully.');
            },
            onError: () => {
                error('Registration failed. Please check your information and try again.');
            }
        });
    };

    const handleRoleChange = (newRole) => {
        setData('role', newRole);
        if (newRole === 'admin') {
            info('Admin accounts have additional management capabilities.');
        } else {
            info('Client accounts provide access to personal portal features.');
        }
    };

    return (
        <>
            <Head title="Register" />
            
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
                        <Link href="/" className="text-white text-2xl font-bold flex items-center space-x-2 hover:text-blue-200 transition-colors">
                            <span className="text-3xl">🏠</span>
                            <span>Homecare Portal</span>
                        </Link>
                        <div className="space-x-4">
                            <Link 
                                href="/"
                                className="text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10 font-medium"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
                    <div className="max-w-lg w-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-gray-300 text-lg">Join our platform today</p>
                        </div>

                        {/* Registration Form */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Full Name Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm mt-1">
                                            <span>⚠️</span>
                                            <span>{errors.name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        autoComplete="username"
                                        placeholder="Enter your email"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm mt-1">
                                            <span>⚠️</span>
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Account Type */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Account Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange('client')}
                                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                                data.role === 'client'
                                                    ? 'border-blue-500 bg-blue-500/20 text-white'
                                                    : 'border-white/30 bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl mb-1">👤</div>
                                                <div className="font-medium">Client</div>
                                                <div className="text-xs opacity-80">Personal access</div>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange('admin')}
                                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                                data.role === 'admin'
                                                    ? 'border-purple-500 bg-purple-500/20 text-white'
                                                    : 'border-white/30 bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl mb-1">👑</div>
                                                <div className="font-medium">Admin</div>
                                                <div className="text-xs opacity-80">Management access</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        autoComplete="new-password"
                                        placeholder="Create a secure password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm mt-1">
                                            <span>⚠️</span>
                                            <span>{errors.password}</span>
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-400 mt-1">
                                        Minimum 8 characters with letters and numbers
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm mt-1">
                                            <span>⚠️</span>
                                            <span>{errors.password_confirmation}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Terms and Conditions */}
                                <div className="space-y-2">
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            name="terms"
                                            type="checkbox"
                                            checked={data.terms}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 transition-colors"
                                            onChange={(e) => setData('terms', e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-300 leading-5">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                                Terms and Conditions
                                            </Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                    {!data.terms && errors.terms && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm">
                                            <span>⚠️</span>
                                            <span>You must accept the terms and conditions</span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Creating Account...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center space-x-2">
                                            <span>Create Account</span>
                                            <span>✨</span>
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-300">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>

                            {/* Features Preview */}
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <p className="text-center text-sm text-gray-400 mb-4">What you'll get:</p>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Request Management</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Easy Booking</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Document Access</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Multi-Language</span>
                                    </div>
                                    {data.role === 'admin' && (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-purple-400">👑</span>
                                                <span>User Management</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-purple-400">👑</span>
                                                <span>Admin Dashboard</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400 flex items-center justify-center space-x-2">
                                <span>🔒</span>
                                <span>Your data is encrypted and secure</span>
                            </p>
                        </div>
                    </div>
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
            </div>
        </>
    );
}