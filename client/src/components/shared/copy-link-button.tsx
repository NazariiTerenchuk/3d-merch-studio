import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { toast } from '@/lib/toast';

interface CopyLinkButtonProps extends Omit<ButtonProps, 'onClick'> {
  url: string;
  label?: string;
}

export function CopyLinkButton({ url, label = 'Копіювати посилання', ...props }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Посилання скопійовано');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Не вдалося скопіювати. Скопіюйте вручну: ' + url);
    }
  };

  return (
    <Button variant="outline" onClick={copy} {...props}>
      {copied ? <Check /> : <Link2 />}
      {label}
    </Button>
  );
}
