export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

/** Without a Clerk key the waitlist runs in a local mock mode (dev only). */
export const isClerkEnabled = Boolean(clerkPublishableKey);

if (!isClerkEnabled && import.meta.env.PROD) {
  console.warn('VITE_CLERK_PUBLISHABLE_KEY is missing; waitlist is disabled.');
}

/** Where alpha applications are POSTed as JSON (e.g. a Formspree endpoint). */
export const alphaFormEndpoint = import.meta.env.VITE_ALPHA_FORM_ENDPOINT as
  | string
  | undefined;

if (!alphaFormEndpoint && import.meta.env.PROD) {
  console.warn('VITE_ALPHA_FORM_ENDPOINT is missing; alpha form is disabled.');
}
