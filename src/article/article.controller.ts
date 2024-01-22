import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Article } from './article.entity';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { JwtPayload } from 'src/types/jwtPayload';
import { ArticleService } from './article.service';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { FindManyQuery } from './dto/findManyQuery.dto';

@ApiBearerAuth()
@Controller('v1/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @UseGuards(AccessTokenGuard)
    @Post()
    @ApiBody({ type: CreateArticleDto })
    create(@Body() dto: CreateArticleDto, @CurrentUser() user: JwtPayload): Promise<Article> {
        dto.author = user.id
        return this.articleService.create(dto)
    }

    @Get()
    // @ApiQuery({ type: FindManyQuery })//дублирует документацию
    findArticles(@Query() query: FindManyQuery) {
        return this.articleService.findArticles(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String })
    findArticle(@Param('id') id: string) {
        return this.articleService.findById(id)
    }

    @UseGuards(AccessTokenGuard)
    @Patch(':id')
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateArticleDto })
    update(@Param('id') id: string, @Body() dto, @CurrentUser() user: JwtPayload) {
        return this.articleService.update(id, user.id, dto)
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    @ApiParam({ name: 'id', type: String })
    delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
        return this.articleService.delete(id, user.id)
    }
}
