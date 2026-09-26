import { Form, Head, usePage, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { format } from 'date-fns'
import { Search, Plus, Pencil, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import Heading from '@/components/heading'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Role { id: number; name: string; guard_name: string; created_at: string; updated_at: string; }
interface User { id: number; name: string; email: string; email_verified_at: string | null; created_at: string; updated_at: string; roles: Role[] }
interface PaginatedUsers { data: User[]; links: { first: string; last: string; prev: string | null; next: string | null }; meta: { current_page: number; from: number; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }>; path: string; per_page: number; to: number; total: number } }
interface Props { users: PaginatedUsers; roles: Role[]; filters: { search?: string; role?: string; sort?: string; direction?: 'asc' | 'desc'; per_page?: number } }

interface Router { visit: (url: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; preserveScroll?: boolean }) => void }

declare module '@inertiajs/react' {
  interface PageProps { router: Router }
}

export default function UserIndex({ users, roles, filters }: Props) {
  const page = usePage()
  const router = page.props.router as Router

  const [search, setSearch] = useState(filters.search ?? '')
  const [selectedRole, setSelectedRole] = useState<string>(filters.role ?? '')
  const [sortField, setSortField] = useState<string>(filters.sort ?? 'created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters.direction ?? 'desc')
  const [perPage, setPerPage] = useState<number>(filters.per_page ?? 15)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const buildQuery = () => {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (selectedRole) p.set('role', selectedRole)
    if (sortField) p.set('sort', sortField)
    if (sortDirection) p.set('direction', sortDirection)
    if (perPage) p.set('per_page', perPage.toString())
    return p.toString()
  }

  const navigateToPage = (pageNum: number) => {
    const p = new URLSearchParams(buildQuery())
    p.set('page', pageNum.toString())
    router.visit(`/admin/users?${p.toString()}`, { preserveScroll: true })
  }

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDirection('asc') }
  }

  const SortIcon = ({ field }: { field: string }) => sortField !== field ? null : sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4 text-muted-foreground" /> : <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />

  const handleDelete = () => {
    if (!deleteTarget) return
    setSubmitting(true)
    destroy(`/admin/users/${deleteTarget.id}`)
    setTimeout(() => { setDeleteTarget(null); setShowDeleteDialog(false); setSubmitting(false) }, 300)
  }

  const RoleBadge = ({ role }: { role: Role }) => <Badge variant={role.name === 'admin' ? 'destructive' : 'secondary'}>{role.name}</Badge>

  return (
    <>
      <Head title="Usuários" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading title="Usuários" description="Gerencie os usuários do sistema" />
          <Button asChild><a href="/admin/users/create"><Plus className="mr-2 h-4 w-4" />Adicionar usuário</a></Button>
        </div>

        <Breadcrumbs breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Usuários', href: '/admin/users' }]} />

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os roles</SelectItem>
              {roles.map((role) => <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Ordenar por:</span>
            {['name', 'email', 'created_at'].map((f) => (
              <button key={f} className="flex items-center space-x-1 px-2 py-1 text-left hover:bg-muted rounded" onClick={() => toggleSort(f)}>
                <span>{f === 'created_at' ? 'Criado em' : f.charAt(0).toUpperCase() + f.slice(1)}</span>
                <SortIcon field={f} />
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="per_page">Por página:</Label>
            <select id="per_page" value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="h-8 w-20 rounded-md border border-input bg-transparent px-2 text-sm">
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="sticky top-0 left-0 z-10 h-9 w-[140px] px-3 text-left font-medium"><button className="flex items-center text-left font-medium hover:text-foreground w-full text-left" onClick={() => toggleSort('name')}>Nome<SortIcon field="name" /></button></th>
                <th className="sticky top-0 left-0 z-10 h-9 w-[200px] px-3 text-left font-medium"><button className="flex items-center text-left font-medium hover:text-foreground w-full text-left" onClick={() => toggleSort('email')}>E-mail<SortIcon field="email" /></button></th>
                <th className="sticky top-0 left-0 z-10 h-9 w-[140px] px-3 text-left font-medium"><button className="flex items-center text-left font-medium hover:text-foreground w-full text-left" onClick={() => toggleSort('created_at')}>Criado em<SortIcon field="created_at" /></button></th>
                <th className="sticky top-0 left-0 z-10 h-9 w-[160px] px-3 text-left font-medium">Roles</th>
                <th className="sticky top-0 left-0 z-10 h-9 w-[120px] px-3 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.data.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</td></tr>
              ) : (
                users.data.map((user) => (
                  <tr key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.visit(`/admin/users/${user.id}`)}>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">{user.name.charAt(0).toUpperCase()}</div>
                        <div><div className="text-sm font-medium">{user.name}</div><div className="text-xs text-muted-foreground">{user.email_verified_at ? 'Verificado' : 'Não verificado'}</div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{user.email}</td>
                    <td className="px-3 py-2 text-sm text-muted-foreground">{format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}</td>
                    <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{user.roles.map((r) => <RoleBadge key={r.id} role={r} />)}{user.roles.length === 0 && <Badge variant="outline" className="text-xs">Nenhuma</Badge>}</div></td>
                    <td className="px-3 py-2">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); router.visit(`/admin/users/${user.id}`) }}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); router.visit(`/admin/users/${user.id}/edit`) }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(user); setShowDeleteDialog(true) }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {users.meta.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Mostrando {users.meta.from} a {users.meta.to} de {users.meta.total} usuários</div>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={() => navigateToPage(users.meta.current_page - 1)} disabled={users.meta.current_page === 1}>Anterior</Button>
              {users.meta.links.map((link, i) => link.url && link.label !== '...' ? <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" onClick={() => navigateToPage(parseInt(link.label, 10))}>{link.label}</Button> : link.label === '...' ? <span key={i} className="px-2 text-sm text-muted-foreground">...</span> : null)}
              <Button variant="outline" size="sm" onClick={() => navigateToPage(users.meta.current_page + 1)} disabled={users.meta.current_page === users.meta.last_page}>Próximo</Button>
            </div>
          </div>
        )}

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Confirmar exclusão</DialogTitle><DialogDescription>Tem certeza que deseja excluir o usuário <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})? Esta ação não pode ser desfeita.</DialogDescription></DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={submitting}>{submitting ? 'Excluindo...' : 'Excluir'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
