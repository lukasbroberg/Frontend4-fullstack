# Problem hub - Problem Sharing & Chat Platform (frontend)
This application features the frontend of Problem-hub, developed for the course at DTU: Full stack development and distribution.
This application is intended to run with environment variable directed to the server's IP address.
This application is built in TypeScript using React Native with expo.

## Prerequisites:
Node.js has to be installed to be able to use the node package manager, used for managing the external packages of this application.

## Dependencies
| Dependency
| --- | --- |
| Expo*
| React*
| Axios
| rx-Stomp
| rxjs
| text-encoding
| ws

## How to run

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Project Structure

```text
src/app/
├── (auth)/                # Authentication pages: Login and register 
├── (tabs)/                # Navigation pages
├── components/            # Reusable page components
├── config/                # Configuration files
├── hooks/                 # State and business logic
├── services/              # Service layer
├── types/                 # Types/data models
└── utils/                 # Extra helper functions
```

## Contributors / The Crew

- Linh, Lukas, Leon, Liam, Nichlas, and Carl Chr.

**Version**: 1.0

**Status**: Ready for handover