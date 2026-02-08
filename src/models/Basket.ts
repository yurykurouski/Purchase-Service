
export interface BasketItem {
    basketId: number;
    sku: string;
    price: number;
    userId: string;
}

export interface AddProductRequest {
    sku: string;
    price: number;
}

export interface AddBasketItemRequest extends AddProductRequest {
    userId: string;
}
