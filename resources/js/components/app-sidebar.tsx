import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    LayoutGrid,
    PencilRuler,
    Settings,
    Shield,
    Users,
    Landmark,
    Coins,
    FileText,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as rolesIndex } from '@/routes/admin/roles';
import { index as itemsIndex } from '@/routes/items';
import { index as clientesIndex } from '@/routes/clientes';
import { index as usersIndex } from '@/routes/admin/users';
import { index as vendasIndex } from '@/routes/vendas';
import type { NavItem } from '@/types';
import useRole from '@/hooks/use-role';
import { useCurrentUrl } from '@/hooks/use-current-url';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const salesItems: NavItem[] = [
    {
        title: 'Vendas',
        href: vendasIndex(),
        permissions: ['vendas.view'],
    },
    {
        title: 'Relatórios',
        href: '/relatorios',
        icon: FileText,
        permissions: ['vendas.view'],
    },
    {
        title: 'Items',
        href: itemsIndex(),
        icon: PencilRuler,
        permissions: ['items.view'],
    },
    {
        title: 'Clientes',
        href: clientesIndex(),
        icon: Landmark,
        permissions: ['clientes.view'],
    },
];

const footerNavItems: NavItem[] = [];

const adminItems: NavItem[] = [
    {
        title: 'Cargos',
        href: rolesIndex(),
        icon: Shield,
        permissions: ['roles.view'],
    },
    {
        title: 'Usuários',
        href: usersIndex(),
        icon: Users,
        permissions: ['users.view'],
    },
];

export function AppSidebar() {
    const { isAdmin, hasPermission } = useRole();
    const { isCurrentUrl } = useCurrentUrl();
    const isAdminRoute = adminItems.some((item) => isCurrentUrl(item.href));
    const visibleSalesItems = salesItems.filter(
        (item) =>
            !item.permissions?.length ||
            item.permissions.some((permission) => hasPermission(permission)),
    );
    const isSalesRoute = visibleSalesItems.some((item) =>
        isCurrentUrl(item.href),
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent className="mt-5">
                <NavMain
                    items={mainNavItems.filter(
                        (item) =>
                            !item.permissions?.length ||
                            item.permissions?.some((permission) =>
                                hasPermission(permission),
                            ),
                    )}
                />
                {visibleSalesItems.length > 0 && (
                    <SidebarMenu className="px-2">
                        <Collapsible
                            asChild
                            defaultOpen={isSalesRoute}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        className="text-l my-1 py-5"
                                        tooltip="Vendas"
                                        isActive={isSalesRoute}
                                    >
                                        <Coins />
                                        <span>Vendas</span>
                                        <ChevronRight className="ml-auto rotate-90 transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-0" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {visibleSalesItems.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    className="text-l py-5"
                                                    isActive={isCurrentUrl(
                                                        item.href,
                                                    )}
                                                >
                                                    <Link href={item.href}>
                                                        {item.icon && (
                                                            <item.icon />
                                                        )}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                )}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {footerNavItems
                        .filter(
                            (item) =>
                                !item.permissions?.length ||
                                item.permissions?.some((permission) =>
                                    hasPermission(permission),
                                ),
                        )
                        .map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isCurrentUrl(item.href)}
                                >
                                    <Link href={item.href}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}

                    {isAdmin && (
                        <Collapsible
                            asChild
                            defaultOpen={isAdminRoute}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        className="text-l my-1 py-5"
                                        tooltip="Administração"
                                    >
                                        <Settings />
                                        <span>Configurações</span>

                                        <ChevronRight className="ml-auto rotate-90 transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-0" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {adminItems
                                            .filter(
                                                (item) =>
                                                    !item.permissions?.length ||
                                                    item.permissions?.some(
                                                        (permission) =>
                                                            hasPermission(
                                                                permission,
                                                            ),
                                                    ),
                                            )
                                            .map((item) => (
                                                <SidebarMenuSubItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className="text-l py-5"
                                                        isActive={isCurrentUrl(
                                                            item.href,
                                                        )}
                                                    >
                                                        <Link href={item.href}>
                                                            {item.icon && (
                                                                <item.icon />
                                                            )}
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )}
                </SidebarMenu>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
