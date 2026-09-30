import { Head, usePage, router } from '@inertiajs/react';
import { edit, update } from '@/routes/admin/roles';
import { RoleForm } from './role-form';
import type { Permission } from './role-form';

type RoleShape = {
    id: number;
    name: string;
    permissions: { id: number; name: string }[];
};

type PageProps = {
    role: RoleShape;
    permissions?: Permission[];
};

export default function RoleEdit() {
    const { role, permissions = [] } = usePage<PageProps>().props;

    function save(values: { name: string; permissions: number[] }) {
        router.put(update.url(role.id), values, {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title={`Editar ${role.name}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <RoleForm
                        mode="edit"
                        permissions={permissions}
                        initialName={role.name}
                        initialPermissions={role.permissions.map((p) => p.id)}
                        onCancel={() => router.visit(edit.url(role.id))}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

RoleEdit.layout = (
    prev: { breadcrumbs?: { title: string; href: string }[] } | undefined,
) => ({
    ...prev,
    breadcrumbs: [
        ...(prev?.breadcrumbs ?? []),
        {
            title: 'Cargos',
            href: edit.url(role.id),
        },
        {
            title: role.name,
            href: edit.url(role.id),
        },
    ],
});
