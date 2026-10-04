import { Head, usePage, router } from '@inertiajs/react';
import { edit, update } from '@/routes/clientes';
import { ClienteForm } from './cliente-form';

type Cliente = {
    id: number;
    name: string;
    documento: string | null;
};

type PageProps = {
    cliente: Cliente;
};

export default function ClienteEdit() {
    const { cliente } = usePage<PageProps>().props;

    function save(values: { name: string; documento: string }) {
        router.put(update.url(cliente.id), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Editar ${cliente.name}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <ClienteForm
                        mode="edit"
                        initialName={cliente.name}
                        initialDocumento={cliente.documento ?? ''}
                        onCancel={() => router.visit(edit.url(cliente.id))}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

ClienteEdit.layout = (
    prev: { breadcrumbs?: { title: string; href: string }[] } | undefined,
) => ({
    ...prev,
    breadcrumbs: [
        ...(prev?.breadcrumbs ?? []),
        {
            title: 'Clientes',
            href: '/admin/clientes',
        },
    ],
});
