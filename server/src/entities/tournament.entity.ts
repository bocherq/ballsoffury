import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Player } from "./player.entity";
import { Match } from "./match.entity";
import { Group } from "./group.entity";

export enum TournamentType {
    ROUND_ROBIN = 'roundrobin',
    SINGLE = 'single',
    DOUBLE = 'double',
}

export enum TournamentState {
    OPEN = 'open',
    ACTIVE = 'active',
    FINISHED = 'finished',
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

    @Column({
        type: 'enum',
        enum: TournamentState,
        default: TournamentState.OPEN,
    })
    state: TournamentState;

    @Column({ default: false })
    isBracketGenerated: boolean;

    @ManyToOne(() => Player, { nullable: true, eager: true })
    winner: Player;

    @ManyToOne(() => Player, { nullable: true, eager: true })
    secondPlace: Player;

    @ManyToOne(() => Player, { nullable: true, eager: true })
    thirdPlace: Player;

    @OneToMany(() => Player, player => player.tournament, { cascade: true })
    players: Player[];

    @OneToMany(() => Match, match => match.tournament, { cascade: true })
    matches: Match[];

    @OneToMany(() => Group, group => group.tournament, { cascade: true })
    groups: Group[];
}
