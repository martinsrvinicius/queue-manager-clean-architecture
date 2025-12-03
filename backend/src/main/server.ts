import express from 'express';
import cors from 'cors';
import http from 'http';
import { ticketRouter } from './routes/ticket-routes';
import { initWsServer } from './websocket/ws-server';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Swagger setup (antes das rotas)
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Queue Manager Clean Architecture' });
});

app.use('/api/v1/tickets', ticketRouter);

export const io = initWsServer(server); // inicia WS sobre o http server

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
