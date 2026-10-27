import { ColorSwatch } from '@/components/shared/color-swatch';
import { useConfigurator } from '../state/configurator-context';

export function ColorPalette() {
  const { state, dispatch } = useConfigurator();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Вибраний колір <span className="font-semibold tabular-nums text-foreground">{state.baseColor}</span>
      </p>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Колір виробу">
        {state.merchItem.availableColors.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            size="lg"
            selected={state.baseColor === color}
            onClick={() => dispatch({ type: 'set-color', color })}
          />
        ))}
      </div>
    </div>
  );
}
