
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { AccountEntity } from "./account.entity";

@Entity("Documents")
export class DocumentsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    uploaded_by_id: AdminEntity;

    @ManyToOne(() => AdminEntity, (Admin) => Admin.id, { nullable: true })
    @JoinColumn({ name: "uploaded_by_id" })
    uploaded_by: AdminEntity

    /* @Column({ nullable: true })
    upload_for_admin_id: AdminEntity

    @ManyToOne(() => AdminEntity, (Admin) => Admin.id, { nullable: true })
    @JoinColumn({ name: "upload_for_admin_id" })
    upload_for_admin: AdminEntity */

    /* @Column({ nullable: true })
    upload_for_account_id: AccountEntity

    @ManyToOne(() => AccountEntity, (Account) => Account.id, { nullable: true })
    @JoinColumn({ name: "upload_for_account_id" })
    upload_for_account: AccountEntity */

    @Column({ nullable: true })
    upload_for_account_id: AdminEntity;

    @OneToOne(() => AccountEntity, (account) => account.document, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'upload_for_account_id' })
    upload_for_account

    @Column()
    document_name: string

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;

}