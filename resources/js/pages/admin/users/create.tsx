import { Head, usePage, router } from '@inertiajs/react';
import { create, store } from '@/routes/admin/users';
import { UserForm } from './user-form';

type PageProps = {
    roles: string[];
};

export default function UserCreate() {
    const { roles } = usePage<PageProps>().props;

    function save(values: { name: string; email: string; password: string; roles: string[] }) {
        console.log(values)
        router.post(store.url(), values, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Novo usuário" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <UserForm
                        mode="create"
                        roles={roles}
                        onCancel={() => router.visit(create.url())}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

UserCreate.layout = {
    breadcrumbs: [
        {
            title: 'Usuários',
            href: create.url(),
        },
        {
            title: 'Novo usuário',
            href: create.url(),
        },
    ],
};
