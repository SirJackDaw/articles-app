import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

describe ('AuthService', () => {
    let service: AuthService;

    const correctToken = 'token'
    const incorrectToken = 'incorrectToken'

    const mockUsersService = {
        createUser: jest.fn(dto => (Promise.resolve({id: '1', ...dto}))),
        validateUser: jest.fn((email, password) => ((Promise.resolve({id: '1', email, password, name: 'name'})))),
    }

    const mockJwtService = {
        verifyAsync: jest.fn((token, options) => (Promise.resolve({ id: '1', email: 'email', name: 'name' }))),
        signAsync: jest.fn((payload, options) => Promise.resolve('token')),
    }

    const mockCache = {
        get: jest.fn(key => Promise.resolve(correctToken)),
        set: jest.fn((key, value, ttl) => Promise.resolve()),
        del: jest.fn(key => Promise.resolve()),
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forFeature(async () => ({
                    JWT_REFRESH_SECRET: 'secret',
                    REFRESH_EXPIRY_IN_SECONDS: 2
                }))
              ],
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService }, 
                { provide: JwtService, useValue: mockJwtService },
                { provide: CACHE_MANAGER, useValue: mockCache },
                // { provide: ConfigService, useValue: mockConfigService },
            ]
        })
        .compile();

        service = module.get<AuthService>(AuthService);
    });

    it ('should be defined', () => {
        expect(service).toBeDefined();
    });

    it ('should call create user', async () => {

        const dto = { email: 'email', password: 'password', name: 'name' }
        await expect(service.register(dto)).resolves.toEqual({ id: '1', ...dto })

        expect(mockUsersService.createUser).toHaveBeenCalledWith(dto)
    });

    it ('should return login tokens', async () => {
        mockJwtService.signAsync.mockClear()
        const dto = { email: 'email', password: 'password' }
        await expect(service.login(dto)).resolves.toEqual({ 
            accessToken: correctToken,
            refreshToken: correctToken,
        })

        expect(mockUsersService.validateUser).toHaveBeenCalledWith(dto.email, dto.password)
        expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2)
        expect(mockCache.set).toHaveBeenCalledWith('1', correctToken, expect.any(Number))
    });

    it ('should return refresh tokens', async () => {
        mockJwtService.signAsync.mockClear()
        await expect(service.refreshToken(correctToken)).resolves.toEqual({ 
            accessToken: correctToken,
            refreshToken: correctToken,
        })

        expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(correctToken, {secret: expect.any(String)})
        expect(mockCache.get).toHaveBeenCalledWith('1')
        expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2)
        expect(mockCache.set).toHaveBeenCalledWith('1', correctToken, expect.any(Number))
    });

    it ('should throw Token Error', async () => {
        await expect(service.refreshToken(incorrectToken)).rejects.toThrow('token error')

        expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(incorrectToken, {secret: expect.any(String)})
        expect(mockCache.get).toHaveBeenCalledWith('1')
    });

    it ('should call cache Delete', async () => {
        await expect(service.logout('1')).resolves.toBeUndefined()
        expect(mockCache.del).toHaveBeenCalledWith('1')
    })
});