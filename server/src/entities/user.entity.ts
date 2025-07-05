import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Player } from "./player.entity";

@Entity()
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

    @OneToMany(() => Player, tp => tp.user)
    tournamentParticipations: Player[];
}