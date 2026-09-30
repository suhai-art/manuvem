import { FormEvent, useState } from 'react';
import { ArrowLeft, Save, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type Permission = { id: number; name: string; guard_name: string };

type RoleFormProps = {
    mode: 'create' | 'edit';
    permissions: Permission[];
    initialName?: string;
    initialPermissions?: number[];
    onCancel?: () => void;
    onSubmit?: (values: { name: string; permissions: number[] }) => void;
};

export function RoleForm({
    mode,
    permissions,
    initialName = '',
    initialPermissions = [],
    onCancel,
    onSubmit,
}: RoleFormProps) {
    const [name, setName] = useState(initialName);
    const [selected, setSelected] = useState<number[]>(initialPermissions);

    function toggle(id: number) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit?.({ name, permissions: selected });
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 p-6 sm:p-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Voltar para cargos
                </button>
                <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Shield className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {mode === 'create' ? 'Criar cargo' : 'Editar cargo'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Crie um novo perfil com suas permissões.'
                                : 'Atualize o nome e as permissões deste perfil.'}
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 p-6 sm:p-8"
            >
                <div>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                        Nome do cargo
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                            placeholder="Ex.: admin, editor, leitor"
                        />
                    </label>
                </div>

                <div>
                    <p className="mb-3 text-sm font-medium text-foreground">
                        Permissões
                    </p>
                    <div className="flex flex-col gap-2">
                        {permissions.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
                                Nenhuma permissão disponível.
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-input/50 bg-background px-3 py-2 text-sm transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 hover:border-ring"
                                    >
                                        <Checkbox
                                            checked={selected.includes(
                                                permission.id,
                                            )}
                                            onCheckedChange={() =>
                                                toggle(permission.id)
                                            }
                                            id={`perm-${permission.id}`}
                                        />
                                        <span className="text-muted-foreground select-none">
                                            {permission.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border/70 pt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-input px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                        <Save className="size-4" aria-hidden="true" />
                        {mode === 'create' ? 'Criar Cargo' : 'Salvar alterações'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export type { RoleFormProps, Permission };
