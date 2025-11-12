# Firestore Security Rules Deployment

## Current Security Status
⚠️ **IMPORTANT**: Firestore security rules must be deployed manually to Firebase Console.

## How to Deploy These Rules

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project (QuickList)

2. **Navigate to Firestore Rules**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab

3. **Copy and Paste Rules**
   - Open the `firestore.rules` file in this repository
   - Copy the entire content
   - Paste it into the Firebase Console rules editor
   - Click "Publish"

4. **Verify Rules are Active**
   - After publishing, test that unauthorized access is blocked
   - Try accessing lists without authentication
   - Verify users can only access their own data

## What These Rules Protect

### ✅ User Profiles
- Users can only read/write their own profile
- Users can only access their own stats and achievements

### ✅ Grocery Lists
- Anyone with the list ID can read (for sharing)
- Only the list owner can create, update, or delete
- All data is validated (title length, items count, etc.)

### ✅ Input Validation at Database Level
- List names: 2-100 characters
- Items: 1-200 characters, max 500 items per list
- Tags: 1-50 characters, max 20 tags per list

### ✅ Prevents Common Attacks
- Blocks unauthorized data access
- Prevents data tampering
- Validates all input at database level
- Blocks access to undefined collections

## Testing the Rules

After deployment, test these scenarios:

```javascript
// ❌ Should FAIL - Unauthenticated user trying to create list
await addDoc(collection(db, 'lists'), { title: 'Test' });

// ❌ Should FAIL - User trying to access another user's profile
await getDoc(doc(db, 'users', 'another-user-id'));

// ✅ Should SUCCEED - User accessing their own lists
await getDocs(collection(db, 'lists').where('userId', '==', currentUserId));

// ❌ Should FAIL - User trying to delete another user's list
await deleteDoc(doc(db, 'lists', 'another-users-list-id'));
```

## Next Steps

1. ✅ Deploy these rules to Firebase Console
2. ⚠️ Test all CRUD operations still work
3. ⚠️ Verify unauthorized access is blocked
4. ⚠️ Monitor Firestore usage for suspicious activity

## Emergency Rollback

If something breaks after deploying:

1. Go back to Firebase Console > Firestore > Rules
2. Click on the "History" tab
3. Restore the previous version
4. Investigate the issue before redeploying
