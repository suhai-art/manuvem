import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/clientes';
import { ClientesTable } from './clientes-table';
import { useState } from 'react';
import { Cliente } from './clientes-table';

type ClientesPayload = {
    data: Cliente[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

export default function ClientesIndex() {
    const props = usePage().props;
    const initialClientes: ClientesPayload = props.clientes as ClientesPayload;

    const [clientes, setClientes] = useState<ClientesPayload>(initialClientes);

    async function remove(cliente: Cliente) {
        if (!window.confirm(`Excluir o cliente "${cliente.name}"?`)) return;
        await router.delete(destroy.url(cliente.id), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title="Clientes" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <ClientesTable
                        clientes={clientes}
                        onCreate={() => router.visit(store.url())}
                        onEdit={(cliente) => {
                            router.visit(update.url(cliente.id));
                        }}
                        onDelete={remove}
                    />
                </div>
            </main>
        </>
    );
}

ClientesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Clientes',
            href: index(),
        },
    ],
};
