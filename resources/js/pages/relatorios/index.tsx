import { Head, router } from '@inertiajs/react';
import { useRef, useState, type FormEvent } from 'react';
import { CalendarDays, FileText, Printer } from 'lucide-react';
import { PaginationControls } from '@/components/ui/pagination-controls';

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
};

type RelatorioPayload = {
    data: RelatorioVenda[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type RelatoriosProps = {
    vendas: RelatorioPayload;
    clientes: { id: number; name: string }[];
    filters: {
        start_date: string;
        end_date: string;
        cliente_id: string | number;
        status: RelatorioVenda['status'] | '';
    };
};

const statusLabels: Record<RelatorioVenda['status'], string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

const statusClasses: Record<RelatorioVenda['status'], string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

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

function formatDateInput(value: string) {
    return value ? value.split('-').reverse().join('/') : '';
}

function parseDateInput(value: string) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

    if (!match) {
        return '';
    }

    const [, day, month, year] = match;
    const date = new Date(0);
    date.setUTCFullYear(Number(year), Number(month) - 1, Number(day));
    date.setUTCHours(0, 0, 0, 0);

    if (
        date.getUTCFullYear() !== Number(year)
        || date.getUTCMonth() !== Number(month) - 1
        || date.getUTCDate() !== Number(day)
    ) {
        return '';
    }

    return `${year}-${month}-${day}`;
}

function formatCurrency(value: number | string) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(value));
}

export default function RelatoriosIndex({
    vendas,
    clientes,
    filters,
}: RelatoriosProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [startDateInput, setStartDateInput] = useState(formatDateInput(filters.start_date));
    const [endDateInput, setEndDateInput] = useState(formatDateInput(filters.end_date));
    const startDateInputRef = useRef<HTMLInputElement>(null);
    const endDateInputRef = useRef<HTMLInputElement>(null);
    const [clienteId, setClienteId] = useState(String(filters.cliente_id));
    const [status, setStatus] = useState(filters.status);

    function visitPage(page: number) {
        router.get(
            '/relatorios',
            {
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                cliente_id: clienteId || undefined,
                status: status || undefined,
                page,
            },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    }

    function applyFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        visitPage(1);
    }

    function clearFilters() {
        setStartDate('');
        setEndDate('');
        setStartDateInput('');
        setEndDateInput('');
        setClienteId('');
        setStatus('');
        router.get('/relatorios', {}, { preserveScroll: true });
    }

    function exportPdf() {
        const query = new URLSearchParams();

        if (filters.start_date) query.set('start_date', filters.start_date);
        if (filters.end_date) query.set('end_date', filters.end_date);
        if (filters.cliente_id) query.set('cliente_id', String(filters.cliente_id));
        if (filters.status) query.set('status', filters.status);

        const iframe = document.createElement('iframe');
        iframe.title = 'Impressão do relatório';
        iframe.style.position = 'fixed';
        iframe.style.left = '-10000px';
        iframe.style.width = '1000px';
        iframe.style.height = '750px';
        iframe.style.border = '0';
        iframe.onload = () => {
            iframe.contentWindow?.addEventListener(
                'afterprint',
                () => iframe.remove(),
                { once: true },
            );
        };
        iframe.src = `/relatorios/pdf?${query.toString()}`;
        document.body.append(iframe);
    }

    return (
        <>
            <Head title="Relatórios" />
            <main className="min-h-screen bg-muted/20 p-4 sm:p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <section className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                        <header className="flex items-center justify-between gap-3 border-b border-border/70 p-5">
                            <div className="flex items-center gap-3">
                                <FileText className="size-5 text-primary" aria-hidden="true" />
                                <div>
                                    <h1 className="text-lg font-semibold">Relatórios</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Consulte as vendas por período e cliente.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={exportPdf}
                                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-input px-3 text-sm font-medium transition hover:bg-muted"
                            >
                                <Printer className="size-4" aria-hidden="true" />
                                Exportar PDF
                            </button>
                        </header>

                        <form
                            onSubmit={applyFilters}
                            className="flex flex-col gap-3 border-b border-border/70 p-5 sm:flex-row sm:items-end"
                        >
                            <div className="grid flex-1 gap-1.5 text-sm font-medium">
                                <label htmlFor="start_date">Data inicial</label>
                                <div className="relative">
                                    <input
                                        id="start_date"
                                        ref={startDateInputRef}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="dd/mm/yyyy"
                                        value={startDateInput}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            const parsedDate = parseDateInput(value);

                                            event.currentTarget.setCustomValidity(
                                                value && !parsedDate
                                                    ? 'Informe uma data válida no formato dd/mm/yyyy.'
                                                    : '',
                                            );
                                            setStartDateInput(value);
                                            setStartDate(parsedDate);
                                        }}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 pr-12 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                    />
                                    <CalendarDays className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground" aria-hidden="true" />
                                    <input
                                        type="date"
                                        lang="pt-BR"
                                        aria-label="Selecionar data inicial no calendário"
                                        value={startDate}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            startDateInputRef.current?.setCustomValidity('');
                                            setStartDate(value);
                                            setStartDateInput(formatDateInput(value));
                                        }}
                                        className="absolute top-0 right-0 size-10 cursor-pointer opacity-0"
                                    />
                                </div>
                            </div>
                            <div className="grid flex-1 gap-1.5 text-sm font-medium">
                                <label htmlFor="end_date">Data final</label>
                                <div className="relative">
                                    <input
                                        id="end_date"
                                        ref={endDateInputRef}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="dd/mm/yyyy"
                                        value={endDateInput}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            const parsedDate = parseDateInput(value);

                                            event.currentTarget.setCustomValidity(
                                                value && !parsedDate
                                                    ? 'Informe uma data válida no formato dd/mm/yyyy.'
                                                    : '',
                                            );
                                            setEndDateInput(value);
                                            setEndDate(parsedDate);
                                        }}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 pr-12 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                    />
                                    <CalendarDays className="pointer-events-none absolute top-3 right-3 size-4 text-muted-foreground" aria-hidden="true" />
                                    <input
                                        type="date"
                                        lang="pt-BR"
                                        aria-label="Selecionar data final no calendário"
                                        value={endDate}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            endDateInputRef.current?.setCustomValidity('');
                                            setEndDate(value);
                                            setEndDateInput(formatDateInput(value));
                                        }}
                                        className="absolute top-0 right-0 size-10 cursor-pointer opacity-0"
                                    />
                                </div>
                            </div>
                            <label className="grid flex-1 gap-1.5 text-sm font-medium">
                                Cliente
                                <select
                                    value={clienteId}
                                    onChange={(event) => setClienteId(event.target.value)}
                                    className="h-10 rounded-md border border-input bg-background px-3 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                >
                                    <option value="">Todos os clientes</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid flex-1 gap-1.5 text-sm font-medium">
                                Status
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value as RelatorioVenda['status'] | '')}
                                    className="h-10 rounded-md border border-input bg-background px-3 font-normal outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                                >
                                    <option value="">Todos os status</option>
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                >
                                    Filtrar
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="h-10 rounded-md border border-input px-4 text-sm font-medium transition hover:bg-muted"
                                >
                                    Limpar
                                </button>
                            </div>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <caption className="sr-only">Lista de vendas</caption>
                                <thead className="bg-muted/40 text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3 font-medium">Venda</th>
                                        <th scope="col" className="px-5 py-3 font-medium">Cliente</th>
                                        <th scope="col" className="px-5 py-3 font-medium">Status</th>
                                        <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
                                        <th scope="col" className="px-5 py-3 font-medium">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/70">
                                    {vendas.data.map((venda) => (
                                        <tr key={venda.id} className="hover:bg-muted/30">
                                            <td className="px-5 py-3.5">
                                                <div className="font-medium">{venda.name || `Venda #${venda.id}`}</div>
                                                {venda.external_id && (
                                                    <div className="text-xs text-muted-foreground">{venda.external_id}</div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">{venda.cliente?.name ?? 'Cliente removido'}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClasses[venda.status]}`}>
                                                    {statusLabels[venda.status]}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium tabular-nums">{formatCurrency(venda.total)}</td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">{formatDate(venda)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {vendas.data.length === 0 && (
                                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                                    Nenhuma venda encontrada para os filtros selecionados.
                                </div>
                            )}
                        </div>

                        <footer className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Mostrando {vendas.from ?? 0}-{vendas.to ?? 0} de {vendas.total} vendas
                            </span>
                            <PaginationControls
                                currentPage={vendas.current_page}
                                lastPage={vendas.last_page}
                                onPageChange={visitPage}
                            />
                        </footer>
                    </section>
                </div>
            </main>
        </>
    );
}

RelatoriosIndex.layout = {
    breadcrumbs: [
        {
            title: 'Relatórios',
            href: '/relatorios',
        },
    ],
};
