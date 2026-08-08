import { Graph } from '@antv/x6';
import { useEffect, useRef, useState } from 'react';

export type PaymentFlowStatus = 'success' | 'processing' | 'pending' | 'warning';

export interface PaymentFlowStep {
  id: string;
  title: string;
  status: string;
  time: string;
  description: string;
  state: PaymentFlowStatus;
  details: Array<{ label: string; value: string }>;
}

interface PaymentFlowGraphProps {
  steps: PaymentFlowStep[];
  onStepSelect?: (stepId: string) => void;
}

const statusColors: Record<PaymentFlowStatus, { fill: string; stroke: string; text: string }> = {
  success: { fill: '#e6f5ef', stroke: '#55aa85', text: '#28704f' },
  processing: { fill: '#e8f2f6', stroke: '#4c91a4', text: '#286478' },
  pending: { fill: '#f4f5f6', stroke: '#aab4bd', text: '#6f7c87' },
  warning: { fill: '#fff3e3', stroke: '#d68c45', text: '#9a6428' },
};

const PaymentFlowGraph = ({ steps, onStepSelect }: PaymentFlowGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredStep, setHoveredStep] = useState<{
    step: PaymentFlowStep;
    left: number;
    top: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const graph = new Graph({
      container: containerRef.current,
      background: { color: '#fbfcfd' },
      grid: { visible: true, size: 12 },
      panning: true,
      mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'] },
      interacting: false,
    });

    const nodeWidth = 176;
    const nodeHeight = 96;
    const gap = 42;
    const startX = Math.max(24, (containerRef.current.clientWidth - (steps.length * nodeWidth + (steps.length - 1) * gap)) / 2);

    steps.forEach((step, index) => {
      const colors = statusColors[step.state];
      graph.addNode({
        id: step.id,
        shape: 'rect',
        x: startX + index * (nodeWidth + gap),
        y: 76,
        width: nodeWidth,
        height: nodeHeight,
        attrs: {
          body: {
            fill: colors.fill,
            stroke: colors.stroke,
            strokeWidth: 1.5,
            rx: 12,
            ry: 12,
          },
          label: {
            text: `${step.title}\n${step.status} · ${step.time}\n${step.description}`,
            fill: colors.text,
            fontSize: 12,
            lineHeight: 19,
            textWrap: { width: -20, height: -18, ellipsis: true },
          },
        },
      });

      if (index > 0) {
        graph.addEdge({
          source: steps[index - 1].id,
          target: step.id,
          attrs: {
            line: {
              stroke: step.state === 'pending' ? '#c7ced4' : '#6d9daa',
              strokeWidth: 1.5,
              targetMarker: { name: 'classic', size: 7 },
            },
          },
        });
      }
    });

    graph.on('node:click', ({ node }) => onStepSelect?.(node.id));
    graph.on('node:mouseenter', ({ node }) => {
      const step = steps.find((item) => item.id === node.id);
      const container = containerRef.current;
      if (!step || !container) return;

      const graphRect = graph.localToClient(node.getBBox());
      const containerRect = container.getBoundingClientRect();
      const center = graphRect.x - containerRect.left + graphRect.width / 2;
      const left = Math.min(container.clientWidth - 140, Math.max(140, center));
      const top = graphRect.y - containerRect.top + graphRect.height + 10;
      setHoveredStep({ step, left, top });
    });
    graph.on('node:mouseleave', () => setHoveredStep(null));
    graph.centerContent();
    return () => {
      setHoveredStep(null);
      graph.dispose();
    };
  }, [onStepSelect, steps]);

  return (
    <div ref={containerRef} className="payment-flow-graph" aria-label="支付流程图">
      {hoveredStep && (
        <div
          className="payment-node-tooltip"
          style={{ left: hoveredStep.left, top: hoveredStep.top }}
        >
          <strong>{hoveredStep.step.title}</strong>
          {hoveredStep.step.details.map((detail) => (
            <div key={detail.label}>
              <span>{detail.label}</span>
              <b>{detail.value}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentFlowGraph;
