import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationBell from './NotificationBell';
import AuthProvider from '../context/AuthContext';

vi.mock('../utils/notifications', () => ({
  getNotificationPermission: vi.fn(() => 'default'),
  registerPushNotifications: vi.fn(() => Promise.resolve({ success: true, permission: 'granted' })),
}));

describe('NotificationBell Component', () => {
  it('renders notification bell button with X badge when permission is default', () => {
    render(
      <AuthProvider>
        <NotificationBell />
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /ativar notificações/i });
    expect(button).toBeDefined();
    expect(screen.getByText('✕')).toBeDefined();
  });
});
