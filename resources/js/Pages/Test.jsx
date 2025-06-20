import React from 'react';
import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <>
            <Head title="Test" />
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                <h1 className="text-4xl text-white font-bold">
                    🎉 React is Working!
                </h1>
            </div>
        </>
    );
}
