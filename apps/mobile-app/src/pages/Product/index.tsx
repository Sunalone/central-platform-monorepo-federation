import Button from 'antd-mobile/es/components/button';
import Skeleton from 'antd-mobile/es/components/skeleton';
import { lazy, Suspense, useEffect, useState } from 'react';
import ChartPanel from '../../components/ChartPanel';
import EmptyResult from '../../components/EmptyResult';
import FilterChips from '../../components/FilterChips';
import MetricGrid from '../../components/MetricGrid';
import PageHero from '../../components/PageHero';
import QueryPanel from '../../components/QueryPanel';
import ResultHeader from '../../components/ResultHeader';
import StatusTag from '../../components/StatusTag';
import TrendChart from '../../components/TrendChart';
import { productCategoryOption } from '../../data/chartOptions';
import { products } from '../../data/mock';
import { useTextQuery } from '../../hooks/useTextQuery';
import type { ProductProtocol } from '../../types/business';

const statusFilters = ['全部', '在售', '审核中', '已下架'] as const;
const PdfPreviewPopup = lazy(() => import('../../components/PdfPreviewPopup'));

// 使用与真实产品卡片接近的结构占位，减少数据加载完成后的布局跳动。
const ProductListSkeleton = () => (
  <div className="record-list" role="status" aria-label="产品列表加载中">
    {Array.from({ length: 2 }, (_, index) => (
      <article className="record-card product-skeleton" key={index}>
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={2} animated />
        <div className="product-skeleton__facts">
          <Skeleton animated />
          <Skeleton animated />
        </div>
      </article>
    ))}
  </div>
);

const ProductPage = () => {
  const { input, query, setInput, submit, reset } = useTextQuery();
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('全部');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewProtocol, setPreviewProtocol] = useState<ProductProtocol | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 本地演示数据加载很快，这里用短暂延时展示骨架屏的实际效果。
    const timer = window.setTimeout(() => setIsLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesStatus = status === '全部' || product.status === status;
    const searchable = `${product.id} ${product.name} ${product.category}`.toLocaleLowerCase('zh-CN');
    return matchesStatus && (!query || searchable.includes(query));
  });

  return (
    <main className="module-page module-page--product">
      <PageHero
        eyebrow="PRODUCT OPERATIONS"
        title="产品一览"
        description="快速掌握产品状态、客群覆盖与销售配置。"
        value="44"
        valueLabel="产品总数"
        tone="teal"
      />

      <MetricGrid
        items={[
          { label: '在售', value: '31', hint: '较上月 +3' },
          { label: '待审核', value: '5', hint: '今日新增 2' },
          { label: '覆盖客户', value: '5.4k', hint: '活跃产品客群' },
        ]}
      />

      <ChartPanel title="品类结构" subtitle="当前有效产品数量分布" action={<span className="section-badge">实时</span>}>
        <TrendChart option={productCategoryOption} label="产品品类数量柱状图" />
      </ChartPanel>

      <QueryPanel
        value={input}
        placeholder="产品名称、编号或分类"
        onChange={setInput}
        onSubmit={submit}
        onReset={reset}
      >
        <FilterChips
          items={statusFilters}
          active={status}
          onChange={(value) => setStatus(value as (typeof statusFilters)[number])}
          label="产品状态"
        />
      </QueryPanel>

      <section className="result-section">
        <ResultHeader count={filteredProducts.length} label="产品列表" />
        {isLoading ? <ProductListSkeleton /> : filteredProducts.length === 0 ? <EmptyResult /> : (
          <div className="record-list">
            {filteredProducts.map((product) => {
              const expanded = expandedId === product.id;
              return (
                <article className="record-card product-card" key={product.id}>
                  <div className="record-card__topline">
                    <span>{product.id}</span>
                    <StatusTag>{product.status}</StatusTag>
                  </div>
                  <div className="record-card__title">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.category} · 更新于 {product.updatedAt}</p>
                    </div>
                    <div className="product-card__rate">
                      <strong>{product.annualRate}</strong>
                      <span>核心参数</span>
                    </div>
                  </div>
                  <div className="record-facts">
                    <div><span>产品期限</span><strong>{product.term}</strong></div>
                    <div><span>覆盖客户</span><strong>{product.customerCount.toLocaleString()}</strong></div>
                  </div>
                  {expanded && (
                    <div className="record-detail">
                      <p>{product.description}</p>
                      <div className="feature-tags">
                        {product.features.map((feature) => <span key={feature}>{feature}</span>)}
                      </div>
                      <section className="product-protocols" aria-label={`${product.name}协议信息`}>
                        <div className="product-protocols__heading">
                          <strong>协议信息</strong>
                          <span>已绑定 {product.protocols.length} 份</span>
                        </div>
                        <div className="product-protocols__list">
                          {product.protocols.map((protocol) => (
                            <div className="product-protocol-item" key={protocol.id}>
                              <span className="product-protocol-item__badge">PDF</span>
                              <div>
                                <strong>{protocol.name}</strong>
                                <span>{protocol.id} · {protocol.version}</span>
                              </div>
                              <Button
                                fill="none"
                                size="mini"
                                onClick={() => setPreviewProtocol(protocol)}
                              >
                                查看
                              </Button>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                  <div className="record-card__actions">
                    <Button
                      fill="none"
                      size="small"
                      aria-expanded={expanded}
                      onClick={() => setExpandedId(expanded ? null : product.id)}
                    >
                      {expanded ? '收起详情' : '查看详情'}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {previewProtocol && (
        <Suspense fallback={null}>
          <PdfPreviewPopup
            protocol={previewProtocol}
            onClose={() => setPreviewProtocol(null)}
          />
        </Suspense>
      )}
    </main>
  );
};

export default ProductPage;
