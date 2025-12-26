import express from 'express';
import { config } from './config';
import { startServiceBusConsumer } from './service-bus/sb-consumer';
import { setupSwagger } from './swagger';

const app = express();

app.use(express.json());

setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'UP' });
});

const startServer = async () => {
    await startServiceBusConsumer();

    app.listen(config.port, () => {
        console.log(`Purchase-Service listening on port ${config.port}`);
        console.log(`Swagger docs available at http://localhost:${config.port}/api-docs`);
    });
};

startServer().catch((err) => {
    console.error('Error starting server:', err);
});
