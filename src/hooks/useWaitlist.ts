import { useWaitlist as useClerkWaitlist } from '@clerk/react';
import { type FormEvent, useState } from 'react';
import { isClerkEnabled } from '../config/env';
import { WAITLIST_COPY } from '../constants/waitlist';

type JoinWaitlist = (emailAddress: string) => Promise<void>;

function useClerkJoin(): JoinWaitlist {
  const { waitlist } = useClerkWaitlist();
  return async (emailAddress) => {
    const { error } = await waitlist.join({ emailAddress });
    if (error) throw error;
  };
}

/** Local stand-in so the flow works in dev without a Clerk key. */
function useMockJoin(): JoinWaitlist {
  return async (emailAddress) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info(`[waitlist:mock] joined ${emailAddress}`);
  };
}

// Chosen once at module load, so hook order stays stable between renders.
const useJoin = isClerkEnabled ? useClerkJoin : useMockJoin;

export type WaitlistState = 'idle' | 'submitting' | 'success' | 'error';

export function useWaitlist() {
  const join = useJoin();
  const [state, setState] = useState<WaitlistState>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailField = form.elements.namedItem('email');

    if (
      !(emailField instanceof HTMLInputElement) ||
      !emailField.validity.valid
    ) {
      setValidationError(
        emailField instanceof HTMLInputElement &&
          emailField.validity.valueMissing
          ? WAITLIST_COPY.emailRequired
          : WAITLIST_COPY.emailInvalid,
      );
      if (emailField instanceof HTMLInputElement) {
        emailField.focus();
      }
      return;
    }

    setValidationError(null);
    setState('submitting');

    try {
      await join(emailField.value.trim().toLowerCase());

      form.reset();
      setState('success');
    } catch {
      setState('error');
    }
  }

  function clearValidationError() {
    if (validationError) setValidationError(null);
  }

  return { state, submit, validationError, clearValidationError };
}
