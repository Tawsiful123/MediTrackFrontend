import { useEffect, useState } from 'react';
import { UserCheck, Ban, Trash2, UserCog } from 'lucide-react';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Select from '@/components/common/Select';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useUsersList } from '@/hooks/admin/useUsersList';
import { useActivateUser } from '@/hooks/admin/useActivateUser';
import { useSuspendUser } from '@/hooks/admin/useSuspendUser';
import { useDeleteUser } from '@/hooks/admin/useDeleteUser';

const ROLE_STYLES = {
  PATIENT: 'bg-blue-100 text-blue-800',
  DOCTOR: 'bg-purple-100 text-purple-800',
  DOCTOR_ASSISTANT: 'bg-teal-100 text-teal-800',
  ADMIN: 'bg-rose-100 text-rose-800',
};

const ROLE_OPTIONS = ['PATIENT', 'DOCTOR', 'DOCTOR_ASSISTANT', 'ADMIN'];
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

const getName = (u) => u.fullName ?? u.name ?? 'User';
const getEmail = (u) => u.email ?? u.user?.email ?? '';

export default function UsersManagementPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activateMutation = useActivateUser();
  const suspendMutation = useSuspendUser();
  const deleteMutation = useDeleteUser();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const changeFilters = (next) => {
    setPage(1);
    if (next.search !== undefined) setSearch(next.search);
    if (next.role !== undefined) setRoleFilter(next.role);
    if (next.status !== undefined) setStatusFilter(next.status);
  };

  const { data, isLoading, isError, refetch } = useUsersList({
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: 10,
  });

  const result = data?.data ?? {};
  const users = result.users ?? result.data ?? [];
  const totalPages =
    result.meta?.totalPages ??
    (result.meta?.limit > 0 ? Math.ceil((result.meta?.total ?? 0) / result.meta.limit) : 1);

  const toggleSuspension = (user) => {
    if (user.status === 'SUSPENDED') {
      activateMutation.mutate(user.id);
    } else {
      suspendMutation.mutate(user.id);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const busy =
    activateMutation.isPending ||
    suspendMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">
            <UserCog className="mr-1 h-3.5 w-3.5" />
            User directory
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">User management</h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100">
            Activate, suspend or remove accounts across the entire platform.
          </p>
        </div>
      </section>

      <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1 lg:max-w-sm">
          <SearchBar
            value={search}
            onChange={(e) => changeFilters({ search: e.target.value })}
            placeholder="Search name, email or role..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:w-[360px]">
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => changeFilters({ role: e.target.value })}
            options={ROLE_OPTIONS}
            placeholder="All roles"
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => changeFilters({ status: e.target.value })}
            options={STATUS_OPTIONS}
            placeholder="All statuses"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="card flex items-center justify-center py-20">
          <Spinner label="Loading users..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load users"
          message="Something went wrong while fetching the user directory."
          onRetry={refetch}
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No users found"
          message="Try adjusting your search or filters."
          action={
            <Button
              variant="outline"
              onClick={() => changeFilters({ search: '', role: '', status: '' })}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={getName(u)} />
                        <div>
                          <p className="font-semibold text-slate-800">{getName(u)}</p>
                          <p className="text-xs text-slate-400">{getEmail(u)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${ROLE_STYLES[u.role] ?? 'bg-slate-100 text-slate-700'}`}>
                        {(u.role ?? '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={u.status}>{u.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          aria-label={u.status === 'SUSPENDED' ? 'Activate user' : 'Suspend user'}
                          onClick={() => toggleSuspension(u)}
                        >
                          {u.status === 'SUSPENDED' ? (
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Ban className="h-4 w-4 text-amber-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          className="text-rose-600 hover:bg-rose-50"
                          aria-label="Delete user"
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="border-t border-slate-100 px-6 py-4">
              <Pagination meta={result.meta} page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete user"
        message={`Permanently delete ${deleteTarget ? getName(deleteTarget) : ''}? This removes their account and cannot be undone.`}
        confirmLabel="Delete user"
        loading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}