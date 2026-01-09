# QuickList Style System - Developer Guide

## Overview

QuickList now has a unified, centralized style system. All screens use GlobalStyleSheet constants for colors, spacing, typography, and elevation. This guide explains how to maintain consistency when adding new features.

## Quick Start

### Using Colors
```tsx
import { colors } from "../GlobalStyleSheet";

// Primary actions
<View style={{ backgroundColor: colors.primary }} />

// Secondary text
<Text style={{ color: colors.textMedium }} />

// Danger/destructive actions
<View style={{ backgroundColor: colors.danger }} />

// Backgrounds
<View style={{ backgroundColor: colors.backgroundLight }} />
```

**Never use hardcoded colors like `#C20200`, `#FF0000`, etc.**

### Using Spacing
```tsx
import { spacing } from "../GlobalStyleSheet";

// Padding/Margin
<View style={{ padding: spacing.lg }} />
<View style={{ marginBottom: spacing.md }} />
<View style={{ gap: spacing.xl }} />

// Common spacing patterns:
// - Small gaps: spacing.sm (8px)
// - Default margins: spacing.lg (16px)
// - Section padding: spacing.xl (20px)
```

**Never use hardcoded pixel values like `padding: 16`, `marginBottom: 20`, etc.**

### Using Typography
```tsx
import { typography } from "../GlobalStyleSheet";

// Headings
<Text style={typography.h1}>Main Heading</Text>
<Text style={typography.h2}>Section Title</Text>
<Text style={typography.h3}>Subsection</Text>

// Body text
<Text style={typography.body}>Regular paragraph</Text>
<Text style={typography.bodyBold}>Emphasized text</Text>
<Text style={typography.bodySmall}>Secondary information</Text>
<Text style={typography.caption}>Metadata</Text>

// Buttons
<Text style={typography.button}>Button Text</Text>
```

**Never use hardcoded font sizes or weights like `fontSize: 16` or `fontWeight: "bold"`.**

### Using Border Radius
```tsx
import { borderRadius } from "../GlobalStyleSheet";

// Small buttons, tags
<View style={{ borderRadius: borderRadius.sm }} />

// Default cards
<View style={{ borderRadius: borderRadius.md }} />

// Large cards, containers
<View style={{ borderRadius: borderRadius.lg }} />

// Pill shapes, badges
<View style={{ borderRadius: borderRadius.round }} />
```

### Using Elevation (Shadows)
```tsx
import { elevation } from "../GlobalStyleSheet";

// Subtle shadows
<View style={{ ...elevation.sm }} />

// Card shadows
<View style={{ ...elevation.md }} />

// Prominent shadows
<View style={{ ...elevation.lg }} />
```

## Component Usage Guide

### ScreenHeader (for navigation screens)
```tsx
import { ScreenHeader } from "../components/ScreenHeader";

<ScreenHeader
  title="My Screen"
  subtitle="Optional description"
  showBackButton={true}
  centered={false}
/>
```

### FormInput (for text inputs)
```tsx
import { FormInput } from "../components/FormInput";

<FormInput
  placeholder="Enter email"
  icon="email"
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
  isFocused={focusedField === 'email'}
/>
```

### PrimaryButton (for all buttons)
```tsx
import { PrimaryButton } from "../components/PrimaryButton";

// Primary variant (default)
<PrimaryButton
  title="Create List"
  onPress={handleCreate}
  icon="add"
  size="large"
/>

// Secondary variant
<PrimaryButton
  title="Cancel"
  onPress={handleCancel}
  variant="secondary"
/>

// Danger variant
<PrimaryButton
  title="Delete"
  onPress={handleDelete}
  variant="danger"
/>

// Small variant
<PrimaryButton
  title="OK"
  onPress={handleOK}
  size="small"
/>
```

### AuthLayout (for auth screens)
```tsx
import { AuthLayout } from "../components/AuthLayout";

<AuthLayout showLogo>
  {/* Form content */}
</AuthLayout>
```

### TagBadge (for tags/labels)
```tsx
import { TagBadge } from "../components/TagBadge";

<TagBadge
  label="Groceries"
  color={colors.primary}
  onRemove={() => removeTag('Groceries')}
/>
```

### ListItemCard (for list items)
```tsx
import { ListItemCard } from "../components/ListItemCard";

<ListItemCard
  title="Milk"
  subtitle="2L bottle"
  icon="shopping-basket"
  badge={5}
  color={colors.primary}
  onPress={() => handleEdit()}
  onDelete={() => handleDelete()}
/>
```

### SectionHeader (for section dividers)
```tsx
import { SectionHeader } from "../components/SectionHeader";

<SectionHeader
  title="Recent Items"
  subtitle="Items you frequently buy"
  variant="accent"
/>
```

## Color Palette Reference

### Brand Colors
```typescript
colors.primary        = "#C20200"  // Main brand red
colors.primaryDark    = "#520600"  // Darker red
colors.primaryLight   = "#E63946"  // Lighter red
```

### Semantic Colors
```typescript
colors.success        = "#2ECC71"  // Green, positive actions
colors.warning        = "#F39C12"  // Orange, alerts
colors.danger         = "#E74C3C"  // Red, destructive actions
```

### Text Colors
```typescript
colors.textDark       = "#520600"  // Primary text (headings)
colors.textMedium     = "#736F73"  // Secondary text (labels)
colors.textLight      = "#999999"  // Tertiary text (helpers)
```

### Background Colors
```typescript
colors.white          = "#FFFFFF"  // Main background
colors.backgroundLight= "#F8F9FA"  // Light backgrounds
colors.border         = "#E0E0E0"  // Borders, dividers
```

## Spacing Scale Reference

The spacing scale follows a 4px base unit:

```typescript
spacing.xs    = 4px
spacing.sm    = 8px
spacing.md    = 12px
spacing.lg    = 16px    (default/most common)
spacing.xl    = 20px
spacing.xxl   = 24px
spacing.xxxl  = 32px
```

### Usage Patterns
```typescript
// Button padding
paddingVertical: spacing.lg
paddingHorizontal: spacing.xl

// Card padding
padding: spacing.xl

// Margin between sections
marginVertical: spacing.xxl

// Small gaps
gap: spacing.sm

// Medium gaps
gap: spacing.lg
```

## Typography Scale Reference

```typescript
typography.h1 = {
  fontSize: 32,
  fontWeight: "700",
  letterSpacing: 0.5,
  lineHeight: 40,
}

typography.h2 = {
  fontSize: 24,
  fontWeight: "700",
  letterSpacing: 0.4,
  lineHeight: 32,
}

typography.h3 = {
  fontSize: 20,
  fontWeight: "600",
  letterSpacing: 0.3,
  lineHeight: 28,
}

typography.body = {
  fontSize: 16,
  fontWeight: "400",
  letterSpacing: 0.2,
  lineHeight: 24,
}

typography.bodyBold = {
  fontSize: 16,
  fontWeight: "600",
  letterSpacing: 0.2,
  lineHeight: 24,
}

typography.bodySmall = {
  fontSize: 14,
  fontWeight: "400",
  letterSpacing: 0.2,
  lineHeight: 20,
}

typography.caption = {
  fontSize: 12,
  fontWeight: "400",
  letterSpacing: 0.1,
  lineHeight: 16,
}

typography.button = {
  fontSize: 16,
  fontWeight: "600",
  letterSpacing: 0.3,
}
```

## Common Patterns

### Card with Elevation
```tsx
<View style={{
  backgroundColor: colors.white,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  ...elevation.md,
}}>
  <Text style={typography.h3}>Card Title</Text>
</View>
```

### Form Field
```tsx
<FormInput
  icon="email"
  placeholder="Email address"
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
  isFocused={focused === 'email'}
/>
```

### Button Group
```tsx
<View style={{ gap: spacing.lg }}>
  <PrimaryButton
    title="Save"
    onPress={handleSave}
    variant="primary"
  />
  <PrimaryButton
    title="Cancel"
    onPress={handleCancel}
    variant="secondary"
  />
</View>
```

### Section with Header
```tsx
<SectionHeader title="Your Lists" subtitle="All your shopping lists" />
<View style={{ gap: spacing.md }}>
  {lists.map(list => (
    <ListItemCard
      key={list.id}
      title={list.name}
      badge={list.itemCount}
      onPress={() => handleSelect(list)}
    />
  ))}
</View>
```

## Dark Mode Preparation

The current system is prepared for dark mode:
- All colors are defined in `colors` object
- Typography is separate from colors
- Spacing and sizing are independent

To implement dark mode:
1. Create `colorsDark` variant in GlobalStyleSheet
2. Create theme context
3. Switch between `colors` and `colorsDark`
4. All screens will automatically update

## Checklist for New Features

When adding new screens or components:

- [ ] Use only GlobalStyleSheet colors
- [ ] Use only GlobalStyleSheet spacing
- [ ] Use only GlobalStyleSheet typography
- [ ] Use shared components where applicable
- [ ] No hardcoded pixel values
- [ ] No hardcoded color strings
- [ ] Proper elevation/shadow usage
- [ ] Consistent border radius
- [ ] Proper TypeScript types
- [ ] No unused imports
- [ ] Accessibility considerations (hit targets ≥ 48dp)

## FAQ

**Q: Can I use custom spacing values?**
A: Only when unavoidable (e.g., precise positioning). Document why with comments.

**Q: How do I use semi-transparent colors?**
A: Use `${colors.primary}80` notation (e.g., `${colors.primary}40` for 25% opacity).

**Q: What if the spacing constants don't fit my needs?**
A: Add new constants to GlobalStyleSheet and update this guide.

**Q: How do I change button styles?**
A: Update PrimaryButton component, all usages automatically update.

**Q: Can I override styles on individual screens?**
A: Yes, use style composition: `[globalStyles.button, { marginTop: spacing.xl }]`

## Support

For questions about the style system:
1. Check GlobalStyleSheet.tsx for available constants
2. Review existing screen implementations
3. Refer to shared components in `/components/`
4. Check this guide for common patterns

---

**Remember:** Consistency is key. Always use GlobalStyleSheet constants and shared components. This makes the app easier to maintain and update.
