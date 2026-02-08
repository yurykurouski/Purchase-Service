
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

    static async createOrder(
        userID: string,
        sku: string,
        price: number,
    ): Promise<void> {
        await executeQuery(
            "INSERT INTO [Order] (userID, sku, price, status) VALUES (@userID, @sku, @price, 'Created')",
            [
                { name: "userID", type: sql.NVarChar, value: userID },
                { name: "sku", type: sql.NVarChar, value: sku },
                { name: "price", type: sql.Decimal(10, 2), value: price },
            ],
        );
    }

    static async getOrdersByUser(userID: string): Promise<unknown[]> {
        const result = await executeQuery(
            "SELECT * FROM [Order] WHERE userID = @userID",
            [{ name: "userID", type: sql.NVarChar, value: userID }],
        );
        return result.recordset;
    }
}
