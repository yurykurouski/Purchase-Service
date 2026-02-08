import { Body, Controller, Post, Route, SuccessResponse, Put, Get, Query } from "tsoa";
import { orderService } from "../services/OrderService";

interface CheckEligibilityRequest {
    orderID: number;
    userID: string;
}

interface EligibilityResponse {
    isEligible: boolean;
    orderID: number;
    userID: string;
}

@Route("api/orders")
export class OrderController extends Controller {
    /**
     * Check if an order is eligible for warranty
     */
    @Post("check-eligibility")
    @SuccessResponse("200", "OK")
    public async checkEligibility(
        @Body() requestBody: CheckEligibilityRequest,
    ): Promise<EligibilityResponse> {
        const { orderID, userID } = requestBody;
        const isEligible = await orderService.checkWarrantyEligibility(
            orderID,
            userID,
        );

        return {
            isEligible,
            orderID,
            userID,
        };
    }

    /**
     * Place a new order
     */
    @Put()
    @SuccessResponse("201", "Created")
    public async placeOrder(
        @Body() requestBody: { userID: string; sku: string },
    ): Promise<{ success: boolean; message: string }> {
        return await orderService.placeOrder(requestBody.userID, requestBody.sku);
    }

    /**
     * Get order history for a user
     */
    @Get()
    public async getHistory(@Query() userID: string): Promise<unknown[]> {
        return await orderService.getOrderHistory(userID);
    }
}

