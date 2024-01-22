import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "./article.service";
import { ArticleRepository } from "./article.repository";

describe ('ArticleService', () => {
    let service: ArticleService;

    const mockArticleRepository = {
        findMany: jest.fn(query => ([])),
        findById: jest.fn(id => ({})),
        create: jest.fn(dto => (Promise.resolve({ id: '1', ...dto, author: { id: dto.author } }))),
        updateWithUser: jest.fn((id, userId, dto) => (Promise.resolve({ id: id, author: userId, ...dto }))),
        deleteWithUser: jest.fn((id, userId) => ({})),
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
    })
});