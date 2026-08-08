import { ArrowLeftOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Empty, Space, Tag, Typography } from 'antd';
import { createForm } from '@formily/core';
import { Form as FormilyForm, DatePicker, FormGrid, FormItem, Input, Select } from '@formily/antd-v5';
import { createSchemaField, FormProvider } from '@formily/react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userRecords } from '../../data/users';
import type { UserRecord } from '../../data/users';

const SchemaField = createSchemaField({
  components: {
    DatePicker,
    FormGrid,
    FormItem,
    Input,
    Select,
  },
});

const userSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      title: '用户编号',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-pattern': 'disabled',
    },
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    phone: {
      type: 'string',
      title: '手机号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    email: {
      type: 'string',
      title: '邮箱',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    company: {
      type: 'string',
      title: '所属企业',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    role: {
      type: 'string',
      title: '角色',
      enum: ['企业管理员', '运营人员', '财务人员', '普通用户'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    status: {
      type: 'string',
      title: '账号状态',
      enum: ['正常', '待激活', '已停用'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
    registerDate: {
      type: 'string',
      title: '注册时间',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-pattern': 'disabled',
    },
    lastLogin: {
      type: 'string',
      title: '最近登录',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-pattern': 'disabled',
    },
    source: {
      type: 'string',
      title: '注册来源',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-pattern': 'disabled',
    },
    identity: {
      type: 'object',
      title: '证件资料',
      'x-component': 'FormGrid',
      'x-component-props': { maxColumns: 2, minColumns: 1, columnGap: 24 },
      properties: {
        identityType: {
          type: 'string',
          title: '证件类型',
          enum: ['身份证', '护照'],
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
        nationality: {
          type: 'string',
          title: '国籍/地区',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        idNumber: {
          type: 'string',
          title: '身份证号',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': {
            dependencies: ['identityType'],
            fulfill: {
              state: { visible: '{{$deps[0] === "身份证"}}' },
            },
          },
        },
        passportNumber: {
          type: 'string',
          title: '护照号码',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-reactions': {
            dependencies: ['identityType'],
            fulfill: {
              state: { visible: '{{$deps[0] === "护照"}}' },
            },
          },
        },
        issueDate: {
          type: 'string',
          title: '签发日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': { format: 'YYYY-MM-DD', style: { width: '100%' } },
        },
        expiryDate: {
          type: 'string',
          title: '证件有效期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': { format: 'YYYY-MM-DD', style: { width: '100%' } },
        },
      },
    },
    emergencyContact: {
      type: 'object',
      title: '紧急联系人',
      'x-component': 'FormGrid',
      'x-component-props': { maxColumns: 2, minColumns: 1, columnGap: 24 },
      properties: {
        name: {
          type: 'string',
          title: '联系人姓名',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        relationship: {
          type: 'string',
          title: '关系',
          enum: ['配偶', '父亲', '母亲', '兄弟', '朋友', '其他'],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
        },
        phone: {
          type: 'string',
          title: '联系电话',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        address: {
          type: 'object',
          title: '联系人地址',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2, minColumns: 1, columnGap: 24 },
          properties: {
            province: {
              type: 'string',
              title: '省/直辖市',
              enum: ['北京市', '上海市', '广东省', '浙江省', '湖北省'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            city: {
              type: 'string',
              title: '城市',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-reactions': {
                dependencies: ['province'],
                fulfill: {
                  schema: {
                    enum: '{{$deps[0] === "北京市" ? ["北京市"] : $deps[0] === "上海市" ? ["上海市"] : $deps[0] === "广东省" ? ["广州市", "深圳市"] : $deps[0] === "浙江省" ? ["杭州市", "宁波市"] : ["武汉市"]}}',
                  },
                },
              },
            },
            district: {
              type: 'string',
              title: '区/县',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-reactions': {
                dependencies: ['city'],
                fulfill: {
                  schema: {
                    enum: '{{$deps[0] === "朝阳区" || $deps[0] === "北京市" ? ["朝阳区", "海淀区"] : $deps[0] === "上海市" ? ["浦东新区", "静安区"] : $deps[0] === "广州市" ? ["天河区", "越秀区"] : $deps[0] === "杭州市" ? ["西湖区", "滨江区"] : ["江汉区", "武昌区"]}}',
                  },
                },
              },
            },
            detail: {
              type: 'string',
              title: '详细地址',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
};

const cloneUserRecord = (record: UserRecord): UserRecord => ({
  ...record,
  identity: { ...record.identity },
  emergencyContact: {
    ...record.emergencyContact,
    address: { ...record.emergencyContact.address },
  },
});

const UserDetail = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { message } = AntdApp.useApp();
  const userId = pathname.split('/detail/')[1] ?? '';
  const record = userRecords.find((item) => item.userId === userId);
  const [form] = useState(() => createForm({ pattern: 'disabled', initialValues: record }));
  const [snapshot, setSnapshot] = useState<UserRecord | null>(() => record ? cloneUserRecord(record) : null);
  const [editing, setEditing] = useState(false);

  if (!record || !snapshot) {
    return (
      <section className="user-detail-page">
        <Card bordered={false}>
          <Empty description="未找到该用户" />
          <Button type="link" onClick={() => navigate('/user/records')}>返回用户库</Button>
        </Card>
      </section>
    );
  }

  const handleEdit = () => {
    form.setPattern('editable');
    setEditing(true);
  };

  const handleCancel = () => {
    form.setValues(cloneUserRecord(snapshot));
    form.setPattern('disabled');
    setEditing(false);
  };

  const handleSave = () => {
    const values = form.values as Partial<UserRecord>;
    const identity = { ...snapshot.identity, ...(values.identity ?? {}) };
    const nextRecord: UserRecord = {
      ...snapshot,
      ...values,
      identity: {
        ...identity,
        idNumber: identity.identityType === '身份证' ? identity.idNumber : '',
        passportNumber: identity.identityType === '护照' ? identity.passportNumber : '',
      },
      emergencyContact: {
        ...snapshot.emergencyContact,
        ...(values.emergencyContact ?? {}),
        address: {
          ...snapshot.emergencyContact.address,
          ...(values.emergencyContact?.address ?? {}),
        },
      },
    };
    form.setValues(nextRecord);
    form.setPattern('disabled');
    setSnapshot(cloneUserRecord(nextRecord));
    setEditing(false);
    void message.success('用户信息已保存，本地演示数据已更新');
  };

  return (
    <section className="user-detail-page">
      <div className="page-intro user-detail-intro">
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/user/records')}>
            返回用户库
          </Button>
          <Typography.Title level={2}>用户详情</Typography.Title>
          <Typography.Text>维护用户基础资料、证件信息、紧急联系人及关联地址。</Typography.Text>
        </div>
        <Tag color={snapshot.status === '正常' ? 'green' : snapshot.status === '待激活' ? 'orange' : 'default'}>
          {snapshot.status}
        </Tag>
      </div>

      <Card
        className="user-detail-card"
        bordered={false}
        title={<span><strong>{snapshot.name}</strong><Typography.Text type="secondary"> · {snapshot.userId}</Typography.Text></span>}
        extra={(
          <Space>
            {editing ? (
              <>
                <Button icon={<UndoOutlined />} onClick={handleCancel}>取消</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
              </>
            ) : (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>
            )}
          </Space>
        )}
      >
        <FormProvider form={form}>
          <FormilyForm className="formily-user-form" layout="vertical">
            <SchemaField schema={userSchema} />
          </FormilyForm>
        </FormProvider>
      </Card>
    </section>
  );
};

export default UserDetail;
