/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Criar novo usuário
 *     description: |
 *       Cria um novo usuário no sistema seguindo as regras de negócio da arquitetura hexagonal.
 *       
 *       **Camadas envolvidas:**
 *       - **Presentation**: UserController recebe e valida a requisição
 *       - **Application**: CreateUserUseCase executa a lógica de negócio
 *       - **Domain**: User entity e value objects (Email, Phone) aplicam regras
 *       - **Infrastructure**: PrismaUserRepository persiste os dados
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           examples:
 *             cliente:
 *               summary: Criar cliente
 *               value:
 *                 email: "joao@email.com"
 *                 password: "123456"
 *                 name: "João Silva"
 *                 phone: "(11) 99999-9999"
 *                 role: "CLIENT"
 *             funcionario:
 *               summary: Criar funcionário
 *               value:
 *                 email: "maria@barbearia.com"
 *                 password: "senha123"
 *                 name: "Maria Santos"
 *                 phone: "(11) 88888-8888"
 *                 role: "EMPLOYEE"
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *             admin:
 *               summary: Criar administrador
 *               value:
 *                 email: "admin@barbearia.com"
 *                 password: "admin123"
 *                 name: "Carlos Admin"
 *                 phone: "(11) 77777-7777"
 *                 role: "ADMIN"
 *                 establishmentId: "789e1234-e89b-12d3-a456-426614174003"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 email: "joao@email.com"
 *                 name: "João Silva"
 *                 phone: "(11) 99999-9999"
 *                 role: "CLIENT"
 *                 establishmentId: null
 *                 createdAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Dados inválidos ou usuário já existe
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
 *                     - field: "email"
 *                       message: "Email deve ter um formato válido"
 *                       value: "email-invalido"
 *                     - field: "phone"
 *                       message: "Telefone deve estar no formato (XX) XXXXX-XXXX"
 *                       value: "123456789"
 *               usuario_existe:
 *                 summary: Usuário já existe
 *                 value:
 *                   success: false
 *                   error: "User already exists"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 * /api/users/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: |
 *       Autentica um usuário e retorna um token JWT para acesso aos endpoints protegidos.
 *       
 *       **Fluxo da arquitetura hexagonal:**
 *       - **Presentation**: UserController valida credenciais
 *       - **Application**: AuthenticateUserUseCase executa autenticação
 *       - **Domain**: User entity valida regras de negócio
 *       - **Infrastructure**: JWTAuthService gera token, PrismaUserRepository busca usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "joao@email.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   email: "joao@email.com"
 *                   name: "João Silva"
 *                   phone: "(11) 99999-9999"
 *                   role: "CLIENT"
 *                   establishmentId: null
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6ImpvYW9AZW1haWwuY29tIiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTcwNTMxNDYwMCwiZXhwIjoxNzA1NDAxMDAwfQ.example-signature"
 *       400:
 *         description: Dados de login inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               errors:
 *                 - field: "email"
 *                   message: "Email é obrigatório"
 *                 - field: "password"
 *                   message: "Senha é obrigatória"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid credentials"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 * /api/users/profile:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     description: |
 *       Retorna os dados do perfil do usuário autenticado através do token JWT.
 *       
 *       **Segurança na arquitetura:**
 *       - **Presentation**: AuthMiddleware valida token JWT
 *       - **Application**: Dados do usuário extraídos do token
 *       - **Infrastructure**: JWTAuthService decodifica e valida token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 email: "joao@email.com"
 *                 name: "João Silva"
 *                 phone: "(11) 99999-9999"
 *                 role: "CLIENT"
 *                 establishmentId: null
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */