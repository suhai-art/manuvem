import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/admin/users';
import { UsersTable } from './users-table';
import { useState } from 'react';
import { User, UsersPayload } from './users-table';

export default function UserIndex() {
    const page = usePage().props;
    const initialUsers: UsersPayload = page.users;
    const roles = page.roles;

    const [users, setUsers] = useState<UsersPayload>(initialUsers);

    async function remove(user: User) {
        if (!window.confirm(`Excluir o usuário ${user.name}?`)) return;
        await router.delete(destroy.url(user.id), {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title="Usuarios" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <UsersTable
                        users={users}
                        onCreate={() => router.visit(store.url())}
                        onEdit={(user) => {
                            router.visit(update.url(user.id));
                        }}
                        onDelete={remove}
                    />
                </div>
            </main>
        </>
    );
}

UserIndex.layout = {
    breadcrumbs: [
        {
            title: 'Usuarios',
            href: index(),
        },
    ],
};