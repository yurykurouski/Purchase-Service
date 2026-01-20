// Mock environment variables
process.env.SERVICE_BUS_CONNECTION_STRING_READ =
    "Endpoint=sb://mock.servicebus.windows.net/;SharedAccessKeyName=read;SharedAccessKey=mockkey";
process.env.SERVICE_BUS_CONNECTION_STRING_WRITE =
    "Endpoint=sb://mock.servicebus.windows.net/;SharedAccessKeyName=write;SharedAccessKey=mockkey";
process.env.QUEUE_NAME = "mock-queue";
process.env.DB_SERVER = "mock-server";
process.env.DB_NAME = "mock-db";
process.env.DB_USER = "mock-user";
process.env.DB_PASS = "mock-pass";
process.env.STORAGE_ACCOUNT_CONNECTION_STRING =
    "DefaultEndpointsProtocol=https;AccountName=mock;AccountKey=mock==";
process.env.STORAGE_QUEUE_NAME = "mock-queue-storage";
