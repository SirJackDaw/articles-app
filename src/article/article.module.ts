import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { Article } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Article])],
    controllers: [ArticleController],
    providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}

