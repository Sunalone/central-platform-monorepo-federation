export type UserStatus = '正常' | '待激活' | '已停用';

export type IdentityType = '身份证' | '护照';

export interface UserIdentity {
  identityType: IdentityType;
  idNumber: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  nationality: string;
}

export interface UserAddress {
  province: string;
  city: string;
  district: string;
  detail: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address: UserAddress;
}

export interface UserRecord {
  key: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  role: string;
  status: UserStatus;
  registerDate: string;
  lastLogin: string;
  source: string;
  identity: UserIdentity;
  emergencyContact: EmergencyContact;
}

export const userRecords: UserRecord[] = [
  {
    key: '1',
    userId: 'USR-2026-0001',
    name: '陈晓',
    phone: '138****5201',
    email: 'chen.xiao@example.com',
    company: '星河科技有限公司',
    role: '企业管理员',
    status: '正常',
    registerDate: '2026-01-12',
    lastLogin: '2026-08-08 09:42',
    source: '企业邀请',
    identity: {
      identityType: '身份证',
      idNumber: '110101199001012345',
      passportNumber: '',
      issueDate: '2019-06-12',
      expiryDate: '2039-06-12',
      nationality: '中国',
    },
    emergencyContact: {
      name: '陈芳',
      relationship: '配偶',
      phone: '139****5202',
      address: { province: '北京市', city: '北京市', district: '朝阳区', detail: '建国路88号' },
    },
  },
  {
    key: '2',
    userId: 'USR-2026-0002',
    name: '方妍',
    phone: '139****7812',
    email: 'fang.yan@example.com',
    company: '远山零售集团',
    role: '运营人员',
    status: '正常',
    registerDate: '2026-02-08',
    lastLogin: '2026-08-08 09:15',
    source: '开放注册',
    identity: {
      identityType: '身份证',
      idNumber: '310101199208082268',
      passportNumber: '',
      issueDate: '2020-02-20',
      expiryDate: '2040-02-20',
      nationality: '中国',
    },
    emergencyContact: {
      name: '方伟',
      relationship: '父亲',
      phone: '137****7813',
      address: { province: '上海市', city: '上海市', district: '浦东新区', detail: '世纪大道100号' },
    },
  },
  {
    key: '3',
    userId: 'USR-2026-0003',
    name: '林涛',
    phone: '136****3490',
    email: 'lin.tao@example.com',
    company: '北辰供应链',
    role: '财务人员',
    status: '待激活',
    registerDate: '2026-03-18',
    lastLogin: '-',
    source: '企业邀请',
    identity: {
      identityType: '护照',
      idNumber: '',
      passportNumber: 'E12345678',
      issueDate: '2023-01-15',
      expiryDate: '2033-01-15',
      nationality: '中国',
    },
    emergencyContact: {
      name: '林海',
      relationship: '兄弟',
      phone: '135****3491',
      address: { province: '浙江省', city: '杭州市', district: '西湖区', detail: '文三路90号' },
    },
  },
  {
    key: '4',
    userId: 'USR-2026-0004',
    name: '周宁',
    phone: '137****6048',
    email: 'zhou.ning@example.com',
    company: '云杉教育科技',
    role: '普通用户',
    status: '已停用',
    registerDate: '2026-04-22',
    lastLogin: '2026-07-20 14:06',
    source: '开放注册',
    identity: {
      identityType: '身份证',
      idNumber: '420106199511223216',
      passportNumber: '',
      issueDate: '2021-08-06',
      expiryDate: '2041-08-06',
      nationality: '中国',
    },
    emergencyContact: {
      name: '周敏',
      relationship: '母亲',
      phone: '136****6049',
      address: { province: '湖北省', city: '武汉市', district: '江汉区', detail: '解放大道800号' },
    },
  },
  {
    key: '5',
    userId: 'USR-2026-0005',
    name: '赵敏',
    phone: '135****9166',
    email: 'zhao.min@example.com',
    company: '启明制造',
    role: '企业管理员',
    status: '正常',
    registerDate: '2026-05-11',
    lastLogin: '2026-08-07 18:36',
    source: '企业邀请',
    identity: {
      identityType: '身份证',
      idNumber: '440106198907063829',
      passportNumber: '',
      issueDate: '2018-11-30',
      expiryDate: '2038-11-30',
      nationality: '中国',
    },
    emergencyContact: {
      name: '赵强',
      relationship: '配偶',
      phone: '134****9167',
      address: { province: '广东省', city: '广州市', district: '天河区', detail: '体育西路191号' },
    },
  },
];
