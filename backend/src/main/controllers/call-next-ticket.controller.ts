import { Request, Response } from 'express';
import { z } from 'zod';
import { makeCallNextTicketUseCase } from '../factories/make-call-next-ticket-use-case';

const callNextSchema = z.object({
  tenantId: z.string().uuid(),
  queueId: z.string().uuid(),
});

export class CallNextTicketController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = callNextSchema.parse(req.body);

      const useCase = makeCallNextTicketUseCase();
      const result = await useCase.execute(input);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else if (error instanceof Error && error.message === 'No waiting tickets in queue') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
