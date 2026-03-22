/* ============================================
   firebase-config.js
   ============================================
   SETUP-ANLEITUNG:
   1. Gehe zu https://console.firebase.google.com
   2. Klicke "Projekt erstellen" → Namen eingeben
   3. Im Projekt: "Web-App hinzufügen" (</> Symbol)
   4. Kopiere die firebaseConfig-Werte hier rein
   5. Im Firebase-Projekt aktivieren:
      - Authentication → E-Mail/Passwort ✓
      - Authentication → Google ✓
      - Firestore Database → Im Produktionsmodus erstellen
   6. Firestore-Regeln setzen (Firestore → Regeln):
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /users/{userId}/{document=**} {
            allow read, write: if request.auth != null
                               && request.auth.uid == userId;
          }
        }
      }
   ============================================ */

const firebaseConfig = {
  apiKey:            "AIzaSyBN-ENcn4PaoLsNNp4AGDxsQ1zUWViuN7Y",
  authDomain:        "abitclumsy-home-inventory.firebaseapp.com",
  projectId:         "abitclumsy-home-inventory",
  storageBucket:     "abitclumsy-home-inventory.firebasestorage.app",
  messagingSenderId: "1024081432361",
  appId:             "1:1024081432361:web:f3cf7d3410ee2350083138",
  measurementId:     "G-DX1E0H8Y1K"
};

// Firebase initialisieren
try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  // Verhindert Fehler bei doppelter Initialisierung (z.B. Hot-Reload)
  if (e.code !== 'app/duplicate-app') console.error('Firebase Init Fehler:', e);
}
