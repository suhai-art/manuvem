import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/admin/roles';
import { RolesTable } from './roles-table';
import { RoleForm } from './role-form';
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
    const [screen, setScreen] = useState<'index' | 'create' | 'edit'>('index');
    const [selected, setSelected] = useState<Role | undefined>();

    function save(values: { name: string; permissions: number[] }) {
        if (screen === 'create') {
            router.post(store.url(), values, {
                preserveScroll: true,
                preserveState: false,
            });
        } else if (selected) {
            router.put(update.url(selected.id), values, {
                preserveScroll: true,
                preserveState: false,
            });
        }
        setScreen('index');
    }

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
                    {screen === 'index' ? (
                        <RolesTable
                            roles={roles}
                            onCreate={() => setScreen('create')}
                            onEdit={(role) => {
                                setSelected(role);
                                setScreen('edit');
                            }}
                            onDelete={remove}
                        />
                    ) : (
                        <RoleForm
                            mode={screen}
                            permissions={permissions}
                            initialName={selected?.name}
                            initialPermissions={
                                selected?.permissions?.map((p) => p.id) ?? []
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

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Cargos',
            href: index(),
        },
    ],
};
