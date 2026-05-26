---
name: ArcanaPath
colors:
  surface: '#0f141b'
  surface-dim: '#0f141b'
  surface-bright: '#343941'
  surface-container-lowest: '#090f15'
  surface-container-low: '#171c23'
  surface-container: '#1b2027'
  surface-container-high: '#252a32'
  surface-container-highest: '#30353d'
  on-surface: '#dee2ec'
  on-surface-variant: '#c6c6cb'
  inverse-surface: '#dee2ec'
  inverse-on-surface: '#2c3138'
  outline: '#909095'
  outline-variant: '#45474b'
  surface-tint: '#c4c6cf'
  primary: '#c4c6cf'
  on-primary: '#2e3037'
  primary-container: '#0b0e14'
  on-primary-container: '#797b83'
  inverse-primary: '#5c5e66'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#d1bcff'
  on-tertiary: '#37265e'
  tertiary-container: '#130039'
  on-tertiary-container: '#8471af'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e2eb'
  primary-fixed-dim: '#c4c6cf'
  on-primary-fixed: '#191c22'
  on-primary-fixed-variant: '#44474e'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#220e48'
  on-tertiary-fixed-variant: '#4e3d76'
  background: '#0f141b'
  on-background: '#dee2ec'
  surface-variant: '#30353d'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system is rooted in the "Cosmic Cinematic" style—a fusion of high-end luxury and mystical immersion. It rejects the sterile utility of modern SaaS in favor of a spiritual, "lived-in" digital sanctuary. The brand personality is wise, ancient, and technologically transcendent.

The aesthetic utilizes **Glassmorphism** and **Tactile/Skeuomorphic** elements to create a sense of depth and physical presence. Interfaces should feel like looking through a telescope or into a scrying pool. High-contrast celestial highlights against deep, infinite voids guide the user’s focus toward their personal revelations. Every interaction must evoke a sense of ceremony and reverence.

## Colors
This design system operates exclusively in a **dark mode** environment to simulate the quietude of a midnight reading.

- **Deep Midnight Navy (#0B0E14):** The foundational void. Used for the primary background to provide infinite depth.
- **Celestial Gold (#D4AF37):** The "Light of Truth." Used sparingly for focal points, delicate borders, and active states. It should feel metallic and precious.
- **Ethereal Violet (#6D5B97):** The aura. Used for glows, gradients, and soft shadows to signify AI intuition and spiritual energy.
- **Dark Obsidian (#161B22):** The surface color for containers. When combined with 80-90% opacity, it creates a glass-like layering effect.

## Typography
The typographic hierarchy relies on the contrast between the occult elegance of **Playfair Display** and the modern clarity of **Manrope**.

- **Playfair Display** is used for all storytelling elements: headings, card titles, and large atmospheric quotes. It should often be paired with a subtle gold gradient or low-opacity violet outer glow to enhance its "divine" quality.
- **Manrope** handles the functional UI: descriptions, button labels, and metadata. Its clean, geometric nature ensures accessibility and keeps the interface grounded amidst the mystical visuals.
- **Letter Spacing:** Increase tracking on labels to create an airy, premium editorial feel.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain an intentional, cinematic composition, transitioning to a fluid model on mobile.

- **Breathing Room:** Use aggressive whitespace (Section Gaps) to prevent the dark palette from feeling heavy or claustrophobic.
- **The Golden Ratio:** Center-aligned layouts are preferred for primary reading experiences to evoke a sense of balance and focus.
- **Desktop:** 12-column grid with wide 64px margins to create a "framed" stage for the content.
- **Mobile:** 4-column grid with 20px margins. Headlines scale down significantly to preserve the "high-end" aesthetic without overwhelming the small screen.

## Elevation & Depth
Depth in this design system is achieved through light and transparency rather than traditional physical shadows.

- **Tonal Layers:** Surfaces use "Dark Obsidian" with a **Backdrop Blur (20px - 40px)**. This allows the background cosmic textures or violet glows to bleed through, creating a "smoke and mirrors" effect.
- **Ethereal Glows:** Instead of drop shadows, use `box-shadow` with the "Ethereal Violet" color at very low opacity (15-20%) and high blur radius (40px+) to suggest the object is emitting energy.
- **Gold Filigree:** Use 1px borders with a linear gradient (Gold to Transparent) to define the edges of high-priority cards or buttons. This mimics the gold-leaf edges of physical tarot cards.

## Shapes
The shape language is sophisticated and "Soft." Avoid fully rounded pill shapes which feel too "tech-startup."

- **Cards & Containers:** Use a 0.25rem to 0.5rem radius. This creates a sharp, architectural feel that mirrors the geometry of a tarot card.
- **Interactive Elements:** Buttons and inputs follow the same subtle rounding.
- **Celestial Orbs:** Use perfect circles for decorative background elements or profile avatars, often paired with heavy blurs to create a "soft light" effect.

## Components

- **Tarot Cards:** The centerpiece component. High aspect ratio (2:3). They feature a 1px Gold border and a subtle "shimmer" hover effect using a moving radial gradient.
- **Primary Buttons:** Solid Celestial Gold background with Deep Midnight Navy text. No shadows; instead, use a 4px Violet outer glow on hover to signify "activation."
- **Ghost Buttons:** Transparent background with a Gold 1px border. Used for secondary actions like "View Journal."
- **Input Fields:** Bottom-border only or very low-opacity Obsidian fill. The label should be in the "Label-MD" style, floating above the line in Gold when active.
- **Glass Chips:** Used for "Energy Tags" or "Arcana Categories." Semi-transparent obsidian with a violet stroke.
- **The "Oracle" List:** For reading history. Items are separated by a subtle 1px gradient line (Transparent -> Gold -> Transparent) rather than a solid divider.
- **Loading State:** A pulsing "Seed of Life" or celestial mandala SVG that uses the Ethereal Violet glow.