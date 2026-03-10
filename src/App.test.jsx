import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(true).toBe(true);
  });
});
