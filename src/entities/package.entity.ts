
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("packagelist")
export class PackageEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: string;

    @Column({ type: "uuid", nullable: false })
    userid: string;

    @Column({ type: "text", collation: 'default' })
    packagename: string;

    @Column({ type: 'int' })
    totalcost: number;

    @Column({ type: 'double precision' })
    lengthcost: number;

    @Column({ type: 'double precision' })
    exportcost: number;

    @Column({ type: 'text', collation: 'default', default: 1 })
    planid: string;
}