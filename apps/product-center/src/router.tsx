import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        path: 'dashboard',
        element: <div>首页看板页面</div>,
      },
      {
        path: 'product',
        element: <div>商品列表页面</div>,
      },
      {
        path: 'product',
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