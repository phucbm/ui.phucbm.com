'use client';

import {useRef, useState, useEffect} from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('test@example.com');
    const [name, setName] = useState('John Doe');
    const [company, setCompany] = useState('Test Company');
    const [agree, setAgree] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Load the actual Zoho form in the iframe (hidden)
    const zohoFormUrl = 'https://forms.zohopublic.com/phucbmdevgm1/form/NewsletterSubscriptionForm/formperma/0qoSXP51UoEB7Fwotq6I42Ys7q96jtct1gIM8WouhYU';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Submitting...');

        try {
            const iframe = iframeRef.current;
            if (!iframe || !iframe.contentWindow) {
                throw new Error('Iframe not ready');
            }

            // Access the form inside the iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const zohoForm = iframeDoc.querySelector('form');

            if (!zohoForm) {
                throw new Error('Could not find form in iframe');
            }

            // Fill the form fields in the iframe
            const emailField = iframeDoc.querySelector('input[name="Email"]') as HTMLInputElement;
            const nameField = iframeDoc.querySelector('input[name="SingleLine"]') as HTMLInputElement;
            const companyField = iframeDoc.querySelector('input[name="SingleLine1"]') as HTMLInputElement;
            const agreeField = iframeDoc.querySelector('input[name="DecisionBox"]') as HTMLInputElement;

            if (emailField) emailField.value = email;
            if (nameField) nameField.value = name;
            if (companyField) companyField.value = company;
            if (agreeField) {
                if (agreeField.type === 'checkbox') {
                    agreeField.checked = agree;
                } else {
                    agreeField.value = agree ? 'true' : 'false';
                }
            }

            console.log('Submitting form inside iframe...');

            // Submit the actual Zoho form
            zohoForm.submit();

            setTimeout(() => {
                setMessage('✅ Form submitted! Check Zoho dashboard.');
                setLoading(false);
            }, 2000);

        } catch (error) {
            console.error('Submission error:', error);
            setMessage('❌ Error: ' + (error as Error).message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Newsletter Subscription (TEST)</h2>

            <div className="bg-yellow-100 border border-yellow-400 p-3 rounded mb-4 text-sm">
                ⚠️ Form is prefilled for testing. Click Subscribe.
            </div>

            {/* Load the actual Zoho form (hidden) */}
            <iframe
                ref={iframeRef}
                name="zoho-iframe"
                src={zohoFormUrl}
                onLoad={() => {
                    console.log('Zoho form loaded in iframe');
                    setIframeLoaded(true);
                }}
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px'
                }}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Company</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        id="terms"
                        required
                    />
                    <label htmlFor="terms">I accept the terms *</label>
                </div>

                <button
                    type="submit"
                    disabled={loading || !iframeLoaded}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Submitting...' : iframeLoaded ? 'Subscribe' : 'Loading...'}
                </button>

                {message && (
                    <p className={`text-center font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}