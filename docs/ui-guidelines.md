# TODO App - UI Guidelines

## Overview

This document establishes the core UI/UX guidelines for the TODO application. All UI components and layouts should adhere to these standards to ensure consistency, accessibility, and a professional user experience.

## Design System

### Component Library

- **Primary Library**: Material-UI (MUI) for React components
- **Installation**: `@mui/material`, `@mui/icons-material`
- **Version**: v5 or later
- All custom components should extend or complement MUI components when possible

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#1976D2` | Primary actions, active states, links |
| Primary Hover | `#1565C0` | Primary button hover state |
| Primary Dark | `#1351BA` | Primary button active/pressed state |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Secondary Teal | `#00897B` | Secondary actions, accents |
| Secondary Hover | `#00695C` | Secondary button hover state |

### Status Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#2E7D32` | Completed tasks, success messages |
| Warning Orange | `#F57C00` | High priority, warnings, overdue alerts |
| Error Red | `#D32F2F` | Errors, critical alerts, delete confirmations |
| Info Blue | `#0288D1` | Informational messages |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#212121` | Main text content |
| Text Secondary | `#757575` | Secondary text, labels |
| Disabled Gray | `#BDBDBD` | Disabled states |
| Background White | `#FFFFFF` | Main background |
| Light Gray | `#F5F5F5` | Card backgrounds, sections |
| Border Gray | `#E0E0E0` | Dividers, borders |

### Overdue/High Priority Variants

- **Overdue Background**: `#FFEBEE` (light red)
- **Overdue Border**: `#EF5350` (medium red)
- **High Priority Background**: `#FFF3E0` (light orange)
- **High Priority Border**: `#FFB74D` (medium orange)

## Typography

### Font Family

- **Primary Font**: "Roboto", sans-serif
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Font Sizes & Weights

| Component | Size | Weight | Line Height |
|-----------|------|--------|-------------|
| Page Title | 32px | 500 | 1.2 |
| Section Header | 24px | 500 | 1.3 |
| Card Title | 18px | 500 | 1.4 |
| Body Text | 14px | 400 | 1.5 |
| Small/Caption | 12px | 400 | 1.4 |
| Button Text | 14px | 600 | 1.5 |
| Input Label | 12px | 500 | 1.4 |

## Button Styles

### Primary Button

```
Background: #1976D2 (Primary Blue)
Hover: #1565C0 (Primary Hover)
Active: #1351BA (Primary Dark)
Text: White (#FFFFFF)
Padding: 10px 24px
Border Radius: 4px
Font Weight: 600
Box Shadow (default): none
Box Shadow (hover): 0px 2px 4px rgba(0,0,0,0.1)
Box Shadow (active): 0px 1px 3px rgba(0,0,0,0.2)
```

**Usage**: Main call-to-action buttons (Add Task, Save, Submit)

### Secondary Button

```
Background: Transparent
Border: 1px solid #1976D2 (Primary Blue)
Text: #1976D2 (Primary Blue)
Hover: Background #F0F7FF (light blue)
Active: Background #E3F2FD (medium light blue)
Padding: 10px 24px
Border Radius: 4px
Font Weight: 600
```

**Usage**: Alternative actions, non-critical operations

### Danger Button

```
Background: #D32F2F (Error Red)
Hover: #C62828 (darker red)
Text: White (#FFFFFF)
Padding: 10px 24px
Border Radius: 4px
Font Weight: 600
Box Shadow: Similar to primary button
```

**Usage**: Destructive actions (Delete Task)

### Disabled Button

```
Background: #BDBDBD (Disabled Gray)
Text: #757575 (Text Secondary)
Cursor: not-allowed
Opacity: 0.6
```

**Usage**: Unavailable or inactive buttons

### Icon Button

```
Size: 36px x 36px
Background: Transparent
Hover: Circular background with 8% opacity of primary color
Padding: 8px
Border Radius: 50%
Icon Color: #1976D2 or context-appropriate color
```

**Usage**: Compact actions, toolbar buttons (Edit, Delete, More options)

## Component Guidelines

### Input Fields & Forms

- **Border Color**: `#E0E0E0`
- **Border Width**: 1px
- **Border Radius**: 4px
- **Padding**: 12px
- **Focus State**: Border color changes to `#1976D2`, add box shadow `0px 0px 0px 3px rgba(25, 118, 210, 0.1)`
- **Error State**: Border color changes to `#D32F2F`, show error message below field in error red
- **Label**: Always include visible labels above input fields
- **Helper Text**: Use small gray text (12px, `#757575`) below field for additional guidance

### Task Card/List Item

- **Background**: `#FFFFFF` (default) or `#F5F5F5` (alternate rows)
- **Border**: 1px solid `#E0E0E0`
- **Border Radius**: 8px
- **Padding**: 16px
- **Margin Bottom**: 12px
- **Hover State**: Background to `#F5F5F5`, box shadow `0px 2px 8px rgba(0,0,0,0.08)`
- **Completed Task**: Text decoration strikethrough, text color `#757575`, opacity 0.6
- **Overdue Task**: Left border (4px) in error red, background tinted with `#FFEBEE`
- **High Priority**: Left border (4px) in warning orange, background tinted with `#FFF3E0`

### Checkboxes & Toggle Switches

- **Size**: 20px x 20px (checkbox), 48px (toggle)
- **Color (unchecked)**: `#E0E0E0`
- **Color (checked)**: `#2E7D32` (Success Green)
- **Border Radius**: 2px (checkbox), 24px (toggle)
- **Always include labels** next to checkboxes/toggles

### Badges & Status Indicators

- **Completed**: Green background (`#C8E6C9`), green text (`#2E7D32`), rounded pill shape
- **Active/Pending**: Blue background (`#BBDEFB`), blue text (`#1976D2`), rounded pill shape
- **High Priority**: Orange background (`#FFE0B2`), orange text (`#F57C00`), rounded pill shape
- **Overdue**: Red background (`#FFCDD2`), red text (`#D32F2F`), rounded pill shape
- **Padding**: 6px 12px
- **Font Size**: 12px, weight 600
- **Border Radius**: 16px

### Modals & Dialogs

- **Background Overlay**: `rgba(0, 0, 0, 0.5)`
- **Modal Background**: `#FFFFFF`
- **Border Radius**: 8px
- **Padding**: 24px
- **Box Shadow**: `0px 5px 15px rgba(0,0,0,0.2)`
- **Min Width**: 400px (desktop), 100% - 32px (mobile)
- **Max Width**: 600px

## Spacing & Layout

### Spacing Scale (in pixels)

```
8px  = xs (small gaps)
12px = sm (component padding)
16px = md (section padding)
24px = lg (major sections)
32px = xl (page margins)
48px = 2xl (large gaps)
```

### Grid System

- **Desktop**: 12-column grid with 24px gutters
- **Tablet**: 8-column grid with 16px gutters
- **Mobile**: 4-column grid with 12px gutters
- **Max Content Width**: 1200px (centered)
- **Page Margins**: 24px (desktop), 16px (tablet), 12px (mobile)

## Responsive Design Breakpoints

| Device | Width | Breakpoint |
|--------|-------|-----------|
| Mobile | 320px - 599px | xs |
| Tablet | 600px - 959px | sm |
| Desktop | 960px + | md, lg, xl |

### Responsive Guidelines

- **Mobile First**: Design for mobile first, then enhance for larger screens
- **Task List**: Stack cards vertically on mobile, maintain grid on desktop
- **Buttons**: Full width on mobile (if primary action), standard width on desktop
- **Modals**: Full viewport height on mobile, constrained on desktop
- **Font Sizes**: Slightly smaller on mobile (12px body text → 14px on desktop)

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

All components must meet or exceed WCAG 2.1 Level AA standards.

### Color Contrast

- **Normal Text**: Minimum 4.5:1 contrast ratio (small text)
- **Large Text**: Minimum 3:1 contrast ratio (18px+ or 14px+ bold)
- **UI Components & Borders**: Minimum 3:1 contrast ratio
- **Graphical Objects**: Minimum 3:1 contrast ratio

### Keyboard Navigation

- **Tab Order**: Logical, left-to-right, top-to-bottom flow
- **Focus Indicator**: Visible focus outline (minimum 2px, contrasting color)
- **Keyboard Shortcuts**: 
  - `Enter` - Submits forms, activates buttons
  - `Escape` - Closes modals/dialogs
  - `Tab` - Navigate between focusable elements
  - `Shift+Tab` - Navigate backwards
  - `Space` - Toggle checkboxes, activate buttons

### ARIA Labels & Attributes

- **Buttons**: Use `aria-label` if button text is not clear
- **Icons**: Provide `aria-label` for icon buttons
- **Form Fields**: Always use `<label>` elements associated with inputs via `htmlFor`
- **Task Status**: Use `aria-checked` for checkbox states
- **Modal**: Use `role="dialog"` and `aria-modal="true"`
- **Empty States**: Use `aria-live="polite"` for dynamic content updates
- **Loading States**: Use `aria-busy="true"` during async operations

### Screen Reader Optimization

- **Semantic HTML**: Use proper semantic elements (`<button>`, `<input>`, `<nav>`, etc.)
- **Link vs Button**: Buttons perform actions, links navigate
- **Skip Links**: Provide skip-to-content link for keyboard users
- **Headings**: Use proper heading hierarchy (h1, h2, h3, etc.)
- **Lists**: Use `<ul>` or `<ol>` for lists, not div styling
- **Descriptive Text**: Avoid vague labels like "Click Here"; use "Add New Task"

### Focus Management

- **Modal Dialogs**: Trap focus within modal
- **Form Validation**: Focus moves to first error field
- **Dynamic Content**: Announce changes with `aria-live` regions
- **Loading States**: Provide clear feedback to users

### Text & Content

- **Font Size**: Minimum 12px for body text
- **Line Spacing**: Minimum 1.4 for better readability
- **Text Alignment**: Left-aligned for LTR languages
- **Avoid All Caps**: Only use for acronyms or labels (harder to read)
- **Icon-Only Features**: Always provide text labels or aria-labels

### Mobile & Touch Accessibility

- **Touch Target Size**: Minimum 44x44px for interactive elements
- **Touch Spacing**: Minimum 8px between adjacent touch targets
- **Double-Tap Zoom**: Don't disable zoom on mobile devices
- **Viewport Meta Tag**: `<meta name="viewport" content="width=device-width, initial-scale=1">`

## Animation & Transitions

### Principles

- **Purpose**: Animations should provide feedback or guide user attention
- **Duration**: 200-300ms for rapid feedback, 300-500ms for complex transitions
- **Easing**: Use ease-out for entering, ease-in for exiting
- **Respect Preferences**: Check `prefers-reduced-motion` media query

### Recommended Animations

- **Button Hover**: 200ms background color transition
- **Button Click**: 100ms scale transition (98% to 100%)
- **Card Hover**: 200ms box-shadow and background transition
- **Modal/Dialog**: 300ms fade-in + 200ms scale
- **Task Completion**: 300ms strikethrough transition
- **Error Messages**: 200ms slide-in-up with fade

### Avoid

- Animations longer than 500ms
- Automatic animations (without user interaction)
- Flashing or flickering effects
- Parallax scrolling (poor performance on mobile)

## Dark Mode (Future Enhancement)

When dark mode is implemented:

- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#E0E0E0`
- **Background**: `#121212`
- **Card Background**: `#1E1E1E`
- **Light Gray Background**: `#2C2C2C`
- **Border Color**: `#3F3F3F`
- **Primary Color**: `#64B5F6` (lighter blue for contrast)

## Checklist for New Components

When creating new components, ensure they meet these criteria:

- [ ] Follows Typography Standards (font family, size, weight)
- [ ] Uses colors from established palette
- [ ] Button styles match one of the defined button types
- [ ] Spacing follows the spacing scale (8px multiples)
- [ ] Responsive for xs, sm, md breakpoints
- [ ] Includes proper ARIA labels and semantic HTML
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states are clearly visible
- [ ] Touch targets are minimum 44x44px
- [ ] Has appropriate hover/active states
- [ ] Works with keyboard navigation only
- [ ] Tested with screen reader

## References

- [Material Design Documentation](https://material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility Guide](https://react.dev/learn/accessibility)
