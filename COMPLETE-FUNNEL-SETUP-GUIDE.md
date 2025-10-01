# COMPLETE FUNNEL SETUP GUIDE
## Landing Page → Email → Free Guide → Purchase → Paid Workbook

---

## **PART 1: MailerLite Setup (15 minutes)**

### Step 1: Create Account
1. Go to **https://mailerlite.com**
2. Click "Sign Up Free"
3. Enter your email and create password
4. Verify your email address

### Step 2: Get API Key
1. Log into MailerLite
2. Click your profile icon (top right)
3. Go to **"Integrations" → "Use MailerLite API"**
4. Click **"Generate new token"**
5. Name it: "Website Integration"
6. **COPY THIS KEY** - you'll need it (looks like: `mlk_abc123xyz...`)

### Step 3: Create Subscriber Group
1. Go to **"Subscribers" → "Groups"**
2. Click **"Create Group"**
3. Name: **"Free Guide Subscribers"**
4. Click **"Save"**
5. Note the Group ID (in the URL, looks like a number)

### Step 4: Create Welcome Email
1. Go to **"Campaigns" → "Email campaigns"**
2. Click **"Create campaign"**
3. Choose **"Regular campaign"**
4. Name: "Free Guide Delivery"
5. From: Your name and email
6. Subject: **"Your Free Default Mode Guide is Ready"**
7. Click **"Design email"**
8. Choose **"Rich text"** template
9. Paste this content:

```
You did it. You took the first step.

Here's your free guide to breaking free from your default mode:

👉 ACCESS YOUR FREE GUIDE: https://mikkelhansen.org/free-guide.html

This guide covers Phases 1-2:
✓ Awareness: Recognizing your default mode
✓ Observation: Watching it in action

Complete it honestly. The transformation starts with seeing yourself clearly.

When you're ready for the complete 8-phase workbook that takes you from awareness to actual transformation, visit:
https://mikkelhansen.org/workbook-purchase.html

- Mikkel Hansen
Mentor for Men Breaking Free from Default Mode

P.S. Reply to this email if you have questions. I read every message.
```

10. Click **"Continue"**
11. Click **"Save as draft"** (we'll use this in automation)

### Step 5: Create Automation
1. Go to **"Automations" → "Create workflow"**
2. Click **"Start from scratch"**
3. Name: "Free Guide Auto-Send"
4. **Trigger**: "Subscriber joins a group"
   - Select **"Free Guide Subscribers"**
5. Click **"+"** to add action
6. Choose **"Send email"**
   - Select the **"Free Guide Delivery"** campaign you created
7. Click **"Done"**
8. Toggle the switch to **"Enable"** the automation
9. Click **"Save"**

✅ **MailerLite is now ready!**

---

## **PART 2: Update Landing Page (5 minutes)**

### I'll update your landing page code with MailerLite integration

You need to replace TWO things in the code I'll give you:
- `YOUR_MAILERLITE_API_KEY` - the API key from Step 2
- `YOUR_GROUP_ID` - the Group ID from Step 3

---

## **PART 3: Stripe Payment Setup (20 minutes)**

### Step 1: Create Stripe Account
1. Go to **https://stripe.com**
2. Click **"Start now"** and sign up
3. Complete business information
4. Verify your email

### Step 2: Create Product
1. Go to **"Products"** in Stripe dashboard
2. Click **"Add product"**
3. **Name**: "Default Mode Workbook - Complete 8-Phase Transformation"
4. **Description**: "Complete workbook with 8 phases of transformation for men breaking free from default mode"
5. **Pricing**: One-time payment
6. **Price**: $67 USD
7. Click **"Save product"**
8. **COPY the Price ID** (starts with `price_...`)

### Step 3: Get API Keys
1. Go to **"Developers" → "API keys"**
2. **COPY "Publishable key"** (starts with `pk_test_...`)
3. **COPY "Secret key"** (starts with `sk_test_...`)
4. ⚠️ **IMPORTANT**: Keep secret key private!

### Step 4: Configure Webhooks (for later)
1. Go to **"Developers" → "Webhooks"**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://mikkelhansen.org/.netlify/functions/stripe-webhook`
4. Events to send: Select **"checkout.session.completed"**
5. Click **"Add endpoint"**
6. **COPY the Signing secret** (starts with `whsec_...`)

✅ **Stripe is configured!**

---

## **PART 4: Backend Setup (Netlify Functions)**

### Step 1: Create Netlify Function for Stripe Checkout

Create file: `netlify/functions/create-checkout-session.js`

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Your product price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/workbook-login.html?purchase=success`,
      cancel_url: `${process.env.URL}/workbook-purchase.html?purchase=cancelled`,
      customer_email: event.body ? JSON.parse(event.body).email : undefined,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

### Step 2: Add Environment Variables to Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **"Site settings" → "Environment variables"**
4. Add these variables:
   - `STRIPE_SECRET_KEY` = your secret key from Stripe
   - `STRIPE_PRICE_ID` = your price ID from Stripe
   - `MAILERLITE_API_KEY` = your API key from MailerLite
   - `MAILERLITE_GROUP_ID` = your group ID from MailerLite

### Step 3: Add `netlify.toml` Configuration

Create file in root: `netlify.toml`

```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

---

## **PART 5: Test Everything**

### Test 1: Email Signup
1. Go to your landing page
2. Enter a test email
3. Check if you receive the email with free guide link
4. Click the link - should go to free-guide.html

### Test 2: Payment Flow
1. Go to workbook-purchase.html
2. Click "Get Complete Workbook"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Should redirect to login page
6. Create account
7. Should access paid workbook

### Test 3: Workbook Access
1. Complete some exercises
2. Wait 10 seconds - should see "Auto-saved"
3. Refresh page - data should persist
4. Test on mobile

---

## **THE COMPLETE FUNNEL FLOW:**

1. **User visits landing page** → Sees value of free guide
2. **Enters email** → MailerLite API adds to group
3. **MailerLite automation triggers** → Sends email with free guide link
4. **User clicks link in email** → Opens free-guide.html
5. **User completes Phases 1-2** → Auto-save works, data persists
6. **User sees CTA** → "Complete Your Transformation" button
7. **Clicks to purchase page** → workbook-purchase.html
8. **Completes Stripe payment** → $67 charged
9. **Redirected to login** → workbook-login.html
10. **Creates account** → Email stored in Firebase
11. **Access granted** → workbook/index.html opens
12. **Completes 8 phases** → Full transformation journey

---

## **FILES I NEED TO UPDATE FOR YOU:**

1. `default-mode-landing.html` - Add MailerLite integration
2. `workbook-purchase.html` - Add Stripe keys
3. Create: `netlify/functions/create-checkout-session.js`
4. Create: `netlify.toml`

**Ready for me to update these files with the integration code?**

Just give me:
- ✅ Your MailerLite API key
- ✅ Your MailerLite Group ID  
- ✅ Your Stripe Publishable Key
- ✅ Your Stripe Price ID

And I'll make it all work.

