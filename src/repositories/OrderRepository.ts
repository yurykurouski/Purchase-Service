import { executeQuery } from "../config/db";
import sql from "mssql";

export class OrderRepository {
    static async getOrder(orderID: number, userID: string): Promise<unknown> {
        const result = await executeQuery(
            "SELECT * FROM [Order] WHERE orderID = @orderID AND userID = @userID",
            [
                { name: "orderID", type: sql.Int, value: orderID },
                { name: "userID", type: sql.NVarChar, value: String(userID) },
            ],
        );
        return result.recordset[0];
    }
}
