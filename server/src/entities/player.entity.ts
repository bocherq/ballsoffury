import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Tournament } from "./tournament.entity";
import { User } from "./user.entity";
import { Match } from "./match.entity";
import { Group } from "./group.entity";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tournament, tournament => tournament.players, { onDelete: 'CASCADE' })
    tournament: Tournament;

    @ManyToOne(() => User, user => user.tournamentParticipations)
    user: User;

    @Column({ default: 0 })
    score: number;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    losses: number;

    @Column({ default: 0 })
    draws: number;

    @OneToMany(() => Match, match => match.player1)
    matchesAsPlayer1: Match[];

    @OneToMany(() => Match, match => match.player2)
    matchesAsPlayer2: Match[];

    @ManyToOne(() => Group, group => group.players, { nullable: true })
    group: Group;
}
