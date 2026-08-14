import Button from 'antd-mobile/es/components/button';
import ProgressBar from 'antd-mobile/es/components/progress-bar';
import { useState } from 'react';
import ChartPanel from '../../components/ChartPanel';
import EmptyResult from '../../components/EmptyResult';
import FilterChips from '../../components/FilterChips';
import MetricGrid from '../../components/MetricGrid';
import PageHero from '../../components/PageHero';
import QueryPanel from '../../components/QueryPanel';
import ResultHeader from '../../components/ResultHeader';
import StatusTag from '../../components/StatusTag';
import TrendChart from '../../components/TrendChart';
import { userGrowthOption } from '../../data/chartOptions';
import { users } from '../../data/mock';
import { useTextQuery } from '../../hooks/useTextQuery';

const statusFilters = ['全部', '正常', '待认证', '已冻结'] as const;

const UserPage = () => {
  const { input, query, setInput, submit, reset } = useTextQuery();
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('全部');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesStatus = status === '全部' || user.status === status;
    const searchable = `${user.id} ${user.name} ${user.mobile} ${user.level}`.toLocaleLowerCase('zh-CN');
    return matchesStatus && (!query || searchable.includes(query));
  });

  return (
    <main className="module-page module-page--user">
      <PageHero
        eyebrow="CUSTOMER ASSETS"
        title="用户资产库"
        description="查看客户状态、实名进度与风险分层。"
        value="1,682"
        valueLabel="有效用户"
        tone="blue"
      />

      <MetricGrid
        items={[
          { label: '本月新增', value: '222', hint: '完成实名 86%' },
          { label: '活跃用户', value: '928', hint: '近 30 天' },
          { label: '风险关注', value: '12', hint: '需复核信息' },
        ]}
      />

      <ChartPanel title="用户增长" subtitle="最近六个月累计有效用户" action={<span className="section-badge section-badge--blue">月度</span>}>
        <TrendChart option={userGrowthOption} label="最近六个月用户增长折线图" />
      </ChartPanel>

      <QueryPanel
        value={input}
        placeholder="用户姓名、编号或手机号"
        onChange={setInput}
        onSubmit={submit}
        onReset={reset}
      >
        <FilterChips
          items={statusFilters}
          active={status}
          onChange={(value) => setStatus(value as (typeof statusFilters)[number])}
          label="用户状态"
        />
      </QueryPanel>

      <section className="result-section">
        <ResultHeader count={filteredUsers.length} label="用户列表" />
        {filteredUsers.length === 0 ? <EmptyResult /> : (
          <div className="record-list">
            {filteredUsers.map((user) => {
              const expanded = expandedId === user.id;
              return (
                <article className="record-card user-card" key={user.id}>
                  <div className="record-card__topline">
                    <span>{user.id}</span>
                    <StatusTag>{user.status}</StatusTag>
                  </div>
                  <div className="user-card__identity">
                    <div className="user-avatar" aria-hidden="true">{user.name.slice(0, 1)}</div>
                    <div>
                      <h3>{user.name}</h3>
                      <p>{user.mobile} · {user.level}</p>
                    </div>
                    <StatusTag>{user.riskLevel}</StatusTag>
                  </div>
                  <div className="verification-progress">
                    <div>
                      <span>{user.realNameStatus}</span>
                      <strong>{user.verificationProgress}%</strong>
                    </div>
                    <ProgressBar
                      percent={user.verificationProgress}
                      rounded
                      style={{ '--fill-color': user.verificationProgress === 100 ? '#28759c' : '#dd8b2e' }}
                    />
                  </div>
                  <div className="record-facts">
                    <div><span>累计订单</span><strong>{user.orderCount}</strong></div>
                    <div><span>最近活跃</span><strong>{user.lastActiveAt}</strong></div>
                  </div>
                  {expanded && (
                    <dl className="user-detail-grid">
                      <div><dt>证件类型</dt><dd>{user.documentType}</dd></div>
                      <div><dt>证件号码</dt><dd>{user.documentNo}</dd></div>
                      <div><dt>注册来源</dt><dd>{user.source}</dd></div>
                      <div><dt>注册日期</dt><dd>{user.registeredAt}</dd></div>
                    </dl>
                  )}
                  <div className="record-card__actions">
                    <Button
                      fill="none"
                      size="small"
                      aria-expanded={expanded}
                      onClick={() => setExpandedId(expanded ? null : user.id)}
                    >
                      {expanded ? '收起资料' : '查看用户资料'}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default UserPage;
