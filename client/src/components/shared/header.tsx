import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Shirt, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/prints', label: 'Принти' },
  { to: '/configurations', label: 'Мої дизайни' },
];

const ADMIN_ITEMS = [
  { to: '/admin/merch-items', label: 'Товари' },
  { to: '/admin/prints', label: 'Принти' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative flex h-16 items-center text-sm font-medium transition-colors',
    'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:transition-colors',
    isActive ? 'text-foreground after:bg-accent' : 'text-muted-foreground after:bg-transparent hover:text-foreground'
  );

function AdminMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-9 cursor-pointer items-center gap-1 rounded-md border px-3 text-sm font-medium transition-colors hover:border-foreground/40',
          isAdminRoute ? 'border-accent text-accent' : 'text-foreground'
        )}>
        Адмін <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-48 rounded-lg border bg-background p-1 shadow-lg">
          {ADMIN_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex h-9 items-center rounded-md px-3 text-sm transition-colors hover:bg-stage',
                  isActive ? 'font-semibold text-accent' : 'text-foreground'
                )
              }>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-8 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-foreground">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shirt className="size-4" />
          </span>
          <span className="text-base font-bold tracking-tight">НаУОА Merch Studio</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-7 md:flex" aria-label="Основна навігація">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">
          <AdminMenu />
        </div>

        <button
          type="button"
          className="ml-auto cursor-pointer rounded-md p-2 text-foreground hover:bg-stage md:hidden"
          aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t px-4 pb-4 pt-2 md:hidden" aria-label="Мобільна навігація">
          {[...NAV_ITEMS, ...ADMIN_ITEMS.map((i) => ({ ...i, label: `Адмін: ${i.label.toLowerCase()}` }))].map(
            (item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'flex h-11 items-center border-b text-sm',
                    isActive ? 'font-semibold text-accent' : 'text-foreground'
                  )
                }>
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      )}
    </header>
  );
}
