import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/shared/layout';
import { CatalogPage } from '@/pages/catalog-page';
import { PrintsPage } from '@/pages/prints-page';
import { ConfiguratorPage } from '@/pages/configurator-page';
import { SharedConfigurationPage } from '@/pages/shared-configuration-page';
import { MyConfigurationsPage } from '@/pages/my-configurations-page';
import { AdminMerchItemsPage } from '@/pages/admin/admin-merch-items-page';
import { AdminPrintsPage } from '@/pages/admin/admin-prints-page';
import { NotFoundPage } from '@/pages/not-found-page';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/prints" element={<PrintsPage />} />
        <Route path="/configurator/:merchItemId" element={<ConfiguratorPage />} />
        <Route path="/configurations" element={<MyConfigurationsPage />} />
        <Route path="/c/:shareCode" element={<SharedConfigurationPage />} />

        {/* No auth during the practice stage, admin pages are open */}
        <Route path="/admin" element={<Navigate to="/admin/merch-items" replace />} />
        <Route path="/admin/merch-items" element={<AdminMerchItemsPage />} />
        <Route path="/admin/prints" element={<AdminPrintsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
