/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       description: Entidade de agendamento do domínio
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do agendamento
 *           example: "789e1234-e89b-12d3-a456-426614174002"
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: ID do cliente que fez o agendamento
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         serviceId:
 *           type: string
 *           format: uuid
 *           description: ID do serviço agendado
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           description: ID do estabelecimento onde será realizado o serviço
 *           example: "789e1234-e89b-12d3-a456-426614174003"
 *         employeeId:
 *           type: string
 *           format: uuid
 *           description: ID do funcionário que realizará o serviço
 *           example: "012e3456-e89b-12d3-a456-426614174004"
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora agendada para o serviço
 *           example: "2024-01-20T14:30:00Z"
 *         status:
 *           type: string
 *           enum: [SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
 *           description: Status atual do agendamento
 *           example: "SCHEDULED"
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Observações adicionais sobre o agendamento
 *           example: "Cliente prefere corte mais curto nas laterais"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do agendamento
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - clientId
 *         - serviceId
 *         - establishmentId
 *         - employeeId
 *         - scheduledAt
 *         - status
 *         - createdAt
 *         - updatedAt
 * 
 *     CreateAppointmentRequest:
 *       type: object
 *       description: DTO para criação de agendamento
 *       properties:
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: ID do cliente que está fazendo o agendamento
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         serviceId:
 *           type: string
 *           format: uuid
 *           description: ID do serviço a ser agendado
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           description: ID do estabelecimento onde será realizado
 *           example: "789e1234-e89b-12d3-a456-426614174003"
 *         employeeId:
 *           type: string
 *           format: uuid
 *           description: ID do funcionário que realizará o serviço
 *           example: "012e3456-e89b-12d3-a456-426614174004"
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora desejada para o agendamento
 *           example: "2024-01-20T14:30:00Z"
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Observações adicionais (opcional)
 *           example: "Cliente prefere corte mais curto nas laterais"
 *       required:
 *         - clientId
 *         - serviceId
 *         - establishmentId
 *         - employeeId
 *         - scheduledAt
 * 
 *     ListAppointmentsRequest:
 *       type: object
 *       description: DTO para listagem de agendamentos com filtros
 *       properties:
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           description: Filtrar por estabelecimento
 *           example: "789e1234-e89b-12d3-a456-426614174003"
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data inicial para filtro de período
 *           example: "2024-01-20T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data final para filtro de período
 *           example: "2024-01-27T23:59:59Z"
 *         employeeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Filtrar por funcionário específico
 *           example: "012e3456-e89b-12d3-a456-426614174004"
 *         clientId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Filtrar por cliente específico
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       required:
 *         - establishmentId
 * 
 *     AppointmentResponse:
 *       type: object
 *       description: Resposta padrão com dados do agendamento
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Appointment'
 * 
 *     AppointmentListResponse:
 *       type: object
 *       description: Resposta com lista de agendamentos
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Appointment'
 * 
 *     AppointmentStatus:
 *       type: string
 *       enum: [SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
 *       description: |
 *         Status possíveis para um agendamento:
 *         - SCHEDULED: Agendamento criado, aguardando confirmação
 *         - CONFIRMED: Agendamento confirmado pelo estabelecimento
 *         - IN_PROGRESS: Serviço em andamento
 *         - COMPLETED: Serviço concluído com sucesso
 *         - CANCELLED: Agendamento cancelado
 *         - NO_SHOW: Cliente não compareceu no horário agendado
 *       example: "SCHEDULED"
 */