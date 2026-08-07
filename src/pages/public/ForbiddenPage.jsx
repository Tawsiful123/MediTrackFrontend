import { Link } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-gradient px-4 text-center">
      <div className="rounded-full bg-white/10 p-6 backdrop-blur">
        <ShieldX className="h-14 w-14 text-white" />
      </div>
      <h1 className="mt-8 text-4xl font-extrabold text-white">Access denied</h1>
      <p className="mt-3 max-w-md text-indigo-100">
        You don't have permission to view this page. If you think this is a mistake, contact your
        administrator.
      </p>
      <Link to="/" className="btn-primary mt-8 bg-white text-indigo-700 hover:bg-indigo-50">
        <Home className="h-4 w-4" />
        Back to home
      </Link>
    </div>
  );
}