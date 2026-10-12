import { Head } from '@inertiajs/react';
import type { Cliente, Item } from '@/models/Venda';
import { VendaForm } from '@/pages/vendas/venda-form';
import { index } from '@/routes/vendas';

type VendasCreateProps = {
    clientes: Cliente[];
    items: Item[];
};

export default function VendasCreate({ clientes, items }: VendasCreateProps) {
    return (
        <>
            <Head title="Nova venda" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-4xl">
                    <VendaForm
                        mode="create"
                        clientes={clientes}
                        items={items}
                    />
                </div>
            </main>
        </>
    );
}

VendasCreate.layout = {
    breadcrumbs: [
        {
            title: 'Vendas',
            href: index(),
        },
        {
            title: 'Nova venda',
            href: '',
        },
    ],
};
