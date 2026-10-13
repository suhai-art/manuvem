import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Pencil,
    Printer,
    Star,
    UserRound,
} from 'lucide-react';
import { edit, index } from '@/routes/vendas';
import type { Cliente, Item, Venda } from '@/models/Venda';

type VendaShowItem = Item & {
    pivot: {
        quantity: number;
        unit_price: number;
        description: string | null;
    };
    subtotal?: number;
};

type VendaShowRecord = Omit<Venda, 'cliente' | 'itens'> & {
    cliente: Cliente | null;
    itens?: VendaShowItem[];
};

type VendasShowProps = {
    venda: VendaShowRecord;
    companyLogoUrl: string | null;
};

const statusLabels: Record<Venda['status'], string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

const statusStyles: Record<Venda['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(value) || 0);

const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'medium',
              timeStyle: 'short',
          }).format(date);
};

const formatSaleDate = (
    venda: Pick<Venda, 'has_custom_date' | 'sale_date' | 'created_at'>,
) => {
    if (!venda.has_custom_date || !venda.sale_date) {
        return formatDate(venda.created_at);
    }

    const [year, month, day] = venda.sale_date.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
    }).format(new Date(year, month - 1, day));
};

export default function VendasShow({ venda, companyLogoUrl }: VendasShowProps) {
    const itens = venda.itens ?? [];
    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
    const [includeReceipt, setIncludeReceipt] = useState(true);
    const [includeProductionOrder, setIncludeProductionOrder] = useState(true);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [exportOption, setExportOption] = useState<'receipt' | 'production' | 'both'>('both');

    const selectExportOption = (option: 'receipt' | 'production' | 'both') => {
        setExportOption(option);

        if (option === 'receipt') {
            setIncludeReceipt(true);
            setIncludeProductionOrder(false);
            return;
        }

        if (option === 'production') {
            setIncludeReceipt(false);
            setIncludeProductionOrder(true);
            return;
        }

        setIncludeReceipt(true);
        setIncludeProductionOrder(true);
    };

    const handleExportPdf = () => {
        setIsExportDialogOpen(true);
    };

    const confirmExportPdf = () => {
        setIsExportDialogOpen(false);
        window.print();
    };

    const itemSubtotal = (item: VendaShowItem) =>
        Number(item.subtotal ?? Number(item.pivot.quantity) * Number(item.pivot.unit_price));

    const signatureBlock = (
        <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm">
            <div className="border-t border-black pt-2">Assinatura do cliente</div>
            <div className="border-t border-black pt-2">Data</div>
        </div>
    );

    const renderDocumentHeader = (title: string) => (
        <header className="venda-document-header flex items-center justify-between gap-6 border-b border-black pb-5">
            {companyLogoUrl ? (
                <img
                    src={companyLogoUrl}
                    alt="Logo da empresa"
                    className="max-h-16 max-w-48 object-contain object-left"
                />
            ) : (
                <span />
            )}
            <div className="text-right">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-sm">Venda #{venda.id}</p>
            </div>
        </header>
    );

    return (
        <>
            <Head title={`Detalhes da venda #${venda.id}`} />
            <main className="venda-print-root min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-5xl space-y-6 print-hide">
                    <div className="hidden items-center justify-between border-b pb-5 print:flex">
                        {companyLogoUrl ? (
                            <img
                                src={companyLogoUrl}
                                alt="Logo da empresa"
                                className="max-h-16 max-w-48 object-contain object-left"
                            />
                        ) : (
                            <span />
                        )}
                        <div className="text-right">
                            <h1 className="text-xl font-semibold">Comprovante de venda</h1>
                            <p className="text-sm text-muted-foreground">Venda #{venda.id}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link
                                href={index()}
                                className="print-hide mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                            >
                                <ArrowLeft className="size-4" aria-hidden="true" />
                                Voltar para vendas
                            </Link>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Venda #{venda.id}
                                </h1>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[venda.status]}`}>
                                    {statusLabels[venda.status]}
                                </span>
                                {venda.is_priority && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                                        <Star className="size-3.5" aria-hidden="true" />
                                        Prioridade
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Consulte os dados e itens desta venda.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-end gap-4">
                            {/* <fieldset className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                <legend className="mb-2 font-medium">Páginas do PDF</legend>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={includeReceipt}
                                        onChange={(event) => setIncludeReceipt(event.target.checked)}
                                        className="size-4 accent-primary"
                                    />
                                    Recibo
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={includeProductionOrder}
                                        onChange={(event) => setIncludeProductionOrder(event.target.checked)}
                                        className="size-4 accent-primary"
                                    />
                                    Ordem de produção
                                </label>
                            </fieldset> */}
                            <button
                                type="button"
                                onClick={handleExportPdf}
                                disabled={!includeReceipt && !includeProductionOrder}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Printer className="size-4" aria-hidden="true" />
                                Exportar PDF
                            </button>
                            <Link
                                href={edit.url(venda.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                <Pencil className="size-4" aria-hidden="true" />
                                Editar venda
                            </Link>
                        </div>
                    </div>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo da venda">
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 text-sm text-muted-foreground">Nome da venda</div>
                            <p className="font-semibold">{venda.name || '—'}</p>
                        </div>
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 text-sm text-muted-foreground">ID externo</div>
                            <p className="font-semibold">{venda.external_id || '—'}</p>
                        </div>
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <UserRound className="size-4" aria-hidden="true" /> Cliente
                            </div>
                            <p className="font-semibold">{venda.cliente?.name ?? 'Cliente não informado'}</p>
                            {venda.cliente?.documento && <p className="mt-1 text-sm text-muted-foreground">{venda.cliente.documento}</p>}
                        </div>
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="size-4" aria-hidden="true" /> {venda.has_custom_date ? 'Data da venda' : 'Registrada em'}
                            </div>
                            <p className="font-semibold">{formatSaleDate(venda)}</p>
                        </div>
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="size-4" aria-hidden="true" /> Total da venda
                            </div>
                            <p className="text-xl font-semibold text-primary">{formatCurrency(venda.total)}</p>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
                            <div>
                                <h2 className="font-semibold">Itens da venda</h2>
                                <p className="mt-1 text-sm text-muted-foreground">{itens.length} {itens.length === 1 ? 'item registrado' : 'itens registrados'}</p>
                            </div>
                            <Clock3 className="size-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        {itens.length ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[620px] text-left text-sm">
                                    <caption className="sr-only">Itens da venda</caption>
                                    <thead className="bg-muted/40 text-xs tracking-wider text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Item</th>
                                            <th className="px-5 py-3 font-medium">Descrição</th>
                                            <th className="px-5 py-3 font-medium">Quantidade</th>
                                            <th className="px-5 py-3 font-medium">Preço unitário</th>
                                            <th className="px-5 py-3 text-right font-medium">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {itens.map((item, itemIndex) => {
                                            const subtotal = Number(item.subtotal ?? Number(item.pivot.quantity) * Number(item.pivot.unit_price));
                                            return (
                                                <tr key={`${item.id}-${itemIndex}`}>
                                                    <td className="px-5 py-4 font-medium">{item.name ?? 'Item não informado'}</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{item.pivot.description || '—'}</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{item.pivot.quantity}</td>
                                                    <td className="px-5 py-4 text-muted-foreground">{formatCurrency(item.pivot.unit_price)}</td>
                                                    <td className="px-5 py-4 text-right font-semibold">{formatCurrency(subtotal)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-12 text-center text-sm text-muted-foreground">Nenhum item registrado nesta venda.</div>
                        )}
                        <div className="flex justify-end border-t border-border/70 px-5 py-4">
                            <div className="flex items-center gap-8 text-sm">
                                <span className="text-muted-foreground">Total</span>
                                <strong className="text-lg">{formatCurrency(venda.total)}</strong>
                            </div>
                        </div>
                    </section>
                </div>

                {isExportDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm print:hidden">
                        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">Escolha o PDF para exportar</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Selecione qual modelo você deseja imprimir.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/40">
                                    <input
                                        type="radio"
                                        name="export-pdf-option"
                                        checked={exportOption === 'receipt'}
                                        onChange={() => selectExportOption('receipt')}
                                        className="size-4 accent-primary"
                                    />
                                    <span>
                                        <span className="block font-medium">Recibo</span>
                                        <span className="text-sm text-muted-foreground">Resumo da venda e checklist do cliente.</span>
                                    </span>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/40">
                                    <input
                                        type="radio"
                                        name="export-pdf-option"
                                        checked={exportOption === 'production'}
                                        onChange={() => selectExportOption('production')}
                                        className="size-4 accent-primary"
                                    />
                                    <span>
                                        <span className="block font-medium">Ordem de produção</span>
                                        <span className="text-sm text-muted-foreground">Detalhes da venda e itens de produção.</span>
                                    </span>
                                </label>
                                {/*
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/40">
                                    <input
                                        type="radio"
                                        name="export-pdf-option"
                                        checked={exportOption === 'both'}
                                        onChange={() => selectExportOption('both')}
                                        className="size-4 accent-primary"
                                    />
                                    <span>
                                        <span className="block font-medium">Recibo + Ordem de produção</span>
                                        <span className="text-sm text-muted-foreground">Imprime os dois modelos em sequência.</span>
                                    </span>
                                </label> */}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsExportDialogOpen(false)}
                                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmExportPdf}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                >
                                    Exportar PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="venda-print-documents mx-auto w-full max-w-5xl">
                    {includeReceipt && (
                        <section className="venda-document-sheet">
                            {renderDocumentHeader('Recibo')}

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                {venda.name && <div><span className="font-semibold">Venda:</span> {venda.name}</div>}
                                {venda.external_id && <div><span className="font-semibold">ID externo:</span> {venda.external_id}</div>}
                                <div><span className="font-semibold">Cliente:</span> {venda.cliente?.name ?? 'Não informado'}</div>
                                <div><span className="font-semibold">Data:</span> {formatSaleDate(venda)}</div>
                                {venda.cliente?.documento && (
                                    <div><span className="font-semibold">Documento:</span> {venda.cliente.documento}</div>
                                )}
                            </div>

                            <table className="mt-8 w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="w-10 py-2">OK</th>
                                        <th className="py-2">Item</th>
                                        <th className="py-2 text-right">Qtd.</th>
                                        <th className="py-2 text-right">Valor unitário</th>
                                        <th className="py-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itens.map((item, itemIndex) => (
                                        <tr key={`receipt-${item.id}-${itemIndex}`} className="border-b border-gray-300">
                                            <td className="py-3"><span className="inline-block size-4 border border-black" /></td>
                                            <td className="py-3">
                                                <span className="font-medium">{item.name ?? 'Item não informado'}</span>
                                                {(item.pivot.description || item.description) && (
                                                    <p className="mt-1 text-xs text-gray-600">
                                                        {item.pivot.description || item.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">{item.pivot.quantity}</td>
                                            <td className="py-3 text-right">{formatCurrency(item.pivot.unit_price)}</td>
                                            <td className="py-3 text-right">{formatCurrency(itemSubtotal(item))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-5 flex justify-end text-lg font-semibold">
                                Total: {formatCurrency(venda.total)}
                            </div>
                            {signatureBlock}
                            <div className="mt-8 text-center text-xs text-gray-600">{`GERENCIADO POR ${appName}`.toUpperCase()}</div>
                        </section>
                    )}

                    {includeProductionOrder && (
                        <section className="venda-document-sheet">
                            {renderDocumentHeader('Ordem de produção')}

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                {venda.name && <div><span className="font-semibold">Venda:</span> {venda.name}</div>}
                                {venda.external_id && <div><span className="font-semibold">ID externo:</span> {venda.external_id}</div>}
                                <div><span className="font-semibold">Cliente:</span> {venda.cliente?.name ?? 'Não informado'}</div>
                                <div><span className="font-semibold">Documento:</span> {venda.cliente?.documento ?? 'Não informado'}</div>
                                <div><span className="font-semibold">Data:</span> {formatSaleDate(venda)}</div>
                                <div><span className="font-semibold">Status:</span> {statusLabels[venda.status]}</div>
                                <div><span className="font-semibold">Prioridade:</span> {venda.is_priority ? 'Sim' : 'Não'}</div>
                            </div>

                            <table className="mt-8 w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="w-10 py-2">OK</th>
                                        <th className="py-2">Item e descrição</th>
                                        <th className="py-2 text-right">Qtd.</th>
                                        <th className="py-2 text-right">Valor unitário</th>
                                        <th className="py-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itens.map((item, itemIndex) => (
                                        <tr key={`production-${item.id}-${itemIndex}`} className="border-b border-gray-300">
                                            <td className="py-3 align-top"><span className="inline-block size-4 border border-black" /></td>
                                            <td className="py-3">
                                                <span className="font-semibold">{item.name ?? 'Item não informado'}</span>
                                                {item.internal_code && <span className="ml-2 text-xs">({item.internal_code})</span>}
                                                <p className="mt-1 text-xs text-gray-600">{item.pivot.description || item.description || 'Sem descrição'}</p>
                                            </td>
                                            <td className="py-3 text-right">{item.pivot.quantity}</td>
                                            <td className="py-3 text-right">{formatCurrency(item.pivot.unit_price)}</td>
                                            <td className="py-3 text-right">{formatCurrency(itemSubtotal(item))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-5 flex justify-end text-lg font-semibold">
                                Total: {formatCurrency(venda.total)}
                            </div>
                            {signatureBlock}
                            <div className="mt-8 text-center text-xs text-gray-600">{`GERENCIADO POR ${appName}`.toUpperCase()}</div>
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}

VendasShow.layout = {
    breadcrumbs: [
        { title: 'Vendas', href: index() },
        { title: 'Detalhes da venda', href: '' },
    ],
};
