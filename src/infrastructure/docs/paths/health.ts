/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificação de saúde do sistema
 *     description: |
 *       Endpoint para verificar se a API está funcionando corretamente.
 *       
 *       **Arquitetura:**
 *       - **Presentation**: Endpoint direto no servidor principal
 *       - **Infrastructure**: Verificação de conectividade com banco de dados
 *       
 *       **Informações retornadas:**
 *       - Status do sistema (OK/ERROR)
 *       - Timestamp da verificação
 *       - Tempo de atividade do servidor
 *       
 *       **Uso recomendado:**
 *       - Monitoramento de infraestrutura
 *       - Load balancers e health checks
 *       - Verificação de disponibilidade da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Sistema funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "OK"
 *               timestamp: "2024-01-15T10:30:00Z"
 *               uptime: 3600.5
 *       503:
 *         description: Sistema com problemas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00Z"
 *                 uptime:
 *                   type: number
 *                   example: 3600.5
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 *             example:
 *               status: "ERROR"
 *               timestamp: "2024-01-15T10:30:00Z"
 *               uptime: 3600.5
 *               error: "Database connection failed"
 */