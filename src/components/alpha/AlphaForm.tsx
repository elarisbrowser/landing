import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Spinner } from '@/components/ui/spinner';
import {
  alphaAgreements,
  alphaCopy,
  alphaQuestions,
  alphaTextFields,
} from '../../config/alpha';
import { useAlphaApplication } from '../../hooks/useAlphaApplication';
import { useMeasuredHeight } from '../../hooks/useMeasuredHeight';
import { ALPHA_MOTION, Animated, loadDelay } from '../../motion';
import { AlphaSuccess } from './AlphaSuccess';
import { ChoiceGroup } from './ChoiceGroup';
import { TextField } from './Field';

const { firstName, email, discord, xHandle, notes } = alphaTextFields;

/** Form rows, in order; each one rises in on the page-load stagger. */
const rows = [
  <div key="identity" className="grid gap-4 sm:grid-cols-2">
    <TextField {...firstName} required />
    <TextField {...email} type="email" required />
  </div>,
  <div key="socials" className="grid gap-4 sm:grid-cols-2">
    <TextField {...discord} required />
    <TextField {...xHandle} prefix="@" />
  </div>,
  <ChoiceGroup key="os" question={alphaQuestions.os} />,
  <ChoiceGroup key="browser" question={alphaQuestions.currentBrowser} />,
  <ChoiceGroup key="test" question={alphaQuestions.testFirst} />,
  <ChoiceGroup key="help" question={alphaQuestions.contribution} />,
  <TextField key="notes" {...notes} multiline rows={2} />,
  <fieldset key="agreements" className="alpha-agreements">
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
  const [contentRef, height] = useMeasuredHeight<HTMLDivElement>();
  const cardRef = useRef<HTMLDivElement>(null);
  const isSuccess = state === 'success';
  const isSubmitting = state === 'submitting';

  // The card shrinks a lot on success; bring its top back into view.
  useEffect(() => {
    const card = cardRef.current;
    if (!isSuccess || !card) return;
    const top = card.getBoundingClientRect().top;
    if (top >= 0) return;
    window.scrollTo({
      top: top + window.scrollY - 96,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [isSuccess, shouldReduceMotion]);

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      animate={{ height }}
      transition={shouldReduceMotion ? { duration: 0 } : ALPHA_MOTION.resize}
      className="alpha-card w-full max-w-xl overflow-hidden text-left text-on-overlay"
    >
      <div ref={contentRef} className="alpha-card-content">
        <AnimatePresence mode="popLayout" initial={false}>
          {isSuccess ? (
            <motion.div key="success">
              <AlphaSuccess />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              aria-label="Elaris alpha application"
              onSubmit={submit}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.98, filter: 'blur(8px)' }
              }
              transition={ALPHA_MOTION.exit}
              className="flex origin-top flex-col gap-6"
            >
              <fieldset
                disabled={isSubmitting}
                className="flex flex-col gap-6 transition-opacity disabled:opacity-60"
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
                  disabled={isSubmitting}
                  className="alpha-submit"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isSubmitting ? 'submitting' : 'idle'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                      className="inline-flex items-center gap-2"
                    >
                      {isSubmitting && (
                        <Spinner className="size-4" aria-hidden="true" />
                      )}
                      {isSubmitting ? alphaCopy.submitting : alphaCopy.submit}
                    </motion.span>
                  </AnimatePresence>
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
    </motion.div>
  );
}
