const ResultHeader = ({ count, label }: { count: number; label: string }) => (
  <div className="result-header" aria-live="polite">
    <div>
      <h2>{label}</h2>
      <p>根据当前条件匹配到 {count} 条记录</p>
    </div>
    <span>{count}</span>
  </div>
);

export default ResultHeader;
