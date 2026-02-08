
import { executeQuery } from "../config/db";
import sql from "mssql";
import { BasketItem } from "../models/Basket";

export class BasketRepository {
    static async getBasketItems(userID: string): Promise<BasketItem[]> {
        const result = await executeQuery(
            "SELECT * FROM [Basket] WHERE userId = @userId",
            [{ name: "userId", type: sql.NVarChar, value: userID }],
        );
        return result.recordset;
    }

    static async addItem(userID: string, sku: string, price: number): Promise<void> {
        await executeQuery(
            "INSERT INTO [Basket] (userId, sku, price) VALUES (@userId, @sku, @price)",
            [
                { name: "userId", type: sql.NVarChar, value: userID },
                { name: "sku", type: sql.NVarChar, value: sku },
                { name: "price", type: sql.Decimal(10, 2), value: price },
            ],
        );
    }
}
