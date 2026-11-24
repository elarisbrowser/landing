import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import {
  alphaCopy,
  type ChoiceQuestion,
  OTHER_VALUE,
} from '../../config/alpha';
import { FieldLabel, fieldInputClass } from './Field';

/** Pill-style radio/checkbox group with an optional free-text "Other". */
export function ChoiceGroup({ question }: { question: ChoiceQuestion }) {
  const shouldReduceMotion = useReducedMotion();
  const [otherSelected, setOtherSelected] = useState(false);
  const type = question.multiple ? 'checkbox' : 'radio';
  const options = question.allowOther
    ? [...question.options, { value: OTHER_VALUE, label: 'Other' }]
    : question.options;

  return (
    <fieldset className="flex flex-col gap-2.5">
      <FieldLabel as="legend" required={question.required} hint={question.hint}>
        {question.label}
      </FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <label key={option.value} className="alpha-chip pressable">
            <input
              type={type}
              name={question.name}
              value={option.value}
              // Radios share one required flag; checkboxes are checked on submit.
              required={question.required && !question.multiple && index === 0}
              onChange={(event) => {
                const form = event.currentTarget.form;
                const other = form?.querySelector<HTMLInputElement>(
                  `input[name="${question.name}"][value="${OTHER_VALUE}"]`,
                );
                setOtherSelected(Boolean(other?.checked));
                if (question.multiple && question.required && form) {
                  syncRequiredCheckboxes(form, question.name);
                }
              }}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {/* Required checkbox groups use a hidden proxy for native validation. */}
      {question.multiple && question.required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          data-proxy-for={question.name}
          className="pointer-events-none h-0 w-full opacity-0"
          onInvalid={(event) =>
            event.currentTarget.setCustomValidity('Pick at least one option')
          }
        />
      )}
      <AnimatePresence initial={false}>
        {otherSelected && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.22,
              ease: 'easeOut',
            }}
            className="overflow-hidden"
          >
            <input
              name={`${question.name}Other`}
              aria-label={`${question.label} (other)`}
              placeholder={alphaCopy.otherPlaceholder}
              required
              className={fieldInputClass}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
}

function syncRequiredCheckboxes(form: HTMLFormElement, name: string) {
  const anyChecked = Boolean(
    form.querySelector(`input[name="${name}"]:checked`),
  );
  const proxy = form.querySelector<HTMLInputElement>(
    `input[data-proxy-for="${name}"]`,
  );
  if (!proxy) return;
  proxy.value = anyChecked ? 'ok' : '';
  proxy.setCustomValidity('');
}
