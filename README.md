# DevoteeSathee - Matrimonial App

A professional matrimonial app for devotees, built with React Native and Expo.

## Features

- **Match Discovery** - Browse potential matches with beautiful profile cards
- **Profile Photos** - Large, high-quality profile images
- **Match Details** - View name, age, location, profession, and education
- **Like & Connect** - Express interest with heart button and chat
- **User Profile** - View and edit your own profile
- **Modern UI** - Sleek, professional design with smooth interactions

## Screenshots

The app features:
- Landing screen with scrollable match cards
- Each card shows: photo, name, age, location, profession, education
- Action buttons: pass, chat, and favorite
- Profile modal with edit functionality

## Getting Started

### Prerequisites

1. **Install Expo Go on your phone:**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Node.js** installed on your development machine

### Installation

```bash
cd DevoteeSathee
npm install
```

### Running the App

**Local Development:**
```bash
npx expo start
```
Scan the QR code with Expo Go app.

**Tunnel Mode (for remote access):**
```bash
npx expo start --tunnel
```

### Remote VM Deployment

```bash
# Copy to VM
rsync -avz --exclude 'node_modules' -e "ssh -i ~/.ssh/id_ecdsa" DevoteeSathee/ ubuntu@<VM_IP>:~/DevoteeSathee/

# SSH and run
ssh -i ~/.ssh/id_ecdsa ubuntu@<VM_IP>
cd ~/DevoteeSathee
npm install
npx expo start --tunnel
```

## Project Structure

```
DevoteeSathee/
├── App.js          # Main app with all components
├── app.json        # Expo configuration
├── package.json    # Dependencies
└── assets/         # App icons and images
```

## Tech Stack

- React Native
- Expo
- @expo/vector-icons (Ionicons)

## Color Scheme

- Primary: #E91E63 (Pink)
- Background: #f8f9fa
- Text: #1a1a1a, #333, #666
