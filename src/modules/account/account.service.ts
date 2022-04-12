import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountUser } from 'src/models/account.model';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private Account: Repository<AccountEntity>
    ) {

    }

    async CreateAccount(inputData): Promise<AccountUser> {
        try {
            const user: any = this.Account.create(inputData)
            await this.Account.save(user);
            return user
        } catch (error) {
            throw error
        }
    }
}
