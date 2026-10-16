import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/items';
import { ItemsTable } from './items-table';
import { Item } from './items-table';

type ItemsPayload = {
    data: Item[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

export default function ItemsIndex() {
    const props = usePage().props;
    const initialItems: ItemsPayload = props.items as ItemsPayload;

    const filters = props.filters as { search?: string };

    function remove(item: Item) {
        if (!window.confirm(`Excluir o item "${item.name}"?`)) return;
        router.delete(destroy.url({ item: item.id }), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title="Itens" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <ItemsTable items={initialItems} initialSearch={filters?.search ?? ''} />
                </div>
            </main>
        </>
    );
}

ItemsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Itens',
            href: index(),
        },
    ],
};
