import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        entities: ["dist/**/*.entity{.ts,.js}"],
        // migrations: [/*...*/],
        // migrationsTableName: "custom_migration_table",
      }),
    }),
  ],
})
export class DatabaseModule {}