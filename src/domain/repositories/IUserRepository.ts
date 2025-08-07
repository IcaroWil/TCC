import { User } from "../entities/User";

export interface  IUserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEstablishment(establishmentId: string): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    list(page: number, limit: number): Promise<{users: User[], total: number}>;
}