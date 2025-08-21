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
 */