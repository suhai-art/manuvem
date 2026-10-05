import { Head, router } from '@inertiajs/react';
import { create, store } from '@/routes/items';
import { ItemForm } from './item-form';

export default function ItemCreate() {
    function save(values: {
        internal_code: string;
        name: string;
        description: string;
        default_unit_price: string;
    }) {
        router.post(store.url(), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Novo item" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <ItemForm
                        mode="create"
                        onCancel={() => router.visit(create.url())}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

ItemCreate.layout = {
    breadcrumbs: [
        {
            title: 'Itens',
            href: '/items',
        },
        {
            title: 'Novo item',
            href: '/items/create',
        },
    ],
};
