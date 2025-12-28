import express from 'express';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(express.json());

setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'UP' });
});

export default app;
