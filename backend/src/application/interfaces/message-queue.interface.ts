export interface IMessageQueue {
  publish(topic: string, payload: unknown): Promise<void>;
}
