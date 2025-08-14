/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Criar novo agendamento
 *     description: |
 *       Cria um novo agendamento seguindo as regras de negócio da arquitetura hexagonal.
 *       
 *       **Fluxo da arquitetura:**
 *       - **Presentation**: AppointmentController valida dados e autorização
 *       - **Application**: CreateAppointmentUseCase executa lógica de negócio
 *       - **Domain**: Appointment entity aplica regras (conflitos, horários)
 *       - **Infrastructure**: PrismaAppointmentRepository persiste dados
 *       
 *       **Validações aplicadas:**
 *       - Verificação de conflitos de horário
 *       - Validação de horário de funcionamento
 *       - Verificação de disponibilidade do funcionário
 *       - Validação de data futura
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *           examples:
 *             agendamento_basico:
 *               summary: Agendamento básico
 *               value:
 *                 clientId: "123e4567-e89b-12d3-a456-426614174000"
 *                 serviceId: "456e7890-e89b-12d3-a456-426614174001"
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *                 scheduledAt: "2024-01-20T14:30:00Z"
 *             agendamento_com_observacoes:
 *               summary: Agendamento com observações
 *               value:
 *                 clientId: "123e4567-e89b-12d3-a456-426614174000"
 *                 serviceId: "456e7890-e89b-12d3-a456-426614174001"
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *                 scheduledAt: "2024-01-20T14:30:00Z"
 *                 notes: "Cliente prefere corte mais curto nas laterais"
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "789e1234-e89b-12d3-a456-426614174002"
 *                 clientId: "123e4567-e89b-12d3-a456-426614174000"
 *                 serviceId: "456e7890-e89b-12d3-a456-426614174001"
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *                 scheduledAt: "2024-01-20T14:30:00Z"
 *                 status: "SCHEDULED"
 *                 notes: "Cliente prefere corte mais curto nas laterais"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validacao:
 *                 summary: Erro de validação
 *                 value:
 *                   success: false
 *                   errors:
 *                     - field: "scheduledAt"
 *                       message: "Data deve ser no futuro"
 *                       value: "2024-01-10T14:30:00Z"
 *               conflito_horario:
 *                 summary: Conflito de horário
 *                 value:
 *                   success: false
 *                   error: "Funcionário não disponível neste horário"
 *               horario_funcionamento:
 *                 summary: Fora do horário de funcionamento
 *                 value:
 *                   success: false
 *                   error: "Agendamento fora do horário de funcionamento"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 *   get:
 *     summary: Listar agendamentos
 *     description: |
 *       Lista agendamentos com filtros opcionais seguindo a arquitetura hexagonal.
 *       
 *       **Fluxo da arquitetura:**
 *       - **Presentation**: AppointmentController processa filtros
 *       - **Application**: ListAppointmentsUseCase aplica regras de negócio
 *       - **Domain**: Filtros baseados em regras de domínio
 *       - **Infrastructure**: PrismaAppointmentRepository executa consultas
 *       
 *       **Filtros disponíveis:**
 *       - Por estabelecimento (obrigatório)
 *       - Por período (data inicial e final)
 *       - Por funcionário específico
 *       - Por cliente específico
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ListAppointmentsRequest'
 *           examples:
 *             todos_agendamentos:
 *               summary: Todos os agendamentos do estabelecimento
 *               value:
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *             por_periodo:
 *               summary: Agendamentos por período
 *               value:
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 startDate: "2024-01-20T00:00:00Z"
 *                 endDate: "2024-01-27T23:59:59Z"
 *             por_funcionario:
 *               summary: Agendamentos de um funcionário
 *               value:
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *             por_cliente:
 *               summary: Agendamentos de um cliente
 *               value:
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 clientId: "123e4567-e89b-12d3-a456-426614174000"
 *             filtro_completo:
 *               summary: Filtro completo
 *               value:
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                 startDate: "2024-01-20T00:00:00Z"
 *                 endDate: "2024-01-27T23:59:59Z"
 *                 employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *                 clientId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: "789e1234-e89b-12d3-a456-426614174002"
 *                   clientId: "123e4567-e89b-12d3-a456-426614174000"
 *                   serviceId: "456e7890-e89b-12d3-a456-426614174001"
 *                   establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                   employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *                   scheduledAt: "2024-01-20T14:30:00Z"
 *                   status: "SCHEDULED"
 *                   notes: "Cliente prefere corte mais curto"
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-15T10:30:00Z"
 *                 - id: "890e2345-e89b-12d3-a456-426614174005"
 *                   clientId: "234e5678-e89b-12d3-a456-426614174006"
 *                   serviceId: "567e8901-e89b-12d3-a456-426614174007"
 *                   establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *                   employeeId: "012e3456-e89b-12d3-a456-426614174004"
 *                   scheduledAt: "2024-01-20T15:30:00Z"
 *                   status: "CONFIRMED"
 *                   notes: null
 *                   createdAt: "2024-01-15T11:00:00Z"
 *                   updatedAt: "2024-01-15T11:30:00Z"
 *       400:
 *         description: Parâmetros de filtro inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               errors:
 *                 - field: "establishmentId"
 *                   message: "ID do estabelecimento é obrigatório"
 *                 - field: "startDate"
 *                   message: "Data inicial deve ser anterior à data final"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */