import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ default: 'email@email.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'password' })
    password: string;
}