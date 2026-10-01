import { FormEvent, useState } from 'react';
import { ArrowLeft, PencilRuler, Save, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/items';
import { Link } from '@inertiajs/react';

type ItemValues = {
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
};

type ItemFormProps = {
    mode: 'create' | 'edit';
    initialValues?: ItemValues;
    onCancel?: () => void;
    onSubmit?: (values: ItemValues) => void;
};

export function ItemForm({
    mode,
    initialValues,
    onCancel,
    onSubmit,
}: ItemFormProps) {
    const [internalCode, setInternalCode] = useState(
        initialValues?.internal_code ?? '',
    );
    const [name, setName] = useState(initialValues?.name ?? '');
    const [description, setDescription] = useState(
        initialValues?.description ?? '',
    );
    const [price, setPrice] = useState(
        initialValues?.default_unit_price ?? '',
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit?.({
            internal_code: internalCode,
            name,
            description,
            default_unit_price: price,
        });
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
                    Voltar para itens
                </button>
                <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <PencilRuler
                            className="size-5"
                            aria-hidden="true"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {mode === 'create'
                                ? 'Novo item'
                                : 'Editar item'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Cadastre um novo item no catálogo.'
                                : 'Atualize os dados deste item.'}
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
                        <Label>Código interno</Label>
                        <Input
                            required
                            value={internalCode}
                            onChange={(e) =>
                                setInternalCode(e.target.value)
                            }
                            placeholder="Ex.: ITEM-001"
                        />
                    </div>
                    <div>
                        <Label>Preço unitário</Label>
                        <Input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0,00"
                        />
                    </div>
                </div>

                <div>
                    <Label>Nome</Label>
                    <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex.: Widget A"
                    />
                </div>

                <div>
                    <Label>Descrição</Label>
                    <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                        placeholder="Descreva o item..."
                    />
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
                            ? 'Criar Item'
                            : 'Salvar alterações'}
                    </button>
                </div>
            </form>
        </section>
    );
}
