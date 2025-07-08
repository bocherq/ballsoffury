import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Tournament } from './tournament.entity';
import { Player } from './player.entity';
import { Match } from './match.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // например, "Группа A", "Группа B" и т.п.

  @ManyToOne(() => Tournament, tournament => tournament.groups, { nullable: false })
  tournament: Tournament;

  @OneToMany(() => Player, player => player.group)
  players: Player[];

  @OneToMany(() => Match, match => match.group)
  matches: Match[];
}