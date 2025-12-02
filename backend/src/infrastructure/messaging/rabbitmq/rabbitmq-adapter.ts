import amqplib from 'amqplib';
import { IMessageQueue } from '../../../application/interfaces/message-queue.interface';

export class RabbitMQAdapter implements IMessageQueue {
  private connection: amqplib.Connection | null = null;
  private channel: amqplib.Channel | null = null;
  private readonly exchange = 'tenant.events';

  private static instance: RabbitMQAdapter | null = null;

  constructor(
  private url: string = process.env.RABBITMQ_URL || 'amqp://admin:password@localhost:5672'
) {}


  static getInstance(url?: string): RabbitMQAdapter {
    if (!RabbitMQAdapter.instance) {
      RabbitMQAdapter.instance = new RabbitMQAdapter(url);
    }
    return RabbitMQAdapter.instance;
  }
  private async connect() {
    if (this.connection) return;
    
    this.connection = (await amqplib.connect(this.url)) as any;
    this.channel = await (this.connection as any).createChannel();
    
    await this.channel!.assertExchange(this.exchange, 'topic', { durable: true });
    console.log('[RABBITMQ] Connected and exchange ready');
  }

  async publish(topic: string, payload: unknown): Promise<void> {
    await this.connect();
    
    const message = JSON.stringify(payload);
    this.channel!.publish(this.exchange, topic, Buffer.from(message));
    
    console.log(`[RABBITMQ] Published "${topic}":`, payload);
  }

  async close() {
    await this.channel?.close();
    await (this.connection as any)?.close();
  }
}
