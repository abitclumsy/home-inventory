# 🏠 Wohnungs-Inventar

Eine interaktive Web-App zur vollständigen Bestandsaufnahme einer Wohnung.

## Projektstruktur

```
wohnungs-inventar/
├── index.html          ← Einstiegspunkt der App
├── css/
│   └── styles.css      ← Alle Styles (CSS-Variablen, Layout, Komponenten)
├── js/
│   ├── data.js         ← Standarddaten & Icon-/Farb-Konstanten
│   ├── storage.js      ← localStorage-Persistenz (Speichern & Laden)
│   ├── render.js       ← Darstellung: Räume, Kacheln, Listen
│   ├── modals.js       ← Dialoge: Raum & Gegenstand erstellen/bearbeiten
│   ├── stats.js        ← Statistik-Seite mit Diagrammen
│   └── app.js          ← Routing, UI-State, Initialisierung
└── README.md
```

## Features

- **3 Ansichten:** Räume, Alle Gegenstände, Statistik
- **Kachel- & Listenansicht** umschaltbar
- **Suche & Filter** nach Name, Raum und Zustand
- **Räume verwalten:** hinzufügen, bearbeiten, löschen (mit Icon- & Farbwahl)
- **Gegenstände erfassen:** Name, Icon, Anzahl, Zustand, Kategorie, Marke, Kaufjahr, Notizen
- **Auto-Speichern:** alle Änderungen werden automatisch im Browser gespeichert

## Speicherung (localStorage)

Die App speichert alle Daten im `localStorage` des Browsers unter dem Schlüssel `wohnungs_inventar_v1`.

- ✅ Kein Server nötig — funktioniert als statische Website
- ✅ Daten bleiben nach Schließen des Browsers erhalten
- ✅ Funktioniert lokal (Datei öffnen) und beim Online-Hosting
- ⚠️ Daten sind browserspezifisch (nicht geräteübergreifend)
- ⚠️ Beim Löschen des Browser-Caches gehen Daten verloren → Export-Funktion empfohlen für kritische Daten

## Hosting

Die App ist eine reine statische Website. Zum Online-Stellen einfach den gesamten Ordner hochladen auf:
- **Netlify** (Drag & Drop)
- **GitHub Pages**
- **Vercel**
- Oder jeden anderen Webspace / Hoster

Kein Backend, keine Datenbank, kein Build-Schritt nötig.

## Browser-Kompatibilität

Alle modernen Browser (Chrome, Firefox, Safari, Edge) werden unterstützt.
Internet Explorer wird nicht unterstützt.
