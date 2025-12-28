import app from './app';
import { config } from './config';
import { startServiceBusConsumer } from './service-bus/sb-consumer';

const startServer = async () => {
    try {
        await startServiceBusConsumer();
        app.listen(config.port, () => {
            console.log(`Purchase-Service listening on port ${config.port}`);
            console.log(`Swagger docs available at http://localhost:${config.port}/api-docs`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();
