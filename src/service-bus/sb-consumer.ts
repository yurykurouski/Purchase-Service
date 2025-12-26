import { ServiceBusClient, ServiceBusReceiver } from '@azure/service-bus';
import { config } from '../config';

let sbClient: ServiceBusClient;
let receiver: ServiceBusReceiver;

const processMessage = async (messageReceived: any) => {
    console.log(`Received message: ${JSON.stringify(messageReceived.body)}`);
};

export const startServiceBusConsumer = async () => {
    try {
        sbClient = new ServiceBusClient(config.serviceBusConnectionString);
        receiver = sbClient.createReceiver(config.queueName);

        console.log(`Listening for messages on queue: ${config.queueName}`);

        receiver.subscribe({
            processMessage: async (message) => {
                try {
                    await processMessage(message);
                } catch (err) {
                    console.error('Error processing message', err);
                }
            },
            processError: async (args) => {
                console.error(`Error from source ${args.errorSource} occurred: `, args.error);
            },
        });
    } catch (error) {
        console.error('Failed to start Service Bus consumer:', error);
        process.exit(1);
    }
};

export const closeServiceBusConsumer = async () => {
    if (receiver) await receiver.close();
    if (sbClient) await sbClient.close();
}
