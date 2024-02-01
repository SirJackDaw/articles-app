import { IsString } from "class-validator";
import { UpdateArticleDto } from "./updateArticle.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDto extends UpdateArticleDto {
    author: string;

    @IsString()
    @ApiProperty({ required: true, default: 'articleTitle' })
    title: string;

    @IsString()
    @ApiProperty({ required: true, default: 'articleDescription' })
    description: string;
}