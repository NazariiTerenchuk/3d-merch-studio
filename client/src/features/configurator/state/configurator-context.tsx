import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { MerchItem, SavedConfiguration } from '@/types';
import {
  configuratorReducer,
  createInitialState,
  type ConfiguratorAction,
  type ConfiguratorState,
} from './configurator-reducer';

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  dispatch: Dispatch<ConfiguratorAction>;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | undefined>(undefined);

interface ConfiguratorProviderProps {
  merchItem: MerchItem;
  configuration?: SavedConfiguration | null;
  children: ReactNode;
}

/** Remount (via `key`) to load a different merch item or configuration. */
export function ConfiguratorProvider({ merchItem, configuration, children }: ConfiguratorProviderProps) {
  const [state, dispatch] = useReducer(configuratorReducer, undefined, () =>
    createInitialState(merchItem, configuration)
  );

  return <ConfiguratorContext.Provider value={{ state, dispatch }}>{children}</ConfiguratorContext.Provider>;
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  if (!context) throw new Error('useConfigurator must be used within ConfiguratorProvider');
  return context;
}

export function useSelectedPrint() {
  const { state } = useConfigurator();
  return state.prints.find((p) => p.localId === state.selectedId) ?? null;
}
