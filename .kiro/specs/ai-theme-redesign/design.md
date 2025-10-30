# Design Document

## Overview

This design document outlines the technical implementation for transforming the Narrato app into a modern AI-themed interface with a sophisticated dark color palette and integrated branding. The redesign will leverage the existing Tailwind CSS and NativeWind setup while introducing a comprehensive design system based on the provided logo imagery.

## Architecture

### Color System Architecture
The new theme will be implemented through a hierarchical color system:

1. **Base Layer**: Tailwind CSS custom color definitions
2. **Component Layer**: Global CSS classes for reusable components
3. **Application Layer**: Component-specific styling using the design tokens

### Asset Management
Logo assets will be organized in a structured directory system with multiple variants for different use cases and screen densities.

## Components and Interfaces

### Color Palette Definition

**Primary Colors:**
- `navy-dark`: #1a1b3a (main background)
- `navy-medium`: #2d2f5a (secondary backgrounds)
- `navy-light`: #404380 (elevated surfaces)

**Accent Colors:**
- `cyan-bright`: #00d4ff (primary accent, buttons, links)
- `cyan-medium`: #33e0ff (hover states)
- `cyan-light`: #66e6ff (subtle accents)

**Neutral Colors:**
- `white`: #ffffff (primary text on dark)
- `gray-light`: #e5e7eb (secondary text)
- `gray-medium`: #9ca3af (muted text)
- `gray-dark`: #4b5563 (borders, dividers)

### Component Design System

#### 1. Layout Components
```css
.app-background {
  background: linear-gradient(135deg, #1a1b3a 0%, #2d2f5a 100%);
}

.screen-container {
  background-color: transparent;
  padding: 16px;
}

.card-container {
  background-color: rgba(64, 67, 128, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}
```

#### 2. Typography System
```css
.title-primary {
  color: #00d4ff;
  font-size: 24px;
  font-weight: bold;
}

.title-secondary {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.body-text {
  color: #e5e7eb;
  font-size: 16px;
  line-height: 1.5;
}
```

#### 3. Interactive Elements
```css
.button-primary {
  background-color: #00d4ff;
  color: #1a1b3a;
  border-radius: 8px;
  font-weight: 600;
}

.button-primary:hover {
  background-color: #33e0ff;
}

.input-field {
  background-color: rgba(64, 67, 128, 0.5);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #ffffff;
}
```

### Logo Integration Design

#### Logo Variants and Usage
1. **Primary Logo**: Full logo with "Narrato AI Storyteller" text
   - Usage: Splash screen, main headers
   - Size: 200x120px (scaled responsively)

2. **Icon Logo**: Circular brain+book icon only
   - Usage: Navigation drawer, small headers
   - Size: 48x48px, 64x64px variants

3. **Square Logo**: Square format with icon
   - Usage: App icons, social media
   - Size: 512x512px, 1024x1024px

#### Logo Placement Strategy
- **HomeScreen**: Primary logo at top center
- **Drawer Navigation**: Icon logo in header
- **StoryScreen**: Small icon logo in navigation bar
- **Loading States**: Animated icon logo

## Data Models

### Theme Configuration Model
```typescript
interface ThemeConfig {
  colors: {
    primary: ColorPalette;
    accent: ColorPalette;
    neutral: ColorPalette;
    semantic: SemanticColors;
  };
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
}

interface ColorPalette {
  50: string;
  100: string;
  200: string;
  // ... up to 900
}
```

### Asset Management Model
```typescript
interface LogoAssets {
  primary: {
    light: string;
    dark: string;
  };
  icon: {
    small: string;
    medium: string;
    large: string;
  };
  variants: {
    square: string;
    circular: string;
    horizontal: string;
  };
}
```

## Error Handling

### Theme Loading
- Fallback to default colors if custom theme fails to load
- Graceful degradation for unsupported color formats
- Error logging for theme-related issues

### Asset Loading
- Placeholder images for failed logo loads
- Progressive loading for high-resolution assets
- Retry mechanism for network-dependent assets

## Testing Strategy

### Visual Regression Testing
- Screenshot comparisons for each screen with new theme
- Cross-platform consistency checks (iOS/Android)
- Dark theme accessibility compliance testing

### Component Testing
- Unit tests for theme utility functions
- Integration tests for themed components
- Logo rendering tests across different screen sizes

### User Acceptance Testing
- Theme consistency across user flows
- Logo visibility and branding effectiveness
- Accessibility testing with screen readers

## Implementation Phases

### Phase 1: Foundation
1. Update Tailwind configuration with new color palette
2. Create base CSS classes for the design system
3. Set up asset directory structure

### Phase 2: Core Components
1. Update global.css with new component classes
2. Implement logo component with variant support
3. Update screen containers and layouts

### Phase 3: Screen Updates
1. Apply new theme to HomeScreen
2. Apply new theme to StoryScreen
3. Update drawer navigation with logo

### Phase 4: Polish & Testing
1. Fine-tune color combinations and contrast
2. Optimize logo loading and caching
3. Comprehensive testing and bug fixes

## Technical Considerations

### Performance
- Minimize CSS bundle size through efficient class organization
- Optimize logo assets for different screen densities
- Use CSS custom properties for runtime theme switching capability

### Accessibility
- Ensure WCAG AA compliance for color contrast ratios
- Provide alternative text for logo images
- Support for reduced motion preferences

### Maintainability
- Centralized theme configuration
- Consistent naming conventions
- Documentation for design token usage

### Cross-Platform Compatibility
- Test theme rendering on both iOS and Android
- Ensure logo scaling works across device sizes
- Validate color accuracy on different displays