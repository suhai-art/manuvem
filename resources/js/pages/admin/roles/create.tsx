import { Head, usePage, router } from '@inertiajs/react';
import { create, store } from '@/routes/admin/roles';
import { RoleForm } from './role-form';

type Permission = { id: number; name: string; guard_name: string };

export default function RoleCreate() {
    const { permissions: permissionsProp } = usePage().props;
    console.log(usePage().props)
    const permissions: Permission[] = permissionsProp
        ? (permissionsProp as Permission[])
        : [];

    function save(values: { name: string; permissions: number[] }) {
        router.post(store.url(), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Nova role" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <RoleForm
                        mode="create"
                        permissions={permissions}
                        onCancel={() => router.visit(create().url())}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

RoleCreate.layout = {
    breadcrumbs: [
        {
            title: 'Cargos',
            href: create(),
        },
        {
            title: 'Novo cargo',
            href: create(),
        },
    ],
};
