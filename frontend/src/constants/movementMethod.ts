export const MovementMethod = {
  Teleport: 'Teleport',
  Route: 'Route',
} as const;

export type MovementMethod = typeof MovementMethod[keyof typeof MovementMethod];
