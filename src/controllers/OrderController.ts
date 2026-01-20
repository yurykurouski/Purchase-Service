import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
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
}
