import { Router } from 'express';
import { CreateTicketController } from '../controllers/create-ticket.controller';
import { CallNextTicketController } from '../controllers/call-next-ticket.controller';
import { FinishTicketController } from '../controllers/finish-ticket.controller';

export const ticketRouter = Router();

const createTicketController = new CreateTicketController();
const callNextTicketController = new CallNextTicketController();
const finishTicketController = new FinishTicketController();

ticketRouter.post('/', (req, res) => createTicketController.handle(req, res));
ticketRouter.post('/call-next', (req, res) => callNextTicketController.handle(req, res));
ticketRouter.post('/:ticketId/finish', (req, res) => finishTicketController.handle(req, res));
