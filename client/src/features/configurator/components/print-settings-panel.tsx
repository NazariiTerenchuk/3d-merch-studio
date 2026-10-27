import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PLACEMENTS, PRINT_LIMITS } from '@/constants/placements';
import type { PrintPlacement } from '@/types';
import { useConfigurator, useSelectedPrint } from '../state/configurator-context';
import type { PrintPatch } from '../state/configurator-reducer';

interface SliderRowProps {
  id: string;
  label: string;
  value: number;
  format: (value: number) => string;
  limits: { min: number; max: number; step: number };
  onChange: (value: number) => void;
}

function SliderRow({ id, label, value, format, limits, onChange }: SliderRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm tabular-nums text-muted-foreground">{format(value)}</span>
      </div>
      <Slider id={id} value={value} onValueChange={onChange} {...limits} />
    </div>
  );
}

export function PrintSettingsPanel() {
  const { state, dispatch } = useConfigurator();
  const print = useSelectedPrint();

  if (!print) {
    return (
      <p className="text-sm text-muted-foreground">
        Виберіть принт у списку або натисніть на нього на виробі, щоб змінити розмір і положення.
      </p>
    );
  }

  const update = (patch: PrintPatch) => dispatch({ type: 'update-print', localId: print.localId, patch });
  const ordered = [...state.prints].sort((a, b) => a.zIndex - b.zIndex);
  const layerIndex = ordered.findIndex((p) => p.localId === print.localId);
  const hasHood = state.merchItem.category === 'Худі';

  return (
    <section className="space-y-5" aria-labelledby="settings-title">
      <div className="flex items-center justify-between gap-2">
        <h3 id="settings-title" className="truncate text-base font-bold">
          {print.name}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => update({ offsetX: 0, offsetY: 0, scale: 1, rotation: 0 })}>
          <RotateCcw /> Вирівняти
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="print-placement">Де розмістити</Label>
        <Select
          id="print-placement"
          value={print.placement}
          onChange={(e) => update({ placement: e.target.value as PrintPlacement })}>
          {PLACEMENTS.filter((p) => p.value !== 'hood' || hasHood).map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </div>

      <SliderRow
        id="print-scale"
        label="Розмір"
        value={print.scale}
        limits={PRINT_LIMITS.scale}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={(scale) => update({ scale })}
      />
      <SliderRow
        id="print-offset-x"
        label="Зсув вліво-вправо"
        value={print.offsetX}
        limits={PRINT_LIMITS.offset}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={(offsetX) => update({ offsetX })}
      />
      <SliderRow
        id="print-offset-y"
        label="Зсув вгору-вниз"
        value={print.offsetY}
        limits={PRINT_LIMITS.offset}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={(offsetY) => update({ offsetY })}
      />
      <SliderRow
        id="print-rotation"
        label="Поворот"
        value={print.rotation}
        limits={PRINT_LIMITS.rotation}
        format={(v) => `${v}°`}
        onChange={(rotation) => update({ rotation })}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Порядок шарів</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={layerIndex >= ordered.length - 1}
            onClick={() => dispatch({ type: 'move-layer', localId: print.localId, direction: 'up' })}>
            <ArrowUp /> Вище
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={layerIndex <= 0}
            onClick={() => dispatch({ type: 'move-layer', localId: print.localId, direction: 'down' })}>
            <ArrowDown /> Нижче
          </Button>
        </div>
      </div>
    </section>
  );
}
