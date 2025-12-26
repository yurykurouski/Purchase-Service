import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerDocument from './generated/swagger-output.json';

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
