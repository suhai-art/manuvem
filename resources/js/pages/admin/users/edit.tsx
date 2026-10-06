import { Head, usePage, router } from '@inertiajs/react';
import { update } from '@/routes/admin/users';
import { UserForm } from './user-form';

type UserShape = {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
};

type PageProps = {
    user: UserShape;
    roles: string[];
};

export default function UserEdit() {
    const { user, roles } = usePage<PageProps>().props;

    function save(values: { name: string; email: string; password: string; roles: string[] }) {
        router.put(update.url({ user: user.id }), values, {
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <>
            <Head title={`Editar ${user.name}`} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <UserForm
                        mode="edit"
                        roles={roles}
                        initialValues={{ name: user.name, email: user.email, role: user.roles[0]?.name ?? '' }}
                        onCancel={() => router.visit('/admin/users')}
                        onSubmit={save}
                    />
                </div>
            </main>
        </>
    );
}

UserEdit.layout = (
    prev: { breadcrumbs?: { title: string; href: string }[] } | undefined,
) => ({
    ...prev,
    breadcrumbs: [
        ...(prev?.breadcrumbs ?? []),
        {
            title: 'Usuários',
            href: '/admin/users',
        },
    ],
});