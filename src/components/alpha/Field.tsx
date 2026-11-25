import { type ComponentProps, type ReactNode, useId } from 'react';
import { alphaCopy } from '../../config/alpha';

export const fieldInputClass = 'alpha-input';

export function FieldLabel({
  as: Tag = 'span',
  htmlFor,
  required,
  hint,
  children,
}: {
  as?: 'span' | 'legend' | 'label';
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      htmlFor={Tag === 'label' ? htmlFor : undefined}
      className="flex w-full items-baseline justify-between text-sm text-on-overlay/90"
    >
      {children}
      {(hint || required) && (
        <span className="text-xs text-on-overlay-muted">
          {hint ?? alphaCopy.required}
        </span>
      )}
    </Tag>
  );
}

type TextFieldProps = {
  label: string;
  multiline?: boolean;
  prefix?: string;
} & ComponentProps<'input'> &
  Pick<ComponentProps<'textarea'>, 'rows'>;

export function TextField({
  label,
  multiline,
  prefix,
  required,
  rows = 3,
  ...props
}: TextFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel as="label" htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          required={required}
          className={`${fieldInputClass} resize-none`}
          {...(props as ComponentProps<'textarea'>)}
        />
      ) : prefix ? (
        <span className={`${fieldInputClass} flex items-center gap-0.5`}>
          <span className="text-on-overlay-muted">{prefix}</span>
          <input
            id={id}
            required={required}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-on-overlay-muted"
            {...props}
          />
        </span>
      ) : (
        <input
          id={id}
          required={required}
          className={fieldInputClass}
          {...props}
        />
      )}
    </div>
  );
}
