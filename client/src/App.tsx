import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from '@/lib/react-query';
import { SnackbarProvider } from '@/contexts/snackbar-provider';
import { AppRoutes } from '@/routes/app-routes';

function App() {
  return (
    <QueryProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </QueryProvider>
  );
}

export default App;
