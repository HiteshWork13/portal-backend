import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageEntity } from 'src/entities/package.entity';
import { Package } from 'src/models/package.model';
import { QueryService } from 'src/shared/services/query.service';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
    constructor(
        @InjectRepository(PackageEntity)
        private Package: Repository<PackageEntity>,
        private queryService: QueryService
    ) {

    }

    async CreatePackage(inputData): Promise<Package> {
        try {
            const pack: any = this.Package.create(inputData)
            await this.Package.save(pack);
            return pack;
        } catch (error) {
            throw error
        }
    }

    FindPackageByCreatedId = async (filter) => {
        const searchFields = {
            'packagename': "text",
            'totalcost': "text",
            'lengthcost': "text",
            'exportcost': "text"
        };

        var query = this.Package.createQueryBuilder().select()
            .where('userid = :userid', { userid: filter['userid'] })

        query = this.queryService.ApplySearchToQuery(query, filter, Object.entries(searchFields));

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

    FindPackageById(id) {
        return this.Package.findOne({ where: { id } });
    }

    DeletePackageQuery(id) {
        return this.Package.createQueryBuilder()
            .delete()
            .from('packagelist')
            .where('id = :id', { id })
    }

    UpdatePackageQuery(id, body) {
        const admin: any = this.Package.create(body);
        return this.Package.update({ id }, admin);
    }

}
