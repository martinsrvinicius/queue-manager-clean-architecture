import { Request, Response } from 'express';
import { makeCreateTicketUseCase } from '../factories/make-create-ticket-use-case';
import { z } from 'zod';

const createTicketSchema = z.object({
  tenantId: z.string().uuid(),
  queueId: z.string().uuid(),
  customerName: z.string().min(1).max(100),
});

export class CreateTicketController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // Validação de input (Zod)
      const input = createTicketSchema.parse(req.body);

      // Executa use case
      const useCase = makeCreateTicketUseCase();
      const result = await useCase.execute(input);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
