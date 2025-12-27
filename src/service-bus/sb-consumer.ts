import { ServiceBusClient, ServiceBusReceiver, ServiceBusSender } from '@azure/service-bus';
import { config } from '../config';
import { executeQuery } from '../db';
import sql from 'mssql';

let sbClientRead: ServiceBusClient;
let sbClientWrite: ServiceBusClient;
let receiver: ServiceBusReceiver;

const processMessage = async (messageReceived: any) => {
    if (messageReceived.subject !== 'WarrantyRequest') {
        return;
    }

    const { orderID, userID } = messageReceived.body;
    console.log(`Received message with orderID: ${orderID}, userID: ${userID}`);

    if (!orderID || !userID) {
        console.error('Missing orderID or userID in message body');
        return;
    }

    try {
        const result = await executeQuery(
            'SELECT * FROM [Order] WHERE orderID = @orderID AND userID = @userID',
            [
                { name: 'orderID', type: sql.Int, value: orderID },
                { name: 'userID', type: sql.NVarChar, value: String(userID) }
            ]
        );

        if (result.recordset.length > 0) {
            console.log(`Order ${orderID} found for user ${userID}. Sending confirmation.`);

            if (messageReceived.replyTo) {
                // Use the Write client for sending replies
                const sender = sbClientWrite.createSender(messageReceived.replyTo);
                const message = {
                    body: { status: 'Registered' },
                    subject: 'WarrantyConfirmation'
                };
                await sender.sendMessages(message);
                await sender.close();
                console.log(`Sent confirmation to ${messageReceived.replyTo}`);
            } else {
                console.warn('No replyTo address specified in the message.');
            }
        } else {
            console.warn(`Order ${orderID} not found for user ${userID}`);
        }
    } catch (error) {
        console.error('Error validation order or sending reply:', error);
    }
};

export const startServiceBusConsumer = async () => {
    try {
        // Initialize distinct clients for Read and Write operations
        sbClientRead = new ServiceBusClient(config.serviceBusConnectionStringRead);
        sbClientWrite = new ServiceBusClient(config.serviceBusConnectionStringWrite);

        receiver = sbClientRead.createReceiver(config.queueName);

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
    if (sbClientRead) await sbClientRead.close();
    if (sbClientWrite) await sbClientWrite.close();
}
