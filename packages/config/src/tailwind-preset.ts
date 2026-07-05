import type { Config } from 'tailwindcss';

/**
 * Shared design tokens (CLAUDE.md rule 7). ember-gold is background/chip
 * ONLY — never used as a text color by consuming apps.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        cloudlight: '#F6F2E7',
        'ember-core': '#A83E1B',
        'ember-gold': '#E0A537',
        'hearth-ink': '#2C231C',
        'ash-stone': '#C9C0AF',
        'verdigris-sky': '#3E6E64',
        'border-interactive': '#8F8672'
      },
      borderRadius: {
        card: '12px',
        pill: '999px'
      },
      fontFamily: {
        display: ['Syne', 'ui-sans-serif', 'system-ui'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui']
      }
    }
  }
};

export default preset;
