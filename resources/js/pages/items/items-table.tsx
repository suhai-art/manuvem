import { useMemo, useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    ChevronLeft,
    ChevronRight,
    Search,
    ShoppingCart,
    Trash2,
    Edit,
    PencilRuler,
} from 'lucide-react';
import useRole from '@/hooks/use-role';

export type Item = {
    id: number;
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
    created_at: string;
};

export type ItemsPayload = {
    data: Item[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

export function ItemsTable({
    items,
    onCreate,
    onEdit,
    onDelete,
}: {
    items: ItemsPayload;
    onCreate?: () => void;
    onEdit?: (item: Item) => void;
    onDelete?: (item: Item) => void;
}) {
    const [search, setSearch] = useState('');
    const [sortAscending, setSortAscending] = useState(false);
    const { hasPermission } = useRole();

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        const result = query
            ? items.data.filter((item) =>
                  `${item.name} ${item.description}`
                      .toLowerCase()
                      .includes(query),
              )
            : items.data;

        return [...result].sort((a, b) => {
            const diff =
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime();
            return sortAscending ? diff : -diff;
        });
    }, [search, sortAscending, items.data]);

    const formatPrice = (value: string) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(Number(value));

    const formatDate = (value: string) =>
        new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(value));

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <PencilRuler
                            className="size-5 text-primary"
                            aria-hidden="true"
                        />
                        <h1 className="text-lg font-semibold tracking-tight">
                            Itens
                        </h1>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {items.total}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie os itens do catálogo.
                    </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {hasPermission('items.create') && (
                        <button
                            type="button"
                            onClick={onCreate}
                            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            Novo item
                        </button>
                    )}
                    <label className="relative flex min-w-0 flex-1 items-center sm:w-64">
                        <Search
                            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buscar itens</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar item..."
                            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm transition outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                    <caption className="sr-only">
                        Lista de itens cadastrados
                    </caption>
                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Código
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Nome
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Preço sugerido
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                <button
                                    type="button"
                                    onClick={() => setSortAscending((v) => !v)}
                                    className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                                >
                                    CADASTRO
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
                            <th
                                scope="col"
                                className="flex justify-end gap-1.5 px-5 py-3 font-medium"
                            >
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                        {filtered.map((item) => (
                            <tr
                                key={item.id}
                                className="transition hover:bg-muted/30"
                            >
                                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                                    {item.internal_code}
                                </td>
                                <td className="px-5 py-4 font-medium text-foreground">
                                    {item.name}
                                </td>
                                <td className="px-5 py-4 text-foreground">
                                    {formatPrice(item.default_unit_price)}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                    {formatDate(item.created_at)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        {hasPermission('items.update') && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit?.(item)}
                                                aria-label={`Editar ${item.name}`}
                                                title="Editar"
                                                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Edit aria-hidden="true" />
                                                <span className="hidden sm:inline">
                                                    Editar
                                                </span>
                                            </button>
                                        )}
                                        {hasPermission('items.delete') && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete?.(item)}
                                                aria-label={`Excluir ${item.name}`}
                                                title="Excluir"
                                                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
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
                        Nenhum item encontrado.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Mostrando {filtered.length ? items.from : 0}–
                    {filtered.length ? items.to : 0} de {items.total} itens
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={items.current_page <= 1}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                        {items.current_page}
                    </span>
                    <button
                        type="button"
                        disabled={items.current_page >= items.last_page}
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
