import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useToast } from "../../../Context/ToastContext";

export default function Create({ auth, errors = {} }) {
    const { success, error, info } = useToast();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "client",
        is_active: true,
        notes: "",
        password: "",
        password_confirmation: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setForm(prev => ({ 
            ...prev, 
            password: password, 
            password_confirmation: password 
        }));
        info('Secure password generated');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post("/admin/users", form, {
            onSuccess: () => {
                success('User created successfully!');
                setIsSubmitting(false);
            },
            onError: () => {
                error('Failed to create user. Please check the form.');
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AdminLayout title="Create New User" auth={auth}>
            <div className="space-y-6">
                {/* Header */}
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
                                <h2 className="text-4xl font-bold text-white mb-3 flex items-center">
                                    <span className="mr-4 text-5xl">👤</span>
                                    Create New User
                                </h2>
                                <p className="text-xl text-slate-300 mb-2">
                                    Add a new client or admin to the NWB homecare system
                                </p>
                                <p className="text-sm font-medium" style={{ color: "#00b3ba" }}>
                                    User Management • Account Creation • Simple & Fast
                                </p>
                            </div>
                            <Link
                                href="/admin/users"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Users
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className={`w-full pl-10 px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.name ? 'border-red-500' : 'border-white/30'
                                            }`}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`w-full pl-10 px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.email ? 'border-red-500' : 'border-white/30'
                                            }`}
                                            placeholder="user@example.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        User Role *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <select
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            className="w-full pl-10 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            required
                                        >
                                            <option value="client" className="bg-gray-800">👤 Client</option>
                                            <option value="admin" className="bg-gray-800">👑 Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Property Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="123 Main Street, Los Angeles, CA 90210"
                                    />
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-12 px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.password ? 'border-red-500' : 'border-white/30'
                                            }`}
                                            placeholder="Enter password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Generate secure password
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            className={`w-full pl-10 px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.password_confirmation ? 'border-red-500' : 'border-white/30'
                                            }`}
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>}
                                    {form.password && form.password_confirmation && form.password === form.password_confirmation && (
                                        <p className="mt-1 text-sm text-green-400 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Passwords match
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Admin Notes
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full pl-10 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                        placeholder="Internal notes about this user..."
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">Internal notes visible only to admin users</p>
                            </div>

                            {/* Account Status */}
                            <div className="bg-white/5 p-4 rounded-lg">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="text-white font-medium">Account Active</span>
                                        <p className="text-sm text-gray-300">User can log in and access the system</p>
                                    </div>
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
                                <Link
                                    href="/admin/users"
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Cancel & Return
                                </Link>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm({
                                                name: "",
                                                email: "",
                                                phone: "",
                                                address: "",
                                                role: "client",
                                                is_active: true,
                                                notes: "",
                                                password: "",
                                                password_confirmation: "",
                                            });
                                            info('Form cleared');
                                        }}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Clear Form
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-white ${
                                            isSubmitting 
                                                ? 'bg-gray-600 cursor-not-allowed' 
                                                : 'hover:shadow-xl'
                                        }`}
                                        style={!isSubmitting ? { backgroundColor: "#00b3ba" } : {}}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Create User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Help Info */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
                        <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Quick Guide
                        </h4>
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>• <strong>Required fields:</strong> Name, Email, Password</p>
                            <p>• <strong>Client role:</strong> Standard access to services and portal</p>
                            <p>• <strong>Admin role:</strong> Full system management capabilities</p>
                            <p>• <strong>Password:</strong> Minimum 8 characters (use generator for security)</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}