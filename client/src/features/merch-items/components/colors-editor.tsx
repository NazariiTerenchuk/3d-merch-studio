import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;
const MAX_COLORS = 20;

interface ColorsEditorProps {
  value: string[];
  onChange: (colors: string[]) => void;
  id?: string;
}

export function ColorsEditor({ value, onChange, id }: ColorsEditorProps) {
  const [draft, setDraft] = useState('#2F4BFF');
  const normalizedDraft = draft.toUpperCase();
  const canAdd = HEX_REGEX.test(draft) && !value.includes(normalizedDraft) && value.length < MAX_COLORS;

  const add = () => {
    if (canAdd) onChange([...value, normalizedDraft]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.length === 0 && <p className="text-sm text-muted-foreground">Додайте хоча б один колір</p>}
        {value.map((color) => (
          <span
            key={color}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-background pl-1 pr-1.5 text-xs">
            <span className="size-6 rounded-full ring-1 ring-inset ring-black/12" style={{ backgroundColor: color }} />
            <span className="tabular-nums">{color}</span>
            <button
              type="button"
              aria-label={`Видалити колір ${color}`}
              onClick={() => onChange(value.filter((c) => c !== color))}
              className="cursor-pointer rounded-full p-0.5 text-muted-foreground hover:bg-stage hover:text-foreground">
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Вибрати колір"
          value={HEX_REGEX.test(draft) ? draft : '#000000'}
          onChange={(e) => setDraft(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-md border border-input bg-background p-1"
        />
        <Input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="#RRGGBB"
          className="w-32 tabular-nums"
          maxLength={7}
        />
        <Button variant="outline" onClick={add} disabled={!canAdd}>
          <Plus /> Додати
        </Button>
      </div>
    </div>
  );
}
