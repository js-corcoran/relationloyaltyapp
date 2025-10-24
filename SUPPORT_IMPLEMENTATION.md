# Support Screen Implementation Summary

## Overview

The Support screen provides tier-aware customer support access with multiple contact methods, FAQ search, and clear SLA messaging. Built following the established patterns from previous screens (Goals, Badges, History).

## Implementation Date

October 24, 2025

## Features Implemented

### 1. **Tier-Aware Contact Methods**

- **Priority Line Card** (Gold+ tiers only)
  - Displays phone number, business hours, and estimated wait time
  - SLA badge shows "Under 2 min" (green) for ≤2 min or "About X min" (blue) for longer waits
  - "Call now" button opens confirmation dialog
  - Phone icon with blue accent

- **Callback Request Card**
  - Available to all tiers
  - Opens dialog to schedule callback during business hours
  - Phone incoming icon with green accent

- **Secure Message Card**
  - Asynchronous messaging with 24-hour response SLA
  - Opens dialog for composing secure messages
  - Message square icon with purple accent

### 2. **Interactive Dialogs**

- **Call Confirm Dialog**
  - Simple confirmation before triggering `tel:` link
  - Shows phone number and estimated wait time
  - Opens native dialer on mobile devices
  - Esc to close, focus on "Call" button

- **Callback Dialog**
  - Form with phone input (validated for 10-15 digits)
  - Reason select: Card issue, Rewards question, Account access, Other
  - Window select: Today/Tomorrow AM/PM with time ranges
  - Validation with inline error messages
  - Success toast shows scheduled callback time

- **Secure Message Dialog**
  - Subject input (3-120 chars)
  - Message textarea (5-2000 chars with character counter)
  - Attachment stub (disabled, "Coming soon")
  - Success toast shows generated case ID (e.g., `C-10482`)

### 3. **FAQ System**

- **Search Bar**
  - Debounced search (250ms)
  - Search icon with clear button when query present
  - Max 60 characters
  - Filters by title, body, and tags (case-insensitive)

- **Results List**
  - Shows article count
  - Empty state with "Clear search" button
  - Accordion-style article rows

- **Article Rows**
  - Collapsed: Title + snippet (1 line)
  - Expanded: Title + full body + tags
  - Smooth transitions with ChevronDown rotation
  - Click anywhere to toggle
  - Keyboard accessible

### 4. **Responsive Layout**

- **Mobile (sm)**: Vertical stack - Header → Contact cards → FAQ
- **Tablet/Desktop (md+)**: Two-column layout - Left: Contact cards, Right: FAQ
- Max-width container (900px) for optimal reading
- Dialogs full-screen on mobile, 440px centered on desktop

### 5. **Feature Flags**

Hardcoded constants at top of page (all true for MVP):
- `SHOW_PRIORITY_LINE` - Controls priority line card visibility
- `SHOW_CALLBACK` - Controls callback card visibility
- `SHOW_SECURE_MSG` - Controls secure message card visibility
- `SHOW_FAQ` - Controls FAQ section visibility

## Technical Architecture

### Service Layer

**File**: `src/services/support.service.ts`

Types:
- `SupportProfile` - Tier, priority line access, phone, hours, SLA times
- `CallbackRequest` / `CallbackResponse` - Callback scheduling
- `SecureMessage` - Secure messaging with case ID
- `FaqArticle` - Title, snippet, body, tags

Methods:
- `getProfile()` - Returns support profile for current user
- `requestCallback(req)` - Schedules callback, returns scheduled time
- `createSecureMessage(subject, body)` - Creates message, returns case ID
- `searchFaq(q)` - Filters FAQ articles by query

### Data & Mocking

**Seed Data**: `src/seed/support.json`
- Gold tier profile with priority line access
- 10 diverse FAQ articles covering rewards, offers, tiers, goals, badges, support topics
- Each article has title, snippet, body, and tags for search

**MSW Handlers**: Extended `src/mocks/handlers.ts`
- `GET /api/support/profile` - Returns support profile
- `POST /api/support/callbacks` - Validates phone/reason/window, computes window times, returns scheduled callback
- `POST /api/support/secure-messages` - Validates subject/body lengths, generates case ID
- `GET /api/support/faq?q=` - Filters articles by query (title/body/tags), sorts by relevance

**Window Computation Helper**:
```typescript
computeCallbackWindow(window: string): { start: string; end: string }
```
Maps enum values to ISO date strings:
- `today_am` → Today 8am-12pm
- `today_pm` → Today 1pm-5pm
- `tomorrow_am` → Tomorrow 8am-12pm
- `tomorrow_pm` → Tomorrow 1pm-5pm

### Design System Extensions

**New Component**: `src/design-system/components/Textarea.tsx`
- Similar styling to Input component
- Props: `value`, `onChange`, `rows`, `maxLength`, `placeholder`, `disabled`, `error`
- Auto character counter when `maxLength` provided
- Accessible error messages with `aria-invalid` and `aria-describedby`
- Exported from `src/design-system/index.ts`

### State Management

**Pattern**: Local state only (no AppContext)
- Support profile and FAQ are read-only reference data
- Uses React hooks (`useState`, `useEffect`, `useCallback`)
- Debounced search with `useRef` for timeout management
- Dialog open/close states managed locally

### Components Created

**Contact Cards** (3):
- `PriorityLineCard.tsx` - Priority line with SLA badge
- `CallbackCard.tsx` - Callback request
- `SecureMessageCard.tsx` - Secure messaging

**Dialogs** (3):
- `CallConfirmDialog.tsx` - Call confirmation
- `CallbackDialog.tsx` - Callback scheduling form
- `SecureMsgDialog.tsx` - Secure message form

**FAQ Components** (3):
- `FAQSearchBar.tsx` - Search input with debouncing
- `FAQResultsList.tsx` - Results container with empty state
- `ArticleRow.tsx` - Accordion-style article display

**Main Page**:
- `src/app/support/page.tsx` - Container with all logic and layout

## Accessibility

- Semantic HTML with `<main>` and proper heading hierarchy
- All inputs have associated `<label>` elements
- Buttons have explicit labels: "Call now – priority line"
- SLA text uses `aria-describedby` for additional context
- Dialogs use `role="dialog"`, `aria-labelledby`, focus trap, return focus
- Form errors use `aria-invalid` and `aria-describedby`
- FAQ accordion rows use `role="button"`, `aria-expanded`, `aria-controls`
- Live region for screen reader announcements (though messages shown via toast)
- Color not sole indicator for SLA (includes explicit text)
- All controls >= 44px touch target
- Full keyboard support: Tab through controls, Enter to submit, Esc to close

## Validation Rules

**Callback Phone**:
- 10-15 digits after stripping punctuation
- Error message: "Enter a valid phone number"
- Validates on blur and before submit

**Secure Message Subject**:
- 3-120 characters (trimmed)
- Error message: "Subject must be 3-120 characters"
- Validates on blur and before submit

**Secure Message Body**:
- 5-2000 characters (trimmed)
- Character counter displays remaining characters
- Error message: "Message must be 5-2000 characters"
- Validates on blur and before submit

**FAQ Search**:
- Max 60 characters (optional limit)
- Debounced 250ms to reduce API calls

## Telemetry Events

All events logged to console:

1. **`support_viewed`** - { tier, hasPriorityLine }
   - Logged on page load

2. **`support_call_initiated`** - { tier, priority: boolean }
   - Logged when user confirms call

3. **`support_callback_requested`** - { reason, window }
   - Logged on successful callback scheduling

4. **`support_secure_message_created`** - { length, hasKeywords: boolean }
   - Logged on successful message send
   - `hasKeywords` checks for urgent/important/asap

5. **`support_faq_searched`** - { query, results }
   - Logged after debounced search completes

6. **`support_faq_article_viewed`** - { articleId }
   - Logged when article is expanded

## Business Rules

- Priority line visible only if `hasPriorityLine === true` (typically Gold+ tier)
- Callback windows limited to business hours: Mon-Fri 8am-8pm ET
- Requests outside hours automatically roll to next available window (mocked)
- Secure message attachments out of scope (UI shows "Coming soon")
- FAQ search uses simple relevance sorting: exact title match first, then partial matches
- SLA badge coloring: ≤ 2 min = green "Under 2 min", else blue "About X min"
- Phone number formatted with `tel:` link for native dialer integration

## Testing Checklist

- [x] Navigate to `/support` - page loads with tier badge and account selector
- [x] Priority line card visible for Gold+ tier
- [x] Click "Call now" → confirm dialog opens → tel: link would trigger
- [x] Click "Request callback" → form validates phone/reason/window → success toast
- [x] Click "Start message" → form validates subject/body → character count works → success toast
- [x] Type in FAQ search → debounced filtering → results update in real-time
- [x] Click FAQ article → expands/collapses with smooth animation
- [x] Empty FAQ state: search for nonsense → "No results found" with clear button
- [x] Responsive: mobile vertical stack, desktop two-column layout
- [x] Accessibility: keyboard navigation, focus trap in dialogs, ARIA attributes
- [x] All telemetry events fire correctly
- [x] Validation works: invalid phone, short subject/body, character limits

## Files Created (13)

1. `src/services/support.service.ts` - Service interface and types
2. `src/seed/support.json` - Support profile and FAQ articles
3. `src/design-system/components/Textarea.tsx` - Textarea component
4. `src/components/support/PriorityLineCard.tsx` - Priority line card
5. `src/components/support/CallbackCard.tsx` - Callback request card
6. `src/components/support/SecureMessageCard.tsx` - Secure message card
7. `src/components/support/CallConfirmDialog.tsx` - Call confirmation
8. `src/components/support/CallbackDialog.tsx` - Callback scheduling form
9. `src/components/support/SecureMsgDialog.tsx` - Secure message form
10. `src/components/support/FAQSearchBar.tsx` - FAQ search input
11. `src/components/support/FAQResultsList.tsx` - FAQ results container
12. `src/components/support/ArticleRow.tsx` - FAQ article accordion row
13. `src/app/support/page.tsx` - Main support page

## Files Modified (2)

1. `src/mocks/handlers.ts` - Added support endpoints and window computation helper
2. `src/design-system/index.ts` - Exported Textarea component

## Key Implementation Patterns

**Reused Components**:
- TierChip for tier badge display
- AccountSelector for account context switching
- Button, Input, Label from design system
- Card/CardContent for card layouts
- ToastHost for success/error notifications

**Dialog Pattern**:
- Centered modals with backdrop blur
- Focus trap with initial focus on primary input
- Esc key to close
- Click outside to close
- Return focus to trigger button on close
- Smooth fade/zoom animations

**Debounced Search**:
- Uses `useRef` to track timeout
- 250ms delay before API call
- Clears previous timeout on new input
- Follows pattern from HistorySearchInput

**Form Validation**:
- Real-time validation on blur
- Inline error messages below inputs
- Submit disabled when errors present
- Accessible error binding with aria attributes

## Mobile Optimizations

- Touch-friendly 44px+ targets
- Full-screen dialogs on small screens
- Native select elements for better mobile UX
- `tel:` links open native dialer
- Vertical stacking for easy scrolling
- Optimized keyboard types (`tel`, `search`)

## Performance Considerations

- Debounced search reduces API calls
- Local filtering after initial FAQ load
- Memoized callbacks prevent unnecessary re-renders
- Lazy dialog rendering (only when open)
- Efficient accordion state (single expanded item)

## Future Enhancements (Out of Scope)

- Secure message attachments (file upload)
- Real-time callback status updates (websockets)
- Message thread history
- Voice/video call integration
- Chat widget for live support
- Callback rescheduling
- Priority line queue position display
- Multi-language support for FAQ
- FAQ article feedback (helpful/not helpful)
- Suggested articles based on user behavior

## Design Rationale

**UX**: Clear hierarchy places synchronous options (call) first, followed by scheduled (callback) and asynchronous (message) options. FAQ provides self-service alternative.

**Technical**: Local state keeps support screen independent. MSW handlers simulate realistic API behavior including validation and time-window computation.

**Accessibility**: Full keyboard support and screen reader compatibility ensure all users can access support regardless of input method.

**Scalability**: Feature flags enable gradual rollout. Service facade enables easy backend integration. Component modularity supports future enhancements.

## Related Screens

This screen complements:
- **Home**: Links to support from help icon
- **Rewards**: Support for redemption questions
- **Offers**: Support for activation issues
- **Tiers**: Support for tier qualification questions
- **Goals**: Support for auto-save/round-ups questions
- **Badges**: Support for badge/challenge questions

## Conclusion

The Support screen successfully implements a comprehensive tier-aware support system with multiple contact methods, self-serve FAQ, and clear SLA expectations. All features work as specified with full accessibility support, responsive design, and production-ready patterns. The implementation follows established architecture from previous screens and integrates seamlessly with the existing design system.

