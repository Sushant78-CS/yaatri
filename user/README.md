# 🛡️ Yaatri

**Yaatri** is an emergency safety mobile application built with React Native and Firebase that helps users send SOS alerts, share live location, manage emergency contacts, and communicate during emergencies even when internet connectivity is unavailable.

---

## 🚨 Problem Statement

During emergencies, internet connectivity is not always available. Traditional safety applications depend heavily on mobile data and cloud services, making them unreliable in disaster-prone or remote areas.

Yaatri addresses this challenge by providing:

- Emergency SOS alerts
- Offline emergency message relaying
- Nearby device communication
- Emergency contact notifications
- Crash detection support
- SOS history tracking

---

## ✨ Features

### Emergency SOS

- One-tap SOS activation
- 5-second cancellation countdown
- Live location sharing
- Emergency alert creation

### Offline SOS Relay Network

- Nearby device discovery
- Device-to-device emergency communication
- SOS message forwarding through nearby users
- Works without internet connection

### Emergency Contacts

- Add trusted contacts
- Quick emergency notification
- Contact management

### Location Services

- Real-time location tracking
- Reverse geocoding
- Google Maps integration

### SOS History

- View previous emergency alerts
- Track active and completed alerts

### Crash Detection

- Automatic emergency workflow initiation
- Sensor-based accident detection

### Authentication

- Secure Firebase Authentication
- User profile management
- Persistent login sessions

---

## 🏗️ Tech Stack

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand

### Backend & Database

- Firebase Authentication
- Cloud Firestore

### Device Features

- Expo Location
- Expo SMS
- Expo Sensors
- Expo Nearby Connections

---

## 📱 Screens

- Authentication
- Home
- SOS Activation
- Emergency Contacts
- Profile
- SOS History
- Offline Relay Network

---

## 🧠 Architecture

```text
User
  │
  ▼
React Native App
  │
  ├── Firebase Authentication
  ├── Firestore Database
  ├── Location Services
  ├── SMS Services
  ├── Crash Detection
  └── Nearby Connections
            │
            ▼
     Offline Relay Network
```

---

## 📂 Project Structure

```text
src
├── app
├── components
├── services
├── store
├── firebase
├── constants
└── hooks
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Sushant78-CS/Yaatri.git
cd Yaatri
```

### Install Dependencies

```bash
bun install
```

or

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Start Development Server

```bash
npx expo start
```

---

## 🔒 Permissions

Yaatri requires:

- Location
- SMS
- Bluetooth
- Nearby Devices
- Internet

These permissions are used solely for emergency communication and safety features.

---

## 🚀 Future Enhancements

- AI-powered emergency classification
- Satellite messaging support
- Emergency responder dashboard
- Multi-hop mesh networking
- Medical profile sharing
- Voice activated SOS

---

## 👨‍💻 Author

**Sushant Sonkamble**

GitHub: https://github.com/Sushant78-CS

LinkedIn: https://linkedin.com/in/sushant-sonkamble

---

## 📄 License

This project is developed for educational, research, and safety-focused purposes.
