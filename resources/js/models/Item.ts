export type Item = {
    id: number;
    internal_code: string;
    name: string;
    description: string;
    default_unit_price: string;
    created_at: string;
};

export type ItemsPayload = {
    data: Item[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
};
