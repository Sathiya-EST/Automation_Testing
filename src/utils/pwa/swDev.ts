export default function swDev(): void {
  // const SW_URL = `${import.meta.env.VITE_APPLICATION_URL}/sw.js`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration: ServiceWorkerRegistration) => {
        alert('Service worker integrated');
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((err: Error) => {
        console.error('Service Worker registration failed:', err);
      });
  } else {
    console.warn('Service Workers are not supported in this browser.');
  }
}
