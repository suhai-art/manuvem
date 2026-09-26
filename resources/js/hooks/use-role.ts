import { usePage } from '@inertiajs/react';

type Role = {
    id: number;
    name: string;
};

type AuthUser = {
    id: number;
    name: string;
    email: string;
    roles?: Role[];
};

type Permission = {
    id: number;
    name: string;
    guard_name: string;
};

type PageProps = {
    auth: {
        user?: AuthUser;
        permissions?: Permission[];
    };
};

export default function useRole() {
    const { auth } = usePage<PageProps>().props;

    const roles = auth?.user?.roles ?? [];
    const permissions = auth?.permissions ?? [];

    return {
        permissions,
        roles,

        hasRole: (role: string) =>
            roles.some((item) => item.name === role),

        hasPermission: (permission: string) =>
            permissions.some((item) => item.name === permission),

        isAdmin: roles.some((item) => item.name === 'admin'),
    };
}
