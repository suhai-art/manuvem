export type VendaFormData = {
    cliente_id: number;
    cliente_nome: string;
    cliente_documento: string | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    is_priority: boolean;
    itens: VendaItemFormItem[];
};

export type VendaItemFormItem = {
    item_id: number;
    quantity: string;
    unit_price: string;
};
