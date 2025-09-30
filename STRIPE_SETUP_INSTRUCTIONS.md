# Stripe Setup Instructions

## 1. Environment Variables
Create a `.env` file in your project root with:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=3000
WORKBOOK_PRICE_ID=price_your_workbook_price_id_here
```

## 2. Stripe Dashboard Setup

### Create Product and Price:
1. Go to Stripe Dashboard → Products
2. Create new product: "Default Mode Workbook"
3. Set price to $97
4. Copy the Price ID (starts with `price_`)
5. Add to your `.env` file

### Get API Keys:
1. Go to Stripe Dashboard → Developers → API Keys
2. Copy your Publishable Key (starts with `pk_test_`)
3. Copy your Secret Key (starts with `sk_test_`)
4. Add to your `.env` file

### Set Up Webhook:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the Webhook Secret (starts with `whsec_`)
5. Add to your `.env` file

## 3. Update Purchase Page
In `workbook-purchase.html`, replace:
```javascript
const stripe = Stripe('pk_test_your_stripe_publishable_key_here');
```
With your actual publishable key.

## 4. Install Dependencies
```bash
npm install
```

## 5. Start Server
```bash
npm start
```

## 6. Test Flow
1. Go to `free-guide.html`
2. Click "BREAK THE PATTERN NOW"
3. Complete Stripe checkout
4. Verify access to workbook

## 7. Production Deployment
- Update environment variables with live Stripe keys
- Set up webhook endpoint on your domain
- Test with real payment methods
