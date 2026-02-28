import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsUrl()
    readonly photo: string;
}