
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./account.entity";

@Entity("Admin")
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: 1 })
    status: 0 | 1

    @Column({ type: "int", nullable: false })
    role: 1 | 2 | 3

    @Column({ nullable: true })
    created_by_id: AdminEntity

    @ManyToOne(() => AdminEntity, (Admin) => Admin.id, { nullable: true })
    @JoinColumn({ name: "created_by_id" })
    created_by: AdminEntity;


    /* @ManyToOne(() => AdminEntity, (Admin) => Admin.subAdmins, { nullable: true })
    owner: AdminEntity;

    @OneToMany(() => AdminEntity, (Admin) => Admin.owner)
    subAdmins: AdminEntity[]

    @OneToMany(() => AccountEntity, (Account) => Account.owner, { nullable: true })
    accounts: AccountEntity[] */

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}