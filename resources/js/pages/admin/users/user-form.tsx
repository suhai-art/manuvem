import { FormEvent, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react';

type UserFormProps = {
    mode: 'create' | 'edit';
    initialValues?: { name: string; email: string; role: string };
    roles: string[];
    onCancel?: () => void;
    onSubmit?: (values: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) => void;
};

export function UserForm({
    mode,
    initialValues,
    roles,
    onCancel,
    onSubmit,
}: UserFormProps) {
    const [name, setName] = useState(initialValues?.name ?? '');
    const [email, setEmail] = useState(initialValues?.email ?? '');
    const [role, setRole] = useState(initialValues?.role ?? roles[0] ?? '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit?.({ name, email, password, role });
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 p-6 sm:p-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
                    para usuários
                </button>
                <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {mode === 'create'
                                ? 'Criar usuário'
                                : 'Editar usuário'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Adicione um novo usuário à aplicação.'
                                : 'Atualize os dados e permissões deste usuário.'}
                        </p>
                    </div>
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 p-6 sm:p-8"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-medium">
                        Nome completo
                        <input
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                            placeholder="Ex.: Maria Silva"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                        E-mail
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                            placeholder="maria@exemplo.com"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                        Perfil
                        <select
                            required
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                        >
                            {roles.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium">
                        Senha
                        {mode === 'edit' && (
                            <span className="text-xs font-normal text-muted-foreground">
                                Deixe em branco para manter a atual.
                            </span>
                        )}
                        <span className="relative">
                            <input
                                required={mode === 'create'}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                className="h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                placeholder={
                                    mode === 'create'
                                        ? 'Mínimo de 8 caracteres'
                                        : 'Nova senha'
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                                aria-label={
                                    showPassword
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </span>
                    </label>
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
                        {mode === 'create'
                            ? 'Criar usuário'
                            : 'Salvar alterações'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export type { UserFormProps };
