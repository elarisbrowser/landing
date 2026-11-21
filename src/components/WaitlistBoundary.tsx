import { ClerkProvider } from '@clerk/react';
import type { ReactNode } from 'react';
import { clerkPublishableKey } from '../config/env';

/** Scopes Clerk to the waitlist so it stays out of the main bundle. */
export function WaitlistBoundary({ children }: { children: ReactNode }) {
  if (!clerkPublishableKey) return children;
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {children}
    </ClerkProvider>
  );
}
