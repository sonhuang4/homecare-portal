import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ClientLayout from '../../../Layouts/ClientLayout';
import { useToast } from '../../../Context/ToastContext';

export default function WhatsAppChat({ auth, supportTeams, businessPhone }) {
    const { success, error, info, warning } = useToast();
    const [selectedTeam, setSelectedTeam] = useState('general');
    const [showTeamSelector, setShowTeamSelector] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        team: 'general',
        message: ''
    });

    // NWB Homecare Support Teams
    const teamInfo = {
        general: {
            name: 'General Support',
            icon: '🏡',
            description: 'Property service questions and general support',
            color: 'blue',
            examples: ['Service scheduling', 'Account questions', 'Property inquiries', 'Subscription plans']
        },
        emergency: {
            name: 'Emergency Dispatch',
            icon: '🚨',
            description: '24/7 urgent property emergency response',
            color: 'red',
            examples: ['Water leaks', 'Electrical failures', 'Security breaches', 'HVAC failures']
        },
        technical: {
            name: 'Technical Support',
            icon: '🔧',
            description: 'Property maintenance and repair services',
            color: 'orange',
            examples: ['HVAC service', 'Plumbing repairs', 'Electrical work', 'Home improvements']
        },
        billing: {
            name: 'Billing Support',
            icon: '💳',
            description: 'Subscription billing and payment questions',
            color: 'green',
            examples: ['Payment questions', 'Subscription changes', 'Credit usage', 'Invoice inquiries']
        },
        sales: {
            name: 'Sales & Estimates',
            icon: '📋',
            description: 'New services and project estimates',
            color: 'purple',
            examples: ['Service estimates', 'New projects', 'Property assessments', 'Consultation requests']
        }
    };

    // NWB Homecare Quick Messages
    const quickMessages = [
        "Hi, I need to schedule a property maintenance visit",
        "I have an emergency property issue that needs immediate attention",
        "I'd like to get an estimate for a home improvement project",
        "I need to reschedule my upcoming service appointment",
        "I have a question about my subscription billing",
        "My HVAC system isn't working properly",
        "I need help with a plumbing issue",
        "I want to add additional services to my subscription"
    ];

    const handleStartChat = async (e) => {
        e.preventDefault();
        
        if (!data.message.trim()) {
            warning('Please enter a message to start the chat with our NWB team');
            return;
        }

        try {
            // Use fetch since the backend is returning JSON, not Inertia response
            const response = await fetch('/whatsapp/start-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    team: data.team,
                    message: data.message
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('WhatsApp response:', result);

            if (result.success && result.chat_url) {
                // Open WhatsApp in new tab
                window.open(result.chat_url, '_blank');
                success('🏡 Opening WhatsApp chat with NWB support team...');
                reset();
                setShowTeamSelector(true);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Chat error:', err);
            warning('Backend connection failed. Using direct WhatsApp link...');
            // Fallback: Generate WhatsApp URL directly
            handleDirectWhatsApp();
        }
    };

    // Fallback function to generate WhatsApp URL directly
    const handleDirectWhatsApp = () => {
        // Default NWB support numbers for each team
        const supportNumbers = {
            general: '+13235554663',
            emergency: '+13235554663',
            technical: '+13235554664',
            billing: '+13235554665',
            sales: '+13235554666'
        };

        const phone = supportNumbers[data.team] || '+13235554663';
        const userName = auth.user.name;
        const userMessage = `Hi, I'm ${userName} (Client ID: ${auth.user.id}). ${data.message}`;
        
        // Generate WhatsApp URL
        const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(userMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        success('🏡 Opening WhatsApp chat with NWB support team...');
        reset();
        setShowTeamSelector(true);
    };

    const handleQuickMessage = (message) => {
        setData('message', message);
        setShowTeamSelector(false);
    };

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        setData('team', team);
        setShowTeamSelector(false);
    };

    const getTeamColor = (team) => {
        const colors = {
            blue: 'from-blue-600 to-blue-700 border-blue-500',
            red: 'from-red-600 to-red-700 border-red-500',
            green: 'from-green-600 to-green-700 border-green-500',
            orange: 'from-orange-600 to-orange-700 border-orange-500',
            purple: 'from-purple-600 to-purple-700 border-purple-500'
        };
        return colors[teamInfo[team]?.color] || colors.blue;
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <ClientLayout title="WhatsApp Support - NWB Homecare" auth={auth}>
            <div className="max-w-6xl mx-auto space-y-8" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Enhanced Header with NWB Branding */}
                <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(0, 179, 186, 0.1) 0%, rgba(0, 179, 186, 0.05) 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div 
                            className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl"
                            style={{ backgroundColor: "#00b3ba" }}
                        ></div>
                    </div>
                    <div className="relative p-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <span className="text-5xl">💬</span>
                            WhatsApp Support
                        </h2>
                        <p className="text-xl text-slate-300 mb-2">
                            Connect with our NWB homecare team via WhatsApp for instant assistance
                        </p>
                        <p className="text-sm font-medium mb-2" style={{ color: "#00b3ba" }}>
                            New Ways To Build (NWB) • 24/7 Support • Licensed Contractors
                        </p>
                        <p className="text-sm text-slate-400">
                            Professional property maintenance support at your fingertips
                        </p>
                    </div>
                </div>

                {/* Emergency Alert */}
                <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-center space-x-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-1">Property Emergency?</h3>
                            <p className="text-slate-300 text-sm mb-2">
                                For immediate property emergencies (water leaks, electrical failures, gas leaks, security breaches):
                            </p>
                            <a 
                                href="tel:+13235554663" 
                                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 text-sm mr-3"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                📞 818---397--8536 - Emergency Hotline
                            </a>
                            <button
                                onClick={() => handleTeamSelect('emergency')}
                                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 text-sm bg-red-600"
                            >
                                💬 Emergency WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Chat Interface */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Team Selection & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* NWB Support Teams */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2">🏡</span>
                                NWB Support Teams
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(teamInfo).map(([key, team]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleTeamSelect(key)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                            selectedTeam === key
                                                ? `text-white`
                                                : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                        style={selectedTeam === key ? { 
                                            borderColor: "#00b3ba", 
                                            backgroundColor: "rgba(0, 179, 186, 0.1)" 
                                        } : {}}
                                    >
                                        <div className="flex items-center mb-2">
                                            <span className="text-2xl mr-3">{team.icon}</span>
                                            <span className="font-semibold">{team.name}</span>
                                        </div>
                                        <p className="text-sm opacity-80 mb-2">{team.description}</p>
                                        {supportTeams && supportTeams[key] && (
                                            <p className="text-xs opacity-70">
                                                Hours: {supportTeams[key].hours}
                                            </p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Team Info */}
                        {selectedTeam && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <span className="text-xl mr-2">{teamInfo[selectedTeam].icon}</span>
                                    {teamInfo[selectedTeam].name}
                                </h4>
                                <p className="text-gray-300 text-sm mb-3">
                                    {teamInfo[selectedTeam].description}
                                </p>
                                <div>
                                    <p className="text-gray-400 text-xs mb-2">Common service topics:</p>
                                    <ul className="text-gray-300 text-xs space-y-1">
                                        {teamInfo[selectedTeam].examples.map((example, index) => (
                                            <li key={index}>• {example}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* NWB Service Hours */}
                        <div className="border border-blue-500/20 rounded-2xl p-6" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                            <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                                <span className="text-lg mr-2">🕐</span>
                                NWB Service Hours
                            </h4>
                            <div className="text-blue-200 text-sm space-y-1">
                                <p><strong>General Support:</strong> 8:00 AM - 6:00 PM PST</p>
                                <p><strong>Emergency Dispatch:</strong> 24/7 Available</p>
                                <p><strong>Technical Support:</strong> 7:00 AM - 8:00 PM PST</p>
                                <p><strong>Billing Support:</strong> 9:00 AM - 5:00 PM PST</p>
                                <p><strong>Sales & Estimates:</strong> 8:00 AM - 6:00 PM PST</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-blue-500/20">
                                <p className="text-blue-200 text-xs">
                                    <strong>Note:</strong> Emergency services available 24/7 for property emergencies
                                </p>
                            </div>
                        </div>

                        {/* Service Coverage */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                                <span className="text-lg mr-2">📍</span>
                                Service Area
                            </h4>
                            <div className="text-gray-300 text-sm space-y-2">
                                <p>🏡 <strong>Primary:</strong> Los Angeles County</p>
                                <p>🚗 <strong>Service Radius:</strong> 25 miles from downtown LA</p>
                                <p>⚡ <strong>Emergency:</strong> Extended coverage for emergencies</p>
                                <p>📞 <strong>Contact:</strong> (323) 555-HOME</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Chat Interface */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* WhatsApp Chat Window Mockup */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                            {/* Chat Header */}
                            <div className="p-4 flex items-center justify-between" style={{ backgroundColor: "#00b3ba" }}>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                                        <span className="text-2xl">🏡</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">NWB Homecare</h4>
                                        <p className="text-blue-100 text-sm">
                                            {teamInfo[selectedTeam]?.name} • Online • Licensed Contractors
                                        </p>
                                    </div>
                                </div>
                                <div className="text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.687"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="p-6 space-y-4 h-80 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
                                {/* System Message */}
                                <div className="text-center">
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                                        🔒 Messages are end-to-end encrypted
                                    </span>
                                </div>

                                {/* Welcome Message */}
                                <div className="flex items-start">
                                    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
                                        <p className="text-gray-800 text-sm mb-2">
                                            Hello {auth.user.name}! 🏡 Welcome to NWB Homecare support. 
                                        </p>
                                        <p className="text-gray-800 text-sm">
                                            I'm here to help with your property maintenance needs. How can I assist you today?
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2 block">
                                            {getCurrentTime()} • NWB Support
                                        </span>
                                    </div>
                                </div>

                                {/* Service Info Message */}
                                <div className="flex items-start">
                                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg shadow-sm max-w-sm">
                                        <p className="text-blue-800 text-sm">
                                            <strong>Service Areas:</strong> Los Angeles County<br/>
                                            <strong>Emergency Line:</strong> (323) 555-HOME<br/>
                                            <strong>Licensed & Insured:</strong> CA Contractor's License
                                        </p>
                                        <span className="text-xs text-blue-600 mt-1 block">
                                            {getCurrentTime()}
                                        </span>
                                    </div>
                                </div>

                                {/* Preview Message */}
                                {data.message && (
                                    <div className="flex items-end justify-end">
                                        <div className="p-3 rounded-lg shadow-sm max-w-sm" style={{ backgroundColor: "#00b3ba", color: "white" }}>
                                            <p className="text-sm">{data.message}</p>
                                            <span className="text-xs opacity-75 mt-1 block">
                                                {getCurrentTime()} ✓✓
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Auto-Response Preview */}
                                {data.message && (
                                    <div className="flex items-start">
                                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-sm">
                                            <p className="text-gray-800 text-sm">
                                                Thank you for contacting NWB! I've received your message and will connect you with our {teamInfo[selectedTeam]?.name} team right away. 🔧
                                            </p>
                                            <span className="text-xs text-gray-500 mt-1 block">
                                                {getCurrentTime()} • Auto-Response
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Messages for Homecare */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2">⚡</span>
                                Quick Service Messages
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {quickMessages.map((message, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickMessage(message)}
                                        className="text-left p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all text-gray-300 hover:text-white"
                                    >
                                        <span className="text-sm">"{message}"</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message Composer */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <form onSubmit={handleStartChat} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Your Property Service Message
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-[#232424] border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                        style={{ '--tw-ring-color': '#00b3ba' }}
                                        placeholder="Describe your property maintenance need, emergency, or question. Include property address if relevant..."
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Include: Property address, issue description, urgency level, preferred contact method
                                    </p>
                                    {errors.message && (
                                        <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <span className="mr-2">📱</span>
                                        <span>Will open WhatsApp with NWB {teamInfo[selectedTeam]?.name}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleDirectWhatsApp}
                                            className="text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 text-sm border border-gray-500"
                                            style={{ backgroundColor: "#6b7280" }}
                                        >
                                            Direct WhatsApp
                                        </button>
                                        
                                        <button
                                            type="submit"
                                            disabled={processing || !data.message.trim()}
                                            className="text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg flex items-center gap-2"
                                            style={{ 
                                                background: !processing && data.message.trim() 
                                                    ? "linear-gradient(135deg, #00b3ba 0%, #008a94 100%)" 
                                                    : "#6b7280"
                                            }}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Connecting to NWB...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.687"/>
                                                    </svg>
                                                    Start NWB WhatsApp Chat
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* NWB Service Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-blue-500/20 rounded-xl p-4" style={{ backgroundColor: "rgba(0, 179, 186, 0.1)" }}>
                                <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">🔒</span>
                                    Secure & Professional
                                </h4>
                                <p className="text-blue-200 text-sm">
                                    Licensed contractors with end-to-end encrypted communication
                                </p>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">⚡</span>
                                    24/7 Emergency Response
                                </h4>
                                <p className="text-green-200 text-sm">
                                    Immediate response for property emergencies and urgent repairs
                                </p>
                            </div>

                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">🏡</span>
                                    Smart Service Routing
                                </h4>
                                <p className="text-purple-200 text-sm">
                                    Messages routed to the right specialist for your property needs
                                </p>
                            </div>

                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                                <h4 className="text-orange-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">📱</span>
                                    Mobile Service Coordination
                                </h4>
                                <p className="text-orange-200 text-sm">
                                    Real-time updates and technician tracking via WhatsApp
                                </p>
                            </div>
                        </div>

                        {/* Getting Started Guide */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                                <span className="mr-2">📋</span>
                                How to Get NWB Homecare Support
                            </h4>
                            <div className="text-gray-300 text-sm space-y-2">
                                <p><strong>1. Choose Support Team:</strong> Select the appropriate NWB team above</p>
                                <p><strong>2. Describe Your Need:</strong> Include property address, issue details, and urgency</p>
                                <p><strong>3. Start WhatsApp Chat:</strong> Click to open WhatsApp with your message pre-filled</p>
                                <p><strong>4. Get Expert Help:</strong> Our licensed technicians will assist you promptly</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-500/20">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-2">
                                            <strong>Don't have WhatsApp?</strong>
                                        </p>
                                        <a href="https://www.whatsapp.com/download" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline text-xs">
                                            Download WhatsApp →
                                        </a>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-2">
                                            <strong>Prefer to call?</strong>
                                        </p>
                                        <a href="tel:+13235554663" className="text-blue-400 hover:text-blue-300 underline text-xs">
                                            (323) 555-HOME
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}