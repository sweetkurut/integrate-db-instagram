import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstagramModule } from './instagram/instagram.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    InstagramModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres', // или другой тип базы данных
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'instagram',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
