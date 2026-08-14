const EmptyResult = () => (
  <div className="empty-result" role="status">
    <span aria-hidden="true" />
    <strong>没有匹配结果</strong>
    <p>请调整关键词或状态后重新查询</p>
  </div>
);

export default EmptyResult;
