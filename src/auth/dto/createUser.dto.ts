import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { LoginDto } from "./login.dto";

export class CreateUserDto extends LoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({default: 'name'})
    name: string;
}