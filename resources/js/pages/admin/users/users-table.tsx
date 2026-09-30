import { useMemo, useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Search,
    SlidersHorizontal,
    Users,
} from 'lucide-react';

type Role = { id: number; name: string };
type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Role[];
};

type UsersPayload = {
    data: User[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));

const initials = (name: string) =>
    name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

export function UsersTable({
    users,
    onCreate,
    onEdit,
    onDelete,
}: {
    users: UsersPayload;
    onCreate?: () => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}) {
    const [search, setSearch] = useState('');
    const [sortAscending, setSortAscending] = useState(false);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        const result = query
            ? users.data.filter((user) =>
                  `${user.name} ${user.email}`.toLowerCase().includes(query),
              )
            : users.data;

        return [...result].sort((a, b) => {
            const difference =
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime();
            return sortAscending ? difference : -difference;
        });
    }, [search, sortAscending, users.data]);

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Users
                            className="size-5 text-primary"
                            aria-hidden="true"
                        />
                        <h1 className="text-lg font-semibold tracking-tight">
                            Usuários
                        </h1>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {users.total}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie os usuários e permissões da sua aplicação.
                    </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <button
                        type="button"
                        onClick={onCreate}
                        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                        Novo usuário
                    </button>
                    <label className="relative flex min-w-0 flex-1 items-center sm:w-64">
                        <Search
                            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buscar usuários</span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar usuário..."
                            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm transition outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                    <caption className="sr-only">
                        Lista de usuários cadastrados
                    </caption>
                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Usuário
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Perfil
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Status
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSortAscending((value) => !value)
                                    }
                                    className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                                >
                                    Cadastro
                                    {sortAscending ? (
                                        <ArrowUp
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ArrowDown
                                            className="size-3.5"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="transition hover:bg-muted/30"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                            {initials(user.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-foreground">
                                                {user.name}
                                            </div>
                                            <div className="truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                        {user.roles[0]?.name ?? 'Usuário'}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <span
                                            className="size-1.5 rounded-full bg-current"
                                            aria-hidden="true"
                                        />
                                        {user.email_verified_at
                                            ? 'Verificado'
                                            : 'Pendente'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                    {formatDate(user.created_at)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit?.(user)}
                                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete?.(user)}
                                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filteredUsers.length && (
                    <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                        Nenhum usuário encontrado.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Mostrando {filteredUsers.length ? users.from : 0}–
                    {filteredUsers.length ? users.to : 0} de {users.total}{' '}
                    usuários
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={users.current_page <= 1}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                        {users.current_page}
                    </span>
                    <button
                        type="button"
                        disabled={users.current_page >= users.last_page}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Próxima página"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export type { User, UsersPayload };
