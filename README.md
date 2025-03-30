# User Management System
Angular-based application with Firebase integration for user authentication and management

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

## Features
- User registration with email/password
- Secure login/logout functionality
- User profile management (CRUD operations)
- Admin dashboard with user management
- Password reset functionality
- Real-time data synchronization with Firestore

## Prerequisites
- Node.js (v16+)
- Angular CLI (v15+)
- Firebase account
- Modern web browser with ES6+ support

## Installation
```bash
git clone https://github.com/elevatechdev/ums.git
cd ums
npm install
```

## Configuration
1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication methods (Email/Password, Google)
3. Create Firestore database in production mode
4. Update `src/environments/environment.ts` with your Firebase config:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

## Running the Application
```bash
ng serve
```
Navigate to `http://localhost:4200`

## Testing
```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## Deployment
```bash
# Build for production
ng build --configuration production

# Deploy to Firebase Hosting
firebase deploy
```

## Built With
- Angular 15+
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Angular Material UI
- RxJS
- Jasmine/Karma

## License
MIT License

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments
- Firebase team for comprehensive documentation
- Angular team for powerful framework
- Material Design team for UI components

"# Tax-Management-System" 
