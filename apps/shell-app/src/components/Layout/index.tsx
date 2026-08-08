import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const { Content } = Layout;

const AdminLayout = () => (
  <Layout className="shell-layout">
    <Header />
    <Content className="shell-content">
      <Outlet />
    </Content>
  </Layout>
);

export default AdminLayout;
