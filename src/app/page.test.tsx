import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import Home from './page';

test('home page renders', () => {
  render(<Home />);
  expect(screen.getByText('Hello World')).toBeDefined();
});
