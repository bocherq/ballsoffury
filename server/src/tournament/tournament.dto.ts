import { IsNotEmpty, IsString, IsDate, IsEnum } from "class-validator";
import { TournamentType } from "src/entities/tournament.entity";
import { Type } from "class-transformer";

export class CreateTournamentDTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @Type(() => Date)
    readonly startDate: Date;

    @IsNotEmpty()
    @IsEnum(TournamentType)
    readonly type: TournamentType;
}