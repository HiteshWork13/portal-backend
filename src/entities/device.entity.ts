
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("productkey")
export class DeviceEntity {

    @PrimaryColumn({ type: "int", nullable: false })
    id: any;

    @Column()
    userid

    @ManyToOne(() => AccountEntity, (account) => account.id)
    @JoinColumn({ name: 'userid' })
    user: string;

    @Column({ type: "timestamp with time zone", default: () => 'NOW()' })
    date: Date;

    @Column({ type: "varchar", collation: "default" })
    productkey: string;

    @Column({ type: "varchar", collation: "default" })
    licencekey: string;

    @Column({ type: "varchar", collation: "default" })
    hostname: string;

    @Column({ type: "boolean" })
    status: Boolean;
}