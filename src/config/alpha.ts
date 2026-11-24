/** Value used by every choice group for its free-text "Other" option. */
export const OTHER_VALUE = 'other';

export type ChoiceOption = { value: string; label: string };

export type ChoiceQuestion = {
  name: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  required?: boolean;
  /** Adds an "Other" chip that reveals a text field. */
  allowOther?: boolean;
  options: readonly ChoiceOption[];
};

export const alphaCopy = {
  eyebrow: 'Alpha programme',
  title: 'Test elaris early.',
  description:
    'We’re opening the alpha to a small group of testers. Tell us a little about you and we’ll be in touch.',
  submit: 'Apply for alpha',
  submitting: 'Sending application…',
  successTitle: 'Application received.',
  successBody:
    'Thanks for applying. We’ll email you when your alpha build is ready.',
  error: 'Something went wrong. Please try again.',
  required: 'Required',
  otherPlaceholder: 'Tell us more',
  backHome: 'Back to home',
  agreementsLabel: 'Before you apply',
  /** Subject line of the Formspree notification email. */
  emailSubject: (firstName: string) => `Elaris alpha application: ${firstName}`,
} as const;

/** Every box must be ticked before the form submits. */
export const alphaAgreements = [
  'I made sure my Discord username and all other information is correct.',
  'I understand that sharing the alpha build is prohibited.',
  'I understand this is an alpha version, which is very unfinished and may look completely different from the stable release.',
] as const;

export const alphaTextFields = {
  firstName: {
    name: 'firstName',
    label: 'First name',
    placeholder: 'Ada',
    autoComplete: 'given-name',
  },
  email: {
    name: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
  discord: {
    name: 'discord',
    label: 'Discord username',
    placeholder: 'ada.dev',
    autoComplete: 'off',
  },
  xHandle: {
    name: 'xHandle',
    label: 'X handle',
    placeholder: 'elarisbrowser',
    autoComplete: 'off',
  },
  notes: {
    name: 'notes',
    label: 'Anything else?',
    placeholder: 'Hardware, setup, what you’d love to see…',
  },
} as const;

export const alphaQuestions = {
  os: {
    name: 'os',
    label: 'Operating system',
    required: true,
    options: [
      { value: 'macos', label: 'macOS' },
      { value: 'linux', label: 'Linux' },
    ],
  },
  currentBrowser: {
    name: 'currentBrowser',
    label: 'Current main browser',
    allowOther: true,
    options: [
      { value: 'chrome', label: 'Chrome' },
      { value: 'safari', label: 'Safari' },
      { value: 'firefox', label: 'Firefox' },
      { value: 'arc', label: 'Arc' },
      { value: 'brave', label: 'Brave' },
      { value: 'helium', label: 'Helium' },
      { value: 'ladybird', label: 'Ladybird' },
    ],
  },
  testFirst: {
    name: 'testFirst',
    label: 'What will you test first?',
    required: true,
    allowOther: true,
    options: [
      { value: 'daily-browsing', label: 'Everyday browsing' },
      { value: 'performance', label: 'Speed & performance' },
      { value: 'privacy', label: 'Privacy & tracking' },
      { value: 'compatibility', label: 'Site compatibility' },
      { value: 'devtools', label: 'Developer tools' },
    ],
  },
  contribution: {
    name: 'contribution',
    label: 'How will you help us?',
    hint: 'Pick any',
    multiple: true,
    required: true,
    allowOther: true,
    options: [
      { value: 'bug-reports', label: 'Report bugs' },
      { value: 'feedback', label: 'Detailed feedback' },
      { value: 'daily-driver', label: 'Use it daily' },
      { value: 'share', label: 'Share on X' },
      { value: 'code', label: 'Contribute code' },
    ],
  },
} as const satisfies Record<string, ChoiceQuestion>;
