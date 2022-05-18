import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/entities/device.entity';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {

    constructor(
        @InjectRepository(DeviceEntity)
        private Device: Repository<DeviceEntity>,
        private utils: UtilsService,
        private queryService: QueryService
    ) {

    }

    FindDeviceById(id) {
        return this.Device.findOne({ where: { id } });
    }

    FindDeviceByAccountId = async (filter) => {
        var query = this.Device.createQueryBuilder('device')
            .leftJoinAndSelect('device.user', 'account')
            .where('device.userid = (:accountId)::uuid', { accountId: filter['account_id'] })

        const count = await query.getCount();
        const result = { count };

        query = this.queryService.ApplyPaginationToQuery(query, filter);

        if ('offset' in filter && filter.offset) {
            result['offset'] = filter['offset'];
        }
        if ('limit' in filter && filter.limit) {
            result['limit'] = filter.limit;
        }
        
        const data = await query.getMany();
        result['data'] = data;

        return result;
    }

    updateDevice(id, body) {
        return this.Device.update({ id }, body);
    }

    deleteDevice(id) {
        return this.Device.delete({ id })
    }


}
