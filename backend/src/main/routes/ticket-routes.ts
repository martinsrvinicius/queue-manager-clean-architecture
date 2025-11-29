import { Router } from 'express';
import { CreateTicketController } from '../controllers/create-ticket.controller';

export const ticketRouter = Router();
const controller = new CreateTicketController();

ticketRouter.post('/', (req, res) => controller.handle(req, res));
