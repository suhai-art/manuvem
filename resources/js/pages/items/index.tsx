import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/items';
import { ItemsTable } from './items-table';
import { ItemForm } from './item-form';
import { useState } from 'react';

type Item = {
    id: number;
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
    created_at: string;
};

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

    const [items, setItems] = useState<ItemsPayload>(initialItems);
    const [screen, setScreen] = useState<'index' | 'create' | 'edit'>('index');
    const [selected, setSelected] = useState<Item | undefined>();

    function save(values: {
        internal_code: string;
        name: string;
        description: string;
        default_unit_price: string;
    }) {
        if (screen === 'create') {
            router.post(store.url(), values, {
                preserveScroll: true,
                preserveState: false,
            });
        } else if (selected) {
            router.put(update.url({ item: selected.id }), values, {
                preserveScroll: true,
                preserveState: false,
            });
        }
        setScreen('index');
    }

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
                    {screen === 'index' ? (
                        <ItemsTable
                            items={items}
                            onCreate={() => setScreen('create')}
                            onEdit={(item) => {
                                setSelected(item);
                                setScreen('edit');
                            }}
                            onDelete={remove}
                        />
                    ) : (
                        <ItemForm
                            mode={screen}
                            initialValues={
                                selected
                                    ? {
                                          internal_code: selected.internal_code,
                                          name: selected.name,
                                          description: selected.description,
                                          default_unit_price:
                                              selected.default_unit_price,
                                      }
                                    : undefined
                            }
                            onCancel={() => setScreen('index')}
                            onSubmit={save}
                        />
                    )}
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