
import { BasketRepository } from "../repositories/BasketRepository";
import { BasketItem } from "../models/Basket";

export class BasketService {
    async addProductToBasket(userID: string, sku: string, price: number): Promise<BasketItem[]> {
        await BasketRepository.addItem(userID, sku, price);
        return await BasketRepository.getBasketItems(userID);
    }
}

export const basketService = new BasketService();
