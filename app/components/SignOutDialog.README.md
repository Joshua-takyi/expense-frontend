# SignOutDialog Component

A reusable, accessible sign-out confirmation dialog component built with HeroUI.

## Features

- ✅ **Accessible**: Proper ARIA labels, keyboard navigation support
- ✅ **Loading States**: Shows loading indicator during sign-out process
- ✅ **Error Handling**: Displays error messages and allows retry
- ✅ **Customizable**: Custom trigger elements and styling
- ✅ **Callbacks**: Success and error callbacks for custom handling
- ✅ **TypeScript**: Full type safety with proper interfaces

## Basic Usage

```tsx
import SignOutDialog from "./components/SignOutDialog";

// Simple usage with default trigger (exit icon button)
<SignOutDialog />;
```

## Advanced Usage

```tsx
import SignOutDialog from './components/SignOutDialog';
import { Button } from '@heroui/react';

// Custom trigger element
<SignOutDialog
  trigger={<Button variant="ghost">Sign Out</Button>}
  onSignOutSuccess={() => {
    console.log('User signed out successfully');
    // Custom logic after sign out
  }}
  onSignOutError={(error) => {
    console.error('Sign out failed:', error);
    // Custom error handling
  }}
/>

// Text trigger with custom styling
<SignOutDialog
  trigger={<span>Leave</span>}
  triggerClassName="text-danger hover:text-danger-600"
/>
```

## Props

| Prop               | Type                     | Default     | Description                                                            |
| ------------------ | ------------------------ | ----------- | ---------------------------------------------------------------------- |
| `trigger`          | `React.ReactNode`        | `undefined` | Custom trigger element. If not provided, uses default exit icon button |
| `triggerClassName` | `string`                 | `""`        | Additional CSS classes for the trigger element                         |
| `onSignOutSuccess` | `() => void`             | `undefined` | Callback fired when sign out is successful                             |
| `onSignOutError`   | `(error: Error) => void` | `undefined` | Callback fired when sign out fails                                     |

## Default Behavior

- **Default Trigger**: A tooltip-wrapped icon button with exit icon
- **Modal Behavior**: Centers on screen with backdrop
- **Error Recovery**: Modal stays open on error to allow retry
- **Loading State**: Button shows loading spinner and disables during request
- **Toast Notifications**: Uses the `useAuth` hook which shows toast messages

## Accessibility Features

- Keyboard navigation support (Enter/Space to activate trigger)
- ARIA labels for screen readers
- Focus management
- Proper color contrast for different states
- Visual loading indicators

## Styling

The component uses HeroUI's design tokens and supports both light and dark themes automatically. Custom styling can be applied via the `triggerClassName` prop or by wrapping in a styled container.

## Dependencies

- `@heroui/react` (Modal, Button, Tooltip components)
- `@radix-ui/react-icons` (ExitIcon)
- Custom `useAuth` hook for authentication logic
