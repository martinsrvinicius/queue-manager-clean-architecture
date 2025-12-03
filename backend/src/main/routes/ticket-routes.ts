import { Router } from 'express';
import { CreateTicketController } from '../controllers/create-ticket.controller';
import { CallNextTicketController } from '../controllers/call-next-ticket.controller';
import { FinishTicketController } from '../controllers/finish-ticket.controller';

export const ticketRouter = Router();

const createTicketController = new CreateTicketController();
const callNextTicketController = new CallNextTicketController();
const finishTicketController = new FinishTicketController();

/**
 * @openapi
 * /api/v1/tickets:
 *   post:
 *     summary: Cria um novo ticket na fila
 *     tags:
 *       - Tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: string
 *               queueId:
 *                 type: string
 *               customerName:
 *                 type: string
 *             required:
 *               - tenantId
 *               - queueId
 *               - customerName
 *     responses:
 *       201:
 *         description: Ticket criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
ticketRouter.post('/', (req, res) => createTicketController.handle(req, res));

ticketRouter.post('/call-next', (req, res) => callNextTicketController.handle(req, res));

ticketRouter.post('/:ticketId/finish', (req, res) => finishTicketController.handle(req, res));
