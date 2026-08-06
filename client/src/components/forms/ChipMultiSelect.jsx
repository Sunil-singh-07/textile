import CategoryChip from '../ui/CategoryChip';

// A value/onChange/error contract like RoleSelect.jsx, so it drops straight
// into react-hook-form via <Controller>. Built on the existing CategoryChip
// (already used for marketplace category filters) rather than a new chip
// primitive, so multi-select fields look identical to filter chips elsewhere.
const ChipMultiSelect = ({ label, options, value = [], onChange, error }) => {
  const toggle = (option) => {
    onChange(
      value.includes(option) ? value.filter((selected) => selected !== option) : [...value, option]
    );
  };

  return (
    <div className="w-full">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <CategoryChip
            key={option}
            label={option}
            selected={value.includes(option)}
            onClick={() => toggle(option)}
          />
        ))}
      </div>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default ChipMultiSelect;