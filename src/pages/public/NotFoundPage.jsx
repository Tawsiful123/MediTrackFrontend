import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-gradient px-4 text-center">
      <div className="rounded-full bg-white/10 p-6 backdrop-blur">
        <Compass className="h-14 w-14 text-white" />
      </div>
      <h1 className="mt-8 text-7xl font-extrabold text-white">404</h1>
      <p className="mt-4 text-xl font-semibold text-indigo-100">Page not found</p>
      <p className="mt-2 max-w-sm text-indigo-200">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-8 bg-white text-indigo-700 hover:bg-indigo-50">
        <Home className="h-4 w-4" />
        Back to home
      </Link>
    </div>
  );
}