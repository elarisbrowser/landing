export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

/** Without a Clerk key the waitlist runs in a local mock mode (dev only). */
export const isClerkEnabled = Boolean(clerkPublishableKey);

if (!isClerkEnabled && import.meta.env.PROD) {
  console.warn('VITE_CLERK_PUBLISHABLE_KEY is missing; waitlist is disabled.');
}

/** Public Formspark form ID used for alpha applications. */
export const alphaFormsparkFormId =
  (import.meta.env.VITE_ALPHA_FORMSPARK_FORM_ID as string | undefined) ??
  '8k0QdlVkp';

export const alphaFormsparkEndpoint = `https://submit-form.com/${alphaFormsparkFormId}`;
