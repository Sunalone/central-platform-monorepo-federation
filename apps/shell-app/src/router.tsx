import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import AdminLayout from './components/Layout';
import ErrorPage from './components/ErrorPage';

const ProductCenter = lazy(() => import('product-center/index'));
const ProtocolCenter = lazy(() => import('protocol-center/index'));

const RemoteLoading = () => (
  <div className="remote-loading" role="status">
    <span className="remote-loading-mark" />
    <strong>正在连接业务中心</strong>
    <small>首次加载远程模块可能需要几秒</small>
  </div>
);

const RemotePage = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<RemoteLoading />}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/product" replace /> },
      {
        path: 'product',
        element: (
          <RemotePage>
            <ProductCenter />
          </RemotePage>
        ),
      },
      {
        path: 'protocol',
        element: (
          <RemotePage>
            <ProtocolCenter />
          </RemotePage>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
