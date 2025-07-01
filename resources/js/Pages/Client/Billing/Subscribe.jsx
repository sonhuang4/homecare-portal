import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import ClientLayout from '../../../Layouts/ClientLayout';
import { router } from '@inertiajs/react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function SubscriptionForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        });

        if (error) {
            alert(error.message);
            setProcessing(false);
            return;
        }

        router.post('/billing/subscribe', {
            payment_method: paymentMethod.id
        }, {
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-6 rounded-xl border border-white/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white">💳 Subscribe to NWB Membership</h2>
            <div className="bg-white p-4 rounded-md">
                <CardElement options={{ hidePostalCode: true }} />
            </div>
            <button
                type="submit"
                disabled={!stripe || processing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
                {processing ? 'Processing…' : 'Subscribe Now'}
            </button>
        </form>
    );
}

export default function Subscribe({ auth }) {
    return (
        <ClientLayout title="Subscribe Now" auth={auth}>
            <Elements stripe={stripePromise}>
                <SubscriptionForm />
            </Elements>
        </ClientLayout>
    );
}