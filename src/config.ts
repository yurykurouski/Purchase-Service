import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const getEnvVar = (name: string): string => {
    const val = process.env[name];
    if (!val) {
        throw new Error(`Environment variable ${name} is missing`);
    }
    return val;
};

export const config = {
    port: process.env.PORT || 3000,
    serviceBusConnectionString: getEnvVar('SERVICE_BUS_CONNECTION_STRING'),
    queueName: getEnvVar('QUEUE_NAME'),
};
