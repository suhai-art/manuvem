import { Form, Head, usePage, useForm } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import Heading from '@/components/heading'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

declare module '@inertiajs/react' {
  interface PageProps {
    router: {
      visit: (url: string, options?: { preserveScroll?: boolean }) => void
    }
  }
}

interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

interface Props {
  roles: Role[]
}

export default function UserCreate({ roles }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    email_confirmation: '',
    password: '',
    password_confirmation: '',
  })

  const page = usePage()
  const router = page.props.router as {
    visit: (url: string, options?: { preserveScroll?: boolean }) => void
  }
  const goBack = () => router.visit('/admin/users')

  return (
    <>
      <Head title="Novo usuário" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading title="Novo usuário" description="Crie um novo usuário" />
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <Breadcrumbs breadcrumbs={[
          { title: 'Dashboard', href: '/admin' },
          { title: 'Usuários', href: '/admin/users' },
          { title: 'Novo usuário', href: '/admin/users/create' },
        ]} />

        <Form method="post" action="/admin/users" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="joao@empresa.com.br"
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmar senha</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData('password_confirmation', e.target.value)
                }
                placeholder="Repita a senha"
                required
                autoComplete="new-password"
              />
              {errors.password_confirmation && (
                <p className="text-sm text-destructive">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-4">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="roles[]"
                    value={role.name}
                    checked={data.roles?.includes(role.name) ?? false}
                    onChange={(e) => {
                      const current = data.roles ?? []
                      if (e.target.checked) {
                        setData('roles', [...current, role.name])
                      } else {
                        setData(
                          'roles',
                          current.filter((r) => r !== role.name),
                        )
                      }
                    }}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm">{role.name}</span>
                </label>
              ))}
              {roles.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma role disponível.
                </p>
              )}
            </div>
            {errors.roles && (
              <p className="text-sm text-destructive">{errors.roles}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                goBack()
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Criando...' : 'Criar usuário'}
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
