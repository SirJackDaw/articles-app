import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateArticleDto {
    @IsString()
    @ApiProperty({ required: false, default: 'articleTitle' })
    title: string;

    @IsString()
    @ApiProperty({ required: false, default: 'articleDescription' })
    description: string;
}