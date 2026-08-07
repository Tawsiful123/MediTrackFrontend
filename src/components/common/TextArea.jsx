export default function TextArea({ label, error, className = '', id, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`input resize-y ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}