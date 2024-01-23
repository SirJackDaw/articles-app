import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";


describe ('UsersService', () => {
    let service: UsersService;

    const users = []

    const mockUsersRepository = {
        create: jest.fn(dto => new Promise(resolve => {
            const user = new User()
            user.id = '1'
            user.email = dto.email
            user.name = dto.name
            user.password = dto.password
            users.push(user)
            resolve(user)
        })),
        findById: jest.fn(id => (Promise.resolve(users.find(user => user.id === id)))),
        findByEmail: jest.fn(email => (
            Promise.resolve(users.find(user => user.email === email))
        )),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, UserRepository]
        })
        .overrideProvider(UserRepository)
        .useValue(mockUsersRepository)
        .compile();

        service = module.get<UsersService>(UsersService);
    });

    it ('should be defined', () => {
        expect(service).toBeDefined();
    });

    it ('should create user', async () => {
        const dto = { email: 'email', password: 'password', name: 'name' }
        await expect(service.createUser(dto)).resolves.toEqual({
            id: expect.any(String),
            password: expect.not.stringContaining(dto.password),
            name: dto.name,
            email: dto.email,
        })

        expect(mockUsersRepository.create).toHaveBeenCalled()
    });

    it ('should throw Bad Request exception', async () => {
        const dto = {email: 'email', password: 'password', name: 'name'}
        await expect(service.createUser(dto)).rejects.toThrow('Email already exists')
    });

    it ('should find user by id', async () => {
        const id = '1'
        expect(service.getUserById(id)).resolves.toEqual({
            id: '1', 
            email: 'email', 
            name: 'name', 
            password: expect.not.stringContaining('password')
        })
        expect(mockUsersRepository.findById).toHaveBeenCalledWith(id)
    });

    it ('should validate user', async () => {
        const email = 'email'
        const password = 'password'
        expect(service.validateUser(email, password)).resolves.toEqual({ 
            id: '1', 
            email: 'email', 
            name: 'name', 
            password: expect.not.stringContaining('password')
        })
        expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email)
    });

    it ('should throw user not found', async () => {
        const email = 'email1'
        const password = 'password'
        expect(service.validateUser(email, password)).rejects.toThrow('User not found')
        expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email)
    });

    it ('should throw Credentials are not valid', async () => {
        const email = 'email'
        const password = 'password1'
        expect(service.validateUser(email, password)).rejects.toThrow('Credentials are not valid')
        expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email)
    });
});