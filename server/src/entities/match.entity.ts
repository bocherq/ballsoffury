import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Tournament } from "./tournament.entity";
import { Player } from "./player.entity";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tournament, tournament => tournament.matches, { onDelete: 'CASCADE' })
    tournament: Tournament;

    @ManyToOne(() => Player, player => player.matchesAsPlayer1)
    player1: Player;

    @ManyToOne(() => Player, player => player.matchesAsPlayer2)
    player2: Player;

    @Column({ nullable: true })
    player1Score: number;

    @Column({ nullable: true })
    player2Score: number;

    @Column({ type: 'timestamp', nullable: true })
    scheduledAt: Date;

    @Column({ nullable: true })
    round: number;

    @Column({ type: 'varchar', nullable: true })
    bracket: 'winners' | 'losers';

    @Column({ default: false })
    isThirdPlaceMatch: boolean;

    @Column({ default: false })
    isFinal: boolean;

    @ManyToOne(() => Match, { nullable: true })
    previousMatch1: Match;

    @ManyToOne(() => Match, { nullable: true })
    previousMatch2: Match;
}
