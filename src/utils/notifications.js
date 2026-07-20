import api from '../../api/api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function getNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return 'unsupported';
  }
  return Notification.permission; // 'granted', 'denied', or 'default'
}

export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    console.warn('Push notifications are not supported on this browser');
    return { success: false, permission: 'unsupported' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted for notifications');
      return { success: false, permission };
    }

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.log('No service worker registered, registering /sw.js...');
      registration = await navigator.serviceWorker.register('/sw.js');
    }

    // Wait for the service worker to become ready
    registration = await navigator.serviceWorker.ready;

    // Busca a chave pública atual do servidor
    const vapidRes = await api.get('/notifications/vapid-public-key');
    const vapidPublicKey = vapidRes.data.public_key;
    if (!vapidPublicKey) {
      console.error('VAPID public key not found');
      return { success: false, permission, error: 'Chave VAPID não encontrada' };
    }

    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

    // Verifica se já existe uma assinatura no browser
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Compara a chave armazenada com a chave atual do servidor
      // Se a chave VAPID rotacionou, a assinatura antiga é inválida → re-inscreve
      const existingKeyBytes = new Uint8Array(subscription.options.applicationServerKey);
      const keysMatch =
        existingKeyBytes.length === convertedKey.length &&
        existingKeyBytes.every((byte, i) => byte === convertedKey[i]);

      if (!keysMatch) {
        console.log('Chave VAPID mudou — cancelando assinatura antiga e re-inscrevendo...');
        await subscription.unsubscribe();
        subscription = null;
      }
    }

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
    }

    // Envia/atualiza a assinatura no backend
    await api.post('/notifications/subscribe', subscription.toJSON());
    console.log('Push notification subscribed successfully');
    return { success: true, permission: 'granted' };
  } catch (error) {
    console.error('Error during push subscription:', error);
    return { success: false, permission: Notification.permission, error };
  }
}

