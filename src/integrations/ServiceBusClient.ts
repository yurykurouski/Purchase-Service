import {
    ServiceBusClient,
    ServiceBusReceiver,
    ServiceBusSender,
} from "@azure/service-bus";
import { config } from "../config";
import { orderService } from "../services/OrderService";

export class ServiceBusIntegration {
    private sbClientRead: ServiceBusClient;
    private sbClientWrite: ServiceBusClient;
    private receiver: ServiceBusReceiver;

    constructor() {
        this.sbClientRead = new ServiceBusClient(
            config.serviceBusConnectionStringRead,
        );
        this.sbClientWrite = new ServiceBusClient(
            config.serviceBusConnectionStringWrite,
        );
        this.receiver = this.sbClientRead.createReceiver(config.queueName);
    }

    public async startConsumer() {
        console.log(`Listening for messages on queue: ${config.queueName}`);

        this.receiver.subscribe({
            processMessage: async (message) => {
                try {
                    await this.processMessage(message);
                } catch (err) {
                    console.error("Error processing message", err);
                }
            },
            processError: async (args) => {
                console.error(
                    `Error from source ${args.errorSource} occurred: `,
                    args.error,
                );
            },
        });
    }

    private async processMessage(messageReceived: any) {
        if (messageReceived.subject !== "WarrantyRequest") {
            return;
        }

        const { orderID, userID } = messageReceived.body;
        console.log(`Received message with orderID: ${orderID}, userID: ${userID}`);

        if (!orderID || !userID) {
            console.error("Missing orderID or userID in message body");
            return;
        }

        try {
            const isEligible = await orderService.checkWarrantyEligibility(
                orderID,
                userID,
            );

            if (isEligible) {
                console.log(
                    `Order ${orderID} found for user ${userID}. Sending confirmation.`,
                );

                if (messageReceived.replyTo) {
                    const sender = this.sbClientWrite.createSender(
                        messageReceived.replyTo,
                    );
                    const message = {
                        body: { status: "Registered" },
                        subject: "WarrantyConfirmation",
                    };
                    await sender.sendMessages(message);
                    await sender.close();
                    console.log(`Sent confirmation to ${messageReceived.replyTo}`);
                } else {
                    console.warn("No replyTo address specified in the message.");
                }
            } else {
                console.warn(`Order ${orderID} not found for user ${userID}`);
            }
        } catch (error) {
            console.error("Error validation order or sending reply:", error);
        }
    }

    public async close() {
        if (this.receiver) await this.receiver.close();
        if (this.sbClientRead) await this.sbClientRead.close();
        if (this.sbClientWrite) await this.sbClientWrite.close();
    }
}

export const serviceBusIntegration = new ServiceBusIntegration();
