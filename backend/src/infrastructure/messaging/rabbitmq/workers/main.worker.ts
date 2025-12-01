import amqplib from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672';
const EXCHANGE = 'tenant.events';

async function main() {
  console.log('[WORKER] Starting RabbitMQ consumer...');
  
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  
  // Cria fila exclusiva para este worker
  const q = await channel.assertQueue('', { exclusive: true });
  
  // Bind para todos eventos de ticket
  await channel.bindQueue(q.queue, EXCHANGE, 'tenant.*.ticket.*');

  console.log('[WORKER] Ready to consume tenant.*.ticket.* events. Press CTRL+C');

  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      console.log(`[WORKER] 🟡 Processing ${routingKey}:`, content);

      // Simula processamento assíncrono (métricas, notificações, etc.)
      setTimeout(async () => {
        console.log(`[WORKER] ✅ Processed ${content.ticketId || content.number}`);
        
        // Aqui poderia:
        // - Calcular métricas da fila
        // - Enviar SMS/Email
        // - Atualizar cache Redis
        // - Publicar novo evento
        
        channel.ack(msg);
      }, Math.random() * 2000 + 500); // 0.5-2.5s
    }
  });
}

main().catch(console.error);
