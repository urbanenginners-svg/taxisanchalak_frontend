# Taxi Sanchalak Mobile

React Native (Expo) app for the Taxi Sanchalak driver and admin platform.

## Setup

```bash
cd mobile
npm install
npm start
```

## Backend connection

The app connects to `http://localhost:6010/api/v1` (iOS simulator) or `http://10.0.2.2:6010/api/v1` (Android emulator).

Make sure the backend is running:

```bash
cd ../backend
npm run seed
npm run start:dev
```

Update `src/config.ts` if your API runs on a different host/port.

## Default admin login

- Email: `admin@taxisanchalak.com`
- Password: `Admin@123`

## Features

### Driver
- Register & login
- Manage team drivers (sub-drivers, not app users)
- Register vehicles & assign team drivers
- Post rides (Delhi → Chandigarh style) with fare, commission, customer details
- Browse open rides, send requests
- Accept/reject requests on posted rides
- Pay commission to unlock customer details
- Post taxi availability & send/respond to enquiries
- Driver-to-driver chat
- Raise support tickets

### Admin
- Login
- Review & update ticket status
- View all users

## Project structure

```
mobile/
  App.tsx                 # Entry point
  src/
    api/                  # Axios client & API services
    components/           # Shared UI components
    context/              # Auth context
    navigation/           # React Navigation stacks
    screens/              # Auth, driver, admin screens
    types/                # TypeScript types
    config.ts             # API base URL
```
