import { storageQueueIntegration } from "../integrations/StorageQueueClient";
import { OrderRepository } from "../repositories/OrderRepository";

export class OrderService {
    async checkWarrantyEligibility(
        orderID: number,
        userID: string,
    ): Promise<boolean> {
        const order = await OrderRepository.getOrder(orderID, userID);

        if (order) {
            storageQueueIntegration.sendMessage({
                status: "success",
                message: "Order found for user",
                orderID,
                userID,
                timestamp: new Date().toISOString(),
            });
        }

        if (!order) {
            storageQueueIntegration.sendMessage({
                status: "error",
                message: "Order not found for user",
                orderID,
                userID,
                timestamp: new Date().toISOString(),
            });
        }

        return !!order;
    }
}

export const orderService = new OrderService();
