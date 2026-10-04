import { Head, usePage } from '@inertiajs/react';
import { index, edit } from '@/routes/clientes';
import { ArrowLeft, User } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Cliente = {
    id: number;
    name: string;
    documento: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export default function ClienteShow() {
    const cliente = (usePage().props as Record<string, unknown>)
        .cliente as Cliente;

    const formatDate = (value: string | null) => {
        if (!value) return '—';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(value));
    };

    return (
        <>
            <Head title={cliente.name} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-3xl">
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Clientes', href: index() },
                            { title: cliente.name, href: '' },
                        ]}
                    />

                    <div className="mt-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {cliente.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <Link
                                href={edit.url(cliente.id)}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                <User className="size-4" aria-hidden="true" />
                                Editar
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Nome
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-foreground">
                                    {cliente.name}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Documento
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {cliente.documento ?? '—'}
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
                                    {formatDate(cliente.created_at)}
                                </p>
                            </CardContent>
                        </Card>
                        {cliente.updated_at &&
                            cliente.updated_at !== cliente.created_at && (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Atualizado em
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(cliente.updated_at)}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                </div>
            </main>
        </>
    );
}

ClienteShow.layout = (
    prev: { breadcrumbs?: { title: string; href: string }[] } | undefined,
) => ({
    ...prev,
    breadcrumbs: [
        ...(prev?.breadcrumbs ?? []),
        {
            title: 'Clientes',
            href: index(),
        },
    ],
});
