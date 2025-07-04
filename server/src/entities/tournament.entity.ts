import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Player } from "./player.entity";
import { Match } from "./match.entity";

export enum TournamentType {
    ROUND_ROBIN = 'roundrobin',
    SINGLE = 'single',
    DOUBLE = 'double',
}

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({
        type: 'enum',
        enum: TournamentType,
        default: TournamentType.ROUND_ROBIN,
    })
    type: TournamentType;

    @Column({ default: false })
    isBracketGenerated: boolean;

    @ManyToOne(() => Player, { nullable: true, eager: true })
    winner: Player;

    @ManyToOne(() => Player, { nullable: true, eager: true })
    secondPlace: Player;

    @ManyToOne(() => Player, { nullable: true, eager: true })
    thirdPlace: Player;

    @OneToMany(() => Player, player => player.tournament)
    players: Player[];

    @OneToMany(() => Match, match => match.tournament)
    matches: Match[];
}
