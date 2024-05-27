import { Controller, Get, Query } from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Get('messages')
  async syncMessages(
    @Query('access_token') accessToken: string,
  ): Promise<void> {
    await this.instagramService.syncMessages(accessToken);
  }
}
