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
  apiKey:            "DEIN_API_KEY",
  authDomain:        "DEIN_PROJEKT.firebaseapp.com",
  projectId:         "DEIN_PROJEKT_ID",
  storageBucket:     "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId:             "DEINE_APP_ID"
};

// Firebase initialisieren
try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  // Verhindert Fehler bei doppelter Initialisierung (z.B. Hot-Reload)
  if (e.code !== 'app/duplicate-app') console.error('Firebase Init Fehler:', e);
}
