# Settings/Preferences Screen Implementation Summary

## Overview

The Settings/Preferences screen provides a comprehensive configuration interface where users can manage language, notification preferences, quiet hours, interest categories, and privacy controls. Features dirty state tracking with a sticky save bar, client-side validation, data export, and clear local data (design-mode only).

## Implementation Date

October 24, 2025

## Features Implemented

### 1. **Language Selection**

- **LanguageCard** with radio button list
  - Options: English, Spanish (Español), French (Français)
  - Shows current selection with checkmark
  - Accessible with `role="radiogroup"`, `aria-checked`
  - Helper text: "UI language will update immediately after saving"
  - Mock i18n behavior: shows success toast with language name

### 2. **Notification Preferences**

- **NotificationsCard** with nudge sensitivity control
  - Options: Low, Medium, High (radio group)
  - Each option includes descriptive text:
    - Low: "Minimal nudges, only critical alerts"
    - Medium: "Balanced notifications for offers and milestones"
    - High: "All available nudges and recommendations"
  - Visual selection feedback with colored border and checkmark

### 3. **Quiet Hours Configuration**

- **QuietHoursCard** with enable/disable toggle
  - Switch to enable/disable feature
  - When enabled: Start and End time inputs (native `<input type="time">`)
  - Real-time validation: start !== end
  - Summary chip displays "Quiet 9:00 PM–7:00 AM" (12h format)
  - Helper text explains format and wrap-around support
  - Inline error messages for validation failures

### 4. **Interest Categories**

- **InterestsCard** with multi-select chips
  - 6 available categories: Grocery, Dining, Fuel, Travel, Retail, Services
  - Toggle chips with `aria-pressed` for accessibility
  - Shows count: "3 of 6 selected"
  - Checkmark icon appears when selected
  - Automatically disables unselected chips when 6 are selected
  - Helper text: "We'll prioritize offers in these categories"

### 5. **Privacy & Data Controls**

- **PrivacyCard** with two actions:
  - **Export My Data**: Downloads JSON with preferences + member/points snapshot
    - Confirmation dialog before export
    - Filename includes date: `settings-export-20251024.json`
    - Includes exportedAt timestamp, preferences, member info, points
  - **Clear Local Data** (design-mode only): Resets all mock data and reloads app
    - Double confirmation dialog
    - Requires typing "CLEAR" (case-sensitive) to confirm
    - Destructive button styling (red)

### 6. **Dirty State Tracking & Save Bar**

- **SaveBar** appears when unsaved changes detected
  - Sticky at bottom on mobile, inline on desktop
  - Shows message: "You have unsaved changes"
  - Buttons: "Save changes" (primary), "Discard" (secondary)
  - Smooth slide-in animation
  - Disabled during save operation
  - Deep comparison of preferences vs draftPreferences

### 7. **Responsive Layout**

- **Mobile (sm)**: Vertical stack, sticky SaveBar at bottom
- **Tablet/Desktop (md+)**: Two-column grid
  - Left: Language + Notifications
  - Right: Quiet Hours + Interests
  - Privacy: Full-width at bottom
- Max-width container (900px) for optimal layout

### 8. **Feature Flags**

Hardcoded constants at top of page (all true for MVP):
- `ENABLE_LANGUAGE` - Language selection
- `ENABLE_NOTIFICATIONS` - Nudge sensitivity
- `ENABLE_QUIET_HOURS` - Quiet hours configuration
- `ENABLE_MARKETING_PREFS` - Interest categories
- `ENABLE_DATA_EXPORT` - Privacy controls

## Technical Architecture

### Service Layer

**File**: `src/services/preferences.service.ts`

Types:
- `Language = "en" | "es" | "fr"`
- `NudgeSensitivity = "low" | "medium" | "high"`
- `Interest = "Grocery" | "Dining" | "Fuel" | "Travel" | "Retail" | "Services"`
- `QuietHours { enabled, start, end }` (HH:MM 24h format)
- `Preferences { language, nudgeSensitivity, interests, quietHours, version }`

Methods:
- `get()` - Returns current Preferences
- `save(patch)` - Merges partial update, validates, returns updated
- `export()` - Returns Blob (JSON) for download
- `clearLocal()` - Reloads app (design-mode only)

### Data & Mocking

**Seed Data**: `src/seed/preferences.json`
- Default language: "en"
- Default nudge sensitivity: "medium"
- Default interests: ["Grocery", "Dining", "Fuel"]
- Default quiet hours: enabled, 21:00-07:00 (9pm-7am)
- Version: 1

**MSW Handlers**: Extended `src/mocks/handlers.ts`
- `GET /api/preferences` - Returns current preferences
- `PATCH /api/preferences` - Validates and merges patch, increments version
- `POST /api/preferences/export` - Builds JSON blob with preferences + member/points snapshot

**Validation in PATCH Handler**:
- Language: must be valid enum
- NudgeSensitivity: must be valid enum
- QuietHours: if enabled, start and end required, start !== end, HH:MM format
- Interests: max 6, no duplicates, valid enum values

### Design System Extensions

**New Component**: `src/design-system/components/ToggleChip.tsx`
- Toggle button with pressed/unpressed states
- Props: `label`, `pressed`, `onToggle`, `disabled`, `icon?`
- Visual states: default (muted), pressed (primary), hover, focus, disabled
- Checkmark icon when pressed
- Accessible with `role="button"`, `aria-pressed`
- Keyboard accessible (Space/Enter to toggle)
- Exported from `src/design-system/index.ts`

### State Management

**Pattern**: Local state only (no AppContext)
- Uses React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- `preferences` - saved/persisted preferences
- `draftPreferences` - working copy being edited
- `isDirty` - computed via deep comparison (JSON.stringify)
- `saving` - tracks save operation in progress

**Dirty State Logic**:
```typescript
const isDirty = React.useMemo(() => {
  if (!preferences || !draftPreferences) return false;
  return JSON.stringify(preferences) !== JSON.stringify(draftPreferences);
}, [preferences, draftPreferences]);
```

**Changed Fields Tracking**:
- Compares each field individually
- Returns array of changed field names for telemetry
- Used in `settings_saved` event

### Components Created

**Settings Cards** (5):
- `LanguageCard.tsx` - Language radio group
- `NotificationsCard.tsx` - Nudge sensitivity radio group
- `QuietHoursCard.tsx` - Quiet hours toggle + time inputs
- `InterestsCard.tsx` - Interest categories multi-select chips
- `PrivacyCard.tsx` - Export/clear actions with confirmation dialogs

**UI Components** (1):
- `SaveBar.tsx` - Sticky footer bar for unsaved changes

**Main Page**:
- `src/app/settings/page.tsx` - Container with all logic and layout

## Accessibility

- Semantic HTML with `<main>` and `<h1>Settings</h1>`
- Each card has `<h2>` section heading
- All inputs have associated `<label>` with `for`/`id`
- Language radio group uses `role="radiogroup"`, `aria-checked`
- Notifications radio group uses same pattern
- Interest chips use `role="button"`, `aria-pressed`
- Quiet hours time fields use `aria-describedby` for help text, `aria-invalid` for errors
- SaveBar buttons have clear labels: "Save changes", "Discard"
- Live region for screen reader announcements (language changes, save confirmations)
- All targets >= 44px touch target
- Focus-visible styles on all interactive elements
- Color not sole indicator (chips include checkmark when selected)

## Validation Rules

**Language**: Required, must be one of "en" | "es" | "fr"

**Nudge Sensitivity**: Required, must be one of "low" | "medium" | "high"

**Quiet Hours**:
- If enabled, start and end required
- start !== end (error: "Start and end can't be the same")
- Format HH:MM validated by native `<input type="time">`
- Allow wrap-around (e.g., 21:00 → 07:00)
- Display human-friendly summary: "Quiet 9:00 PM–7:00 AM"

**Interests**:
- 0-6 selections allowed
- No duplicates (enforced in UI by toggling)
- UI disables unselected chips when limit reached

## Telemetry Events

All events logged to console:

1. **`settings_viewed`** - { language, nudgeSensitivity, interestsCount }
   - Logged on page load

2. **`settings_saved`** - { changed: ["language", "quietHours", ...] }
   - Logged on successful save with array of changed field names

3. **`settings_export_started`** - { }
   - Logged when export initiated

4. **`settings_export_completed`** - { bytes }
   - Logged after successful export with file size

5. **`settings_clear_local_confirmed`** - { }
   - Logged when clear local data confirmed

6. **`settings_quiet_hours_toggled`** - { enabled }
   - Logged when quiet hours switch is toggled

## Business Rules

- Language change shows special toast with language name
- Nudge sensitivity affects future badge counts and NudgeBanner behavior (not implemented in MVP)
- Quiet hours suppress notifications during specified window (mock behavior)
- Interests influence offers sorting on /offers page (mock behavior, not visible in MVP)
- Export creates JSON with current preferences + mock member/points snapshot
- Clear local data is design-mode only, requires double confirmation with typing "CLEAR"
- Version number auto-increments on each save (starts at 1)
- Only changed fields are sent in PATCH request (optimizes network)

## Key Files Summary

**New Files (10):**
- `src/services/preferences.service.ts` - Service interface and types
- `src/seed/preferences.json` - Default preferences
- `src/design-system/components/ToggleChip.tsx` - Toggle chip component
- `src/components/settings/LanguageCard.tsx` - Language selection
- `src/components/settings/NotificationsCard.tsx` - Nudge sensitivity
- `src/components/settings/QuietHoursCard.tsx` - Quiet hours config
- `src/components/settings/InterestsCard.tsx` - Interest categories
- `src/components/settings/PrivacyCard.tsx` - Privacy controls
- `src/components/settings/SaveBar.tsx` - Unsaved changes bar
- `src/app/settings/page.tsx` - Main settings page

**Modified Files (2):**
- `src/mocks/handlers.ts` - Added preferences endpoints with validation
- `src/design-system/index.ts` - Exported ToggleChip

## Testing Checklist

- [x] Navigate to `/settings` - page loads with all sections
- [x] Change language → SaveBar appears → Save → toast shows language name
- [x] Adjust nudge sensitivity → SaveBar appears → Save → persists
- [x] Toggle quiet hours on/off → set times → verify validation (start !== end)
- [x] Select/deselect interests → verify max 6 constraint → Save
- [x] Click Export → confirm → JSON downloads with correct filename
- [x] Click Clear Local Data → type "CLEAR" → confirm → app reloads
- [x] Cancel button → draft reverts to saved values
- [x] Responsive: mobile sticky SaveBar, desktop two-column
- [x] Accessibility: keyboard navigation, screen reader labels, focus management
- [x] All telemetry events fire correctly
- [x] Validation: invalid time format, same start/end times
- [x] No linter errors

## Implementation Patterns

**Reused Components**:
- Switch for quiet hours toggle (existing)
- Input for time fields and confirmation dialogs
- Label for all form labels
- Button for save/cancel/privacy actions
- Card/CardContent for section cards
- Pill for quiet hours summary
- ToastHost for success/error messages
- AccountSelector for header

**Dialog Pattern**:
- Centered modals with backdrop blur
- Confirmation dialogs for export and clear actions
- Double confirmation for destructive clear action
- Focus management and Esc key support

**Form Handling**:
- Controlled inputs with local state
- Real-time dirty state tracking
- Client-side validation before save
- Server-side validation in MSW handler
- Optimistic UI updates (draft changes immediately visible)

**Time Display**:
- Store in 24h format (HH:MM)
- Display in 12h format for summary chip
- Use native `<input type="time">` for better mobile UX
- Helper function `formatTime12h()` for conversion

## Data Export Format

Export JSON structure:
```json
{
  "exportedAt": "2025-10-24T12:00:00.000Z",
  "preferences": {
    "language": "en",
    "nudgeSensitivity": "medium",
    "interests": ["Grocery", "Dining", "Fuel"],
    "quietHours": {
      "enabled": true,
      "start": "21:00",
      "end": "07:00"
    },
    "version": 1
  },
  "member": {
    "name": "Gold Member",
    "tier": "Gold",
    "since": "2024-01-15"
  },
  "points": {
    "balance": 12450,
    "ytd": 8200
  }
}
```

## Mobile Optimizations

- Native `<input type="time">` provides mobile-optimized time picker
- SaveBar sticky at bottom for easy access
- Touch-friendly 44px+ targets on all interactive elements
- Responsive grid collapses to single column on mobile
- Cards stack vertically for easy scrolling
- Confirmation dialogs full-screen on small devices

## Performance Considerations

- Deep comparison memoized with `useMemo`
- Only changed fields sent in PATCH request
- Efficient re-renders with React.memo potential for cards
- Blob URL properly revoked after download
- No unnecessary API calls on draft changes

## Future Enhancements (Out of Scope)

- Real i18n integration with react-i18next or similar
- Actual notification suppression during quiet hours
- Dynamic offers filtering based on interests
- Profile photo upload in privacy section
- Two-factor authentication settings
- Email/push notification preferences
- Timezone selection for quiet hours
- Custom notification sounds
- Export in multiple formats (CSV, PDF)
- Import preferences from file
- Sync preferences across devices
- Preference presets (recommended settings)

## Design Rationale

**UX**: Grouped, scannable sections reduce cognitive load. SaveBar provides clear feedback on unsaved changes. Two-column layout on desktop utilizes screen space efficiently.

**Technical**: Centralized service facade mirrors REST API patterns. Local state keeps settings independent. Dirty state tracking enables save/cancel workflow. Validation occurs both client and server-side (MSW).

**Accessibility**: Full keyboard support, proper ARIA attributes, semantic HTML, and clear labels ensure all users can configure their preferences.

**Scalability**: Feature flags enable gradual rollout. Version number supports future migrations. Service facade enables easy backend integration. Component modularity supports future additions.

## Related Screens

This screen complements:
- **Home**: Access via settings icon in global nav
- **All Screens**: Preferences affect behavior across app (notifications, language, interests)
- **Offers**: Interests influence offer prioritization
- **Support**: Language setting may affect support content

## Conclusion

The Settings/Preferences screen successfully implements a comprehensive configuration interface with language selection, notification preferences, quiet hours, interest categories, and privacy controls. All features work as specified with dirty state tracking, validation, accessibility, and production-ready patterns. The implementation follows established architecture and integrates seamlessly with the existing design system.

