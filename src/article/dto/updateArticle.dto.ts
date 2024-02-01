import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateArticleDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, default: 'articleTitle' })
    title: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, default: 'articleDescription' })
    description: string;
}