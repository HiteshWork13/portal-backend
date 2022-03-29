
import { adminRoles, adminStaus } from "src/models/admin.interface";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

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
    role: adminRoles

    @Column({ nullable: true })
    created_by?: string;

    @ManyToOne(() => AdminEntity, (Admin) => Admin.id, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    creator_id: string;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;

    @BeforeInsert()
    async hashPassword() {
        console.log("bcrypt.hash(this.password, 8)", await bcrypt.hash(this.password, 8));
        this.password = await bcrypt.hash(this.password, 8);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}