# 🏠 Wohnungs-Inventar

Interaktive Web-App zur vollständigen Bestandsaufnahme einer Wohnung.
Geräteübergreifend synchronisiert über Firebase.

---

## Projektstruktur

```
wohnungs-inventar/
├── index.html                  ← Startseite: Räume-Übersicht
├── room.html                   ← Raum-Detail (dynamisch: ?id=X)
├── alle-gegenstaende.html      ← Alle Gegenstände
├── statistik.html              ← Statistiken & Diagramme
├── konto.html                  ← Login / Registrierung / Profil
├── sitemap.xml                 ← Sitemap (alle statischen Seiten)
├── css/
│   └── styles.css              ← Vollständiges Stylesheet (responsive)
└── js/
    ├── firebase-config.js      ← ⚠️ Firebase-Konfiguration (AUSFÜLLEN!)
    ├── data.js                 ← Standarddaten & Konstanten
    ├── storage.js              ← Firestore + localStorage Hybrid
    ├── nav.js                  ← Gemeinsame Navigation
    └── modals.js               ← Shared Modal-Logik
```

---

## ⚡ Schnellstart

### 1. Firebase-Projekt anlegen (kostenlos)

1. Gehe zu https://console.firebase.google.com
2. **"Projekt erstellen"** → Namen eingeben (z.B. "mein-inventar")
3. Google Analytics: optional (kann übersprungen werden)

### 2. Authentication einrichten

1. Im Firebase-Projekt: **Authentication** → **Anmeldemethoden**
2. Aktivieren:
   - ✅ E-Mail/Passwort
   - ✅ Google (für "Mit Google anmelden")
3. Unter **Authorized Domains**: deine Domain hinzufügen (z.B. `meine-domain.de`)

### 3. Firestore-Datenbank anlegen

1. **Firestore Database** → **Datenbank erstellen**
2. **Produktionsmodus** auswählen → Region wählen (z.B. `europe-west3` für Deutschland)
3. Nach der Erstellung: **Regeln** Tab öffnen und ersetzen mit:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

4. **Veröffentlichen** klicken

### 4. Firebase-Config kopieren

1. Im Projekt: ⚙️ **Projekteinstellungen** → **Allgemein**
2. Unter "Deine Apps" → **Web-App hinzufügen** (</> Symbol)
3. App-Namen eingeben → **Registrieren**
4. Die `firebaseConfig`-Werte in `js/firebase-config.js` eintragen

### 5. Domain anpassen

In allen HTML-Dateien `https://DEINE-DOMAIN.de` durch deine echte Domain ersetzen:
- Canonical-Tags (`<link rel="canonical">`)
- JSON-LD-Markup (`"url": "..."`)
- `sitemap.xml`

---

## 🌐 Hosting (Online stellen)

Die App ist eine **reine statische Website** – kein Server, kein Build-Schritt nötig.

**Option A: Netlify (empfohlen)**
1. https://netlify.com → Konto erstellen
2. Ordner per Drag & Drop auf das Deploy-Feld ziehen
3. Fertig! Optional eigene Domain verknüpfen

**Option B: Firebase Hosting (naheliegend)**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Option C: GitHub Pages**
1. Repository erstellen → Dateien pushen
2. Settings → Pages → Branch: main auswählen

---

## 💾 Datenspeicherung

| Situation | Speicherort |
|-----------|-------------|
| Nicht angemeldet | localStorage (Browser) |
| Angemeldet | Firestore (Cloud) |

- Angemeldete Nutzer haben **Echtzeit-Sync** – Änderungen auf Gerät A erscheinen sofort auf Gerät B
- Beim ersten Login werden lokale Daten automatisch in die Cloud migriert
- Die Datenbank ist durch Firestore-Regeln gesichert: nur der eigene Account hat Zugriff

---

## 🔍 SEO & Meta-Tags

Alle Seiten haben:
- `<meta name="robots" content="noindex, nofollow">` – App ist privat, nicht indexieren
- Self-referencing `<link rel="canonical">` – kanonische URL je Seite
- **JSON-LD** strukturierte Daten (Schema.org WebApplication / CollectionPage / WebPage)
- `sitemap.xml` für alle statischen Seiten

---

## 📱 Responsive

- Desktop: vollständige Navigation
- Tablet (< 900px): Charts in einer Spalte
- Mobile (< 640px): Hamburger-Menü, 2-spaltige Kacheln, Touch-optimierte Buttons
- Sehr klein (< 380px): 2-spaltige Grids für Räume & Gegenstände
