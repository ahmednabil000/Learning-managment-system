# 🎨 LMS Design System Reference

This document provides a quick reference for using the custom color palette and typography system in your LMS application.

## 🟣 Color Palette

### How to Use Colors in Tailwind

In Tailwind v4, you can use your custom colors directly with standard Tailwind utilities:

```jsx
// Background colors
<div className="bg-primary">       // Deep Purple (#5B2D8B)
<div className="bg-primary-2">     // Purple 600 (#7C3AED)
<div className="bg-secondary">     // Blue 600 (#2563EB)
<div className="bg-accent">        // Pink 500 (#EC4899)
<div className="bg-background">    // Gray 50 (#F8FAFC)
<div className="bg-surface">       // White (#FFFFFF)

// Text colors
<p className="text-primary">       // Deep Purple text
<p className="text-secondary">     // Blue text
<p className="text-accent">        // Pink text
<p className="text-text-main">     // Slate 900 - Primary text
<p className="text-text-muted">    // Slate 500 - Secondary text

// Semantic colors
<div className="bg-success">       // Green (#22C55E)
<div className="bg-warning">       // Amber (#F59E0B)
<div className="bg-error">         // Red (#EF4444)

// Border colors
<div className="border border-border">  // Gray 200 border
<div className="border-primary">        // Purple border
```

### Color Reference Table

| Color Name     | Hex Code  | Usage                                       |
| -------------- | --------- | ------------------------------------------- |
| **primary**    | `#5B2D8B` | Main brand color, primary buttons, headers  |
| **primary-2**  | `#7C3AED` | Lighter purple variant, hover states        |
| **secondary**  | `#2563EB` | Secondary actions, links                    |
| **accent**     | `#EC4899` | Call-to-action highlights, important badges |
| **background** | `#F8FAFC` | Main page background                        |
| **surface**    | `#FFFFFF` | Cards, panels, modals                       |
| **border**     | `#E5E7EB` | Borders, dividers                           |
| **text-main**  | `#0F172A` | Primary text content                        |
| **text-muted** | `#64748B` | Secondary text, captions                    |
| **success**    | `#22C55E` | Success messages, completed states          |
| **warning**    | `#F59E0B` | Warning messages, pending states            |
| **error**      | `#EF4444` | Error messages, destructive actions         |

## ✍️ Typography System

### Using Typography Classes

You can use either the custom utility classes or Tailwind's built-in utilities:

#### Option 1: Custom Typography Classes

```jsx
<h1 className="heading-xl">Extra Large Heading</h1>      // 32px, semibold
<h2 className="heading-l">Large Heading</h2>            // 24px, semibold
<h3 className="heading-m">Medium Heading</h3>           // 20px, medium
<p className="body">Regular body text</p>               // 16px, normal
<p className="body-sm">Small body text</p>              // 14px, normal
<span className="text-small">Small text</span>          // 12px, normal
```

#### Option 2: Tailwind Utilities

```jsx
// Font sizes
<h1 className="text-[32px] font-semibold">Heading XL</h1>
<h2 className="text-[24px] font-semibold">Heading L</h2>
<h3 className="text-[20px] font-medium">Heading M</h3>
<p className="text-base">Body text (16px)</p>
<p className="text-sm">Small text (14px)</p>
<span className="text-xs">Extra small (12px)</span>

// Font weights
<p className="font-normal">Normal (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

### Typography Scale

| Class        | Size | Weight         | Usage                            |
| ------------ | ---- | -------------- | -------------------------------- |
| `heading-xl` | 32px | Semibold (600) | Page titles, hero headings       |
| `heading-l`  | 24px | Semibold (600) | Section headings                 |
| `heading-m`  | 20px | Medium (500)   | Subsection headings, card titles |
| `body`       | 16px | Normal (400)   | Main content, paragraphs         |
| `body-sm`    | 14px | Normal (400)   | Secondary content, descriptions  |
| `text-small` | 12px | Normal (400)   | Captions, labels, metadata       |

## 🎯 Common Component Examples

### Primary Button

```jsx
<button className="bg-primary hover:bg-primary-2 text-white font-medium px-6 py-3 rounded-lg transition-colors">
  Enroll Now
</button>
```

### Secondary Button

```jsx
<button className="bg-secondary hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
  Learn More
</button>
```

### Accent Button (CTA)

```jsx
<button className="bg-accent hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all">
  Start Learning
</button>
```

### Card Component

```jsx
<div className="bg-surface border border-border rounded-xl p-6 shadow-md">
  <h3 className="heading-m text-primary mb-2">Course Title</h3>
  <p className="body-sm text-text-muted">Course description goes here...</p>
</div>
```

### Alert Messages

```jsx
// Success
<div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg">
  <p className="body-sm font-medium">Successfully enrolled!</p>
</div>

// Warning
<div className="bg-warning/10 border border-warning text-warning px-4 py-3 rounded-lg">
  <p className="body-sm font-medium">Payment pending...</p>
</div>

// Error
<div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
  <p className="body-sm font-medium">Something went wrong!</p>
</div>
```

### Navigation Bar

```jsx
<nav className="bg-surface border-b border-border px-6 py-4">
  <div className="flex items-center justify-between">
    <h1 className="heading-l text-primary">LMS Academy</h1>
    <div className="flex gap-4">
      <a href="#" className="body text-text-main hover:text-primary">
        Courses
      </a>
      <a href="#" className="body text-text-main hover:text-primary">
        My Learning
      </a>
    </div>
  </div>
</nav>
```

## 🔧 CSS Variables Reference

If you need to use colors or typography in custom CSS:

```css
/* Colors */
background-color: var(--color-primary);
color: var(--color-text-main);
border-color: var(--color-border);

/* Typography */
font-family: var(--font-family-sans);
font-size: var(--font-size-heading-xl);
font-weight: var(--font-weight-semibold);
line-height: var(--line-height-normal);

/* Spacing */
padding: var(--spacing-md);
margin: var(--spacing-lg);

/* Border Radius */
border-radius: var(--radius-lg);

/* Shadows */
box-shadow: var(--shadow-md);
```

## 📱 Responsive Design Tips

Use Tailwind's responsive prefixes with your custom colors:

```jsx
<div className="bg-surface md:bg-background lg:bg-primary">
  Responsive background
</div>

<h1 className="heading-m md:heading-l lg:heading-xl">
  Responsive heading
</h1>
```

## 🎨 Color Combinations

### Recommended Pairings

1. **Primary Action**: `bg-primary` + `text-white`
2. **Secondary Action**: `bg-secondary` + `text-white`
3. **Accent/CTA**: `bg-accent` + `text-white`
4. **Card/Surface**: `bg-surface` + `text-text-main` + `border-border`
5. **Muted Content**: `bg-background` + `text-text-muted`

---

**Font**: Inter (automatically loaded from Google Fonts)

**Last Updated**: December 2025
