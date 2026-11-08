/** @type {import('stylelint').Config} */
const stylelintConfig = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  ignoreFiles: ['.next/**', 'out/**', 'build/**', 'coverage/**', 'node_modules/**'],
  rules: {
    // Component classes are camelCase (styles.primaryButton). See CLAUDE.md.
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Expected class name to be camelCase (CSS Modules convention)' },
    ],
    // CSS Modules: allow :global()/:local() and Sass `:export` blocks.
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local', 'export'] },
    ],
    'property-no-unknown': [true, { ignoreSelectors: [':export'] }],
    // Keep specificity predictable.
    'declaration-no-important': true,
    'selector-max-id': 0,
    // Token variables use the --color-*, --space-* style, which the default
    // kebab-case pattern already allows; Sass variables stay kebab-case too.
  },
  overrides: [
    {
      // Hardcoded colors are only allowed where tokens are defined.
      files: ['src/**/*.module.{css,scss}'],
      rules: {
        'color-no-hex': [
          true,
          { message: 'Use a color token (var(--color-*)) instead of a hex value' },
        ],
      },
    },
    {
      // Global stylesheet and Sass helpers: element selectors and kebab-case classes are fine.
      files: ['src/app/globals.{css,scss}', 'src/styles/**/*.scss'],
      rules: {
        'selector-class-pattern': null,
      },
    },
  ],
};

export default stylelintConfig;
