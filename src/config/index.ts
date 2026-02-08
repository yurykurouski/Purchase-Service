import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

const getEnvVar = (name: string): string => {
    const val = process.env[name];
    if (!val) {
        throw new Error(`Environment variable ${name} is missing`);
    }
    // Strip surrounding quotes if present (Docker --env-file handling)
    if (val.startsWith('"') && val.endsWith('"')) {
        return val.slice(1, -1);
    }
    return val;
};

export const config = {
    port: process.env.PORT || 3000,
    serviceBusConnectionStringRead: getEnvVar(
        "SERVICE_BUS_CONNECTION_STRING_READ",
    ),
    serviceBusConnectionStringWrite: getEnvVar(
        "SERVICE_BUS_CONNECTION_STRING_WRITE",
    ),
    queueName: getEnvVar("QUEUE_NAME"),
    db: {
        server: getEnvVar("DB_SERVER"),
        database: getEnvVar("DB_NAME"),
        user: getEnvVar("DB_USER"),
        password: getEnvVar("DB_PASS"),
        options: {
            encrypt: true, // Use this if you're on Azure
            trustServerCertificate: true, // Changed to true to potentially resolve connectivity/cert issues during dev
        },
    },
    storageQueue: {
        connectionString: process.env.STORAGE_ACCOUNT_CONNECTION_STRING?.replace(
            /^"|"$/g,
            "",
        ),
        queueName: process.env.STORAGE_QUEUE_NAME?.replace(/^"|"$/g, ""),
    },
    deviceServiceUrl: process.env.DEVICE_SERVICE_URL || "http://localhost:3002",
};
