<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Cashier\Exceptions\IncompletePayment;

class BillingController extends Controller
{
    public function subscribe(Request $request)
    {
        $user = $request->user();
        $paymentMethod = $request->input('payment_method');

        try {
            $user->newSubscription('default', 'price_XXXXXX') // Replace with your Stripe Price ID
                ->create($paymentMethod);

            return redirect('/dashboard')->with('success', 'Subscription successful!');
        } catch (IncompletePayment $exception) {
            return redirect()->route(
                'cashier.payment',
                [$exception->payment->id, 'redirect' => '/dashboard']
            );
        }
    }

    public function overview(Request $request)
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        $invoices = $user->invoices()->map(function ($invoice) {
            return [
                'id' => $invoice->id,
                'date' => $invoice->date()->toFormattedDateString(),
                'total' => $invoice->total(),
                'invoice_pdf' => $invoice->invoicePdf(),
            ];
        });

        return Inertia::render('Client/Billing/Overview', [
            'subscription' => $subscription,
            'invoices' => $invoices,
        ]);
    }
}
