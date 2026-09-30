import { Head, usePage } from '@inertiajs/react';
import { index } from '@/routes/admin/roles';
import { Shield, ShieldCheck } from 'lucide-react';

type Permission = { id: number; name: string; guard_name: string };

type Role = {
    id: number;
    name: string;
    permissions?: Permission[];
    _count?: { permissions: number };
    created_at: string | null;
    updated_at: string | null;
};

type PageProps = {
    role: Role & { permissions: Permission[] };
};

const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

export default function RoleShow() {
    const { role } = usePage<PageProps>().props;

    return (
        <>
            <Head title={role.name} />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                        <div className="border-b border-border/70 p-6 sm:p-8">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Shield
                                        className="size-5"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                        {role.name}
                                    </h1>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {role._count?.permissions != null
                                            ? role._count.permissions === 1
                                                ? '1 permissão'
                                                : `${role._count.permissions} permissões`
                                            : role.permissions.length === 1
                                              ? '1 permissão'
                                              : `${role.permissions.length} permissões`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 p-6 sm:p-8">
                            <div>
                                <h2 className="mb-3 text-sm font-medium text-foreground">
                                    Permissões
                                </h2>
                                {role.permissions.length === 0 ? (
                                    <p className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
                                        Este cargo não tem permissões atribuídas.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {role.permissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center gap-3 rounded-lg border border-input/50 bg-background px-3 py-2 text-sm"
                                            >
                                                <ShieldCheck
                                                    className="size-4 shrink-0 text-primary"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-foreground">
                                                    {permission.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-border/70 px-6 py-4 sm:px-8">
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Criado em
                                </span>
                                <span>{formatDate(role.created_at)}</span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Atualizado em
                                </span>
                                <span>{formatDate(role.updated_at)}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

RoleShow.layout = (
    prev: { breadcrumbs?: { title: string; href: string }[] } | undefined,
) => ({
    ...prev,
    breadcrumbs: [
        ...(prev?.breadcrumbs ?? []),
        {
            title: 'Cargos',
            href: index(),
        },
        {
            title: role.name,
            href: index(),
        },
    ],
});
