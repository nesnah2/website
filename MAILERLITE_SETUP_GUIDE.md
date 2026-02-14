# 📧 MailerLite Integration Setup

## **Perfect! Here's Your Complete Flow:**

### **Customer Journey:**
1. **Visits your landing page** (`default-mode-landing.html`)
2. **Gets free guide** via email signup
3. **Sees purchase option** for complete workbook ($67)
4. **Clicks "GET COMPLETE WORKBOOK"** → goes to `workbook-purchase.html`
5. **Completes Stripe checkout**
6. **Automatically added to MailerLite** as paid customer
7. **Gets workbook email** via MailerLite automation

## **MailerLite Setup Steps:**

### **Step 1: Get Your MailerLite API Key**
1. Go to MailerLite → Integrations → Developer API
2. Create a new API key
3. Copy the key (starts with something like `ml_...`)

### **Step 2: Create a "Paid Customers" Group**
1. Go to MailerLite → Subscribers → Groups
2. Create new group: "Paid Customers" or "Workbook Buyers"
3. Copy the Group ID (number)

### **Step 3: Set Up Automation**
1. Go to MailerLite → Automations
2. Create new automation: "Workbook Purchase"
3. Trigger: When subscriber is added to "Paid Customers" group
4. Action: Send email with workbook download link

### **Step 4: Add Environment Variables**
Add these to your `.env` file:
```
MAILERLITE_API_KEY=ml_your_api_key_here
MAILERLITE_PAID_GROUP_ID=123456789
```

## **What Happens Automatically:**

✅ **Customer completes purchase** → Stripe webhook triggers
✅ **Customer added to MailerLite** → "Paid Customers" group
✅ **MailerLite automation fires** → Sends workbook email
✅ **Customer gets instant access** → Professional email with download

## **Benefits:**

🎯 **Seamless integration** with your existing MailerLite setup
📧 **Professional emails** using your MailerLite templates
🔄 **Automatic segmentation** - paid vs free customers
📊 **Full tracking** - see who bought, when, etc.
🚀 **Zero manual work** - completely automated

## **Test the Flow:**

1. Make a test purchase
2. Check MailerLite → Subscribers → "Paid Customers" group
3. Verify the automation email was sent
4. Confirm the customer received the workbook

**Your complete sales funnel is now automated!** 🎉
