import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

type RelatorioItem = {
    id: number;
    name: string;
    description?: string | null;
    internal_code?: string | null;
    pivot: {
        quantity: number;
        unit_price: number | string;
        description: string | null;
    };
};

type RelatorioVenda = {
    id: number;
    name: string | null;
    external_id: string | null;
    sale_date: string | null;
    has_custom_date: boolean;
    created_at: string;
    total: number | string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    cliente: { id: number; name: string } | null;
    itens: RelatorioItem[];
};

type RelatoriosPdfProps = {
    vendas: RelatorioVenda[];
    filters: {
        start_date: string;
        end_date: string;
        cliente_id: string | number;
        status: RelatorioVenda['status'] | '';
    };
    companyLogoUrl: string | null;
};

const statusLabels: Record<RelatorioVenda['status'], string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

function formatCurrency(value: number | string) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(value));
}

function formatDate(venda: RelatorioVenda) {
    const date = venda.has_custom_date && venda.sale_date
        ? new Date(`${venda.sale_date}T00:00:00`)
        : new Date(venda.created_at);

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

function formatFilterDate(value: string) {
    return value ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : '';
}

export default function RelatoriosPdf({ vendas, filters, companyLogoUrl }: RelatoriosPdfProps) {
    const printStarted = useRef(false);
    const totalVendas = vendas.reduce((total, venda) => total + Number(venda.total), 0);

    useEffect(() => {
        if (printStarted.current) return;
        printStarted.current = true;
        window.print();
    }, []);

    return (
        <>
            <Head title="Relatório de vendas" />
            <main className="relatorio-print-root mx-auto max-w-5xl bg-white p-8 text-black">
                <header className="venda-document-header flex items-center justify-between gap-6 border-b border-black pb-5">
                    {companyLogoUrl ? (
                        <img src={companyLogoUrl} alt="Logo da empresa" className="max-h-16 max-w-48 object-contain object-left" />
                    ) : <span />}
                    <div className="text-right">
                        <h1 className="text-2xl font-semibold">Relatório de vendas</h1>
                        <p className="text-sm">{vendas.length} {vendas.length === 1 ? 'venda' : 'vendas'}</p>
                    </div>
                </header>
                <p className="mt-5 text-sm">
                    <span className="font-semibold">Período:</span>{' '}
                    {filters.start_date || filters.end_date
                        ? `${formatFilterDate(filters.start_date) || 'sem limite'} a ${formatFilterDate(filters.end_date) || 'sem limite'}`
                        : 'Todos os períodos'}
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Status:</span>{' '}
                    {filters.status ? statusLabels[filters.status] : 'Todos os status'}
                </p>

                {vendas.map((venda) => (
                    <section key={venda.id} className="relatorio-print-venda">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-300 pb-2">
                            <div>
                                <h2 className="font-semibold">{venda.name || `Venda #${venda.id}`}</h2>
                                {venda.external_id && <p className="text-sm text-neutral-600">ID externo: {venda.external_id}</p>}
                            </div>
                            <div className="text-right text-sm">
                                <p>{formatDate(venda)}</p>
                                <p>{statusLabels[venda.status]}</p>
                            </div>
                        </div>
                        <div className="flex justify-between gap-4 py-2 text-sm">
                            <span>Cliente: {venda.cliente?.name ?? 'Cliente removido'}</span>
                            <strong>{formatCurrency(venda.total)}</strong>
                        </div>

                        <table className="text-sm">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="py-2">Item</th>
                                    <th className="py-2">Descrição</th>
                                    <th className="py-2 text-right">Quantidade</th>
                                    <th className="py-2 text-right">Preço unitário</th>
                                    <th className="py-2 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {venda.itens.map((item, itemIndex) => (
                                    <tr key={`${item.id}-${itemIndex}`}>
                                        <td>{item.name}</td>
                                        <td>{item.pivot.description || '—'}</td>
                                        <td>{item.pivot.quantity}</td>
                                        <td>{formatCurrency(item.pivot.unit_price)}</td>
                                        <td>{formatCurrency(Number(item.pivot.quantity) * Number(item.pivot.unit_price))}</td>
                                    </tr>
                                ))}
                                {venda.itens.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>Nenhum item registrado nesta venda.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                ))}

                {vendas.length === 0 && <p className="py-8 text-center">Nenhuma venda encontrada para os filtros selecionados.</p>}

                <div className="mt-6 flex justify-end text-lg font-semibold">
                    Subtotal de todas as vendas: {formatCurrency(totalVendas)}
                </div>

                <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm">
                    <div className="border-t border-black pt-2">Assinatura do cliente</div>
                    <div className="border-t border-black pt-2">Data</div>
                </div>

                <footer className="mt-8 text-center text-xs text-gray-600">GERADO POR MANUVEM</footer>
            </main>
        </>
    );
}
