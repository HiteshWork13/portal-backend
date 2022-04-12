import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QueryService {

    constructor(
        @InjectRepository(AdminEntity)
        private Admin: Repository<AdminEntity>
    ) { }

    FindAdminByEmailOnly(email): any {
        return this.Admin.findOne({ where: { email } })
    }

}
