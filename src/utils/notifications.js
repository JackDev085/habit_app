import api from '../../api/api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported on this browser');
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted for notifications');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Check if subscription already exists
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      const vapidRes = await api.get('/notifications/vapid-public-key');
      const vapidPublicKey = vapidRes.data.public_key;
      if (!vapidPublicKey) {
        console.error('VAPID public key not found');
        return;
      }

      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
    }

    // Always send/update subscription details to backend in case it changed or for user association
    await api.post('/notifications/subscribe', subscription);
    console.log('Push notification subscribed successfully');
  } catch (error) {
    console.error('Error during push subscription:', error);
  }
}
