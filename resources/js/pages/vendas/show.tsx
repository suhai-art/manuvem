import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Pencil,
    Star,
    UserRound,
} from 'lucide-react';
import { edit, index } from '@/routes/vendas';
import type { Venda } from '@/models/Venda';

type VendasShowProps = {
    venda: Venda;
};

const statusLabels: Record<Venda['status'], string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

const statusStyles: Record<Venda['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(value) || 0);

const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'medium',
              timeStyle: 'short',
          }).format(date);
};

export default function VendasShow({ venda }: VendasShowProps) {
    const itens = venda.itens ?? [];
    console.log(itens)

    return (
        <>
            <Head title={`Detalhes da venda #${venda.id}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-5xl space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link
                                href={index()}
                                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                            >
                                <ArrowLeft className="size-4" aria-hidden="true" />
                                Voltar para vendas
                            </Link>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Venda #{venda.id}
                                </h1>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[venda.status]}`}>
                                    {statusLabels[venda.status]}
                                </span>
                                {venda.is_priority && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                        <Star className="size-3.5" aria-hidden="true" />
                                        Prioridade
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Consulte os dados e itens desta venda.
                            </p>
                        </div>
                        <Link
                            href={edit.url(venda.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            <Pencil className="size-4" aria-hidden="true" />
                            Editar venda
                        </Link>
                    </div>

                    <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumo da venda">
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <UserRound className="size-4" aria-hidden="true" /> Cliente
                            </div>
                            <p className="font-semibold">{venda.cliente?.name ?? 'Cliente não informado'}</p>
                            {venda.cliente?.documento && <p className="mt-1 text-sm text-muted-foreground">{venda.cliente.documento}</p>}
                        </div>
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="size-4" aria-hidden="true" /> Registrada em
                            </div>
                            <p className="font-semibold">{formatDate(venda.created_at)}</p>
                        </div>
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="size-4" aria-hidden="true" /> Total da venda
                            </div>
                            <p className="text-xl font-semibold text-primary">{formatCurrency(venda.total)}</p>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
                            <div>
                                <h2 className="font-semibold">Itens da venda</h2>
                                <p className="mt-1 text-sm text-muted-foreground">{itens.length} {itens.length === 1 ? 'item registrado' : 'itens registrados'}</p>
                            </div>
                            <Clock3 className="size-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        {itens.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[620px] text-left text-sm">
                                    <caption className="sr-only">Itens da venda</caption>
                                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Item</th>
                                            <th className="px-5 py-3 font-medium">Quantidade</th>
                                            <th className="px-5 py-3 font-medium">Preço unitário</th>
                                            <th className="px-5 py-3 text-right font-medium">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {itens.map((item, itemIndex) => {
                                            console.log(item)
                                            const subtotal = Number(item.subtotal ?? Number(item.pivot.quantity) * Number(item.pivot.unit_price));
                                            return (
                                                <tr key={`${item.item_id ?? item.item?.id ?? 'item'}-${itemIndex}`}>
                                                    <td className="px-5 py-4 font-medium">{item.name ?? 'Item não informado'}</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{item.pivot.quantity}</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{formatCurrency(item.pivot.unit_price)}</td>
                                                    <td className="px-5 py-4 text-right font-semibold">{formatCurrency(subtotal)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center text-sm text-muted-foreground">Nenhum item registrado nesta venda.</div>
                        )}
                        <div className="flex justify-end border-t border-border/70 px-5 py-4">
                            <div className="flex items-center gap-8 text-sm">
                                <span className="text-muted-foreground">Total</span>
                                <strong className="text-lg">{formatCurrency(venda.total)}</strong>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

VendasShow.layout = {
    breadcrumbs: [
        { title: 'Vendas', href: index() },
        { title: 'Detalhes da venda', href: '' },
    ],
};
