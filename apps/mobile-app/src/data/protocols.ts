import type { ProductProtocol } from '../types/business';

export const productProtocolCatalog = {
  enterpriseService: {
    id: 'AGR-2026-001',
    name: '企业产品服务协议',
    version: 'V3.2',
    fileName: 'enterprise-product-service-agreement.pdf',
  },
  dataSecurity: {
    id: 'AGR-2026-006',
    name: '数据安全补充协议',
    version: 'V1.1',
    fileName: 'data-security-addendum.pdf',
  },
  apiAccess: {
    id: 'AGR-2026-009',
    name: '开放接口接入协议',
    version: 'V2.0',
    fileName: 'api-access-service-agreement.pdf',
  },
} satisfies Record<string, ProductProtocol>;

export const getProductProtocolUrl = (fileName: string) =>
  `${import.meta.env.BASE_URL}protocols/${encodeURIComponent(fileName)}`;
