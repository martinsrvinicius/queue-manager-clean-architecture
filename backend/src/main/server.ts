import express from 'express';
import cors from 'cors';
import { ticketRouter } from './routes/ticket-routes';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Queue Manager Clean Architecture' });
});

// Registrar rotas
app.use('/api/v1/tickets', ticketRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`);
});
