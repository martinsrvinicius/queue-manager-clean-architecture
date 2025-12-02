import { RabbitMQAdapter } from '../../infrastructure/messaging/rabbitmq/rabbitmq-adapter';

export function makeRabbitMQAdapter() {
  return RabbitMQAdapter.getInstance();
}
