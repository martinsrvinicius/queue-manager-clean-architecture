import { RabbitMQAdapter } from '../../infrastructure/messaging/rabbitmq/rabbitmq-adapter';

export function makeRabbitMQAdapter() {
  return new RabbitMQAdapter(process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672');
}
