# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it: "default-mode-workbook"
4. Disable Google Analytics (not needed for now)
5. Click "Create Project"

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get Started"
3. Click "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

## Step 3: Enable Firestore Database

1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose your region (closest to your users)
5. Click "Enable"

## Step 4: Set Firestore Rules

1. In Firestore, click "Rules" tab
2. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workbook progress - users can only access their own
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Config

1. Click the gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app name: "Default Mode Workbook"
5. Copy the `firebaseConfig` object
6. Paste it into `firebase-config.js` replacing the placeholder values

Example:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "default-mode-workbook.firebaseapp.com",
    projectId: "default-mode-workbook",
    storageBucket: "default-mode-workbook.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## Step 6: Test the System

1. Go to `mikkelhansen.org/workbook-login.html`
2. Click "Create Account"
3. Fill in name, email, password
4. Click "Create Account"
5. Should redirect to workbook
6. Try logging out and logging back in

## Step 7: Verify in Firebase Console

1. Go to Authentication → Users
2. You should see your test account
3. Go to Firestore → users collection
4. You should see your user document

## Common Issues:

**"Firebase is not defined"**
- Check that firebase-config.js is loading
- Check browser console for errors

**"Permission denied"**
- Check Firestore rules are published
- Make sure user is authenticated

**"Account already exists"**
- Delete user in Firebase Console → Authentication
- Try creating account again

## What This Gives You:

✅ Real user accounts that work across devices
✅ Secure password storage
✅ Progress automatically saved to cloud
✅ Users can login from anywhere
✅ Professional authentication system
✅ Free tier supports up to 50,000 users/month








