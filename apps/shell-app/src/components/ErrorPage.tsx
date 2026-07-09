import { useRouteError, Link } from 'react-router-dom';

type RouteError = {
    status?: number;
    statusText?: string;
    message?: string;
};

const ErrorPage = () => {
    const error = useRouteError() as RouteError;
    console.error('路由捕获错误：', error);

    // 区分404页面不存在 / 代码运行报错
    const is404 = error.status === 404;

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            gap: 16
        }}>
            <h1 style={{ fontSize: 48, margin: 0, color: is404 ? '#666' : '#f53f3f' }}>
                {is404 ? '404' : '页面加载异常'}
            </h1>
            <p style={{ color: '#888' }}>
                {is404 ? '访问的页面不存在，请检查地址是否正确' : error.message || '程序运行发生未知错误'}
            </p>
            <Link to="/" style={{ padding: '8px 16px', background: '#165dff', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>
                返回首页
            </Link>
        </div>
    );
};

export default ErrorPage;