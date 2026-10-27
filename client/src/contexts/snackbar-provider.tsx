import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarMessage {
  id: string;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  show: (message: string, type?: SnackbarType, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
  return context;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const removeSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addSnackbar = useCallback(
    (message: string, type: SnackbarType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setSnackbars((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => removeSnackbar(id), duration);
      }
    },
    [removeSnackbar]
  );

  // Listen for global events from non-react code (lib/toast.ts)
  useEffect(() => {
    const handleCustomEvent = (e: CustomEvent<{ message: string; type: SnackbarType }>) => {
      addSnackbar(e.detail.message, e.detail.type);
    };
    window.addEventListener('show-snackbar', handleCustomEvent as EventListener);
    return () => window.removeEventListener('show-snackbar', handleCustomEvent as EventListener);
  }, [addSnackbar]);

  return (
    <SnackbarContext.Provider value={{ show: addSnackbar }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {snackbars.map((snackbar) => (
          <div
            key={snackbar.id}
            className={cn(
              'pointer-events-auto flex min-w-[280px] max-w-[400px] items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg',
              snackbar.type === 'success' && 'bg-foreground',
              snackbar.type === 'error' && 'bg-destructive',
              snackbar.type === 'info' && 'bg-foreground'
            )}>
            <div className="shrink-0">
              {snackbar.type === 'success' && <CheckCircle className="size-5" />}
              {snackbar.type === 'error' && <AlertCircle className="size-5" />}
              {snackbar.type === 'info' && <Info className="size-5" />}
            </div>

            <p className="flex-1 text-sm">{snackbar.message}</p>

            <button
              type="button"
              aria-label="Закрити"
              onClick={() => removeSnackbar(snackbar.id)}
              className="shrink-0 cursor-pointer rounded-full p-1 transition-colors hover:bg-white/20">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}
