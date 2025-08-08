export interface CreateAppointmentDTO {
    clientId: string;
    serviceId: string;
    establishmentId: string;
    employeeId: string;
    scheduledAt: Date;
    notes?: string;
}

export interface AppointmentResponseDTO {
    id: string;
    clientId: string;
    serviceId: string;
    establishmentId: string;
    employeeId: string;
    scheduledAt: Date;
    status: string;
    notes?: string;
    createdAt: Date;
}