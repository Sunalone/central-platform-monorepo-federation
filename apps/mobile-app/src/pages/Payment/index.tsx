import Button from 'antd-mobile/es/components/button';
import { useState } from 'react';
import ChartPanel from '../../components/ChartPanel';
import EmptyResult from '../../components/EmptyResult';
import FilterChips from '../../components/FilterChips';
import MetricGrid from '../../components/MetricGrid';
import PageHero from '../../components/PageHero';
import PaymentFlow from '../../components/PaymentFlow';
import QueryPanel from '../../components/QueryPanel';
import ResultHeader from '../../components/ResultHeader';
import StatusTag from '../../components/StatusTag';
import TrendChart from '../../components/TrendChart';
import { paymentTrendOption } from '../../data/chartOptions';
import { payments } from '../../data/mock';
import { useTextQuery } from '../../hooks/useTextQuery';

const statusFilters = ['全部', '支付成功', '处理中', '退款中', '支付失败'] as const;
const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  minimumFractionDigits: 2,
});

const PaymentPage = () => {
  const { input, query, setInput, submit, reset } = useTextQuery();
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('全部');
  const [selectedId, setSelectedId] = useState<string | null>(payments[0].id);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = status === '全部' || payment.status === status;
    const searchable = [
      payment.id,
      payment.orderNo,
      payment.userName,
      payment.productName,
      payment.channel,
    ].join(' ').toLocaleLowerCase('zh-CN');
    return matchesStatus && (!query || searchable.includes(query));
  });

  return (
    <main className="module-page module-page--payment">
      <PageHero
        eyebrow="PAYMENT CONTROL"
        title="支付工作台"
        description="追踪交易状态，并从订单到回执定位链路节点。"
        value="98.7%"
        valueLabel="今日成功率"
        tone="amber"
      />

      <MetricGrid
        items={[
          { label: '今日交易', value: '1,286', hint: '较昨日 +8.4%' },
          { label: '交易金额', value: '71.2万', hint: '实时累计' },
          { label: '异常订单', value: '7', hint: '待人工处理' },
        ]}
      />

      <ChartPanel title="近七日交易" subtitle="每日支付金额，单位万元" action={<span className="section-badge section-badge--amber">7 天</span>}>
        <TrendChart option={paymentTrendOption} label="近七日支付金额折线图" />
      </ChartPanel>

      <QueryPanel
        value={input}
        placeholder="支付单、订单、用户或产品"
        onChange={setInput}
        onSubmit={submit}
        onReset={reset}
      >
        <FilterChips
          items={statusFilters}
          active={status}
          onChange={(value) => setStatus(value as (typeof statusFilters)[number])}
          label="支付状态"
        />
      </QueryPanel>

      <section className="result-section">
        <ResultHeader count={filteredPayments.length} label="支付记录" />
        {filteredPayments.length === 0 ? <EmptyResult /> : (
          <div className="record-list">
            {filteredPayments.map((payment) => {
              const selected = selectedId === payment.id;
              return (
                <article className={selected ? 'record-card payment-card is-selected' : 'record-card payment-card'} key={payment.id}>
                  <div className="record-card__topline">
                    <span>{payment.id}</span>
                    <StatusTag>{payment.status}</StatusTag>
                  </div>
                  <div className="record-card__title">
                    <div>
                      <h3>{payment.productName}</h3>
                      <p>{payment.userName} · {payment.createdAt}</p>
                    </div>
                    <strong className="payment-card__amount">{currencyFormatter.format(payment.amount)}</strong>
                  </div>
                  <div className="payment-card__meta">
                    <span>{payment.orderNo}</span>
                    <span>{payment.channel}</span>
                  </div>
                  <div className="record-card__actions">
                    <Button
                      fill={selected ? 'solid' : 'outline'}
                      color="primary"
                      size="small"
                      shape="rounded"
                      aria-expanded={selected}
                      onClick={() => setSelectedId(selected ? null : payment.id)}
                    >
                      {selected ? '收起链路' : '查看支付链路'}
                    </Button>
                  </div>
                  {selected && <PaymentFlow payment={payment} />}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default PaymentPage;
