# RewardApp Design System (Portable)

This folder contains a portable component library and CSS you can copy into any Cursor Next.js project using Tailwind CSS v4.

## What's included

- `styles.css` — Tokens, base styles, components, and utilities mirroring RewardApp look and feel
- `utils.ts` — `cn` helper using `clsx` + `tailwind-merge`
- `components/` — Core UI: Button, Card, Input, Label, Select, Switch, Badge, Avatar
- `index.ts` — Barrel exports for simple imports

## Requirements

Installed in this repo (match these in target project):

- next 15, react 19
- tailwindcss v4, `@tailwindcss/postcss` plugin, `postcss`
- clsx, tailwind-merge, class-variance-authority
- tw-animate-css (optional but referenced)

Package versions from this machine (approx):

```bash
npm i next@15 react@19 react-dom@19 tailwindcss@^4 @tailwindcss/postcss postcss autoprefixer clsx tailwind-merge class-variance-authority tw-animate-css
```

## Setup in a new Cursor project

1) PostCSS config

Create `postcss.config.mjs`:

```js
const config = { plugins: ["@tailwindcss/postcss"] };
export default config;
```

2) Global CSS

- Add `src/app/globals.css` if not present.
- Import the design-system CSS inside it (recommended), or replace contents entirely.

Option A — import from DS file:

```css
@import "../design-system/styles.css";
```

Option B — copy the entire contents of `design-system/styles.css` into your `globals.css`.

3) Tailwind v4 content (no tailwind.config needed)

Tailwind v4 uses the `@tailwindcss/postcss` plugin and scans files automatically. Ensure CSS includes `@import "tailwindcss";` at the top (already in `styles.css`).

4) Fonts (optional)

The design uses Red Hat Display. You can load it via CSS or Next Fonts. If omitted, system font fallbacks will be used.

5) Copy files

- Copy the entire `design-system/` folder into your target project (e.g., `src/design-system/` or project root).
- Update import paths accordingly.

6) Usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/design-system";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your balance increased this week.</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">View details</Button>
      </CardFooter>
    </Card>
  );
}
```

### Buttons

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
```

### Form Inputs

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" placeholder="you@example.com" />

<Label htmlFor="country">Country</Label>
<Select id="country"><option>USA</option></Select>

<div className="flex items-center gap-2">
  <Switch aria-label="Enable notifications" />
  <span>Enable notifications</span>
  <Badge>New</Badge>
  <Avatar fallback="JS" />
  <Avatar src="/avatar.png" alt="Jane" />
  <Avatar fallback="LX" size={48} />
  <Avatar fallback="AA" className="bg-muted" />
  <Avatar src="/user.jpg" alt="User" className="ring-2 ring-ring" />
  <Avatar fallback="TK" size={28} />
  <Avatar fallback="MR" size={64} className="text-lg" />
  <Avatar fallback="PO" className="bg-secondary text-secondary-foreground" />
</div>
```

## Theming and dark mode

- Tokens are defined as CSS custom properties and used by Tailwind via `@theme inline`.
- Dark mode uses a `.dark` class on the root element.
- Primary CTA color is driven by `--cta-primary` and `--cta-primary-rgb`.

## Notes

- Components are minimal and unopinionated about data/state.
- All styles are Tailwind + CSS vars to keep it portable.


