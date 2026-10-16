import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Clock3,
    Package,
    Plus,
    ShoppingBag,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';

type RecentSale = {
    id: number;
    nome: string;
    cliente: string | null;
    data: string | null;
    total: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    prioritario: boolean;
};

type SalesStats = {
    receita_mes: number;
    receita_mes_anterior: number;
    vendas_mes: number;
    pendentes: number;
    evolucao: { mes: string; receita: number }[];
    recentes: RecentSale[];
};

type Stats = {
    clientes: number | null;
    itens: number | null;
    pode_criar_venda: boolean;
    vendas: SalesStats | null;
};

export default function Dashboard({ stats }: { stats: Stats }) {
    const vendas = stats.vendas;
    const monthRevenue = vendas?.receita_mes ?? 0;
    const previousRevenue = vendas?.receita_mes_anterior ?? 0;
    const revenueChange = previousRevenue > 0
        ? ((monthRevenue - previousRevenue) / previousRevenue) * 100
        : null;
    const maxRevenue = Math.max(...(vendas?.evolucao.map((month) => month.receita) ?? []), 1);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(value);

    const formatDate = (value: string | null) => {
        if (!value) return 'Sem data';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
        }).format(new Date(`${value.slice(0, 10)}T12:00:00`));
    };

    const monthLabel = (value: string) =>
        new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(
            new Date(`${value}-01T12:00:00`),
        );

    const statusLabels: Record<RecentSale['status'], string> = {
        pending: 'Pendente',
        confirmed: 'Confirmada',
        completed: 'Concluída',
        cancelled: 'Cancelada',
    };

    return (
        <>
            <Head title="Dashboard" />
            <main className="flex-1 bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="size-5 text-primary" aria-hidden="true" />
                            <div>
                                <h1 className="text-lg font-semibold">Dashboard</h1>
                                <p className="text-sm text-muted-foreground">
                                    Acompanhe as vendas e a atividade recente.
                                </p>
                            </div>
                        </div>
                        {vendas && stats.pode_criar_venda && (
                            <Link
                                href="/vendas/create"
                                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
                            >
                                <Plus className="size-4" aria-hidden="true" />
                                Nova venda
                            </Link>
                        )}
                    </header>

                    {vendas && (
                        <>
                            <section aria-label="Indicadores de vendas" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <article className="flex min-h-36 flex-col justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-medium text-muted-foreground">Receita no mês</span>
                                        <ShoppingBag className="size-4 text-primary" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{formatCurrency(monthRevenue)}</p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                            {revenueChange !== null && (revenueChange >= 0
                                                ? <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                                                : <ArrowDownRight className="size-3.5 text-muted-foreground" aria-hidden="true" />)}
                                            {revenueChange === null
                                                ? `Mês anterior: ${formatCurrency(previousRevenue)}`
                                                : `${Math.abs(revenueChange).toFixed(0)}% ${revenueChange >= 0 ? 'acima' : 'abaixo'} do mês anterior`}
                                        </p>
                                    </div>
                                </article>

                                <article className="flex min-h-36 flex-col justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-medium text-muted-foreground">Vendas no mês</span>
                                        <ShoppingBag className="size-4 text-primary" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{vendas.vendas_mes}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">vendas não canceladas</p>
                                    </div>
                                </article>

                                <Link href="/vendas" className="flex min-h-36 flex-col justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm transition hover:bg-muted/30">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-medium text-muted-foreground">Aguardando ação</span>
                                        <Clock3 className="size-4 text-primary" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold tabular-nums">{vendas.pendentes}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">vendas pendentes</p>
                                    </div>
                                </Link>

                                {(stats.clientes !== null || stats.itens !== null) && (
                                    <div className="grid min-h-36 grid-cols-2 divide-x rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                                        {stats.clientes !== null && (
                                            <Link href="/clientes" className="flex flex-col justify-between pr-4 transition hover:text-primary">
                                                <span className="text-sm font-medium text-muted-foreground">Clientes</span>
                                                <span className="flex items-center gap-2 text-2xl font-semibold tabular-nums">
                                                    <Users className="size-4 text-primary" aria-hidden="true" />
                                                    {stats.clientes}
                                                </span>
                                            </Link>
                                        )}
                                        {stats.itens !== null && (
                                            <Link href="/items" className="flex flex-col justify-between pl-4 transition hover:text-primary">
                                                <span className="text-sm font-medium text-muted-foreground">Itens</span>
                                                <span className="flex items-center gap-2 text-2xl font-semibold tabular-nums">
                                                    <Package className="size-4 text-primary" aria-hidden="true" />
                                                    {stats.itens}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </section>

                            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                                <article className="min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                                    <header className="border-b border-border/70 px-5 py-4">
                                        <h2 className="font-semibold">Evolução da receita</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">Últimos seis meses, sem vendas pendentes ou canceladas.</p>
                                    </header>
                                    <div className="flex h-56 items-end gap-3 px-5 pb-4 pt-6 sm:gap-5">
                                        {vendas.evolucao.map((month, index) => (
                                            <div key={month.mes} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                                                <span className="max-w-full truncate text-[11px] tabular-nums text-muted-foreground">
                                                    {month.receita > 0 ? formatCurrency(month.receita) : '—'}
                                                </span>
                                                <div className="flex h-32 w-full items-end border-b border-border/70">
                                                    <div
                                                        className={`w-full min-h-1 transition-[height] ${index === vendas.evolucao.length - 1 ? 'bg-primary' : 'bg-primary/40'}`}
                                                        style={{ height: `${Math.max((month.receita / maxRevenue) * 100, 3)}%` }}
                                                        title={`${monthLabel(month.mes)}: ${formatCurrency(month.receita)}`}
                                                    />
                                                </div>
                                                <span className="text-xs capitalize text-muted-foreground">{monthLabel(month.mes)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </article>

                                <article className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                                    <header className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
                                        <div>
                                            <h2 className="font-semibold">Vendas recentes</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">Últimas registradas no sistema.</p>
                                        </div>
                                        <Link href="/vendas" className="text-sm font-medium text-primary hover:underline">Ver todas</Link>
                                    </header>
                                    <div className="divide-y divide-border/70">
                                        {vendas.recentes.length > 0 ? vendas.recentes.map((sale) => (
                                            <Link key={sale.id} href={`/vendas/${sale.id}`} className="flex min-w-0 items-center justify-between gap-3 px-5 py-3 transition hover:bg-muted/30">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{sale.nome}</p>
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {sale.cliente ?? 'Sem cliente'} · {formatDate(sale.data)}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="text-sm font-semibold tabular-nums">{formatCurrency(sale.total)}</p>
                                                    <p className={`mt-0.5 text-xs ${sale.status === 'pending' ? 'text-amber-700' : sale.status === 'cancelled' ? 'text-rose-700' : 'text-muted-foreground'}`}>
                                                        {sale.prioritario ? 'Prioritária · ' : ''}{statusLabels[sale.status]}
                                                    </p>
                                                </div>
                                            </Link>
                                        )) : (
                                            <p className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhuma venda registrada ainda.</p>
                                        )}
                                    </div>
                                </article>
                            </section>
                        </>
                    )}

                    {!vendas && (
                        <section className="grid gap-3 sm:grid-cols-2">
                            {stats.clientes !== null && (
                                <Link href="/clientes" className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm transition hover:bg-muted/30">
                                    <span className="flex items-center gap-3 text-sm font-medium"><Users className="size-5 text-primary" aria-hidden="true" />Clientes</span>
                                    <span className="text-2xl font-semibold tabular-nums">{stats.clientes}</span>
                                </Link>
                            )}
                            {stats.itens !== null && (
                                <Link href="/items" className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm transition hover:bg-muted/30">
                                    <span className="flex items-center gap-3 text-sm font-medium"><Package className="size-5 text-primary" aria-hidden="true" />Itens</span>
                                    <span className="text-2xl font-semibold tabular-nums">{stats.itens}</span>
                                </Link>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
