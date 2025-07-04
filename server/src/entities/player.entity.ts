import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Tournament } from "./tournament.entity";
import { User } from "./user.entity";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tournament, tournament => tournament.players, { onDelete: 'CASCADE' })
    tournament: Tournament;

    @ManyToOne(() => User, user => user.tournamentParticipations, { eager: true })
    user: User;

    @Column({ default: 0 })
    score: number;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    losses: number;

    @Column({ default: 0 })
    draws: number;
}
