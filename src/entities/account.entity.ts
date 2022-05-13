import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";
import * as bcrypt from 'bcrypt';
import { DocumentsEntity } from "./documents.entity";


@Entity('Account')
export class AccountEntity {

    @PrimaryGeneratedColumn('uuid')
    id: Number;

    @Column({ collation: "default", nullable: true })
    code: string;

    @Column({ collation: "default" })
    firstname: string;

    @Column({ collation: "default" })
    lastname: string;

    @Column({ collation: "default" })
    companyname: string;

    @Column({ collation: "default", nullable: true })
    phone: string;

    @Column({ collation: "default", nullable: true })
    address: string;

    @Column({ collation: "default" })
    postcode: string;

    @Column({ collation: "default" })
    country: string;

    @Column({ collation: "default" })
    billingemail: string;

    @Column({ collation: "default", nullable: true })
    customerid: string;

    @Column({ collation: "default", nullable: true })
    vat: string;

    @Column({ type: "integer", default: 1 })
    packageid: Number;

    @Column({ type: "integer", default: 0 })
    accounttype: Number;

    @Column({ type: "double precision", default: 0, nullable: false })
    credits: Number;

    @Column({ type: "boolean", default: false, nullable: false })
    purchased: Boolean;

    @Column({ collation: "default", nullable: false })
    password: string;

    @Column({ collation: "default", nullable: false })
    email: string;

    @Column({ default: false })
    emailverified: Boolean;

    @Column({ collation: "default", nullable: true })
    verificationtoken: string;

    @Column({ collation: "default", nullable: true })
    city: string;

    @Column({ default: 7 })
    triallimit: Number;

    @Column({ type: "int", default: 4 })
    role: 4

    @Column({ default: false, nullable: false })
    twofactor: Boolean;

    @Column({ default: 1 })
    totaldevices: Number;

    @Column({ default: false, nullable: false })
    payasgo: Boolean;

    @Column({ type: "integer", default: 1 })
    payid: Number;

    @Column({ type: "timestamp without time zone", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    purchasedate: Date;

    @Column({ type: "integer", default: 0 })
    registrationtype: Number;

    @Column({ nullable: true })
    created_by: AdminEntity;
    
    @ManyToOne(() => AdminEntity, (Admin) => Admin.id)
    @JoinColumn({ name: "created_by" })
    created_by_id: AdminEntity;

    @Column({ collation: "default" })
    enduser_street: string;

    @Column({ collation: "default" })
    enduser_state: string;

    @Column({ collation: "default" })
    enduser_email: string;

    @Column({ collation: "default" })
    reseller_company: string;

    @Column({ collation: "default" })
    reseller_street: string;

    @Column({ collation: "default" })
    reseller_state: string;

    @Column({ collation: "default" })
    reseller_code: string;

    @Column({ collation: "default" })
    reseller_firstname: string;

    @Column({ collation: "default" })
    reseller_lastname: string;

    @Column({ collation: "default" })
    enduser_classification: string;

    @Column({ collation: "default" })
    reseller_email: string;

    @Column({ type: "date", default: () => 'NOW()' })
    expirydate: Date;

    @Column({ default: true })
    analyticsstatus: Boolean;

    @Column({ default: 1 })
    packageid_dr: Number;

    @Column({ type: "double precision", default: 0 })
    size_dr: Number;

    @Column({ type: "integer", default: 1 })
    totaldevices_dr: Number;

    @Column({ type: "date", default: () => 'NOW()' })
    expirydate_dr: Date;

    @Column({ default: true })
    communicationstatus: Boolean;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }
}
