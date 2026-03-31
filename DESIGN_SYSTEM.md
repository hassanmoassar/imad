# Morocco Voyages - Design System Documentation

## Overview

This document outlines the unified design system for the Morocco Voyages application. All components should follow these guidelines for consistency, maintainability, and professional appearance.

## Design Philosophy

- **Modern & Professional**: Clean, contemporary aesthetic suitable for a luxury travel brand
- **No Emojis**: All visual elements use professional SVG icons
- **Consistent Spacing**: 8px base unit system throughout
- **Performance First**: Optimized animations and transitions
- **Accessible**: WCAG compliance and inclusive design

## Color Palette

### Primary Colors (Neutral Scale)

The neutral palette is used for text, backgrounds, and borders:

```
neutral-0    #FFFFFF (White)
neutral-50   #F9FAFB (Off-white)
neutral-100  #F3F4F6
neutral-200  #E5E7EB
neutral-300  #D1D5DB
neutral-400  #9CA3AF
neutral-500  #6B7280
neutral-600  #4B5563
neutral-700  #374151
neutral-800  #1F2937
neutral-900  #111827 (Near-black)
```

### Semantic Colors

```
success: #10B981 (Green)
warning: #F59E0B (Amber)
error:   #EF4444 (Red)
info:    #3B82F6 (Blue)
```

## Typography

### Headings

| Level | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| h1 | 3.75rem (60px) | 700 | 1.2 | Page titles, hero sections |
| h2 | 3rem (48px) | 700 | 1.25 | Section titles |
| h3 | 1.875rem (30px) | 700 | 1.33 | Subsection titles |
| h4 | 1.5rem (24px) | 600 | 1.4 | Card titles |
| h5 | 1.25rem (20px) | 600 | 1.5 | Smaller headings |
| h6 | 1rem (16px) | 600 | 1.5 | Minor headings |

### Body Text

| Level | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| lg | 1.125rem (18px) | 400 | 1.75 | Large body text |
| base | 1rem (16px) | 400 | 1.5 | Default body text |
| sm | 0.875rem (14px) | 400 | 1.43 | Secondary text |
| xs | 0.75rem (12px) | 400 | 1.5 | Captions, metadata |

**Font Family**: Inter (sans-serif) - Professional and highly readable

## Spacing System

All spacing uses an 8px base unit:

```
0    0px
1    8px
2    16px
3    24px
4    32px
5    40px
6    48px
8    64px
10   80px
12   96px
16   128px
20   160px
24   192px
32   256px
```

**Usage**:
- Padding: `p-4` (32px), `py-6` (48px vertical)
- Margin: `m-4`, `mb-6`, `mt-8`
- Gap: `gap-4`, `gap-8`
- Min-height for sections: `py-20` (160px)

## Border Radius

```
none      0px
sm        4px
md        8px
lg        12px
xl        16px
2xl       20px
3xl       24px
full      9999px (circles)
```

**Default**: Use `rounded-lg` for cards, buttons; `rounded-xl` for larger components

## Shadows

```
none      No shadow
sm        0 1px 2px 0 rgba(0,0,0,0.05)
md        0 4px 6px -1px rgba(0,0,0,0.1)
lg        0 10px 15px -3px rgba(0,0,0,0.1)
xl        0 20px 25px -5px rgba(0,0,0,0.1)
2xl       0 25px 50px -12px rgba(0,0,0,0.25)
```

**Usage**:
- Card hover: `hover:shadow-lg`
- Navigation: `shadow-md`
- Modals: `shadow-2xl`

## Z-Index Architecture

```
auto        (default/0)
drop        10
hide        -10
dropdown    20
sticky      30
fixed       40
modal       50
popover     60
tooltip     70
```

**Usage**: Import from `lib/designTokens.ts` to avoid conflicts

## Animations & Transitions

### Duration Constants

```
fast      150ms   (quick interactions)
normal    300ms   (standard transitions)
slow      500ms   (entrance animations)
slower    700ms   (page transitions)
```

### Common Animation Patterns

All animations are centralized in `lib/animations.ts`:

```typescript
// Container animation with staggered children
containerFade

// Item entrance animations
itemFadeUp        // Fade + slide up
itemFadeInDown    // Fade + slide down
itemSlideRight    // Slide right only

// Page transitions
pageEnter         // Full page entrance

// Utility animations
spinAnimation     // 360° rotation (1s infinite)
pulseAnimation    // Opacity pulse (2s infinite)
```

**Usage**:
```tsx
import { containerFade, itemFadeUp } from '@/lib/animations'

<motion.div variants={containerFade} initial="hidden" whileInView="visible">
  <motion.div variants={itemFadeUp}>Content</motion.div>
</motion.div>
```

## Icon Library

All icons are stored in `components/Icons.tsx`. Never use emoji characters.

### Available Icons

**Service Icons** (40px):
- `CarIcon` - Premium transfers
- `DesertIcon` - Desert excursions
- `PalaceIcon` - Cultural tours

**Contact Icons**:
- `LocationIcon` - Address
- `PhoneIcon` - Phone number
- `EmailIcon` - Email address
- `ClockIcon` - Hours

**Social Icons**:
- `FacebookIcon` - Facebook link
- `InstagramIcon` - Instagram link
- `TwitterIcon` - Twitter link
- `LinkedinIcon` - LinkedIn link

**Utility Icons**:
- `CheckIcon` - Success state
- `LoadingIcon` - Loading spinner
- `MenuIcon` - Mobile navigation

**Usage**:
```tsx
import { CarIcon, CheckIcon } from './Icons'

<CarIcon className="w-10 h-10 text-neutral-900" />
```

## Component Structure

### Standard Card Pattern

```tsx
<motion.div
  variants={itemFadeUp}
  whileHover={{ y: -8 }}
  className="p-8 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all duration-300"
>
  {/* Content */}
</motion.div>
```

### Section Header Pattern

```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="text-center mb-16"
>
  <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
    Title
  </h2>
  <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
    Subtitle
  </p>
</motion.div>
```

### Form Input Pattern

```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
  disabled={isLoading}
/>
```

### Button Patterns

**Primary (Dark)**:
```tsx
<button className="px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
  Button
</button>
```

**Secondary (Outline)**:
```tsx
<button className="px-8 py-3 border-2 border-neutral-900 text-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors">
  Button
</button>
```

**Ghost (Text Only)**:
```tsx
<button className="text-neutral-900 font-semibold hover:text-neutral-600 transition-colors">
  Button
</button>
```

## Responsive Design

Use Tailwind CSS breakpoints consistently:

```
sm   640px    (tablets)
md   768px    (tablets & small laptops)
lg   1024px   (laptops)
xl   1280px   (large screens)
2xl  1536px   (extra large screens)
```

**Example**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Single column → 2 columns on md → 3 columns on lg */}
</div>
```

## Best Practices

### DO ✅

- Import animations from `lib/animations.ts`
- Use design tokens from `lib/designTokens.ts` for colors/spacing
- Use professional SVG icons from `components/Icons.tsx`
- Test on mobile (320px), tablet (768px), and desktop (1440px)
- Use `whileInView` for entrance animations
- Apply consistent padding: `p-8` (card), `p-6` (section content)
- Use hover effects with `whileHover={{ scale: 1.02 }}`
- Wrap text in `<motion.p>` for fade-in effects

### DON'T ❌

- Don't use emoji characters anywhere
- Don't define animations inline (use `lib/animations.ts`)
- Don't use old color names (primary/secondary/accent)
- Don't apply random padding values
- Don't forget viewport={{ once: true }} on scroll animations
- Don't create infinite animations on scroll (use repeat: Infinity)
- Don't forget accessibility (alt text, aria labels, keyboard navigation)
- Don't use serif fonts for body text

## Migration Checklist

When refactoring existing components:

- [ ] Replace all emoji with SVG icons
- [ ] Import animations from `lib/animations.ts`
- [ ] Replace color classes with neutral-X scale
- [ ] Update spacing to 8px units
- [ ] Add `whileInView` to entrance animations
- [ ] Ensure mobile responsiveness
- [ ] Test dark mode (if applicable)
- [ ] Verify form accessibility
- [ ] Check animation performance
- [ ] Update TypeScript types if needed

## File Structure

```
components/
  ├── Icons.tsx              (All 14+ icons)
  ├── Header.tsx             (Navigation)
  ├── Hero.tsx               (Landing section)
  ├── Services.tsx           (Service cards)
  ├── Experiences.tsx        (Experience cards)
  ├── Features.tsx           (Feature list)
  ├── Contact.tsx            (Contact form)
  ├── Footer.tsx             (Footer with social icons)
  └── ...

lib/
  ├── animations.ts          (Framer Motion variants)
  └── designTokens.ts        (Colors, spacing, shadows, z-index, transitions)

app/
  ├── globals.css            (Global Tailwind styles)
  ├── layout.tsx             (Root layout)
  └── ...
```

## Contact & Questions

For design system updates or questions, refer to `lib/designTokens.ts` and `lib/animations.ts` for implementation examples.
