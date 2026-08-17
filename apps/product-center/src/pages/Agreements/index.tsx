import {
  CheckCircleFilled,
  DownloadOutlined,
  FilePdfOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import { Card, Descriptions, Space, Steps, Tag, Typography } from "antd";
import { Button } from "@central-platform/ui";
import { useState } from "react";
import ProtocolModal from "./ProtocolModal";
import pdfUrl from "./product-agreement-demo.pdf?url";

const Agreements = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onViewProtocol = () => {
    setIsOpen(true);
  };

  return (
    <>
      <section className="agreement-page">
        <div className="page-intro agreement-intro">
          <div>
            <Typography.Title level={2}>产品协议</Typography.Title>
            <Typography.Text>查看客户当前产品配置及已签署的服务协议。</Typography.Text>
          </div>
          <Tag className="agreement-status" icon={<CheckCircleFilled />}>
            已生效
          </Tag>
        </div>

        <Card className="agreement-progress-card" bordered={false}>
          <Steps
            current={3}
            responsive={false}
            items={[
              { title: "配置确认", description: "2026-07-28" },
              { title: "协议生成", description: "2026-07-29" },
              { title: "客户签署", description: "2026-08-01" },
              { title: "服务生效", description: "2026-08-02" }
            ]}
          />
        </Card>

        <div className="agreement-layout">
          <div className="agreement-details">
            <Card className="agreement-card" bordered={false} title="协议概览">
              <Descriptions column={1} colon={false} size="small">
                <Descriptions.Item label="协议编号">PA-2026-0802-001</Descriptions.Item>
                <Descriptions.Item label="客户名称">上海栖木科技有限公司</Descriptions.Item>
                <Descriptions.Item label="签署主体">产品运营中心</Descriptions.Item>
                <Descriptions.Item label="服务周期">2026-08-02 至 2027-08-01</Descriptions.Item>
                <Descriptions.Item label="协议金额">¥128,000 / 年</Descriptions.Item>
                <Descriptions.Item label="客户经理">陈晓 · 138****6821</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card className="agreement-card" bordered={false} title="产品配置">
              <div className="agreement-plan">
                <div className="plan-icon">
                  <SafetyCertificateOutlined />
                </div>
                <div>
                  <span>企业专业版</span>
                  <strong>Product Hub Pro</strong>
                </div>
                <Tag color="green">运行中</Tag>
              </div>
              <div className="config-list">
                <div>
                  <span>已开通模块</span>
                  <strong>商品、订单、财务</strong>
                </div>
                <div>
                  <span>账号配额</span>
                  <strong>80 个</strong>
                </div>
                <div>
                  <span>文件存储</span>
                  <strong>500 GB</strong>
                </div>
                <div>
                  <span>技术支持</span>
                  <strong>7 × 12 小时</strong>
                </div>
              </div>
            </Card>
          </div>

          <Card
            className="agreement-card pdf-card"
            bordered={false}
            title={
              <Space>
                <FilePdfOutlined className="pdf-icon" />
                <span>产品服务配置协议.pdf</span>
              </Space>
            }
            extra={
              <Space>
                <Button target="_blank" onClick={onViewProtocol}>
                  新窗口打开
                </Button>
                <Button type="primary" icon={<DownloadOutlined />} href={pdfUrl} download>
                  下载
                </Button>
              </Space>
            }
          >
            <div className="pdf-meta">
              <span>PDF · 1 页 · 生成于 2026-08-01 16:20</span>
              <span>文件校验通过</span>
            </div>
            <iframe className="agreement-pdf" src={pdfUrl} title="产品服务配置协议 PDF 预览" />
          </Card>
        </div>
      </section>
      {isOpen && (
        <ProtocolModal isOpen={isOpen} onCancel={() => setIsOpen(false)} pdfUrl={pdfUrl} />
      )}
    </>
  );
};

export default Agreements;
