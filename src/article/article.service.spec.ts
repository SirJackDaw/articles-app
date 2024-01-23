import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "./article.service";
import { ArticleRepository } from "./article.repository";

describe ('ArticleService', () => {
    let service: ArticleService;

    const mockArticleRepository = {
        findMany: jest.fn(query => (Promise.resolve([]))),
        findById: jest.fn(id => (Promise.resolve({id: id}))),
        create: jest.fn(dto => (Promise.resolve({ id: '1', ...dto, author: { id: dto.author } }))),
        updateWithUser: jest.fn((id, userId, dto) => (Promise.resolve({ id: id, author: userId, ...dto }))),
        deleteWithUser: jest.fn((id, userId) => (Promise.resolve())),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ArticleService, ArticleRepository]
        })
        .overrideProvider(ArticleRepository)
        .useValue(mockArticleRepository)
        .compile();

        service = module.get<ArticleService>(ArticleService);
    });

    it ('should be defined', () => {
        expect(service).toBeDefined();
    });

    it ('should create article', async () => {
        const dto = { title: 'title', description: 'description', author: '1'}
        expect(service.create(dto)).resolves.toEqual({ 
            id: expect.any(String), 
            ...dto,
            author: { id: '1' }
        })

        expect(mockArticleRepository.create).toHaveBeenCalledWith(dto)
    });

    it ('should delete article', async () => {
        await expect(service.delete('1', '1')).resolves.toBeUndefined();
        await expect(mockArticleRepository.deleteWithUser).toHaveBeenCalledWith('1', '1')
    })

    it ('should update article', async () => {
        const dto = { title: 'title', description: 'description', author: '1'}
        expect(service.update('1', '1', dto)).resolves.toEqual({ 
            id: '1', 
            ...dto,	
        })
        expect(mockArticleRepository.updateWithUser).toHaveBeenCalledWith('1', '1', dto)
    })

    it ('should find articles', async () => {
        const query = { page: '1', perPage: '10', authorName: 'name', dateFrom: '2020-01-01', dateTo: '2020-01-02', timezone: '0' }
        expect(service.findArticles(query)).resolves.toEqual([])
        expect(mockArticleRepository.findMany).toHaveBeenCalledWith(query)
    })

    it ('should find article by id', async () => {
        expect(service.findById('1')).resolves.toEqual({ id: '1' })
        expect(mockArticleRepository.findById).toHaveBeenCalledWith('1')
    })
});