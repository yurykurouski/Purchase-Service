
import { BasketService } from "../services/BasketService";
import { BasketRepository } from "../repositories/BasketRepository";
import { BasketItem } from "../models/Basket";

jest.mock("../repositories/BasketRepository");

describe("BasketService", () => {
    let basketService: BasketService;
    const mockBasketRepository = BasketRepository as jest.Mocked<typeof BasketRepository>;

    beforeEach(() => {
        basketService = new BasketService();
        jest.clearAllMocks();
    });

    describe("addProductToBasket", () => {
        const userId = "user-123";
        const sku = "DEV-001";
        const price = 99.99;
        const basketId = 1;

        it("should add item and return updated basket items", async () => {
            mockBasketRepository.addItem.mockResolvedValue();

            const expectedItems: BasketItem[] = [{ basketId, userId, sku, price }];
            mockBasketRepository.getBasketItems.mockResolvedValue(expectedItems);

            const result = await basketService.addProductToBasket(userId, sku, price);

            expect(mockBasketRepository.addItem).toHaveBeenCalledWith(userId, sku, price);
            expect(mockBasketRepository.getBasketItems).toHaveBeenCalledWith(userId);
            expect(result).toEqual(expectedItems);
        });
    });
});
