import { Head, usePage, router } from '@inertiajs/react';
import { index, store, update, destroy } from '@/routes/admin/users';
import { UsersTable } from './users-table';
import { UserForm } from './user-form';
import { useState } from 'react';
import { User, UsersPayload } from './users-table';

export default function UserIndex() {
    const page = usePage().props;
    const initialUsers: UsersPayload = page.users;
    const roles = page.roles;

    const [users, setUsers] = useState<UsersPayload>(initialUsers);
    const [screen, setScreen] = useState<'index' | 'create' | 'edit'>('index');
    const [selected, setSelected] = useState<User | undefined>();

    function save(values: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) {
        if (screen === 'create') {
            router.post(
                store.url(),
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    password_confirmation: values.password,
                    roles: [values.role],
                },
                {
                    preserveScroll: true,
                    preserveState: false,
                },
            );
        } else if (selected) {
            const data = {
                name: values.name,
                email: values.email,
                roles: [values.role],
                ...(values.password
                    ? {
                          password: values.password,
                          password_confirmation: values.password,
                      }
                    : {}),
            };
            router.put(update.url(selected.id), data, {
                preserveScroll: true,
                preserveState: false,
            });
        }
        setScreen('index');
    }

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
                    {screen === 'index' ? (
                        <UsersTable
                            users={users}
                            onCreate={() => setScreen('create')}
                            onEdit={(user) => {
                                setSelected(user);
                                setScreen('edit');
                            }}
                            onDelete={remove}
                        />
                    ) : (
                        <UserForm
                            mode={screen}
                            roles={roles}
                            initialValues={
                                selected
                                    ? {
                                          name: selected.name,
                                          email: selected.email,
                                          role:
                                              selected.roles[0]?.name ??
                                              roles[0],
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

UserIndex.layout = {
    breadcrumbs: [
        {
            title: 'Usuarios',
            href: index(),
        },
    ],
};
