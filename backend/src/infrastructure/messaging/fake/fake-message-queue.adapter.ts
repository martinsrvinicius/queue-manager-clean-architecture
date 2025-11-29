import { IMessageQueue } from '../../../application/interfaces/message-queue.interface';

export class FakeMessageQueueAdapter implements IMessageQueue {
  async publish(topic: string, payload: unknown): Promise<void> {
    console.log(`[FAKE-MQ] Published to "${topic}":`, payload);
  }
}
