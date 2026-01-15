# GemRails Color Guide

A comprehensive color reference for brand designers working on the GemRails Merchant Portal.

---

## Brand Identity

GemRails uses an **Emerald/Teal** color theme on a dark background, creating a modern fintech aesthetic that conveys trust, growth, and professionalism.

---

## Core Color Palette

### Primary Colors

| Role | Hex Code | Usage |
|------|----------|-------|
| **Primary** | `#10b981` | Main brand color, CTAs, active states, success indicators |
| **Secondary** | `#14b8a6` | Supporting accent, gradients |
| **Accent** | `#0d9488` | Tertiary accent, hover states |

### Background Colors

| Role | Hex Code | Usage |
|------|----------|-------|
| **Background** | `#0a0d10` | Main app background |
| **Card** | `#111419` | Card surfaces, popovers |
| **Muted** | `#1a1f26` | Subtle backgrounds, scrollbar tracks |

### Text Colors

| Role | Hex Code | Usage |
|------|----------|-------|
| **Foreground** | `#f8f9fa` | Primary text, headings |
| **Muted Foreground** | `#9ca3af` | Secondary text, descriptions |
| **Primary Foreground** | `#ffffff` | Text on primary buttons |

### Border & Input Colors

| Role | Hex Code | Usage |
|------|----------|-------|
| **Border** | `#1f2937` | Card borders, dividers |
| **Input** | `#1f2937` | Form input borders |
| **Ring** | `#10b981` | Focus rings |

### Destructive

| Role | Hex Code | Usage |
|------|----------|-------|
| **Destructive** | `#ef4444` | Error states, delete actions, logout |

---

## Gradient Specifications

### Brand Gradient (Logo & Avatars)
```css
background: linear-gradient(to bottom right, #10b981, #14b8a6);
/* Tailwind: bg-gradient-to-br from-emerald-500 to-teal-600 */
```

### Primary Button Gradient
```css
background: linear-gradient(to right, #10b981, #14b8a6);
/* Tailwind: bg-gradient-to-r from-emerald-500 to-teal-500 */
```

### Accent Card Gradient
```css
background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1));
/* Tailwind: bg-gradient-to-br from-emerald-500/10 to-teal-500/10 */
```

---

## Status Colors

Used for payment states, merchant verification, and system alerts.

### Payment Status

| Status | Background | Text | Hex Values |
|--------|------------|------|------------|
| **Initiated** | `bg-blue-600/90` | `text-blue-100` | Blue-600: `#2563eb` |
| **Awaiting Crypto** | `bg-amber-600/90` | `text-amber-100` | Amber-600: `#d97706` |
| **Crypto Received** | `bg-purple-600/90` | `text-purple-100` | Purple-600: `#9333ea` |
| **Processing** | `bg-indigo-600/90` | `text-indigo-100` | Indigo-600: `#4f46e5` |
| **Settled** | `bg-emerald-600/90` | `text-emerald-100` | Emerald-600: `#059669` |
| **Failed** | `bg-red-600/90` | `text-red-100` | Red-600: `#dc2626` |

### Merchant Status

| Status | Background | Text |
|--------|------------|------|
| **Pending** | `bg-amber-600/90` | `text-amber-100` |
| **Verified** | `bg-green-600/90` | `text-green-100` |
| **Suspended** | `bg-red-600/90` | `text-red-100` |
| **Rejected** | `bg-red-600/90` | `text-red-100` |

### Alert Types

| Type | Background | Border | Icon/Title |
|------|------------|--------|------------|
| **Success** | `bg-emerald-500/10` | `border-emerald-500/30` | `text-emerald-400` |
| **Error** | `bg-red-500/10` | `border-red-500/30` | `text-red-400` |
| **Warning** | `bg-amber-500/10` | `border-amber-500/30` | `text-amber-400` |
| **Info** | `bg-blue-500/10` | `border-blue-500/30` | `text-blue-400` |

---

## UI Component Colors

### Buttons

| Type | Style |
|------|-------|
| **Primary** | Gradient `emerald-500 → teal-500`, white text, emerald shadow on hover |
| **Outline** | Transparent bg, `gray-700` border, hover: `emerald-500` border |
| **Secondary** | `emerald-500/10` bg, `emerald-400` text, `emerald-500/30` border |
| **Destructive** | `red-500/10` bg, `red-400` text, `red-500/30` border |

### Form Inputs

| State | Background | Border |
|-------|------------|--------|
| **Default** | `gray-800/60` | `gray-700` |
| **Focus** | `gray-800/60` | `emerald-500` + ring |
| **Error** | `red-500/10` | `red-500/50` |

### Navigation

| State | Text Color | Background |
|-------|------------|------------|
| **Active** | `emerald-400` | `emerald-500/10` with `emerald-500/20` border |
| **Inactive** | `gray-400` | Transparent |
| **Hover** | `white` | `gray-800/50` |

---

## Gray Scale Reference

The app uses Tailwind's gray palette extensively:

| Shade | Hex | Usage |
|-------|-----|-------|
| gray-400 | `#9ca3af` | Inactive icons, secondary text |
| gray-500 | `#6b7280` | Placeholder text, tertiary text |
| gray-600 | `#4b5563` | Scrollbar hover |
| gray-700 | `#374151` | Input borders, card borders |
| gray-800 | `#1f2937` | Backgrounds, dividers |
| gray-900 | `#111827` | Card backgrounds (with opacity) |

---

## Opacity Patterns

Common opacity values used throughout the app:

| Pattern | Usage |
|---------|-------|
| `/10` | Subtle backgrounds (e.g., `emerald-500/10`) |
| `/20` | Hover states, borders |
| `/30` | Active borders, stronger accents |
| `/50` | Semi-transparent overlays |
| `/60` | Input backgrounds |
| `/90` | Status badges |
| `/95` | Header backgrounds with blur |

---

## Typography

### Font Family
- **Sans-serif**: Geist, system-ui fallback
- **Monospace**: Geist Mono

### Text Colors by Context
- **Headings**: `#f8f9fa` (foreground)
- **Body text**: `#f8f9fa` (foreground)
- **Secondary text**: `#9ca3af` (muted-foreground)
- **Links**: `#34d399` (emerald-400)
- **Link hover**: `#6ee7b7` (emerald-300)

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.75rem` (12px) | Base radius |
| `--radius-sm` | `0.5rem` (8px) | Small elements |
| `--radius-md` | `0.625rem` (10px) | Medium elements |
| `--radius-lg` | `0.75rem` (12px) | Cards, buttons |
| `--radius-xl` | `1rem` (16px) | Large cards |

---

## Shadow Effects

### Button Hover Shadow
```css
box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
/* Tailwind: shadow-lg shadow-emerald-500/30 */
```

### Focus Ring
```css
box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
/* Tailwind: ring-2 ring-emerald-500/20 */
```

---

## Color Accessibility Notes

1. **Contrast**: The emerald-400 (`#34d399`) on dark backgrounds provides good readability
2. **Status differentiation**: Each status uses a distinct hue for colorblind accessibility
3. **Text hierarchy**: Clear distinction between primary (`#f8f9fa`) and secondary (`#9ca3af`) text

---

## Quick Reference - Tailwind Classes

### Most Used Color Classes
```
Primary:        text-emerald-400, bg-emerald-500, border-emerald-500
Secondary:      text-teal-400, bg-teal-500, border-teal-500
Background:     bg-[#0a0d10], bg-gray-800, bg-gray-900
Text:           text-white, text-gray-400, text-gray-500
Borders:        border-gray-700, border-gray-800
Success:        text-emerald-400, bg-emerald-500/10
Error:          text-red-400, bg-red-500/10
Warning:        text-amber-400, bg-amber-500/10
Info:           text-blue-400, bg-blue-500/10
```
