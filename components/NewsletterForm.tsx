'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/zoho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    acceptTerms,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('✅ Successfully subscribed!');
                // Reset form
                setEmail('');
                setFirstName('');
                setLastName('');
                setAcceptTerms(false);
            } else {
                setMessage('❌ Submission failed. Please try again.');
            }
        } catch (error) {
            setMessage('❌ An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-bold">Newsletter Subscription</h2>

            <div>
                <label className="block mb-1 font-medium">Email *</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="your@email.com"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="John"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Doe"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    id="terms"
                    required
                />
                <label htmlFor="terms">I accept the terms and conditions *</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Submitting...' : 'Subscribe'}
            </button>

            {message && (
                <p className={`text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}