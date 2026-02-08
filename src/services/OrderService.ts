import { storageQueueIntegration } from "../integrations/StorageQueueClient";
import { OrderRepository } from "../repositories/OrderRepository";
import { deviceClient } from "../integrations/DeviceClient";

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

    async placeOrder(
        userID: string,
        sku: string,
    ): Promise<{ success: boolean; message: string }> {
        const device = await deviceClient.getDevice(sku);

        if (!device) {
            return { success: false, message: "Device not found" };
        }

        // Assuming price is 100 if not provided by device service, or we could fetch from DB
        const price = device.price || 100;

        await OrderRepository.createOrder(userID, sku, price);

        return { success: true, message: "Order placed successfully" };
    }

    async getOrderHistory(userID: string): Promise<unknown[]> {
        return await OrderRepository.getOrdersByUser(userID);
    }
}

export const orderService = new OrderService();
