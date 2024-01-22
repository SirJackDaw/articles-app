import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    url: configService.get('POSTGRES_URI'),
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ['migrations/**'],
});