import { executeQuery } from '../config/db';
import sql from 'mssql';

export class WarrantyService {
    static async checkWarrantyEligibility(orderID: number, userID: string): Promise<boolean> {
        const result = await executeQuery(
            'SELECT * FROM [Order] WHERE orderID = @orderID AND userID = @userID',
            [
                { name: 'orderID', type: sql.Int, value: orderID },
                { name: 'userID', type: sql.NVarChar, value: String(userID) }
            ]
        );
        return result.recordset.length > 0;
    }
}
