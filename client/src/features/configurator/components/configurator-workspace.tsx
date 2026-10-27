import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { Tabs } from '@/components/ui/tabs';
import { CopyLinkButton } from '@/components/shared/copy-link-button';
import { shareUrl } from '@/features/configurations';
import type { SavedConfiguration } from '@/types';
import { useConfigurator } from '../state/configurator-context';
import { CanvasPlaceholder } from './canvas-placeholder';
import { ColorPalette } from './color-palette';
import { PlacedPrintsList } from './placed-prints-list';
import { PrintPicker } from './print-picker';
import { PrintSettingsPanel } from './print-settings-panel';
import { SaveConfigurationDialog } from './save-configuration-dialog';

type PanelTab = 'color' | 'prints' | 'layers';

interface ConfiguratorWorkspaceProps {
  onSaved: (configuration: SavedConfiguration, isNew: boolean) => void;
}

/** Stage on the left, one tabbed panel on the right with the save action pinned to its bottom. */
export function ConfiguratorWorkspace({ onSaved }: ConfiguratorWorkspaceProps) {
  const { state, dispatch } = useConfigurator();
  const [tab, setTab] = useState<PanelTab>('color');
  const [saveOpen, setSaveOpen] = useState(false);
  const isSaved = state.configurationId !== null;

  const tabs = [
    { value: 'color' as const, label: 'Колір' },
    { value: 'prints' as const, label: 'Принти' },
    { value: 'layers' as const, label: 'Шари', count: state.prints.length },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="size-4" /> Каталог
          </Link>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{state.merchItem.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{isSaved ? state.name : 'Новий дизайн'}</Badge>
            {state.isDirty && <Badge variant="accent">Є незбережені зміни</Badge>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => dispatch({ type: 'reset' })} disabled={!state.isDirty}>
            <RotateCcw /> Скасувати зміни
          </Button>
          {state.shareCode && <CopyLinkButton url={shareUrl(state.shareCode)} label="Поділитися" />}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <CanvasPlaceholder
          onPrintSelected={() => setTab('layers')}
          className="min-h-[460px] lg:sticky lg:top-24 lg:h-[calc(100vh-12rem)] lg:min-h-[580px]"
        />

        <Panel className="flex flex-col overflow-hidden lg:h-[calc(100vh-12rem)] lg:min-h-[580px]">
          <Tabs label="Налаштування дизайну" idPrefix="cfg" options={tabs} value={tab} onChange={setTab} />

          <div
            id={`cfg-panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`cfg-tab-${tab}`}
            className="flex-1 space-y-6 overflow-y-auto p-5">
            {tab === 'color' && <ColorPalette />}
            {tab === 'prints' && <PrintPicker onAdded={() => setTab('layers')} />}
            {tab === 'layers' && (
              <>
                <PlacedPrintsList onEmptyAction={() => setTab('prints')} />
                {state.prints.length > 0 && (
                  <div className="border-t pt-5">
                    <PrintSettingsPanel />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t p-4">
            <Button size="lg" className="w-full" onClick={() => setSaveOpen(true)} disabled={isSaved && !state.isDirty}>
              {isSaved ? (state.isDirty ? 'Зберегти зміни' : 'Усі зміни збережено') : 'Зберегти дизайн'}
            </Button>
          </div>
        </Panel>
      </div>

      <SaveConfigurationDialog open={saveOpen} onOpenChange={setSaveOpen} onSaved={onSaved} />
    </div>
  );
}
