import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Spinner } from '@/components/ui/spinner';
import {
  alphaAgreements,
  alphaCopy,
  alphaQuestions,
  alphaTextFields,
} from '../../config/alpha';
import { xLink } from '../../config/site';
import { useAlphaApplication } from '../../hooks/useAlphaApplication';
import { Animated, loadDelay } from '../../motion';
import { ChoiceGroup } from './ChoiceGroup';
import { TextField } from './Field';

const { firstName, email, discord, xHandle, notes } = alphaTextFields;

/** Form rows, in order; each one rises in on the page-load stagger. */
const rows = [
  <div key="identity" className="grid gap-5 sm:grid-cols-2">
    <TextField {...firstName} required />
    <TextField {...email} type="email" required />
  </div>,
  <div key="socials" className="grid gap-5 sm:grid-cols-2">
    <TextField {...discord} required />
    <TextField {...xHandle} prefix="@" />
  </div>,
  <ChoiceGroup key="os" question={alphaQuestions.os} />,
  <ChoiceGroup key="browser" question={alphaQuestions.currentBrowser} />,
  <ChoiceGroup key="test" question={alphaQuestions.testFirst} />,
  <ChoiceGroup key="help" question={alphaQuestions.contribution} />,
  <TextField key="notes" {...notes} multiline />,
  <fieldset key="agreements" className="flex flex-col gap-3">
    <legend className="sr-only">{alphaCopy.agreementsLabel}</legend>
    {alphaAgreements.map((agreement) => (
      <label key={agreement} className="alpha-check">
        {/* Unnamed: required to submit, but not sent with the application. */}
        <input type="checkbox" required />
        <span>{agreement}</span>
      </label>
    ))}
  </fieldset>,
];

const FIRST_ROW_STEP = 4;

export function AlphaForm() {
  const shouldReduceMotion = useReducedMotion();
  const { state, submit } = useAlphaApplication();
  const swap = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="alpha-card w-full max-w-xl text-left text-on-overlay">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'success' ? (
          <motion.div
            key="success"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 8, filter: 'blur(6px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={swap}
            className="flex flex-col items-center gap-2 py-10 text-center"
            role="status"
            aria-live="polite"
          >
            <h2 className="font-heading text-2xl tracking-tight">
              {alphaCopy.successTitle}
            </h2>
            <p className="max-w-sm text-pretty text-on-overlay/80">
              {alphaCopy.successBody}
            </p>
            <a
              href={xLink.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-sm text-on-overlay/85 underline decoration-on-overlay/50 underline-offset-4 transition-colors hover:decoration-on-overlay"
            >
              Follow @elarisbrowser on X →
            </a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            aria-label="Elaris alpha application"
            onSubmit={submit}
            exit={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: -8, filter: 'blur(6px)' }
            }
            transition={swap}
            className="flex flex-col gap-7"
          >
            <fieldset
              disabled={state === 'submitting'}
              className="flex flex-col gap-7 disabled:opacity-60"
            >
              {rows.map((row, index) => (
                <Animated
                  key={row.key}
                  preset="rise"
                  delay={loadDelay(FIRST_ROW_STEP + index)}
                >
                  {row}
                </Animated>
              ))}
            </fieldset>
            <Animated
              preset="rise"
              delay={loadDelay(FIRST_ROW_STEP + rows.length)}
              className="flex flex-col items-stretch gap-3"
            >
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="alpha-submit"
              >
                {state === 'submitting' ? (
                  <>
                    <Spinner className="size-4" aria-hidden="true" />
                    {alphaCopy.submitting}
                  </>
                ) : (
                  alphaCopy.submit
                )}
              </button>
              {state === 'error' && (
                <p
                  role="alert"
                  className="text-center text-sm text-destructive"
                >
                  {alphaCopy.error}
                </p>
              )}
            </Animated>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
