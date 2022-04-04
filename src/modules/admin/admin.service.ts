import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminUser } from 'src/models/admin.model';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private Admin: Repository<AdminEntity>
    ) {

    }

    FindAdminByEmailOnly(email): any {
        return this.Admin.findOne({ where: { email } })
    }

    async CreateAdmin(inputData): Promise<AdminUser> {
        try {
            const user: any = this.Admin.create(inputData)
            await this.Admin.save(user);
            return user
        } catch (error) {
            throw error
        }
    }

    FindAdminByRoleIdAndCreatedId = (role, created_by: any = null) => {
        if (created_by) {
            return this.Admin.createQueryBuilder()
                .select("id, username, email, role, status, created_by, created_at, updated_at")
                .where('role = :role', { role })
                .andWhere('created_by = :created_by', { created_by })
                .orderBy('email', 'ASC')
                .orderBy('username', 'DESC')
        } else {
            return this.Admin.createQueryBuilder()
                .select("id, username, email, role, status, created_by, created_at, updated_at")
                .where('role = :role', { role })
                .orderBy('email', 'ASC')
                .orderBy('username', 'DESC')
        }
    }

    FindAdminById(id) {
        return this.Admin.findOne({ where: { id } });
    }

    DeleteAdminQuery(id) {
        return this.Admin.createQueryBuilder()
            .update('Admin')
            .set({ 'status': 0 })
            .where('id = :id', { id })
    }

    UpdateAdminQuery(id, body) {
        return this.Admin.update({ id }, body)
    }

}
