import { Chip } from '@/components/ui/chip';

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

/** Empty string means "all". */
export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Фільтр за категорією">
      {['', ...categories].map((category) => (
        <Chip key={category || 'all'} selected={value === category} onClick={() => onChange(category)}>
          {category || 'Усі'}
        </Chip>
      ))}
    </div>
  );
}
