export type Venda = {
    id: number;
    cliente: ClientesPayload['data'][0] | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    is_priority: boolean;
    total: number;
    itens?: VendaItem[];
    created_at: string;
    updated_at: string;
};

export type VendaItem = {
    item?: Item;
    item_id?: number;
    quantity: number;
    unit_price: number;
    subtotal?: number;
};

export type Item = {
    id: number;
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
    created_at: string;
};

export type ClientesPayload = {
    data: Venda[] | Cliente[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};

export type Cliente = {
    id: number;
    name: string;
    documento: string | null;
    created_at: string;
};

export type VendasPayload = {
    data: Venda[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};
