
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./account.entity";
import { DocumentsEntity } from "./documents.entity";

@Entity("Admin")
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ nullable: true })
    company: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    postcode: string;

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ default: 1 })
    status: 0 | 1

    @Column({ type: "int", nullable: false })
    role: 1 | 2 | 3

    @Column({ nullable: true })
    created_by: AdminEntity

    @ManyToOne(() => AdminEntity, (Admin) => Admin.id, { nullable: true })
    @JoinColumn({ name: "created_by" })
    created_by_id: AdminEntity;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;

    @Column({ type: "json", nullable: true, default: {} })
    permissions: any

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    @BeforeUpdate()
    async updatePassword() {
        if (this.password)
            this.password = await bcrypt.hash(this.password, 8);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}