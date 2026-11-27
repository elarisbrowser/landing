import { type FormEvent, useState } from 'react';
import { alphaCopy, OTHER_VALUE } from '../config/alpha';
import { alphaFormsparkEndpoint } from '../config/env';

export type AlphaState = 'idle' | 'submitting' | 'success' | 'error';

type Application = Record<string, string>;

async function send(application: Application) {
  const response = await fetch(alphaFormsparkEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(application),
  });
  if (!response.ok) throw new Error(`Alpha submit failed: ${response.status}`);
}

/** Collects FormData, folding each "<name>Other" text into its choice. */
function toApplication(form: HTMLFormElement): Application {
  const data = new FormData(form);
  const application: Application = {};
  for (const key of new Set(data.keys())) {
    if (key.endsWith('Other')) continue;
    const values = data
      .getAll(key)
      .map((value) => String(value).trim())
      .map((value) =>
        value === OTHER_VALUE
          ? `other: ${String(data.get(`${key}Other`) ?? '').trim()}`
          : value,
      )
      .filter(Boolean);
    application[key] = values.join(', ');
  }
  application.xHandle = (application.xHandle ?? '').replace(/^@/, '');
  if (!application.xHandle) delete application.xHandle;
  application.subject = alphaCopy.emailSubject(application.firstName ?? '');
  return application;
}

export function useAlphaApplication() {
  const [state, setState] = useState<AlphaState>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setState('submitting');
    try {
      await send(toApplication(form));
      setState('success');
    } catch {
      setState('error');
    }
  }

  return { state, submit };
}
