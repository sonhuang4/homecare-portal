import React from 'react';
import ClientLayout from '../../../Layouts/ClientLayout';

export default function BillingOverview({ auth, subscription, invoices }) {
    return (
        <ClientLayout title="My Billing" auth={auth}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <h2 className="text-white text-2xl font-bold mb-4">💼 Subscription Status</h2>
                    {subscription ? (
                        <>
                            <p className="text-white mb-2">
                                <strong>Status:</strong> {subscription.stripe_status}
                            </p>
                            <p className="text-white">
                                <strong>Plan:</strong> {subscription.price_id}
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-300">You are not subscribed.</p>
                    )}
                </div>

                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <h2 className="text-white text-2xl font-bold mb-4">📄 Billing History</h2>
                    <table className="w-full">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="text-left text-sm text-gray-300 px-4 py-2">Date</th>
                                <th className="text-left text-sm text-gray-300 px-4 py-2">Amount</th>
                                <th className="text-left text-sm text-gray-300 px-4 py-2">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-white/5">
                                    <td className="text-white px-4 py-2">{invoice.date}</td>
                                    <td className="text-white px-4 py-2">${invoice.total / 100}</td>
                                    <td className="px-4 py-2">
                                        <a
                                            href={invoice.invoice_pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline text-sm"
                                        >
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ClientLayout>
    );
}
