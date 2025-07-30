import { IsInt } from "class-validator";

export class MatchResultDTO {
  @IsInt()
  player1Score: number;

  @IsInt()
  player2Score: number;
}
