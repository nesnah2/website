# LAUNCH CHECKLIST - Default Mode Workbook System

## 1. PAYMENT SETUP (Stripe) - NEEDS COMPLETION

### Setup Required:
- [ ] Get Stripe account set up (if not already)
- [ ] Replace test key in `workbook-purchase.html`: `pk_test_your_stripe_publishable_key_here`
- [ ] Create Stripe product for "$67 Default Mode Workbook"
- [ ] Get Stripe Price ID and replace: `price_workbook_97`
- [ ] Set up backend endpoint: `/create-checkout-session` (Netlify Functions)
- [ ] Configure success URL: `/workbook-login.html?purchase=success`
- [ ] Test payment flow end-to-end

### Files to Update:
- `workbook-purchase.html` (line 307, 322)
- Create: `netlify/functions/create-checkout-session.js`

---

## 2. LANDING PAGE - NEEDS EMAIL INTEGRATION

### Current Status:
- [x] Landing page created: `default-mode-landing.html`
- [x] Added to main site: `index.html` (Free Guide Section)
- [ ] Email capture integration (MailerLite)
- [ ] Auto-send free guide link after email signup
- [ ] Test email delivery

### Files to Check:
- `default-mode-landing.html`
- `index.html` (Free Guide Section)

---

## 3. SYSTEM TESTING

### A. Free Guide (`free-guide.html`)
- [ ] Open page on desktop
- [ ] Open page on mobile
- [ ] Fill out some questions
- [ ] Verify auto-save works (check every 10 seconds)
- [ ] Type in field, wait 2 seconds, verify save
- [ ] Refresh page, verify data persists
- [ ] Check all text is readable
- [ ] Test checkboxes work
- [ ] Test CTA buttons work

### B. Login/Signup Flow (`workbook-login.html`)
- [ ] Test signup with new email
- [ ] Verify redirect to workbook works
- [ ] Test login with existing account
- [ ] Verify no redirect loops
- [ ] Test "Remember Me" functionality
- [ ] Test logout button
- [ ] Test on mobile

### C. Paid Workbook (`workbook/index.html`)
- [ ] Login and access workbook
- [ ] Test all 8 phases load correctly
- [ ] Test phase navigation works
- [ ] Fill out forms in different phases
- [ ] Verify auto-save works (10 seconds)
- [ ] Verify debounced save works (2 seconds after typing)
- [ ] Refresh and verify data persists
- [ ] Test on mobile (all phases)
- [ ] Verify all text is readable
- [ ] Test personal stories display correctly
- [ ] Test mentorship CTA at end
- [ ] Test logout works

### D. Purchase Flow (End-to-End)
- [ ] Start at landing page
- [ ] Click through to purchase page
- [ ] Review product details
- [ ] Click "Get Complete Workbook"
- [ ] Complete Stripe payment (test mode)
- [ ] Verify redirect to signup/login
- [ ] Create account
- [ ] Verify access to full workbook
- [ ] Test on mobile

---

## 4. MOBILE OPTIMIZATION CHECK

### Pages to Test:
- [ ] `index.html` - Main site
- [ ] `default-mode-landing.html` - Landing page
- [ ] `free-guide.html` - Free guide
- [ ] `workbook-purchase.html` - Purchase page
- [ ] `workbook-login.html` - Login page
- [ ] `workbook/index.html` - Paid workbook

### Mobile Tests:
- [ ] All text readable (font sizes)
- [ ] Buttons large enough to tap
- [ ] Forms work correctly
- [ ] No horizontal scrolling
- [ ] Navigation works
- [ ] Auto-save works

---

## 5. CRITICAL BUGS TO CHECK

### Known Issues to Verify Fixed:
- [x] Text size in question boxes (increased to 18px)
- [x] Label text size (increased to 1.3rem)
- [x] Redirect loops in login (fixed)
- [x] Auto-save added (10 seconds + debounced)
- [x] Phase 8 width consistency (fixed)

### New Checks:
- [ ] No console errors
- [ ] All links work
- [ ] All images load
- [ ] No broken navigation
- [ ] Firebase authentication works
- [ ] Data persistence across devices

---

## 6. CONTENT VERIFICATION

### Free Guide:
- [x] Phase 1 personal story added
- [x] Phase 2 personal story added
- [x] Exercises are clear
- [x] CTA to paid version works

### Paid Workbook:
- [x] Phase 3 personal story added
- [x] Phase 4 personal story added
- [x] Phase 5 personal story added
- [x] Phase 6 personal story added
- [x] Phase 7 personal story added
- [x] Phase 8 personal story added
- [x] All exercises are complete
- [x] Phase completion messages added
- [x] Mentorship CTA at end

---

## 7. FINAL PRE-LAUNCH

### Before Going Live:
- [ ] All Stripe keys updated (production mode)
- [ ] All test data cleared
- [ ] Email automation tested
- [ ] Backup all files
- [ ] Test complete funnel 3 times
- [ ] Mobile test on real devices
- [ ] Share beta link with 2-3 trusted people

### Launch Day:
- [ ] Post announcement on Instagram
- [ ] Share landing page link
- [ ] Monitor for any issues
- [ ] Respond to all DMs immediately
- [ ] Track first signups

---

## PRIORITY ORDER:

1. **STRIPE SETUP** (Required for payments)
2. **EMAIL INTEGRATION** (Required for free guide delivery)
3. **FULL SYSTEM TEST** (Ensure everything works)
4. **MOBILE TEST** (Most users will be on mobile)
5. **FINAL CHECK** (Go live)

---

## Notes:
- Auto-save works every 10 seconds + 2 seconds after typing stops
- Text sizes increased for better readability
- All personal stories added to phases
- Firebase authentication active
- Ready for launch after Stripe + Email setup









