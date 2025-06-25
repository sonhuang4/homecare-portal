import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useToast } from "../../Context/ToastContext";

export default function Register() {
    const { success, error, info, warning } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "client", // Default to client
        terms: false,
    });

    // Show validation errors as toasts
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            const firstError = errors[firstErrorKey];
            error(
                `${
                    firstErrorKey.charAt(0).toUpperCase() +
                    firstErrorKey.slice(1)
                }: ${firstError}`
            );
        }
    }, [errors]);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        if (!data.terms) {
            warning("Please accept the terms and conditions to continue.");
            return;
        }

        if (data.password !== data.password_confirmation) {
            error("Passwords do not match. Please check and try again.");
            return;
        }

        info("Creating your account...");

        post(route("register"), {
            onSuccess: () => {
                success(
                    "🎉 Welcome to Homecare by NWB! Your membership account has been created successfully."
                );
            },
            onError: () => {
                error(
                    "Registration failed. Please check your information and try again."
                );
            },
        });
    };

    const handleRoleChange = (newRole) => {
        setData("role", newRole);
        if (newRole === "admin") {
            info(
                "Admin accounts have full management capabilities for the homecare platform."
            );
        } else {
            info(
                "Client accounts provide access to your personal homecare portal and services."
            );
        }
    };

    return (
        <>
            <Head title="Join Homecare by NWB" />

            <div
                className="min-h-screen grid lg:grid-cols-2"
                style={{ backgroundColor: "#0a0a0a" }}
            >
                {/* Left Panel - Membership Benefits */}
                <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
                    {/* Subtle background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                        <div
                            className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full filter blur-2xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>

                    <div className="relative z-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-4">
                            <img
                                src="/images/logo.png"
                                alt="NWB Logo"
                                className="w-[10rem] h-[9rem]"
                            />
                            <div>
                                <div className="text-white text-2xl font-bold">
                                    Homecare
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: "#00b3ba" }}
                                >
                                    by NWB
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Start your membership and get access to
                                professional home maintenance, priority
                                scheduling, and exclusive member benefits.
                            </p>
                        </div>

                        {/* Membership tiers preview */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">
                                Membership Benefits
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                "rgba(0, 179, 186, 0.2)",
                                        }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="#00b3ba"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            Priority Scheduling
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            Get preferred appointment times and
                                            emergency response.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                "rgba(0, 179, 186, 0.2)",
                                        }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="#00b3ba"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            Credit Rollover System
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            Unused monthly credits accumulate
                                            for larger projects.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                "rgba(0, 179, 186, 0.2)",
                                        }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="#00b3ba"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            Quality Guarantee
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            Licensed professionals with
                                            satisfaction guarantee.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-center">
                        <p className="text-slate-500 text-sm">
                            Licensed & Insured • Serving LA since 2014 • 4.9/5
                            Customer Rating
                        </p>
                    </div>
                </div>

                {/* Right Panel - Registration Form */}
                <div className="flex flex-col justify-center px-8 lg:px-16 py-12">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="flex items-center space-x-4">
                            <img
                                src="/images/logo.png"
                                alt="NWB Logo"
                                className="w-[10rem] h-[9rem]"
                            />
                            <div>
                                <div className="text-white text-2xl font-bold">
                                    Homecare
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: "#00b3ba" }}
                                >
                                    by NWB
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center lg:text-left mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Start your membership
                            </h2>
                            <p className="text-slate-400">
                                Join Homecare by NWB and protect your home's
                                value
                            </p>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Full Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Full name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-slate-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                        style={{ "--tw-ring-color": "#00b3ba" }}
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-slate-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                        style={{ "--tw-ring-color": "#00b3ba" }}
                                        autoComplete="username"
                                        placeholder="Enter your email"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Account Type */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-3">
                                    Account type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoleChange("client")
                                        }
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            data.role === "client"
                                                ? "text-white"
                                                : "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                                        }`}
                                        style={
                                            data.role === "client"
                                                ? {
                                                      borderColor: "#00b3ba",
                                                      backgroundColor:
                                                          "rgba(0, 179, 186, 0.1)",
                                                  }
                                                : {}
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(0, 179, 186, 0.2)",
                                                }}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="#00b3ba"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    Homeowner
                                                </div>
                                                <div className="text-xs opacity-70">
                                                    Personal portal access
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoleChange("admin")
                                        }
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                            data.role === "admin"
                                                ? "text-white"
                                                : "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                                        }`}
                                        style={
                                            data.role === "admin"
                                                ? {
                                                      borderColor: "#00b3ba",
                                                      backgroundColor:
                                                          "rgba(0, 179, 186, 0.1)",
                                                  }
                                                : {}
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(0, 179, 186, 0.2)",
                                                }}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="#00b3ba"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    Admin
                                                </div>
                                                <div className="text-xs opacity-70">
                                                    Platform management
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-slate-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                            style={{
                                                "--tw-ring-color": "#00b3ba",
                                            }}
                                            autoComplete="new-password"
                                            placeholder="Create a secure password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Confirm password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-slate-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                            style={{
                                                "--tw-ring-color": "#00b3ba",
                                            }}
                                            autoComplete="new-password"
                                            placeholder="Confirm your password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div>
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        name="terms"
                                        type="checkbox"
                                        checked={data.terms}
                                        className="h-4 w-4 rounded border-white/20 mt-1"
                                        style={{ accentColor: "#00b3ba" }}
                                        onChange={(e) =>
                                            setData("terms", e.target.checked)
                                        }
                                    />
                                    <span className="text-sm text-slate-300 leading-relaxed">
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="font-medium hover:opacity-80 transition-opacity"
                                            style={{ color: "#00b3ba" }}
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="font-medium hover:opacity-80 transition-opacity"
                                            style={{ color: "#00b3ba" }}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                                {!data.terms && errors.terms && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        You must accept the terms and conditions
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating your account...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Start my membership
                                        <svg
                                            className="ml-2 h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400">
                                Already have an account?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium hover:opacity-80 transition-opacity"
                                    style={{ color: "#00b3ba" }}
                                >
                                    Sign in to your portal →
                                </Link>
                            </p>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="lg:hidden mt-8 flex justify-center space-x-6">
                            <Link
                                href="/"
                                className="text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
