import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Minus, PencilRuler, Plus } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react';
import useRole from '@/hooks/use-role';
import { store as clienteStore } from '@/routes/clientes';
import {
    index as vendaIndex,
    store as vendaStore,
    update as vendaUpdate,
} from '@/routes/vendas';
import type { Cliente, Item, Venda, VendaItem } from '@/models/Venda';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

/* -------------------------------------------------------------------------- */
/* Tipos                                                                      */
/* -------------------------------------------------------------------------- */

type VendaStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type VendaItemField = 'item_id' | 'quantity' | 'unit_price' | 'description';
type ClienteField = 'name' | 'documento';

type VendaItemDraft = {
    uid: string;
    item_id: number | null;
    quantity: string;
    unit_price: string;
    description: string;
};

type VendaDraft = {
    name: string;
    external_id: string;
    sale_date: string;
    has_custom_date: boolean;
    cliente_id: number | null;
    status: VendaStatus;
    is_priority: boolean;
    itens: VendaItemDraft[];
};

type ClienteDraft = { name: string; documento: string };

type VendaFormProps = {
    mode: 'create' | 'edit';
    clientes?: Cliente[];
    items?: Item[];
    venda?: Venda;
};

type VendaItemRowProps = {
    item: VendaItemDraft;
    items: Item[];
    canRemove: boolean;
    onChange: (uid: string, field: VendaItemField, value: string) => void;
    onRemove: (uid: string) => void;
};

/* -------------------------------------------------------------------------- */
/* Constantes                                                                 */
/* -------------------------------------------------------------------------- */

const STATUS_LABELS: Record<VendaStatus, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as VendaStatus[];

const OUTLINE_LINK_CLASS =
    'rounded-lg border border-input px-4 py-2 text-sm font-medium transition hover:bg-muted';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

/* -------------------------------------------------------------------------- */
/* Regras de negócio (funções puras)                                          */
/* -------------------------------------------------------------------------- */

const formatPrice = (value: number): string => currencyFormatter.format(value);

const createEmptyItem = (): VendaItemDraft => ({
    uid: crypto.randomUUID(),
    item_id: null,
    quantity: '1',
    unit_price: '',
    description: '',
});

const toItemDraft = (vendaItem: VendaItem): VendaItemDraft => ({
    uid: crypto.randomUUID(),
    item_id: vendaItem.item?.id ?? vendaItem.item_id ?? null,
    quantity: String(vendaItem.quantity),
    unit_price: String(vendaItem.unit_price),
    description: vendaItem.description ?? '',
});

const buildInitialDraft = (venda?: Venda): VendaDraft => ({
    name: venda?.name ?? '',
    external_id: venda?.external_id ?? '',
    sale_date: venda?.sale_date ?? '',
    has_custom_date: venda?.has_custom_date ?? false,
    cliente_id: venda?.cliente?.id ?? null,
    status: venda?.status ?? 'pending',
    is_priority: venda?.is_priority ?? false,
    itens: venda?.itens?.map(toItemDraft) ?? [createEmptyItem()],
});

const calculateItemSubtotal = (item: VendaItemDraft): number =>
    (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);

const calculateTotal = (itens: VendaItemDraft[]): number =>
    itens.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);

const appendItem = (draft: VendaDraft): VendaDraft => ({
    ...draft,
    itens: [...draft.itens, createEmptyItem()],
});

// O draft é o último parâmetro para permitir o uso de .bind() nos handlers.
const removeItem = (uid: string, draft: VendaDraft): VendaDraft => ({
    ...draft,
    itens: draft.itens.filter((item) => item.uid !== uid),
});

const updateItem = (
    uid: string,
    field: VendaItemField,
    value: string,
    draft: VendaDraft,
): VendaDraft => ({
    ...draft,
    itens: draft.itens.map((item) =>
        item.uid === uid ? { ...item, [field]: value } : item,
    ),
});

const toVendaPayload = (draft: VendaDraft) => ({
    name: draft.name.trim() || null,
    external_id: draft.external_id.trim() || null,
    sale_date: draft.has_custom_date ? draft.sale_date : null,
    has_custom_date: draft.has_custom_date,
    cliente_id: draft.cliente_id,
    status: draft.status,
    is_priority: draft.is_priority,
    itens: draft.itens.map(({ item_id, quantity, unit_price, description }) => ({
        item_id,
        quantity: Number(quantity),
        unit_price: Number(unit_price),
        description,
    })),
});

const toClientePayload = (draft: ClienteDraft) => ({
    name: draft.name.trim(),
    documento: draft.documento.trim() || null,
});

/* -------------------------------------------------------------------------- */
/* Handlers (nível de módulo, ligados ao JSX via .bind)                       */
/* -------------------------------------------------------------------------- */

function submitVenda(
    form: InertiaFormProps<VendaDraft>,
    venda: Venda | undefined,
    event: FormEvent<HTMLFormElement>,
): void {
    event.preventDefault();
    form.transform(toVendaPayload);

    if (venda) {
        form.put(vendaUpdate.url({ venda: venda.id }));
        return;
    }

    form.post(vendaStore.url());
}

function handleAddItem(form: InertiaFormProps<VendaDraft>): void {
    form.setData(appendItem);
}

function handleRemoveItem(
    form: InertiaFormProps<VendaDraft>,
    uid: string,
): void {
    form.setData(removeItem.bind(null, uid));
}

function handleItemChange(
    form: InertiaFormProps<VendaDraft>,
    uid: string,
    field: VendaItemField,
    value: string,
): void {
    form.setData(updateItem.bind(null, uid, field, value));
}

function handleItemSelection(
    onChange: VendaItemRowProps['onChange'],
    uid: string,
    items: Item[],
    value: string,
): void {
    const selectedItem = items.find((item) => item.id === Number(value));
    if (!selectedItem) return;

    onChange(uid, 'item_id', value);
    onChange(uid, 'unit_price', selectedItem.default_unit_price);
}

function handleClienteChange(
    form: InertiaFormProps<VendaDraft>,
    value: string,
): void {
    form.setData('cliente_id', Number(value));
}

function handleStatusChange(
    form: InertiaFormProps<VendaDraft>,
    value: string,
): void {
    form.setData('status', value as VendaStatus);
}

function handlePriorityChange(
    form: InertiaFormProps<VendaDraft>,
    event: ChangeEvent<HTMLInputElement>,
): void {
    form.setData('is_priority', event.target.checked);
}

function handleInputChange(
    onChange: VendaItemRowProps['onChange'],
    uid: string,
    field: VendaItemField,
    event: ChangeEvent<HTMLInputElement>,
): void {
    onChange(uid, field, event.target.value);
}

function handleClienteFieldChange(
    form: InertiaFormProps<ClienteDraft>,
    field: ClienteField,
    event: ChangeEvent<HTMLInputElement>,
): void {
    form.setData(field, event.target.value);
}

function submitCliente(
    form: InertiaFormProps<ClienteDraft>,
    onCreated: () => void,
): void {
    if (!form.data.name.trim()) return;

    form.transform(toClientePayload);
    form.post(clienteStore().url, {
        preserveScroll: true,
        only: ['clientes'],
        onSuccess: onCreated,
    });
}

/* -------------------------------------------------------------------------- */
/* Componentes                                                                */
/* -------------------------------------------------------------------------- */

function ErrorSummary({ errors }: { errors: Record<string, string> }) {
    const messages = Object.entries(errors);
    if (messages.length === 0) return null;

    return (
        <div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {messages.map(([field, message]) => (
                <div key={field}>{message}</div>
            ))}
        </div>
    );
}

function NovoClienteForm({ onCreated }: { onCreated: () => void }) {
    const form = useForm<ClienteDraft>({ name: '', documento: '' });

    return (
        <>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="cliente_nome">Nome</Label>
                    <Input
                        id="cliente_nome"
                        value={form.data.name}
                        onChange={handleClienteFieldChange.bind(
                            null,
                            form,
                            'name',
                        )}
                        placeholder="Nome do cliente"
                    />
                    {form.errors.name && (
                        <p className="text-sm text-destructive">
                            {form.errors.name}
                        </p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="cliente_documento">Documento</Label>
                    <Input
                        id="cliente_documento"
                        value={form.data.documento}
                        onChange={handleClienteFieldChange.bind(
                            null,
                            form,
                            'documento',
                        )}
                        placeholder="CPF ou CNPJ"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" type="button">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button
                    type="button"
                    disabled={form.processing}
                    onClick={submitCliente.bind(null, form, onCreated)}
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Criar cliente
                </Button>
            </DialogFooter>
        </>
    );
}

// O Radix desmonta o conteúdo ao fechar, então o estado do formulário
// interno reseta sozinho.
function NovoClienteDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <Plus className="size-4" aria-hidden="true" />
                    Novo cliente
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo cliente</DialogTitle>
                    <DialogDescription>
                        Crie um cliente para associar a esta venda.
                    </DialogDescription>
                </DialogHeader>
                <NovoClienteForm onCreated={setOpen.bind(null, false)} />
            </DialogContent>
        </Dialog>
    );
}

function VendaFormHeader({ isEdit }: { isEdit: boolean }) {
    const { hasPermission } = useRole();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    {isEdit ? 'Editar venda' : 'Nova venda'}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {isEdit
                        ? 'Atualize os dados desta venda.'
                        : 'Crie uma nova venda com cliente e itens.'}
                </p>
            </div>
            <div className="flex gap-2">
                {hasPermission('vendas.view') && (
                    <Link href={vendaIndex()} className={OUTLINE_LINK_CLASS}>
                        Voltar
                    </Link>
                )}
                <NovoClienteDialog />
            </div>
        </div>
    );
}

function VendaItemRow({
    item,
    items,
    canRemove,
    onChange,
    onRemove,
}: VendaItemRowProps) {
    return (
        <div className="grid grid-cols-12 gap-3 rounded-lg border border-border/70 p-3">
            <div className="col-span-12 sm:col-span-3">
                <Label className="text-xs">Item</Label>
                <Select
                    value={item.item_id ? String(item.item_id) : ''}
                    onValueChange={handleItemSelection.bind(
                        null,
                        onChange,
                        item.uid,
                        items,
                    )}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um item" />
                    </SelectTrigger>
                    <SelectContent>
                        {items.map((option) => (
                            <SelectItem
                                key={option.id}
                                value={String(option.id)}
                            >
                                {option.internal_code} - {option.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="col-span-12 sm:col-span-2">
                <Label className="text-xs">Descrição</Label>
                <Input
                    value={item.description}
                    placeholder="Descrição da venda"
                    onChange={handleInputChange.bind(
                        null,
                        onChange,
                        item.uid,
                        'description',
                    )}
                />
            </div>

            <div className="col-span-12 sm:col-span-2">
                <Label className="text-xs">Quantidade</Label>
                <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={handleInputChange.bind(
                        null,
                        onChange,
                        item.uid,
                        'quantity',
                    )}
                />
            </div>

            <div className="col-span-12 sm:col-span-3">
                <Label className="text-xs">Valor unitário</Label>
                <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price}
                    onChange={handleInputChange.bind(
                        null,
                        onChange,
                        item.uid,
                        'unit_price',
                    )}
                />
            </div>

            <div className="col-span-12 flex items-end justify-end sm:col-span-1">
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={onRemove.bind(null, item.uid)}
                    disabled={!canRemove}
                    aria-label="Remover item"
                >
                    <Minus className="size-4" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}

function VendaForm({
    mode,
    clientes = [],
    items = [],
    venda,
}: VendaFormProps) {
    const isEdit = mode === 'edit';
    const form = useForm<VendaDraft>(buildInitialDraft(venda));
    const total = calculateTotal(form.data.itens);

    return (
        <form
            onSubmit={submitVenda.bind(null, form, venda)}
            className="flex flex-col gap-6 p-4 sm:p-8"
        >
            <VendaFormHeader isEdit={isEdit} />

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="venda_nome">Nome da venda</Label>
                    <Input
                        id="venda_nome"
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        placeholder="Nome da venda"
                    />
                    {form.errors.name && (
                        <p className="text-sm text-destructive">
                            {form.errors.name}
                        </p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="venda_id_externo">ID externo</Label>
                    <Input
                        id="venda_id_externo"
                        value={form.data.external_id}
                        onChange={(event) =>
                            form.setData('external_id', event.target.value)
                        }
                        placeholder="Identificador no sistema externo"
                    />
                    {form.errors.external_id && (
                        <p className="text-sm text-destructive">
                            {form.errors.external_id}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-border/70 p-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={form.data.has_custom_date}
                        onChange={(event) => {
                            const checked = event.target.checked;
                            form.setData((data) => ({
                                ...data,
                                has_custom_date: checked,
                                sale_date: checked ? data.sale_date : '',
                            }));
                        }}
                        className="size-4 rounded border-border bg-background"
                    />
                    Informar data manualmente
                </label>
                {form.data.has_custom_date && (
                    <div className="grid max-w-sm gap-2">
                        <Label htmlFor="venda_data">Data da venda</Label>
                        <Input
                            id="venda_data"
                            type="date"
                            value={form.data.sale_date}
                            onChange={(event) =>
                                form.setData('sale_date', event.target.value)
                            }
                        />
                        {form.errors.sale_date && (
                            <p className="text-sm text-destructive">
                                {form.errors.sale_date}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label>Cliente</Label>
                    <Select
                        value={
                            form.data.cliente_id
                                ? String(form.data.cliente_id)
                                : ''
                        }
                        onValueChange={handleClienteChange.bind(null, form)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {clientes.map((cliente) => (
                                <SelectItem
                                    key={cliente.id}
                                    value={String(cliente.id)}
                                >
                                    {cliente.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                        value={form.data.status}
                        onValueChange={handleStatusChange.bind(null, form)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-3">
                <Label>Itens</Label>
                <div className="space-y-3">
                    {form.data.itens.map((item) => (
                        <VendaItemRow
                            key={item.uid}
                            item={item}
                            items={items}
                            canRemove={form.data.itens.length > 1}
                            onChange={handleItemChange.bind(null, form)}
                            onRemove={handleRemoveItem.bind(null, form)}
                        />
                    ))}
                </div>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleAddItem.bind(null, form)}
                    className="gap-1.5"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Adicionar item
                </Button>
            </div>

            <div className="grid gap-3 rounded-lg bg-muted/30 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-xl font-bold text-primary">
                        {formatPrice(total)}
                    </span>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={form.data.is_priority}
                        onChange={handlePriorityChange.bind(null, form)}
                        className="size-4 rounded border-border bg-background"
                    />
                    É prioridade
                </label>
            </div>

            <ErrorSummary errors={form.errors} />

            <div className="flex justify-end gap-3 border-t border-border/70 pt-6">
                <Link href={vendaIndex()} className={OUTLINE_LINK_CLASS}>
                    Cancelar
                </Link>
                <Button type="submit" disabled={form.processing}>
                    <PencilRuler className="size-4" aria-hidden="true" />
                    {isEdit ? 'Salvar alterações' : 'Criar venda'}
                </Button>
            </div>
        </form>
    );
}

export { VendaForm };
