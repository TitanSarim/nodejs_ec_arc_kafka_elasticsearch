import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { MessageBrokerType, MessageHandler, PublishType } from "./broker.type";
import { MessageType, OrderEvent, TOPIC_TYPE } from "../../types";

// Configuration properties for Kafka connection
const CLIENT_ID = process.env.CLIENT_ID || "order-service"; // Unique client identifier
const GROUP_ID = process.env.GROUP_ID || "order-service-group"; // Consumer group ID
const BROKERS = [process.env.BROKER_1 || "localhost:9092"]; // Kafka broker addresses

// Initialize Kafka instance
const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let producer: Producer;
let consumer: Consumer;

// * Function to create a Kafka topic
const createTopic = async (topic: string[]) => {
  const topics = topic.map((t) => ({
    topic: t,
    numPartitions: 2, // Number of partitions for parallel processing
    replicationFactor: 1, // Replication factor (adjust based on available brokers)
  }));

  const admin = kafka.admin(); // Create Kafka admin instance
  await admin.connect(); // Connect to Kafka admin
  const topicExists = await admin.listTopics(); // Fetch existing topics
  console.log("topicExists", topicExists);

  // Check if the topic exists before creating it
  for (const t of topics) {
    if (!topicExists) {
      await admin.createTopics({
        topics: [t],
      });
    }
  }

  await admin.disconnect(); // Disconnect admin client after operation
};

// * Function to connect and return a Kafka producer
const connectProducer = async <T>(): Promise<T> => {
  await createTopic(["OrderEvents"]); // Ensure topic exists before producing messages

  if (producer) {
    console.log("Producer already connected with existing connection");
    return producer as unknown as T; // Return existing producer instance if already connected
  }

  // Create a new producer instance with default partitioner
  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect(); // Connect the producer to Kafka
  console.log("Producer connected with new connection");
  return producer as unknown as T;
};

const disconnectProducer = async (): Promise<void> => {
  if (producer) {
    await producer.disconnect(); // Disconnect the producer from Kafka
  }
};

export const publish = async (data: PublishType): Promise<boolean> => {
  const producer = await connectProducer<Producer>();
  const result = await producer.send({
    topic: data.topic,
    messages: [
      {
        headers: data.headers,
        key: data.event,
        value: JSON.stringify(data.message),
      },
    ],
  });
  console.log("publishing result", result);
  return result.length > 0;
};

const connectConsumer = async <T>(): Promise<T> => {
  if (consumer) {
    console.log("Consumer already connected with existing connection");
    return consumer as unknown as T; // Return existing consumer instance if already connected
  }

  consumer = kafka.consumer({
    groupId: GROUP_ID,
  });

  await consumer.connect();
  return consumer as unknown as T; // Return existing consumer instance if already connected
};

// Disconnects the consumer from Kafka if it exists
const disconnectConsumer = async (): Promise<void> => {
  if (consumer) {
    await consumer.disconnect(); // Gracefully disconnect the consumer
  }
};

/**
 * Subscribes to a Kafka topic and processes incoming messages.
 *
 * @param messageHandler - A callback function to handle incoming messages
 * @param topic - The Kafka topic to subscribe to
 */

const subscribe = async (
  messageHandler: MessageHandler,
  topic: TOPIC_TYPE
): Promise<void> => {
  // Establish a connection with the Kafka consumer
  const consumer = await connectConsumer<Consumer>();

  // Subscribe to the specified topic and start consuming from the beginning
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  // Start processing messages from the Kafka topic
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Filter messages to only process events related to "OrderEvents"
      if (topic !== "OrderEvents") {
        return;
      }

      // Ensure the message has both a key and a value before processing
      if (message.key && message.value) {
        // Construct the message object with parsed JSON data
        const inputMessage: MessageType = {
          headers: message.headers, // Retain message headers
          key: message.key.toString() as OrderEvent, // Convert key to string
          data: message.value ? JSON.parse(message.value.toString()) : null, // Parse message data
        };

        // Pass the message to the provided message handler
        await messageHandler(inputMessage);

        // Commit the offset to mark the message as processed
        await consumer.commitOffsets([
          { topic, partition, offset: (Number(message.offset) + 1).toString() },
        ]);
      }
    },
  });
};

export const MessageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};
