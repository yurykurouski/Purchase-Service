import { OrderRepository } from '../repositories/OrderRepository';

export class OrderService {
    async checkWarrantyEligibility(orderID: number, userID: string): Promise<boolean> {
        const order = await OrderRepository.getOrder(orderID, userID);
        return !!order;
    }
}

export const orderService = new OrderService();
