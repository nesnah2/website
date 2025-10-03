const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.'));

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, productName } = req.body;
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Your Stripe price ID for the workbook
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/workbook-access.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/workbook-buy.html`,
            metadata: {
                product: 'workbook',
                productName: productName
            }
        });
        
        res.json({ id: session.id });
        
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify purchase for workbook access
app.post('/verify-purchase', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Search for customer by email in Stripe
        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        });
        
        if (customers.data.length === 0) {
            return res.status(404).json({ error: 'Email not found' });
        }
        
        const customer = customers.data[0];
        
        // Check if customer has any successful payments for the workbook
        const payments = await stripe.paymentIntents.list({
            customer: customer.id,
            limit: 10
        });
        
        const hasSuccessfulPayment = payments.data.some(payment => 
            payment.status === 'succeeded' && 
            payment.metadata && 
            payment.metadata.product === 'workbook'
        );
        
        if (hasSuccessfulPayment) {
            res.json({ 
                success: true, 
                customerId: customer.id,
                email: email 
            });
        } else {
            res.status(404).json({ error: 'No valid purchase found' });
        }
        
    } catch (error) {
        console.error('Error verifying purchase:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle Stripe webhooks
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed:', session.id);
            // You can send confirmation emails here
            break;
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({received: true});
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
