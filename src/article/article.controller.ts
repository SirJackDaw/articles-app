import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Article } from './article.entity';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { JwtPayload } from 'src/types/jwtPayload';
import { ArticleService } from './article.service';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { FindManyQuery } from './dto/findManyQuery.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ArticleCacheInterceptor } from 'src/interceptors/cache.interceptor';

@ApiBearerAuth()
@Controller('v1/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @UseGuards(AccessTokenGuard)
    @Post()
    @ApiBody({ type: CreateArticleDto })
    create(@Body() dto: CreateArticleDto, @CurrentUser() user: JwtPayload): Promise<Article> {
        dto.author = user.id
        return this.articleService.create(dto)
    }

    @Get()
    //стандартные средства не позволяют установить префикс для ключа, поэтому используем кастомный интерсептор
    @UseInterceptors(ArticleCacheInterceptor)
    // @ApiQuery({ type: FindManyQuery })//дублирует документацию
    async findArticles(@Query() query: FindManyQuery) {
        return this.articleService.findArticles(query)
    }

    @Get(':id')
    @UseInterceptors(ArticleCacheInterceptor)
    @ApiParam({ name: 'id', type: String })
    findArticle(@Param('id', ParseUUIDPipe) id: string) {
        return this.articleService.findById(id)
    }

    @UseGuards(AccessTokenGuard)
    @Patch(':id')
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateArticleDto })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateArticleDto, @CurrentUser() user: JwtPayload) {
        return this.articleService.update(id, user.id, dto).then(result=> {
            this.cacheManager.store.keys('articles_*').then(keys => keys.forEach(key => this.cacheManager.del(key)))
            return result
        })
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    @ApiParam({ name: 'id', type: String })
    delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
        return this.articleService.delete(id, user.id).then(_ => {
            this.cacheManager.store.keys('articles_*').then(keys => keys.forEach(key => this.cacheManager.del(key)))
        })
    }
}
