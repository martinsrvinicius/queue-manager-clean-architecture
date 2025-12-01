import amqplib from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672';
const EXCHANGE = 'tenant.events';
const QUEUE_NAME = 'ticket_events'; // ← FILA NOMEADA DURÁVEL

async function main() {
  console.log('[WORKER] Starting RabbitMQ consumer...');
  
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Exchange topic
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  
  // FILA NOMEADA DURÁVEL COMPARTILHADA
  await channel.assertQueue(QUEUE_NAME, { 
    durable: true, 
    arguments: { 
      'x-queue-type': 'classic' // ou 'quorum' para alta disponibilidade
    } 
  });
  
  // Binding para todos eventos de ticket
  await channel.bindQueue(QUEUE_NAME, EXCHANGE, 'tenant.*.ticket.*');

  console.log(`[WORKER] Ready to consume from queue "${QUEUE_NAME}" (tenant.*.ticket.*)`);

  channel.consume(QUEUE_NAME, (msg) => {
    if (msg !== null) {
      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      console.log(`[WORKER] 🟡 Processing ${routingKey}:`, content);

      // Simula processamento assíncrono
      setTimeout(async () => {
        console.log(`[WORKER] ✅ Processed ${content.ticketId || content.number}`);
        channel.ack(msg);
      }, Math.random() * 2000 + 500);
    }
  }, { noAck: false });
}

main().catch(console.error);
