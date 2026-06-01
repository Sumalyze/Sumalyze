// src/utils/navigation.ts

export type Page =
  | 'home'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'refund'
  | 'billing'
  | 'data-deletion'
  | 'support'
  | 'tools'
  | 'tooldetail'
  | 'agent'
  | 'workflows'
  | 'usecases'
  | 'history'
  | 'pricing'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'settings';

/**
 * Dispatches a global page navigation event.
 * App.tsx listens to this to perform state-based routing.
 */
export function dispatchAppNavigate(page: Page) {
  window.dispatchEvent(new CustomEvent('sz-navigate', { detail: page }));
}
