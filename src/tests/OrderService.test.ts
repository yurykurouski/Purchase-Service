import { OrderService } from "../services/OrderService";
import { OrderRepository } from "../repositories/OrderRepository";
import { storageQueueIntegration } from "../integrations/StorageQueueClient";

// Mock dependencies
jest.mock("../repositories/OrderRepository");
jest.mock("../integrations/StorageQueueClient");

describe("OrderService", () => {
    let orderService: OrderService;
    const mockOrderRepository = OrderRepository as jest.Mocked<
        typeof OrderRepository
    >;
    const mockStorageQueue = storageQueueIntegration as jest.Mocked<
        typeof storageQueueIntegration
    >;

    beforeEach(() => {
        orderService = new OrderService();
        jest.clearAllMocks();
    });

    describe("checkWarrantyEligibility", () => {
        const orderId = 123;
        const userId = "user-123";

        it("should return true and send success message when order is found", async () => {
            // Arrange
            mockOrderRepository.getOrder.mockResolvedValue({
                orderID: orderId,
                userID: userId,
                // Add other necessary properties if needed by type, but currently "any" or loose typing might be in use
            } as any);

            // Act
            const result = await orderService.checkWarrantyEligibility(
                orderId,
                userId,
            );

            // Assert
            expect(result).toBe(true);
            expect(mockOrderRepository.getOrder).toHaveBeenCalledWith(
                orderId,
                userId,
            );
            expect(mockStorageQueue.sendMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "success",
                    message: "Order found for user",
                    orderID: orderId,
                    userID: userId,
                }),
            );
        });

        it("should return false and send error message when order is not found", async () => {
            // Arrange
            mockOrderRepository.getOrder.mockResolvedValue(null);

            // Act
            const result = await orderService.checkWarrantyEligibility(
                orderId,
                userId,
            );

            // Assert
            expect(result).toBe(false);
            expect(mockOrderRepository.getOrder).toHaveBeenCalledWith(
                orderId,
                userId,
            );
            expect(mockStorageQueue.sendMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "error",
                    message: "Order not found for user",
                    orderID: orderId,
                    userID: userId,
                }),
            );
        });
    });
});
