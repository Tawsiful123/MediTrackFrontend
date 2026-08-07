import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50 to-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 shadow-inner">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-rose-800">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-rose-600">{message}</p>}
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
