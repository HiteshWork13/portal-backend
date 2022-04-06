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

    FindAdminByRoleIdAndCreatedId = (filter) => {
        var query = this.Admin.createQueryBuilder()
            .select("id, username, email, role, status, created_by, created_at, updated_at")
            .where('role = :role', { role: filter['role'] })
            .andWhere('status = :status', { status: 1 })

        if ('created_by' in filter && filter.created_by) {
            query = query.andWhere('created_by = :created_by', { created_by: filter['created_by'] })
        }

        if ('offset' in filter && filter.offset) {
            query = query.offset(filter['offset'])
        }

        if ('limit' in filter && filter.limit) {
            query = query.limit(filter['limit'])
        }

        if ('order' in filter && filter.order) {
            Object.keys(filter.order).forEach(key => {
                if (key in filter.order) {
                    query = query.orderBy(key, filter.order[key])
                }
            })
        }

        return query;
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
