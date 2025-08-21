# 🛒 QuickList  

QuickList is a **cross-platform grocery list manager** built with React Native, Firebase, and Firestore.  
It makes shopping simple, fast, and collaborative whether you’re at the store or adding items from home.  

---

## ✨ Features  
- 📋 Create and manage grocery lists  
- 🎨 Customize each list with its own color  
- 🏷️ Add tags (e.g., *On Special*, *Essentials*)  
- 🔄 Real-time syncing with Firestore  
- 👥 Share grocery lists with others for collaborative editing  
- 🧹 Swipe-to-remove items with a smooth animation  
- ✏️ Edit and delete lists anytime  
- 🔍 Filter lists by tags you’ve created  
- 🔐 Firebase Authentication for secure access  
- 🎉 Modern onboarding with a smooth design  
- 📱 Works seamlessly on **iOS** and **Android**  

---

## 🛠️ Tech Stack  
- React Native (**JavaScript + TypeScript**)  
- Firebase (Authentication + Firestore Database)  
- Swipe gestures & animations  
- Works on **iOS & Android** with no issues  

---

## 🚀 Installation  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/quicklist.git
cd quicklist
npm install
# or
yarn install
```

### 2. Required Dependencies  
```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-gesture-handler
npm install @react-native-async-storage/async-storage
npm install firebase
npm install uuid
```

### 3. Required Dependencies  
Follow these steps to configure Firebase:

1. **Go to Firebase Console**  
   Open [Firebase Console](https://console.firebase.google.com/) in your browser.

2. **Create a New Project**  
   Click on **Add project** and follow the prompts to create a new Firebase project.

3. **Enable Authentication**  
   - Go to the **Authentication** section in the sidebar.  
   - Click **Get Started**.  
   - Enable **Email/Password** sign-in method.

4. **Enable Cloud Firestore**  
   - Go to **Firestore Database** in the sidebar.  
   - Click **Create Database**.  
   - Choose **Start in production mode** or **Start in test mode** as needed.  
   - Set rules to secure user data.

5. **Add a Web App**  
   - Click on the **Settings (gear icon)** → **Project settings**.  
   - Go to **Your apps** → **Add app** → **Web**.  
   - Register your app and copy the Firebase config object.

6. **Create Firebase Config File**  
   - In your project root, create a file named `firebaseConfig.ts` (or `.js`).  
   - Paste the Firebase config object into this file.

### 4. Running the app IOS
```bash
npx react-native run-ios
```

### 4.1 Running the app Andriod
```bash
npx react-native run-android
```

### 5 Quick start
```bash
npx expo start
```

---

# 🔒 Security

**Authentication:** Only logged-in users can access lists

**Firestore Security Rules:**
- Users can only read & write to their own lists
- Shared lists can be edited only by those with permission

**Safe Data Sharing:** Each shared list uses a unique, randomly generated ID

# 🎯 Why QuickList?

Shopping lists shouldn’t be a hassle. QuickList helps you:  
- Track groceries in real time  
- Share lists instantly with family or roommates  
- Swipe away items you’ve bought  
- Keep lists organized with tags and colors  
- Always know what’s missing, even if you’re not at the store

---

# 🎯 Mobile Mockups
<img width="1920" height="1440" alt="486shots_so" src="https://github.com/user-attachments/assets/3f39918f-65c9-4060-b2f1-8871cfa495ce" />
<img width="1920" height="1440" alt="380shots_so" src="https://github.com/user-attachments/assets/50e99ae9-1c4d-4103-8c8a-975a402f1b7d" />
<img width="1920" height="1440" alt="265shots_so" src="https://github.com/user-attachments/assets/37a72cb5-0284-4235-b904-b2cea15a7eb9" />
<img width="1920" height="1440" alt="557shots_so" src="https://github.com/user-attachments/assets/6fd8b197-d8a0-47ff-a881-cc913a2d0ebc" />
<img width="1920" height="1440" alt="728shots_so" src="https://github.com/user-attachments/assets/991c133d-c0ff-40c7-ad9a-ccc99dc14397" />

# 👨‍💻 Author


Developed by Ricard Oosthuizen.  





















