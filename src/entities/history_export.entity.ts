
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("history_export")
export class HistoryExportEntity {

    @PrimaryGeneratedColumn({ type: "int" })
    id: any;

    @Column({ type: "uuid", nullable: false })
    client_id

    @Column({ type: "text", collation: "default" })
    mac: string;

    @Column({ type: "timestamp without time zone", default: () => 'NOW()' })
    timestamp: Date;

    @Column({ type: "integer" })
    length: number;

    @Column({ type: "text", collation: "default" })
    version: string;
}