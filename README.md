# Relation Loyalty App

A comprehensive **relationship banking loyalty application** built with Next.js 15, React 19, and Tailwind CSS v4. This is a design-mode prototype featuring 10 fully-functional screens with MSW (Mock Service Worker) for API mocking, accessible components, and responsive navigation.

## Overview

This app demonstrates a modern loyalty/rewards platform for credit unions and banks, emphasizing relationship value over transactional rewards. It includes:

- **Home Dashboard** - Member tier, relationship value, points balance, featured offers
- **Rewards System** - Points overview, redemption flow, transaction history, achievement badges
- **Cashback Offers** - Category browsing, search, activation, and details
- **Tier Progression** - Current tier status, benefits, requirements, advancement paths
- **Savings Goals** - Goal management with automated contributions and round-ups
- **Multi-Channel Support** - Priority line, callback requests, secure messaging, FAQ
- **User Preferences** - Language, notifications, quiet hours, interests, privacy controls
- **Responsive Navigation** - Bottom tabs (mobile), side rail (desktop), no dead ends

## Tech Stack

- **Framework**: Next.js 15.0.0 + React 19 (TypeScript, App Router)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **PWA**: `next-pwa` with offline support
- **API Mocking**: MSW (Mock Service Worker) with in-memory seed data
- **State**: React Context (global) + local component state
- **Icons**: `lucide-react`, `@phosphor-icons/react`, `react-icons`
- **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`

## Features

### ✅ Complete Screen Implementations
- All 10 screens fully functional with loading, error, and empty states
- Real-time data updates with optimistic UI patterns
- Multi-step flows (redemption, goal creation, callback requests)
- Client-side filtering, sorting, and pagination

### ✅ Accessibility (WCAG 2.1 AA)
- Semantic HTML with proper landmarks
- Skip to content link
- Keyboard navigation throughout
- Screen reader support with ARIA attributes
- Focus management in dialogs and sheets
- Touch targets ≥ 44px

### ✅ Responsive Design
- Mobile-first approach
- Bottom tab bar (< 768px) with 4 primary tabs + More
- Side rail navigation (≥ 768px) with all routes visible
- Adaptive sheets/drawers (bottom sheet on mobile, right drawer on desktop)

### ✅ Design System
Portable design system with reusable atoms:
- Components: Button, Card, Badge, Input, Switch, Textarea, Select
- Specialized: ProgressRing, PercentBadge, ExpiryBadge, StatusRibbon, ToggleChip
- Consistent theming with CSS custom properties

## Getting Started

### Prerequisites
- Node.js 18+ (tested with 22.x)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/js-corcoran/relationloyaltyapp.git
cd relationloyaltyapp

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home dashboard
│   ├── rewards/             # Rewards overview + sub-routes
│   ├── offers/              # Cashback offers
│   ├── tiers/               # Tier progression
│   ├── goals/               # Savings goals
│   ├── support/             # Help & contact
│   └── settings/            # User preferences
├── components/              # Feature-specific components
├── design-system/          # Portable design system (atoms)
├── services/               # Service layer facades with types
├── seed/                   # JSON seed data for MSW
├── mocks/                  # MSW handlers and browser setup
└── state/                  # Global state (AppContext)
```

## Key Implementation Details

### Service Layer Pattern
Every feature has a typed service facade (`*.service.ts`) that abstracts API calls. MSW intercepts all fetch requests and returns seed data.

### State Management
- **Global AppContext**: Used for Home, Rewards, Offers, Tiers (screens with shared account context)
- **Local State**: Used for History, Badges, Goals, Support, Settings (self-contained screens)

### Responsive Navigation
- **Mobile**: Bottom tab bar with Home, Rewards, Offers, Tiers + "More" button
- **Desktop**: Side rail with all 9 routes visible (primary + secondary)
- **No dead ends**: Every route accessible from anywhere in the app

### Accessibility Highlights
- Skip link as first focusable element
- All interactive elements keyboard accessible
- Focus trap in dialogs/sheets with focus restoration
- Live regions for dynamic content updates
- Semantic landmarks throughout

## Documentation

Each feature has comprehensive implementation documentation:
- `NAVIGATION_IMPLEMENTATION.md` - App shell and routing
- `HISTORY_IMPLEMENTATION.md` - Transaction history
- `BADGES_IMPLEMENTATION.md` - Achievement system
- `OFFERS_IMPLEMENTATION.md` - Cashback offers
- `TIERS_IMPLEMENTATION.md` - Tier progression
- `GOALS_IMPLEMENTATION.md` - Savings goals
- `SUPPORT_IMPLEMENTATION.md` - Multi-channel support
- `SETTINGS_IMPLEMENTATION.md` - User preferences

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## License

This is a prototype/demonstration project.

## Author

Built with [Cursor AI](https://cursor.sh) - An AI-first code editor.
