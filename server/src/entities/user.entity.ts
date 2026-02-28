import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column({ default: '' })
    photo: string;

    @Column({ default: 100 })
    rating: number;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ default: '' })
    blade: string;

    @Column({ default: '' })
    leftSponge: string;

    @Column({ default: '' })
    rightSponge: string;
}