# Quick Start Guide - Design System

## 🚀 Getting Started

The design system is fully implemented and ready to use. Follow these guidelines when creating or modifying components.

---

## 📦 Import Essentials

Every new component should import these three core systems:

```typescript
// 1. Animations (always needed for motion components)
import { containerFade, itemFadeUp, itemFadeInDown, itemSlideRight } from '@/lib/animations'

// 2. Icons (for any visual icons needed)
import { CheckIcon, LoadingIcon, FacebookIcon, CarIcon } from './Icons'

// 3. Motion (for animations)
import { motion } from 'framer-motion'
```

---

## 🎨 Common Component Patterns

### Pattern 1: Section with Grid Layout
```tsx
export default function MySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Section Title
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Subtitle or description
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemFadeUp}
              className="p-8 bg-white rounded-xl border border-neutral-200 hover:shadow-lg transition-all"
            >
              {/* Card content */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

### Pattern 2: Form with Validation
```tsx
export default function MyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // API call here
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900">Success</h3>
            <p className="text-sm text-green-800">Your message was sent successfully!</p>
          </div>
        </div>
      )}

      {/* Input Fields */}
      <input
        type="text"
        placeholder="Your name"
        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
        disabled={isLoading}
      />

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          isLoading
            ? 'bg-neutral-400 cursor-not-allowed'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        }`}
      >
        {isLoading ? (
          <>
            <LoadingIcon className="w-4 h-4" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </motion.button>
    </form>
  )
}
```

### Pattern 3: Card with Icon
```tsx
<motion.div
  variants={itemFadeUp}
  whileHover={{ y: -8 }}
  className="p-8 bg-white rounded-xl border border-neutral-200 transition-all"
>
  {/* Icon */}
  <motion.div className="w-12 h-12 mb-4 text-neutral-900">
    <CarIcon />
  </motion.div>

  {/* Content */}
  <h3 className="text-lg font-bold text-neutral-900 mb-2">
    Card Title
  </h3>
  <p className="text-neutral-600 mb-4">
    Card description goes here
  </p>

  {/* Link */}
  <motion.a
    href="#"
    whileHover={{ x: 4 }}
    className="inline-flex items-center text-neutral-900 font-semibold hover:text-neutral-600"
  >
    Learn More
    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </motion.a>
</motion.div>
```

---

## 🎨 Color Usage

### Text Colors
```tsx
// Dark text (default)
className="text-neutral-900"

// Secondary text
className="text-neutral-600"

// Tertiary text (light)
className="text-neutral-400"

// On dark backgrounds
className="text-white"
className="text-neutral-100"
```

### Background Colors
```tsx
// Light background
className="bg-neutral-50"

// White (default)
className="bg-white"

// Dark background
className="bg-neutral-900"

// Card borders
className="border border-neutral-200"
```

### Semantic Colors
```tsx
// Success
className="bg-green-50 text-green-900"

// Error
className="bg-red-50 text-red-900"

// Warning
className="bg-amber-50 text-amber-900"

// Info
className="bg-blue-50 text-blue-900"
```

---

## 📏 Spacing Reference

```tsx
// Section padding
className="py-20"  // 160px vertical

// Card padding
className="p-8"    // 32px all sides
className="p-6"    // 24px all sides

// Gap between grid items
className="gap-8"  // 32px gap

// Margin between elements
className="mb-4"   // 16px bottom
className="mt-6"   // 24px top

// Section spacing
className="mb-16"  // 64px bottom (between sections)
```

---

## 🎬 Animation Usage

### Basic Fade In with Scroll
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  Content fades in when scrolled into view
</motion.div>
```

### Container with Staggered Children
```tsx
<motion.div
  variants={containerFade}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemFadeUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Click me
</motion.button>

<motion.div
  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
>
  Hover me
</motion.div>
```

### Loading Animation
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
>
  <LoadingIcon />
</motion.div>
```

---

## 🎯 Button Styles

### Primary Dark Button
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-semibold"
>
  Button Text
</motion.button>
```

### Secondary Outline Button
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="px-8 py-3 border-2 border-neutral-900 text-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors font-semibold"
>
  Button Text
</motion.button>
```

### Ghost Button (Text Only)
```tsx
<motion.button
  whileHover={{ x: 4 }}
  className="text-neutral-900 font-semibold hover:text-neutral-600 transition-colors"
>
  Button Text →
</motion.button>
```

### Button with Loading State
```tsx
<motion.button
  disabled={isLoading}
  className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
    isLoading
      ? 'bg-neutral-400 cursor-not-allowed text-white'
      : 'bg-neutral-900 text-white hover:bg-neutral-800'
  }`}
>
  {isLoading ? (
    <>
      <LoadingIcon className="w-4 h-4" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</motion.button>
```

---

## 📱 Responsive Grid

```tsx
{/* Single column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

{/* Hidden on mobile, visible on tablet+ */}
<div className="hidden md:block">

{/* Full width on mobile, 50% on tablet, 33% on desktop */}
<div className="w-full md:w-1/2 lg:w-1/3">

{/* Text size scaling */}
<h1 className="text-2xl md:text-4xl lg:text-5xl">
```

---

## ⚠️ Common Mistakes to Avoid

❌ **Don't use old color names**:
```tsx
// WRONG
className="bg-primary text-secondary"

// RIGHT
className="bg-neutral-900 text-neutral-600"
```

❌ **Don't define animations inline**:
```tsx
// WRONG
const myVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

// RIGHT
import { containerFade } from '@/lib/animations'
```

❌ **Don't use emoji**:
```tsx
// WRONG
<div className="text-3xl">🚗</div>

// RIGHT
import { CarIcon } from './Icons'
<CarIcon className="w-10 h-10" />
```

❌ **Don't forget viewport={{ once: true }}**:
```tsx
// WRONG
whileInView={{ opacity: 1 }}

// RIGHT
whileInView={{ opacity: 1 }}
viewport={{ once: true }}  // Triggers animation only once
```

❌ **Don't use random padding values**:
```tsx
// WRONG
className="p-11 pl-13"

// RIGHT
className="p-8 pl-8"  // Use 8px increments
```

---

## ✅ Quick Checklist Before Submitting

- [ ] No emoji characters used
- [ ] Colors use neutral-X or semantic color classes
- [ ] Spacing uses 8px increments (px-4, py-6, gap-8, etc.)
- [ ] Animations use centralized variants (containerFade, itemFadeUp)
- [ ] Icons are imported from `./Icons` (not emoji)
- [ ] Mobile responsive (tested at 320px, 768px, 1440px)
- [ ] Hover states implemented with `whileHover`
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors or warnings
- [ ] Component matches design system patterns

---

## 📚 More Information

- **Full Design System**: See `DESIGN_SYSTEM.md`
- **Refactoring Summary**: See `REFACTORING_SUMMARY.md`
- **Design Tokens**: See `lib/designTokens.ts`
- **Animation Reference**: See `lib/animations.ts`
- **Icon Library**: See `components/Icons.tsx`

---

## 🎯 Need Help?

1. **Color question?** → Check `DESIGN_SYSTEM.md` Color Palette section
2. **Animation question?** → See `lib/animations.ts` exported variants
3. **Icon question?** → See `components/Icons.tsx` for available icons
4. **Pattern question?** → Review similar components (Services.tsx, Experiences.tsx)
5. **Responsive question?** → Check `DESIGN_SYSTEM.md` Responsive Design section

---

**Happy coding!** 🚀
