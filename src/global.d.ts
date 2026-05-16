declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

// Extend the global Window interface with custom snake game functions
declare global {
  interface Window {
    snakeRunAdsThenStartGame?: () => void;
    snakeResetAdsFlow?: () => void;
    snakeStartGame?: () => void;
    google?: any;
  }
}

// This export makes TypeScript treat this file as a module,
// allowing the global augmentation above to work
export {};