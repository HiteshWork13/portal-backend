
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("history_export_dr")
export class HistoryExportDrEntity {
  
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

    @Column({ type: "boolean", default: true })
    trial: string;

    @Column({ type: "integer" })
    app_type: string;
}