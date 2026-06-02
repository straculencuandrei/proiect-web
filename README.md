# Proiect de Semestru: Portofoliu Web Dinamic (GitHub API Integration)

Acesta este un portofoliu web personal dinamic, minimalist și interactiv, construit pentru proiectul de semestru. Designul este inspirat din estetica terminal/retro (monospaced), cu suport pentru teme Light/Dark, adaptat special pentru a integra direct proiectele de pe GitHub.

## 🚀 Tehnologii Utilizate

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3 (Flexbox, Grid, custom styling)
- **Integrare API**: GitHub REST API (asincron, prin Fetch API client-side)
- **Stocare Locală**: LocalStorage (pentru persistența temei alese de utilizator și starea aplicației)
- **Fonturi**: IBM Plex Mono (monospaced)
- **Aseturi**: Imagine de profil integrată (`neco_arc.png`), CV în format PDF cu modal de previzualizare inline.

---

## 🛠️ Cerințe Implementate (Bifate 100%)

### 1. Arhitectură și Conținutul Paginii (Nota 5-7)
- **Secțiune Profil**: Zonă cu numele studentului (**Straculencu Andrei**), imaginea de profil (`neco_arc.png`), rol/tehnologii preferate și o descriere profesională.
- **Secțiune Portofoliu**: Zonă dinamică în care sunt afișate proiectele direct din contul de GitHub al utilizatorului.
- **Experiență de Muncă**: Secțiune de experiență integrată în sidebar sub formă de widget expandabil.
- **Educație**: Detalii despre studii (Universitatea Lucian Blaga din Sibiu, profil inginerie) și studii liceale.
- **Personalizare**: Design unic retro-futurist, cu efecte de glitch la hover pe text și animații personalizate.

### 2. Integrarea cu GitHub API & Cardurile de Proiect (Nota 5-7)
- Request-ul asincron se realizează către `https://api.github.com/users/straculencuandrei/repos`.
- **Sistem Fallback / Backup (Fără proiecte suficiente)**: Dacă API-ul eșuează (ex. limitare rate limit sau lipsă internet) sau contul are sub 5 repository-uri publice, sistemul afișează un mesaj informativ și încarcă automat o listă robustă de proiecte salvate local (offline), garantând afișarea a cel puțin 5 carduri.
- **Informații minime per Card**: Nume repository, Descriere (cu fallback automat la text implicit dacă descrierea lipsește pe GitHub), Limbaj principal de programare, numărul de stele (★), numărul de fork-uri (⑂) și link extern direct către codul sursă.

### 3. Filtrare și Sortare Client-side (Nota 8-9)
- **Excluderea Fork-urilor**: Sunt afișate exclusiv proiectele proprii (`fork === false`).
- **Ordonare Automată**: Opțiune de sortare după data ultimei actualizări (`updated_at`) sau după numărul de stele.
- **Filtrare în Timp Real**: Casetă de căutare (Search Input) și selector pentru filtrarea automată a proiectelor după limbajul de programare, fără reîncărcarea paginii.

### 4. Experiența Utilizatorului (UX/UI) (Nota 8-9)
- **Stare de Loading**: Indicator vizual cu animație blink în timpul efectuării request-ului către API.
- **Tratarea Erorilor**: Afișarea unui mesaj de eroare prietenos în cazul în care API-ul nu funcționează.

### 5. Cerințe Avansate / Paginare (Nota 10)
- **Paginare & „Load More”**: Dacă lista de proiecte (filtrate) depășește limita de 6 carduri, apare butonul **LOAD MORE PROJECTS** care permite încărcarea treptată a proiectelor pentru a nu supraîncărca interfața.

---

## 💻 Instalare și Rulare Locală

Proiectul nu necesită compilare sau dependințe complexe, fiind un site web static cu JavaScript nativ.

1. **Clonați repository-ul**:
   ```bash
   git clone https://github.com/straculencuandrei/proiect-web.git
   cd proiect-web
   ```

2. **Rularea locală**:
   Deschideți fișierul `index.html` direct în orice browser web modern:
   - Pe Windows/PowerShell:
     ```powershell
     Start-Process "index.html"
     ```
   - Pe macOS/Linux:
     ```bash
     open index.html
     ```

---

## 🎨 Structura Fișierelor

```
├── index.html                  - Pagina principală a portofoliului
├── style.css                   - Foaia de stiluri (variabile, teme Light/Dark, responsive grid, animații)
├── script.js                   - Logica interactivă (GitHub API fetch, filtrare/sortare, modal PDF, tema toggle)
├── Straculencu_Andrei_CV.pdf   - Documentul PDF al CV-ului
├── neco_arc.png                - Fotografia de profil
├── favicon.png                 - Iconița site-ului
└── README.md                   - Documentația tehnică a proiectului
```
