import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test crash');
};

describe('ErrorBoundary Component', () => {
  it('renders fallback error UI when a component throws', () => {
    // Suppress console.error during expected test error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Algo deu errado/i)).toBeDefined();
    expect(screen.getByText(/Test crash/i)).toBeDefined();

    spy.mockRestore();
  });
});
