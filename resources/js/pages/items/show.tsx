import { Head, usePage, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { index, destroy } from '@/routes/items';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useRole from '@/hooks/use-role';

type Item = {
    id: number;
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
    created_at: string;
};

export default function ItemShow() {
    const item = (usePage().props as Record<string, unknown>)
        .item as Item;
    const { hasPermission } = useRole();

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
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));

    function handleDelete() {
        if (!window.confirm(`Excluir o item "${item.name}"?`)) return;
        router.delete(destroy.url({ item: item.id }), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title={item.name} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-3xl">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Itens', href: index() },
                            { title: item.name, href: '' },
                        ]}
                    />

                    <div className="mt-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {item.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            {hasPermission('items.update') && (
                                <a
                                    href={`/items/${item.id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                >
                                    <Edit className="size-4" aria-hidden="true" />
                                    Editar
                                </a>
                            )}
                            {hasPermission('items.delete') && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
                                >
                                    <Trash2 className="size-4" aria-hidden="true" />
                                    Excluir
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Código interno
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono text-sm">
                                    {item.internal_code}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Preço unitário
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold">
                                    {formatPrice(item.default_unit_price)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Descrição
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Cadastrado em
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(item.created_at)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}