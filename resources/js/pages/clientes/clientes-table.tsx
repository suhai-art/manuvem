import { useMemo, useState } from 'react';
import { Search, Edit, Trash2, Eye, Landmark } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import useRole from '@/hooks/use-role';
import { edit, show, create, destroy } from '@/routes/clientes';

type Cliente = {
    id: number;
    name: string;
    documento: string | null;
    created_at: string;
};

type ClientesPayload = {
    data: Cliente[];
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

export function ClientesTable({ clientes }: { clientes: ClientesPayload }) {
    const [search, setSearch] = useState('');
    const { hasPermission } = useRole();

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return clientes.data;
        return clientes.data.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (c.documento ?? '').toLowerCase().includes(q),
        );
    }, [search, clientes.data]);

    function handleDelete(cliente) {
        if (!window.confirm(`Excluir o item "${cliente.name}"?`)) return;
        router.delete(destroy.url({ cliente: cliente.id }), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-primary" aria-hidden="true">
                            <Landmark />
                        </span>
                        <h1 className="text-lg font-semibold tracking-tight">
                            Clientes
                        </h1>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {clientes.total}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie seus clientes cadastrados.
                    </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {hasPermission('clientes.create') && (
                        <Link
                            type="button"
                            href={create()}
                            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            Novo cliente
                        </Link>
                    )}
                    <label className="relative flex min-w-0 flex-1 items-center sm:w-64">
                        <Search
                            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buscar cliente</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar cliente..."
                            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm transition outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                    <caption className="sr-only">
                        Lista de clientes cadastrados
                    </caption>
                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Nome
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Documento
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Cadastrado em
                            </th>
                            <th
                                scope="col"
                                className="flex justify-end gap-1.5 px-5 py-3 font-medium"
                            >
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {filtered.map((cliente) => (
                            <tr
                                key={cliente.id}
                                className="transition hover:bg-muted/30"
                            >
                                <td className="px-5 py-4 font-medium text-foreground">
                                    {cliente.name}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                    {cliente.documento ?? '—'}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                    {formatDate(cliente.created_at)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-1.5">
                                        {hasPermission('clientes.view') && (
                                            <Link
                                                type="button"
                                                href={show.url(cliente.id)}
                                                aria-label={`Ver ${cliente.name}`}
                                                title="Ver"
                                                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Eye aria-hidden="true" />
                                                <span className="hidden sm:inline">
                                                    Ver
                                                </span>
                                            </Link>
                                        )}
                                        {hasPermission('clientes.update') && (
                                            <Link
                                                type="button"
                                                href={edit.url(cliente.id)}
                                                aria-label={`Editar ${cliente.name}`}
                                                title="Editar"
                                                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Edit aria-hidden="true" />
                                                <span className="hidden sm:inline">
                                                    Editar
                                                </span>
                                            </Link>
                                        )}
                                        {hasPermission('clientes.delete') && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cliente)}
                                                aria-label={`Excluir ${cliente.name}`}
                                                title="Excluir"
                                                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 aria-hidden="true" />
                                                <span className="hidden sm:inline">
                                                    Excluir
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filtered.length && (
                    <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                        Nenhum cliente encontrado.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Mostrando {filtered.length ? clientes.from : 0} –
                    {filtered.length ? clientes.to : 0} de {clientes.total}{' '}
                    clientes
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={clientes.current_page <= 1}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página anterior"
                    >
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
                        {clientes.current_page}
                    </span>
                    <button
                        type="button"
                        disabled={clientes.current_page >= clientes.last_page}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Próxima página"
                    >
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

export type { Cliente, ClientesPayload };
