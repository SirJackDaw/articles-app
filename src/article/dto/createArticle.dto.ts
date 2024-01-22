import { UpdateArticleDto } from "./updateArticle.dto";

export class CreateArticleDto extends UpdateArticleDto {
    author: string;
}