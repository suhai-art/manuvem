import { Head, router, usePage } from '@inertiajs/react';
import { edit, update } from '@/routes/items';
import { ItemForm } from './item-form';

type Item = {
    id: number;
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
};

export default function ItemEdit() {
    const item = (usePage().props as Record<string, unknown>).item as Item;

    function save(values: {
        internal_code: string;
        name: string;
        description: string;
        default_unit_price: string;
    }) {
        router.put(update.url({ item: item.id }), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Editar ${item.name}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <ItemForm
                        mode="edit"
                        initialValues={{
                            internal_code: item.internal_code,
                            name: item.name,
                            description: item.description,
                            default_unit_price: item.default_unit_price,
                        }}
                        onCancel={() =>
                            router.visit(edit.url({ item: item.id }))
                        }
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

ItemEdit.layout = {
    breadcrumbs: [
        {
            title: 'Itens',
            href: '/items',
        },
        {
            title: 'Editar item',
            href: '',
        },
    ],
};
