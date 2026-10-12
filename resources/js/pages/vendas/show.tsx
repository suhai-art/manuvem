import { Head, usePage, router } from '@inertiajs/react';
import { show, update, edit, index, store } from '@/routes/vendas';
import { VendaForm } from '@/pages/vendas/venda-form';
import useRole from '@/hooks/use-role';

type Venda = {
    id: number;
    cliente: {
        id: number;
        name: string;
        documento: string | null;
        created_at: string;
    };
    status: string;
    is_priority: boolean;
    total: number;
    itens: {
        item_id: number;
        quantity: string;
        unit_price: string;
        subtotal: number;
    }[];
    created_at: string;
};

export default function VendasShow() {
    const props = usePage().props;
    const inicialVenda: Venda = props.venda as Venda;
    const { hasPermission } = useRole();

    function save(values: {
        cliente_id: number;
        status: string;
        is_priority: boolean;
        itens: { item_id: number; quantity: string; unit_price: string }[];
    }) {
        router.put(update.url({ venda: inicialVenda.id }), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Venda #${inicialVenda.id}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-4xl">
                    <VendaForm
                        mode="edit"
                        initialVenda={inicialVenda}
                        onCancel={() =>
                            router.visit(show.url({ venda: inicialVenda.id }))
                        }
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

VendasShow.layout = {
    breadcrumbs: [
        {
            title: 'Vendas',
            href: index(),
        },
        {
            title: `Venda #${inicialVenda.id}`,
            href: '',
        },
    ],
};
