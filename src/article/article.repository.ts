import { AbstractRepository } from "src/database/abstract.repository";
import { Repository, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { FindManyQuery } from "./dto/findManyQuery.dto";
import { UpdateArticleDto } from "./dto/updateArticle.dto";
import { getDateTimezone } from "src/helpers/dateOperations";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ArticleRepository extends AbstractRepository<Article> {
  constructor(@InjectRepository(Article) articleRepository: Repository<Article>) {
    super(articleRepository);
  }

  async findMany(query: FindManyQuery): Promise<Article[]> {
    const { page, perPage, authorName, dateFrom, dateTo, timezone } = query

    //maybe I should move it to the sevice or controller, because this logic doesn't depend on database
    const take = +perPage || 10;
    const skip = +page > 0 ? (+page - 1) * take : 0;

    let where: FindOptionsWhere<Article> = {}

    const from = getDateTimezone(dateFrom, +timezone || 0)
    const to = getDateTimezone(dateTo, +timezone || 0)

    if (from && to) {
      where.createdAt = Between(from, to)
    } else if (from) { 
      where.createdAt = MoreThanOrEqual(from)
    } else if (to) { 
      where.createdAt = LessThanOrEqual(to);
    }

    if (typeof authorName !== 'undefined') { 
      where = { author: { name: authorName } }
    }

    return this.repository.find({
      relations: {author: true},
      select: {
        author: {
          name: true,
        }
      },
      skip,
      take,
      where
     });
  }

  async updateWithUser(id: string, userId: string, data: UpdateArticleDto): Promise<Article> {
    await this.repository.update({ id, author: { id: userId }}, data);
    return this.repository.findOne({ where: { id, author: { id: userId }}});
  }

  async deleteWithUser(id: string, userId: string): Promise<void> {
    await this.repository.delete({ id, author: { id: userId } })
  }
}