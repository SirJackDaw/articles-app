import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateArticleDto {
    @IsString()
    @ApiProperty({ required: false })
    title: string;

    @IsString()
    @ApiProperty({ required: false })
    description: string;
}