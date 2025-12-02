import amqplib from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672';
const EXCHANGE = 'tenant.events';
const QUEUE_NAME = 'ticket_events';

let connection: amqplib.Connection | null = null;  // ← GLOBAL
let channel: amqplib.Channel | null = null;        // ← GLOBAL

async function connectWithRetry(maxRetries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[WORKER] Connecting to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
      return await (amqplib as any).connect(RABBITMQ_URL);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`[WORKER] Connection failed, retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

async function main() {
  console.log('[WORKER] Starting RabbitMQ consumer...');
  
  connection = await connectWithRetry();
  channel = await (connection as any).createChannel();

  await (channel as any).assertExchange(EXCHANGE, 'topic', { durable: true });
  
  await (channel as any).assertQueue(QUEUE_NAME, { 
    durable: true, 
    arguments: { 'x-queue-type': 'classic' } 
  });
  
  await (channel as any).bindQueue(QUEUE_NAME, EXCHANGE, 'tenant.*.ticket.*');

  console.log(`[WORKER] Ready to consume from queue "${QUEUE_NAME}"`);

  (channel as any).consume(QUEUE_NAME, (msg:any) => {
    if (msg !== null) {
      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      console.log(`[WORKER] 🟡 Processing ${routingKey}:`, content);

      setTimeout(async () => {
        console.log(`[WORKER] ✅ Processed ${content.ticketId || content.number}`);
        channel!.ack(msg);  // ← GLOBAL channel
      }, Math.random() * 2000 + 500);
    }
  }, { noAck: false });
}

main().catch(console.error);

// Graceful shutdown (CORRETO)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('[WORKER] Graceful shutdown started...');
  
  try {
    if (channel) {
      await channel.close();
      console.log('[WORKER] Channel closed');
    }
    if (connection) {
      await (connection as any).close();
      console.log('[WORKER] Connection closed');
    }
  } catch (error) {
    console.error('[WORKER] Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
}
