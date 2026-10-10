import { IconChevronDown } from "@tabler/icons-react";

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="relative block min-w-[150px] flex-1">
      <span className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full appearance-none rounded-md bg-[var(--raised)] px-3 text-xs outline-none"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-3 bottom-2 text-[var(--text-tertiary)]"
      />
    </label>
  );
}

export function Segment({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <fieldset className="min-w-37.5 flex-1">
      <legend className="mb-1 text-xs font-medium text-(--text-secondary)">{label}</legend>
      <div className="flex h-7 rounded-md bg-[var(--app)] p-0.5">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`flex-1 rounded-md px-1 text-xs ${value.startsWith(option) ? "bg-[var(--accent-muted)] text-[var(--accent-strong)]" : "text-[var(--text-secondary)]"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
