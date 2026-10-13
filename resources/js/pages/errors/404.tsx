import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, SearchX } from 'lucide-react';
import { dashboard } from '@/routes';

export default function Error404() {
    return (
        <>
            <Head title="Página não encontrada" />

            <main className="flex min-h-screen items-center justify-center bg-muted/20 p-6">
                <div className="w-full max-w-xl rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <SearchX className="size-8" aria-hidden="true" />
                    </div>

                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        404
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                        Página não encontrada
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground">
                        A página que você tentou acessar não existe ou foi removida.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href={dashboard()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Voltar ao dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
