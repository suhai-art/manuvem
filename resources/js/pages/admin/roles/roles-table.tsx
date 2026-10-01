import { useMemo, useState } from 'react';
import { Shield, Search, ShieldCheck, Trash2, Edit } from 'lucide-react';
import { Link } from '@inertiajs/react';
import useRole from '@/hooks/use-role';
import { create, edit } from '@/routes/admin/roles'

type Permission = { id: number; name: string; guard_name: string };
type Role = {
    id: number;
    name: string;
    permissions?: Permission[];
    permissions_count: number;
};

type RolesPayload = {
    data: Role[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

const formatCount = (count: number) =>
    count === 1 ? '1 permissão' : `${count} permissões`;

export function RolesTable({
    roles,
    onEdit,
    onDelete,
}: {
    roles: RolesPayload;
    onCreate?: () => void;
    onEdit?: (role: Role) => void;
    onDelete?: (role: Role) => void;
}) {
    const [search, setSearch] = useState('');
    const { hasPermission } = useRole()

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return roles.data;
        return roles.data.filter((r) => r.name.toLowerCase().includes(q));
    }, [search, roles.data]);

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Shield
                            className="size-5 text-primary"
                            aria-hidden="true"
                        />
                        <h1 className="text-lg font-semibold tracking-tight">
                            Cargos
                        </h1>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {roles.total}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie os perfis e permissões da aplicação.
                    </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {hasPermission('roles.create') &&
                        (
                            <Link
                                type="button"
                                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                href={create()}
                            >
                                Novo cargo
                            </Link>
                        )
                    }

                    <label className="relative flex min-w-0 flex-1 items-center sm:w-64">
                        <Search
                            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buscar cargo</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar role..."
                            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm transition outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                    <caption className="sr-only">
                        Lista de cargos cadastradas
                    </caption>
                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Nome
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Permissões
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium flex justify-end gap-1.5">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {filtered.map((role) => (
                            <tr
                                key={role.id}
                                className="transition hover:bg-muted/30"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Shield
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <span className="font-medium text-foreground">
                                            {role.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <ShieldCheck
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                        {role.permissions_count +
                                            ' permissões'}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-1.5">
                                        {hasPermission('roles.update') &&
                                            <Link
                                                type="button"
                                                href={edit.url(role.id)}
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Edit
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                Editar
                                            </Link>
                                        }
                                        {hasPermission('roles.delete') &&
                                            <button
                                                type="button"
                                                onClick={() => onDelete?.(role)}
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                Excluir
                                            </button>
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filtered.length && (
                    <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                        Nenhum cargo encontrada.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Mostrando {filtered.length ? roles.from : 0} –
                    {filtered.length ? roles.to : 0} de {roles.total} cargos
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={roles.current_page <= 1}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página anterior"
                    >
                        {/* ChevronLeft */}
                        <svg
                            className="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                        {roles.current_page}
                    </span>
                    <button
                        type="button"
                        disabled={roles.current_page >= roles.last_page}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Próxima página"
                    >
                        {/* ChevronRight */}
                        <svg
                            className="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

export type { Role, RolesPayload, Permission };
