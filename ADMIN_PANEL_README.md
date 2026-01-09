# Admin Panel - Test Only Feature

## Overview
A special admin testing feature has been added to allow you to manage users in the database. **This feature is TEST ONLY and must be removed before production.**

## How to Access Admin Panel

### Admin Credentials
```
Email: admin@quicklist.test
Password: AdminTest@2026
```

### Steps to Access
1. Open the app and go to the Login screen
2. Enter the admin credentials above
3. You'll be taken directly to the Admin Panel instead of the regular home screen

## Admin Panel Features

### View All Users
- Displays a list of all users in the database
- Shows each user's name, email, and ID
- Shows total user count at the top

### Delete Individual User
- Click the "Delete" button on any user card
- Confirm the deletion in the dialog
- User will be removed from Firestore immediately
- Note: Firebase Authentication deletion requires Firebase Admin SDK

### Delete All Users
- Click the "Delete All Users" button (red button)
- Confirm the deletion in the alert dialog
- All users will be permanently removed from Firestore
- Be careful with this action!

### Refresh Users
- Click "Refresh" to reload the user list from database

## Technical Details

### Files Added
- `services/adminService.ts` - Admin operations (delete users, list users)
- `screens/AdminPanelScreen.tsx` - Admin UI component

### Files Modified
- `App.tsx` - Added AdminPanel route
- `types.ts` - Added AdminPanel to RootStackParamList
- `screens/LoginScreen.tsx` - Added admin login detection

### Admin Service Functions
```typescript
// Check if a user is admin
isAdminUser(email: string): boolean

// Get all users
getAllUsers(): Promise<User[]>

// Delete individual user from Firestore
deleteIndividualUser(userId: string, userEmail: string): Promise<boolean>

// Delete all users from Firestore
deleteAllUsersFromFirestore(): Promise<number>

// Get admin credentials
getAdminCredentials(): { email: string, password: string }
```

## Important Notes

⚠️ **BEFORE PRODUCTION:**
1. Delete or comment out `adminService.ts`
2. Delete or comment out `AdminPanelScreen.tsx`
3. Remove AdminPanel route from `App.tsx`
4. Remove AdminPanel from `types.ts`
5. Remove admin login check from `LoginScreen.tsx`
6. Remove admin credentials from anywhere they may be logged

⚠️ **Security Concerns:**
- Admin credentials are hardcoded (for testing only)
- No authentication check for admin panel access
- Direct access to delete functions without proper authorization
- All of this is intentionally simple for development

## Limitations
- Only deletes users from Firestore collection
- Does not delete Firebase Authentication users (requires Admin SDK)
- No backup or recovery mechanism
- No audit logging

---
**REMINDER: This is a TEST-ONLY feature and must be completely removed before deploying to production.**
