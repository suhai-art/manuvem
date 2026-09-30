import { usePage } from '@inertiajs/react';

export function useInertiaRouter() {
    const page = usePage();
    return {
        visit: (url: string, options?: { preserveScroll?: boolean }) => {
            page.props.router.visit(url, options);
        },
    };
}
