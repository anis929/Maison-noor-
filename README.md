# Maison Noor

Site web officiel de Maison Noor — lunetterie de luxe française.  
Direction artistique **Heritage Future** : artisanat ancestral (corne de buffle) rencontre esthétique rétro-futuriste premium.

---

## Stack technique

| Outil | Usage |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| TypeScript | Typage strict |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Transitions de pages |
| GSAP + ScrollTrigger | Scrollytelling (page Atelier) |
| CSS 3D Transforms | Viewer produit interactif |
| next/font | Self-hosted Google Fonts |
| next/image | Optimisation AVIF/WebP |

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/anis929/Maison-noor-.git
cd Maison-noor-

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev        # Serveur de développement (port 3000)
npm run build      # Build de production
npm run start      # Démarrer le build production
npm run type-check # Vérification TypeScript sans compilation
npm run lint       # ESLint
```

---

## Structure du projet

```
app/
  layout.tsx            # Layout racine (fonts, nav, footer, curseur)
  page.tsx              # Home — Le seuil
  globals.css           # Variables CSS + styles de base
  atelier/page.tsx      # Service Couture — scrollytelling sticky
  collection/
    page.tsx            # Listing produits avec filtres
    [slug]/page.tsx     # Fiche produit + viewer 3D
  maison/page.tsx       # À propos, histoire, équipe
  rendez-vous/page.tsx  # Formulaire multi-étapes
  contact/page.tsx      # Formulaire contact simple
  legal/page.tsx        # Mentions légales
  sitemap.ts            # Sitemap XML dynamique
  robots.ts             # robots.txt

components/
  ui/
    Logo.tsx            # Wordmark — 3 tailles
    ChromeButton.tsx    # Bouton chrome/filled/ghost
    DisplayHeading.tsx  # Titre monumental responsive
    MonoLabel.tsx       # Label mono technico-luxe
    HaloBackground.tsx  # Halo orange radial
    MacroImage.tsx      # Image avec grain overlay
    CustomCursor.tsx    # Curseur custom (desktop uniquement)
    PageTransition.tsx  # Fade noir entre routes
    ScrollReveal.tsx    # Apparition au scroll (Intersection Observer)
  navigation/
    Navigation.tsx      # Nav sticky + drawer mobile
  home/
    HeroSection.tsx     # Hero avec animation GSAP
    TwoPathsSection.tsx # Split screen 50/50
    ManifestoSection.tsx # Citation display large
  atelier/
    StickyRitual.tsx    # 5 étapes GSAP ScrollTrigger sticky
    MaterialSection.tsx # Section corne de buffle
    PiecesGallery.tsx   # Grille asymétrique pièces uniques
  collection/
    ProductCard.tsx     # Carte produit hover image switch
    ProductFilters.tsx  # Filtres forme/matière/genre
    Product3DViewer.tsx # Viewer CSS 3D drag-to-rotate
  footer/
    Footer.tsx          # Footer complet avec newsletter

data/
  products.ts           # 8 produits typés + helpers

lib/
  utils.ts              # cn(), formatPrice(), slugify()

types/
  index.ts              # Types TypeScript partagés

public/
  placeholders/         # Images temporaires (remplacer par les vraies)
```

---

## Ajouter les vraies photos produit

1. Placer les photos dans `/public/products/[slug]/` au format WebP ou AVIF
2. Nommer : `01.jpg`, `02.jpg`, etc.
3. Mettre à jour le tableau `images` dans `/data/products.ts`
4. Remplacer les `<div>` placeholder dans `ProductCard` et `Product3DViewer` par `<Image>` Next.js

---

## Ajouter un viewer 3D réel (Three.js / R3F)

Le composant `Product3DViewer` utilise actuellement des CSS 3D transforms.  
Pour ajouter un vrai modèle 3D :

1. Placer le fichier `.glb` dans `/public/models/[slug].glb`
2. Installer `@react-three/fiber` et `@react-three/drei` (déjà dans `package.json`)
3. Remplacer le contenu de `Product3DViewer.tsx` par un `<Canvas>` R3F avec `<useGLTF>`
4. Importer via `dynamic(..., { ssr: false })` (déjà configuré dans `[slug]/page.tsx`)

---

## Déploiement (Vercel)

```bash
# Pousser sur main déclenche un déploiement automatique sur Vercel
git push origin main
```

Variables d'environnement à configurer sur Vercel si nécessaire :

| Clé | Usage |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL de production (ex: `https://maisonnoor.com`) |

---

## Palette de couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--noir-profond` | `#0A0A0A` | Fond principal |
| `--noir-doux` | `#141414` | Fond secondaire, cards |
| `--corne-fonce` | `#2B1810` | Brun corne profond |
| `--corne-medium` | `#6B4423` | Brun corne chaud |
| `--corne-clair` | `#A67C52` | Brun corne lumineux |
| `--chrome` | `#C8C8CC` | Accents froids |
| `--orange-brule` | `#D4541C` | Accent vivant, halos |
| `--creme-os` | `#E8DCC4` | Texte principal |
| `--creme-pale` | `#F5EFE0` | Fond clair (rare) |

---

## Accessibilité

- Navigation clavier complète (focus visible sur tous les éléments interactifs)
- Attributs `aria-label` sur les éléments ambigus
- `prefers-reduced-motion` : toutes les animations sont désactivées via CSS
- Contrastes WCAG AA respectés sur texte/fond
- Balises sémantiques (`<nav>`, `<main>`, `<footer>`, `<article>`)

---

*Maison Noor — Est. 2024, Paris*
