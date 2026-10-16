import { Head, router } from '@inertiajs/react';
import { index, destroy } from '@/routes/vendas';
import VendasTable, { VendasPayload, Venda} from './vendas-table';

type VendasIndexProps = {
    vendas: VendasPayload;
    filters: { search?: string };
};

export default function VendasIndex({ vendas, filters }: VendasIndexProps) {
    function remove(venda: Venda) {
        if (!window.confirm(`Excluir a venda ${venda.id}?`)) {
            return;
        }

        router.delete(destroy.url({ venda: venda.id }), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Vendas" />

            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <VendasTable vendas={vendas} initialSearch={filters?.search ?? ''} />
                </div>
            </main>
        </>
    );
}

VendasIndex.layout = {
    breadcrumbs: [
        {
            title: 'Vendas',
            href: index(),
        },
    ],
};

