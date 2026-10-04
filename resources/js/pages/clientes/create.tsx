import { Head, usePage, router } from '@inertiajs/react';
import { create, store } from '@/routes/clientes';
import { ClienteForm } from './cliente-form';

export default function ClienteCreate() {
    function save(values: { name: string; documento: string }) {
        router.post(store.url(), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Novo cliente" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <ClienteForm
                        mode="create"
                        onCancel={() => router.visit(create().url())}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

ClienteCreate.layout = {
    breadcrumbs: [
        {
            title: 'Clientes',
            href: '/admin/clientes',
        },
        {
            title: 'Novo cliente',
            href: '/admin/clientes',
        },
    ],
};
