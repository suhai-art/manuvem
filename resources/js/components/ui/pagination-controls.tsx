import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationControlsProps = {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
};

type PageItem = number | 'ellipsis';

function getPageItems(currentPage: number, lastPage: number): PageItem[] {
    const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, lastPage])]
        .filter((page) => page >= 1 && page <= lastPage)
        .sort((first, second) => first - second);

    return pages.reduce<PageItem[]>((items, page, index) => {
        if (index > 0) {
            const gap = page - pages[index - 1];
            if (gap === 2) items.push(page - 1);
            if (gap > 2) items.push('ellipsis');
        }

        items.push(page);
        return items;
    }, []);
}

export function PaginationControls({
    currentPage,
    lastPage,
    onPageChange,
}: PaginationControlsProps) {
    const pageItems = getPageItems(currentPage, lastPage);

    return (
        <nav aria-label="Paginação" className="flex items-center gap-1">
            <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                aria-label="Página anterior"
            >
                <ChevronLeft className="size-4" />
            </button>
            {pageItems.map((page, index) =>
                page === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${index}`}
                        aria-hidden="true"
                        className="px-1 text-muted-foreground"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        type=""
                        onClick={() => onPageChange(page)}
                        aria-label={`Página ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`inline-flex size-8 items-center justify-center rounded-md border text-sm transition ${
                            page === currentPage
                                ? 'border-primary bg-primary font-semibold text-primary-foreground'
                                : 'border-input hover:bg-muted'
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}
            <button
                type="button"
                disabled={currentPage >= lastPage}
                onClick={() => onPageChange(currentPage + 1)}
                className="inline-flex size-8 items-center justify-center rounded-md border border-input transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                aria-label="Próxima página"
            >
                <ChevronRight className="size-4" />
            </button>
        </nav>
    );
}
