import { BusinessCategory, BusinessCategoryType, CategoryDefaultSettings } from '../../../domain/entities/BusinessCategory';

export const defaultBusinessCategories: BusinessCategory[] = [
    BusinessCategory.create({
        name: 'Beleza & Estética',
        type: BusinessCategoryType.BEAUTY_AESTHETICS,
        description: 'Serviços de beleza, cuidados estéticos e bem-estar',
        subcategories: [
            'Barbearia',
            'Salão de Beleza',
            'Estética Facial',
            'Manicure/Pedicure',
            'Depilação',
            'Massagem',
            'Sobrancelha',
            'Cílios'
        ],
        defaultSettings: {
            defaultAppointmentDuration: 60,
            advanceBookingDays: 30,
            requiresConfirmation: true,
            allowsCancellation: true,
            cancellationHours: 2,
            allowsOnlinePayment: true,
            requiresEmployeeAssignment: true,
            maxParticipantsPerSlot: 1,
            workingHoursTemplate: [
                { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '16:00' },
                { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' }
            ],
            customFieldsTemplate: [
                { name: 'Tipo de Cabelo', type: 'select', required: false, options: ['Liso', 'Ondulado', 'Cacheado', 'Crespo'] },
                { name: 'Alergias', type: 'text', required: false }
            ]
        }
    }),

    BusinessCategory.create({
        name: 'Saúde & Bem-estar',
        type: BusinessCategoryType.HEALTH_WELLNESS,
        description: 'Serviços de saúde, terapias e bem-estar',
        subcategories: [
            'Clínica Médica',
            'Fisioterapia',
            'Psicologia',
            'Nutrição',
            'Odontologia',
            'Acupuntura',
            'Quiropraxia',
            'Terapia Ocupacional'
        ],
        defaultSettings: {
            defaultAppointmentDuration: 45,
            advanceBookingDays: 60,
            requiresConfirmation: true,
            allowsCancellation: true,
            cancellationHours: 24,
            allowsOnlinePayment: false,
            requiresEmployeeAssignment: true,
            maxParticipantsPerSlot: 1,
            workingHoursTemplate: [
                { dayOfWeek: 1, isOpen: true, openTime: '07:00', closeTime: '17:00' },
                { dayOfWeek: 2, isOpen: true, openTime: '07:00', closeTime: '17:00' },
                { dayOfWeek: 3, isOpen: true, openTime: '07:00', closeTime: '17:00' },
                { dayOfWeek: 4, isOpen: true, openTime: '07:00', closeTime: '17:00' },
                { dayOfWeek: 5, isOpen: true, openTime: '07:00', closeTime: '17:00' },
                { dayOfWeek: 6, isOpen: false, openTime: '00:00', closeTime: '00:00' },
                { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' }
            ],
            customFieldsTemplate: [
                { name: 'Convênio', type: 'select', required: false, options: ['SUS', 'Particular', 'Unimed', 'Bradesco', 'Amil'] },
                { name: 'Observações Médicas', type: 'text', required: false }
            ]
        }
    }),

    BusinessCategory.create({
        name: 'Serviços Profissionais',
        type: BusinessCategoryType.PROFESSIONAL_SERVICES,
        description: 'Consultoria, assessoria e serviços profissionais especializados',
        subcategories: [
            'Advocacia',
            'Contabilidade',
            'Consultoria Empresarial',
            'Arquitetura',
            'Engenharia',
            'Design',
            'Marketing',
            'Recursos Humanos'
        ],
        defaultSettings: {
            defaultAppointmentDuration: 90,
            advanceBookingDays: 45,
            requiresConfirmation: false,
            allowsCancellation: true,
            cancellationHours: 48,
            allowsOnlinePayment: true,
            requiresEmployeeAssignment: true,
            maxParticipantsPerSlot: 3,
            workingHoursTemplate: [
                { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 6, isOpen: false, openTime: '00:00', closeTime: '00:00' },
                { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' }
            ],
            customFieldsTemplate: [
                { name: 'Área de Interesse', type: 'text', required: true },
                { name: 'Empresa', type: 'text', required: false }
            ]
        }
    }),

    BusinessCategory.create({
        name: 'Educação & Treinamento',
        type: BusinessCategoryType.EDUCATION_TRAINING,
        description: 'Aulas, cursos, treinamentos e capacitação profissional',
        subcategories: [
            'Aulas Particulares',
            'Cursos Técnicos',
            'Idiomas',
            'Música',
            'Esportes',
            'Informática',
            'Culinária',
            'Artesanato'
        ],
        defaultSettings: {
            defaultAppointmentDuration: 60,
            advanceBookingDays: 30,
            requiresConfirmation: false,
            allowsCancellation: true,
            cancellationHours: 12,
            allowsOnlinePayment: true,
            requiresEmployeeAssignment: true,
            maxParticipantsPerSlot: 10,
            workingHoursTemplate: [
                { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '22:00' },
                { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '22:00' },
                { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '22:00' },
                { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '22:00' },
                { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '22:00' },
                { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '18:00' },
                { dayOfWeek: 0, isOpen: true, openTime: '08:00', closeTime: '18:00' }
            ],
            customFieldsTemplate: [
                { name: 'Nível', type: 'select', required: true, options: ['Iniciante', 'Intermediário', 'Avançado'] },
                { name: 'Objetivo', type: 'text', required: false }
            ]
        }
    }),

    BusinessCategory.create({
        name: 'Outros',
        type: BusinessCategoryType.OTHER,
        description: 'Outros tipos de serviços com agendamento',
        subcategories: [
            'Manutenção',
            'Limpeza',
            'Jardinagem',
            'Pet Shop',
            'Fotografia',
            'Eventos',
            'Transporte',
            'Delivery'
        ],
        defaultSettings: {
            defaultAppointmentDuration: 60,
            advanceBookingDays: 15,
            requiresConfirmation: true,
            allowsCancellation: true,
            cancellationHours: 6,
            allowsOnlinePayment: false,
            requiresEmployeeAssignment: false,
            maxParticipantsPerSlot: 1,
            workingHoursTemplate: [
                { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '17:00' },
                { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '17:00' },
                { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '17:00' },
                { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '17:00' },
                { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '17:00' },
                { dayOfWeek: 6, isOpen: true, openTime: '08:00', closeTime: '12:00' },
                { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' }
            ],
            customFieldsTemplate: [
                { name: 'Observações', type: 'text', required: false }
            ]
        }
    })
];