# 🛒 QuickList  

QuickList is a **cross-platform grocery list manager** built with React Native, Firebase, and Firestore.  
It makes shopping simple, fast, and collaborative whether you’re at the store or adding items from home.  

(Mobile Application)
Ricard Oosthuizen

---

## 📌 Table of Contents
- [Features](#✨-features)  
- [Tech Stack](#🛠️-tech-stack)  
- [Installation](#🚀-installation)  
  - [Clone the Repository](#1-clone-the-repository)  
  - [Required Dependencies](#2-required-dependencies)  
  - [Firebase Setup](#3-required-dependencies)  
  - [Running the App IOS](#4-running-the-app-ios)  
  - [Running the App Android](#41-running-the-app-andriod)  
  - [Quick Start](#5-quick-start)  
- [Security](#-security)  
- [Why QuickList?](#-why-quicklist)  
- [Mobile App Mockups](#-mobile-app-mockups)  
- [Demo Video](#-demo-video)  
- [Author](#-author)  

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

# 📱 Mobile App Mockups
<img width="1920" height="1440" alt="441shots_so" src="https://github.com/user-attachments/assets/ea5532d6-b4ba-43f0-9beb-4c7c1967e92f" />
<img width="1920" height="1440" alt="225shots_so" src="https://github.com/user-attachments/assets/125c90c0-b357-4f06-a08e-56401b3a467f" />
<img width="1920" height="1440" alt="891shots_so" src="https://github.com/user-attachments/assets/5d80fd41-f711-4cae-91d7-dccf6eda7d8a" />


### 3.🎥 Demo Video 
This is the V1.00 demo, designed to showcase the core principles and functionality of the application.
https://drive.google.com/drive/folders/1tqHqu4rQAwF-nPOQwAn0FkPmnRvGKCuf?usp=drive_link

---

# 🙏 Acknowledgments, Highlights & Challenges

## Acknowledgments
I would like to express my gratitude to:  
- **Online communities and resources** (Stack Overflow, React Native & Firebase documentation) for support with technical challenges.  
- **Friends and family** who tested the app and provided valuable user feedback.  

## Highlights
- Implemented **real-time grocery list syncing** using Firebase Firestore.  
- Developed a **cross-platform app** that works seamlessly on both iOS and Android.  
- Added **color-coded and tag-based list customization** for better organization.  
- Enabled **collaborative editing**, allowing multiple users to contribute to shared lists.  
- Modern UI/UX with **smooth swipe gestures, onboarding, and animations**.  

## Challenges
- **Authentication handling:** Initially displayed Firebase errors directly to users, requiring improvements for safer user experience.  
- **Real-time updates:** Integrating snapshot listeners for live updates was complex and took iterative testing.  
- **Component modularity:** Refactoring large components into reusable, smaller components while maintaining functionality.  
- **CRUD logic for shared lists:** Handling edit permissions and ensuring data persistence across users.  

# 🚀 Future Improvements

QuickList is an ongoing project, and here are some ideas for future versions to make it even better:  

- ✨ **Enhanced UI/UX:** Cleaner, more modern interface for smoother navigation.  
- 🏷️ **More List Features:** Advanced list management, including sorting, priority levels, and recurring items.  
- 👤 **Profile Page:** Allow users to manage their account, view activity history, and customize settings.  
- 🔔 **Notifications:** Reminders for items on your lists or shared lists.  
- ⚡ **Performance Improvements:** Faster loading, smoother animations, and offline support.  

This section demonstrates the vision for QuickList as a full-featured, user-friendly grocery management app.

# 👨‍💻 Author


Developed by Ricard Oosthuizen.  





















