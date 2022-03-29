import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('Account')
export class AccountEntity {

    @PrimaryGeneratedColumn('uuid')
    id: Number;

    @Column({ collation: "default" })
    code: String;

    @Column({ collation: "default" })
    firstname: String;

    @Column({ collation: "default" })
    lastname: String;

    @Column({ collation: "default" })
    companyname: String;

    @Column({ collation: "default" })
    phone: String;

    @Column({ collation: "default" })
    address: String;

    @Column({ collation: "default" })
    postcode: String;

    @Column({ collation: "default" })
    country: String;

    @Column({ collation: "default" })
    billingemail: String;

    @Column({ collation: "default" })
    customerid: String;

    @Column({ collation: "default" })
    vat: String;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    created_at?: Date;;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at?: Date;;


    @Column({ default: 1 })
    packageid: Number;

    @Column({ default: 0 })
    accounttype: Number;

    @Column({ default: 0, nullable: false })
    credits: Number;

    @Column({ default: false, nullable: false })
    purchased: Boolean;

    @Column({ collation: "default", nullable: false })
    password: String;

    @Column({ collation: "default", nullable: false })
    email: String;

    @Column({ default: false })
    emailverified: Boolean;

    @Column({ collation: "default" })
    verificationtoken: String;

    @Column({ collation: "default" })
    city: String;

    @Column({ default: 7 })
    triallimit: Number;

    @Column({ default: 4 })
    role: Number;

    @Column({ default: false, nullable: false })
    twofactor: Boolean;

    @Column({ default: 1 })
    totaldevices: Number;

    @Column({ default: 0 })
    registrationtype: Number;

    @Column({ type: "date" })
    expirydate: Date;

    @Column()
    analyticsstatus: Boolean;

    @Column({ default: 1, nullable: false })
    packageid_dr: Number;

    @Column({ type: "double precision", default: 0, nullable: false })
    size_dr: Number;

    @Column({ type: "integer", default: 1, nullable: false })
    totaldevices_dr: Number;

    @Column({ type: "date", default: () => 'CURRENT_DATE', nullable: false })
    expirydate_dr: Date;

    @Column({ type: "timestamp without time zone" })
    purchasedate: Date;

    @Column({ default: false })
    payasgo: Boolean;

    @Column({ default: 1 })
    payid: Number;

    @Column({ default: true })
    communicationstatus: Boolean;
}
