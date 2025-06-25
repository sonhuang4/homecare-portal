import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verify Email - Homecare by NWB" />
            
            <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Left Panel - Welcome & Next Steps */}
                <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
                    {/* Subtle background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full filter blur-3xl" style={{ backgroundColor: "#00b3ba" }}></div>
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full filter blur-2xl" style={{ backgroundColor: "#00b3ba" }}></div>
                    </div>
                    
                    <div className="relative z-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-4">
                            <img src="/images/logo.png" alt="NWB Logo" className="w-[10rem] h-[9rem]" />
                            <div>
                                <div className="text-white text-2xl font-bold">Homecare</div>
                                <div className="text-sm font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                Welcome to<br />
                                Homecare by NWB!
                            </h1>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                You're almost ready to start protecting and maintaining your home. 
                                Just one quick step to verify your email address.
                            </p>
                        </div>

                        {/* What's Next */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">What happens after verification?</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <span className="text-sm font-bold" style={{ color: "#00b3ba" }}>1</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Portal Access</h4>
                                        <p className="text-slate-400 text-sm">Full access to your homecare dashboard and services.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <span className="text-sm font-bold" style={{ color: "#00b3ba" }}>2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Schedule Services</h4>
                                        <p className="text-slate-400 text-sm">Book your first maintenance appointment.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <span className="text-sm font-bold" style={{ color: "#00b3ba" }}>3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Start Protecting</h4>
                                        <p className="text-slate-400 text-sm">Begin your home maintenance journey with NWB.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Member Benefits */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                You're now a member!
                            </h4>
                            <p className="text-slate-300 text-sm">
                                Welcome to the growing community of LA homeowners who trust NWB 
                                for professional home maintenance and peace of mind.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-center">
                        <p className="text-slate-500 text-sm">
                            Questions? Our support team is here to help • support@nwb.com
                        </p>
                    </div>
                </div>

                {/* Right Panel - Verification */}
                <div className="flex flex-col justify-center px-8 lg:px-16 py-12">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center space-x-3">
                            <img src="/images/logo.png" alt="NWB Logo" className="w-[10rem] h-[9rem]" />
                            <div>
                                <div className="text-white text-xl font-bold">Homecare</div>
                                <div className="text-xs font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center lg:text-left mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                <svg className="w-8 h-8" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
                            <p className="text-slate-400">
                                We've sent a verification link to your email address. Click the link to activate your account.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status === 'verification-link-sent' && (
                            <div className="mb-6 p-4 rounded-xl border border-green-500/20 bg-green-500/10">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <p className="text-green-400 text-sm font-medium">
                                        New verification email sent! Check your inbox and spam folder.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Verification Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl mb-6">
                            <div className="text-center space-y-6">
                                {/* Email Icon */}
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                                    <svg className="w-10 h-10" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-white text-xl font-semibold mb-2">Email sent!</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Click the verification link in your email to complete your registration 
                                        and start using your homecare portal.
                                    </p>
                                </div>

                                {/* Resend Form */}
                                <form onSubmit={submit}>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
                                        style={{ backgroundColor: "#00b3ba" }}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                Resend verification email
                                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                            <h4 className="text-white font-medium mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Didn't receive the email?
                            </h4>
                            <ul className="text-slate-400 text-sm space-y-1">
                                <li>• Check your spam/junk folder</li>
                                <li>• Make sure you entered the correct email</li>
                                <li>• Use the resend button above</li>
                                <li>• Contact support if you still need help</li>
                            </ul>
                        </div>

                        {/* Logout Option */}
                        <div className="text-center">
                            <p className="text-slate-400 text-sm mb-2">
                                Need to use a different email address?
                            </p>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm font-medium hover:opacity-80 transition-opacity"
                                style={{ color: "#00b3ba" }}
                            >
                                Sign out and register again →
                            </Link>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="lg:hidden mt-8 flex justify-center space-x-6">
                            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                                Home
                            </Link>
                            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}