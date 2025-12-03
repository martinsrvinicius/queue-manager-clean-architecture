import { Request, Response } from 'express';
import { z } from 'zod';
import { makeFinishTicketUseCase } from '../factories/make-finish-ticket-use-case';

const finishTicketSchema = z.object({
  tenantId: z.string().uuid(),
});

export class FinishTicketController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const body = finishTicketSchema.parse(req.body);

      const useCase = makeFinishTicketUseCase();
      const result = await useCase.execute({
        tenantId: body.tenantId,
        ticketId,
      });

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('FinishTicketController error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
