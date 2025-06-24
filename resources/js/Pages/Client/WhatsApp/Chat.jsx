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

    const teamInfo = {
        general: {
            name: 'General Support',
            icon: '💬',
            description: 'General questions and support',
            color: 'blue',
            examples: ['Account questions', 'Service information', 'General inquiries']
        },
        medical: {
            name: 'Medical Support',
            icon: '🏥',
            description: 'Medical questions and health concerns',
            color: 'red',
            examples: ['Health concerns', 'Medication questions', 'Medical emergencies']
        },
        billing: {
            name: 'Billing Support',
            icon: '💳',
            description: 'Billing and payment questions',
            color: 'green',
            examples: ['Payment questions', 'Insurance issues', 'Invoice inquiries']
        },
        emergency: {
            name: 'Emergency Support',
            icon: '🚨',
            description: '24/7 urgent medical assistance',
            color: 'red',
            examples: ['Medical emergencies', 'Urgent health issues', 'Crisis situations']
        }
    };

    const quickMessages = [
        "Hi, I need help with my appointment",
        "I have a question about my billing",
        "I need medical assistance",
        "I want to reschedule my appointment",
        "I have a general question about services"
    ];

    const handleStartChat = async (e) => {
        e.preventDefault();
        
        if (!data.message.trim()) {
            warning('Please enter a message to start the chat');
            return;
        }

        try {
            const response = await fetch('/whatsapp/start-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    team: data.team,
                    message: data.message
                })
            });

            const result = await response.json();

            if (result.success) {
                // Open WhatsApp in new tab
                window.open(result.chat_url, '_blank');
                success('Opening WhatsApp chat...');
                reset();
                setShowTeamSelector(true);
            } else {
                error('Failed to start chat. Please try again.');
            }
        } catch (err) {
            error('Failed to start chat. Please try again.');
            console.error('Chat error:', err);
        }
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
            green: 'from-green-600 to-green-700 border-green-500'
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
        <ClientLayout title="WhatsApp Support" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <span className="text-4xl">💬</span>
                        WhatsApp Support
                    </h2>
                    <p className="text-gray-300">
                        Connect with our support team via WhatsApp for instant assistance
                    </p>
                </div>

                {/* Main Chat Interface */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Team Selection & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Support Teams */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Support Teams</h3>
                            <div className="space-y-3">
                                {Object.entries(teamInfo).map(([key, team]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleTeamSelect(key)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                            selectedTeam === key
                                                ? `bg-gradient-to-r ${getTeamColor(key)} text-white`
                                                : 'border-white/30 bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center mb-2">
                                            <span className="text-2xl mr-3">{team.icon}</span>
                                            <span className="font-semibold">{team.name}</span>
                                        </div>
                                        <p className="text-sm opacity-80 mb-2">{team.description}</p>
                                        {supportTeams[key] && (
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
                                    <p className="text-gray-400 text-xs mb-2">Common topics:</p>
                                    <ul className="text-gray-300 text-xs space-y-1">
                                        {teamInfo[selectedTeam].examples.map((example, index) => (
                                            <li key={index}>• {example}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Business Hours */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                            <h4 className="text-blue-300 font-semibold mb-3 flex items-center">
                                <span className="text-lg mr-2">🕐</span>
                                Business Hours
                            </h4>
                            <div className="text-blue-200 text-sm space-y-1">
                                <p>General Support: 8:00 AM - 6:00 PM EST</p>
                                <p>Medical Support: 24/7</p>
                                <p>Billing Support: 9:00 AM - 5:00 PM EST</p>
                                <p>Emergency Support: 24/7</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Chat Interface */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Chat Window Mockup */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                            {/* Chat Header */}
                            <div className="bg-green-600 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-600 font-bold">HC</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Homecare by NWB</h4>
                                        <p className="text-green-100 text-sm">
                                            {teamInfo[selectedTeam]?.name} • Online
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
                            <div className="p-6 space-y-4 h-64 overflow-y-auto bg-gray-50">
                                {/* System Message */}
                                <div className="text-center">
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                                        Messages are end-to-end encrypted
                                    </span>
                                </div>

                                {/* Welcome Message */}
                                <div className="flex items-start">
                                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                                        <p className="text-gray-800 text-sm">
                                            Hello {auth.user.name}! 👋 Welcome to Homecare by NWB support. 
                                            How can we help you today?
                                        </p>
                                        <span className="text-xs text-gray-500 mt-1 block">
                                            {getCurrentTime()}
                                        </span>
                                    </div>
                                </div>

                                {/* Preview Message */}
                                {data.message && (
                                    <div className="flex items-end justify-end">
                                        <div className="bg-green-500 text-white p-3 rounded-lg shadow-sm max-w-xs">
                                            <p className="text-sm">{data.message}</p>
                                            <span className="text-xs opacity-75 mt-1 block">
                                                {getCurrentTime()} ✓✓
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Messages */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Messages</h3>
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
                                        Your Message
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                        placeholder="Type your message here..."
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <span className="mr-2">📱</span>
                                        <span>Will open in WhatsApp</span>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing || !data.message.trim()}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Starting Chat...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.687"/>
                                                </svg>
                                                Start WhatsApp Chat
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">🔒</span>
                                    Secure & Private
                                </h4>
                                <p className="text-blue-200 text-sm">
                                    All messages are end-to-end encrypted and HIPAA compliant
                                </p>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                <h4 className="text-green-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">⚡</span>
                                    Instant Response
                                </h4>
                                <p className="text-green-200 text-sm">
                                    Get immediate responses from our trained support team
                                </p>
                            </div>

                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">🤖</span>
                                    Smart Routing
                                </h4>
                                <p className="text-purple-200 text-sm">
                                    Messages are automatically routed to the right specialist
                                </p>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                <h4 className="text-yellow-300 font-semibold mb-2 flex items-center">
                                    <span className="mr-2">📱</span>
                                    Mobile Friendly
                                </h4>
                                <p className="text-yellow-200 text-sm">
                                    Chat seamlessly on any device with WhatsApp installed
                                </p>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-6">
                            <h4 className="text-gray-300 font-semibold mb-3 flex items-center">
                                <span className="mr-2">❓</span>
                                Need Help Getting Started?
                            </h4>
                            <div className="text-gray-400 text-sm space-y-2">
                                <p>1. Select the appropriate support team above</p>
                                <p>2. Type your message or use a quick message</p>
                                <p>3. Click "Start WhatsApp Chat" to open the conversation</p>
                                <p>4. WhatsApp will open with your message pre-filled</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-500/20">
                                <p className="text-gray-400 text-xs">
                                    Don't have WhatsApp? <a href="https://www.whatsapp.com/download" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">Download it here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}