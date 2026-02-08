
import { Body, Controller, Put, Route, SuccessResponse } from "tsoa";
import { basketService } from "../services/BasketService";
import { BasketItem, AddBasketItemRequest } from "../models/Basket";

@Route("api/basket")
export class BasketController extends Controller {
    /**
     * Add a product to the basket
     */
    @Put("items")
    @SuccessResponse("200", "OK")
    public async addProduct(
        @Body() requestBody: AddBasketItemRequest,
    ): Promise<BasketItem[]> {
        const { userId, sku, price } = requestBody;
        return await basketService.addProductToBasket(userId, sku, price);
    }
}
