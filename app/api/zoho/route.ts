// app/api/zoho/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const zohoFormUrl = 'https://forms.zohopublic.com/phucbmdevgm1/form/NewsletterSubscriptionForm/formperma/0qoSXP51UoEB7Fwotq6I42Ys7q96jtct1gIM8WouhYU/htmlRecords/submit';

        const zohoFormData = new URLSearchParams();
        zohoFormData.append('Email', body.email);
        zohoFormData.append('SingleLine', body.firstName);
        zohoFormData.append('SingleLine1', body.lastName);
        zohoFormData.append('DecisionBox', body.acceptTerms ? 'true' : 'false');

        console.log('Sending to Zoho:', Object.fromEntries(zohoFormData));

        const response = await fetch(zohoFormUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: zohoFormData.toString(),
        });

        const responseText = await response.text();
        console.log('Zoho Response Status:', response.status);
        console.log('Zoho Response:', responseText);

        if (response.ok) {
            return NextResponse.json({
                success: true,
                message: 'Successfully subscribed!'
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Submission failed',
                debug: responseText // This will help us see what went wrong
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error occurred',
            error: String(error)
        }, { status: 500 });
    }
}