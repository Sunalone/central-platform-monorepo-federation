interface FilterChipsProps {
  items: readonly string[];
  active: string;
  onChange: (value: string) => void;
  label: string;
}

const FilterChips = ({ items, active, onChange, label }: FilterChipsProps) => (
  <div className="filter-chips" role="group" aria-label={label}>
    {items.map((item) => (
      <button
        key={item}
        type="button"
        className={active === item ? 'filter-chip is-active' : 'filter-chip'}
        aria-pressed={active === item}
        onClick={() => onChange(item)}
      >
        {item}
      </button>
    ))}
  </div>
);

export default FilterChips;
