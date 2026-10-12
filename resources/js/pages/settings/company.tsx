import { Form, Head } from '@inertiajs/react';
import { ImagePlus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    logoUrl: string | null;
};

export default function CompanySettings({ logoUrl }: Props) {
    return (
        <>
            <Head title="Configurações da empresa" />
            <h1 className="sr-only">Configurações da empresa</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Empresa"
                    description="Adicione a logomarca usada pela sua empresa."
                />

                {logoUrl && (
                    <div className="flex min-h-36 items-center justify-center rounded-md border bg-muted/30 p-6">
                        <img
                            src={logoUrl}
                            alt="Logomarca da empresa"
                            className="max-h-28 max-w-full object-contain"
                        />
                    </div>
                )}

                <Form
                    action="/settings/company/logo"
                    method="post"
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="logo">Arquivo da logomarca</Label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    required={!logoUrl}
                                    className="file:mr-3 file:rounded-sm file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm"
                                />
                                <p className="text-sm text-muted-foreground">
                                    PNG, JPG ou WebP. Tamanho máximo: 2 MB.
                                </p>
                                <InputError message={errors.logo} />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button disabled={processing}>
                                    <ImagePlus className="size-4" />
                                    Salvar logomarca
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {logoUrl && (
                    <Form
                        action="/settings/company/logo"
                        method="delete"
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={processing}
                            >
                                <Trash2 className="size-4" />
                                Remover logomarca
                            </Button>
                        )}
                    </Form>
                )}
            </div>
        </>
    );
}

CompanySettings.layout = {
    breadcrumbs: [
        {
            title: 'Configurações da empresa',
            href: '/settings/company',
        },
    ],
};
