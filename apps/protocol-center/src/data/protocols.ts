export type ProtocolStatus = '已生效' | '草稿' | '即将到期';

export interface ProtocolRecord {
  key: string;
  code: string;
  name: string;
  category: string;
  version: string;
  status: ProtocolStatus;
  owner: string;
  usageCount: number;
  fileSize: string;
  updatedAt: string;
  fileName: string;
  fileUrl?: string;
}

export const protocolRecords: ProtocolRecord[] = [
  {
    key: '1',
    code: 'PT-2026-001',
    name: '企业产品服务协议',
    category: '产品服务',
    version: 'V3.2',
    status: '已生效',
    owner: '陈晓',
    usageCount: 186,
    fileSize: '4.6 KB',
    updatedAt: '2026-08-02 09:30',
    fileName: 'enterprise-product-service-agreement.pdf',
  },
  {
    key: '2',
    code: 'PT-2026-002',
    name: '数据安全补充协议',
    category: '数据合规',
    version: 'V2.0',
    status: '已生效',
    owner: '方妍',
    usageCount: 142,
    fileSize: '4.5 KB',
    updatedAt: '2026-08-01 16:18',
    fileName: 'data-security-addendum.pdf',
  },
  {
    key: '3',
    code: 'PT-2026-003',
    name: '开放接口接入协议',
    category: '开放平台',
    version: 'V1.6',
    status: '即将到期',
    owner: '林涛',
    usageCount: 98,
    fileSize: '4.5 KB',
    updatedAt: '2026-07-30 11:42',
    fileName: 'api-access-service-agreement.pdf',
  },
];

const protocolCenterOrigin = new URL(import.meta.url).origin;

export const getProtocolFileUrl = (fileName: string) =>
  `${protocolCenterOrigin}/protocols/${encodeURIComponent(fileName)}`;

export const getProtocolRecordUrl = (record: ProtocolRecord) =>
  record.fileUrl ?? getProtocolFileUrl(record.fileName);
