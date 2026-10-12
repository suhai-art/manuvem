import { useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import useRole from '@/hooks/use-role';
import {
    ArrowLeft,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Coins,
    Eye,
    MoreHorizontal,
    PencilRuler,
    Plus,
    Star,
    Trash2,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import {
    create,
    destroy,
    edit,
    show,
} from '@/routes/vendas';
import { Venda, VendaItem, VendasPayload } from '@/models/Venda';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type VendasTableProps = {
    vendas: VendasPayload;
};

const statusLabels: Record<Venda['status'], string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

const statusClasses: Record<Venda['status'], string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));

export default function VendasTable({ vendas }: VendasTableProps) {
    const [search, setSearch] = useState('');
    const [sortAscending, setSortAscending] = useState(false);
    const { hasPermission } = useRole();

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        const result = query
            ? vendas.data.filter((v) => {
                  const cliente = v.cliente;
                  return (
                      `${v.id} ${cliente?.name ?? ''}`
                          .toLowerCase()
                          .includes(query) ||
                      `${v.total} ${statusLabels[v.status]}`
                          .toLowerCase()
                          .includes(query)
                  );
              })
            : vendas.data;

        return [...result].sort((a, b) => {
            const diff =
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime();
            return sortAscending ? diff : -diff;
        });
    }, [search, sortAscending, vendas.data]);

    const formatTotal = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);

    function handleDelete(venda: Venda) {
        if (!window.confirm(`Excluir a venda ${venda.id}?`)) return;
        router.delete(destroy.url({ venda: venda.id }), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    function handleStatusChange(venda: Venda, status: Venda['status']) {
        if (status === venda.status) return;

        router.patch(
            `${show.url(venda.id)}/status`,
            { status },
            { preserveScroll: true },
        );
    }

    function handlePriorityChange(venda: Venda, isPriority: boolean) {
        if (isPriority === venda.is_priority) return;

        router.patch(
            `${show.url(venda.id)}/priority`,
            { is_priority: isPriority },
            { preserveScroll: true },
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-primary" aria-hidden="true">
                            <Coins />
                        </span>
                        <h1 className="text-lg font-semibold tracking-tight">
                            Vendas
                        </h1>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {vendas.total}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie as vendas realizadas.
                    </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {hasPermission('vendas.create') && (
                        <Link
                            type="button"
                            href={create()}
                            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            Nova venda
                        </Link>
                    )}
                    <label className="relative flex min-w-0 flex-1 items-center sm:w-64">
                        <ArrowUpDown
                            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <span className="sr-only">Buscar venda</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar venda..."
                            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm transition outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                        />
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                    <caption className="sr-only">
                        Lista de vendas cadastradas
                    </caption>
                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Cliente
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Status
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Prioridade
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Total
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                <button
                                    type="button"
                                    onClick={() => setSortAscending((v) => !v)}
                                    className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                                >
                                    DATA
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
                        {filtered.map((venda) => (
                            <tr
                                key={venda.id}
                                className="transition hover:bg-muted/30"
                            >
                                <td className="px-5 py-4 font-medium text-foreground">
                                    {venda.cliente?.name ?? '—'}
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[venda.status]}`}
                                    >
                                        {statusLabels[venda.status]}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    {venda.is_priority ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                            <Star
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            Prioridade
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 font-medium text-foreground">
                                    {formatTotal(venda.total)}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                    {formatDate(venda.created_at)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    type="button"
                                                    aria-label={`Ações da venda ${venda.id}`}
                                                    title="Ações"
                                                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <MoreHorizontal
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {hasPermission(
                                                    'vendas.update',
                                                ) && (
                                                    <>
                                                        <DropdownMenuLabel>
                                                            Alterar status
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuRadioGroup
                                                            value={venda.status}
                                                            onValueChange={(
                                                                status,
                                                            ) =>
                                                                handleStatusChange(
                                                                    venda,
                                                                    status as Venda['status'],
                                                                )
                                                            }
                                                        >
                                                            {Object.entries(
                                                                statusLabels,
                                                            ).map(
                                                                ([
                                                                    status,
                                                                    label,
                                                                ]) => (
                                                                    <DropdownMenuRadioItem
                                                                        key={
                                                                            status
                                                                        }
                                                                        value={
                                                                            status
                                                                        }
                                                                    >
                                                                        {label}
                                                                    </DropdownMenuRadioItem>
                                                                ),
                                                            )}
                                                        </DropdownMenuRadioGroup>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuCheckboxItem
                                                            checked={
                                                                venda.is_priority
                                                            }
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                handlePriorityChange(
                                                                    venda,
                                                                    checked ===
                                                                        true,
                                                                )
                                                            }
                                                        >
                                                            Prioridade
                                                        </DropdownMenuCheckboxItem>
                                                        {(hasPermission(
                                                            'vendas.view',
                                                        ) ||
                                                            hasPermission(
                                                                'vendas.delete',
                                                            )) && (
                                                            <DropdownMenuSeparator />
                                                        )}
                                                    </>
                                                )}
                                                {hasPermission(
                                                    'vendas.view',
                                                ) && (
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={show.url(
                                                                venda.id,
                                                            )}
                                                        >
                                                            <Eye aria-hidden="true" />
                                                            Ver
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                {hasPermission(
                                                    'vendas.update',
                                                ) && (
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={edit.url(
                                                                venda.id,
                                                            )}
                                                        >
                                                            <PencilRuler aria-hidden="true" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                {hasPermission(
                                                    'vendas.delete',
                                                ) && (
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(venda)
                                                        }
                                                    >
                                                        <Trash2 aria-hidden="true" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filtered.length && (
                    <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                        Nenhuma venda encontrada.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Mostrando {filtered.length ? vendas.from : 0}–
                    {filtered.length ? vendas.to : 0} de {vendas.total} vendas
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={vendas.current_page <= 1}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                        {vendas.current_page}
                    </span>
                    <button
                        type="button"
                        disabled={vendas.current_page >= vendas.last_page}
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

export type { Venda, VendaItem, VendasPayload };
export { statusLabels, statusClasses };
