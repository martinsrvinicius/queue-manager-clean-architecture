/**
 * @openapi
 * /api/v1/tickets:
 *   post:
 *     summary: Cria um novo ticket na fila
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               queueId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               customerName:
 *                 type: string
 *                 example: "Vinicius Martins"
 *             required: [tenantId, queueId, customerName]
 *     responses:
 *       201:
 *         description: Ticket criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, example: "ticket-1764624964704-1" }
 *                 tenantId: { type: string }
 *                 queueId: { type: string }
 *                 number: { type: integer, example: 1 }
 *                 customerName: { type: string, example: "Vinicius Martins" }
 *                 status: { type: string, enum: [WAITING], example: "WAITING" }
 *                 createdAt: { type: string, format: date-time }
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */

/**
 * @openapi
 * /api/v1/tickets/call-next:
 *   post:
 *     summary: Chama o próximo ticket da fila (status → CALLING)
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               queueId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *             required: [tenantId, queueId]
 *     responses:
 *       200:
 *         description: Próximo ticket chamado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, example: "ticket-1764793148980-1" }
 *                 number: { type: integer, example: 1 }
 *                 status: { type: string, enum: [CALLING], example: "CALLING" }
 *                 calledAt: { type: string, format: date-time }
 *       404:
 *         description: Nenhum ticket esperando
 *       500:
 *         description: Erro interno
 */

/**
 * @openapi
 * /api/v1/tickets/{ticketId}/finish:
 *   post:
 *     summary: Finaliza ticket atual (status → FINISHED)
 *     tags: [Tickets]
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "ticket-1764793148980-1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenantId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *             required: [tenantId]
 *     responses:
 *       200:
 *         description: Ticket finalizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 number: { type: integer }
 *                 status: { type: string, enum: [FINISHED], example: "FINISHED" }
 *                 finishedAt: { type: string, format: date-time }
 *       404:
 *         description: Ticket não encontrado
 *       500:
 *         description: Erro interno
 */
