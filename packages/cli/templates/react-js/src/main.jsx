import React from "react";
import ReactDOM from "react-dom/client";
import { MetricCard, PageShell } from "@central-platform/ui";
import "./styles.css";

function App() {
  return (
    <PageShell title="__PROJECT_NAME__" description="Central platform application" activeKey="payment">
      <section className="metric-grid">
        <MetricCard title="核心指标" value="128" change="+8" />
        <MetricCard title="待处理" value="16" change="-3" />
        <MetricCard title="完成率" value="98.2%" change="+1.4%" />
      </section>
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
