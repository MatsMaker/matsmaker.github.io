// Extend the global Window interface with custom snake game functions
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
    
    // LG webOS TV platform APIs
    webOSDev?: {
      LGUDID?: string;
      keyboardHook?: {
        registerKey: (keyName: string) => void;
      };
    };
    
    // Legacy LG webOS (1.x - 2.x)
    PalmSystem?: {
      keyMask?: number;
    };
    
    // Very old LG NetCast platform
    NetCastSetKeys?: (mask: number) => void;
    
    // TV key event diagnostics
    tvKeyEventCount?: number;
    tvLastKey?: string;
  }
}

// This export makes TypeScript treat this file as a module,
// allowing the global augmentation above to work
export {};