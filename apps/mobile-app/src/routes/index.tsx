import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, useRoutes } from 'react-router-dom';
import MobileLayout from '../components/MobileLayout';

const ProductPage = lazy(() => import('../pages/Product'));
const PaymentPage = lazy(() => import('../pages/Payment'));
const UserPage = lazy(() => import('../pages/User'));

const PageSuspense = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={(
      <div className="page-loading" role="status">
        <span className="page-loading__mark" />
        正在加载业务数据
      </div>
    )}
  >
    {children}
  </Suspense>
);

const routes: RouteObject[] = [
  {
    element: <MobileLayout />,
    children: [
      { index: true, element: <Navigate to="products" replace /> },
      {
        path: 'products',
        element: (
          <PageSuspense>
            <ProductPage />
          </PageSuspense>
        ),
      },
      {
        path: 'payments',
        element: (
          <PageSuspense>
            <PaymentPage />
          </PageSuspense>
        ),
      },
      {
        path: 'users',
        element: (
          <PageSuspense>
            <UserPage />
          </PageSuspense>
        ),
      },
      { path: '*', element: <Navigate to="products" replace /> },
    ],
  },
];

const AppRoutes = () => useRoutes(routes);

export default AppRoutes;
