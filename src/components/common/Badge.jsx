const colors = {
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-slate-200 text-slate-700',
  red: 'bg-rose-100 text-rose-800',
  purple: 'bg-purple-100 text-purple-800',
};

export default function Badge({ status = '', className = '', children }) {
  const color = colors[status?.toLowerCase()] ?? colors.gray;
  return (
    <span className={`badge ${color} ${className}`}>{children || status}</span>
  );
}