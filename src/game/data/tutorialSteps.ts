import { TutorialStep } from '@/components/game/TutorialOverlay';
import { useGameStore } from '@/game/store';

export function getTutorialSteps(): TutorialStep[] {
  return [
    {
      id: 'welcome',
      title: 'Bienvenido al Tutorial',
      description: 'Este juego educativo te enseñará cómo funcionan los paraísos fiscales y el lavado de dinero. Aprenderás interactuando con la interfaz. Empecemos.',
      waitForAction: false,
    },
    {
      id: 'select-country',
      title: 'Selecciona un País',
      description: 'Primero, necesitas elegir un paraíso fiscal donde establecer tus estructuras. Haz click en el botón "Seleccionar País" a la izquierda y luego elige un país en el diálogo (por ejemplo, BVI).',
      target: '[data-tutorial-target="country-selector-button"]',
      waitForAction: true,
      checkComplete: () => {
        const selectedCountry = (window as { __selectedCountry?: string | null }).__selectedCountry;
        const dialog = document.querySelector('[data-tutorial-target="country-dialog"]');
        // Check if country is selected AND dialog is closed (user clicked a country)
        return selectedCountry !== null && selectedCountry !== undefined && (!dialog || dialog.getAttribute('data-state') === 'closed');
      },
    },
    {
      id: 'siguiente-after-country',
      title: 'Continúa al Siguiente Paso',
      description: '¡Perfecto! Has seleccionado un país. Ahora haz click en el botón "Siguiente" para continuar.',
      target: '[data-tutorial-target="siguiente-button"]',
      waitForAction: false,
    },
    {
      id: 'select-mechanism',
      title: 'Selecciona un Mecanismo',
      description: 'Ahora necesitas elegir cómo lavarás el dinero. Haz click en el botón "Seleccionar Mecanismo" para ver las opciones disponibles. En el tutorial, verás "Sociedad Fantasma" y "Fideicomiso". Selecciona uno (por ejemplo, Sociedad Fantasma).',
      target: '[data-tutorial-target="mechanism-selector-button"]',
      waitForAction: true,
      checkComplete: () => {
        // Check if TransactionPanel is visible (means a mechanism is selected)
        const transactionPanel = document.querySelector('[data-tutorial-target="transaction-panel"]');
        return transactionPanel !== null && transactionPanel.textContent?.includes('Ejecutar Transacción');
      },
    },
    {
      id: 'siguiente-after-mechanism',
      title: 'Continúa al Siguiente Paso',
      description: '¡Excelente! Has seleccionado un mecanismo. Haz click en el botón "Siguiente" para continuar.',
      target: '[data-tutorial-target="siguiente-button"]',
      waitForAction: false,
    },
    {
      id: 'execute-transaction',
      title: 'Ejecuta tu Primera Transacción',
      description: 'Con un país y mecanismo seleccionados, ahora puedes ejecutar una transacción. En el panel de transacciones, ingresa una cantidad (por ejemplo, $500,000) y haz click en "Ejecutar Transacción".',
      target: '[data-tutorial-target="transaction-panel"]',
      waitForAction: true,
      checkComplete: () => {
        const state = useGameStore.getState();
        return state.transactions.length > 0;
      },
    },
    {
      id: 'siguiente-after-transaction',
      title: 'Continúa al Siguiente Paso',
      description: '¡Bien hecho! Has ejecutado tu primera transacción. Haz click en el botón "Siguiente" para continuar.',
      target: '[data-tutorial-target="siguiente-button"]',
      waitForAction: false,
    },
    {
      id: 'view-dashboard',
      title: 'Monitorea tu Progreso',
      description: 'El Dashboard a la derecha muestra tu progreso. Verás tus fondos, el dinero lavado, y el "Heat" (riesgo). Vigila el Heat - si llega a 100%, pierdes.',
      target: '[data-tutorial-target="dashboard"]',
      waitForAction: false,
    },
    {
      id: 'purchase-asset',
      title: 'Compra un Activo',
      description: 'Con dinero limpio, puedes comprar activos. Ve a la pestaña "Comprar Activos" en el Dashboard. En el tutorial, puedes comprar un Auto de Lujo o un Rolex. Haz click en "Comprar" en uno de ellos.',
      target: '[data-tutorial-target="assets-tab"]',
      waitForAction: true,
      checkComplete: () => {
        const state = useGameStore.getState();
        return state.assets.length > 0;
      },
    },
    {
      id: 'complete',
      title: '¡Tutorial Completado!',
      description: 'Has aprendido los conceptos básicos. Puedes continuar jugando libremente. Recuerda: este juego está basado en casos reales de investigaciones periodísticas sobre paraísos fiscales.',
      waitForAction: false,
    },
  ];
}
