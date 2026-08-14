import type { PaymentRecord } from '../../types/business';

const stateLabel = {
  complete: '已完成',
  current: '处理中',
  waiting: '待处理',
  error: '异常',
};

const PaymentFlow = ({ payment }: { payment: PaymentRecord }) => (
  <section className="payment-flow" aria-label={`${payment.id} 支付链路`}>
    <div className="payment-flow__header">
      <div>
        <span>支付链路</span>
        <strong>{payment.orderNo}</strong>
      </div>
      <small>{payment.channel}</small>
    </div>
    <ol className="payment-flow__nodes">
      {payment.nodes.map((node) => (
        <li key={node.id} className={`flow-node flow-node--${node.state}`}>
          <span className="flow-node__rail" aria-hidden="true">
            <i />
          </span>
          <div className="flow-node__body">
            <div className="flow-node__title">
              <div>
                <strong>{node.title}</strong>
                <span>{stateLabel[node.state]}</span>
              </div>
              <time>{node.time}</time>
            </div>
            <p>{node.description}</p>
            <dl>
              {node.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default PaymentFlow;
