import Button from 'antd-mobile/es/components/button';
import SearchBar from 'antd-mobile/es/components/search-bar';
import type { FormEvent, ReactNode } from 'react';

interface QueryPanelProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  children?: ReactNode;
}

const QueryPanel = ({
  value,
  placeholder,
  onChange,
  onSubmit,
  onReset,
  children,
}: QueryPanelProps) => {
  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    onSubmit();
  };

  return (
    <section className="query-panel" aria-label="查询条件">
      <form className="query-panel__form" onSubmit={handleSubmit}>
        <SearchBar
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onSearch={() => handleSubmit()}
          clearable
        />
        <Button type="submit" color="primary" size="small" shape="rounded">
          查询
        </Button>
        <Button type="button" fill="none" size="small" onClick={onReset}>
          重置
        </Button>
      </form>
      {children}
    </section>
  );
};

export default QueryPanel;
