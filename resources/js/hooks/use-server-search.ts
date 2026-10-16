import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export function useServerSearch(initialSearch = '') {
    const [search, setSearch] = useState(initialSearch);
    const lastSearch = useRef(initialSearch.trim());

    useEffect(() => {
        setSearch(initialSearch);
        lastSearch.current = initialSearch.trim();
    }, [initialSearch]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            const query = search.trim();
            if (query === lastSearch.current) return;

            lastSearch.current = query;
            const url = new URL(window.location.href);
            if (query) url.searchParams.set('search', query);
            else url.searchParams.delete('search');
            url.searchParams.delete('page');

            router.visit(url, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [search]);

    return { search, setSearch };
}
