import amqplib from 'amqplib';

async function main() {
  console.log('[WORKER] Connecting to RabbitMQ...');
  const connection = await amqplib.connect('amqp://admin:password@localhost:5672');
  const channel = await connection.createChannel();

  const exchange = 'tenant.events';
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, exchange, 'tenant.*.ticket.*');

  console.log('[WORKER] Waiting for ticket events. To exit press CTRL+C');

  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      console.log(`[WORKER] Received ${routingKey}:`, content);

      // Simula processamento assíncrono (ex: recalcular métricas)
      setTimeout(() => {
        console.log('[WORKER] Processed:', content.ticketId);
        channel.ack(msg);
      }, 1000);
    }
  }, { noAck: false });
}

main().catch(err => {
  console.error('[WORKER] ERROR:', err);
  process.exit(1);
});
