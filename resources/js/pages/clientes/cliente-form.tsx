import { FormEvent, useState } from 'react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/clientes';

type ClienteFormProps = {
    mode: 'create' | 'edit';
    initialName?: string;
    initialDocumento?: string;
    onSubmit?: (values: { name: string; documento: string }) => void;
};

export function ClienteForm({
    mode,
    initialName = '',
    initialDocumento = '',
    onSubmit,
}: ClienteFormProps) {
    const [name, setName] = useState(initialName);
    const [documento, setDocumento] = useState(initialDocumento);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit?.({ name, documento });
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 p-6 sm:p-8">
                <Link
                    type="button"
                    href={index()}
                    className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
                    para clientes
                </Link>
                <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <User className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {mode === 'create'
                                ? 'Novo cliente'
                                : 'Editar cliente'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Cadastre um novo cliente.'
                                : 'Atualize os dados deste cliente.'}
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 p-6 sm:p-8"
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex.: João Silva"
                        />
                    </div>
                    <div>
                        <Label htmlFor="documento">Documento</Label>
                        <Input
                            id="documento"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            placeholder="CPF ou CNPJ"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border/70 pt-6">
                    <Link
                        type="button"
                        href={index()}
                        className="rounded-lg border border-input px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                        <Save className="size-4" aria-hidden="true" />
                        {mode === 'create'
                            ? 'Criar cliente'
                            : 'Salvar alterações'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export type { ClienteFormProps };
