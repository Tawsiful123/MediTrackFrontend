import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
  onSubmit,
  autoFocus = false,
}) {
  const clearable = Boolean(onClear ?? value);

  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onClear?.();
  };

  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="input rounded-xl pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-100 [&::-webkit-search-cancel-button]:hidden"
      />
      {clearable && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
