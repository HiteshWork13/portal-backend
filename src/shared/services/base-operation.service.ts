import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';

@Injectable()
export class BaseOperationService {

    /* entity: Repository<any>;

    constructor(e: Repository<any>) {
        this.entity = e;
    }

    findAll(condition: object = null, required_params: Array<String> = []) {
        const query = {}
        if (required_params.length) {
            query['select'] = required_params.reduce((select, column: any) => {
                select[column] = true;
                return select;
            }, {})
        };

        condition ? query['where'] = condition : null;
        return this.entity.find(query);
    } */
}
