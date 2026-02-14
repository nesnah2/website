# 📧 Email Automation Setup Guide

## **How It Works:**
1. Customer completes purchase
2. Stripe sends webhook to your server
3. Server automatically sends workbook email to customer
4. Customer gets instant access to their purchase

## **Setup Steps:**

### **Step 1: Set Up Email Service**

**Option A: Gmail (Easiest)**
1. Go to Gmail → Settings → Security
2. Enable 2-Factor Authentication
3. Generate an "App Password"
4. Use your Gmail address and app password

**Option B: Other Email Services**
- Outlook, Yahoo, or any SMTP service
- Update the service in `server-stripe.js`

### **Step 2: Add Email Environment Variables**

Add these to your `.env` file:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
WORKBOOK_DOWNLOAD_URL=https://yourdomain.com/workbook.pdf
```

### **Step 3: Upload Your Workbook**

1. Upload your workbook PDF to your website
2. Update the `WORKBOOK_DOWNLOAD_URL` to point to it
3. Make sure the file is accessible via direct link

### **Step 4: Test the System**

1. Make a test purchase
2. Check that the email is sent automatically
3. Verify the download link works

## **What the Customer Gets:**

- **Instant email** after purchase
- **Professional email** with download link
- **Clear instructions** on how to use the workbook
- **Your contact info** for support

## **Benefits:**

✅ **Fully automated** - no manual work
✅ **Instant delivery** - customer gets access immediately  
✅ **Professional** - branded email from you
✅ **Reliable** - works 24/7
✅ **Trackable** - you can see when emails are sent

Your customers will love getting instant access to their purchase! 🎉
