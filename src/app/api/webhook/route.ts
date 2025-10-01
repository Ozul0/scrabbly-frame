import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle Farcaster webhook events
    console.log('Webhook received:', body);
    
    // You can add logic here to handle different webhook events
    // For now, just acknowledge receipt
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'ScraBBly webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
