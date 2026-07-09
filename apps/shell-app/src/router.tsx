import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from './components/Layout';
import { lazy, Suspense } from 'react';
import ErrorPage from './components/ErrorPage';

// @ts-expect-error 远程模块引入
const ProductCenter = lazy(() => import('product-center/index'));

const router = createBrowserRouter([
  {
    // 默认加载product
    path: '/product',
    element: <AdminLayout />,
    errorElement: <ErrorPage />, // 全局路由错误捕获
    children: [
      {
        index: true,
        element: <Suspense fallback={<div>加载中...</div>}>
          <ProductCenter />
        </Suspense>,
      },
      {
        path: 'product/list',
        element: <div>商品列表页面</div>,
      },
      {
        path: 'product/category',
        element: <div>商品分类页面</div>,
      },
      {
        path: 'order',
        element: <div>订单管理页面</div>,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}