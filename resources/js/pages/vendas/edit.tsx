import { Head } from '@inertiajs/react';
import { index } from '@/routes/vendas';
import type { Cliente, Item, Venda } from '@/models/Venda';
import { VendaForm } from '@/pages/vendas/venda-form';

type VendasEditProps = {
    venda: Venda;
    clientes: Cliente[];
    items: Item[];
};

export default function VendasEdit({
    venda,
    clientes,
    items,
}: VendasEditProps) {
    return (
        <>
            <Head title={`Editar venda #${venda.id}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-4xl">
                    <VendaForm
                        mode="edit"
                        venda={venda}
                        clientes={clientes}
                        items={items}
                    />
                </div>
            </main>
        </>
    );
}

VendasEdit.layout = {
    breadcrumbs: [
        {
            title: 'Vendas',
            href: index(),
        },
        {
            title: 'Editar venda',
            href: '',
        },
    ],
};
