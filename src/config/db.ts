import sql from "mssql";
import { config } from ".";

let pool: sql.ConnectionPool | null = null;

export const initDB = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config.db);
            console.log("Connected to SQL Database");
        }
        return pool;
    } catch (err) {
        console.error("Database connection failed", err);
        throw err;
    }
};

export const getDB = async () => {
    if (!pool) {
        await initDB();
    }
    return pool!;
};

export const executeQuery = async (
    query: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { name: string; type: any; value: any }[] = [],
) => {
    const db = await getDB();
    const request = db.request();

    params.forEach((p) => {
        request.input(p.name, p.type, p.value);
    });

    return await request.query(query);
};
