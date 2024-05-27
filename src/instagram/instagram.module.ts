// src/instagram/instagram.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { InstagramService } from './instagram.service';
import { InstagramController } from './instagram.controller';
import { Instagram } from './entities/instagram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instagram]), HttpModule],
  providers: [InstagramService],
  controllers: [InstagramController],
})
export class InstagramModule {}
