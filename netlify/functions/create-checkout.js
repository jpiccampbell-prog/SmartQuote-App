const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userId, userEmail, userName } = JSON.parse(event.body);

    if (!userId || !userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId or email' })
      };
    }

    const siteUrl = process.env.URL || 'https://smartquoteapp.netlify.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${siteUrl}/?upgrade=success`,
      cancel_url: `${siteUrl}/?upgrade=cancelled`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        firebaseUserId: userId,
        userEmail: userEmail
      },
      allow_promotion_codes: true
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: error.message
      })
    };
  }
};
