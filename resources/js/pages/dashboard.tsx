import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Package, Users, Landmark } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

type Stats = {
    clientes: number;
    itens: number;
};

export default function Dashboard({ stats }: { stats: Stats }) {
    const cards = [
        {
            title: 'Clientes',
            value: stats.clientes,
            icon: Users,
            href: '/clientes',
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            title: 'Itens',
            value: stats.itens,
            icon: Package,
            href: '/items',
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="relative flex flex-col gap-2 rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm transition hover:bg-muted/30 dark:border-sidebar-border"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex size-10 items-center justify-center rounded-lg ${card.bg}`}
                                >
                                    <card.icon
                                        className={`size-5 ${card.color}`}
                                        aria-hidden="true"
                                    />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </span>
                            </div>
                            <span className="text-3xl font-bold tracking-tight">
                                {card.value}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                cadastrados
                            </span>
                        </Link>
                    ))}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
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
