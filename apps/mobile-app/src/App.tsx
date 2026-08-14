import ConfigProvider from 'antd-mobile/es/components/config-provider';
import AppRoutes from './routes';
import './styles/index.css';

const App = () => (
  <ConfigProvider>
    <AppRoutes />
  </ConfigProvider>
);

export default App;
