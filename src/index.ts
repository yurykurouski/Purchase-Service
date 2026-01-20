import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import { config } from "./config";
import { serviceBusIntegration } from "./integrations/ServiceBusClient";
import { ValidateError } from "tsoa";
import { register } from "./metrics";

const app = express();

app.use(express.json());

// TSOA Route Registration
try {
    RegisterRoutes(app);
} catch (err) {
    // Routes might not be generated yet during first run
    console.warn(
        "Routes not registered yet. Run 'npm run tsoa:gen' to generate them.",
    );
}

// Swagger UI
try {
    const swaggerJson = require("./generated/swagger.json");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
} catch (err) {
    console.warn(
        "Swagger JSON not found. Run 'npm run tsoa:gen' to generate it.",
    );
}

app.get("/health", (req, res) => {
    res.status(200).send({ status: "UP" });
});

app.get("/metrics", async (req, res) => {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

app.use(function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void {
    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(400).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    next();
});

const startServer = async () => {
    try {
        await serviceBusIntegration.startConsumer();

        const server = app.listen(config.port, () => {
            console.log(`Purchase-Service listening on port ${config.port}`);
            console.log(
                `Swagger docs available at http://localhost:${config.port}/api-docs`,
            );
        });

        // Graceful shutdown
        process.on("SIGTERM", async () => {
            console.log("SIGTERM signal received: closing HTTP server");
            await serviceBusIntegration.close();
            server.close(() => {
                console.log("HTTP server closed");
            });
        });
    } catch (err) {
        console.error("Error starting server:", err);
        process.exit(1);
    }
};

startServer();
