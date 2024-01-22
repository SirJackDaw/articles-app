import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleRepository } from './article.repository';
import { Article } from './article.entity';
import { FindManyQuery } from './dto/findManyQuery.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Injectable()
export class ArticleService {
    constructor(private readonly articlesRepository: ArticleRepository) {}

    create(dto: CreateArticleDto): Promise<Article> {
        return this.articlesRepository.create(dto)
    }

    findArticles(query: FindManyQuery) {
        return this.articlesRepository.findMany(query)
    }

    findById(id: string) {
        return this.articlesRepository.findById(id)
    }

    update(id: string, userId: string, dto: UpdateArticleDto) {
        return this.articlesRepository.updateWithUser(id, userId, dto)
    }

    async delete(id: string, userId: string): Promise<void> {
        this.articlesRepository.deleteWithUser(id, userId)
    }
}
