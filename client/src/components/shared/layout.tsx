import { Outlet } from 'react-router-dom';
import { Header } from './header';

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-[1320px] px-4 py-6 text-sm text-muted-foreground sm:px-6">
          Національний університет «Острозька академія»
        </div>
      </footer>
    </div>
  );
};
