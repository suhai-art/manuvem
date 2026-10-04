import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/admin/roles';
import { RolesTable } from './roles-table';
import { useState } from 'react';

type Permission = { id: number; name: string; guard_name: string };

type Role = {
    id: number;
    name: string;
    permissions?: Permission[];
    permissions_count: number;
};

type RolesPayload = {
    data: Role[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

export default function RolesIndex() {
    const props = usePage().props;
    const initialRoles: RolesPayload = props.roles as RolesPayload;
    const permissions: Permission[] = (props.permissions ?? []) as Permission[];

    const [roles, setRoles] = useState<RolesPayload>(initialRoles);

    async function remove(role: Role) {
        if (!window.confirm(`Excluir a role "${role.name}"?`)) return;
        await router.delete(destroy.url(role.id), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title="Cargos" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <RolesTable
                        roles={roles}
                        onCreate={() => router.visit(store.url())}
                        onEdit={(role) => {
                            router.visit(update.url(role.id));
                        }}
                        onDelete={remove}
                    />
                </div>
            </main>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Cargos',
            href: index(),
        },
    ],
};